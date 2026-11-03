import type { Roadmap } from "./types";

/**
 * Section names and order follow roadmap.sh/backend (checked 2026-11-02);
 * topics and write-ups are this site's own.
 */
export const backendRoadmap: Roadmap = {
  id: "backend",
  title: "Backend",
  href: "https://roadmap.sh/backend",
  sections: [
    {
      id: "introduction",
      title: "Introduction",
      topics: [
        {
          id: "open-a-url",
          title: "Opening a URL",
          question: "What happens between typing a URL and seeing the page?",
          format: "flow",
          to: "/learn/backend/open-a-url",
        },
      ],
    },
    {
      id: "relational-databases",
      title: "Relational Databases",
      topics: [
        {
          id: "btree-index",
          title: "How a B-tree index answers a query",
          question: "Why does an index turn a full table scan into a few page reads?",
          format: "flow",
          to: "/learn/backend/btree-index",
        },
      ],
    },
    {
      id: "apis",
      title: "Learn about APIs",
      topics: [
        {
          id: "jwt-authentication",
          title: "JWT authentication",
          question: "How does a server trust a request without looking up a session?",
          format: "flow",
          to: "/learn/backend/jwt-authentication",
        },
        {
          id: "rest-graphql-grpc",
          title: "REST vs GraphQL vs gRPC",
          question: "Which API style fits which client and team?",
          format: "compare",
          to: "/learn/backend/rest-graphql-grpc",
        },
        {
          id: "http-caching-etag",
          title: "HTTP caching with ETag",
          question: "How does a server say \"nothing changed\" without sending the body again?",
          format: "flow",
          to: "/learn/backend/http-caching-etag",
        },
      ],
    },
    {
      id: "caching",
      title: "Caching",
      topics: [
        {
          id: "cache-aside",
          title: "Cache-aside with Redis",
          question: "What happens on a cache hit, a miss, and a write?",
          format: "flow",
          to: "/learn/backend/cache-aside",
        },
      ],
    },
    {
      id: "more-about-databases",
      title: "More about Databases",
      topics: [
        {
          id: "n-plus-one",
          title: "The N+1 query problem",
          question: "Why does one page load fire a hundred queries, and how do you collapse them?",
          format: "flow",
          to: "/learn/backend/n-plus-one",
        },
      ],
    },
    {
      id: "message-brokers",
      title: "Message Brokers",
      topics: [
        {
          id: "rabbitmq-vs-kafka",
          title: "RabbitMQ vs Kafka",
          question: "Queue or log: which fits the job?",
          format: "compare",
          to: "/learn/backend/rabbitmq-vs-kafka",
        },
      ],
    },
    {
      id: "search-engines",
      title: "Search Engines",
      topics: [
        {
          id: "elasticsearch-query",
          title: "How Elasticsearch answers a search",
          question: "How does a full-text query fan out across shards and come back ranked?",
          format: "flow",
          to: "/learn/backend/elasticsearch-query",
        },
      ],
    },
    {
      id: "architectural-patterns",
      title: "Architectural Patterns",
      topics: [
        {
          id: "architectural-patterns",
          title: "Monolith, SOA, microservices",
          question: "A catalogue of styles rather than one process, so roadmap.sh covers it better.",
          format: "reading",
        },
      ],
    },
    {
      id: "real-time-data",
      title: "Real-Time Data",
      topics: [
        {
          id: "websocket-lifecycle",
          title: "A WebSocket from upgrade to message",
          question: "How does an HTTP request turn into a two-way connection?",
          format: "flow",
          to: "/learn/backend/websocket-lifecycle",
        },
        {
          id: "websockets-sse-polling",
          title: "WebSockets vs SSE vs long polling",
          question: "Which real-time transport fits the job?",
          format: "compare",
          to: "/learn/backend/websockets-sse-polling",
        },
      ],
    },
    {
      id: "scaling-databases",
      title: "Scaling Databases",
      topics: [
        {
          id: "replication-failover",
          title: "Replication and failover",
          question: "How does a replica keep up, and what happens when the primary dies?",
          format: "flow",
          to: "/learn/backend/replication-failover",
        },
      ],
    },
    {
      id: "building-for-scale",
      title: "Building For Scale",
      topics: [
        {
          id: "circuit-breaker",
          title: "The circuit breaker",
          question: "How does a service stop hammering a dependency that is already down?",
          format: "flow",
          to: "/learn/backend/circuit-breaker",
        },
      ],
    },
  ],
};
