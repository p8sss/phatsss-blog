import type { FlowDefinition } from "../../../lib/flow/types";

/** Frontend roadmap → JavaScript. Traces: log A, setTimeout(log B), Promise.then(log C), log D. */
export const eventLoop: FlowDefinition = {
  id: "event-loop",
  title: "Why A, D, C, B: one script through the event loop",
  actors: [
    { id: "stack", label: "Call stack", sublabel: "one at a time", kind: "service", col: 0, row: 0 },
    { id: "apis", label: "Web APIs", sublabel: "timers and fetch", kind: "external", col: 1, row: 0 },
    { id: "micro", label: "Microtasks", sublabel: "promise jobs", kind: "queue", col: 0, row: 1 },
    { id: "tasks", label: "Task queue", sublabel: "timers, events", kind: "queue", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "a",
      from: "stack",
      title: "Run the script, log A",
      payload: "console.log('A')",
      detail: "The whole script is itself a task. It runs to completion on the call stack.",
    },
    {
      id: "timeout",
      from: "stack",
      to: "apis",
      title: "Hand off the timer",
      payload: "setTimeout(cb, 0)",
      detail:
        "setTimeout is not part of JavaScript itself. The browser keeps the timer outside the JS thread and the script moves on at once.",
    },
    {
      id: "queue-task",
      from: "apis",
      to: "tasks",
      title: "Timer fires, queue a task",
      payload: "() => log('B')",
      detail:
        "A delay of 0 means as soon as possible, not now. The callback waits in the task queue until the stack is free.",
    },
    {
      id: "queue-micro",
      from: "stack",
      to: "micro",
      title: "Queue the promise callback",
      payload: "then(() => log('C'))",
      detail:
        "The promise is already resolved, so its callback goes straight into the microtask queue. It still waits for the current script to finish.",
    },
    {
      id: "d",
      from: "stack",
      title: "Finish the script, log D",
      payload: "console.log('D')",
      detail: "The last line runs and the stack empties. Output so far: A, D.",
    },
    {
      id: "drain",
      from: "micro",
      to: "stack",
      title: "Drain microtasks first",
      payload: "() => log('C')",
      variant: "response",
      detail:
        "After every task the event loop runs all microtasks, including any queued by other microtasks, before it does anything else.",
    },
    {
      id: "c",
      from: "stack",
      title: "Log C",
      payload: "console.log('C')",
      detail: "Output so far: A, D, C. The browser may now render a frame.",
    },
    {
      id: "next-task",
      from: "tasks",
      to: "stack",
      title: "Take the next task",
      payload: "() => log('B')",
      variant: "response",
      detail: "Only now, with the stack and the microtask queue empty, does the timer callback run.",
    },
    {
      id: "b",
      from: "stack",
      title: "Log B",
      payload: "console.log('B')",
      detail: "Final output: A, D, C, B. Promise callbacks beat timers, even zero-delay ones.",
    },
  ],
};
