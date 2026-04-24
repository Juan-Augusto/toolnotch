import type { InterviewQuestion } from '@/lib/interviewTypes'

export const MESSAGING_SQS_KAFKA_QUESTIONS: InterviewQuestion[] = [
  // ── Beginner ──────────────────────────────────────────────────────────────────

  {
    id: 'b01',
    topic: 'Message Queues',
    question: 'What is the primary purpose of a message queue in a distributed system?',
    code: null,
    options: [
      'To store data permanently in a relational database',
      'To decouple producers and consumers so they can operate independently',
      'To synchronize HTTP requests between microservices',
      'To provide a shared in-memory cache for services',
    ],
    correctIndex: 1,
    explanation:
      'A message queue decouples producers from consumers, allowing each side to run at its own pace without direct synchronization. The producer sends a message and moves on; the consumer processes it whenever it is ready. This decoupling improves resilience: if the consumer is temporarily unavailable, messages queue up rather than causing the producer to fail. It also enables independent scaling of the two sides, which is a foundational principle in event-driven and microservice architectures.',
    compiledJS: `// Producer (Order Service) — does NOT call Consumer directly
aws sqs send-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/order-queue \\
  --message-body '{"orderId":"abc","total":49.99}'
# Producer immediately returns; Consumer is invoked separately

// Consumer (Fulfillment Service) — runs on its own schedule
aws sqs receive-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/order-queue \\
  --max-number-of-messages 10
# If consumer is offline, messages wait — producer never blocks`,
    bestPractice:
      'In production, always pair queue-based decoupling with a Dead Letter Queue so that messages that repeatedly fail are captured for inspection rather than silently lost. Use CloudWatch metrics on ApproximateNumberOfMessagesVisible to detect when consumers are falling behind and trigger auto-scaling.',
    source: 'AWS Docs — Amazon SQS: How It Works',
  },

  {
    id: 'b02',
    topic: 'Producer/Consumer',
    question: 'In the producer/consumer model, what is the role of a producer?',
    code: null,
    options: [
      'It reads and processes messages from the queue',
      'It manages the queue infrastructure and routing rules',
      'It sends messages to the queue for downstream processing',
      'It monitors queue depth and triggers auto-scaling',
    ],
    correctIndex: 2,
    explanation:
      'A producer publishes messages into the queue; a consumer reads and processes those messages on the other end. Producers and consumers know nothing about each other — they only share knowledge of the queue or topic name. This separation of concerns means you can replace, scale, or modify a consumer without changing any producer code. In Kafka, producers write to a topic; in SQS, they call SendMessage against a queue URL.',
    compiledJS: `// Producer: write a message (Kafka example)
const { Kafka } = require('kafkajs')
const kafka = new Kafka({ clientId: 'order-svc', brokers: ['broker:9092'] })
const producer = kafka.producer()
await producer.connect()
await producer.send({
  topic: 'orders',
  messages: [{ key: 'order-1', value: JSON.stringify({ orderId: 1, total: 99 }) }],
})
await producer.disconnect()

// Consumer: read messages
const consumer = kafka.consumer({ groupId: 'fulfillment-group' })
await consumer.connect()
await consumer.subscribe({ topic: 'orders', fromBeginning: false })
await consumer.run({ eachMessage: async ({ message }) => {
  console.log('Processing:', message.value?.toString())
}})`,
    bestPractice:
      'Producers should always serialize messages using a versioned schema (Avro/Protobuf with a schema registry) rather than raw JSON strings — this prevents deserialization failures when the payload shape changes. Set acks=all on Kafka producers to ensure the message is confirmed by all ISR replicas before the send call returns.',
    source: 'Apache Kafka Docs — Producer API',
  },

  {
    id: 'b03',
    topic: 'SQS Basics',
    question: 'What is Amazon SQS?',
    code: null,
    options: [
      'A fully managed relational database service from AWS',
      'A fully managed message queuing service from AWS',
      'An open-source distributed streaming platform',
      'A serverless compute engine for batch jobs',
    ],
    correctIndex: 1,
    explanation:
      'Amazon SQS (Simple Queue Service) is a fully managed, serverless message queuing service offered by AWS. It eliminates the operational overhead of running and scaling a message broker: AWS handles availability, durability, and scaling automatically. SQS supports Standard queues (best-effort ordering, at-least-once delivery, nearly unlimited throughput) and FIFO queues (strict ordering, exactly-once processing, up to 3,000 TPS with batching). Messages are retained from 1 minute to 14 days and are stored redundantly across multiple availability zones.',
    compiledJS: `# Create a Standard SQS queue
aws sqs create-queue --queue-name my-orders

# Send a message
aws sqs send-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123456789/my-orders \\
  --message-body '{"event":"ORDER_PLACED","orderId":"xyz"}'

# Receive and delete a message
MSG=$(aws sqs receive-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123456789/my-orders \\
  --query 'Messages[0]')
RECEIPT=$(echo $MSG | jq -r '.ReceiptHandle')
aws sqs delete-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123456789/my-orders \\
  --receipt-handle "$RECEIPT"`,
    bestPractice:
      'Always enable server-side encryption (SSE) on SQS queues using AWS KMS for queues that carry sensitive data. Configure a Dead Letter Queue with a redrive policy (maxReceiveCount: 3–5) from day one — finding out a bug has silently discarded messages in production is very expensive.',
    source: 'AWS Docs — Amazon SQS Developer Guide',
  },

  {
    id: 'b04',
    topic: 'FIFO Queue',
    question: 'What is the key difference between an SQS Standard queue and an SQS FIFO queue?',
    code: null,
    options: [
      'Standard queues guarantee strict message ordering; FIFO queues do not',
      'FIFO queues guarantee ordering and exactly-once processing; Standard queues offer best-effort ordering and at-least-once delivery',
      'Standard queues support encryption; FIFO queues do not',
      'FIFO queues are cheaper but have no throughput limits',
    ],
    correctIndex: 1,
    explanation:
      'FIFO queues strictly preserve message order and prevent duplicates within a 5-minute deduplication window, while Standard queues offer higher throughput with best-effort ordering and at-least-once delivery. FIFO queues are capped at 300 TPS (or 3,000 with batching), making them unsuitable for very high-throughput workloads. Standard queues can handle nearly unlimited TPS but may deliver messages out of order or more than once, so consumers must be idempotent. Choose FIFO when ordering or deduplication is a hard business requirement (e.g., financial transactions).',
    compiledJS: `# Create a FIFO queue — note the .fifo suffix is REQUIRED
aws sqs create-queue \\
  --queue-name payment-events.fifo \\
  --attributes FifoQueue=true,ContentBasedDeduplication=true

# Send a message with a MessageGroupId (required for FIFO)
aws sqs send-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/payment-events.fifo \\
  --message-body '{"type":"PAYMENT","amount":100}' \\
  --message-group-id "user-42" \\
  --message-deduplication-id "txn-9876"
# Messages with the same GroupId are processed in order`,
    bestPractice:
      'Use MessageGroupId to scope ordering to a logical entity (e.g., user ID or order ID) rather than a single global group — a single group serializes all processing and tanks throughput. Spread traffic across many distinct group IDs to approach the 3,000 TPS ceiling while preserving per-entity ordering.',
    source: 'AWS Docs — Amazon SQS FIFO Queues',
  },

  {
    id: 'b05',
    topic: 'At-Least-Once Delivery',
    question: "What does 'at-least-once delivery' mean in a messaging system?",
    code: null,
    options: [
      'A message is delivered exactly one time with no duplicates',
      'A message may be delivered more than once, so consumers must handle duplicates',
      'A message is delivered only if the consumer is online',
      'A message is never delivered more than once per consumer group',
    ],
    correctIndex: 1,
    explanation:
      'At-least-once delivery guarantees the message reaches the consumer but allows duplicates. In SQS, a message becomes visible again after the visibility timeout expires if it was not explicitly deleted — meaning a network glitch or consumer crash can cause the same message to be received twice. Consumers must therefore be idempotent: processing the same message twice should produce the same result as processing it once. Common patterns include checking a processed-ID table in DynamoDB before acting, or using database unique constraints to silently absorb duplicate writes.',
    compiledJS: `// Idempotent consumer pattern (Node.js + DynamoDB)
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')
const db = new DynamoDBClient({})

async function processMessage(msg) {
  const msgId = msg.MessageId
  try {
    // Conditional write: fails if item already exists
    await db.send(new PutItemCommand({
      TableName: 'ProcessedMessages',
      Item: { messageId: { S: msgId } },
      ConditionExpression: 'attribute_not_exists(messageId)',
    }))
  } catch (e) {
    if (e.name === 'ConditionalCheckFailedException') {
      console.log('Duplicate — skipping', msgId)
      return // already processed, safe to delete from queue
    }
    throw e
  }
  // ... actual business logic ...
}`,
    bestPractice:
      'Design every SQS consumer to be naturally idempotent: use database upserts rather than inserts, emit events that are safe to replay, and store a deduplication token (the SQS MessageId) in your datastore. For SQS FIFO queues, enable ContentBasedDeduplication or supply a MessageDeduplicationId — but still write idempotent consumers as a defence-in-depth measure.',
    source: 'AWS Docs — SQS at-least-once delivery; DDIA — Chapter 11',
  },

  {
    id: 'b06',
    topic: 'Dead Letter Queue',
    question: 'What is a Dead Letter Queue (DLQ)?',
    code: null,
    options: [
      'A queue that deletes messages automatically after 1 minute',
      'A secondary queue where messages are sent after failing processing a configured number of times',
      'A high-priority queue for urgent system alerts',
      'A queue that stores only metadata about processed messages',
    ],
    correctIndex: 1,
    explanation:
      'A DLQ captures messages that repeatedly fail processing (after a configurable maxReceiveCount) so they can be inspected and reprocessed without blocking the main queue. Without a DLQ, a "poison pill" message — one that always causes a consumer exception — would cycle back to the queue indefinitely, consuming processing capacity and potentially delaying all other messages. DLQs exist in both SQS and Kafka (as a convention, not a native feature in Kafka); in Kafka, the pattern is implemented by routing failed messages to a separate error topic.',
    compiledJS: `# 1. Create the DLQ
aws sqs create-queue --queue-name orders-dlq
DLQ_ARN=$(aws sqs get-queue-attributes \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders-dlq \\
  --attribute-names QueueArn --query Attributes.QueueArn --output text)

# 2. Create the main queue with a redrive policy
aws sqs create-queue \\
  --queue-name orders \\
  --attributes "{
    \\"RedrivePolicy\\": \\"{\\\\\\\"deadLetterTargetArn\\\\\\\":\\\\\\\"$DLQ_ARN\\\\\\\",\\\\\\\"maxReceiveCount\\\\\\\":\\\\\\\"3\\\\\\\"}\\"
  }"
# After 3 failed receive+delete cycles, message moves to orders-dlq`,
    bestPractice:
      'Set a CloudWatch alarm on ApproximateNumberOfMessagesVisible for every DLQ — a non-zero DLQ depth indicates a consumer bug or data quality problem that needs immediate attention. Keep DLQ message retention at the maximum (14 days) so you have time to diagnose and replay; for Kafka, route failures to a -error topic with the original topic, partition, and offset in the message headers for easy replay.',
    source: 'AWS Docs — SQS Dead Letter Queues',
  },

  {
    id: 'b07',
    topic: 'Kafka Introduction',
    question: 'What is Apache Kafka?',
    code: null,
    options: [
      'A relational database optimized for time-series data',
      'A distributed event streaming platform designed for high-throughput, fault-tolerant messaging',
      'An AWS-managed in-memory cache service',
      'A REST API gateway for microservice communication',
    ],
    correctIndex: 1,
    explanation:
      'Apache Kafka is an open-source distributed event streaming platform originally built at LinkedIn and later open-sourced through the Apache Software Foundation. It stores events on an append-only, partitioned, replicated log. Kafka is designed for high throughput (millions of messages per second), fault tolerance (configurable replication), and durability (messages retained for a configurable period, not just until consumed). Unlike traditional queues, Kafka decouples retention from consumption: multiple independent consumer groups can read the same log from different offsets.',
    compiledJS: `# Start a local Kafka cluster (KRaft mode — no ZooKeeper)
docker run -d --name kafka \\
  -e KAFKA_NODE_ID=1 \\
  -e KAFKA_PROCESS_ROLES=broker,controller \\
  -e KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \\
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \\
  -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 \\
  -p 9092:9092 \\
  apache/kafka:3.7.0

# Create a topic with 3 partitions, replication factor 1
kafka-topics.sh --create \\
  --topic orders \\
  --bootstrap-server localhost:9092 \\
  --partitions 3 \\
  --replication-factor 1

# Produce a message
echo "order-1:{'total':99}" | kafka-console-producer.sh \\
  --topic orders --bootstrap-server localhost:9092 --property "parse.key=true"`,
    bestPractice:
      'Always deploy Kafka with a replication factor of at least 3 in production, with min.insync.replicas=2 and acks=all on producers. This configuration tolerates one broker failure without data loss. Use Amazon MSK or Confluent Cloud for managed operations unless you have dedicated SRE capacity to manage Kafka clusters yourself.',
    source: 'Apache Kafka Docs — Introduction',
  },

  {
    id: 'b08',
    topic: 'Topic vs Queue',
    question: 'How does a Kafka topic differ from a traditional message queue?',
    code: null,
    options: [
      'A topic deletes messages immediately after they are read by one consumer',
      'A topic retains messages on a log so multiple independent consumer groups can read the same data',
      'A topic only supports a single producer at a time',
      'A topic guarantees delivery within 1 second',
    ],
    correctIndex: 1,
    explanation:
      'Unlike a queue that removes a message once it is consumed, a Kafka topic persists messages on an append-only partitioned log, allowing multiple independent consumer groups to read the same data from different offsets. Messages are retained for a configurable period (default 7 days) or until disk quota is reached, regardless of whether they have been consumed. This makes Kafka suitable for replay, audit trails, and fan-out scenarios where the same event feeds multiple downstream services simultaneously.',
    compiledJS: `# Two independent consumer groups reading the same topic
# Group 1: Analytics service — starts from the beginning
kafka-console-consumer.sh \\
  --topic orders \\
  --bootstrap-server localhost:9092 \\
  --group analytics-group \\
  --from-beginning

# Group 2: Fulfillment service — reads only new messages
kafka-console-consumer.sh \\
  --topic orders \\
  --bootstrap-server localhost:9092 \\
  --group fulfillment-group

# Both groups get all messages; neither affects the other's offset
# An SQS queue would only deliver each message to ONE consumer`,
    bestPractice:
      'Use Kafka when you need fan-out to multiple independent consumers or the ability to replay historical events. Use SQS when you need a simpler, managed work queue where each message is processed by exactly one worker and you do not need to replay. Avoid using Kafka as a pure queue replacement — its operational complexity is only justified when you need its multi-consumer or replay capabilities.',
    source: 'Apache Kafka Docs — Topics and Partitions',
  },

  {
    id: 'b09',
    topic: 'Consumer Groups',
    question: 'What is a Kafka consumer group?',
    code: null,
    options: [
      'A set of brokers that replicate partition data',
      'A collection of consumers that jointly consume a topic, each reading from a distinct subset of partitions',
      'An admin group that manages topic creation and deletion',
      'A group of producers that share the same client ID',
    ],
    correctIndex: 1,
    explanation:
      'A consumer group allows horizontal scaling of message processing: each partition is assigned to exactly one consumer within the group at any given time. If a group has three consumers and a topic has six partitions, each consumer handles two partitions in parallel. If one consumer crashes, Kafka triggers a rebalance and redistributes its partitions to the remaining healthy consumers. Different consumer groups maintain independent offsets and do not interfere with each other — each group sees all messages on the topic.',
    compiledJS: `// Consumer group with 3 members (KafkaJS)
const { Kafka } = require('kafkajs')
const kafka = new Kafka({ brokers: ['broker:9092'] })

// Three instances of this code with the SAME groupId form a group
const consumer = kafka.consumer({ groupId: 'fulfillment-group' })
await consumer.connect()
await consumer.subscribe({ topic: 'orders', fromBeginning: false })

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log(\`Worker on partition \${partition}: \${message.value}\`)
  },
})
// Kafka assigns partitions so no two workers in the same group
// receive the same message at the same time`,
    bestPractice:
      'Set the number of consumer instances equal to the number of partitions to achieve maximum parallelism — additional consumers beyond the partition count sit idle. Monitor consumer_lag via JMX or Prometheus; if lag grows persistently, either scale out consumers (up to partition count), increase partition count, or reduce per-message processing time.',
    source: 'Apache Kafka Docs — Consumer Groups',
  },

  {
    id: 'b10',
    topic: 'Global Ordering at Scale',
    question: 'Why is strict global message ordering difficult to guarantee at scale in distributed messaging systems?',
    code: null,
    options: [
      'Network latency and parallel processing across multiple nodes make a single global sequence hard to enforce without becoming a bottleneck',
      'Ordering requires a relational database, which messaging systems cannot use',
      'TCP connections inherently scramble packet order',
      'Message brokers deliberately randomize order to improve performance',
    ],
    correctIndex: 0,
    explanation:
      'Global ordering requires a single ordered sequence, which forces all writes through one serialized bottleneck — the antithesis of horizontal scaling. Distributed systems with multiple partitions or queue instances process messages in parallel across different nodes; enforcing a global order across those nodes would require distributed coordination (e.g., a global sequence number) that itself becomes a throughput bottleneck and a single point of failure. Kafka and SQS FIFO trade global ordering for partition-level or group-level ordering, achieving scalability while preserving the orderings that actually matter to business logic.',
    compiledJS: null,
    bestPractice:
      'Rarely does a system need strict global ordering across all messages. Identify the actual business invariant: usually it is "events for a given entity (user, order, account) must be ordered." Model this with Kafka partition keys (same entity always routes to the same partition) or SQS FIFO MessageGroupIds so ordering is enforced per entity, not globally, allowing full horizontal scaling.',
    source: 'DDIA — Chapter 9: Consistency and Consensus; Apache Kafka Docs — Partitioning',
  },

  // ── Intermediate ──────────────────────────────────────────────────────────────

  {
    id: 'i01',
    topic: 'Visibility Timeout',
    question: 'What is the SQS visibility timeout and why does it matter?',
    code: null,
    options: [
      'The maximum time a message can stay in the queue before being deleted automatically',
      'The period during which a received message is hidden from other consumers, preventing duplicate processing',
      'The delay before a newly sent message becomes visible to consumers',
      'The time window allowed for a consumer to authenticate before reading a message',
    ],
    correctIndex: 1,
    explanation:
      'The visibility timeout (default 30 s, configurable up to 12 hours) hides a message from all other consumers while one consumer is processing it. If the consumer successfully processes the message and calls DeleteMessage before the timeout expires, the message is permanently removed. If the consumer crashes or takes too long, the timeout expires and the message reappears in the queue for another consumer to retry. Setting the timeout too short causes spurious duplicates; too long delays retries after crashes. You can extend the timeout mid-processing with ChangeMessageVisibility if a job is running longer than expected.',
    compiledJS: `# Receive a message — it is now invisible to others for 30 s (default)
aws sqs receive-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\
  --visibility-timeout 60

# If processing will exceed timeout, extend it dynamically
aws sqs change-message-visibility \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\
  --receipt-handle "AQEB..." \\
  --visibility-timeout 120    # add 2 more minutes

# When done, delete — otherwise message reappears after timeout
aws sqs delete-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\
  --receipt-handle "AQEB..."`,
    bestPractice:
      'Set the visibility timeout to at least 6× the median processing time of your slowest consumer. For long-running jobs, implement a "heartbeat" thread that calls ChangeMessageVisibility every 2/3 of the current timeout to keep the message hidden until processing completes. Alert on ApproximateAgeOfOldestMessage to detect consumers that are silently failing to delete messages.',
    source: 'AWS Docs — SQS Visibility Timeout',
  },

  {
    id: 'i02',
    topic: 'Long Polling',
    question: 'What is the advantage of SQS long polling over short polling?',
    code: null,
    options: [
      'Long polling compresses messages to reduce bandwidth usage',
      'Long polling holds the connection open up to 20 seconds, reducing empty responses and lowering cost',
      'Long polling guarantees messages arrive in FIFO order',
      'Long polling allows consumers to push acknowledgements back to SQS in real time',
    ],
    correctIndex: 1,
    explanation:
      'Short polling returns immediately even if the queue is empty, leading to many empty ReceiveMessage API responses that incur cost and CPU overhead. Long polling waits up to 20 seconds for at least one message to arrive before returning; if a message arrives during the wait, it is returned immediately. This eliminates most empty responses, reducing SQS API costs by up to 70% for low-traffic queues, and lowers consumer CPU usage. Long polling is enabled by setting WaitTimeSeconds (1–20 s) on the ReceiveMessage call or in the queue attribute.',
    compiledJS: `# Short polling — returns immediately (bad for idle queues)
aws sqs receive-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders
# Often returns: { "Messages": [] } — costs money, wastes CPU

# Long polling — waits up to 20 s for a message
aws sqs receive-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\
  --wait-time-seconds 20
# Returns as soon as a message arrives, or after 20 s if still empty

# Set long polling as the queue default (so all clients benefit)
aws sqs set-queue-attributes \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\
  --attributes ReceiveMessageWaitTimeSeconds=20`,
    bestPractice:
      'Always configure long polling (WaitTimeSeconds=20) at the queue level as a default, and also set it on each ReceiveMessage call. This is a free performance improvement — there is no reason to use short polling unless you have a specific real-time latency requirement that cannot tolerate a 20-second wait, which is rare in practice.',
    source: 'AWS Docs — SQS Long Polling',
  },

  {
    id: 'i03',
    topic: 'SQS Retention and Size',
    question: 'What are the default and maximum message retention periods for an SQS queue?',
    code: null,
    options: [
      'Default 1 day, maximum 7 days',
      'Default 4 days, maximum 14 days',
      'Default 7 days, maximum 30 days',
      'Default 1 hour, maximum 24 hours',
    ],
    correctIndex: 1,
    explanation:
      'SQS retains messages for 4 days by default; the range is 1 minute to 14 days. After the retention period expires, messages are automatically deleted regardless of whether they have been processed. The maximum message payload size is 256 KB; for larger payloads use the SQS Extended Client Library or the "claim check" pattern: store the payload in S3 and put only the S3 object reference in the SQS message. These limits apply to both Standard and FIFO queues.',
    compiledJS: `# Set retention to maximum 14 days (1,209,600 seconds)
aws sqs set-queue-attributes \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\
  --attributes MessageRetentionPeriod=1209600

# Claim-check pattern: large payload stored in S3
# 1. Upload payload to S3
S3_KEY="payloads/order-$(uuidgen).json"
aws s3 cp large-order.json s3://my-bucket/$S3_KEY

# 2. Send only the reference in SQS
aws sqs send-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\
  --message-body "{\"s3Key\":\"$S3_KEY\"}"

# Consumer fetches the real payload from S3`,
    bestPractice:
      'Keep retention at 14 days for queues connected to DLQs — this gives you maximum time to diagnose and replay failed messages before they expire. For queues handling ephemeral events (e.g., UI click telemetry) a shorter retention of 1–4 hours is fine and prevents unbounded storage growth if consumers fall behind.',
    source: 'AWS Docs — SQS Message Attributes and Limits',
  },

  {
    id: 'i04',
    topic: 'Kafka Partitions',
    question: 'How do Kafka partitions enable parallelism in message consumption?',
    code: null,
    options: [
      'Each partition runs on a separate AWS region, so consumers process data geographically',
      'Each consumer in a group is assigned one or more partitions, allowing multiple consumers to read different partitions simultaneously',
      'Partitions compress messages so each consumer processes twice as many per second',
      'Partitions allow producers to write faster by batching messages into chunks',
    ],
    correctIndex: 1,
    explanation:
      'A Kafka topic is divided into N independent ordered logs called partitions, each hosted on a different broker (or the same broker with replicas on others). Within a consumer group, Kafka assigns each partition to exactly one consumer — so with 6 partitions and 3 consumers, each consumer handles 2 partitions in parallel, tripling throughput compared to a single consumer. Ordering is guaranteed within a partition but not across partitions. The maximum degree of parallelism for a consumer group equals the number of partitions — additional consumers beyond that sit idle.',
    compiledJS: `# Topic with 6 partitions — 6-way consumer parallelism possible
kafka-topics.sh --create \\
  --topic orders \\
  --bootstrap-server localhost:9092 \\
  --partitions 6 \\
  --replication-factor 3

# Check partition assignment for a consumer group
kafka-consumer-groups.sh \\
  --bootstrap-server localhost:9092 \\
  --group fulfillment-group \\
  --describe
# Output:
# CONSUMER-ID          PARTITION  CURRENT-OFFSET  LOG-END  LAG
# worker-1             0          1024            1024     0
# worker-1             1          980             980      0
# worker-2             2          1100            1100     0
# worker-2             3          995             995      0
# worker-3             4          870             870      0
# worker-3             5          910             910      0`,
    bestPractice:
      'Size partitions generously (err on the side of more) because increasing partitions on a live topic is a one-way operation that triggers rebalancing and ordering disruption. A common heuristic is: target throughput / per-partition throughput (≈10 MB/s) + 20% headroom. Avoid more than ~4,000 partitions per broker to keep memory pressure and rebalance times manageable.',
    source: 'Apache Kafka Docs — Topics and Partitions; Confluent Blog — How to Choose the Number of Partitions',
  },

  {
    id: 'i05',
    topic: 'Committed vs Latest Offset',
    question: 'What is the difference between a committed offset and the latest offset in Kafka?',
    code: null,
    options: [
      'The committed offset is the next message to produce; the latest offset is the last message produced',
      'The committed offset is the last position the consumer group confirmed processing; the latest offset is the last message written to the partition',
      'The committed offset is stored on disk; the latest offset is in memory only',
      'They are synonymous terms used interchangeably in Kafka documentation',
    ],
    correctIndex: 1,
    explanation:
      'The latest offset (also called the log-end offset or LEO) is the position of the most recently written message in a partition. The committed offset is the offset that a consumer group has durably recorded as "processed" in the internal __consumer_offsets topic. Consumer lag = latest_offset − committed_offset. Minimising this gap is the key operational goal for consumer health. Committing offsets too eagerly (before processing completes) risks data loss on crash; committing too infrequently increases re-processing on restart.',
    compiledJS: `# Check committed offsets and lag for a consumer group
kafka-consumer-groups.sh \\
  --bootstrap-server localhost:9092 \\
  --group fulfillment-group \\
  --describe

# Output columns:
# TOPIC    PARTITION  CURRENT-OFFSET(committed)  LOG-END-OFFSET(latest)  LAG
# orders   0          5420                        5420                    0     <- healthy
# orders   1          5100                        5420                    320   <- consumer behind!
# orders   2          5380                        5420                    40    <- slight lag

# Reset offsets to re-process from beginning (use with care)
kafka-consumer-groups.sh \\
  --bootstrap-server localhost:9092 \\
  --group fulfillment-group \\
  --topic orders \\
  --reset-offsets --to-earliest --execute`,
    bestPractice:
      'Commit offsets AFTER successful processing, not before. Use Kafka\'s auto.commit=false in production and commit manually after the business logic succeeds. Alert on consumer lag > a threshold (e.g., 10,000 messages or growing for more than 5 minutes) to catch processing bottlenecks before they become outages.',
    source: 'Apache Kafka Docs — Offset Management',
  },

  {
    id: 'i06',
    topic: 'Consumer Group Rebalancing',
    question: 'What triggers a Kafka consumer group rebalance?',
    code: null,
    options: [
      "A topic's replication factor is increased by an administrator",
      'A consumer joins or leaves the group, or a session timeout expires, causing partitions to be reassigned among active consumers',
      'A producer sends a message larger than the configured batch size',
      'The ZooKeeper leader election completes a new round',
    ],
    correctIndex: 1,
    explanation:
      'A rebalance is triggered when a consumer joins the group, leaves gracefully (shutdown), fails its heartbeat (session.timeout.ms exceeded), or when the topic\'s partition count changes. During a rebalance, all consumers in the group pause consumption while the group coordinator reassigns partitions — this is known as a "stop the world" rebalance. Kafka 2.4+ introduced incremental cooperative rebalancing, which minimises disruption by only moving partitions that need to change ownership rather than revoking all assignments.',
    compiledJS: `// Consumer config to reduce rebalance impact
const consumer = kafka.consumer({
  groupId: 'fulfillment-group',
  sessionTimeout: 30000,          // 30 s — time before broker marks consumer dead
  heartbeatInterval: 3000,        // 3 s — send heartbeat every 3 s
  maxPollIntervalMs: 300000,      // 5 min — max time between poll() calls
  // Cooperative rebalancing (Kafka 2.4+)
  rebalanceTimeout: 60000,
})

// Listen for rebalance events
consumer.on(consumer.events.REBALANCING, () => {
  console.log('Rebalance in progress — pausing processing')
})
consumer.on(consumer.events.GROUP_JOIN, () => {
  console.log('Joined group — resuming')
})`,
    bestPractice:
      'Minimise rebalances by setting maxPollIntervalMs comfortably above your slowest message processing time, and deploying consumer updates with rolling restarts rather than killing all instances simultaneously. Enable cooperative rebalancing (partition.assignment.strategy=CooperativeStickyAssignor) in Kafka 2.4+ to avoid the full stop-the-world pause. Monitor kafka_consumer_group_rebalances_per_second in Grafana — frequent rebalances indicate an unhealthy consumer fleet.',
    source: 'Apache Kafka Docs — Consumer Group Rebalancing; KIP-429 Incremental Cooperative Rebalancing',
  },

  {
    id: 'i07',
    topic: 'Replication Factor and ISR',
    question: 'What is the purpose of a Kafka replication factor, and what does ISR mean?',
    code: null,
    options: [
      'Replication factor sets message TTL; ISR stands for In-Sync Retention',
      'Replication factor controls how many broker copies exist for each partition; ISR (In-Sync Replicas) is the set of replicas fully caught up with the leader',
      'Replication factor determines the number of consumer groups; ISR tracks their lag',
      'Replication factor sets the compression level; ISR is the index of stored records',
    ],
    correctIndex: 1,
    explanation:
      'A replication factor of N means each partition has one leader and N-1 follower replicas across different brokers. Kafka acknowledges a producer write only when the required number of ISR (In-Sync Replicas) have confirmed receipt — controlled by acks and min.insync.replicas. ISR is the dynamic set of followers that are within replica.lag.time.max.ms of the leader; a lagging follower is removed from the ISR until it catches up. If the leader broker crashes, Kafka elects a new leader from the ISR, preventing data loss.',
    compiledJS: `# Topic with replication factor 3
kafka-topics.sh --create \\
  --topic payments \\
  --bootstrap-server localhost:9092 \\
  --partitions 6 \\
  --replication-factor 3

# Check ISR for each partition
kafka-topics.sh --describe \\
  --topic payments \\
  --bootstrap-server localhost:9092
# Output:
# Partition: 0  Leader: 1  Replicas: 1,2,3  Isr: 1,2,3  <- all in sync
# Partition: 1  Leader: 2  Replicas: 2,3,1  Isr: 2,3    <- broker 1 lagging!

# Producer config for maximum durability
# acks=all + min.insync.replicas=2 on broker`,
    bestPractice:
      'Use replication factor 3 with min.insync.replicas=2 and acks=all on producers for production data. This tolerates one broker failure without data loss and without blocking producers. Never set min.insync.replicas equal to the replication factor — if one replica is temporarily offline, all produces will block. Monitor UnderReplicatedPartitions JMX metric; a non-zero value means data is not fully replicated and the cluster is at risk.',
    source: 'Apache Kafka Docs — Replication; Confluent Docs — ISR',
  },

  {
    id: 'i08',
    topic: 'Exactly-Once Semantics',
    question: 'Which Kafka configuration achieves exactly-once semantics end-to-end?',
    code: null,
    options: [
      'Setting acks=0 on the producer and enabling auto-commit on the consumer',
      'Enabling idempotent producers (enable.idempotence=true) combined with transactional APIs on producers and isolation.level=read_committed on consumers',
      'Using a FIFO topic with a single partition and a single consumer',
      'Disabling batching and setting max.in.flight.requests.per.connection=1',
    ],
    correctIndex: 1,
    explanation:
      'Kafka exactly-once semantics (EOS) requires three things working together: (1) Idempotent producer — each message is assigned a producer ID + sequence number, so duplicate retries on the broker are deduplicated. (2) Transactional producer API — produce and offset-commit are wrapped in an atomic transaction, so either both happen or neither does. (3) isolation.level=read_committed on consumers — they only see messages from committed transactions, not in-flight or aborted ones. EOS was introduced in Kafka 0.11 and is used by Kafka Streams natively.',
    compiledJS: `// Producer with exactly-once semantics
const producer = kafka.producer({
  transactionalId: 'payment-processor-1',  // unique per producer instance
  maxInFlightRequests: 5,
  idempotent: true,   // enable.idempotence=true
})
await producer.connect()
await producer.transaction(async (tx) => {
  await tx.send({ topic: 'payments', messages: [{ value: 'pay-123' }] })
  await tx.sendOffsets({
    consumerGroupId: 'payment-consumer',
    topics: [{ topic: 'orders', partitions: [{ partition: 0, offset: '42' }] }],
  })
  // Both the produce AND the offset commit happen atomically
})

// Consumer reads only committed transactions
const consumer = kafka.consumer({
  groupId: 'payment-consumer',
  readUncommitted: false,  // isolation.level=read_committed
})`,
    bestPractice:
      'EOS comes at a performance cost (roughly 10–20% throughput reduction) due to transaction coordination overhead. Use it only when duplicates would cause real harm (e.g., financial debit operations). For most event streaming use cases, at-least-once delivery with idempotent consumers is simpler, more performant, and equally correct.',
    source: 'Apache Kafka Docs — Exactly-Once Semantics; Kafka KIP-98',
  },

  {
    id: 'i09',
    topic: 'SQS vs SNS vs EventBridge',
    question: 'What is the primary difference between Amazon SQS, Amazon SNS, and Amazon EventBridge?',
    code: null,
    options: [
      'SQS is a queue for point-to-point messaging; SNS is a pub/sub fanout to multiple subscribers; EventBridge is an event bus with routing rules and schema registry',
      'SQS is for streaming data; SNS is for batch jobs; EventBridge is for IoT devices only',
      'All three are identical services with different pricing models',
      'SNS stores messages for 14 days like SQS; EventBridge does not retain events',
    ],
    correctIndex: 0,
    explanation:
      'SQS is a point-to-point queue: one message is delivered to one consumer (or one consumer group when using competing consumers). SNS is a push-based pub/sub service: one published message is immediately fanned out to all subscribers (SQS queues, Lambda functions, HTTP endpoints, email). EventBridge adds content-based routing: rules inspect the event body and route matching events to specific targets, and it integrates with 200+ SaaS event sources (Shopify, GitHub, etc.) and has a built-in schema registry. A common pattern is SNS → multiple SQS queues for reliable fanout with buffering.',
    compiledJS: `# SNS → SQS fan-out pattern (each subscriber gets its own queue)

# 1. Create SNS topic
SNS_ARN=$(aws sns create-topic --name order-events --query TopicArn --output text)

# 2. Create per-subscriber SQS queues
Q1_URL=$(aws sqs create-queue --queue-name analytics-queue --query QueueUrl --output text)
Q2_URL=$(aws sqs create-queue --queue-name fulfillment-queue --query QueueUrl --output text)

# 3. Subscribe both queues to the SNS topic
Q1_ARN=$(aws sqs get-queue-attributes --queue-url $Q1_URL \\
  --attribute-names QueueArn --query Attributes.QueueArn --output text)
aws sns subscribe --topic-arn $SNS_ARN --protocol sqs --notification-endpoint $Q1_ARN

# Now one SNS publish → both queues receive a copy`,
    bestPractice:
      'Use the SNS→SQS fan-out pattern when you need durable fan-out: SNS delivers to each SQS queue independently, so a slow analytics consumer cannot block the fulfillment consumer. Use EventBridge when events come from external SaaS systems or when you need content-based routing rules that evolve independently of producers and consumers.',
    source: 'AWS Docs — Amazon SNS vs SQS vs EventBridge; AWS Blog — Fan-out pattern',
  },

  {
    id: 'i10',
    topic: 'Log Compaction',
    question: 'What is Kafka log compaction and when should you use it?',
    code: null,
    options: [
      'A background process that compresses log files using gzip to save disk space',
      'A retention policy that keeps only the latest value per key, discarding older records with the same key',
      'A Kafka Streams operation that merges two topics into one sorted topic',
      'A process that deletes all messages older than the configured retention period',
    ],
    correctIndex: 1,
    explanation:
      'Log compaction is a retention policy where Kafka keeps only the latest record for each message key and discards older records with the same key. This allows the topic to function as a persistent key-value store: a consumer that starts from the beginning can reconstruct the latest state for every key by reading the compacted log, even if the topic has been running for years. Tombstone records (null value with a key) mark deletions. Compaction runs as a background thread on the broker and does not block producers or consumers.',
    compiledJS: `# Create a compacted topic for user profile state
kafka-topics.sh --create \\
  --topic user-profiles \\
  --bootstrap-server localhost:9092 \\
  --partitions 12 \\
  --replication-factor 3 \\
  --config cleanup.policy=compact \\
  --config min.cleanable.dirty.ratio=0.1 \\
  --config segment.ms=3600000    # compact at least every hour

# Producer: update user 42's profile
kafka-console-producer.sh \\
  --topic user-profiles --bootstrap-server localhost:9092 \\
  --property "parse.key=true" --property "key.separator=:"
42:{"name":"Alice","email":"alice@example.com"}   # v1
42:{"name":"Alice","email":"alice@new.com"}        # v2 — v1 eventually removed by compaction

# Delete user 42 — send a tombstone (null value)
42:null`,
    bestPractice:
      'Use log compaction for topics that represent mutable state (user profiles, account balances, configuration). Use time-based retention for immutable event streams (audit logs, click events). Never mix compaction with downstream consumers that depend on seeing every historical version of a key — compaction gives you latest-only semantics, not full history.',
    source: 'Apache Kafka Docs — Log Compaction',
  },

  // ── Advanced ──────────────────────────────────────────────────────────────────

  {
    id: 'a01',
    topic: 'Log Segment Internals',
    question: 'What are the three files that make up a Kafka log segment and what does each store?',
    code: null,
    options: [
      '.log stores raw message bytes; .index maps offsets to byte positions in .log; .timeindex maps timestamps to offsets',
      '.log stores offsets; .index stores message bytes; .timeindex stores partition metadata',
      '.log stores consumer group state; .index stores producer IDs; .timeindex stores replication lag',
      '.log stores compressed batches; .index stores schema IDs; .timeindex stores TTL expiry times',
    ],
    correctIndex: 0,
    explanation:
      'Each Kafka partition is stored as a series of segments on disk. Each segment consists of: (1) .log — the raw append-only file of serialised message batches in binary format. (2) .index — a sparse offset index mapping message offsets to their byte position in the .log file, enabling O(1) seeks to a given offset. (3) .timeindex — maps timestamps to offsets, enabling time-based seeks (e.g., "give me messages from the last hour"). The active segment is the one currently being written; older segments are immutable and eligible for compaction or deletion according to the retention policy.',
    compiledJS: `# Inspect log segment files on a Kafka broker
ls -la /var/kafka-logs/orders-0/
# 00000000000000000000.index
# 00000000000000000000.log
# 00000000000000000000.timeindex
# 00000000000001048576.index    <- next segment starts at offset 1,048,576
# 00000000000001048576.log
# 00000000000001048576.timeindex
# leader-epoch-checkpoint

# Dump the .log file in human-readable format
kafka-dump-log.sh \\
  --files /var/kafka-logs/orders-0/00000000000000000000.log \\
  --print-data-log
# Output: offset: 0 ... key: null value: {"orderId": "abc"}

# Read from a specific timestamp (uses .timeindex internally)
kafka-console-consumer.sh \\
  --topic orders --bootstrap-server localhost:9092 \\
  --offset 1048576 --partition 0`,
    bestPractice:
      'Tune log.segment.bytes (default 1 GB) and log.segment.ms (default 7 days) to balance segment count against recovery time. Smaller segments mean more files (higher inode pressure) but faster log compaction and faster retention cleanup. Monitor kafka_log_log_size and kafka_log_log_start_offset_delta in Prometheus; set up disk usage alerts well in advance of filling the broker disk, as a full Kafka disk is an immediate availability incident.',
    source: 'Apache Kafka Docs — Log Segments; Confluent Blog — Kafka Storage Internals',
  },

  {
    id: 'a02',
    topic: 'Hot Partitions',
    question: 'What is a hot partition in Kafka and how does key-based partitioning cause it?',
    code: null,
    options: [
      'A hot partition is one that receives too many replicas; key-based routing distributes replicas unevenly',
      'A hot partition receives disproportionately more messages than others because a high-cardinality key (e.g., a popular user ID) consistently hashes to the same partition',
      'A hot partition is temporarily offline; key-based routing avoids it until it recovers',
      'A hot partition stores compacted data; round-robin partitioning avoids compaction',
    ],
    correctIndex: 1,
    explanation:
      'Kafka\'s default partitioner hashes the message key with murmur2 and routes all messages with the same key to the same partition. If a small number of keys carry the majority of traffic (e.g., a viral user ID or a shared tenant ID in a multi-tenant system), those partitions receive far more data than others. This is a hot partition: it saturates its leader broker\'s network and disk I/O, and because partition assignments are fixed within a consumer group, the consumer handling that partition lags behind. Round-robin or null-key partitioning distributes load evenly but destroys per-key ordering.',
    compiledJS: `// Custom partitioner to detect and re-route hot keys
const { Partitioners } = require('kafkajs')

function hotKeyAwarePartitioner({ topic, partitionMetadata, message }) {
  const numPartitions = partitionMetadata.length
  const key = message.key?.toString()

  // Known hot keys get spread across a dedicated partition range
  const HOT_KEYS = new Set(['user-viral-123', 'tenant-mega-corp'])
  if (key && HOT_KEYS.has(key)) {
    // Hash into the upper half of partitions to spread hot-key load
    const slot = Math.abs(hashFnv32a(key + Date.now().toString()))
    return (Math.floor(numPartitions / 2) + (slot % Math.floor(numPartitions / 2)))
  }
  // Normal key-based routing for the rest
  return Partitioners.DefaultPartitioner()({ topic, partitionMetadata, message })
}`,
    bestPractice:
      'Detect hot partitions via kafka_topic_partition_messages_in_per_sec per partition in Grafana — a partition receiving 10× the median is a hot partition. Mitigations: (1) add a random salt suffix to the hot key to spread it across multiple partitions (trading ordering for load balance), (2) pre-partition hot tenants into dedicated topics, (3) increase partition count and add a custom partitioner. Always measure partition skew before scaling consumer instances.',
    source: 'Apache Kafka Docs — Custom Partitioners; Confluent Blog — Tackling Hot Partitions',
  },

  {
    id: 'a03',
    topic: 'Back-Pressure',
    question: 'How does back-pressure manifest in a Kafka consumer chain and what is a common mitigation strategy?',
    code: null,
    options: [
      'Back-pressure appears as producer throttling; the mitigation is to increase the number of topics',
      'Back-pressure appears as growing consumer lag when processing is slower than the production rate; mitigations include adding consumers up to the partition count, increasing partitions, or rate-limiting the producer',
      'Back-pressure appears as broker disk saturation; the mitigation is to enable log compaction',
      'Back-pressure appears as ZooKeeper timeouts; the mitigation is to upgrade to KRaft mode',
    ],
    correctIndex: 1,
    explanation:
      'Back-pressure in a Kafka consumer chain is visible as monotonically growing consumer lag — the consumer cannot process records as fast as producers write them. Kafka, unlike reactive streams frameworks, does not propagate back-pressure to producers (it stores the surplus on disk). Left unaddressed, growing lag eventually causes processing to fall behind the retention window, at which point records are deleted before being consumed. Mitigations include: (1) scale consumers horizontally up to the partition count, (2) increase the partition count to allow more consumer parallelism, (3) reduce per-message processing time through caching or async I/O, or (4) rate-limit producers.',
    compiledJS: `# Monitor consumer lag — the key back-pressure signal
kafka-consumer-groups.sh \\
  --bootstrap-server localhost:9092 \\
  --group fulfillment-group \\
  --describe
# Watch LAG column — if it grows every minute, back-pressure is occurring

# Prometheus query: alert when lag > 50k for > 10 minutes
# kafka_consumer_group_lag{group="fulfillment-group"} > 50000

# Scale consumers: add more instances (up to partition count)
# kubectl scale deployment fulfillment-consumer --replicas=6
# (topic has 6 partitions — 6 consumers = max parallelism)

# If consumers == partitions and lag still grows → increase partitions
kafka-topics.sh --alter \\
  --topic orders \\
  --bootstrap-server localhost:9092 \\
  --partitions 12   # double partitions, then scale consumers to 12`,
    bestPractice:
      'Instrument consumer lag alerting from day one: set a warning at lag > 10,000 messages and a critical alert at lag growing for more than 5 minutes. Use the lag-to-time metric (lag / messages-per-second) to estimate how far behind consumers are in real time. Pre-provision spare consumer capacity (N+1 or N+2) so that a single consumer crash does not immediately cause lag spikes in production.',
    source: 'Confluent Docs — Consumer Lag Monitoring; DDIA — Chapter 11: Stream Processing',
  },

  {
    id: 'a04',
    topic: 'Kafka Streams vs Flink vs Spark',
    question: 'How does Kafka Streams differ from Apache Flink and Apache Spark Structured Streaming for stateful stream processing?',
    code: null,
    options: [
      'Kafka Streams is a batch framework; Flink and Spark are pure streaming engines',
      'Kafka Streams is a client library that runs inside your application without a separate cluster; Flink and Spark are standalone distributed processing frameworks with their own resource management',
      'Kafka Streams requires Kubernetes; Flink and Spark run on bare metal only',
      'Kafka Streams does not support stateful operations; Flink and Spark do',
    ],
    correctIndex: 1,
    explanation:
      'Kafka Streams embeds directly in your JVM application as a library with no external cluster dependency — it uses Kafka partitions for parallelism and RocksDB for local state stores. This makes deployment simple (just deploy more application instances) but limits processing semantics to what Kafka\'s consumer API can express. Flink is a dedicated distributed stream processing engine with richer windowing, out-of-order event handling (watermarks), and complex event processing (CEP). Spark Structured Streaming runs micro-batches on a Spark cluster with stronger batch/stream unification but higher latency. For most applications that already use Kafka, Kafka Streams is the simplest choice; Flink is preferred for complex stateful analytics with late data handling.',
    compiledJS: `// Kafka Streams: word count (runs in-process, no cluster needed)
const { KafkaStreams } = require('kafka-streams')
const config = { noptions: { 'metadata.broker.list': 'localhost:9092' } }
const factory = new KafkaStreams(config)
const stream = factory.getKStream()

stream
  .from('text-input')
  .mapJSONConvenience()
  .map(msg => msg.word)
  .countByKey('word-counts', 'word')
  .to('word-counts-output')

factory.start()
// State is stored locally in RocksDB — no Flink/Spark cluster needed
// Scale by adding more application instances (each handles a partition subset)`,
    bestPractice:
      'Choose Kafka Streams for microservices that need lightweight stateful processing close to the data (aggregations, joins, enrichment) without the overhead of a separate processing cluster. Choose Flink when you need exactly-once stateful processing across multiple Kafka clusters, complex windowing over out-of-order events, or SQL-based stream analytics at scale. Avoid Spark Structured Streaming for real-time (< 1 s) requirements due to micro-batch overhead.',
    source: 'Apache Kafka Docs — Kafka Streams; Flink Docs; DDIA — Chapter 11',
  },

  {
    id: 'a05',
    topic: 'SQS FIFO Throughput and Message Groups',
    question: 'What is the throughput limit of an SQS FIFO queue and how do message group IDs affect it?',
    code: null,
    options: [
      'FIFO queues support unlimited throughput; message group IDs have no effect on throughput',
      'FIFO queues support up to 300 messages/second (or 3,000 with batching); messages in the same group ID are processed sequentially, so more distinct group IDs enable greater parallelism',
      'FIFO queues support 10,000 messages/second; each group ID adds 1,000 messages/second of capacity',
      'FIFO queues support up to 1,000 messages/second regardless of group IDs',
    ],
    correctIndex: 1,
    explanation:
      'SQS FIFO queues process 300 TPS without batching and 3,000 TPS when using SendMessageBatch (up to 10 messages per batch call). Within a MessageGroupId, messages are strictly ordered and processed sequentially — only one consumer can read from a group at a time. Using many distinct MessageGroupIds allows consumers to read from different groups concurrently, approaching the 3,000 TPS ceiling. If a single group carries all traffic, effective throughput collapses to one-consumer-at-a-time serial processing, regardless of how many consumer instances you run.',
    compiledJS: `# Bad: single group ID — serialised, low throughput
aws sqs send-message \\
  --queue-url https://sqs.us-east-1.amazonaws.com/123/payments.fifo \\
  --message-body '{"amount":100}' \\
  --message-group-id "ALL_PAYMENTS"  # ← bottleneck!

# Good: per-user group IDs — parallel, high throughput
for USER_ID in user-1 user-2 user-3 user-4 user-5; do
  aws sqs send-message \\
    --queue-url https://sqs.us-east-1.amazonaws.com/123/payments.fifo \\
    --message-body "{\"userId\":\"$USER_ID\",\"amount\":100}" \\
    --message-group-id "$USER_ID"     # ← each user's messages ordered
done
# 5 groups → up to 5 consumers processing in parallel
# Ordering preserved per user, not globally`,
    bestPractice:
      'Design MessageGroupId as a business entity key (userId, orderId, accountId) rather than a constant. This gives you per-entity ordering (the actual business requirement) while enabling full parallelism across entities. Monitor the SQS console for any single MessageGroupId that dominates the queue depth — that is your throughput bottleneck.',
    source: 'AWS Docs — SQS FIFO Queues: Throughput and Limits',
  },

  {
    id: 'a06',
    topic: 'Schema Registry',
    question: 'Why is a schema registry important when using Avro or Protobuf with Kafka, and what problem does it solve?',
    code: null,
    options: [
      'A schema registry encrypts messages in transit; without it, Avro payloads are sent in plain text',
      'A schema registry centralizes schema versioning so producers and consumers can evolve schemas independently while maintaining backward or forward compatibility, and stores only the schema ID in the message payload',
      'A schema registry is a Kafka broker plugin that validates message size limits',
      'A schema registry replaces ZooKeeper for cluster metadata management in newer Kafka versions',
    ],
    correctIndex: 1,
    explanation:
      'Without a schema registry, every Avro or Protobuf message must embed its full schema, inflating payload sizes. A schema registry (e.g., Confluent Schema Registry) assigns each schema version a numeric ID; producers embed only the 4-byte schema ID, and consumers fetch the schema from the registry at startup. More importantly, the registry enforces compatibility rules (BACKWARD, FORWARD, FULL) — preventing a producer from deploying a schema change that would break an existing consumer. This enables independent deployability of producers and consumers, which is essential in a microservices architecture.',
    compiledJS: `// Producer: register and use schema
const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry')
const registry = new SchemaRegistry({ host: 'http://schema-registry:8081' })

const schemaId = await registry.register({
  type: 'AVRO',
  schema: JSON.stringify({
    type: 'record',
    name: 'Order',
    fields: [
      { name: 'orderId', type: 'string' },
      { name: 'total',   type: 'double' },
      { name: 'status',  type: ['null', 'string'], default: null },  // optional field
    ],
  }),
  // Compatibility: BACKWARD — new schema can read old data
}, { compatibility: 'BACKWARD' })

const encoded = await registry.encode(schemaId, { orderId: 'abc', total: 99.0 })
// Wire format: [magic byte 0x00][4-byte schema ID][avro bytes]
// Consumer fetches schema by ID — no schema in every message`,
    bestPractice:
      'Enforce BACKWARD compatibility as the default: new schema must be able to read messages produced with the previous schema. Add new fields with defaults (never remove required fields). Run schema validation in CI — use the Schema Registry REST API compatibility check endpoint before merging producer changes. This prevents the most common breaking change: a consumer deployed before the producer update fails to deserialise new messages.',
    source: 'Confluent Docs — Schema Registry; Apache Avro Docs — Schema Resolution',
  },

  {
    id: 'a07',
    topic: 'Consumer Lag Monitoring',
    question: 'What metrics and tools are commonly used to monitor Kafka consumer lag in production?',
    code: null,
    options: [
      "Consumer lag can only be monitored via Kafka's built-in web UI dashboard",
      "Consumer lag is monitored using kafka-consumer-groups.sh, Kafka's JMX metrics (records-lag-max), Prometheus with the kafka-exporter or Confluent's JMX exporter, and platforms like Datadog or Grafana",
      'Consumer lag is visible only in AWS CloudWatch when using Amazon MSK',
      'Consumer lag is tracked by reading the __consumer_offsets topic directly from the application code',
    ],
    correctIndex: 1,
    explanation:
      'kafka-consumer-groups.sh gives a point-in-time lag snapshot useful for ad-hoc debugging. For continuous production monitoring, the JMX metric kafka.consumer:type=consumer-fetch-manager-metrics,attribute=records-lag-max exposes per-consumer lag as a Prometheus-compatible gauge. The kafka-exporter (open-source) or Confluent\'s JMX exporter scrapes these and exposes them for Grafana dashboards. AWS MSK integrates with CloudWatch, exposing EstimatedTimeLag and SumOffsetLag metrics natively. Datadog, Dynatrace, and New Relic all have first-class Kafka integrations that correlate lag with deployment events.',
    compiledJS: `# CLI: point-in-time lag snapshot
kafka-consumer-groups.sh \\
  --bootstrap-server localhost:9092 \\
  --group fulfillment-group \\
  --describe

# Prometheus scrape config (kafka-exporter)
# prometheus.yml:
# scrape_configs:
#   - job_name: kafka
#     static_configs:
#       - targets: ['kafka-exporter:9308']

# Grafana alert rule (PromQL):
# ALERT KafkaConsumerLagHigh
# IF max(kafka_consumergroup_lag{consumergroup="fulfillment-group"}) > 10000
# FOR 5m
# LABELS { severity="critical" }

# AWS MSK CloudWatch metric
aws cloudwatch get-metric-statistics \\
  --namespace AWS/Kafka \\
  --metric-name EstimatedTimeLag \\
  --dimensions Name=ConsumerGroup,Value=fulfillment-group \\
  --period 60 --statistics Average \\
  --start-time 2024-01-01T00:00:00Z --end-time 2024-01-01T01:00:00Z`,
    bestPractice:
      'Track both records-lag (message count) and time-lag (seconds behind) — a large record lag on a low-velocity topic may only be seconds of delay, while a small lag on a high-velocity topic may represent critical processing backlog. Set paged alerts on time-lag > 60 seconds for payment or order-processing consumers; use records-lag for capacity planning dashboards.',
    source: 'Confluent Docs — Monitoring Kafka; AWS Docs — MSK Monitoring Metrics',
  },

  {
    id: 'a08',
    topic: 'Transactional Outbox Pattern',
    question: 'What is the transactional outbox pattern and how does it solve dual-write problems between a database and a message broker?',
    code: null,
    options: [
      'The outbox pattern stores messages in an SQS FIFO queue before writing to the database, ensuring the database only updates if the queue accepts the message',
      'The outbox pattern writes both the domain state change and the outgoing message to the same database transaction; a separate relay process then reads the outbox table and publishes to the broker, ensuring atomicity without distributed transactions',
      'The outbox pattern uses two-phase commit across the database and Kafka broker to guarantee simultaneous writes',
      'The outbox pattern buffers messages in application memory and flushes them to Kafka after the database transaction commits',
    ],
    correctIndex: 1,
    explanation:
      'The dual-write problem: writing to a database and publishing to a message broker in two separate operations risks a partial failure where the DB write succeeds but the broker publish fails (or vice versa). The outbox pattern eliminates this by inserting the event into an outbox table within the same ACID database transaction as the business data — if the transaction rolls back, the event is also rolled back. A separate relay (Debezium CDC, polling loop, or Transactional Outbox library) reads the outbox table and publishes to the broker with at-least-once semantics. Consumers handle duplicates idempotently.',
    compiledJS: `-- Transactional outbox: one DB transaction, no distributed 2PC
BEGIN;

-- 1. Update business state
UPDATE orders SET status = 'CONFIRMED' WHERE id = 'order-123';

-- 2. Insert event into outbox (same transaction)
INSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload, created_at)
VALUES (
  gen_random_uuid(),
  'ORDER',
  'order-123',
  'ORDER_CONFIRMED',
  '{"orderId":"order-123","total":99.0}'::jsonb,
  NOW()
);

COMMIT;
-- If COMMIT fails, both writes roll back — no orphaned event

-- Relay process (Debezium CDC reads WAL and publishes to Kafka)
-- No polling needed — Debezium streams the outbox table changes
-- to kafka topic: outbox.event.ORDER`,
    bestPractice:
      'Use Debezium with the Outbox Event Router SMT for the relay — it reads PostgreSQL WAL via CDC and routes outbox records directly to Kafka topics without polling the database table. This is more efficient than a polling loop and scales to high-insert-rate scenarios. Mark outbox records as published (or delete them) after Debezium confirms delivery to avoid unbounded table growth.',
    source: 'microservices.io — Transactional Outbox Pattern; Debezium Docs — Outbox Event Router',
  },

  {
    id: 'a09',
    topic: 'Kafka Connect',
    question: 'What is Kafka Connect and what are its two main connector types?',
    code: null,
    options: [
      'Kafka Connect is a client library for building custom consumer groups; its two types are polling and push connectors',
      'Kafka Connect is a framework for scalably streaming data between Kafka and external systems; Source connectors ingest data into Kafka, and Sink connectors export data from Kafka to external targets',
      'Kafka Connect is a monitoring tool; its connector types are metrics and logs connectors',
      'Kafka Connect is a schema registry extension; its types are Avro connectors and Protobuf connectors',
    ],
    correctIndex: 1,
    explanation:
      'Kafka Connect is a scalable, fault-tolerant data pipeline framework that moves data between Kafka and external systems without writing custom producer/consumer code. Source connectors pull data from databases (Debezium CDC), files, APIs, or cloud services into Kafka topics. Sink connectors push Kafka topic data into data warehouses (Snowflake, BigQuery), search engines (Elasticsearch), object storage (S3), or databases. Connectors run as tasks distributed across a Connect worker cluster, with automatic fault tolerance and offset tracking.',
    compiledJS: `# Deploy a JDBC Source connector (polls Postgres, pushes to Kafka)
curl -X POST http://localhost:8083/connectors \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "postgres-source",
    "config": {
      "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",
      "connection.url": "jdbc:postgresql://db:5432/mydb",
      "connection.user": "kafka_user",
      "connection.password": "secret",
      "table.whitelist": "orders,customers",
      "mode": "timestamp+incrementing",
      "timestamp.column.name": "updated_at",
      "incrementing.column.name": "id",
      "topic.prefix": "postgres."
    }
  }'

# Deploy an S3 Sink connector (Kafka → S3 for analytics)
curl -X POST http://localhost:8083/connectors \\
  -H 'Content-Type: application/json' \\
  -d '{
    "name": "s3-sink",
    "config": {
      "connector.class": "io.confluent.connect.s3.S3SinkConnector",
      "tasks.max": "3",
      "topics": "orders",
      "s3.region": "us-east-1",
      "s3.bucket.name": "my-kafka-data",
      "storage.class": "io.confluent.connect.s3.storage.S3Storage",
      "format.class": "io.confluent.connect.s3.format.parquet.ParquetFormat",
      "flush.size": "1000"
    }
  }'`,
    bestPractice:
      'Prefer Kafka Connect over custom producer/consumer code for standard data pipeline tasks — the connector ecosystem has hundreds of pre-built, battle-tested connectors. Run Connect workers in distributed mode (not standalone) in production for automatic fault recovery. Use Debezium as your Source connector for database change data capture — it reads the WAL directly and is far more reliable and low-overhead than polling.',
    source: 'Apache Kafka Docs — Kafka Connect; Debezium Docs',
  },

  {
    id: 'a10',
    topic: 'Cross-Region Replication',
    question: 'How does cross-region replication differ between SQS-based fan-out and Kafka MirrorMaker 2?',
    code: null,
    options: [
      'SQS fan-out and MirrorMaker 2 are functionally identical; the choice depends only on cost',
      'SQS fan-out uses SNS to push messages to queues in multiple regions simultaneously (active-active), while MirrorMaker 2 asynchronously replicates Kafka topics and consumer group offsets across clusters, supporting both active-active and active-passive topologies',
      'SQS fan-out replicates messages using Kafka Connect; MirrorMaker 2 uses AWS Data Sync',
      'MirrorMaker 2 works only with exactly-once semantics; SQS fan-out works only with at-most-once semantics',
    ],
    correctIndex: 1,
    explanation:
      'SQS cross-region fan-out uses Amazon SNS to simultaneously push messages to SQS queues in multiple regions — simple, managed, active-active push with no additional infrastructure. MirrorMaker 2 (MM2) is a Kafka Connect-based replication tool that asynchronously replicates topic data and consumer group offsets from a source Kafka cluster to a destination cluster. MM2 supports active-passive (DR), active-active (bidirectional with automatic offset translation), and hub-spoke topologies. The offset replication enables seamless consumer failover between clusters without message loss or duplicate processing.',
    compiledJS: `# MirrorMaker 2 config: us-east-1 → eu-west-1 (active-passive DR)
# mm2.properties
clusters = us-east, eu-west
us-east.bootstrap.servers = broker1.us-east:9092,broker2.us-east:9092
eu-west.bootstrap.servers = broker1.eu-west:9092,broker2.eu-west:9092

us-east->eu-west.enabled = true
us-east->eu-west.topics = .*             # replicate all topics
us-east->eu-west.groups = .*             # replicate all consumer offsets

# Topic prefix in destination: us-east.orders (preserves source identity)
replication.factor = 3
emit.checkpoints.interval.seconds = 60  # offset sync frequency

# Start MM2
connect-mirror-maker.sh mm2.properties

# SNS → SQS multi-region fan-out (managed, no MM2 needed)
aws sns subscribe --topic-arn $SNS_ARN_US_EAST \\
  --protocol sqs --notification-endpoint $SQS_ARN_EU_WEST
# SNS delivers to both regions on every publish`,
    bestPractice:
      'For Kafka DR, use MirrorMaker 2 with checkpoints enabled so consumer group offsets are replicated — without this, failing over to the DR cluster causes consumers to reprocess from the beginning or skip messages depending on auto.offset.reset. For SQS-based systems, use the SNS→SQS multi-region fan-out pattern and ensure your DLQs exist in both regions. Test failover quarterly; a DR topology you have never exercised is not a DR topology.',
    source: 'Apache Kafka Docs — MirrorMaker 2; AWS Docs — SNS Cross-Region Delivery',
  },
]
