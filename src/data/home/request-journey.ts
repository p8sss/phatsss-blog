import type { FlowActor, FlowDefinition } from "../../lib/flow/types";
import type { SurgeConfig } from "../../lib/flow/traffic";

/**
 * Home page "Request Journey": one web page view (server-rendered) and one app
 * call, followed through five stages of growth. Each stage walks a single
 * request through the best-practice path for its size, then floods it with
 * traffic to show what breaks and so motivate the next stage.
 *
 * Boxes keep their grid cell from one stage to the next where they can, so the
 * diagram reads as one system growing rather than five unrelated pictures.
 */

export type VerdictTone = "breaks" | "holds";

export interface JourneyVerdict {
  readonly tone: VerdictTone;
  readonly title: string;
  readonly detail: string;
}

export interface JourneyStage {
  readonly id: string;
  /** Short name for the stage rail. */
  readonly label: string;
  /** Practices this stage puts in place, scaling and security alike. */
  readonly practices: readonly string[];
  readonly flow: FlowDefinition;
  readonly surge: SurgeConfig;
  /** What sets the surge off, shown while it plays. */
  readonly surgeTitle: string;
  readonly verdict: JourneyVerdict;
}

const web: FlowActor = { id: "web", label: "Web browser", sublabel: "SSR page", kind: "client", col: 0, row: 0 };
const app: FlowActor = { id: "app", label: "Mobile app", sublabel: "iOS · Android", kind: "client", col: 0, row: 1 };
const cdn: FlowActor = { id: "edge", label: "CDN", sublabel: "TLS · edge cache", kind: "external", col: 1, row: 0 };
const webTier: FlowActor = { id: "ssr", label: "Web tier", sublabel: "SSR × 3", kind: "server", col: 1, row: 1 };
const apiTier: FlowActor = { id: "api", label: "API tier", sublabel: "REST × 4", kind: "server", col: 2, row: 0 };

const oneServer: JourneyStage = {
  id: "one-server",
  label: "One server",
  practices: ["HTTPS everywhere", "HttpOnly session cookie", "Bound SQL parameters", "CSP + security headers"],
  flow: {
    id: "journey-one-server",
    title: "One server renders the page and serves the app",
    actors: [
      web,
      app,
      { id: "server", label: "App server", sublabel: "SSR + API", kind: "server", col: 1, row: 0 },
      { id: "db", label: "Postgres", sublabel: "single node", kind: "database", col: 1, row: 1 },
    ],
    steps: [
      {
        id: "page",
        from: "web",
        to: "server",
        title: "Request the page over HTTPS",
        payload: "GET / · Cookie: sid=…",
        detail:
          "TLS encrypts the hop. The session cookie is HttpOnly, Secure and SameSite=Lax, so page scripts can't read it and other sites can't send it.",
      },
      {
        id: "query",
        from: "server",
        to: "db",
        title: "Query with bound parameters",
        payload: "SELECT … WHERE user_id = $1",
        detail:
          "Values travel apart from the SQL text, which shuts out SQL injection. The app's database user can touch only its own tables.",
      },
      {
        id: "rows",
        from: "db",
        to: "server",
        title: "Return the rows",
        payload: "20 rows · 4 ms",
        variant: "response",
        detail: "One small, paginated query per page. At this size the database is barely awake.",
      },
      {
        id: "render",
        from: "server",
        title: "Render HTML on the server",
        payload: "renderToString(<Feed />)",
        detail:
          "SSR sends a page that reads before any JavaScript runs, which helps first paint and search. User content is escaped on its way into the HTML.",
      },
      {
        id: "html",
        from: "server",
        to: "web",
        title: "Send the HTML with security headers",
        payload: "200 text/html · CSP nonce",
        variant: "response",
        detail:
          "A Content-Security-Policy with a per-request nonce, HSTS and nosniff ride along, so injected scripts don't run even if one slips through.",
      },
      {
        id: "hydrate",
        from: "web",
        title: "Hydrate",
        payload: "hydrateRoot(…)",
        detail: "The browser loads the JS bundle and attaches event handlers to the HTML it already shows.",
      },
      {
        id: "api",
        from: "app",
        to: "server",
        title: "Call the JSON API from the app",
        payload: "GET /api/feed · Bearer eyJ…",
        detail:
          "The app skips HTML and asks for data. It sends a short-lived access token kept in the OS keychain, not a cookie.",
      },
      {
        id: "json",
        from: "server",
        to: "app",
        title: "Answer with JSON",
        payload: "200 application/json",
        variant: "response",
        detail: "Same process, same business rules, a second format. Both clients share one machine.",
      },
    ],
  },
  surge: {
    routes: [
      { path: ["web", "server", "db"], weight: 3 },
      { path: ["app", "server", "db"], weight: 2 },
    ],
    bottleneck: "server",
    metrics: { rps: [40, 2000], p95Ms: [90, 4800], errorPct: [0, 21] },
  },
  surgeTitle: "Launch day: traffic ×50",
  verdict: {
    tone: "breaks",
    title: "One box does everything",
    detail:
      "Page renders and app calls share one CPU. The request queue backs up, p95 jumps to seconds, and there is no second machine to take the overflow.",
  },
};

