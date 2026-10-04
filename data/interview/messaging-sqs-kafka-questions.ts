import type { InterviewQuestion } from '@/lib/interviewTypes'

export const MESSAGING_SQS_KAFKA_QUESTIONS: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "Message Queues",
    "question": "What is the primary purpose of a message queue in a distributed system?",
    "code": null,
    "options": [
      "To store data permanently in a relational table engine",
      "To decouple producers and consumers for async workflows",
      "To synchronize blocking HTTP calls between microservices",
      "To provide an in-memory key-value cache layer for nodes"
    ],
    "correctIndex": 1,
    "explanation": "A message queue decouples producers from consumers, allowing each side to run at its own pace without direct synchronization. The producer sends a message and moves on; the consumer processes it whenever it is ready. This decoupling improves resilience: if the consumer is temporarily unavailable, messages queue up rather than causing the producer to fail. It also enables independent scaling of the two sides, which is a foundational principle in event-driven and microservice architectures.",
    "compiledJS": "// Producer (Order Service) — does NOT call Consumer directly\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/order-queue \\\n  --message-body '{\"orderId\":\"abc\",\"total\":49.99}'\n# Producer immediately returns; Consumer is invoked separately\n\n// Consumer (Fulfillment Service) — runs on its own schedule\naws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/order-queue \\\n  --max-number-of-messages 10\n# If consumer is offline, messages wait — producer never blocks",
    "bestPractice": "In production, always pair queue-based decoupling with a Dead Letter Queue so that messages that repeatedly fail are captured for inspection rather than silently lost. Use CloudWatch metrics on ApproximateNumberOfMessagesVisible to detect when consumers are falling behind and trigger auto-scaling.",
    "source": "AWS Docs — Amazon SQS: How It Works"
  },
  {
    "id": "b02",
    "topic": "Producer/Consumer",
    "question": "In the producer/consumer model, what is the role of a producer?",
    "code": null,
    "options": [
      "It reads and processes messages from the queue",
      "It manages the queue infrastructure and routing rules",
      "It sends messages to the queue for downstream processing",
      "It monitors queue depth and triggers auto-scaling"
    ],
    "correctIndex": 2,
    "explanation": "A producer publishes messages into the queue; a consumer reads and processes those messages on the other end. Producers and consumers know nothing about each other — they only share knowledge of the queue or topic name. This separation of concerns means you can replace, scale, or modify a consumer without changing any producer code. In Kafka, producers write to a topic; in SQS, they call SendMessage against a queue URL.",
    "compiledJS": "// Producer: write a message (Kafka example)\nconst { Kafka } = require('kafkajs')\nconst kafka = new Kafka({ clientId: 'order-svc', brokers: ['broker:9092'] })\nconst producer = kafka.producer()\nawait producer.connect()\nawait producer.send({\n  topic: 'orders',\n  messages: [{ key: 'order-1', value: JSON.stringify({ orderId: 1, total: 99 }) }],\n})\nawait producer.disconnect()\n\n// Consumer: read messages\nconst consumer = kafka.consumer({ groupId: 'fulfillment-group' })\nawait consumer.connect()\nawait consumer.subscribe({ topic: 'orders', fromBeginning: false })\nawait consumer.run({ eachMessage: async ({ message }) => {\n  console.log('Processing:', message.value?.toString())\n}})",
    "bestPractice": "Producers should always serialize messages using a versioned schema (Avro/Protobuf with a schema registry) rather than raw JSON strings — this prevents deserialization failures when the payload shape changes. Set acks=all on Kafka producers to ensure the message is confirmed by all ISR replicas before the send call returns.",
    "source": "Apache Kafka Docs — Producer API"
  },
  {
    "id": "b03",
    "topic": "SQS Basics",
    "question": "What is Amazon SQS?",
    "code": null,
    "options": [
      "A fully managed relational database service from AWS",
      "A fully managed message queuing service from AWS",
      "An open-source distributed streaming platform",
      "A serverless compute engine for batch jobs"
    ],
    "correctIndex": 1,
    "explanation": "Amazon SQS (Simple Queue Service) is a fully managed, serverless message queuing service offered by AWS. It eliminates the operational overhead of running and scaling a message broker: AWS handles availability, durability, and scaling automatically. SQS supports Standard queues (best-effort ordering, at-least-once delivery, nearly unlimited throughput) and FIFO queues (strict ordering, exactly-once processing, up to 3,000 TPS with batching). Messages are retained from 1 minute to 14 days and are stored redundantly across multiple availability zones.",
    "compiledJS": "# Create a Standard SQS queue\naws sqs create-queue --queue-name my-orders\n\n# Send a message\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123456789/my-orders \\\n  --message-body '{\"event\":\"ORDER_PLACED\",\"orderId\":\"xyz\"}'\n\n# Receive and delete a message\nMSG=$(aws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123456789/my-orders \\\n  --query 'Messages[0]')\nRECEIPT=$(echo $MSG | jq -r '.ReceiptHandle')\naws sqs delete-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123456789/my-orders \\\n  --receipt-handle \"$RECEIPT\"",
    "bestPractice": "Always enable server-side encryption (SSE) on SQS queues using AWS KMS for queues that carry sensitive data. Configure a Dead Letter Queue with a redrive policy (maxReceiveCount: 3–5) from day one — finding out a bug has silently discarded messages in production is very expensive.",
    "source": "AWS Docs — Amazon SQS Developer Guide"
  },
  {
    "id": "b04",
    "topic": "FIFO Queue",
    "question": "What is the key difference between an SQS Standard queue and an SQS FIFO queue?",
    "code": null,
    "options": [
      "Standard queues ensure strict FIFO order; FIFO queues provide random dispatch",
      "FIFO queues guarantee strict order and deduplication; Standard offers best-effort",
      "Standard queues enforce payload encryption; FIFO queues do not support KMS keys",
      "FIFO queues offer cheaper per-message costs; Standard queues enforce hard limits"
    ],
    "correctIndex": 1,
    "explanation": "FIFO queues strictly preserve message order and prevent duplicates within a 5-minute deduplication window, while Standard queues offer higher throughput with best-effort ordering and at-least-once delivery. FIFO queues are capped at 300 TPS (or 3,000 with batching), making them unsuitable for very high-throughput workloads. Standard queues can handle nearly unlimited TPS but may deliver messages out of order or more than once, so consumers must be idempotent. Choose FIFO when ordering or deduplication is a hard business requirement (e.g., financial transactions).",
    "compiledJS": "# Create a FIFO queue — note the .fifo suffix is REQUIRED\naws sqs create-queue \\\n  --queue-name payment-events.fifo \\\n  --attributes FifoQueue=true,ContentBasedDeduplication=true\n\n# Send a message with a MessageGroupId (required for FIFO)\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/payment-events.fifo \\\n  --message-body '{\"type\":\"PAYMENT\",\"amount\":100}' \\\n  --message-group-id \"user-42\" \\\n  --message-deduplication-id \"txn-9876\"\n# Messages with the same GroupId are processed in order",
    "bestPractice": "Use MessageGroupId to scope ordering to a logical entity (e.g., user ID or order ID) rather than a single global group — a single group serializes all processing and tanks throughput. Spread traffic across many distinct group IDs to approach the 3,000 TPS ceiling while preserving per-entity ordering.",
    "source": "AWS Docs — Amazon SQS FIFO Queues"
  },
  {
    "id": "b05",
    "topic": "At-Least-Once Delivery",
    "question": "What does 'at-least-once delivery' mean in a messaging system?",
    "code": null,
    "options": [
      "A message is delivered strictly once with zero duplicate possibilities",
      "A message may arrive more than once, requiring idempotent consumer logic",
      "A message is delivered only when downstream consumer workers are online",
      "A message is retained in queue memory until consumer groups acknowledge"
    ],
    "correctIndex": 1,
    "explanation": "At-least-once delivery guarantees the message reaches the consumer but allows duplicates. In SQS, a message becomes visible again after the visibility timeout expires if it was not explicitly deleted — meaning a network glitch or consumer crash can cause the same message to be received twice. Consumers must therefore be idempotent: processing the same message twice should produce the same result as processing it once. Common patterns include checking a processed-ID table in DynamoDB before acting, or using database unique constraints to silently absorb duplicate writes.",
    "compiledJS": "// Idempotent consumer pattern (Node.js + DynamoDB)\nconst { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')\nconst db = new DynamoDBClient({})\n\nasync function processMessage(msg) {\n  const msgId = msg.MessageId\n  try {\n    // Conditional write: fails if item already exists\n    await db.send(new PutItemCommand({\n      TableName: 'ProcessedMessages',\n      Item: { messageId: { S: msgId } },\n      ConditionExpression: 'attribute_not_exists(messageId)',\n    }))\n  } catch (e) {\n    if (e.name === 'ConditionalCheckFailedException') {\n      console.log('Duplicate — skipping', msgId)\n      return // already processed, safe to delete from queue\n    }\n    throw e\n  }\n  // ... actual business logic ...\n}",
    "bestPractice": "Design every SQS consumer to be naturally idempotent: use database upserts rather than inserts, emit events that are safe to replay, and store a deduplication token (the SQS MessageId) in your datastore. For SQS FIFO queues, enable ContentBasedDeduplication or supply a MessageDeduplicationId — but still write idempotent consumers as a defence-in-depth measure.",
    "source": "AWS Docs — SQS at-least-once delivery; DDIA — Chapter 11"
  },
  {
    "id": "b06",
    "topic": "Dead Letter Queue",
    "question": "What is a Dead Letter Queue (DLQ)?",
    "code": null,
    "options": [
      "A high-speed temporary queue that purges messages automatically if they remain unconsumed after sixty seconds",
      "A secondary queue capturing messages that exceed the maximum configured threshold of failed processing attempts",
      "A critical-priority queue engineered with cross-region replication to broadcast urgent operational outage alerts",
      "An audit queue that logs forensic checkpoints and metadata for every successfully executed worker transaction"
    ],
    "correctIndex": 1,
    "explanation": "A DLQ captures messages that repeatedly fail processing (after a configurable maxReceiveCount) so they can be inspected and reprocessed without blocking the main queue. Without a DLQ, a \"poison pill\" message — one that always causes a consumer exception — would cycle back to the queue indefinitely, consuming processing capacity and potentially delaying all other messages. DLQs exist in both SQS and Kafka (as a convention, not a native feature in Kafka); in Kafka, the pattern is implemented by routing failed messages to a separate error topic.",
    "compiledJS": "# 1. Create the DLQ\naws sqs create-queue --queue-name orders-dlq\nDLQ_ARN=$(aws sqs get-queue-attributes \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders-dlq \\\n  --attribute-names QueueArn --query Attributes.QueueArn --output text)\n\n# 2. Create the main queue with a redrive policy\naws sqs create-queue \\\n  --queue-name orders \\\n  --attributes \"{\n    \\\"RedrivePolicy\\\": \\\"{\\\\\\\"deadLetterTargetArn\\\\\\\":\\\\\\\"$DLQ_ARN\\\\\\\",\\\\\\\"maxReceiveCount\\\\\\\":\\\\\\\"3\\\\\\\"}\\\"\n  }\"\n# After 3 failed receive+delete cycles, message moves to orders-dlq",
    "bestPractice": "Set a CloudWatch alarm on ApproximateNumberOfMessagesVisible for every DLQ — a non-zero DLQ depth indicates a consumer bug or data quality problem that needs immediate attention. Keep DLQ message retention at the maximum (14 days) so you have time to diagnose and replay; for Kafka, route failures to a -error topic with the original topic, partition, and offset in the message headers for easy replay.",
    "source": "AWS Docs — SQS Dead Letter Queues"
  },
  {
    "id": "b07",
    "topic": "Kafka Introduction",
    "question": "What is Apache Kafka?",
    "code": null,
    "options": [
      "A relational database engine optimized for storing tabular time-series",
      "A distributed event stream platform for high-throughput fault-tolerant logs",
      "An in-memory cluster cache built to replace Redis in serverless workloads",
      "An API gateway designed for routing synchronous REST HTTP microservice calls"
    ],
    "correctIndex": 1,
    "explanation": "Apache Kafka is an open-source distributed event streaming platform originally built at LinkedIn and later open-sourced through the Apache Software Foundation. It stores events on an append-only, partitioned, replicated log. Kafka is designed for high throughput (millions of messages per second), fault tolerance (configurable replication), and durability (messages retained for a configurable period, not just until consumed). Unlike traditional queues, Kafka decouples retention from consumption: multiple independent consumer groups can read the same log from different offsets.",
    "compiledJS": "# Start a local Kafka cluster (KRaft mode — no ZooKeeper)\ndocker run -d --name kafka \\\n  -e KAFKA_NODE_ID=1 \\\n  -e KAFKA_PROCESS_ROLES=broker,controller \\\n  -e KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \\\n  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \\\n  -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 \\\n  -p 9092:9092 \\\n  apache/kafka:3.7.0\n\n# Create a topic with 3 partitions, replication factor 1\nkafka-topics.sh --create \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 3 \\\n  --replication-factor 1\n\n# Produce a message\necho \"order-1:{'total':99}\" | kafka-console-producer.sh \\\n  --topic orders --bootstrap-server localhost:9092 --property \"parse.key=true\"",
    "bestPractice": "Always deploy Kafka with a replication factor of at least 3 in production, with min.insync.replicas=2 and acks=all on producers. This configuration tolerates one broker failure without data loss. Use Amazon MSK or Confluent Cloud for managed operations unless you have dedicated SRE capacity to manage Kafka clusters yourself.",
    "source": "Apache Kafka Docs — Introduction"
  },
  {
    "id": "b08",
    "topic": "Topic vs Queue",
    "question": "How does a Kafka topic differ from a traditional message queue?",
    "code": null,
    "options": [
      "A topic drops message payloads immediately after a single consumer read",
      "A topic retains an append log allowing multiple consumer groups to read",
      "A topic restricts producers to a solitary write stream at any given moment",
      "A topic guarantees sub-millisecond end-to-end transport across all nodes"
    ],
    "correctIndex": 1,
    "explanation": "Unlike a queue that removes a message once it is consumed, a Kafka topic persists messages on an append-only partitioned log, allowing multiple independent consumer groups to read the same data from different offsets. Messages are retained for a configurable period (default 7 days) or until disk quota is reached, regardless of whether they have been consumed. This makes Kafka suitable for replay, audit trails, and fan-out scenarios where the same event feeds multiple downstream services simultaneously.",
    "compiledJS": "# Two independent consumer groups reading the same topic\n# Group 1: Analytics service — starts from the beginning\nkafka-console-consumer.sh \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --group analytics-group \\\n  --from-beginning\n\n# Group 2: Fulfillment service — reads only new messages\nkafka-console-consumer.sh \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group\n\n# Both groups get all messages; neither affects the other's offset\n# An SQS queue would only deliver each message to ONE consumer",
    "bestPractice": "Use Kafka when you need fan-out to multiple independent consumers or the ability to replay historical events. Use SQS when you need a simpler, managed work queue where each message is processed by exactly one worker and you do not need to replay. Avoid using Kafka as a pure queue replacement — its operational complexity is only justified when you need its multi-consumer or replay capabilities.",
    "source": "Apache Kafka Docs — Topics and Partitions"
  },
  {
    "id": "b09",
    "topic": "Consumer Groups",
    "question": "What is a Kafka consumer group?",
    "code": null,
    "options": [
      "A cluster of broker instances that coordinate partition replication sets",
      "A set of consumers reading jointly from distinct topic partition slices",
      "An administrator role that governs topic creation and partition deletion",
      "A pool of upstream producers that share a unified client identifier tag"
    ],
    "correctIndex": 1,
    "explanation": "A consumer group allows horizontal scaling of message processing: each partition is assigned to exactly one consumer within the group at any given time. If a group has three consumers and a topic has six partitions, each consumer handles two partitions in parallel. If one consumer crashes, Kafka triggers a rebalance and redistributes its partitions to the remaining healthy consumers. Different consumer groups maintain independent offsets and do not interfere with each other — each group sees all messages on the topic.",
    "compiledJS": "// Consumer group with 3 members (KafkaJS)\nconst { Kafka } = require('kafkajs')\nconst kafka = new Kafka({ brokers: ['broker:9092'] })\n\n// Three instances of this code with the SAME groupId form a group\nconst consumer = kafka.consumer({ groupId: 'fulfillment-group' })\nawait consumer.connect()\nawait consumer.subscribe({ topic: 'orders', fromBeginning: false })\n\nawait consumer.run({\n  eachMessage: async ({ topic, partition, message }) => {\n    console.log(`Worker on partition ${partition}: ${message.value}`)\n  },\n})\n// Kafka assigns partitions so no two workers in the same group\n// receive the same message at the same time",
    "bestPractice": "Set the number of consumer instances equal to the number of partitions to achieve maximum parallelism — additional consumers beyond the partition count sit idle. Monitor consumer_lag via JMX or Prometheus; if lag grows persistently, either scale out consumers (up to partition count), increase partition count, or reduce per-message processing time.",
    "source": "Apache Kafka Docs — Consumer Groups"
  },
  {
    "id": "b10",
    "topic": "Global Ordering at Scale",
    "question": "Why is strict global message ordering difficult to guarantee at scale in distributed messaging systems?",
    "code": null,
    "options": [
      "Network jitter and parallel node workers turn global ordering into bottlenecks",
      "Ordering requires relational database storage engines unsupported in message queues",
      "TCP network layers inherently scramble incoming byte stream frames under load",
      "Brokers deliberately randomize message delivery order to balance worker consumption"
    ],
    "correctIndex": 0,
    "explanation": "Global ordering requires a single ordered sequence, which forces all writes through one serialized bottleneck — the antithesis of horizontal scaling. Distributed systems with multiple partitions or queue instances process messages in parallel across different nodes; enforcing a global order across those nodes would require distributed coordination (e.g., a global sequence number) that itself becomes a throughput bottleneck and a single point of failure. Kafka and SQS FIFO trade global ordering for partition-level or group-level ordering, achieving scalability while preserving the orderings that actually matter to business logic.",
    "compiledJS": null,
    "bestPractice": "Rarely does a system need strict global ordering across all messages. Identify the actual business invariant: usually it is \"events for a given entity (user, order, account) must be ordered.\" Model this with Kafka partition keys (same entity always routes to the same partition) or SQS FIFO MessageGroupIds so ordering is enforced per entity, not globally, allowing full horizontal scaling.",
    "source": "DDIA — Chapter 9: Consistency and Consensus; Apache Kafka Docs — Partitioning"
  },
  {
    "id": "i01",
    "topic": "Visibility Timeout",
    "question": "What is the SQS visibility timeout and why does it matter?",
    "code": null,
    "options": [
      "The maximum time a message can stay in the queue before being deleted automatically",
      "The period during which a received message is hidden from other consumers, preventing duplicate processing",
      "The delay before a newly sent message becomes visible to consumers",
      "The time window allowed for a consumer to authenticate before reading a message"
    ],
    "correctIndex": 1,
    "explanation": "The visibility timeout (default 30 s, configurable up to 12 hours) hides a message from all other consumers while one consumer is processing it. If the consumer successfully processes the message and calls DeleteMessage before the timeout expires, the message is permanently removed. If the consumer crashes or takes too long, the timeout expires and the message reappears in the queue for another consumer to retry. Setting the timeout too short causes spurious duplicates; too long delays retries after crashes. You can extend the timeout mid-processing with ChangeMessageVisibility if a job is running longer than expected.",
    "compiledJS": "# Receive a message — it is now invisible to others for 30 s (default)\naws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --visibility-timeout 60\n\n# If processing will exceed timeout, extend it dynamically\naws sqs change-message-visibility \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --receipt-handle \"AQEB...\" \\\n  --visibility-timeout 120    # add 2 more minutes\n\n# When done, delete — otherwise message reappears after timeout\naws sqs delete-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --receipt-handle \"AQEB...\"",
    "bestPractice": "Set the visibility timeout to at least 6× the median processing time of your slowest consumer. For long-running jobs, implement a \"heartbeat\" thread that calls ChangeMessageVisibility every 2/3 of the current timeout to keep the message hidden until processing completes. Alert on ApproximateAgeOfOldestMessage to detect consumers that are silently failing to delete messages.",
    "source": "AWS Docs — SQS Visibility Timeout"
  },
  {
    "id": "i02",
    "topic": "Long Polling",
    "question": "What is the advantage of SQS long polling over short polling?",
    "code": null,
    "options": [
      "Marks unacknowledged messages as poison pills and discards them immediately to prevent worker starvation faults",
      "Hides in-flight messages from other consumers while a worker processes them, reappearing if timeout expires unhandled",
      "Persists in-flight payloads into encrypted Amazon S3 buckets to guarantee durable retention during host machine crashes",
      "Restricts queue client connections to a single concurrent worker thread to guarantee strict sequential data consumption"
    ],
    "correctIndex": 1,
    "explanation": "Short polling returns immediately even if the queue is empty, leading to many empty ReceiveMessage API responses that incur cost and CPU overhead. Long polling waits up to 20 seconds for at least one message to arrive before returning; if a message arrives during the wait, it is returned immediately. This eliminates most empty responses, reducing SQS API costs by up to 70% for low-traffic queues, and lowers consumer CPU usage. Long polling is enabled by setting WaitTimeSeconds (1–20 s) on the ReceiveMessage call or in the queue attribute.",
    "compiledJS": "# Short polling — returns immediately (bad for idle queues)\naws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders\n# Often returns: { \"Messages\": [] } — costs money, wastes CPU\n\n# Long polling — waits up to 20 s for a message\naws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --wait-time-seconds 20\n# Returns as soon as a message arrives, or after 20 s if still empty\n\n# Set long polling as the queue default (so all clients benefit)\naws sqs set-queue-attributes \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --attributes ReceiveMessageWaitTimeSeconds=20",
    "bestPractice": "Always configure long polling (WaitTimeSeconds=20) at the queue level as a default, and also set it on each ReceiveMessage call. This is a free performance improvement — there is no reason to use short polling unless you have a specific real-time latency requirement that cannot tolerate a 20-second wait, which is rare in practice.",
    "source": "AWS Docs — SQS Long Polling"
  },
  {
    "id": "i03",
    "topic": "SQS Retention and Size",
    "question": "What are the default and maximum message retention periods for an SQS queue?",
    "code": null,
    "options": [
      "Default 1 day, maximum 7 days",
      "Default 4 days, maximum 14 days",
      "Default 7 days, maximum 30 days",
      "Default 1 hour, maximum 24 hours"
    ],
    "correctIndex": 1,
    "explanation": "SQS retains messages for 4 days by default; the range is 1 minute to 14 days. After the retention period expires, messages are automatically deleted regardless of whether they have been processed. The maximum message payload size is 256 KB; for larger payloads use the SQS Extended Client Library or the \"claim check\" pattern: store the payload in S3 and put only the S3 object reference in the SQS message. These limits apply to both Standard and FIFO queues.",
    "compiledJS": "# Set retention to maximum 14 days (1,209,600 seconds)\naws sqs set-queue-attributes \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --attributes MessageRetentionPeriod=1209600\n\n# Claim-check pattern: large payload stored in S3\n# 1. Upload payload to S3\nS3_KEY=\"payloads/order-$(uuidgen).json\"\naws s3 cp large-order.json s3://my-bucket/$S3_KEY\n\n# 2. Send only the reference in SQS\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --message-body \"{\"s3Key\":\"$S3_KEY\"}\"\n\n# Consumer fetches the real payload from S3",
    "bestPractice": "Keep retention at 14 days for queues connected to DLQs — this gives you maximum time to diagnose and replay failed messages before they expire. For queues handling ephemeral events (e.g., UI click telemetry) a shorter retention of 1–4 hours is fine and prevents unbounded storage growth if consumers fall behind.",
    "source": "AWS Docs — SQS Message Attributes and Limits"
  },
  {
    "id": "i04",
    "topic": "Kafka Partitions",
    "question": "How do Kafka partitions enable parallelism in message consumption?",
    "code": null,
    "options": [
      "Partitions encrypt messages into distinct physical storage volumes on disk",
      "Partitions divide topic streams across consumers for parallel horizontal reads",
      "Partitions compress records to increase worker execution throughput per second",
      "Partitions buffer producer batches to avoid broker memory starvation faults"
    ],
    "correctIndex": 1,
    "explanation": "A Kafka topic is divided into N independent ordered logs called partitions, each hosted on a different broker (or the same broker with replicas on others). Within a consumer group, Kafka assigns each partition to exactly one consumer — so with 6 partitions and 3 consumers, each consumer handles 2 partitions in parallel, tripling throughput compared to a single consumer. Ordering is guaranteed within a partition but not across partitions. The maximum degree of parallelism for a consumer group equals the number of partitions — additional consumers beyond that sit idle.",
    "compiledJS": "# Topic with 6 partitions — 6-way consumer parallelism possible\nkafka-topics.sh --create \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 6 \\\n  --replication-factor 3\n\n# Check partition assignment for a consumer group\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --describe\n# Output:\n# CONSUMER-ID          PARTITION  CURRENT-OFFSET  LOG-END  LAG\n# worker-1             0          1024            1024     0\n# worker-1             1          980             980      0\n# worker-2             2          1100            1100     0\n# worker-2             3          995             995      0\n# worker-3             4          870             870      0\n# worker-3             5          910             910      0",
    "bestPractice": "Size partitions generously (err on the side of more) because increasing partitions on a live topic is a one-way operation that triggers rebalancing and ordering disruption. A common heuristic is: target throughput / per-partition throughput (≈10 MB/s) + 20% headroom. Avoid more than ~4,000 partitions per broker to keep memory pressure and rebalance times manageable.",
    "source": "Apache Kafka Docs — Topics and Partitions; Confluent Blog — How to Choose the Number of Partitions"
  },
  {
    "id": "i05",
    "topic": "Committed vs Latest Offset",
    "question": "What is the difference between a committed offset and the latest offset in Kafka?",
    "code": null,
    "options": [
      "Committed offset is next to write; latest offset is the oldest preserved log",
      "Committed offset is consumer confirmed; latest offset is the partition tip",
      "Committed offset resides in SSD blocks; latest offset lives in broker memory",
      "Committed offset governs producer batches; latest offset governs consumer lag"
    ],
    "correctIndex": 1,
    "explanation": "The latest offset (also called the log-end offset or LEO) is the position of the most recently written message in a partition. The committed offset is the offset that a consumer group has durably recorded as \"processed\" in the internal __consumer_offsets topic. Consumer lag = latest_offset − committed_offset. Minimising this gap is the key operational goal for consumer health. Committing offsets too eagerly (before processing completes) risks data loss on crash; committing too infrequently increases re-processing on restart.",
    "compiledJS": "# Check committed offsets and lag for a consumer group\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --describe\n\n# Output columns:\n# TOPIC    PARTITION  CURRENT-OFFSET(committed)  LOG-END-OFFSET(latest)  LAG\n# orders   0          5420                        5420                    0     <- healthy\n# orders   1          5100                        5420                    320   <- consumer behind!\n# orders   2          5380                        5420                    40    <- slight lag\n\n# Reset offsets to re-process from beginning (use with care)\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --topic orders \\\n  --reset-offsets --to-earliest --execute",
    "bestPractice": "Commit offsets AFTER successful processing, not before. Use Kafka's auto.commit=false in production and commit manually after the business logic succeeds. Alert on consumer lag > a threshold (e.g., 10,000 messages or growing for more than 5 minutes) to catch processing bottlenecks before they become outages.",
    "source": "Apache Kafka Docs — Offset Management"
  },
  {
    "id": "i06",
    "topic": "Consumer Group Rebalancing",
    "question": "What triggers a Kafka consumer group rebalance?",
    "code": null,
    "options": [
      "A topic administrator dynamically increases partition counts in production",
      "A consumer joins, leaves, or times out, redistributing partition assignments",
      "A producer sends message payloads exceeding maximum configured segment limits",
      "A broker cluster triggers ZooKeeper or KRaft metadata elections across nodes"
    ],
    "correctIndex": 1,
    "explanation": "A rebalance is triggered when a consumer joins the group, leaves gracefully (shutdown), fails its heartbeat (session.timeout.ms exceeded), or when the topic's partition count changes. During a rebalance, all consumers in the group pause consumption while the group coordinator reassigns partitions — this is known as a \"stop the world\" rebalance. Kafka 2.4+ introduced incremental cooperative rebalancing, which minimises disruption by only moving partitions that need to change ownership rather than revoking all assignments.",
    "compiledJS": "// Consumer config to reduce rebalance impact\nconst consumer = kafka.consumer({\n  groupId: 'fulfillment-group',\n  sessionTimeout: 30000,          // 30 s — time before broker marks consumer dead\n  heartbeatInterval: 3000,        // 3 s — send heartbeat every 3 s\n  maxPollIntervalMs: 300000,      // 5 min — max time between poll() calls\n  // Cooperative rebalancing (Kafka 2.4+)\n  rebalanceTimeout: 60000,\n})\n\n// Listen for rebalance events\nconsumer.on(consumer.events.REBALANCING, () => {\n  console.log('Rebalance in progress — pausing processing')\n})\nconsumer.on(consumer.events.GROUP_JOIN, () => {\n  console.log('Joined group — resuming')\n})",
    "bestPractice": "Minimise rebalances by setting maxPollIntervalMs comfortably above your slowest message processing time, and deploying consumer updates with rolling restarts rather than killing all instances simultaneously. Enable cooperative rebalancing (partition.assignment.strategy=CooperativeStickyAssignor) in Kafka 2.4+ to avoid the full stop-the-world pause. Monitor kafka_consumer_group_rebalances_per_second in Grafana — frequent rebalances indicate an unhealthy consumer fleet.",
    "source": "Apache Kafka Docs — Consumer Group Rebalancing; KIP-429 Incremental Cooperative Rebalancing"
  },
  {
    "id": "i07",
    "topic": "Replication Factor and ISR",
    "question": "What is the purpose of a Kafka replication factor, and what does ISR mean?",
    "code": null,
    "options": [
      "Replication sets queue TTL; ISR measures internal segment retention windows",
      "Replication defines copy count; ISR is the set of caught-up partition replicas",
      "Replication sets consumer concurrency; ISR tracks offset lag across brokers",
      "Replication defines zstd compression; ISR logs checksum indexes for segments"
    ],
    "correctIndex": 1,
    "explanation": "A replication factor of N means each partition has one leader and N-1 follower replicas across different brokers. Kafka acknowledges a producer write only when the required number of ISR (In-Sync Replicas) have confirmed receipt — controlled by acks and min.insync.replicas. ISR is the dynamic set of followers that are within replica.lag.time.max.ms of the leader; a lagging follower is removed from the ISR until it catches up. If the leader broker crashes, Kafka elects a new leader from the ISR, preventing data loss.",
    "compiledJS": "# Topic with replication factor 3\nkafka-topics.sh --create \\\n  --topic payments \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 6 \\\n  --replication-factor 3\n\n# Check ISR for each partition\nkafka-topics.sh --describe \\\n  --topic payments \\\n  --bootstrap-server localhost:9092\n# Output:\n# Partition: 0  Leader: 1  Replicas: 1,2,3  Isr: 1,2,3  <- all in sync\n# Partition: 1  Leader: 2  Replicas: 2,3,1  Isr: 2,3    <- broker 1 lagging!\n\n# Producer config for maximum durability\n# acks=all + min.insync.replicas=2 on broker",
    "bestPractice": "Use replication factor 3 with min.insync.replicas=2 and acks=all on producers for production data. This tolerates one broker failure without data loss and without blocking producers. Never set min.insync.replicas equal to the replication factor — if one replica is temporarily offline, all produces will block. Monitor UnderReplicatedPartitions JMX metric; a non-zero value means data is not fully replicated and the cluster is at risk.",
    "source": "Apache Kafka Docs — Replication; Confluent Docs — ISR"
  },
  {
    "id": "i08",
    "topic": "Exactly-Once Semantics",
    "question": "Which Kafka configuration achieves exactly-once semantics end-to-end?",
    "code": null,
    "options": [
      "Setting acks=0 on producers to bypass retries and using single-partition FIFO topics with manual consumer offset commits",
      "Enabling idempotent producers with transactional APIs while configuring consumers with `isolation.level=read_committed`",
      "Disabling batching on producers and delegating message deduplication to a zero-latency fault-tolerant ZooKeeper cluster",
      "Using synchronous replication across all brokers while allowing consumers to auto-commit offsets for every received payload"
    ],
    "correctIndex": 1,
    "explanation": "Kafka exactly-once semantics (EOS) requires three things working together: (1) Idempotent producer — each message is assigned a producer ID + sequence number, so duplicate retries on the broker are deduplicated. (2) Transactional producer API — produce and offset-commit are wrapped in an atomic transaction, so either both happen or neither does. (3) isolation.level=read_committed on consumers — they only see messages from committed transactions, not in-flight or aborted ones. EOS was introduced in Kafka 0.11 and is used by Kafka Streams natively.",
    "compiledJS": "// Producer with exactly-once semantics\nconst producer = kafka.producer({\n  transactionalId: 'payment-processor-1',  // unique per producer instance\n  maxInFlightRequests: 5,\n  idempotent: true,   // enable.idempotence=true\n})\nawait producer.connect()\nawait producer.transaction(async (tx) => {\n  await tx.send({ topic: 'payments', messages: [{ value: 'pay-123' }] })\n  await tx.sendOffsets({\n    consumerGroupId: 'payment-consumer',\n    topics: [{ topic: 'orders', partitions: [{ partition: 0, offset: '42' }] }],\n  })\n  // Both the produce AND the offset commit happen atomically\n})\n\n// Consumer reads only committed transactions\nconst consumer = kafka.consumer({\n  groupId: 'payment-consumer',\n  readUncommitted: false,  // isolation.level=read_committed\n})",
    "bestPractice": "EOS comes at a performance cost (roughly 10–20% throughput reduction) due to transaction coordination overhead. Use it only when duplicates would cause real harm (e.g., financial debit operations). For most event streaming use cases, at-least-once delivery with idempotent consumers is simpler, more performant, and equally correct.",
    "source": "Apache Kafka Docs — Exactly-Once Semantics; Kafka KIP-98"
  },
  {
    "id": "i09",
    "topic": "SQS vs SNS vs EventBridge",
    "question": "What is the primary difference between Amazon SQS, Amazon SNS, and Amazon EventBridge?",
    "code": null,
    "options": [
      "SQS is a point-to-point queue for async tasks; SNS is a pub/sub fanout engine; EventBridge is an event bus with schemas",
      "SQS handles heavy real-time data streaming; SNS processes offline batch jobs; EventBridge connects IoT telemetry nodes",
      "All three services share identical underlying protocol engines, differing solely in how AWS calculates throughput billing",
      "SNS persists payloads for fourteen days like SQS; EventBridge operates in memory without content-based JSON filter rules"
    ],
    "correctIndex": 0,
    "explanation": "SQS is a point-to-point queue: one message is delivered to one consumer (or one consumer group when using competing consumers). SNS is a push-based pub/sub service: one published message is immediately fanned out to all subscribers (SQS queues, Lambda functions, HTTP endpoints, email). EventBridge adds content-based routing: rules inspect the event body and route matching events to specific targets, and it integrates with 200+ SaaS event sources (Shopify, GitHub, etc.) and has a built-in schema registry. A common pattern is SNS → multiple SQS queues for reliable fanout with buffering.",
    "compiledJS": "# SNS → SQS fan-out pattern (each subscriber gets its own queue)\n\n# 1. Create SNS topic\nSNS_ARN=$(aws sns create-topic --name order-events --query TopicArn --output text)\n\n# 2. Create per-subscriber SQS queues\nQ1_URL=$(aws sqs create-queue --queue-name analytics-queue --query QueueUrl --output text)\nQ2_URL=$(aws sqs create-queue --queue-name fulfillment-queue --query QueueUrl --output text)\n\n# 3. Subscribe both queues to the SNS topic\nQ1_ARN=$(aws sqs get-queue-attributes --queue-url $Q1_URL \\\n  --attribute-names QueueArn --query Attributes.QueueArn --output text)\naws sns subscribe --topic-arn $SNS_ARN --protocol sqs --notification-endpoint $Q1_ARN\n\n# Now one SNS publish → both queues receive a copy",
    "bestPractice": "Use the SNS→SQS fan-out pattern when you need durable fan-out: SNS delivers to each SQS queue independently, so a slow analytics consumer cannot block the fulfillment consumer. Use EventBridge when events come from external SaaS systems or when you need content-based routing rules that evolve independently of producers and consumers.",
    "source": "AWS Docs — Amazon SNS vs SQS vs EventBridge; AWS Blog — Fan-out pattern"
  },
  {
    "id": "i10",
    "topic": "Log Compaction",
    "question": "What is Kafka log compaction and when should you use it?",
    "code": null,
    "options": [
      "A background daemon compressing log segments with gzip to save disk volume",
      "A retention policy keeping only the latest value for each distinct record key",
      "A Kafka Streams aggregation merging dual topics into a unified sorted stream",
      "A cleanup process deleting all messages older than the standard retention TTL"
    ],
    "correctIndex": 1,
    "explanation": "Log compaction is a retention policy where Kafka keeps only the latest record for each message key and discards older records with the same key. This allows the topic to function as a persistent key-value store: a consumer that starts from the beginning can reconstruct the latest state for every key by reading the compacted log, even if the topic has been running for years. Tombstone records (null value with a key) mark deletions. Compaction runs as a background thread on the broker and does not block producers or consumers.",
    "compiledJS": "# Create a compacted topic for user profile state\nkafka-topics.sh --create \\\n  --topic user-profiles \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 12 \\\n  --replication-factor 3 \\\n  --config cleanup.policy=compact \\\n  --config min.cleanable.dirty.ratio=0.1 \\\n  --config segment.ms=3600000    # compact at least every hour\n\n# Producer: update user 42's profile\nkafka-console-producer.sh \\\n  --topic user-profiles --bootstrap-server localhost:9092 \\\n  --property \"parse.key=true\" --property \"key.separator=:\"\n42:{\"name\":\"Alice\",\"email\":\"alice@example.com\"}   # v1\n42:{\"name\":\"Alice\",\"email\":\"alice@new.com\"}        # v2 — v1 eventually removed by compaction\n\n# Delete user 42 — send a tombstone (null value)\n42:null",
    "bestPractice": "Use log compaction for topics that represent mutable state (user profiles, account balances, configuration). Use time-based retention for immutable event streams (audit logs, click events). Never mix compaction with downstream consumers that depend on seeing every historical version of a key — compaction gives you latest-only semantics, not full history.",
    "source": "Apache Kafka Docs — Log Compaction"
  },
  {
    "id": "a01",
    "topic": "Log Segment Internals",
    "question": "What are the three files that make up a Kafka log segment and what does each store?",
    "code": null,
    "options": [
      ".log stores payload bytes; .index maps offsets to bytes; .timeindex maps timestamps",
      ".log stores offset metadata; .index stores binary records; .timeindex logs lag",
      ".log stores group state; .index stores producer tokens; .timeindex tracks replicas",
      ".log stores compressed batches; .index tracks schema IDs; .timeindex logs TTLs"
    ],
    "correctIndex": 0,
    "explanation": "Each Kafka partition is stored as a series of segments on disk. Each segment consists of: (1) .log — the raw append-only file of serialised message batches in binary format. (2) .index — a sparse offset index mapping message offsets to their byte position in the .log file, enabling O(1) seeks to a given offset. (3) .timeindex — maps timestamps to offsets, enabling time-based seeks (e.g., \"give me messages from the last hour\"). The active segment is the one currently being written; older segments are immutable and eligible for compaction or deletion according to the retention policy.",
    "compiledJS": "# Inspect log segment files on a Kafka broker\nls -la /var/kafka-logs/orders-0/\n# 00000000000000000000.index\n# 00000000000000000000.log\n# 00000000000000000000.timeindex\n# 00000000000001048576.index    <- next segment starts at offset 1,048,576\n# 00000000000001048576.log\n# 00000000000001048576.timeindex\n# leader-epoch-checkpoint\n\n# Dump the .log file in human-readable format\nkafka-dump-log.sh \\\n  --files /var/kafka-logs/orders-0/00000000000000000000.log \\\n  --print-data-log\n# Output: offset: 0 ... key: null value: {\"orderId\": \"abc\"}\n\n# Read from a specific timestamp (uses .timeindex internally)\nkafka-console-consumer.sh \\\n  --topic orders --bootstrap-server localhost:9092 \\\n  --offset 1048576 --partition 0",
    "bestPractice": "Tune log.segment.bytes (default 1 GB) and log.segment.ms (default 7 days) to balance segment count against recovery time. Smaller segments mean more files (higher inode pressure) but faster log compaction and faster retention cleanup. Monitor kafka_log_log_size and kafka_log_log_start_offset_delta in Prometheus; set up disk usage alerts well in advance of filling the broker disk, as a full Kafka disk is an immediate availability incident.",
    "source": "Apache Kafka Docs — Log Segments; Confluent Blog — Kafka Storage Internals"
  },
  {
    "id": "a02",
    "topic": "Hot Partitions",
    "question": "What is a hot partition in Kafka and how does key-based partitioning cause it?",
    "code": null,
    "options": [
      "A partition holding excessive replicas; key hashing places replicas unevenly",
      "A partition receiving excessive writes because a hot key hashes to that partition",
      "A partition temporarily disconnected; key hashing ignores it until node restart",
      "A partition running compaction; round-robin distribution prevents such compaction"
    ],
    "correctIndex": 1,
    "explanation": "Kafka's default partitioner hashes the message key with murmur2 and routes all messages with the same key to the same partition. If a small number of keys carry the majority of traffic (e.g., a viral user ID or a shared tenant ID in a multi-tenant system), those partitions receive far more data than others. This is a hot partition: it saturates its leader broker's network and disk I/O, and because partition assignments are fixed within a consumer group, the consumer handling that partition lags behind. Round-robin or null-key partitioning distributes load evenly but destroys per-key ordering.",
    "compiledJS": "// Custom partitioner to detect and re-route hot keys\nconst { Partitioners } = require('kafkajs')\n\nfunction hotKeyAwarePartitioner({ topic, partitionMetadata, message }) {\n  const numPartitions = partitionMetadata.length\n  const key = message.key?.toString()\n\n  // Known hot keys get spread across a dedicated partition range\n  const HOT_KEYS = new Set(['user-viral-123', 'tenant-mega-corp'])\n  if (key && HOT_KEYS.has(key)) {\n    // Hash into the upper half of partitions to spread hot-key load\n    const slot = Math.abs(hashFnv32a(key + Date.now().toString()))\n    return (Math.floor(numPartitions / 2) + (slot % Math.floor(numPartitions / 2)))\n  }\n  // Normal key-based routing for the rest\n  return Partitioners.DefaultPartitioner()({ topic, partitionMetadata, message })\n}",
    "bestPractice": "Detect hot partitions via kafka_topic_partition_messages_in_per_sec per partition in Grafana — a partition receiving 10× the median is a hot partition. Mitigations: (1) add a random salt suffix to the hot key to spread it across multiple partitions (trading ordering for load balance), (2) pre-partition hot tenants into dedicated topics, (3) increase partition count and add a custom partitioner. Always measure partition skew before scaling consumer instances.",
    "source": "Apache Kafka Docs — Custom Partitioners; Confluent Blog — Tackling Hot Partitions"
  },
  {
    "id": "a03",
    "topic": "Back-Pressure",
    "question": "How does back-pressure manifest in a Kafka consumer chain and what is a common mitigation strategy?",
    "code": null,
    "options": [
      "Back-pressure appears as producer throttling; the mitigation is to increase the number of topics",
      "It appears as consumer lag; consumers handle it by scaling instances or tuning poll intervals and max.poll.records",
      "Back-pressure appears as broker disk saturation; the mitigation is to enable log compaction",
      "Back-pressure appears as ZooKeeper timeouts; the mitigation is to upgrade to KRaft mode"
    ],
    "correctIndex": 1,
    "explanation": "Back-pressure in a Kafka consumer chain is visible as monotonically growing consumer lag — the consumer cannot process records as fast as producers write them. Kafka, unlike reactive streams frameworks, does not propagate back-pressure to producers (it stores the surplus on disk). Left unaddressed, growing lag eventually causes processing to fall behind the retention window, at which point records are deleted before being consumed. Mitigations include: (1) scale consumers horizontally up to the partition count, (2) increase the partition count to allow more consumer parallelism, (3) reduce per-message processing time through caching or async I/O, or (4) rate-limit producers.",
    "compiledJS": "# Monitor consumer lag — the key back-pressure signal\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --describe\n# Watch LAG column — if it grows every minute, back-pressure is occurring\n\n# Prometheus query: alert when lag > 50k for > 10 minutes\n# kafka_consumer_group_lag{group=\"fulfillment-group\"} > 50000\n\n# Scale consumers: add more instances (up to partition count)\n# kubectl scale deployment fulfillment-consumer --replicas=6\n# (topic has 6 partitions — 6 consumers = max parallelism)\n\n# If consumers == partitions and lag still grows → increase partitions\nkafka-topics.sh --alter \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 12   # double partitions, then scale consumers to 12",
    "bestPractice": "Instrument consumer lag alerting from day one: set a warning at lag > 10,000 messages and a critical alert at lag growing for more than 5 minutes. Use the lag-to-time metric (lag / messages-per-second) to estimate how far behind consumers are in real time. Pre-provision spare consumer capacity (N+1 or N+2) so that a single consumer crash does not immediately cause lag spikes in production.",
    "source": "Confluent Docs — Consumer Lag Monitoring; DDIA — Chapter 11: Stream Processing"
  },
  {
    "id": "a04",
    "topic": "Kafka Streams vs Flink vs Spark",
    "question": "How does Kafka Streams differ from Apache Flink and Apache Spark Structured Streaming for stateful stream processing?",
    "code": null,
    "options": [
      "Kafka Streams is a batch framework; Flink and Spark are pure streaming engines",
      "Kafka Streams is an embedded client library, while Flink and Spark require dedicated compute clusters",
      "Kafka Streams requires Kubernetes; Flink and Spark run on bare metal only",
      "Kafka Streams does not support stateful operations; Flink and Spark do"
    ],
    "correctIndex": 1,
    "explanation": "Kafka Streams embeds directly in your JVM application as a library with no external cluster dependency — it uses Kafka partitions for parallelism and RocksDB for local state stores. This makes deployment simple (just deploy more application instances) but limits processing semantics to what Kafka's consumer API can express. Flink is a dedicated distributed stream processing engine with richer windowing, out-of-order event handling (watermarks), and complex event processing (CEP). Spark Structured Streaming runs micro-batches on a Spark cluster with stronger batch/stream unification but higher latency. For most applications that already use Kafka, Kafka Streams is the simplest choice; Flink is preferred for complex stateful analytics with late data handling.",
    "compiledJS": "// Kafka Streams: word count (runs in-process, no cluster needed)\nconst { KafkaStreams } = require('kafka-streams')\nconst config = { noptions: { 'metadata.broker.list': 'localhost:9092' } }\nconst factory = new KafkaStreams(config)\nconst stream = factory.getKStream()\n\nstream\n  .from('text-input')\n  .mapJSONConvenience()\n  .map(msg => msg.word)\n  .countByKey('word-counts', 'word')\n  .to('word-counts-output')\n\nfactory.start()\n// State is stored locally in RocksDB — no Flink/Spark cluster needed\n// Scale by adding more application instances (each handles a partition subset)",
    "bestPractice": "Choose Kafka Streams for microservices that need lightweight stateful processing close to the data (aggregations, joins, enrichment) without the overhead of a separate processing cluster. Choose Flink when you need exactly-once stateful processing across multiple Kafka clusters, complex windowing over out-of-order events, or SQL-based stream analytics at scale. Avoid Spark Structured Streaming for real-time (< 1 s) requirements due to micro-batch overhead.",
    "source": "Apache Kafka Docs — Kafka Streams; Flink Docs; DDIA — Chapter 11"
  },
  {
    "id": "a05",
    "topic": "SQS FIFO Throughput and Message Groups",
    "question": "What is the throughput limit of an SQS FIFO queue and how do message group IDs affect it?",
    "code": null,
    "options": [
      "FIFO queues support unlimited throughput; message group IDs have no effect on throughput",
      "FIFO queues guarantee strict order and deduplication at limited throughput; Standard queues offer nearly unlimited throughput",
      "FIFO queues support 10,000 messages/second; each group ID adds 1,000 messages/second of capacity",
      "FIFO queues support up to 1,000 messages/second regardless of group IDs"
    ],
    "correctIndex": 1,
    "explanation": "SQS FIFO queues process 300 TPS without batching and 3,000 TPS when using SendMessageBatch (up to 10 messages per batch call). Within a MessageGroupId, messages are strictly ordered and processed sequentially — only one consumer can read from a group at a time. Using many distinct MessageGroupIds allows consumers to read from different groups concurrently, approaching the 3,000 TPS ceiling. If a single group carries all traffic, effective throughput collapses to one-consumer-at-a-time serial processing, regardless of how many consumer instances you run.",
    "compiledJS": "# Bad: single group ID — serialised, low throughput\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/payments.fifo \\\n  --message-body '{\"amount\":100}' \\\n  --message-group-id \"ALL_PAYMENTS\"  # ← bottleneck!\n\n# Good: per-user group IDs — parallel, high throughput\nfor USER_ID in user-1 user-2 user-3 user-4 user-5; do\n  aws sqs send-message \\\n    --queue-url https://sqs.us-east-1.amazonaws.com/123/payments.fifo \\\n    --message-body \"{\"userId\":\"$USER_ID\",\"amount\":100}\" \\\n    --message-group-id \"$USER_ID\"     # ← each user's messages ordered\ndone\n# 5 groups → up to 5 consumers processing in parallel\n# Ordering preserved per user, not globally",
    "bestPractice": "Design MessageGroupId as a business entity key (userId, orderId, accountId) rather than a constant. This gives you per-entity ordering (the actual business requirement) while enabling full parallelism across entities. Monitor the SQS console for any single MessageGroupId that dominates the queue depth — that is your throughput bottleneck.",
    "source": "AWS Docs — SQS FIFO Queues: Throughput and Limits"
  },
  {
    "id": "a06",
    "topic": "Schema Registry",
    "question": "Why is a schema registry important when using Avro or Protobuf with Kafka, and what problem does it solve?",
    "code": null,
    "options": [
      "A schema registry encrypts messages in transit; without it, Avro payloads are sent in plain text",
      "It centralizes schemas so producers and consumers validate contracts independently and enforce compatibility",
      "A schema registry is a Kafka broker plugin that validates message size limits",
      "A schema registry replaces ZooKeeper for cluster metadata management in newer Kafka versions"
    ],
    "correctIndex": 1,
    "explanation": "Without a schema registry, every Avro or Protobuf message must embed its full schema, inflating payload sizes. A schema registry (e.g., Confluent Schema Registry) assigns each schema version a numeric ID; producers embed only the 4-byte schema ID, and consumers fetch the schema from the registry at startup. More importantly, the registry enforces compatibility rules (BACKWARD, FORWARD, FULL) — preventing a producer from deploying a schema change that would break an existing consumer. This enables independent deployability of producers and consumers, which is essential in a microservices architecture.",
    "compiledJS": "// Producer: register and use schema\nconst { SchemaRegistry } = require('@kafkajs/confluent-schema-registry')\nconst registry = new SchemaRegistry({ host: 'http://schema-registry:8081' })\n\nconst schemaId = await registry.register({\n  type: 'AVRO',\n  schema: JSON.stringify({\n    type: 'record',\n    name: 'Order',\n    fields: [\n      { name: 'orderId', type: 'string' },\n      { name: 'total',   type: 'double' },\n      { name: 'status',  type: ['null', 'string'], default: null },  // optional field\n    ],\n  }),\n  // Compatibility: BACKWARD — new schema can read old data\n}, { compatibility: 'BACKWARD' })\n\nconst encoded = await registry.encode(schemaId, { orderId: 'abc', total: 99.0 })\n// Wire format: [magic byte 0x00][4-byte schema ID][avro bytes]\n// Consumer fetches schema by ID — no schema in every message",
    "bestPractice": "Enforce BACKWARD compatibility as the default: new schema must be able to read messages produced with the previous schema. Add new fields with defaults (never remove required fields). Run schema validation in CI — use the Schema Registry REST API compatibility check endpoint before merging producer changes. This prevents the most common breaking change: a consumer deployed before the producer update fails to deserialise new messages.",
    "source": "Confluent Docs — Schema Registry; Apache Avro Docs — Schema Resolution"
  },
  {
    "id": "a07",
    "topic": "Consumer Lag Monitoring",
    "question": "What metrics and tools are commonly used to monitor Kafka consumer lag in production?",
    "code": null,
    "options": [
      "Consumer lag can only be monitored via Kafka's built-in web UI dashboard",
      "Monitor lag via consumer group metrics or Prometheus; scale consumer instances up to the partition limit when lag spikes",
      "Consumer lag is visible only in AWS CloudWatch when using Amazon MSK",
      "Consumer lag is tracked by reading the __consumer_offsets topic directly from the application code"
    ],
    "correctIndex": 1,
    "explanation": "kafka-consumer-groups.sh gives a point-in-time lag snapshot useful for ad-hoc debugging. For continuous production monitoring, the JMX metric kafka.consumer:type=consumer-fetch-manager-metrics,attribute=records-lag-max exposes per-consumer lag as a Prometheus-compatible gauge. The kafka-exporter (open-source) or Confluent's JMX exporter scrapes these and exposes them for Grafana dashboards. AWS MSK integrates with CloudWatch, exposing EstimatedTimeLag and SumOffsetLag metrics natively. Datadog, Dynatrace, and New Relic all have first-class Kafka integrations that correlate lag with deployment events.",
    "compiledJS": "# CLI: point-in-time lag snapshot\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --describe\n\n# Prometheus scrape config (kafka-exporter)\n# prometheus.yml:\n# scrape_configs:\n#   - job_name: kafka\n#     static_configs:\n#       - targets: ['kafka-exporter:9308']\n\n# Grafana alert rule (PromQL):\n# ALERT KafkaConsumerLagHigh\n# IF max(kafka_consumergroup_lag{consumergroup=\"fulfillment-group\"}) > 10000\n# FOR 5m\n# LABELS { severity=\"critical\" }\n\n# AWS MSK CloudWatch metric\naws cloudwatch get-metric-statistics \\\n  --namespace AWS/Kafka \\\n  --metric-name EstimatedTimeLag \\\n  --dimensions Name=ConsumerGroup,Value=fulfillment-group \\\n  --period 60 --statistics Average \\\n  --start-time 2024-01-01T00:00:00Z --end-time 2024-01-01T01:00:00Z",
    "bestPractice": "Track both records-lag (message count) and time-lag (seconds behind) — a large record lag on a low-velocity topic may only be seconds of delay, while a small lag on a high-velocity topic may represent critical processing backlog. Set paged alerts on time-lag > 60 seconds for payment or order-processing consumers; use records-lag for capacity planning dashboards.",
    "source": "Confluent Docs — Monitoring Kafka; AWS Docs — MSK Monitoring Metrics"
  },
  {
    "id": "a08",
    "topic": "Transactional Outbox Pattern",
    "question": "What is the transactional outbox pattern and how does it solve dual-write problems between a database and a message broker?",
    "code": null,
    "options": [
      "The outbox pattern stores messages in an SQS FIFO queue before writing to the database, ensuring the database only updates if the queue accepts the message",
      "Writing business state and event records in a single database transaction, then relaying them asynchronously to Kafka",
      "The outbox pattern uses two-phase commit across the database and Kafka broker to guarantee simultaneous writes",
      "The outbox pattern buffers messages in application memory and flushes them to Kafka after the database transaction commits"
    ],
    "correctIndex": 1,
    "explanation": "The dual-write problem: writing to a database and publishing to a message broker in two separate operations risks a partial failure where the DB write succeeds but the broker publish fails (or vice versa). The outbox pattern eliminates this by inserting the event into an outbox table within the same ACID database transaction as the business data — if the transaction rolls back, the event is also rolled back. A separate relay (Debezium CDC, polling loop, or Transactional Outbox library) reads the outbox table and publishes to the broker with at-least-once semantics. Consumers handle duplicates idempotently.",
    "compiledJS": "-- Transactional outbox: one DB transaction, no distributed 2PC\nBEGIN;\n\n-- 1. Update business state\nUPDATE orders SET status = 'CONFIRMED' WHERE id = 'order-123';\n\n-- 2. Insert event into outbox (same transaction)\nINSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload, created_at)\nVALUES (\n  gen_random_uuid(),\n  'ORDER',\n  'order-123',\n  'ORDER_CONFIRMED',\n  '{\"orderId\":\"order-123\",\"total\":99.0}'::jsonb,\n  NOW()\n);\n\nCOMMIT;\n-- If COMMIT fails, both writes roll back — no orphaned event\n\n-- Relay process (Debezium CDC reads WAL and publishes to Kafka)\n-- No polling needed — Debezium streams the outbox table changes\n-- to kafka topic: outbox.event.ORDER",
    "bestPractice": "Use Debezium with the Outbox Event Router SMT for the relay — it reads PostgreSQL WAL via CDC and routes outbox records directly to Kafka topics without polling the database table. This is more efficient than a polling loop and scales to high-insert-rate scenarios. Mark outbox records as published (or delete them) after Debezium confirms delivery to avoid unbounded table growth.",
    "source": "microservices.io — Transactional Outbox Pattern; Debezium Docs — Outbox Event Router"
  },
  {
    "id": "a09",
    "topic": "Kafka Connect",
    "question": "What is Kafka Connect and what are its two main connector types?",
    "code": null,
    "options": [
      "Kafka Connect is a client library for building custom consumer groups; its two types are polling and push connectors",
      "A pluggable framework connecting Kafka with databases and storage using declarative source and sink connectors",
      "Kafka Connect is a monitoring tool; its connector types are metrics and logs connectors",
      "Kafka Connect is a schema registry extension; its types are Avro connectors and Protobuf connectors"
    ],
    "correctIndex": 1,
    "explanation": "Kafka Connect is a scalable, fault-tolerant data pipeline framework that moves data between Kafka and external systems without writing custom producer/consumer code. Source connectors pull data from databases (Debezium CDC), files, APIs, or cloud services into Kafka topics. Sink connectors push Kafka topic data into data warehouses (Snowflake, BigQuery), search engines (Elasticsearch), object storage (S3), or databases. Connectors run as tasks distributed across a Connect worker cluster, with automatic fault tolerance and offset tracking.",
    "compiledJS": "# Deploy a JDBC Source connector (polls Postgres, pushes to Kafka)\ncurl -X POST http://localhost:8083/connectors \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"name\": \"postgres-source\",\n    \"config\": {\n      \"connector.class\": \"io.confluent.connect.jdbc.JdbcSourceConnector\",\n      \"connection.url\": \"jdbc:postgresql://db:5432/mydb\",\n      \"connection.user\": \"kafka_user\",\n      \"connection.password\": \"secret\",\n      \"table.whitelist\": \"orders,customers\",\n      \"mode\": \"timestamp+incrementing\",\n      \"timestamp.column.name\": \"updated_at\",\n      \"incrementing.column.name\": \"id\",\n      \"topic.prefix\": \"postgres.\"\n    }\n  }'\n\n# Deploy an S3 Sink connector (Kafka → S3 for analytics)\ncurl -X POST http://localhost:8083/connectors \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"name\": \"s3-sink\",\n    \"config\": {\n      \"connector.class\": \"io.confluent.connect.s3.S3SinkConnector\",\n      \"tasks.max\": \"3\",\n      \"topics\": \"orders\",\n      \"s3.region\": \"us-east-1\",\n      \"s3.bucket.name\": \"my-kafka-data\",\n      \"storage.class\": \"io.confluent.connect.s3.storage.S3Storage\",\n      \"format.class\": \"io.confluent.connect.s3.format.parquet.ParquetFormat\",\n      \"flush.size\": \"1000\"\n    }\n  }'",
    "bestPractice": "Prefer Kafka Connect over custom producer/consumer code for standard data pipeline tasks — the connector ecosystem has hundreds of pre-built, battle-tested connectors. Run Connect workers in distributed mode (not standalone) in production for automatic fault recovery. Use Debezium as your Source connector for database change data capture — it reads the WAL directly and is far more reliable and low-overhead than polling.",
    "source": "Apache Kafka Docs — Kafka Connect; Debezium Docs"
  },
  {
    "id": "a10",
    "topic": "Cross-Region Replication",
    "question": "How does cross-region replication differ between SQS-based fan-out and Kafka MirrorMaker 2?",
    "code": null,
    "options": [
      "SQS fan-out and MirrorMaker 2 are functionally identical; the choice depends only on cost",
      "SNS fans out to multiple regional SQS queues directly, while Kafka uses tools like MirrorMaker 2 for cross-cluster replication",
      "SQS fan-out replicates messages using Kafka Connect; MirrorMaker 2 uses AWS Data Sync",
      "MirrorMaker 2 works only with exactly-once semantics; SQS fan-out works only with at-most-once semantics"
    ],
    "correctIndex": 1,
    "explanation": "SQS cross-region fan-out uses Amazon SNS to simultaneously push messages to SQS queues in multiple regions — simple, managed, active-active push with no additional infrastructure. MirrorMaker 2 (MM2) is a Kafka Connect-based replication tool that asynchronously replicates topic data and consumer group offsets from a source Kafka cluster to a destination cluster. MM2 supports active-passive (DR), active-active (bidirectional with automatic offset translation), and hub-spoke topologies. The offset replication enables seamless consumer failover between clusters without message loss or duplicate processing.",
    "compiledJS": "# MirrorMaker 2 config: us-east-1 → eu-west-1 (active-passive DR)\n# mm2.properties\nclusters = us-east, eu-west\nus-east.bootstrap.servers = broker1.us-east:9092,broker2.us-east:9092\neu-west.bootstrap.servers = broker1.eu-west:9092,broker2.eu-west:9092\n\nus-east->eu-west.enabled = true\nus-east->eu-west.topics = .*             # replicate all topics\nus-east->eu-west.groups = .*             # replicate all consumer offsets\n\n# Topic prefix in destination: us-east.orders (preserves source identity)\nreplication.factor = 3\nemit.checkpoints.interval.seconds = 60  # offset sync frequency\n\n# Start MM2\nconnect-mirror-maker.sh mm2.properties\n\n# SNS → SQS multi-region fan-out (managed, no MM2 needed)\naws sns subscribe --topic-arn $SNS_ARN_US_EAST \\\n  --protocol sqs --notification-endpoint $SQS_ARN_EU_WEST\n# SNS delivers to both regions on every publish",
    "bestPractice": "For Kafka DR, use MirrorMaker 2 with checkpoints enabled so consumer group offsets are replicated — without this, failing over to the DR cluster causes consumers to reprocess from the beginning or skip messages depending on auto.offset.reset. For SQS-based systems, use the SNS→SQS multi-region fan-out pattern and ensure your DLQs exist in both regions. Test failover quarterly; a DR topology you have never exercised is not a DR topology.",
    "source": "Apache Kafka Docs — MirrorMaker 2; AWS Docs — SNS Cross-Region Delivery"
  }
]
