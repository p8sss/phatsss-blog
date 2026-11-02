import type { Roadmap } from "./types";

/** Section order follows roadmap.sh/backend; topics and write-ups are this site's own. */
export const backendRoadmap: Roadmap = {
  id: "backend",
  title: "Backend",
  href: "https://roadmap.sh/backend",
  sections: [
    {
      id: "internet",
      title: "Internet",
      topics: [
        {
          id: "open-a-url",
          title: "Opening a URL",
          question: "What happens between typing a URL and seeing the page?",
          format: "flow",
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
        },
      ],
    },
    {
      id: "design-principles",
      title: "Design and Development Principles",
      topics: [
        {
          id: "design-principles",
          title: "GoF, DDD, TDD, CQRS",
          question: "A list of ideas rather than a process, so roadmap.sh covers it better.",
          format: "reading",
        },
      ],
    },
  ],
};