const scaleOut: JourneyStage = {
  id: "scale-out",
  label: "Scale out",
  practices: ["CDN for hashed assets", "Stateless instances", "One API for web and app", "No DB keys in the web tier", "Connection pooling"],
  flow: {
    id: "journey-scale-out",
    title: "Split the tiers and run several of each",
    actors: [
      web,
      app,
      cdn,
      webTier,
      apiTier,
      { id: "db", label: "Postgres", sublabel: "primary", kind: "database", col: 2, row: 1 },
    ],
    steps: [
      {
        id: "page",
        from: "web",
        to: "edge",
        title: "Request the page through the CDN",
        payload: "GET / · TLS 1.3",
        detail:
          "TLS terminates at the CDN, close to the user. Only the CDN may reach the origin, so the servers behind it have no public address.",
      },
      {
        id: "route",
        from: "edge",
        to: "ssr",
        title: "Forward to a healthy SSR instance",
        payload: "least-conn → ssr-2",
        detail:
          "Web instances are stateless: sessions live in a signed cookie or a shared store, so any instance can serve any user and autoscaling can add or remove them.",
      },
      {
        id: "data",
        from: "ssr",
        to: "api",
        title: "Fetch data from the API",
        payload: "GET /v1/feed · service token",
        detail:
          "SSR is just another API client. Rules and authorization live in one place, and the web tier holds no database credentials.",
      },
      {
        id: "query",
        from: "api",
        to: "db",
        title: "Query through a connection pool",
        payload: "pool 3/20 · SELECT … LIMIT 20",
        detail:
          "A pool reuses a fixed set of connections instead of opening one per request. Pagination keeps every query bounded.",
      },
      {
        id: "rows",
        from: "db",
        to: "api",
        title: "Return the rows",
        payload: "20 rows",
        variant: "response",
        detail: "The primary still serves every read and every write.",
      },
      {
        id: "json",
        from: "api",
        to: "ssr",
        title: "Answer the web tier",
        payload: "200 JSON",
        variant: "response",
        detail: "The API validates and shapes the data the same way for every client.",
      },
      {
        id: "html",
        from: "ssr",
        to: "edge",
        title: "Stream the HTML back",
        payload: "200 · Cache-Control: private",
        variant: "response",
        detail: "Private tells the CDN not to keep a page that belongs to one user.",
      },
      {
        id: "deliver",
        from: "edge",
        to: "web",
        title: "Deliver HTML and cached assets",
        payload: "HTML + app.3f9c.js (HIT)",
        variant: "response",
        detail:
          "Static files carry a content hash in their names, so the CDN caches them for a year and a deploy still updates them instantly.",
      },
      {
        id: "app",
        from: "app",
        to: "edge",
        title: "Call the same API from the app",
        payload: "GET /v1/feed · Bearer eyJ…",
        detail: "The app enters through the same front door as the browser.",
      },
      {
        id: "path",
        from: "edge",
        to: "api",
        title: "Route by path",
        payload: "/v1/* → API tier",
        detail:
          "One hostname, routed by path. Web and app hit the same API, so their rules never drift apart.",
      },
    ],
  },
  surge: {
    routes: [
      { path: ["web", "edge", "ssr", "api", "db"], weight: 3 },
      { path: ["app", "edge", "api", "db"], weight: 2 },
      { path: ["web", "edge"], weight: 2 },
    ],
    bottleneck: "db",
    metrics: { rps: [2000, 9000], p95Ms: [120, 2900], errorPct: [0.1, 9] },
  },
  surgeTitle: "A post goes viral",
  verdict: {
    tone: "breaks",
    title: "The database becomes the ceiling",
    detail:
      "Web and API instances scale out in a minute, but every one of them talks to the same primary. Connections run out, and the same hot rows are read thousands of times a second.",
  },
};

