import type { Comparison } from "../../../lib/compare/types";

/** Backend roadmap → Learn about APIs. */
export const restGraphqlGrpc: Comparison = {
  id: "rest-graphql-grpc",
  title: "REST vs GraphQL vs gRPC",
  options: [
    { id: "rest", name: "REST", summary: "Resources at URLs, acted on with standard HTTP methods." },
    { id: "graphql", name: "GraphQL", summary: "One typed schema; the client asks for exactly the fields it wants." },
    { id: "grpc", name: "gRPC", summary: "Typed remote procedure calls with Protocol Buffers over HTTP/2." },
  ],
  rows: [
    {
      criterion: "Contract",
      cells: {
        rest: "Optional. Many teams describe the API with OpenAPI.",
        graphql: "Required. The schema defines every type and field, and clients can introspect it.",
        grpc: "Required. Services and messages live in .proto files that generate client and server code.",
      },
    },
    {
      criterion: "On the wire",
      cells: {
        rest: "HTTP, usually with JSON bodies.",
        graphql: "Usually a JSON POST to a single endpoint. Queries can also be sent with GET.",
        grpc: "HTTP/2 with compact binary Protocol Buffers messages.",
      },
    },
    {
      criterion: "Shape of a response",
      cells: {
        rest: "Fixed per endpoint. Screens often over-fetch or need several calls.",
        graphql: "Chosen by the client. Nested data comes back in one round trip.",
        grpc: "Fixed per method, defined by the response message.",
      },
    },
    {
      criterion: "Caching",
      cells: {
        rest: "Native HTTP caching: URLs, Cache-Control, ETags and CDNs all work.",
        graphql: "Harder over POST. Clients keep normalized caches keyed by object id. Persisted queries over GET can use CDNs.",
        grpc: "No HTTP caching. Cache in the client or the service.",
      },
    },
    {
      criterion: "Browsers",
      cells: {
        rest: "Works with plain fetch.",
        graphql: "Works with plain fetch or a client library.",
        grpc: "Not directly. gRPC-Web usually needs a proxy such as Envoy and does not support client or bidirectional streaming.",
      },
    },
    {
      criterion: "Streaming",
      cells: {
        rest: "Not built in. Pair it with server-sent events or WebSockets.",
        graphql: "Subscriptions, usually carried over WebSockets or server-sent events.",
        grpc: "Built in: server, client and bidirectional streaming besides unary calls.",
      },
    },
    {
      criterion: "Errors",
      cells: {
        rest: "HTTP status codes such as 404 and 409.",
        graphql: "Often HTTP 200 with an errors array beside any partial data.",
        grpc: "gRPC status codes such as NOT_FOUND and DEADLINE_EXCEEDED.",
      },
    },
    {
      criterion: "Changing the API",
      cells: {
        rest: "Add fields freely. Breaking changes usually mean a new version in the path or a header.",
        graphql: "Add fields and mark old ones @deprecated. Usually no versions.",
        grpc: "Add fields with new field numbers. Never reuse or renumber an old one.",
      },
    },
    {
      criterion: "Server-side risk",
      cells: {
        rest: "Each endpoint has a known, testable cost.",
        graphql: "One query can be very expensive. Needs batching against N+1 and depth or cost limits.",
        grpc: "Each method has a known cost. Set deadlines on every call.",
      },
    },
  ],
  verdicts: [
    {
      option: "rest",
      pickWhen: [
        "The API is public or used by many unknown clients.",
        "Responses should be cached by browsers and CDNs.",
        "You want the simplest thing every language and tool already understands.",
      ],
    },
    {
      option: "graphql",
      pickWhen: [
        "Several apps, such as web and mobile, need different slices of the same data.",
        "Screens need nested data that would take many REST calls.",
        "A frontend team wants to evolve queries without waiting for new endpoints.",
      ],
    },
    {
      option: "grpc",
      pickWhen: [
        "Services talk to services inside your own network.",
        "You need low latency, small payloads or long-lived streams.",
        "Many languages must share one strict, generated contract.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    { label: "RFC 9110: HTTP Semantics", href: "https://www.rfc-editor.org/rfc/rfc9110" },
    { label: "Learn GraphQL", href: "https://graphql.org/learn/" },
    { label: "gRPC core concepts", href: "https://grpc.io/docs/what-is-grpc/core-concepts/" },
    { label: "gRPC-Web", href: "https://github.com/grpc/grpc-web" },
  ],
};
