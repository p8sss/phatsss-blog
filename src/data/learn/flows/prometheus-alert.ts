import type { FlowDefinition } from "../../../lib/flow/types";

/** DevOps roadmap → Infrastructure Monitoring. */
export const prometheusAlert: FlowDefinition = {
  id: "prometheus-alert",
  title: "From a scraped counter to a page",
  actors: [
    { id: "app", label: "App", sublabel: "/metrics", kind: "server", col: 0, row: 0 },
    { id: "prom", label: "Prometheus", sublabel: "scrape + rules", kind: "database", col: 1, row: 0 },
    { id: "am", label: "Alertmanager", sublabel: "group + route", kind: "service", col: 2, row: 0 },
    { id: "pd", label: "PagerDuty", sublabel: "on-call", kind: "external", col: 3, row: 0 },
    { id: "phone", label: "Engineer", sublabel: "phone", kind: "client", col: 3, row: 1 },
  ],
  steps: [
    {
      id: "scrape",
      from: "prom",
      to: "app",
      title: "Scrape the target",
      payload: "GET /metrics",
      detail:
        "Prometheus pulls. Every scrape interval it fetches each target's metrics page. The default is one minute, and 15 to 30 seconds is common.",
    },
    {
      id: "samples",
      from: "app",
      to: "prom",
      title: "Return current values",
      payload: "requests_total{code=\"500\"} 1027",
      variant: "response",
      detail: "The app exposes plain text: a metric name, labels and a value. A counter only ever goes up.",
    },
    {
      id: "store",
      from: "prom",
      title: "Store the samples",
      payload: "+ job, instance → TSDB",
      detail:
        "Prometheus adds target labels and appends each sample to its local time-series database. It also records up = 1 for the scrape.",
    },
    {
      id: "evaluate",
      from: "prom",
      title: "Evaluate the alert rule",
      payload: "error ratio[5m] > 0.05",
      detail:
        "Every evaluation interval the rule engine runs each alert's PromQL expression. Each series it returns is an active alert.",
    },
    {
      id: "pending",
      from: "prom",
      title: "Hold it as pending",
      payload: "HighErrorRate: pending",
      detail: "The rule has for: 10m, so the alert waits. A short spike that clears in time never pages anyone.",
    },
    {
      id: "firing",
      from: "prom",
      title: "Fire the alert",
      payload: "HighErrorRate: firing",
      detail: "The condition held on every evaluation for ten minutes, so the alert moves to firing.",
    },
    {
      id: "send",
      from: "prom",
      to: "am",
      title: "Send it to Alertmanager",
      payload: "POST /api/v2/alerts",
      detail:
        "Prometheus sends firing alerts to every configured Alertmanager and keeps resending while they stay active. It never notifies people itself.",
    },
    {
      id: "route",
      from: "am",
      title: "Route to a receiver",
      payload: "severity=page → pagerduty",
      detail:
        "Alertmanager walks its routing tree to pick a receiver. The matching route also decides how alerts are grouped.",
    },
    {
      id: "group",
      from: "am",
      title: "Group, then check silences",
      payload: "group_by: alertname, cluster",
      detail:
        "Alerts with the same group labels become one notification. group_wait, 30 seconds by default, gives related alerts time to join. A matching inhibition rule or silence then stops the notification.",
    },
    {
      id: "notify",
      from: "am",
      to: "pd",
      title: "Notify the receiver",
      payload: "event_action: trigger",
      detail:
        "Alertmanager sends the group to PagerDuty's Events API. While the alert keeps firing it repeats only after repeat_interval, 4 hours by default.",
    },
    {
      id: "page",
      from: "pd",
      to: "phone",
      title: "Page whoever is on call",
      payload: "push + SMS: HighErrorRate",
      detail: "PagerDuty applies the on-call schedule and escalation policy, then alerts one person.",
    },
    {
      id: "ack",
      from: "phone",
      to: "pd",
      title: "Acknowledge",
      payload: "ack incident",
      variant: "response",
      detail: "Acknowledging stops the escalation to the next person. Now someone owns the problem.",
    },
    {
      id: "resolved",
      from: "prom",
      to: "am",
      title: "Resolve when it recovers",
      payload: "HighErrorRate: resolved",
      detail:
        "When the expression returns nothing, the alert resolves. Alertmanager then sends a resolve event, since send_resolved defaults to true for PagerDuty.",
    },
  ],
};