const cacheAndReplicas: JourneyStage = {
  id: "cache",
  label: "Cache",
  practices: ["Edge cache for public pages", "Cache-aside with TTL", "Per-user cache keys", "Read replicas", "Writes invalidate"],
  flow: {
    id: "journey-cache",
    title: "Answer repeat reads without the primary",
    actors: [
      web,
      app,
      cdn,
      webTier,
      apiTier,
      { id: "primary", label: "Postgres", sublabel: "primary", kind: "database", col: 2, row: 1 },
      { id: "cache", label: "Redis", sublabel: "cache-aside", kind: "cache", col: 3, row: 0 },
      { id: "replica", label: "Replica", sublabel: "read-only", kind: "database", col: 3, row: 1 },
    ],
    steps: [
      {
        id: "public",
        from: "web",
        to: "edge",
        title: "Ask the edge for a public page",
        payload: "GET /pricing",
        detail: "Pages that look the same for everyone carry s-maxage=60 and stale-while-revalidate.",
      },
      {
        id: "hit",
        from: "edge",
        to: "web",
        title: "Answer from the CDN cache",
        payload: "200 · HIT · age 14s",
        variant: "response",
        detail: "The CDN serves most public traffic without touching the origin, and refreshes in the background.",
      },
      {
        id: "private",
        from: "edge",
        to: "ssr",
        title: "Pass the signed-in feed to SSR",
        payload: "GET /feed · private",
        detail: "Personal pages are never cached at the edge; they go to the web tier as before.",
      },
      {
        id: "data",
        from: "ssr",
        to: "api",
        title: "Fetch data from the API",
        payload: "GET /v1/feed",
        detail: "The web tier still talks only to the API, never to a data store.",
      },
      {
        id: "lookup",
        from: "api",
        to: "cache",
        title: "Check the cache first",
        payload: "GET feed:u42",
        detail:
          "Cache-aside: look in Redis, fall back to the database on a miss. Keys are scoped per user so one user's data is never served to another.",
      },
      {
        id: "miss",
        from: "cache",
        to: "api",
        title: "Report a miss",
        payload: "MISS",
        variant: "response",
        detail: "On a hit the request would end here in under a millisecond.",
      },
      {
        id: "replica",
        from: "api",
        to: "replica",
        title: "Read from a replica",
        payload: "SELECT … LIMIT 20 · replica",
        detail:
          "Reads that can tolerate a little lag go to replicas. Reads right after a user's own write stay on the primary.",
      },
      {
        id: "rows",
        from: "replica",
        to: "api",
        title: "Return the rows",
        payload: "20 rows · lag 30 ms",
        variant: "response",
        detail: "Replicas stream changes from the primary and add read capacity one node at a time.",
      },
      {
        id: "fill",
        from: "api",
        to: "cache",
        title: "Fill the cache with a TTL",
        payload: "SET feed:u42 EX 60",
        detail: "The TTL bounds how stale a cached answer can get.",
      },
      {
        id: "app",
        from: "app",
        to: "edge",
        title: "Like a post from the app",
        payload: "POST /v1/likes · Bearer eyJ…",
        detail: "Writes go through the same front door.",
      },
      {
        id: "path",
        from: "edge",
        to: "api",
        title: "Route to the API",
        payload: "/v1/* → API tier",
        detail: "Writes are never cached at the edge.",
      },
      {
        id: "write",
        from: "api",
        to: "primary",
        title: "Write to the primary, drop the cache",
        payload: "INSERT … · DEL feed:u42",
        detail: "Writes always go to the primary. Deleting the cached feed means the next read sees the change.",
      },
    ],
  },
  surge: {
    routes: [
      { path: ["web", "edge"], weight: 3 },
      { path: ["web", "edge", "ssr", "api", "cache"], weight: 2 },
      { path: ["web", "edge", "ssr", "api", "replica"], weight: 1 },
      { path: ["app", "edge", "api", "primary"], weight: 2 },
    ],
    bottleneck: "api",
    metrics: { rps: [9000, 25000], p95Ms: [70, 3600], errorPct: [0.1, 12] },
  },
  surgeTitle: "A flash sale opens",
  verdict: {
    tone: "breaks",
    title: "Slow work blocks every request",
    detail:
      "A flash sale hits checkout. Each order waits on the payment provider, an email and a PDF before it answers. API workers sit waiting, client retries double the load, and timeouts pile up.",
  },
};

