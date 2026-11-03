import type { Comparison } from "../../../lib/compare/types";

/** Backend roadmap → Real-Time Data. */
export const websocketsSsePolling: Comparison = {
  id: "websockets-sse-polling",
  title: "WebSockets vs SSE vs long polling",
  options: [
    { id: "websockets", name: "WebSockets", summary: "A two-way channel of frames on one long-lived connection." },
    { id: "sse", name: "Server-sent events", summary: "One long HTTP response that streams text events to the browser." },
    { id: "long-polling", name: "Long polling", summary: "Plain HTTP requests that the server holds open until there is news." },
  ],
  rows: [
    {
      criterion: "Direction",
      cells: {
        websockets: "Both ways, at any time.",
        sse: "Server to client. The client sends with normal HTTP requests.",
        "long-polling": "Server to client, one answer per request. The client sends with normal requests.",
      },
    },
    {
      criterion: "Protocol",
      cells: {
        websockets: "Starts as HTTP, then upgrades to its own framed protocol.",
        sse: "Plain HTTP with the text/event-stream content type.",
        "long-polling": "Plain HTTP. Each response ends the request, and the client asks again.",
      },
    },
    {
      criterion: "Data",
      cells: {
        websockets: "Text or binary frames.",
        sse: "UTF-8 text only. Send JSON, or encode binary data.",
        "long-polling": "Anything HTTP can carry.",
      },
    },
    {
      criterion: "Reconnecting",
      cells: {
        websockets: "Up to you, including catching up on missed messages.",
        sse: "Built in. The browser reconnects and sends Last-Event-ID so the server can resume.",
        "long-polling": "Natural, since every poll is a new request. You track the last cursor.",
      },
    },
    {
      criterion: "Browser API",
      cells: {
        websockets: "WebSocket. No custom headers on the handshake.",
        sse: "EventSource. No custom headers either, so auth usually rides on cookies.",
        "long-polling": "fetch, with full control of headers.",
      },
    },
    {
      criterion: "Through proxies and load balancers",
      cells: {
        websockets: "Each hop must allow the upgrade and long idle connections.",
        sse: "Works through most HTTP infrastructure. Turn off response buffering.",
        "long-polling": "Works almost everywhere. Hold requests for less than proxy timeouts, about 30 seconds.",
      },
    },
    {
      criterion: "Connection limits",
      cells: {
        websockets: "Counted separately from the HTTP connection pool.",
        sse: "Over HTTP/1.1 a browser allows only 6 per domain across all tabs. HTTP/2 lifts this.",
        "long-polling": "Each waiting poll uses one HTTP connection, so the same HTTP/1.1 limit applies.",
      },
    },
    {
      criterion: "Overhead per message",
      cells: {
        websockets: "A few bytes of frame header.",
        sse: "A few bytes of event framing.",
        "long-polling": "A full HTTP request and response, plus a round trip before the next message can arrive.",
      },
    },
  ],
  verdicts: [
    {
      option: "websockets",
      pickWhen: [
        "Both sides send often: chat, multiplayer games, collaborative editing.",
        "You need binary data or very low latency in both directions.",
      ],
    },
    {
      option: "sse",
      pickWhen: [
        "Only the server pushes: notifications, live scores, progress bars, streamed AI responses.",
        "You want automatic reconnects and resume with little code.",
        "Your stack already speaks HTTP well and you would rather not run a separate protocol.",
      ],
    },
    {
      option: "long-polling",
      pickWhen: [
        "Updates are rare and you need something that works through any proxy.",
        "You need a fallback when the other two are blocked.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    { label: "RFC 6455: The WebSocket Protocol", href: "https://www.rfc-editor.org/rfc/rfc6455" },
    {
      label: "HTML Living Standard: server-sent events",
      href: "https://html.spec.whatwg.org/multipage/server-sent-events.html",
    },
    { label: "RFC 6202: long polling and streaming", href: "https://www.rfc-editor.org/rfc/rfc6202" },
    {
      label: "MDN: using server-sent events",
      href: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events",
    },
  ],
};
