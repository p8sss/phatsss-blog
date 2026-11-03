import type { FlowDefinition } from "../../../lib/flow/types";

/** AI Engineer roadmap → LLM Observability. */
export const agentTracing: FlowDefinition = {
  id: "agent-tracing",
  title: "One agent run as an OpenTelemetry trace",
  actors: [
    { id: "user", label: "User", sublabel: "one request", kind: "client", col: 0, row: 0 },
    { id: "agent", label: "Agent", sublabel: "instrumented", kind: "server", col: 1, row: 0 },
    { id: "model", label: "Model", sublabel: "LLM API", kind: "model", col: 2, row: 0 },
    { id: "tool", label: "Docs search", sublabel: "a tool", kind: "service", col: 1, row: 1 },
    { id: "store", label: "Trace store", sublabel: "via OTLP", kind: "database", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "ask",
      from: "user",
      to: "agent",
      title: "A request arrives",
      payload: "POST /ask",
      detail: "Everything that happens next will share one trace id, so it can be viewed as a single tree.",
    },
    {
      id: "root",
      from: "agent",
      title: "Open the root span",
      payload: "span: invoke_agent support",
      detail:
        "The root span covers the whole run. Its duration is what the user waited. Every later span is its child.",
    },
    {
      id: "chat1",
      from: "agent",
      to: "model",
      title: "First model call, as a child span",
      payload: "span: chat claude-opus-5-5",
      detail:
        "Inference spans are named after the operation and the model. They record the provider, the requested model and settings like max tokens.",
    },
    {
      id: "usage1",
      from: "model",
      to: "agent",
      title: "Record usage from the response",
      payload: "in 2,000 · out 100 tokens",
      variant: "response",
      detail:
        "Token counts come from the API response and go on the span as gen_ai.usage.input_tokens and output_tokens. The finish reason says a tool was requested.",
    },
    {
      id: "tool-span",
      from: "agent",
      to: "tool",
      title: "Tool call, as a child span",
      payload: "span: execute_tool search_docs",
      detail: "Tool spans show where time goes outside the model. A slow search is a slow agent.",
    },
    {
      id: "tool-done",
      from: "tool",
      to: "agent",
      title: "Tool returns",
      payload: "3 docs · 180 ms",
      variant: "response",
      detail: "If the tool fails, the span gets an error status, so failed runs are easy to find.",
    },
    {
      id: "chat2",
      from: "agent",
      to: "model",
      title: "Second model call",
      payload: "span: chat, history + 3 docs",
      detail: "The prompt now carries the history and the retrieved docs, so this call has more input tokens.",
    },
    {
      id: "usage2",
      from: "model",
      to: "agent",
      title: "Record usage again",
      payload: "in 2,600 · out 300 tokens",
      variant: "response",
      detail: "Output tokens usually cost several times more than input tokens, so a long answer can dominate the bill.",
    },
    {
      id: "cost",
      from: "agent",
      title: "Add up tokens and cost",
      payload: "4,600 in · 400 out ≈ $0.03",
      detail:
        "The conventions define token counts but no cost attribute. Cost is tokens times your price table, here $4 in and $20 out per million tokens.",
    },
    {
      id: "reply",
      from: "agent",
      to: "user",
      title: "Answer and close the root span",
      payload: "200 OK · 2.9 s",
      variant: "response",
      detail: "The root span ends here. Two model calls and one tool call make up its 2.9 seconds.",
    },
    {
      id: "export",
      from: "agent",
      to: "store",
      title: "Export the spans in the background",
      payload: "OTLP: 4 spans, 1 trace",
      detail:
        "A batch processor sends finished spans after the response, so tracing adds almost no latency to the request.",
    },
  ],
};