const asyncWork: JourneyStage = {
  id: "async",
  label: "Async",
  practices: ["Idempotency keys", "Server-side validation", "Transactional outbox", "Queue with retries", "202 Accepted"],
  flow: {
    id: "journey-async",
    title: "Answer fast, do the slow part later",
    actors: [
      web,
      app,
      cdn,
      webTier,
      apiTier,
      { id: "data", label: "Data tier", sublabel: "Postgres + Redis", kind: "database", col: 2, row: 1 },
      { id: "queue", label: "Queue", sublabel: "SQS · RabbitMQ", kind: "queue", col: 3, row: 0 },
      { id: "worker", label: "Workers", sublabel: "scale on depth", kind: "service", col: 3, row: 1 },
    ],
    steps: [
      {
        id: "order",
        from: "app",
        to: "edge",
        title: "Place an order",
        payload: "POST /v1/orders · Idem-Key 7f3c",
        detail:
          "The app makes one idempotency key per checkout. If the network drops and it retries, the server sees the same key and won't charge twice.",
      },
      {
        id: "path",
        from: "edge",
        to: "api",
        title: "Route to the API",
        payload: "/v1/orders → API tier",
        detail: "Nothing about the front door changes.",
      },
      {
        id: "validate",
        from: "api",
        title: "Validate and authorize",
        payload: "schema ✓ · owns cart ✓",
        detail:
          "Check the body against a schema and that the user owns the cart. Never trust a total sent by the client; recompute it on the server.",
      },
      {
        id: "commit",
        from: "api",
        to: "data",
        title: "Write the order and its event together",
        payload: "INSERT order + outbox · COMMIT",
        detail:
          "The order and an 'order placed' message commit in one transaction (the outbox pattern), so the event can't be lost if the process dies.",
      },
      {
        id: "enqueue",
        from: "api",
        to: "queue",
        title: "Hand the slow work to the queue",
        payload: "order.placed #9812",
        detail: "Payment capture, email and the invoice PDF become jobs. The request no longer waits on them.",
      },
      {
        id: "accepted",
        from: "api",
        to: "edge",
        title: "Answer right away",
        payload: "202 Accepted · /orders/9812",
        variant: "response",
        detail: "The API replies in milliseconds instead of seconds.",
      },
      {
        id: "relay",
        from: "edge",
        to: "app",
        title: "Show the order as processing",
        payload: "202 → push when paid",
        variant: "response",
        detail: "The app shows progress and waits for a push notification or polls the order.",
      },
      {
        id: "consume",
        from: "queue",
        to: "worker",
        title: "A worker picks up the job",
        payload: "charge · email · invoice",
        detail:
          "Workers scale on queue depth, retry with backoff, and park poison messages in a dead-letter queue for a human to look at.",
      },
      {
        id: "update",
        from: "worker",
        to: "data",
        title: "Record the result",
        payload: "UPDATE orders SET status=paid",
        detail: "The worker writes the outcome; the app's next poll or push shows it.",
      },
      {
        id: "web-checkout",
        from: "web",
        to: "edge",
        title: "Check out on the web",
        payload: "POST /checkout · CSRF token",
        detail:
          "A browser form sends cookies automatically, so the server also checks a CSRF token that only its own pages could have embedded.",
      },
      {
        id: "web-forward",
        from: "edge",
        to: "ssr",
        title: "Handle the form on the web tier",
        payload: "server action · origin ✓",
        detail: "The web tier checks the Origin header and the token, then turns the form into an API call.",
      },
      {
        id: "web-order",
        from: "ssr",
        to: "api",
        title: "Same endpoint, same rules",
        payload: "POST /v1/orders · Idem-Key 91ab",
        detail: "Web and app orders take the identical path from here: validate, commit with the outbox, enqueue, 202.",
      },
    ],
  },
  surge: {
    routes: [
      { path: ["web", "edge", "ssr", "api", "data"], weight: 2 },
      { path: ["app", "edge", "api", "data"], weight: 2 },
      { path: ["app", "edge", "api", "queue", "worker"], weight: 1 },
      { path: ["app", "edge", "api", "data"], weight: 2, attack: true },
      { path: ["web", "edge", "ssr", "api"], weight: 1, attack: true },
    ],
    bottleneck: "api",
    metrics: { rps: [25000, 65000], p95Ms: [110, 2400], errorPct: [0.2, 14], blockedPct: [0, 0] },
  },
  surgeTitle: "A botnet joins the crowd",
  verdict: {
    tone: "breaks",
    title: "Bots look like customers",
    detail:
      "A botnet replays leaked passwords against the login API and scrapes prices. Every request is valid HTTPS, so the CDN passes it on, the API burns capacity on it, and some stolen passwords work.",
  },
};

