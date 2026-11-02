import type { Comparison } from "../../../lib/compare/types";

/** Backend roadmap → Message Brokers. */
export const rabbitmqVsKafka: Comparison = {
  id: "rabbitmq-vs-kafka",
  title: "RabbitMQ vs Kafka",
  options: [
    { id: "rabbitmq", name: "RabbitMQ", summary: "A message broker: exchanges route messages into queues." },
    { id: "kafka", name: "Kafka", summary: "A distributed log: topics split into ordered, replicated partitions." },
  ],
  rows: [
    {
      criterion: "Core model",
      cells: {
        rabbitmq: "Smart broker, simple consumers. The broker routes, tracks and redelivers each message.",
        kafka: "Simple broker, smart consumers. The broker appends to a log; consumers track their own position.",
      },
    },
    {
      criterion: "After a message is read",
      cells: {
        rabbitmq: "Removed once acknowledged in classic and quorum queues. Streams keep messages.",
        kafka: "Kept until the retention time or size runs out, however many consumers read it.",
      },
    },
    {
      criterion: "Replay",
      cells: {
        rabbitmq: "Not from a queue. Possible with streams.",
        kafka: "Yes. Reset a consumer group's offset and reprocess history.",
      },
    },
    {
      criterion: "Routing",
      cells: {
        rabbitmq: "Rich: direct, topic, fanout and headers exchanges, plus dead-letter queues.",
        kafka: "By topic and partition key. Filtering happens in the consumer.",
      },
    },
    {
      criterion: "Ordering",
      cells: {
        rabbitmq: "Per queue, weakened by competing consumers and redeliveries.",
        kafka: "Per partition. Messages with the same key always land in the same partition.",
      },
    },
    {
      criterion: "Scaling consumers",
      cells: {
        rabbitmq: "Add competing consumers to a queue.",
        kafka: "Classic consumer groups: up to one consumer per partition. Share groups, production-ready since Kafka 4.2, lift that limit with per-message acks.",
      },
    },
    {
      criterion: "Throughput",
      cells: {
        rabbitmq: "High, tuned for low latency per message.",
        kafka: "Very high, built on batched sequential disk writes.",
      },
    },
    {
      criterion: "Protocols",
      cells: {
        rabbitmq: "AMQP 0-9-1 and AMQP 1.0, with MQTT and STOMP plugins.",
        kafka: "Kafka's own binary protocol over TCP.",
      },
    },
    {
      criterion: "Running it",
      cells: {
        rabbitmq: "One node is easy to start. Use quorum queues for replicated, durable queues.",
        kafka: "A cluster of brokers. KRaft mode replaced ZooKeeper for metadata.",
      },
    },
  ],
  verdicts: [
    {
      option: "rabbitmq",
      pickWhen: [
        "Each job should be done once by one worker, such as sending emails or resizing images.",
        "You need routing rules, priorities, per-message retries or dead-lettering.",
        "You want request and reply between services.",
      ],
    },
    {
      option: "kafka",
      pickWhen: [
        "Many independent services read the same stream of events.",
        "You need to replay history, rebuild a read model or reprocess after a bug fix.",
        "Volume is high and continuous: clickstreams, logs, metrics, change data capture.",
      ],
    },
  ],
  reviewed: "2026-11-02",
  sources: [
    { label: "RabbitMQ documentation", href: "https://www.rabbitmq.com/docs" },
    { label: "Apache Kafka documentation", href: "https://kafka.apache.org/documentation/" },
    {
      label: "Kafka 4.2 release notes",
      href: "https://kafka.apache.org/blog/2026/02/17/apache-kafka-4.2.0-release-announcement/",
    },
  ],
};
