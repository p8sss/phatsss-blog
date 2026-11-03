import type { FlowDefinition } from "../../../lib/flow/types";

/** DevOps roadmap → Serverless. */
export const lambdaColdStart: FlowDefinition = {
  id: "lambda-cold-start",
  title: "A Lambda cold start, then a warm one",
  actors: [
    { id: "caller", label: "Caller", sublabel: "API or SDK", kind: "client", col: 0, row: 0 },
    { id: "lambda", label: "Lambda", sublabel: "invoke service", kind: "service", col: 1, row: 0 },
    { id: "env", label: "Environment", sublabel: "Firecracker VM", kind: "server", col: 2, row: 0 },
    { id: "code", label: "Code store", sublabel: "zip or image", kind: "external", col: 1, row: 1 },
    { id: "db", label: "Database", sublabel: "PostgreSQL", kind: "database", col: 2, row: 1 },
  ],
  steps: [
    {
      id: "invoke",
      from: "caller",
      to: "lambda",
      title: "Invoke the function",
      payload: "Invoke orders-api",
      detail:
        "A request arrives through the Invoke API, perhaps from API Gateway. Lambda looks for an idle execution environment for this function version.",
    },
    {
      id: "no-warm",
      from: "lambda",
      title: "Find no warm environment",
      payload: "idle environments: 0",
      detail:
        "By default each environment handles one request at a time. After a deploy, a quiet spell or a traffic spike, none may be free, so Lambda must build a new one. That is the cold start.",
    },
    {
      id: "create",
      from: "lambda",
      to: "env",
      title: "Start an execution environment",
      payload: "microVM, 512 MB",
      detail:
        "Lambda starts an isolated microVM with the memory you configured. CPU is allocated in proportion to that memory, so a bigger setting also speeds up Init.",
    },
    {
      id: "code",
      from: "code",
      to: "env",
      title: "Load the code",
      payload: "orders-api.zip + layers",
      detail: "Your deployment package or container image is loaded into the environment. Larger packages take longer.",
    },
    {
      id: "runtime-init",
      from: "env",
      title: "Init: extensions and runtime",
      payload: "start extensions, node",
      detail:
        "Lambda starts any extensions, then boots the language runtime. Each one is a process inside the same environment.",
    },
    {
      id: "function-init",
      from: "env",
      title: "Init: your static code",
      payload: "import … ; new Client()",
      detail:
        "Code outside the handler runs once: imports, SDK clients, config. For on-demand functions the whole Init phase has a 10-second limit.",
    },
    {
      id: "connect",
      from: "env",
      to: "db",
      title: "Open a database connection",
      payload: "connect orders-db:5432",
      detail: "Connecting here, outside the handler, means every later warm request can reuse the connection.",
    },
    {
      id: "connected",
      from: "db",
      to: "env",
      title: "Connection ready",
      payload: "ReadyForQuery",
      variant: "response",
      detail: "The connection now lives in the environment's memory, alongside the clients your code created.",
    },
    {
      id: "next",
      from: "env",
      to: "lambda",
      title: "Ask for work",
      payload: "GET /runtime/invocation/next",
      detail:
        "The runtime calls the Runtime API for its first event. That call ends Init. The REPORT log line shows its length as Init Duration.",
    },
    {
      id: "event",
      from: "lambda",
      to: "env",
      title: "Deliver the event",
      payload: "event + request id",
      variant: "response",
      detail: "Lambda answers the waiting call with the request's event and a request id.",
    },
    {
      id: "handler",
      from: "env",
      title: "Run the handler",
      payload: "handler(event, context)",
      detail:
        "Only now does the first line of your handler run. Since August 2025 Lambda bills Init time for on-demand functions in every configuration.",
    },
    {
      id: "result",
      from: "env",
      to: "lambda",
      title: "Return the result",
      payload: "POST …/{id}/response",
      detail: "The runtime posts the handler's return value back to the Runtime API.",
    },
    {
      id: "reply",
      from: "lambda",
      to: "caller",
      title: "Reply to the caller",
      payload: "200 { id: 42, … }",
      variant: "response",
      detail: "This first caller waited for every step above. A cold start adds anywhere from under 100 ms to over a second.",
    },
    {
      id: "freeze",
      from: "env",
      title: "Freeze and stay warm",
      payload: "frozen, ready for reuse",
      detail:
        "Lambda freezes the environment and keeps it for a while. The next request skips straight to the handler and reuses the connection. Environments are still recycled every few hours.",
    },
  ],
};
