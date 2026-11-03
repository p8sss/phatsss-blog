import type { FlowDefinition } from "../../../lib/flow/types";

/** AI Engineer roadmap → Development Tools. */
export const llmStreaming: FlowDefinition = {
  id: "llm-streaming",
  title: "Streaming tokens from the model to the browser",
  actors: [
    { id: "browser", label: "Browser", sublabel: "chat UI", kind: "client", col: 0, row: 0 },
    { id: "server", label: "Your server", sublabel: "holds the key", kind: "server", col: 1, row: 0 },
    { id: "model", label: "Model API", sublabel: "generates", kind: "model", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "post",
      from: "browser",
      to: "server",
      title: "Send the question",
      payload: "POST /api/chat",
      detail:
        "The browser uses fetch, not EventSource. EventSource can only make GET requests without a body or custom headers.",
    },
    {
      id: "stream-on",
      from: "server",
      to: "model",
      title: "Ask the model to stream",
      payload: "POST /v1/messages stream:true",
      detail: "The API key stays on your server. The response will be server-sent events instead of one JSON body.",
    },
    {
      id: "prefill",
      from: "model",
      title: "Read the whole prompt first",
      payload: "process 1,200 prompt tokens",
      detail:
        "The model processes the prompt before it can produce the first token. With thinking on, its reasoning also comes before the first text. This wait is the time to first token.",
    },
    {
      id: "start",
      from: "model",
      to: "server",
      title: "Open the event stream",
      payload: "event: message_start",
      variant: "response",
      detail: "Headers arrive with Content-Type text/event-stream. The first event carries the message id and model.",
    },
    {
      id: "delta",
      from: "model",
      to: "server",
      title: "Send the first token",
      payload: 'text_delta: "The"',
      variant: "response",
      detail: "Each content_block_delta event carries a small piece of text, often a word or part of one.",
    },
    {
      id: "forward",
      from: "server",
      to: "browser",
      title: "Forward it right away",
      payload: "chunk: The",
      variant: "response",
      detail:
        "Your server writes each piece to its own response without buffering. Proxies and compression in between must not buffer either.",
    },
    {
      id: "render",
      from: "browser",
      title: "Render as it arrives",
      payload: "reader.read() → append",
      detail:
        "The browser reads the response body as a stream and appends text. The user starts reading while the model is still writing.",
    },
    {
      id: "more",
      from: "model",
      to: "server",
      title: "Keep streaming",
      payload: "text_delta × 300",
      variant: "response",
      detail: "Generation happens one token at a time, so the total time is the same. Only the first visible word arrives sooner.",
    },
    {
      id: "delta-end",
      from: "model",
      to: "server",
      title: "Report why it stopped",
      payload: 'stop_reason: "end_turn"',
      variant: "response",
      detail: "A message_delta event carries the stop reason and the output token count, which is cumulative.",
    },
    {
      id: "stop",
      from: "model",
      to: "server",
      title: "End the stream",
      payload: "event: message_stop",
      variant: "response",
      detail: "The upstream connection closes. Errors can also arrive mid-stream as an error event, after a 200 status.",
    },
    {
      id: "close",
      from: "server",
      to: "browser",
      title: "Close the response",
      payload: "end of body",
      variant: "response",
      detail: "The reader returns done, and the UI marks the message complete.",
    },
  ],
};
