import type { InterviewQuestion } from '@/lib/interviewTypes'

export const RABBITMQ_CONCEPTS_QUESTIONS: InterviewQuestion[] = [

  // ── Beginner ──────────────────────────────────────────────────────────────

  {
    id: 'b01',
    topic: 'AMQP Broker',
    question: 'What is RabbitMQ?',
    code: null,
    options: [
      'A relational database management system',
      'An open-source AMQP message broker',
      'A REST API gateway',
      'A distributed key-value store',
    ],
    correctIndex: 1,
    explanation:
      'RabbitMQ is an open-source message broker that implements the Advanced Message Queuing Protocol (AMQP 0-9-1). It decouples producers from consumers by routing messages through exchanges to queues. The broker persists messages (when durable), manages acknowledgements, and enforces routing rules. Because the protocol is standardised, clients in any language can interoperate with the same broker.',
    compiledJS:
      '# Management CLI — verify broker identity\nrabbitmqctl status\n# => Node: rabbit@hostname\n# => RabbitMQ 3.12.x, Erlang 26.x\n# => Protocols: amqp/0-9-1, amqp/1.0, mqtt, stomp\n\n# Enable management UI on port 15672\nrabbitmq-plugins enable rabbitmq_management',
    bestPractice:
      'Always pin RabbitMQ to a specific minor version in your container image and test upgrades in staging first. Use Docker Hubs official image with a digest tag rather than "latest" to avoid unintended upgrades. Run the management plugin on every node so you have a ready-to-use dashboard without extra tooling.',
    source: 'RabbitMQ Docs — Introduction',
  },

  {
    id: 'b02',
    topic: 'Exchange→Queue→Consumer',
    question: 'In a typical RabbitMQ message flow, what is the correct order of components?',
    code: null,
    options: [
      'Consumer → Queue → Exchange → Producer',
      'Producer → Queue → Exchange → Consumer',
      'Producer → Exchange → Queue → Consumer',
      'Exchange → Producer → Queue → Consumer',
    ],
    correctIndex: 2,
    explanation:
      'A producer publishes a message to an exchange, specifying a routing key. The exchange evaluates its bindings and routes the message to one or more queues. Consumers subscribe to queues and receive messages as they are delivered. The producer never writes directly to a queue — the exchange is the mandatory routing intermediary, which is what differentiates AMQP from simpler queue protocols.',
    compiledJS:
      '# Trace message flow in the management CLI\nrabbitmqctl trace_on          # enable tracing\n# Messages appear in amq.rabbitmq.trace exchange:\n# routing key pattern: publish.<exchange> and deliver.<queue>\n\n# Example: after publishing to "orders" exchange with key "new"\n# Trace log line:\n# publish.orders  routing-key=new  payload=<bytes>\n# deliver.orders.created  consumer-tag=ctag1  payload=<bytes>',
    bestPractice:
      'Keep producers ignorant of queue names — they should only know the exchange name and routing key. This separation lets you add or remove consumers and queues without touching producer code. Document your exchange/routing-key contracts in a central schema registry so teams do not break each other accidentally.',
    source: 'RabbitMQ Docs — AMQP 0-9-1 Model',
  },

  {
    id: 'b03',
    topic: 'Bindings',
    question: 'What is a binding in RabbitMQ?',
    code: null,
    options: [
      'A TCP connection between two brokers',
      'A rule that links an exchange to a queue (or another exchange)',
      'The authentication credential used by a producer',
      'A named reference to a virtual host',
    ],
    correctIndex: 1,
    explanation:
      'A binding is a relationship between an exchange and a destination (queue or another exchange) that tells the broker which messages the destination should receive. For direct and topic exchanges the binding carries a binding key that is matched against the message routing key. For fanout exchanges the binding has no key — all queues bound to the fanout receive every message. Exchange-to-exchange bindings (a RabbitMQ extension) allow sophisticated routing topologies.',
    compiledJS:
      '# Declare a binding via management HTTP API\ncurl -u guest:guest -X POST \\\n  http://localhost:15672/api/bindings/%2F/e/my.exchange/q/my.queue \\\n  -H "content-type: application/json" \\\n  -d \'{"routing_key": "order.created", "arguments": {}}\'\n\n# List all bindings for a queue\ncurl -u guest:guest \\\n  http://localhost:15672/api/queues/%2F/my.queue/bindings',
    bestPractice:
      'Treat bindings as part of your infrastructure-as-code — store them in Terraform (rabbitmq provider) or Ansible rather than creating them manually. Include routing-key patterns in your service documentation so other teams know how to bind to shared exchanges. Prefer specific routing keys over wildcard-heavy patterns to keep routing logic easy to reason about.',
    source: 'RabbitMQ Docs — Bindings',
  },

  {
    id: 'b04',
    topic: 'Default Exchange',
    question: 'What is the default exchange in RabbitMQ?',
    code: null,
    options: [
      "A fanout exchange named 'default'",
      "A pre-declared direct exchange with an empty string name",
      "A topic exchange named 'amq.default'",
      'A headers exchange that must be declared before use',
    ],
    correctIndex: 1,
    explanation:
      'The default exchange is a built-in direct exchange with an empty string ("") as its name. Every queue is automatically bound to it using the queue name as the routing key — no explicit binding call is needed. Publishing a message to the default exchange with a routing key equal to a queue name delivers the message directly to that queue. This shortcut is useful for simple point-to-point messaging but hides the exchange routing model, which can cause confusion in larger systems.',
    compiledJS:
      '# Publish directly to a queue via the default exchange\n# (routing_key == queue name, exchange == "")\nrabbitmqadmin publish \\\n  exchange="" \\\n  routing_key="my.queue" \\\n  payload="hello world"\n\n# Equivalent Python (pika)\nchannel.basic_publish(\n    exchange="",        # default exchange\n    routing_key="my.queue",\n    body=b"hello world"\n)',
    bestPractice:
      'Avoid the default exchange in production service-to-service messaging. Explicit named exchanges make routing intent clear, allow you to change destination queues without changing producer code, and make tracing/debugging easier. Reserve the default exchange for quick scripts, local testing, or CLI tools.',
    source: 'RabbitMQ Docs — AMQP 0-9-1 Model — Default Exchange',
  },

  {
    id: 'b05',
    topic: 'Durable Queues',
    question: 'What is the difference between a durable and a transient queue?',
    code: null,
    options: [
      'Durable queues survive broker restarts; transient queues do not',
      'Durable queues are faster; transient queues are slower',
      'Durable queues can hold more messages than transient queues',
      'Durable queues require authentication; transient queues do not',
    ],
    correctIndex: 0,
    explanation:
      'Marking a queue as durable causes RabbitMQ to persist its definition (not necessarily its messages) to disk. If the broker restarts, the queue reappears automatically. A transient (non-durable) queue exists only in memory and disappears on restart. Note that durability of the queue and persistence of messages are orthogonal properties: a durable queue holding non-persistent messages will lose those messages on restart, even though the queue itself survives.',
    compiledJS:
      '# Declare a durable queue via HTTP API\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/orders \\\n  -H "content-type: application/json" \\\n  -d \'{"durable": true, "arguments": {}}\'\n\n# Verify durability in rabbitmqctl\nrabbitmqctl list_queues name durable\n# orders   true\n# tmp.q    false',
    bestPractice:
      'Always declare queues as durable in production. Pair durable queues with persistent message delivery mode (delivery_mode=2) so that both the queue definition and message content survive restarts. Keep non-durable queues only for truly ephemeral use cases such as exclusive reply queues in the RPC pattern.',
    source: 'RabbitMQ Docs — Queues — Durability',
  },

  {
    id: 'b06',
    topic: 'Ack / Nack',
    question: 'What does a consumer send to RabbitMQ to confirm it has successfully processed a message?',
    code: null,
    options: [
      'A NACK',
      'A REJECT',
      'An ACK (acknowledgement)',
      'A CONFIRM',
    ],
    correctIndex: 2,
    explanation:
      'An ACK (basic.ack) tells RabbitMQ that the consumer has successfully processed the message and it can be safely removed from the queue. Until an ACK is received, the broker keeps the message in an unacknowledged state and will redeliver it if the consumer disconnects. This ensures at-least-once delivery: no message is lost due to a consumer crash mid-processing. The delivery tag in the ACK frame identifies exactly which message is being acknowledged.',
    compiledJS:
      '# Monitor unacknowledged messages per queue\nrabbitmqctl list_queues name messages_ready messages_unacknowledged\n# orders   0    3\n# → 3 messages delivered but not yet ACKed\n\n# If a consumer crashes, unacked messages requeue:\n# messages_unacknowledged drops back to 0\n# messages_ready rises by 3',
    bestPractice:
      'Always use manual acknowledgements in production (auto_ack=False). ACK only after your processing is confirmed complete — e.g., after a database write commits. Use channel-level prefetch (basic.qos) alongside manual acks to prevent a single consumer from hoarding hundreds of unprocessed messages. Never ACK inside a try block without ensuring the message is truly handled on error paths.',
    source: 'RabbitMQ Docs — Consumer Acknowledgements',
  },

  {
    id: 'b07',
    topic: 'Ack / Nack',
    question: 'What is the difference between basic.nack and basic.reject in RabbitMQ?',
    code: null,
    options: [
      'basic.nack supports bulk rejection of multiple messages; basic.reject handles only one message at a time',
      'basic.reject requeues the message; basic.nack discards it permanently',
      'basic.nack is only available in AMQP 1.0; basic.reject is AMQP 0-9-1',
      'There is no functional difference',
    ],
    correctIndex: 0,
    explanation:
      'basic.nack is a RabbitMQ extension to AMQP 0-9-1 that adds a "multiple" flag, allowing a single frame to reject all unacknowledged messages up to and including a given delivery tag. basic.reject is specified in the core AMQP 0-9-1 standard and can only reject one message at a time. Both support a "requeue" flag: when true the broker redelivers the message to a ready consumer; when false (and a DLX is configured) the message is dead-lettered.',
    compiledJS:
      '# AMQP 0-9-1 frame comparison\n# basic.reject — single message\n# method: basic.reject\n#   delivery-tag: 42\n#   requeue: false   → dead-letter or discard\n\n# basic.nack — multiple messages (RabbitMQ extension)\n# method: basic.nack\n#   delivery-tag: 42\n#   multiple: true   → reject tags 1..42\n#   requeue: true    → redeliver all to ready consumers',
    bestPractice:
      'Use basic.nack with multiple=true to bulk-reject messages when your consumer detects a poison-pill batch or a downstream service is unavailable. Combine with a DLX so rejected messages land in a dead-letter queue rather than being silently dropped. Avoid requeue=true in a tight loop — pair it with a backoff or a DLX with TTL to prevent storm requeuing.',
    source: 'RabbitMQ Docs — Consumer Acknowledgements — NACK',
  },

  {
    id: 'b08',
    topic: 'Management UI',
    question: 'Which RabbitMQ built-in plugin provides a browser-based management and monitoring dashboard?',
    code: null,
    options: [
      'rabbitmq_shovel',
      'rabbitmq_management',
      'rabbitmq_federation',
      'rabbitmq_stomp',
    ],
    correctIndex: 1,
    explanation:
      'The rabbitmq_management plugin bundles an HTTP API (port 15672 by default) and a React-based browser UI. It exposes endpoints for managing virtual hosts, users, exchanges, queues, bindings, and policies, and provides real-time charts for publish/deliver/ack rates, memory usage, and connection counts. The same HTTP API is used by rabbitmqadmin (the CLI wrapper), Terraform providers, and monitoring integrations.',
    compiledJS:
      '# Enable management plugin\nrabbitmq-plugins enable rabbitmq_management\n\n# Check its status\nrabbitmq-plugins list | grep management\n# [E*] rabbitmq_management       3.12.x\n# [E*] rabbitmq_management_agent 3.12.x\n\n# Default credentials (change immediately in prod!)\n# http://localhost:15672  guest / guest\n# guest is only allowed from localhost by default',
    bestPractice:
      'Never leave the default guest/guest credentials in place on any non-localhost-bound interface. Create per-operator user accounts with the minimum required tags (monitoring, management, or administrator). Expose the management port only on an internal network interface or behind an authenticating reverse proxy. For production alerting, consume the /api/queues endpoint with Prometheus rather than polling the UI.',
    source: 'RabbitMQ Docs — Management Plugin',
  },

  {
    id: 'b09',
    topic: 'Prefetch Count',
    question: 'What does the prefetch count (basic.qos) setting control in RabbitMQ?',
    code: null,
    options: [
      'The maximum number of queues a channel can subscribe to',
      'The maximum number of unacknowledged messages delivered to a consumer at once',
      'The maximum message size in bytes',
      'The maximum number of connections per virtual host',
    ],
    correctIndex: 1,
    explanation:
      'basic.qos prefetch_count limits the number of messages the broker will deliver to a consumer (on that channel) before waiting for acknowledgements. Once the in-flight unacknowledged count reaches the prefetch limit, the broker stops pushing new messages to that consumer. This provides back-pressure, prevents a slow consumer from accumulating an unbounded number of unprocessed messages in memory, and distributes work more evenly across multiple consumers of the same queue.',
    compiledJS:
      '# View per-consumer prefetch in management\ncurl -u guest:guest \\\n  "http://localhost:15672/api/consumers/%2F" \\\n  | jq \'.[].prefetch_count\'\n# 10\n# 10\n# → both consumers have prefetch=10\n\n# List channels with unacked counts\nrabbitmqctl list_channels\n#  prefetch_count  messages_unacknowledged\n#  10              7',
    bestPractice:
      'Set prefetch to 1 only if each message requires unpredictable time to process and fairness across consumers is critical. For throughput-optimised pipelines, experiment with prefetch values of 10–100 and benchmark. Never leave prefetch at 0 (unlimited) in production — it causes one fast consumer to absorb the entire queue depth before others can receive any messages.',
    source: 'RabbitMQ Docs — Consumer Prefetch',
  },

  {
    id: 'b10',
    topic: 'RabbitMQ vs DB',
    question: 'Why is RabbitMQ generally preferred over a relational database for task queue workloads?',
    code: null,
    options: [
      'RabbitMQ stores messages in SQL tables for easy querying',
      'RabbitMQ provides built-in push delivery, acknowledgements, and back-pressure without polling',
      'A database cannot persist data across restarts',
      'RabbitMQ automatically generates SQL schemas for task metadata',
    ],
    correctIndex: 1,
    explanation:
      'A message broker like RabbitMQ delivers messages via push, manages acknowledgements and redelivery natively, and supports back-pressure through prefetch — eliminating the need for costly polling loops against a database table. Database-backed queues (SELECT … FOR UPDATE SKIP LOCKED) incur row-level lock overhead, require your application to implement retries and TTL, and contend with OLTP traffic. RabbitMQ separates the messaging concern from your primary datastore.',
    compiledJS: null,
    bestPractice:
      'Use a message broker for asynchronous task dispatch and a database for business state. If you need exactly-once guarantees or durable workflow state, consider the transactional outbox pattern: write to both DB and a staging table in one transaction, then have a relay process forward staged events to RabbitMQ. This avoids dual-write inconsistency without sacrificing the broker\'s push-delivery benefits.',
    source: 'RabbitMQ Docs — Use Cases',
  },

  // ── Intermediate ──────────────────────────────────────────────────────────

  {
    id: 'i01',
    topic: 'Direct Exchange',
    question: 'How does a direct exchange route messages?',
    code: null,
    options: [
      'It broadcasts the message to every bound queue regardless of routing key',
      'It routes the message to queues whose binding key exactly matches the message\'s routing key',
      'It uses message header attributes to decide routing',
      'It routes based on wildcard patterns in the binding key',
    ],
    correctIndex: 1,
    explanation:
      'A direct exchange performs a case-sensitive exact string comparison between the message\'s routing key (set by the producer) and each queue\'s binding key. Only queues whose binding key matches exactly receive a copy of the message. If no binding matches, the message is silently discarded (or returned to the producer if mandatory=true is set). Multiple queues can share the same binding key — in that case all matching queues receive the message, turning direct into a limited multicast.',
    compiledJS:
      '# Declare exchange, queues, and bindings\nrabbitmqadmin declare exchange name=events type=direct durable=true\nrabbitmqadmin declare queue name=events.orders durable=true\nrabbitmqadmin declare binding \\\n  source=events destination=events.orders routing_key=order.created\n\n# Publish — will reach events.orders\nrabbitmqadmin publish exchange=events routing_key=order.created payload="{...}"\n\n# Publish — will NOT match — message dropped\nrabbitmqadmin publish exchange=events routing_key=order.updated payload="{...}"',
    bestPractice:
      'Use direct exchanges for precise event dispatch where each event type goes to exactly one consumer group. Define routing keys as dot-separated namespaced strings (e.g., order.created, payment.failed) and document them in a contract file checked into your repo. When you need multiple teams to consume the same event, bind multiple queues with the same key rather than switching to fanout, so you preserve per-consumer independence.',
    source: 'RabbitMQ Docs — Exchange Types — Direct',
  },

  {
    id: 'i02',
    topic: 'Fanout Exchange',
    question: 'What is the defining behaviour of a fanout exchange?',
    code: null,
    options: [
      'It routes messages only to queues whose binding key matches the routing key',
      'It broadcasts every message to all bound queues, completely ignoring the routing key',
      'It routes messages using wildcard patterns (* and #)',
      'It sends messages only to queues on the same node',
    ],
    correctIndex: 1,
    explanation:
      'A fanout exchange copies every incoming message to every queue currently bound to it, completely ignoring the routing key. This makes it ideal for pub/sub broadcast scenarios such as pushing cache-invalidation notifications to all application nodes or distributing log events to multiple consumers simultaneously. Adding a new subscriber is as simple as declaring a new queue and binding it — no producer changes are needed.',
    compiledJS:
      '# Declare fanout exchange and two subscriber queues\nrabbitmqadmin declare exchange name=notifications type=fanout durable=true\nrabbitmqadmin declare queue name=notif.email durable=true\nrabbitmqadmin declare queue name=notif.sms durable=true\nrabbitmqadmin declare binding source=notifications destination=notif.email\nrabbitmqadmin declare binding source=notifications destination=notif.sms\n\n# Publish once — both queues receive the message\nrabbitmqadmin publish exchange=notifications routing_key="" payload="user.signup"\n# notif.email: messages_ready=1\n# notif.sms:   messages_ready=1',
    bestPractice:
      'Use fanout for true broadcast scenarios where every subscriber must receive every message regardless of content. Give each subscriber service its own exclusive queue bound to the fanout exchange so consumer failures are isolated — if the SMS service crashes, the email service is unaffected. For selective broadcast (only some subscribers want some events), use topic exchange instead.',
    source: 'RabbitMQ Docs — Exchange Types — Fanout',
  },

  {
    id: 'i03',
    topic: 'Topic Exchange',
    question: "In a topic exchange binding key, what does the '#' wildcard match?",
    code: null,
    options: [
      'Exactly one dot-separated word',
      'Any single character',
      'Zero or more dot-separated words',
      'Only numeric characters',
    ],
    correctIndex: 2,
    explanation:
      "In a topic exchange, the '#' (hash) wildcard matches zero or more dot-delimited words in the routing key. The '*' (asterisk) wildcard matches exactly one word. For example, the binding key 'order.#' matches 'order.created', 'order.payment.failed', and even 'order' alone (zero trailing words). This hierarchical pattern language enables fine-grained selective subscriptions while keeping a single exchange for all related events.",
    compiledJS:
      '# Topic exchange routing key examples\n# Binding key        Matches                        Does NOT match\n# order.#            order.created                  payment.created\n#                    order.payment.failed\n#                    order  (zero trailing words)\n# order.*            order.created                  order.payment.failed\n#                    order.deleted\n# *.created          order.created                  order.payment.created\n#                    payment.created\n\n# Declare and bind\nrabbitmqadmin declare exchange name=events type=topic durable=true\nrabbitmqadmin declare queue name=all.order.events durable=true\nrabbitmqadmin declare binding source=events \\\n  destination=all.order.events routing_key="order.#"',
    bestPractice:
      'Design routing key hierarchies in decreasing specificity (e.g., domain.entity.action) so subscribers can use wildcard prefixes naturally. Avoid overly broad patterns like "#" on a shared topic exchange — they behave like a fanout and can overwhelm consumers not designed for high volume. Document all routing key patterns in a single schema file and enforce them with a CI check to prevent undocumented events from silently going undelivered.',
    source: 'RabbitMQ Docs — Exchange Types — Topic',
  },

  {
    id: 'i04',
    topic: 'Headers Exchange',
    question: 'How does a headers exchange decide which queues receive a message?',
    code: null,
    options: [
      'It matches the message routing key against binding key wildcards',
      'It ignores routing keys entirely and routes based on message header attributes matching binding arguments',
      'It round-robins messages across all bound queues',
      'It routes based on the message body content type',
    ],
    correctIndex: 1,
    explanation:
      'A headers exchange ignores the routing key completely and instead inspects the AMQP message headers table. Each binding carries a set of key-value arguments plus a special "x-match" argument that controls whether the match must be exact for ALL specified headers (x-match=all) or at least one (x-match=any). This enables rich content-based routing without encoding the routing criteria in the routing key string.',
    compiledJS:
      '# Binding a queue to a headers exchange\n# x-match=all: message must have BOTH headers\ncurl -u guest:guest -X POST \\\n  http://localhost:15672/api/bindings/%2F/e/reports/q/pdf.reports \\\n  -H "content-type: application/json" \\\n  -d \'{\n    "arguments": {\n      "x-match": "all",\n      "format": "pdf",\n      "region": "eu"\n    }\n  }\'\n\n# Only messages with headers {format:pdf, region:eu} reach pdf.reports\n# x-match=any would route on format=pdf OR region=eu',
    bestPractice:
      'Headers exchanges are powerful but harder to debug than direct/topic exchanges because the routing criteria are buried in binding arguments rather than visible routing keys. Prefer them only when routing criteria are truly multi-dimensional and cannot be conveniently encoded in a routing key. When you do use them, log the full header set on every published message and add management-UI dashboards showing binding arguments for quick troubleshooting.',
    source: 'RabbitMQ Docs — Exchange Types — Headers',
  },

  {
    id: 'i05',
    topic: 'Routing vs Binding Key',
    question: 'What is the conceptual difference between a routing key and a binding key in RabbitMQ?',
    code: null,
    options: [
      'They are identical — both terms refer to the same string set by the producer',
      'The routing key is set by the producer on the message; the binding key is set when a queue is bound to an exchange',
      'The binding key is set by the producer; the routing key is set on the queue',
      'Routing keys are only used by direct exchanges; binding keys are only used by topic exchanges',
    ],
    correctIndex: 1,
    explanation:
      'Producers stamp each published message with a routing key in the basic.publish AMQP frame — it describes the message\'s intent or category. Separately, an operator (or code) sets a binding key in the queue.bind frame when connecting a queue to an exchange — it describes the pattern the queue is interested in. The exchange compares the routing key of each incoming message against the binding keys of all its bindings to decide delivery. These are two distinct concepts that happen to be the same string type.',
    compiledJS:
      '# AMQP frames — conceptual\n# Producer frame (basic.publish):\n#   exchange:    "events"\n#   routing-key: "order.created"   ← routing key (set by producer)\n\n# Admin frame (queue.bind):\n#   queue:       "order.processor"\n#   exchange:    "events"\n#   routing-key: "order.created"   ← binding key (set at bind time)\n\n# On a direct exchange: exact string match\n# On a topic exchange:  wildcard pattern match\n# On a fanout exchange: binding key is ignored entirely',
    bestPractice:
      'Treat routing keys as part of your event contract — version them (v1.order.created) when the schema changes to avoid breaking consumers that have not updated their bindings. Store binding key patterns alongside the queue definitions in your IaC (infrastructure-as-code) repository so that adding a new consumer is an explicit, reviewed change rather than a silent ad-hoc operation.',
    source: 'RabbitMQ Docs — AMQP 0-9-1 Model — Bindings',
  },

  {
    id: 'i06',
    topic: 'DLX',
    question: 'How is a Dead Letter Exchange (DLX) configured for a queue?',
    code: null,
    options: [
      "By setting the 'x-dead-letter-exchange' argument when declaring the queue",
      "By publishing directly to an exchange named 'dlx'",
      'By enabling the rabbitmq_dlx plugin',
      "By setting the 'dead-letter' property on each message individually",
    ],
    correctIndex: 0,
    explanation:
      "A DLX is assigned by passing the 'x-dead-letter-exchange' argument in the queue.declare arguments table. When a message is rejected (nack/reject with requeue=false), expires (TTL), or causes the queue to exceed its x-max-length limit, the broker republishes it to the specified DLX. An optional 'x-dead-letter-routing-key' argument overrides the original routing key on dead-lettered messages. There is no separate plugin — DLX support is built into the core broker.",
    compiledJS:
      '# Declare a queue with DLX configured\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/orders \\\n  -H "content-type: application/json" \\\n  -d \'{\n    "durable": true,\n    "arguments": {\n      "x-dead-letter-exchange": "orders.dlx",\n      "x-dead-letter-routing-key": "failed",\n      "x-message-ttl": 30000,\n      "x-max-length": 10000\n    }\n  }\'\n\n# Messages that expire, are nacked, or overflow go to orders.dlx\n# with routing key "failed" instead of their original routing key',
    bestPractice:
      'Always configure a DLX on production queues so that rejected or expired messages are preserved for analysis rather than silently dropped. Pair the DLX with a dedicated dead-letter queue and an alert on its depth — a growing DLX queue is a reliable signal of processing errors or misconfigured consumers. Periodically reprocess DLX messages by republishing them to the original exchange after fixing the underlying bug.',
    source: 'RabbitMQ Docs — Dead Letter Exchanges',
  },

  {
    id: 'i07',
    topic: 'Message TTL',
    question: 'What is the difference between setting a message TTL per-queue versus per-message?',
    code: null,
    options: [
      'Per-queue TTL applies to all messages in that queue via x-message-ttl; per-message TTL is set in the message expiration property and may vary per message',
      'Per-message TTL is always higher priority and overrides any queue TTL',
      'Per-queue TTL requires a plugin; per-message TTL is built-in',
      'There is no difference — both cause identical broker behaviour',
    ],
    correctIndex: 0,
    explanation:
      'x-message-ttl is a queue-level argument (or policy key) that sets the maximum lifetime for all messages in that queue — any message that has sat undelivered longer than this value is expired and dead-lettered (if a DLX is configured) or dropped. The per-message expiration property sets TTL on an individual message and can differ from message to message. RabbitMQ applies whichever limit expires first: if both are set, the lower of the two wins.',
    compiledJS:
      '# Queue-level TTL (all messages expire after 60 seconds)\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/session.events \\\n  -d \'{"durable":true,"arguments":{"x-message-ttl":60000}}\'\n\n# Per-message TTL in AMQP properties\n# (Python pika example)\nchannel.basic_publish(\n    exchange="events",\n    routing_key="session.started",\n    body=payload,\n    properties=pika.BasicProperties(\n        expiration="10000",   # 10 s for this message only\n        delivery_mode=2\n    )\n)\n# Effective TTL = min(queue x-message-ttl, message expiration)',
    bestPractice:
      'Use queue-level TTL for time-sensitive workloads where all messages have a uniform deadline (e.g., OTP codes, session events). Use per-message TTL sparingly — it complicates reasoning about queue depth and can create a head-of-line blocking effect because expired messages in the middle of the queue are only evicted when they reach the head. When in doubt, prefer queue-level TTL combined with a DLX for dead messages.',
    source: 'RabbitMQ Docs — TTL',
  },

  {
    id: 'i08',
    topic: 'Publisher Confirms',
    question: 'What is the key advantage of publisher confirms over AMQP transactions (tx.select/tx.commit) in RabbitMQ?',
    code: null,
    options: [
      'Publisher confirms are synchronous and block the channel until the broker commits',
      'Publisher confirms provide asynchronous, lightweight acknowledgement without the heavyweight two-phase commit overhead of transactions',
      'AMQP transactions support batch commits; publisher confirms do not',
      'Publisher confirms are only available for quorum queues',
    ],
    correctIndex: 1,
    explanation:
      'Publisher confirms are a RabbitMQ-specific extension that allows the broker to asynchronously acknowledge each message once it has been persisted and enqueued. The producer can pipeline multiple publishes without waiting for each ack, achieving throughput close to fire-and-forget while still detecting dropped or nacked messages. AMQP 0-9-1 transactions (tx.select / tx.commit) use a synchronous two-phase commit that serialises every publish, causing throughput to drop by up to an order of magnitude.',
    compiledJS:
      '# Throughput comparison (approximate, single producer, durable queue)\n# Fire-and-forget:    ~50,000 msg/s\n# Publisher confirms: ~25,000 msg/s (batched acks)\n# AMQP transactions:  ~2,000  msg/s  ← ~25x slower\n\n# Enable confirms on a channel (rabbitmqadmin does not support this;\n# shown as pseudocode for clarity)\nchannel.confirm_select()       # puts channel in confirm mode\nchannel.basic_publish(...)     # send n messages\nchannel.wait_for_confirms()    # block until all acked/nacked\n# nacked delivery-tags → republish or alert',
    bestPractice:
      'Use publisher confirms in async batched mode rather than waiting synchronously after every single message. Collect delivery tags as you publish and reconcile nacks in a callback. Never use AMQP transactions for new code — they exist for legacy compatibility. For at-least-once guarantee, combine publisher confirms with durable queues and persistent messages (delivery_mode=2).',
    source: 'RabbitMQ Docs — Publisher Confirms',
  },

  {
    id: 'i09',
    topic: 'Shovel Plugin',
    question: 'What is the primary purpose of the RabbitMQ Shovel plugin?',
    code: null,
    options: [
      'To mirror queues across cluster nodes for high availability',
      'To reliably move or copy messages from a source queue/exchange to a destination queue/exchange, potentially across brokers',
      'To expose queues via an HTTP REST API',
      'To compress message payloads before storage',
    ],
    correctIndex: 1,
    explanation:
      'The Shovel plugin continuously consumes messages from a source (a queue or exchange on one broker) and republishes them to a destination (a queue or exchange on the same or a different broker), ACKing each message only after successful delivery to the destination. This provides reliable, resumable message migration between environments, broker versions, or geographically separate clusters. Shovels can be static (configured in rabbitmq.conf) or dynamic (created at runtime via the HTTP API).',
    compiledJS:
      '# Create a dynamic shovel via HTTP API\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/parameters/shovel/%2F/migrate-orders \\\n  -H "content-type: application/json" \\\n  -d \'{\n    "value": {\n      "src-protocol": "amqp091",\n      "src-uri": "amqp://source-broker:5672",\n      "src-queue": "orders",\n      "dest-protocol": "amqp091",\n      "dest-uri": "amqp://dest-broker:5672",\n      "dest-queue": "orders.migrated",\n      "ack-mode": "on-confirm"\n    }\n  }\'',
    bestPractice:
      'Use Shovel for point-to-point message migration, disaster recovery failover, or draining a legacy broker before decomissioning it. For long-lived cross-datacenter topologies, prefer Federation (which is designed for loosely coupled, independently managed brokers) over Shovel. Always set ack-mode to on-confirm so the source message is ACKed only after the destination confirms receipt, preventing message loss during network interruptions.',
    source: 'RabbitMQ Docs — Shovel Plugin',
  },

  {
    id: 'i10',
    topic: 'Quorum Queues',
    question: 'What is the main architectural difference between quorum queues and classic mirrored queues?',
    code: null,
    options: [
      'Quorum queues use Raft consensus for replication; classic mirrored queues use asynchronous master-mirror replication',
      'Classic mirrored queues are faster because they use Raft; quorum queues use two-phase commit',
      'Quorum queues can only exist on a single node; mirrored queues span the whole cluster',
      'There is no difference — quorum queues are simply renamed mirrored queues',
    ],
    correctIndex: 0,
    explanation:
      'Quorum queues implement the Raft distributed consensus algorithm so that every enqueue is replicated to a majority of member nodes before being confirmed to the publisher, providing strong data safety guarantees. Classic mirrored queues (now deprecated) used asynchronous master-mirror replication: the master accepted messages immediately and propagated to mirrors in the background, risking data loss if the master failed before replication completed. Quorum queues also eliminate the split-brain risk that plagued mirrored queues.',
    compiledJS:
      '# Declare a quorum queue\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/orders \\\n  -H "content-type: application/json" \\\n  -d \'{\n    "durable": true,\n    "arguments": {\n      "x-queue-type": "quorum",\n      "x-quorum-initial-group-size": 3\n    }\n  }\'\n\n# Verify replication state\nrabbitmqctl list_queues name type leader members\n# orders   quorum   rabbit@node1   [rabbit@node1, rabbit@node2, rabbit@node3]',
    bestPractice:
      'Use quorum queues for all new production workloads that require durability and HA. Migrate away from classic mirrored queues — they were deprecated in RabbitMQ 3.9 and removed in 4.0. Size quorum queue membership at 3 or 5 nodes (always odd) to maintain a quorum during single-node failures. Quorum queues do not support per-message priority and have slightly higher write latency than classic queues — factor this in for latency-sensitive pipelines.',
    source: 'RabbitMQ Docs — Quorum Queues',
  },

  // ── Advanced ──────────────────────────────────────────────────────────────

  {
    id: 'a01',
    topic: 'Channel Multiplexing',
    question: 'How does AMQP 0-9-1 enable multiple logical communication streams over a single TCP connection in RabbitMQ?',
    code: null,
    options: [
      'By opening multiple TCP sockets bundled into one connection object',
      'Through channels — lightweight virtual connections multiplexed over a single TCP connection',
      'By using HTTP/2 stream multiplexing within the AMQP framing',
      'By encoding each logical stream as a separate virtual host',
    ],
    correctIndex: 1,
    explanation:
      'AMQP 0-9-1 multiplexes channels over a single TCP connection. Each channel is an independent logical stream identified by a channel number in the AMQP frame header. Channels have their own state machines (open, closing, closed), their own QoS settings, and can operate concurrently on the same TCP connection. This avoids the overhead of establishing a new TCP connection (and TLS handshake) per thread or operation while still providing isolation between concurrent workflows.',
    compiledJS:
      '# AMQP frame structure (simplified)\n# +--------+------+--------+--..--+------+\n# | type   | chan | size   | body | 0xCE |\n# +--------+------+--------+--..--+------+\n# type: 1=method, 2=header, 3=body, 4=heartbeat\n# chan: channel number (0 = connection-level)\n\n# View open channels per connection in management\ncurl -u guest:guest \\\n  "http://localhost:15672/api/channels" \\\n  | jq \'.[] | {connection: .connection_details.name, number: .number}\'',
    bestPractice:
      'Use one channel per thread or async task — channels are not thread-safe in most client libraries. Do not use a single channel for both publish and consume operations in the same goroutine/thread; use separate channels to avoid head-of-line blocking. Keep total channel count per connection below a few hundred; beyond that, consider opening additional connections or using a connection pool. Close unused channels promptly to free broker-side state.',
    source: 'AMQP 0-9-1 Specification — Channels',
  },

  {
    id: 'a02',
    topic: 'Flow Control',
    question: 'What does the AMQP 0-9-1 channel.flow mechanism do?',
    code: null,
    options: [
      'It increases the prefetch window dynamically when the consumer is idle',
      'It allows the broker or client to pause/resume message delivery on a channel to apply back-pressure',
      'It migrates a channel from one TCP connection to another without interruption',
      "It flushes all pending messages from a channel's internal buffer to disk",
    ],
    correctIndex: 1,
    explanation:
      'channel.flow is an AMQP 0-9-1 method that either the broker or the client can send to pause (active=false) or resume (active=true) the flow of content on a specific channel. The broker uses it when internal memory or disk alarms trigger, preventing producers from overwhelming the broker. Clients can also send it to temporarily halt delivery from a consumer. Modern RabbitMQ relies primarily on credit-based flow control (introduced in 3.x) rather than channel.flow, but the frame remains part of the protocol.',
    compiledJS:
      '# Broker-side flow control alarm thresholds\n# rabbitmq.conf:\nmemory_high_watermark.relative = 0.4   # 40% of RAM → memory alarm\ndisk_free_limit.absolute = 2GB          # < 2 GB free → disk alarm\n\n# When alarm fires, broker sends channel.flow(active=false)\n# to all publisher channels.\n# Management shows connection state:\ncurl -u guest:guest \\\n  "http://localhost:15672/api/connections" \\\n  | jq \'.[] | {name:.name, state:.state}\'\n# {"name":"...","state":"flow"}  ← connection under flow control',
    bestPractice:
      'Monitor for connection state="flow" in the management API or Prometheus — it is a leading indicator that the broker is under memory or disk pressure before a hard block occurs. Tune the memory watermark conservatively (0.4–0.6) rather than raising it to avoid OOM kills. On the producer side, implement exponential backoff when you detect channel.flow(active=false) to avoid tight loops. Address the root cause (slow consumers, undersized broker) rather than simply raising the watermark.',
    source: 'RabbitMQ Docs — Flow Control',
  },

  {
    id: 'a03',
    topic: 'Lazy Queues',
    question: 'What is the primary operational benefit of declaring a queue as a lazy queue?',
    code: null,
    options: [
      'Lazy queues skip acknowledgement processing to increase throughput',
      'Lazy queues write messages directly to disk as they arrive rather than keeping them in memory, reducing RAM usage for deep queues',
      'Lazy queues replicate to disk only when the node restarts',
      'Lazy queues defer binding evaluation until a consumer connects',
    ],
    correctIndex: 1,
    explanation:
      'Lazy queues move messages to disk as soon as possible instead of keeping them in the in-memory message buffer. This significantly reduces the broker\'s RAM footprint when queues accumulate a large backlog — e.g., when consumers fall behind. The trade-off is slightly higher per-message latency on delivery due to disk I/O. As of RabbitMQ 3.12, classic queues default to lazy-mode-like behaviour, and in RabbitMQ 4.x the queue_mode setting has been removed in favour of always-on lazy semantics for classic queues.',
    compiledJS:
      '# Declare a lazy classic queue\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/bulk.imports \\\n  -H "content-type: application/json" \\\n  -d \'{\n    "durable": true,\n    "arguments": {\n      "x-queue-mode": "lazy"\n    }\n  }\'\n\n# Convert an existing queue via policy (no redeclare needed)\nrabbitmqctl set_policy lazy-mode "^bulk\\." \\\n  \'{"queue-mode":"lazy"}\' --apply-to queues',
    bestPractice:
      'Apply lazy mode (or use quorum queues, which are inherently disk-first) for batch import, ETL, or audit-log queues that may accumulate millions of messages overnight. Avoid lazy mode for latency-sensitive queues where sub-millisecond dequeue is required. Monitor rabbitmq_queue_disk_reads_total and rabbitmq_queue_disk_writes_total in Prometheus to measure I/O impact, and size broker disk with at least 3× the expected peak queue depth.',
    source: 'RabbitMQ Docs — Lazy Queues',
  },

  {
    id: 'a04',
    topic: 'Federation Plugin',
    question: 'What is the key architectural difference between the Federation plugin and the Shovel plugin?',
    code: null,
    options: [
      'Federation links are permanent; Shovel links are temporary and delete themselves after a single message',
      'Federation provides loosely coupled, broker-to-broker exchange/queue linking with autonomous nodes; Shovel is a simple point-to-point message mover that requires tight coupling',
      'Shovel supports AMQP 1.0; Federation only supports AMQP 0-9-1',
      'They are functionally identical — Federation is just the newer name for Shovel',
    ],
    correctIndex: 1,
    explanation:
      'Federation is designed for loosely coupled topologies where each RabbitMQ broker remains fully independent — it federates exchanges or queues so that messages flow between upstream and downstream brokers on demand, without either side knowing the topology details of the other. Shovel is a lower-level tool that simply consumes from a source queue/exchange and republishes to a destination; it is tightly coupled (both endpoints must be configured explicitly) and is better suited for point-to-point migration tasks. Federation supports multi-hop propagation; Shovel does not.',
    compiledJS:
      '# Federation: upstream declaration on downstream broker\ncurl -u guest:guest -X PUT \\\n  http://downstream:15672/api/parameters/federation-upstream/%2F/us-east \\\n  -H "content-type: application/json" \\\n  -d \'{\n    "value": {\n      "uri": "amqp://upstream-broker:5672",\n      "expires": 3600000\n    }\n  }\'\n\n# Apply federation policy to all exchanges matching "^federated\\."\nrabbitmqctl set_policy federate-events "^federated\\." \\\n  \'{"federation-upstream-set":"all"}\' \\\n  --apply-to exchanges',
    bestPractice:
      'Use Federation for geographically distributed deployments where each datacenter runs an independent cluster and you want events to propagate across regions without tight coupling. Use Shovel when you need deterministic point-to-point message movement (e.g., draining a queue from a decommissioned broker). Never use both for the same queue/exchange pair — the interaction can cause unexpected message duplication.',
    source: 'RabbitMQ Docs — Federation Plugin',
  },

  {
    id: 'a05',
    topic: 'Consistent Hash Exchange',
    question: 'What does the consistent hash exchange plugin accomplish that a standard direct or topic exchange cannot?',
    code: null,
    options: [
      'It routes messages to exactly one queue chosen by a consistent hash of the routing key, distributing load while keeping messages with the same key on the same queue',
      'It replicates messages to all bound queues using a hash-based deduplication mechanism',
      'It hashes the message body for integrity verification before routing',
      'It ensures round-robin delivery across queues regardless of routing key',
    ],
    correctIndex: 0,
    explanation:
      'The consistent hash exchange plugin uses a hash of the routing key (or a specified message property/header) to deterministically select one queue from the bound set, always sending messages with the same routing key to the same queue. This enables ordered, per-key partitioning across multiple consumer queues — similar to Kafka partition assignment — while evenly distributing load as the number of queues scales. Unlike simple round-robin, messages with the same key are not scattered across queues.',
    compiledJS:
      '# Install the plugin\nrabbitmq-plugins enable rabbitmq_consistent_hash_exchange\n\n# Declare a consistent hash exchange\nrabbitmqadmin declare exchange \\\n  name=orders.partitioned \\\n  type=x-consistent-hash \\\n  durable=true\n\n# Bind 3 queues with weight "1" each (equal distribution)\nrabbitmqadmin declare binding \\\n  source=orders.partitioned destination=orders.p1 routing_key="1"\nrabbitmqadmin declare binding \\\n  source=orders.partitioned destination=orders.p2 routing_key="1"\nrabbitmqadmin declare binding \\\n  source=orders.partitioned destination=orders.p3 routing_key="1"\n# Weight "2" would give that queue double the hash ring slots',
    bestPractice:
      'Use the consistent hash exchange when you need ordered processing of messages that share a natural partition key (e.g., user_id, order_id) across multiple parallel consumer queues. Bind queues with equal weights for uniform distribution, or use higher weights for queues on more powerful nodes. Remember that adding or removing bound queues causes re-hashing, potentially sending subsequent messages for a given key to a different queue — plan migrations carefully.',
    source: 'RabbitMQ Docs — Consistent Hash Exchange Plugin',
  },

  {
    id: 'a06',
    topic: 'Clustering',
    question: 'In a RabbitMQ cluster, what is the functional difference between disc nodes and RAM nodes?',
    code: null,
    options: [
      'Disc nodes persist broker metadata (queues, exchanges, bindings, users) to disk; RAM nodes keep all metadata only in memory for lower latency writes',
      'RAM nodes handle message routing; disc nodes handle only persistent message storage',
      'Disc nodes can host quorum queues; RAM nodes cannot',
      'The terms are deprecated — all modern RabbitMQ nodes are identical',
    ],
    correctIndex: 0,
    explanation:
      'Disc nodes write cluster metadata (queue definitions, exchange definitions, bindings, users, vhosts, policies) to disk so the cluster can restart and recover its topology. RAM nodes store all metadata only in memory, giving slightly faster metadata writes but no persistence across restarts. Message content is stored according to the queue\'s durability and message persistence settings, not the node type — a RAM node still writes persistent message bodies to disk. At least one disc node must always be reachable for the cluster to accept topology changes.',
    compiledJS:
      '# Check node types in a cluster\nrabbitmqctl cluster_status\n# Disk Nodes:  rabbit@node1, rabbit@node2\n# RAM Nodes:   rabbit@node3\n# Running:     rabbit@node1, rabbit@node2, rabbit@node3\n\n# Change a node to RAM type (requires restart)\nrabbitmqctl change_cluster_node_type ram\n\n# RabbitMQ 3.12+ recommendation:\n# RAM nodes provide minimal benefit in modern hardware;\n# use disc nodes for all cluster members.',
    bestPractice:
      'In modern deployments (RabbitMQ 3.12+), use disc nodes exclusively. The performance advantage of RAM nodes has diminished as hardware costs dropped, and RAM nodes introduce operational risk: if all RAM nodes restart simultaneously the cluster loses its entire topology and requires a complete reconfiguration. The RabbitMQ team officially recommends against RAM nodes for new clusters.',
    source: 'RabbitMQ Docs — Clustering Guide — Disc and RAM Nodes',
  },

  {
    id: 'a07',
    topic: 'Raft Consensus',
    question: 'How do quorum queues use the Raft consensus algorithm to guarantee data safety?',
    code: null,
    options: [
      'A message is considered confirmed only after a majority (quorum) of replicas have written it, ensuring no data loss even if a minority of nodes fail',
      'Raft is used only for leader election; message storage uses a separate two-phase commit protocol',
      'Quorum queues write to all replicas synchronously and require unanimous acknowledgement',
      'Raft ensures messages are deduplicated across all cluster nodes',
    ],
    correctIndex: 0,
    explanation:
      'Quorum queues implement Raft so that each enqueue operation is appended to the Raft log and replicated to a quorum (majority) of member nodes before the leader acknowledges the write to the publisher. With 3 members the cluster tolerates 1 node failure; with 5 members it tolerates 2. Leader election is also managed by Raft: when the leader fails, the remaining majority elects a new leader without manual intervention. This makes quorum queues resilient to the split-brain data loss that affected classic mirrored queues.',
    compiledJS:
      '# Inspect quorum queue Raft state\nrabbitmq-diagnostics quorum_status orders\n# Leader:  rabbit@node1\n# Members: [rabbit@node1, rabbit@node2, rabbit@node3]\n# Log Index:       12345\n# Commit Index:    12344  ← 1 entry pending replication\n\n# Check for under-replicated queues\ncurl -u guest:guest \\\n  "http://localhost:15672/api/queues/%2F" \\\n  | jq \'.[] | select(.type=="quorum") | {name:.name, members:.quorum_spi}\'',
    bestPractice:
      'Deploy quorum queues with an odd number of members (3 or 5) to always maintain a clear majority. Do not shrink a 3-member quorum queue to 2 members — the cluster loses its ability to tolerate any single failure. Monitor the "under-replicated" metric in Prometheus (rabbitmq_quorum_queue_underreplicated) and alert on it immediately — an under-replicated queue is degraded and a second failure would make it unavailable. Avoid co-locating all quorum members on the same physical rack or AZ.',
    source: 'RabbitMQ Docs — Quorum Queues — Raft',
  },

  {
    id: 'a08',
    topic: 'Policy vs Argument Precedence',
    question: 'When both a per-queue policy and a queue declaration argument (e.g., x-message-ttl) are set for the same queue, which takes precedence in RabbitMQ?',
    code: null,
    options: [
      'Policies always win over declaration arguments',
      'Declaration arguments always win over policies',
      'Declaration arguments (set at queue creation) take precedence over policies for the same key',
      'Both are merged additively — neither overrides the other',
    ],
    correctIndex: 2,
    explanation:
      'For queue parameters such as x-message-ttl, x-dead-letter-exchange, x-max-length, and x-max-length-bytes, queue declaration arguments take precedence over policy values when both specify the same key. Declaration arguments are set at queue creation time and are immutable (the queue must be deleted and recreated to change them), while policies are dynamic and can be updated live. This precedence means a developer who hardcodes x-message-ttl in the queue declaration argument will silently override any operator policy for that key.',
    compiledJS:
      '# Policy sets TTL to 60000 ms\nrabbitmqctl set_policy ttl-policy "^orders$" \\\n  \'{"message-ttl":60000}\' --apply-to queues\n\n# But queue was declared with x-message-ttl=10000\n# → effective TTL = 10000 (argument wins)\n\n# Verify effective parameters\ncurl -u guest:guest \\\n  "http://localhost:15672/api/queues/%2F/orders" \\\n  | jq .effective_policy_definition\n# {"message-ttl": 10000}  ← from declaration argument\n# policy definition shows 60000 but is overridden',
    bestPractice:
      'Avoid setting queue parameters in both declaration arguments and policies — choose one mechanism per parameter and document the choice. Prefer policies for operator-managed parameters (TTL, max-length, DLX) so they can be updated without downtime or queue recreation. If a queue was declared with hardcoded arguments and you need to change them, you must delete and redeclare the queue (during a maintenance window or via a blue-green migration).',
    source: 'RabbitMQ Docs — Parameters and Policies',
  },

  {
    id: 'a09',
    topic: 'Monitoring',
    question: 'Which pair of RabbitMQ management metrics most directly indicates that consumers are falling behind message producers?',
    code: null,
    options: [
      'publish_rate and deliver_rate — when publish_rate consistently exceeds deliver_rate, messages_ready will grow',
      'memory_used and disk_free — a rising memory_used with falling disk_free shows consumer lag',
      'connection_count and channel_count — too many channels indicates consumer backlog',
      'node_uptime and gc_reclaim_rate — high GC activity confirms consumer lag',
    ],
    correctIndex: 0,
    explanation:
      "When publish_rate consistently exceeds deliver_rate, the messages_ready counter grows, confirming that consumers cannot keep pace with producers. Simultaneously watching messages_unacknowledged rising reveals that in-flight messages are not being acked quickly enough. Together, messages_ready + messages_unacknowledged give the total queue depth. Memory and disk metrics are secondary symptoms (queue depth causes memory pressure), not the primary diagnostic signal for consumer lag.",
    compiledJS:
      '# Key metrics via management HTTP API\ncurl -u guest:guest \\\n  "http://localhost:15672/api/queues/%2F/orders" \\\n  | jq \'{\n      ready:        .messages_ready,\n      unacked:      .messages_unacknowledged,\n      publish_rate: .message_stats.publish_details.rate,\n      deliver_rate: .message_stats.deliver_details.rate\n    }\'\n# {"ready":4500,"unacked":10,"publish_rate":120,"deliver_rate":30}\n# → publish 4× faster than delivery: backlog growing at ~90 msg/s',
    bestPractice:
      'Set Prometheus alerts on messages_ready crossing a threshold (e.g., > 10,000 for a latency-sensitive queue) and on a sustained positive delta of (publish_rate - deliver_rate) over a 5-minute window. Pair the alert with a consumer-count check: if consumers are zero, page immediately. Export RabbitMQ metrics via the rabbitmq_prometheus plugin and build dashboards that show queue depth alongside consumer count and node memory so you can distinguish consumer failure from simply slow consumers.',
    source: 'RabbitMQ Docs — Monitoring — Key Metrics',
  },

  {
    id: 'a10',
    topic: 'Graceful Shutdown',
    question: 'What is the recommended approach for graceful consumer shutdown in RabbitMQ to avoid message loss?',
    code: null,
    options: [
      'Kill the process immediately — RabbitMQ will automatically requeue any unacknowledged messages',
      'Cancel the consumer subscription, finish processing all in-flight messages, send ACKs or NACKs for each, then close the channel and connection',
      'Call basic.reject on all messages, then close the TCP connection without sending a connection.close frame',
      'Set prefetch to 0 and wait for the broker to drain the queue before closing',
    ],
    correctIndex: 1,
    explanation:
      'Graceful consumer shutdown requires several ordered steps: first cancel the consumer (basic.cancel) to stop new deliveries, then finish processing every message already in the local buffer, then explicitly ACK or NACK each one, then close the channel with channel.close, and finally close the connection with connection.close. While the broker will eventually requeue unacknowledged messages when the TCP connection drops, relying on that mechanism can delay redelivery and may cause duplicate processing in edge cases. An orderly shutdown is faster and more predictable.',
    compiledJS:
      '# Graceful shutdown sequence (pseudocode)\n# 1. Signal handler receives SIGTERM\nsignal.SIGTERM → begin_shutdown()\n\n# 2. Cancel consumer — no more deliveries\nchannel.basic_cancel(consumer_tag)\n\n# 3. Wait for in-flight messages to complete\n#    (drain internal processing queue with timeout)\nwait_for_inflight(timeout=30s)\n\n# 4. ACK/NACK all processed messages\nfor msg in processed:\n    channel.basic_ack(msg.delivery_tag)\n\n# 5. Clean close\nchannel.close(reply_code=200)\nconnection.close(reply_code=200)',
    bestPractice:
      'Register a SIGTERM handler in every consumer process that triggers the graceful shutdown sequence. Set a maximum drain timeout (typically 30–60 s) so a stuck message does not block the shutdown indefinitely — NACK with requeue=true after the timeout expires. In Kubernetes, set terminationGracePeriodSeconds to a value longer than your drain timeout so the pod is not SIGKILL-ed before it finishes. Test your shutdown path in staging by sending SIGTERM and verifying zero message loss in the dead-letter queue.',
    source: 'RabbitMQ Docs — Consumer Acknowledgements — Graceful Shutdown',
  },
]
