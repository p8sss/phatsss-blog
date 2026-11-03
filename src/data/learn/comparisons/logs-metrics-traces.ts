import type { Comparison } from "../../../lib/compare/types";

/** DevOps roadmap → Observability. */
export const logsMetricsTraces: Comparison = {
  id: "logs-metrics-traces",
  title: "Logs vs metrics vs traces",
  options: [
    { id: "logs", name: "Logs", summary: "Timestamped records of individual events." },
    { id: "metrics", name: "Metrics", summary: "Numbers aggregated over time, stored as time series." },
    { id: "traces", name: "Traces", summary: "The path of one request across services, as a tree of timed spans." },
  ],
  rows: [
    {
      criterion: "Question it answers",
      cells: {
        logs: "What exactly happened in this one event?",
        metrics: "How much, how often, and is it getting worse?",
        traces: "Where did this one request spend its time, and which hop failed?",
      },
    },
    {
      criterion: "Shape of the data",
      cells: {
        logs: "A line or record per event. Structured fields, such as JSON, make it searchable.",
        metrics: "Numeric samples per series. A series is a metric name plus a set of labels.",
        traces: "Spans that share one trace id. Each span has a parent, a start, a duration and attributes.",
      },
    },
    {
      criterion: "What drives the cost",
      cells: {
        logs: "Volume. Every line is shipped, stored and often indexed, so cost grows with traffic.",
        metrics: "Cardinality. Each new label combination is a new series. Traffic volume barely matters.",
        traces: "Spans per request times requests. Most teams sample to keep it affordable.",
      },
    },
    {
      criterion: "Detail kept",
      cells: {
        logs: "Full detail of each event, including messages, ids and stack traces.",
        metrics: "No individual events. Only counts, sums and distributions survive.",
        traces: "Full detail for the requests that were sampled, across every service they touched.",
      },
    },
    {
      criterion: "Sampling",
      cells: {
        logs: "Usually kept in full. Noisy debug logs are often dropped or sampled.",
        metrics: "Not sampled. Aggregation is what keeps them small.",
        traces: "Head sampling decides at the start. Tail sampling decides after the trace ends, so it can keep every error.",
      },
    },
    {
      criterion: "Alerting",
      cells: {
        logs: "Possible but slow and costly at scale. Better to count key events as metrics.",
        metrics: "The best fit. Cheap to evaluate every minute over long ranges.",
        traces: "Rarely direct. Metrics derived from spans can feed alerts.",
      },
    },
    {
      criterion: "Common open-source backends",
      cells: {
        logs: "Grafana Loki, Elasticsearch, OpenSearch.",
        metrics: "Prometheus, plus Thanos or Grafana Mimir for long-term storage.",
        traces: "Jaeger, Grafana Tempo, Zipkin.",
      },
    },
    {
      criterion: "With OpenTelemetry",
      cells: {
        logs: "Bridges for existing logging libraries. Records can carry the active trace and span ids.",
        metrics: "Counters, gauges and histograms, exportable to Prometheus.",
        traces: "Spans from auto-instrumented libraries. Context crosses services in the traceparent header.",
      },
    },
  ],
  verdicts: [
    {
      option: "logs",
      pickWhen: [
        "You need the exact error, input or stack trace for one event.",
        "You need an audit trail of who did what, and when.",
        "You are chasing something rare that no metric was built to count.",
      ],
    },
    {
      option: "metrics",
      pickWhen: [
        "You want alerts and dashboards that stay cheap at any traffic level.",
        "You track service levels: error rate, latency percentiles, saturation.",
        "You need long-term trends for capacity planning.",
      ],
    },
    {
      option: "traces",
      pickWhen: [
        "A request crosses several services and you need to find the slow or failing hop.",
        "You want to see how services really call each other.",
        "You want to jump from a slow request to its logs through the trace id.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    { label: "OpenTelemetry signals", href: "https://opentelemetry.io/docs/concepts/signals/" },
    { label: "OpenTelemetry sampling", href: "https://opentelemetry.io/docs/concepts/sampling/" },
    { label: "Prometheus metric and label naming", href: "https://prometheus.io/docs/practices/naming/" },
    { label: "W3C Trace Context", href: "https://www.w3.org/TR/trace-context/" },
  ],
};
