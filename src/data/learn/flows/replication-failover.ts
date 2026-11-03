import type { FlowDefinition } from "../../../lib/flow/types";

/** Backend roadmap → Scaling Databases. */
export const replicationFailover: FlowDefinition = {
  id: "replication-failover",
  title: "Streaming replication, then a failover",
  actors: [
    { id: "app", label: "App server", sublabel: "your API", kind: "server", col: 0, row: 0 },
    { id: "primary", label: "Primary", sublabel: "takes writes", kind: "database", col: 1, row: 0 },
    { id: "replica", label: "Replica", sublabel: "hot standby", kind: "database", col: 1, row: 1 },
    { id: "ha", label: "HA manager", sublabel: "e.g. Patroni", kind: "service", col: 2, row: 0 },
  ],
  steps: [
    {
      id: "write",
      from: "app",
      to: "primary",
      title: "Write an order",
      payload: "INSERT INTO orders …",
      detail: "Every write goes to the one primary. Replicas are read-only.",
    },
    {
      id: "wal",
      from: "primary",
      title: "Log it, then commit",
      payload: "WAL record at LSN 0/3A1F28",
      detail:
        "The change is written to the write-ahead log and flushed at commit. The same log is what replicas copy.",
    },
    {
      id: "commit",
      from: "primary",
      to: "app",
      title: "Confirm the commit",
      payload: "COMMIT",
      variant: "response",
      detail:
        "Replication is asynchronous by default. The primary confirms without waiting for any replica, so a crash right now could lose the change.",
    },
    {
      id: "stream",
      from: "primary",
      to: "replica",
      title: "Stream the WAL",
      payload: "WAL from 0/3A1F28",
      detail:
        "The primary streams log records as soon as they are flushed to its disk. A healthy replica is usually well under a second behind.",
    },
    {
      id: "replay",
      from: "replica",
      title: "Replay the changes",
      payload: "replayed up to 0/3A1F28",
      detail: "The replica applies the same changes to its own copy of the data files.",
    },
    {
      id: "read",
      from: "app",
      to: "replica",
      title: "Read from the replica",
      payload: "SELECT … FROM orders",
      detail: "Sending reads to replicas spreads the load. A hot standby answers read-only queries while it replays.",
    },
    {
      id: "read-result",
      from: "replica",
      to: "app",
      title: "Answer, maybe a little behind",
      payload: "rows as of LSN 0/3A1F28",
      variant: "response",
      detail:
        "This replica has already replayed the new order, so it shows up. A lagging replica would hide it. Read your own recent writes from the primary.",
    },
    {
      id: "crash",
      from: "primary",
      title: "The primary dies",
      payload: "host unreachable",
      detail: "A disk fails or the host loses power. Writes now fail.",
    },
    {
      id: "health",
      from: "ha",
      to: "primary",
      title: "Health checks fail",
      payload: "health check × 3: timeout",
      detail:
        "PostgreSQL itself does not detect failure or fail over. A separate manager waits for several missed checks so a short blip does not trigger a failover.",
    },
    {
      id: "fence",
      from: "ha",
      title: "Fence the old primary",
      payload: "leader lock expired",
      detail:
        "Two primaries accepting writes is split brain, and it corrupts data. The old primary must be cut off or stopped before anyone else is promoted.",
    },
    {
      id: "promote",
      from: "ha",
      to: "replica",
      title: "Promote the replica",
      payload: "SELECT pg_promote();",
      detail:
        "The replica replays what it already received, then starts accepting writes on a new timeline. Commits that never reached it are lost.",
    },
    {
      id: "promoted",
      from: "replica",
      to: "ha",
      title: "Report the new role",
      payload: "primary, timeline 2",
      variant: "response",
      detail: "The manager updates whatever clients use to find the primary: a proxy, a DNS name or a virtual IP.",
    },
    {
      id: "reconnect",
      from: "app",
      to: "replica",
      title: "Writes go to the new primary",
      payload: "INSERT INTO orders …",
      detail:
        "Open connections broke during the failover. The app reconnects and retries, which is safe only for idempotent writes.",
    },
    {
      id: "rejoin",
      from: "ha",
      to: "primary",
      title: "Rejoin the old primary as a replica",
      payload: "pg_rewind, then follow",
      detail:
        "When the old host returns it may hold writes the new primary never saw. pg_rewind discards them so it can follow the new timeline.",
    },
  ],
};
