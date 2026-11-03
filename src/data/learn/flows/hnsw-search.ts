import type { FlowDefinition } from "../../../lib/flow/types";

/** AI Engineer roadmap → Vector Databases. */
export const hnswSearch: FlowDefinition = {
  id: "hnsw-search",
  title: "An HNSW query in pgvector, layer by layer",
  actors: [
    { id: "app", label: "Your app", sublabel: "search API", kind: "client", col: 0, row: 0 },
    { id: "db", label: "Postgres", sublabel: "query executor", kind: "server", col: 1, row: 0 },
    { id: "upper", label: "Upper layers", sublabel: "few nodes, far", kind: "service", col: 2, row: 0 },
    { id: "base", label: "Layer 0", sublabel: "every vector", kind: "database", col: 2, row: 1 },
    { id: "table", label: "Table", sublabel: "rows + metadata", kind: "database", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "query",
      from: "app",
      to: "db",
      title: "Ask for the 5 nearest",
      payload: "ORDER BY emb <=> $1 LIMIT 5",
      detail:
        "An ORDER BY on a distance operator with a LIMIT is what lets the planner use the HNSW index. Without the index, Postgres would compare against every row.",
    },
    {
      id: "enter",
      from: "db",
      to: "upper",
      title: "Enter at the top layer",
      payload: "start at the entry point",
      detail:
        "HNSW stacks graphs. Each vector gets a random top layer when it is inserted, so higher layers hold exponentially fewer nodes.",
    },
    {
      id: "greedy",
      from: "upper",
      title: "Hop greedily",
      payload: "move to a closer neighbour",
      detail:
        "Compare the query with the current node's neighbours and move to the closest. Stop when no neighbour is closer. Sparse layers have long links, so each hop covers a lot of ground.",
    },
    {
      id: "drop",
      from: "upper",
      title: "Drop a layer and repeat",
      payload: "layer 2 → layer 1",
      detail: "The closest node found becomes the starting point one layer down, where links are shorter and denser.",
    },
    {
      id: "descend",
      from: "upper",
      to: "base",
      title: "Arrive at layer 0",
      payload: "start near node 4471",
      detail: "Layer 0 holds every vector. The search starts already close to the answer instead of at a random spot.",
    },
    {
      id: "beam",
      from: "base",
      title: "Search wider with ef_search",
      payload: "keep the best 40 candidates",
      detail:
        "Layer 0 keeps a list of the best candidates found so far and keeps expanding the nearest unexplored one. It stops when every unexplored node is farther than the worst in the list.",
    },
    {
      id: "skip",
      from: "base",
      title: "Skip almost everything",
      payload: "visited ≪ total vectors",
      detail:
        "Only the neighbours of promising nodes get a distance check. The price is that a true nearest neighbour can be missed, so results are approximate.",
    },
    {
      id: "candidates",
      from: "base",
      to: "db",
      title: "Return candidates, nearest first",
      payload: "40 ids with distances",
      variant: "response",
      detail: "By default pgvector's index scan returns at most ef_search rows, not just the 5 that were asked for.",
    },
    {
      id: "fetch",
      from: "db",
      to: "table",
      title: "Fetch the rows",
      payload: "heap fetch ids 17, 803, …",
      detail: "The index holds vectors and row pointers. Text and metadata come from the table itself.",
    },
    {
      id: "rows",
      from: "table",
      to: "db",
      title: "Rows come back",
      payload: "{ id, text, tenant_id }",
      variant: "response",
      detail: "Postgres now has full rows in distance order.",
    },
    {
      id: "filter",
      from: "db",
      title: "Filter, then limit",
      payload: "WHERE tenant_id = 7 → LIMIT 5",
      detail:
        "WHERE clauses run after the index scan. A selective filter can leave fewer than 5 rows, unless iterative index scans are turned on.",
    },
    {
      id: "respond",
      from: "db",
      to: "app",
      title: "Return the results",
      payload: "5 rows, approximate top 5",
      variant: "response",
      detail:
        "Raise ef_search for better recall at the cost of speed. Build-time settings m and ef_construction trade build time and memory for graph quality.",
    },
  ],
};
