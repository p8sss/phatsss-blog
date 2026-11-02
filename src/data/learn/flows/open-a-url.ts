import type { FlowDefinition } from "../../../lib/flow/types";

/** Backend roadmap → Introduction → How does the internet work? */
export const openAUrl: FlowDefinition = {
  id: "open-a-url",
  title: "From typing a URL to seeing the page",
  actors: [
    { id: "browser", label: "Browser", sublabel: "Chrome, Safari", kind: "client", col: 0, row: 0 },
    { id: "resolver", label: "DNS resolver", sublabel: "ISP or 1.1.1.1", kind: "service", col: 1, row: 0 },
    { id: "ns", label: "Nameservers", sublabel: "root, TLD, auth", kind: "external", col: 2, row: 0 },
    { id: "server", label: "Web server", sublabel: "example.com", kind: "server", col: 1, row: 1 },
  ],
  steps: [
    {
      id: "cache",
      from: "browser",
      title: "Check the local caches",
      payload: "browser cache → OS resolver",
      detail:
        "Before any network call the browser checks its own DNS cache, then asks the operating system. The OS consults the hosts file, whose entries win over DNS, and its own cache. A hit skips straight to connecting.",
    },
    {
      id: "ask",
      from: "browser",
      to: "resolver",
      title: "Ask the resolver",
      payload: "A? example.com",
      detail:
        "On a miss the OS sends one recursive query, usually over UDP port 53, to the configured resolver. The resolver promises to come back with a final answer.",
    },
    {
      id: "walk",
      from: "resolver",
      to: "ns",
      title: "Walk the DNS tree",
      payload: "root → .com → example.com",
      detail:
        "The resolver asks a root server where .com lives, asks the .com servers where example.com lives, then asks example.com's authoritative nameserver for the record itself.",
    },
    {
      id: "answer",
      from: "ns",
      to: "resolver",
      title: "Get the address",
      payload: "A 203.0.113.10 TTL 3600",
      variant: "response",
      detail:
        "The authoritative server answers with the IP address and a TTL, the number of seconds anyone may cache it.",
    },
    {
      id: "ip",
      from: "resolver",
      to: "browser",
      title: "Return the IP",
      payload: "203.0.113.10",
      variant: "response",
      detail:
        "The resolver caches the answer for the TTL, so the next person asking for example.com gets it without the walk.",
    },
    {
      id: "tcp",
      from: "browser",
      to: "server",
      title: "Open a TCP connection",
      payload: "SYN → SYN-ACK → ACK",
      detail:
        "The three-way handshake costs one round trip before any data moves. HTTP/3 replaces TCP with QUIC over UDP and folds this into the TLS handshake.",
    },
    {
      id: "tls",
      from: "browser",
      to: "server",
      title: "Negotiate TLS",
      payload: "ClientHello · TLS 1.3",
      detail:
        "For HTTPS the two sides agree on keys and the server proves who it is with a certificate. TLS 1.3 does this in one more round trip.",
    },
    {
      id: "request",
      from: "browser",
      to: "server",
      title: "Send the HTTP request",
      payload: "GET / · Host: example.com",
      detail:
        "The request names the path and the host. The Host header lets one IP address serve many sites.",
    },
    {
      id: "html",
      from: "server",
      to: "browser",
      title: "Return the HTML",
      payload: "200 OK · text/html",
      variant: "response",
      detail:
        "The server, or a CDN in front of it, responds with a status code, headers such as Cache-Control, and the HTML body.",
    },
    {
      id: "render",
      from: "browser",
      title: "Parse and render",
      payload: "HTML → DOM → pixels",
      detail:
        "The browser parses the HTML and finds CSS, scripts and images to fetch, reusing the same connection. Then it lays out and paints the page.",
    },
  ],
};
