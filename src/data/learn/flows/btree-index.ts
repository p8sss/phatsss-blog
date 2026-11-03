import type { FlowDefinition } from "../../../lib/flow/types";

/** Backend roadmap → Relational Databases. */
export const btreeIndex: FlowDefinition = {
  id: "btree-index",
  title: "A B-tree lookup, then an insert",
  actors: [
    { id: "app", label: "App server", sublabel: "your API", kind: "server", col: 0, row: 0 },
    { id: "engine", label: "Postgres", sublabel: "plan + execute", kind: "service", col: 1, row: 0 },
    { id: "index", label: "B-tree index", sublabel: "users_email_idx", kind: "database", col: 2, row: 0 },
    { id: "heap", label: "Table heap", sublabel: "users rows", kind: "database", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "query",
      from: "app",
      to: "engine",
      title: "Look up one user",
      payload: "WHERE email = 'ana@example.com'",
      detail: "The users table has millions of rows spread over many 8 kB pages. Only one row matches.",
    },
    {
      id: "plan",
      from: "engine",
      title: "Choose an index scan",
      payload: "Index Scan using users_email_idx",
      detail:
        "The planner estimates the cost of each option from table statistics. Reading every page would be far slower than walking the index for one row.",
    },
    {
      id: "root",
      from: "engine",
      to: "index",
      title: "Start at the root page",
      payload: "search key 'ana@example.com'",
      detail:
        "The root holds sorted separator keys, each with a pointer to a child page. A binary search over those keys picks the child whose range contains the search key.",
    },
    {
      id: "descend",
      from: "index",
      title: "Descend one level per page",
      payload: "root → internal → leaf",
      detail:
        "Each page holds hundreds of keys, so every level narrows the search a hundredfold or more. Even a very large table usually needs only three or four levels.",
    },
    {
      id: "leaf",
      from: "index",
      title: "Find the key in a leaf",
      payload: "'ana@example.com' → (412,7)",
      detail:
        "Leaf pages hold every indexed value in sorted order. Each entry points to a row by its tuple id: heap page 412, item 7.",
    },
    {
      id: "tid",
      from: "index",
      to: "engine",
      title: "Return the row pointer",
      payload: "TID (412,7)",
      variant: "response",
      detail: "The index gives back where the row lives, not the row itself.",
    },
    {
      id: "fetch",
      from: "engine",
      to: "heap",
      title: "Read one heap page",
      payload: "read page 412, item 7",
      detail: "The engine jumps straight to the one page that holds the row. No other table page is touched.",
    },
    {
      id: "row",
      from: "heap",
      to: "engine",
      title: "Check the row is visible",
      payload: "{ id: 9, name: 'Ana' }",
      variant: "response",
      detail:
        "Index entries carry no transaction information. The heap row does, so the engine checks this transaction is allowed to see it.",
    },
    {
      id: "result",
      from: "engine",
      to: "app",
      title: "Answer in a few page reads",
      payload: "1 row",
      variant: "response",
      detail:
        "One page per tree level plus one heap page. A sequential scan would have read every page of the table to find the same row.",
    },
    {
      id: "insert",
      from: "app",
      to: "engine",
      title: "Insert a new user",
      payload: "INSERT INTO users …",
      detail: "Now the other side of the trade. Every write must keep every index on the table in order.",
    },
    {
      id: "append",
      from: "engine",
      to: "heap",
      title: "Store the row",
      payload: "new row at (518,3)",
      detail: "The heap is not sorted. The new row goes wherever there is free space.",
    },
    {
      id: "insert-key",
      from: "engine",
      to: "index",
      title: "Insert the key in sorted order",
      payload: "'bo@example.com' → (518,3)",
      detail:
        "The engine descends the tree again to find the leaf where the new key belongs. Each extra index on the table repeats this work on every insert.",
    },
    {
      id: "split",
      from: "index",
      title: "Split a full leaf",
      payload: "leaf full → split, add downlink",
      detail:
        "If the leaf has no room, some of its entries move to a new page and the parent gets a new separator key. When a split reaches the root, the tree grows one level taller.",
    },
  ],
};
