import type { FlowDefinition } from "../../../lib/flow/types";

/** AI Engineer roadmap → AI Agents. */
export const functionCalling: FlowDefinition = {
  id: "function-calling",
  title: "One function call, from schema to answer",
  actors: [
    { id: "user", label: "User", sublabel: "asks in words", kind: "client", col: 0, row: 0 },
    { id: "app", label: "Your app", sublabel: "runs functions", kind: "server", col: 1, row: 0 },
    { id: "model", label: "Model", sublabel: "LLM API", kind: "model", col: 2, row: 0 },
    { id: "weather", label: "Weather API", sublabel: "third party", kind: "external", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "ask",
      from: "user",
      to: "app",
      title: "Ask a question",
      payload: "Weather in Paris, in °C?",
      detail: "Plain language in. Nothing here says which function to call.",
    },
    {
      id: "define",
      from: "app",
      to: "model",
      title: "Send the question with a function schema",
      payload: "tools: [get_weather]",
      detail:
        "The schema gives a name, a description and JSON Schema parameters. The description is how the model decides when to use it.",
    },
    {
      id: "choose",
      from: "model",
      title: "Generate a call instead of prose",
      payload: "pick get_weather, fill args",
      detail:
        "The model still only generates tokens. Here those tokens form a structured call shaped by the schema. Strict mode makes the match exact.",
    },
    {
      id: "emit",
      from: "model",
      to: "app",
      title: "Return the call, not a result",
      payload: '{"city":"Paris","unit":"c"}',
      variant: "response",
      detail:
        "The response holds a call id, the function name and the arguments as JSON. The function has not run. The model cannot run it.",
    },
    {
      id: "validate",
      from: "app",
      title: "Parse and check the arguments",
      payload: "schema ok, user allowed",
      detail:
        "Arguments are model output, so treat them as untrusted input. Validate them and check the user may perform this action.",
    },
    {
      id: "call",
      from: "app",
      to: "weather",
      title: "Run the real function",
      payload: "GET /current?q=Paris",
      detail: "Your code makes the call with your credentials. The model never sees the API key.",
    },
    {
      id: "data",
      from: "weather",
      to: "app",
      title: "Get the data",
      payload: '{ temp: 18, sky: "cloudy" }',
      variant: "response",
      detail: "Raw data that the model will turn into an answer.",
    },
    {
      id: "result",
      from: "app",
      to: "model",
      title: "Send the result with the same call id",
      payload: "tool_result id=toolu_01…",
      detail:
        "The id pairs this result with the call that asked for it. That matters when the model asked for several calls at once.",
    },
    {
      id: "write",
      from: "model",
      title: "Write the answer from the result",
      payload: "18 °C, cloudy",
      detail: "The model now has ground truth in its context instead of a guess from training data.",
    },
    {
      id: "answer",
      from: "model",
      to: "app",
      title: "Return text",
      payload: '"18 °C and cloudy in Paris"',
      variant: "response",
      detail: "This time the response is ordinary text and the turn is over.",
    },
    {
      id: "reply",
      from: "app",
      to: "user",
      title: "Show the answer",
      payload: "18 °C and cloudy",
      variant: "response",
      detail: "Two model calls and one function call answered one question.",
    },
  ],
};
