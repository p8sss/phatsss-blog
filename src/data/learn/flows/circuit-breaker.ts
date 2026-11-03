import type { FlowDefinition } from "../../../lib/flow/types";

/** Backend roadmap → Building For Scale. */
export const circuitBreaker: FlowDefinition = {
  id: "circuit-breaker",
  title: "Closed, open, half-open, closed again",
  actors: [
    { id: "checkout", label: "Checkout", sublabel: "your service", kind: "server", col: 0, row: 0 },
    { id: "breaker", label: "Breaker", sublabel: "in-process", kind: "service", col: 1, row: 0 },
    { id: "payments", label: "Payments API", sublabel: "the dependency", kind: "external", col: 2, row: 0 },
    { id: "queue", label: "Retry queue", sublabel: "fallback", kind: "queue", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "call",
      from: "checkout",
      to: "breaker",
      title: "Call through the breaker",
      payload: "charge(order 41)",
      detail:
        "The breaker wraps every call to the payments API. It starts closed: calls pass straight through while it counts how they end.",
    },
    {
      id: "forward",
      from: "breaker",
      to: "payments",
      title: "Forward the call",
      payload: "POST /charges",
      detail: "Every call has a timeout. Without one, a slow dependency holds threads and connections forever.",
    },
    {
      id: "timeout",
      from: "payments",
      to: "breaker",
      title: "The dependency is struggling",
      payload: "timeout after 3 s",
      variant: "response",
      detail:
        "Payments is overloaded. Each slow call ties up a worker for the full timeout, and retries add even more load.",
    },
    {
      id: "count",
      from: "breaker",
      title: "Count the failures",
      payload: "6 of 10 failed in 10 s",
      detail:
        "The breaker tracks outcomes over a rolling window. A minimum call count stops one unlucky request from tripping it.",
    },
    {
      id: "trip",
      from: "breaker",
      title: "Trip open",
      payload: "CLOSED → OPEN",
      detail: "The failure rate passed the 50% threshold. For the next 30 seconds, no call reaches payments.",
    },
    {
      id: "call-open",
      from: "checkout",
      to: "breaker",
      title: "Another order arrives",
      payload: "charge(order 42)",
      detail: "The checkout code does not know or care about the state. It calls the same way.",
    },
    {
      id: "fallback",
      from: "breaker",
      to: "queue",
      title: "Fall back",
      payload: "enqueue charge(order 42)",
      detail:
        "No network call is made. The breaker hands the call to its fallback, which saves the order and queues the charge for later.",
    },
    {
      id: "fail-fast",
      from: "breaker",
      to: "checkout",
      title: "Fail fast",
      payload: "circuit open: charge queued",
      variant: "response",
      detail:
        "The answer is instant, so callers stop piling up and payments gets room to recover. The user sees a processing message instead of an error page.",
    },
    {
      id: "wait",
      from: "breaker",
      title: "Wait out the reset timeout",
      payload: "after 30 s: OPEN → HALF-OPEN",
      detail: "Half-open means: let a trial call through to test the water.",
    },
    {
      id: "call-half",
      from: "checkout",
      to: "breaker",
      title: "The next order",
      payload: "charge(order 43)",
      detail: "This call becomes the trial.",
    },
    {
      id: "probe",
      from: "breaker",
      to: "payments",
      title: "Let one trial call through",
      payload: "POST /charges",
      detail:
        "Only a trial goes through, not the whole backlog. A recovering service can be knocked over again by a sudden flood.",
    },
    {
      id: "probe-ok",
      from: "payments",
      to: "breaker",
      title: "The trial succeeds",
      payload: "201 Created",
      variant: "response",
      detail: "Had it failed, the breaker would go straight back to open and restart the timer.",
    },
    {
      id: "close",
      from: "breaker",
      title: "Close the circuit",
      payload: "HALF-OPEN → CLOSED",
      detail: "The failure counts reset and normal traffic resumes. A worker can now drain the retry queue.",
    },
    {
      id: "done",
      from: "breaker",
      to: "checkout",
      title: "Return the result",
      payload: "charge ok",
      variant: "response",
      detail: "Every state change is worth an event and a metric, so on-call engineers see the breaker trip.",
    },
  ],
};
