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
  ],
};
