import type { FlowDefinition } from "../../../lib/flow/types";

/** Backend roadmap → Real-Time Data. */
export const websocketLifecycle: FlowDefinition = {
  id: "websocket-lifecycle",
  title: "From an HTTP upgrade to a pushed message",
  actors: [
    { id: "browser", label: "Browser", sublabel: "chat page", kind: "client", col: 0, row: 0 },
    { id: "server", label: "WS server", sublabel: "one of many", kind: "server", col: 1, row: 0 },
    { id: "pubsub", label: "Pub/sub", sublabel: "e.g. Redis", kind: "queue", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "open",
      from: "browser",
      title: "Open a socket",
      payload: "new WebSocket('wss://…/ws')",
      detail: "The wss scheme means TLS over TCP, exactly like https. The handshake that follows is ordinary HTTP.",
    },
    {
      id: "upgrade",
      from: "browser",
      to: "server",
      title: "Ask to upgrade",
      payload: "GET /ws · Upgrade: websocket",
      detail:
        "An HTTP/1.1 GET with Connection: Upgrade, Sec-WebSocket-Version: 13 and a random Sec-WebSocket-Key. The browser adds the Origin header and any cookies for the site.",
    },
    {
      id: "origin",
      from: "server",
      title: "Check Origin and auth",
      payload: "Origin: https://chat.example.com",
      detail:
        "CORS does not apply to WebSockets, so any site can try to open one with the user's cookies. The server must check Origin itself, or a malicious page can hijack the session.",
    },
    {
      id: "accept",
      from: "server",
      title: "Compute the accept key",
      payload: "SHA-1(key + GUID) → base64",
      detail:
        "The server appends a fixed GUID from the spec to the key, hashes it and encodes it. This proves it speaks WebSocket. It is not security.",
    },
    {
      id: "switch",
      from: "server",
      to: "browser",
      title: "Switch protocols",
      payload: "101 Switching Protocols",
      variant: "response",
      detail:
        "The reply carries Sec-WebSocket-Accept, which the browser checks. From here on the same TCP connection carries WebSocket frames, not HTTP.",
    },
    {
      id: "send",
      from: "browser",
      to: "server",
      title: "Send a frame",
      payload: "text frame {\"type\":\"say\",…}",
      detail:
        "Frames have a header of a few bytes, not a full set of HTTP headers. Every client frame is masked with a random key. That stops a page from writing bytes that could poison an old proxy's cache.",
    },
    {
      id: "publish",
      from: "server",
      to: "pubsub",
      title: "Publish to the room",
      payload: "PUBLISH room:42 \"hi\"",
      detail:
        "Each server only holds its own connections. To reach users connected to other servers, it publishes the message to a shared broker.",
    },
    {
      id: "deliver",
      from: "pubsub",
      to: "server",
      title: "Every server gets a copy",
      payload: "message on room:42",
      variant: "response",
      detail: "All servers subscribed to the room receive it, including this one.",
    },
    {
      id: "push",
      from: "server",
      to: "browser",
      title: "Push without a request",
      payload: "text frame {\"msg\":\"hi\"}",
      variant: "response",
      detail: "The server writes to the socket whenever it wants. Frames from the server are not masked.",
    },
    {
      id: "ping",
      from: "server",
      to: "browser",
      title: "Send a heartbeat",
      payload: "ping frame",
      detail:
        "Proxies and NAT routers drop idle connections without telling either side. A ping every 30 seconds or so keeps the path open and finds dead peers.",
    },
    {
      id: "pong",
      from: "browser",
      to: "server",
      title: "Answer with pong",
      payload: "pong frame",
      variant: "response",
      detail:
        "Browsers reply to pings automatically. Page JavaScript cannot send pings, so client-side heartbeats are ordinary messages.",
    },
    {
      id: "close",
      from: "browser",
      to: "server",
      title: "Close cleanly",
      payload: "close frame 1000",
      detail: "Either side can start the close. Code 1000 means a normal closure.",
    },
    {
      id: "close-ack",
      from: "server",
      to: "browser",
      title: "Confirm and drop TCP",
      payload: "close frame 1000",
      variant: "response",
      detail:
        "The other side echoes a close frame, then the server closes the TCP connection. A connection that just vanishes gets no close frame, so the browser reports code 1006.",
    },
  ],
};
