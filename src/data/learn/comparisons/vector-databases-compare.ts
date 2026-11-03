import type { Comparison } from "../../../lib/compare/types";

/** AI Engineer roadmap → Vector Databases. */
export const vectorDatabasesCompare: Comparison = {
  id: "vector-databases-compare",
  title: "pgvector vs Qdrant vs Pinecone",
  options: [
    { id: "pgvector", name: "pgvector", summary: "A Postgres extension that adds vector types, distance operators and indexes." },
    { id: "qdrant", name: "Qdrant", summary: "An open-source vector search engine written in Rust." },
    { id: "pinecone", name: "Pinecone", summary: "A fully managed vector database offered as a cloud service." },
  ],
  rows: [
    {
      criterion: "Where it runs",
      cells: {
        pgvector: "Anywhere Postgres runs, including most managed Postgres services.",
        qdrant: "Self-hosted from one Docker container up to a cluster, or Qdrant Cloud.",
        pinecone: "Pinecone's cloud, or Bring Your Own Cloud in your own account. No local version: Pinecone Local reached end of life in October 2026.",
      },
    },
    {
      criterion: "Indexes",
      cells: {
        pgvector: "HNSW and IVFFlat. Without an index, an exact scan of every row.",
        qdrant: "HNSW per segment, plus payload indexes for filtering.",
        pinecone: "Managed for you. There are no index parameters to tune.",
      },
    },
    {
      criterion: "Filtering",
      cells: {
        pgvector: "Plain SQL WHERE, applied after the index scan. Iterative index scans stop selective filters from returning too few rows.",
        qdrant: "Filters are checked during the graph search, not after it. Create payload indexes before loading data so the graph is built filter-aware.",
        pinecone: "Metadata filters in the query. Namespaces split tenants inside one index.",
      },
    },
    {
      criterion: "Keyword and hybrid search",
      cells: {
        pgvector: "Combine with Postgres full-text search and the sparsevec type, then merge results in SQL.",
        qdrant: "Sparse vectors and hybrid queries with built-in score fusion.",
        pinecone: "Sparse vectors, full-text and hybrid search, plus hosted embedding and reranking models.",
      },
    },
    {
      criterion: "Memory savings",
      cells: {
        pgvector: "halfvec stores half-precision floats. bit vectors for binary quantization.",
        qdrant: "Built-in scalar, binary and product quantization.",
        pinecone: "Handled by the service.",
      },
    },
    {
      criterion: "Consistency with your data",
      cells: {
        pgvector: "Vectors live in the same rows and transactions as the rest of your data. Joins just work.",
        qdrant: "A separate store. Your app keeps it in sync with the source database.",
        pinecone: "A separate store. Your app keeps it in sync with the source database.",
      },
    },
    {
      criterion: "Scaling",
      cells: {
        pgvector: "As far as one Postgres primary and its read replicas go. HNSW builds are much faster when the graph fits in maintenance_work_mem.",
        qdrant: "Sharding and replication across nodes.",
        pinecone: "Serverless scaling. Dedicated read nodes for sustained high query volume.",
      },
    },
    {
      criterion: "Cost model",
      cells: {
        pgvector: "Free extension. You pay for the Postgres you already run.",
        qdrant: "Free to self-host. Qdrant Cloud has a free tier and paid clusters.",
        pinecone: "Free Starter and flat-fee Builder plans, then usage-based: read units, write units, storage and egress.",
      },
    },
    {
      criterion: "Licence",
      cells: {
        pgvector: "PostgreSQL License.",
        qdrant: "Apache 2.0.",
        pinecone: "Proprietary service.",
      },
    },
  ],
  verdicts: [
    {
      option: "pgvector",
      pickWhen: [
        "You already run Postgres and have up to a few million vectors.",
        "Vectors must stay consistent with relational data, or queries join them with other tables.",
        "You want one database to back up, secure and operate.",
      ],
    },
    {
      option: "qdrant",
      pickWhen: [
        "Search is filter-heavy, such as per-tenant or per-category queries.",
        "You want an open-source engine you can self-host, with a managed option later.",
        "Memory cost matters and quantization will help.",
      ],
    },
    {
      option: "pinecone",
      pickWhen: [
        "You want no database operations at all.",
        "Traffic is spiky or unpredictable and usage-based pricing fits.",
        "You want hosted embedding, reranking and hybrid search behind one API.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    { label: "pgvector README", href: "https://github.com/pgvector/pgvector" },
    { label: "Qdrant documentation", href: "https://qdrant.tech/documentation/" },
    { label: "Pinecone documentation", href: "https://docs.pinecone.io/guides/get-started/overview" },
    { label: "Pinecone: understanding cost", href: "https://docs.pinecone.io/guides/manage-cost/understanding-cost" },
  ],
};