const enterprise: JourneyStage = {
  id: "enterprise",
  label: "Enterprise",
  practices: [
    "WAF + bot scoring",
    "Gateway auth + rate limits",
    "mTLS between services",
    "Secrets from a vault",
    "Tracing on every hop",
  ],
  flow: {
    id: "journey-enterprise",
    title: "Guarded at every layer, scaled per service",
    actors: [
      web,
      app,
      { id: "edge", label: "Edge", sublabel: "CDN · WAF · bots", kind: "guard", col: 1, row: 0 },
      { id: "ssr", label: "Web BFF", sublabel: "SSR × 6", kind: "server", col: 1, row: 1 },
      { id: "gateway", label: "API gateway", sublabel: "auth · limits", kind: "guard", col: 2, row: 0 },
      { id: "events", label: "Event bus", sublabel: "Kafka + workers", kind: "queue", col: 2, row: 1 },
      { id: "services", label: "Services", sublabel: "orders · feed", kind: "service", col: 3, row: 0 },
      { id: "data", label: "Data tier", sublabel: "one per service", kind: "database", col: 3, row: 1 },
    ],
    steps: [
      {
        id: "page",
        from: "web",
        to: "edge",
        title: "Reach the nearest edge",
        payload: "GET /feed · anycast → SIN",
        detail: "Anycast DNS sends each user to the closest point of presence, in any healthy region.",
      },
      {
        id: "inspect",
        from: "edge",
        title: "Inspect and filter",
        payload: "WAF ✓ · bot score 0.02",
        detail:
          "The WAF drops known attack patterns, DDoS protection absorbs floods, and bot scoring challenges clients that don't behave like people.",
      },
      {
        id: "forward",
        from: "edge",
        to: "ssr",
        title: "Forward over a private link",
        payload: "mTLS · traceparent 00-4bf9…",
        detail:
          "Origins accept only the edge, over mutual TLS. A trace ID starts here and follows the request through every hop.",
      },
      {
        id: "bff",
        from: "ssr",
        to: "gateway",
        title: "Call the gateway as the user",
        payload: "GET /v1/feed · Bearer eyJ…",
        detail:
          "The web BFF keeps the user's tokens server-side behind an HttpOnly session and forwards the access token, so the gateway authorizes the user, not the web tier.",
      },
      {
        id: "auth",
        from: "gateway",
        title: "Check the token and the rate limit",
        payload: "JWT ✓ · feed:read · 42/100 rpm",
        detail:
          "The gateway verifies the signature against the identity provider's cached keys, checks scopes, and applies per-user and per-IP limits. Services never see an unauthenticated call.",
      },
      {
        id: "route",
        from: "gateway",
        to: "services",
        title: "Route to the feed service",
        payload: "mTLS · svc: feed",
        detail:
          "Each service runs with least-privilege credentials fetched from a secret manager at start-up, never baked into images.",
      },
      {
        id: "read",
        from: "services",
        to: "data",
        title: "Read through cache and replicas",
        payload: "cache hit 94% · replica",
        detail: "Each service owns its data. Nobody else queries its tables; they call its API or read its events.",
      },
      {
        id: "emit",
        from: "services",
        to: "events",
        title: "Publish what happened",
        payload: "feed.viewed → Kafka",
        detail: "Recommendations, analytics and audit logs consume events on their own time, without slowing this request.",
      },
      {
        id: "reply",
        from: "services",
        to: "gateway",
        title: "Return the feed",
        payload: "200 · 38 ms",
        variant: "response",
        detail: "Every hop reports its latency to the same trace, so a slow request points straight at its cause.",
      },
      {
        id: "relay",
        from: "gateway",
        to: "ssr",
        title: "Pass the data to the BFF",
        payload: "200 JSON",
        variant: "response",
        detail: "The gateway strips internal headers on the way out.",
      },
      {
        id: "html",
        from: "ssr",
        to: "edge",
        title: "Stream the page",
        payload: "streamed HTML · private",
        variant: "response",
        detail: "Streaming SSR sends the shell first and fills in slower parts as they resolve.",
      },
      {
        id: "deliver",
        from: "edge",
        to: "web",
        title: "Deliver with strict headers",
        payload: "CSP · HSTS · COOP",
        variant: "response",
        detail: "The edge enforces one header policy for every page, so no team can forget it.",
      },
      {
        id: "app",
        from: "app",
        to: "edge",
        title: "The app uses the same front door",
        payload: "GET /v1/feed · Bearer eyJ…",
        detail: "Same edge, same WAF, same rate limits. Mobile routes skip the web BFF.",
      },
      {
        id: "app-route",
        from: "edge",
        to: "gateway",
        title: "Straight to the gateway",
        payload: "/v1/* → gateway",
        detail: "One gateway checks every API call, from web and app alike.",
      },
    ],
  },
  surge: {
    routes: [
      { path: ["web", "edge", "ssr", "gateway", "services", "data"], weight: 3 },
      { path: ["app", "edge", "gateway", "services", "data"], weight: 2 },
      { path: ["web", "edge"], weight: 2 },
      { path: ["web", "edge", "ssr", "gateway", "services", "events"], weight: 1 },
      { path: ["web", "edge", "ssr", "gateway"], weight: 2, attack: true },
      { path: ["app", "edge", "gateway", "services"], weight: 1, attack: true, blockedBy: "gateway" },
    ],
    guards: ["edge", "gateway"],
    metrics: { rps: [65000, 120000], p95Ms: [85, 130], errorPct: [0.01, 0.03], blockedPct: [4, 38] },
  },
  surgeTitle: "Peak season, under attack",
  verdict: {
    tone: "holds",
    title: "Built to bend, not break",
    detail:
      "Bots stop at the edge and password spraying hits the gateway's rate limits. Each service scales on its own, and if a region fails, DNS moves users to the standby region within a minute.",
  },
};

export const JOURNEY_STAGES: readonly JourneyStage[] = [oneServer, scaleOut, cacheAndReplicas, asyncWork, enterprise];
