import type { Roadmap } from "./types";

/**
 * Section names and order follow roadmap.sh/ai-engineer (checked 2026-11-02);
 * topics and write-ups are this site's own.
 */
export const aiRoadmap: Roadmap = {
  id: "ai",
  title: "AI Engineer",
  href: "https://roadmap.sh/ai-engineer",
  sections: [
    {
      id: "how-llms-work",
      title: "How LLMs Work",
      topics: [
        {
          id: "llm-next-token",
          title: "From prompt to next token",
          question: "What happens inside one chat completion call, from tokens to sampling?",
          format: "flow",
          to: "/learn/ai/llm-next-token",
        },
      ],
    },
    {
      id: "prompt-engineering",
      title: "Prompt Engineering",
      topics: [
        {
          id: "prompting-techniques",
          title: "Zero-shot, few-shot and chain of thought",
          question: "Which prompting technique fits which task?",
          format: "compare",
          to: "/learn/ai/prompting-techniques",
        },
      ],
    },
    {
      id: "context-engineering",
      title: "Context Engineering",
      topics: [
        {
          id: "context-window",
          title: "What fills the context window",
          question: "How do instructions, history, retrieved text and tool results compete for space?",
          format: "flow",
          to: "/learn/ai/context-window",
        },
      ],
    },
    {
      id: "choosing-the-right-model",
      title: "Choosing the Right Model",
      topics: [
        {
          id: "open-vs-closed-models",
          title: "Open-weight vs closed models",
          question: "Hosted APIs or weights you run: what changes in cost, privacy and control?",
          format: "compare",
          to: "/learn/ai/open-vs-closed-models",
        },
      ],
    },
    {
      id: "ollama",
      title: "Ollama",
      topics: [
        {
          id: "ollama-local",
          title: "Running a model locally with Ollama",
          question: "What happens between ollama run and a streamed answer on your laptop?",
          format: "flow",
          to: "/learn/ai/ollama-local",
        },
      ],
    },
    {
      id: "what-are-embeddings",
      title: "What are Embeddings",
      topics: [
        {
          id: "embeddings-similarity",
          title: "Text to vector to similarity",
          question: "How does a number end up meaning \"these two sentences say the same thing\"?",
          format: "flow",
          to: "/learn/ai/embeddings-similarity",
        },
      ],
    },
    {
      id: "vector-databases",
      title: "Vector Databases",
      topics: [
        {
          id: "hnsw-search",
          title: "A vector search, step by step",
          question: "How does an HNSW index find near neighbours without scanning everything?",
          format: "flow",
          to: "/learn/ai/hnsw-search",
        },
        {
          id: "vector-databases-compare",
          title: "pgvector vs Qdrant vs Pinecone",
          question: "Which vector store fits the job?",
          format: "compare",
          to: "/learn/ai/vector-databases-compare",
        },
      ],
    },
    {
      id: "what-are-rags",
      title: "What are RAGs?",
      topics: [
        {
          id: "rag-request",
          title: "A RAG request from question to cited answer",
          question: "Where do chunking, retrieval, reranking and generation each happen?",
          format: "flow",
          to: "/learn/ai/rag-request",
        },
        {
          id: "rag-vs-fine-tuning",
          title: "RAG vs fine-tuning",
          question: "When do you retrieve, and when do you train?",
          format: "compare",
          to: "/learn/ai/rag-vs-fine-tuning",
        },
      ],
    },
    {
      id: "ai-agents",
      title: "AI Agents",
      topics: [
        {
          id: "agent-loop",
          title: "The agent loop",
          question: "How does a model reason, call a tool, read the result and decide to stop?",
          format: "flow",
          to: "/learn/ai/agent-loop",
        },
        {
          id: "function-calling",
          title: "How function calling works",
          question: "What does the model actually emit, and who runs the function?",
          format: "flow",
          to: "/learn/ai/function-calling",
        },
      ],
    },
    {
      id: "mcp",
      title: "Model Context Protocol (MCP)",
      topics: [
        {
          id: "mcp-tool-call",
          title: "How an MCP server gets its tools into a chat",
          question: "Host, client and server: what happens from initialize to a tool call?",
          format: "flow",
          to: "/learn/ai/mcp-tool-call",
        },
      ],
    },
    {
      id: "ai-safety",
      title: "AI Safety and Ethics",
      topics: [
        {
          id: "prompt-injection",
          title: "A prompt injection, and the guardrails that catch it",
          question: "How does untrusted text hijack an agent, and where do you stop it?",
          format: "flow",
          to: "/learn/ai/prompt-injection",
        },
      ],
    },
    {
      id: "llm-observability",
      title: "LLM Observability",
      topics: [
        {
          id: "agent-tracing",
          title: "Tracing one agent run",
          question: "What do spans, token counts and cost look like for a single request?",
          format: "flow",
          to: "/learn/ai/agent-tracing",
        },
      ],
    },
    {
      id: "llm-evaluations",
      title: "LLM Evaluations",
      topics: [
        {
          id: "eval-gate",
          title: "How an eval suite gates a prompt change",
          question: "Dataset, checks, model-as-judge, CI gate: what runs when?",
          format: "flow",
          to: "/learn/ai/eval-gate",
        },
      ],
    },
    {
      id: "development-tools",
      title: "Development Tools",
      topics: [
        {
          id: "llm-streaming",
          title: "Streaming a response",
          question: "How do tokens reach the browser before the answer is finished?",
          format: "flow",
          to: "/learn/ai/llm-streaming",
        },
        {
          id: "prompt-caching",
          title: "How prompt caching cuts cost",
          question: "What gets cached, and why does the order of the prompt matter?",
          format: "flow",
          to: "/learn/ai/prompt-caching",
        },
      ],
    },
  ],
};
