import type { InterviewQuestion } from '@/lib/interviewTypes'

export const MESSAGING_SQS_KAFKA_QUESTIONS_ES: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "Message Queues",
    "question": "¿Cuál es el propósito principal de una cola de mensajes en un sistema distribuido?",
    "code": null,
    "options": [
      "Guardar datos permanentemente en tablas relacionales SQL",
      "Desacoplar productores y consumidores en flujos asíncronos",
      "Sincronizar llamadas HTTP bloqueantes entre microservicios",
      "Proveer una capa de caché clave-valor en memoria para nodos"
    ],
    "correctIndex": 1,
    "explanation": "Una cola de mensajes desacopla los productores de los consumidores, permitiendo que cada parte trabaje a su propio ritmo sin necesidad de sincronización directa.",
    "compiledJS": "// Producer (Order Service) — does NOT call Consumer directly\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/order-queue \\\n  --message-body '{\"orderId\":\"abc\",\"total\":49.99}'\n# Producer immediately returns; Consumer is invoked separately\n\n// Consumer (Fulfillment Service) — runs on its own schedule\naws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/order-queue \\\n  --max-number-of-messages 10\n# If consumer is offline, messages wait — producer never blocks",
    "bestPractice": "In production, always pair queue-based decoupling with a Dead Letter Queue so that messages that repeatedly fail are captured for inspection rather than silently lost. Use CloudWatch metrics on ApproximateNumberOfMessagesVisible to detect when consumers are falling behind and trigger auto-scaling.",
    "source": "AWS Docs — Amazon SQS: How It Works"
  },
  {
    "id": "b02",
    "topic": "Producer/Consumer",
    "question": "En el modelo productor/consumidor, ¿cuál es el rol de un productor?",
    "code": null,
    "options": [
      "Lee y procesa mensajes de la cola",
      "Gestiona la infraestructura de la cola y las reglas de enrutamiento",
      "Envía mensajes a la cola para su procesamiento posterior",
      "Supervisa la profundidad de la cola y activa el autoescalado"
    ],
    "correctIndex": 2,
    "explanation": "Un productor publica mensajes en la cola; en el otro extremo, un consumidor lee y procesa dichos mensajes.",
    "compiledJS": "// Producer: write a message (Kafka example)\nconst { Kafka } = require('kafkajs')\nconst kafka = new Kafka({ clientId: 'order-svc', brokers: ['broker:9092'] })\nconst producer = kafka.producer()\nawait producer.connect()\nawait producer.send({\n  topic: 'orders',\n  messages: [{ key: 'order-1', value: JSON.stringify({ orderId: 1, total: 99 }) }],\n})\nawait producer.disconnect()\n\n// Consumer: read messages\nconst consumer = kafka.consumer({ groupId: 'fulfillment-group' })\nawait consumer.connect()\nawait consumer.subscribe({ topic: 'orders', fromBeginning: false })\nawait consumer.run({ eachMessage: async ({ message }) => {\n  console.log('Processing:', message.value?.toString())\n}})",
    "bestPractice": "Producers should always serialize messages using a versioned schema (Avro/Protobuf with a schema registry) rather than raw JSON strings — this prevents deserialization failures when the payload shape changes. Set acks=all on Kafka producers to ensure the message is confirmed by all ISR replicas before the send call returns.",
    "source": "Apache Kafka Docs — Producer API"
  },
  {
    "id": "b03",
    "topic": "SQS Basics",
    "question": "¿Qué es Amazon SQS?",
    "code": null,
    "options": [
      "Un servicio de base de datos relacional totalmente administrado de AWS",
      "Un servicio de colas de mensajes totalmente administrado de AWS",
      "Una plataforma distribuida de streaming de código abierto",
      "Un motor de cómputo serverless para tareas por lotes"
    ],
    "correctIndex": 1,
    "explanation": "Amazon SQS (Simple Queue Service) es un servicio de colas de mensajes serverless y totalmente administrado que ofrece AWS.",
    "compiledJS": "# Create a Standard SQS queue\naws sqs create-queue --queue-name my-orders\n\n# Send a message\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123456789/my-orders \\\n  --message-body '{\"event\":\"ORDER_PLACED\",\"orderId\":\"xyz\"}'\n\n# Receive and delete a message\nMSG=$(aws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123456789/my-orders \\\n  --query 'Messages[0]')\nRECEIPT=$(echo $MSG | jq -r '.ReceiptHandle')\naws sqs delete-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123456789/my-orders \\\n  --receipt-handle \"$RECEIPT\"",
    "bestPractice": "Always enable server-side encryption (SSE) on SQS queues using AWS KMS for queues that carry sensitive data. Configure a Dead Letter Queue with a redrive policy (maxReceiveCount: 3–5) from day one — finding out a bug has silently discarded messages in production is very expensive.",
    "source": "AWS Docs — Amazon SQS Developer Guide"
  },
  {
    "id": "b04",
    "topic": "FIFO Queue",
    "question": "¿Cuál es la diferencia clave entre una cola SQS Standard y una cola SQS FIFO?",
    "code": null,
    "options": [
      "Colas estándar aseguran orden estricto; colas FIFO entregan de forma aleatoria",
      "Colas FIFO aseguran orden y deduplicación; colas estándar operan con best-effort",
      "Colas estándar cifran datos en reposo; colas FIFO no admiten claves de KMS",
      "Colas FIFO tienen menor costo por mensaje; colas estándar fijan topes estrictos"
    ],
    "correctIndex": 1,
    "explanation": "Las colas FIFO preservan de forma estricta el orden de los mensajes y previenen duplicados, mientras que las colas Standard ofrecen un mayor rendimiento con ordenación por mejor esfuerzo y entrega at-least-once.",
    "compiledJS": "# Create a FIFO queue — note the .fifo suffix is REQUIRED\naws sqs create-queue \\\n  --queue-name payment-events.fifo \\\n  --attributes FifoQueue=true,ContentBasedDeduplication=true\n\n# Send a message with a MessageGroupId (required for FIFO)\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/payment-events.fifo \\\n  --message-body '{\"type\":\"PAYMENT\",\"amount\":100}' \\\n  --message-group-id \"user-42\" \\\n  --message-deduplication-id \"txn-9876\"\n# Messages with the same GroupId are processed in order",
    "bestPractice": "Use MessageGroupId to scope ordering to a logical entity (e.g., user ID or order ID) rather than a single global group — a single group serializes all processing and tanks throughput. Spread traffic across many distinct group IDs to approach the 3,000 TPS ceiling while preserving per-entity ordering.",
    "source": "AWS Docs — Amazon SQS FIFO Queues"
  },
  {
    "id": "b05",
    "topic": "At-Least-Once Delivery",
    "question": "¿Qué significa 'entrega al menos una vez' (at-least-once delivery) en un sistema de mensajería?",
    "code": null,
    "options": [
      "El mensaje se entrega estrictamente una sola vez sin posibilidad de copias",
      "El mensaje puede llegar más de una vez, exigiendo consumidores idempotentes",
      "El mensaje se entrega solamente cuando los nodos consumidores están activos",
      "El mensaje permanece en la memoria de la cola hasta el acuse de recibo final"
    ],
    "correctIndex": 1,
    "explanation": "La entrega at-least-once garantiza que el mensaje alcance al consumidor pero admite duplicados, exigiendo que los consumidores sean idempotentes.",
    "compiledJS": "// Idempotent consumer pattern (Node.js + DynamoDB)\nconst { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')\nconst db = new DynamoDBClient({})\n\nasync function processMessage(msg) {\n  const msgId = msg.MessageId\n  try {\n    // Conditional write: fails if item already exists\n    await db.send(new PutItemCommand({\n      TableName: 'ProcessedMessages',\n      Item: { messageId: { S: msgId } },\n      ConditionExpression: 'attribute_not_exists(messageId)',\n    }))\n  } catch (e) {\n    if (e.name === 'ConditionalCheckFailedException') {\n      console.log('Duplicate — skipping', msgId)\n      return // already processed, safe to delete from queue\n    }\n    throw e\n  }\n  // ... actual business logic ...\n}",
    "bestPractice": "Design every SQS consumer to be naturally idempotent: use database upserts rather than inserts, emit events that are safe to replay, and store a deduplication token (the SQS MessageId) in your datastore. For SQS FIFO queues, enable ContentBasedDeduplication or supply a MessageDeduplicationId — but still write idempotent consumers as a defence-in-depth measure.",
    "source": "AWS Docs — SQS at-least-once delivery; DDIA — Chapter 11"
  },
  {
    "id": "b06",
    "topic": "Dead Letter Queue",
    "question": "¿Qué es una Dead Letter Queue (DLQ)?",
    "code": null,
    "options": [
      "Una cola temporal de alta velocidad que purga mensajes si no se consumen dentro de un plazo de 60 segundos",
      "Una cola secundaria que captura mensajes que superaron el umbral máximo de intentos fallidos de procesamiento",
      "Una cola de prioridad crítica con replicación multirregión para emitir alertas urgentes de indisponibilidad",
      "Una cola de auditoría que registra metadatos y checkpoints de transacciones completadas con éxito por workers"
    ],
    "correctIndex": 1,
    "explanation": "Una DLQ captura mensajes que fallan repetidamente en su procesamiento para que puedan ser inspeccionados y reprocesados sin bloquear la cola principal.",
    "compiledJS": "# 1. Create the DLQ\naws sqs create-queue --queue-name orders-dlq\nDLQ_ARN=$(aws sqs get-queue-attributes \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders-dlq \\\n  --attribute-names QueueArn --query Attributes.QueueArn --output text)\n\n# 2. Create the main queue with a redrive policy\naws sqs create-queue \\\n  --queue-name orders \\\n  --attributes \"{\n    \\\"RedrivePolicy\\\": \\\"{\\\\\\\"deadLetterTargetArn\\\\\\\":\\\\\\\"$DLQ_ARN\\\\\\\",\\\\\\\"maxReceiveCount\\\\\\\":\\\\\\\"3\\\\\\\"}\\\"\n  }\"\n# After 3 failed receive+delete cycles, message moves to orders-dlq",
    "bestPractice": "Set a CloudWatch alarm on ApproximateNumberOfMessagesVisible for every DLQ — a non-zero DLQ depth indicates a consumer bug or data quality problem that needs immediate attention. Keep DLQ message retention at the maximum (14 days) so you have time to diagnose and replay; for Kafka, route failures to a -error topic with the original topic, partition, and offset in the message headers for easy replay.",
    "source": "AWS Docs — SQS Dead Letter Queues"
  },
  {
    "id": "b07",
    "topic": "Kafka Introduction",
    "question": "¿Qué es Apache Kafka?",
    "code": null,
    "options": [
      "Una base relacional optimizada para grabación continua de series temporales",
      "Una plataforma de streaming distribuido para logs tolerantes a fallos",
      "Un caché en memoria diseñado para reemplazar Redis en entornos serverless",
      "Un gateway de API creado para enrutar llamadas HTTP síncronas entre servicios"
    ],
    "correctIndex": 1,
    "explanation": "Apache Kafka es una plataforma distribuida de streaming de eventos de código abierto utilizada para mensajería publicar-suscribir (pub/sub) de alto rendimiento, durable y tolerante a fallos.",
    "compiledJS": "# Start a local Kafka cluster (KRaft mode — no ZooKeeper)\ndocker run -d --name kafka \\\n  -e KAFKA_NODE_ID=1 \\\n  -e KAFKA_PROCESS_ROLES=broker,controller \\\n  -e KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \\\n  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \\\n  -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 \\\n  -p 9092:9092 \\\n  apache/kafka:3.7.0\n\n# Create a topic with 3 partitions, replication factor 1\nkafka-topics.sh --create \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 3 \\\n  --replication-factor 1\n\n# Produce a message\necho \"order-1:{'total':99}\" | kafka-console-producer.sh \\\n  --topic orders --bootstrap-server localhost:9092 --property \"parse.key=true\"",
    "bestPractice": "Always deploy Kafka with a replication factor of at least 3 in production, with min.insync.replicas=2 and acks=all on producers. This configuration tolerates one broker failure without data loss. Use Amazon MSK or Confluent Cloud for managed operations unless you have dedicated SRE capacity to manage Kafka clusters yourself.",
    "source": "Apache Kafka Docs — Introduction"
  },
  {
    "id": "b08",
    "topic": "Topic vs Queue",
    "question": "¿En qué se diferencia un topic de Kafka de una cola de mensajes tradicional?",
    "code": null,
    "options": [
      "Un tópico descarta mensajes en cuanto el primer consumidor lee la carga",
      "Un tópico guarda un log inmutable permitiendo lectura de varios grupos",
      "Un tópico limita el envío a un único productor conectado en cada momento",
      "Un tópico asegura latencia submilisegundo bajo cualquier condición de red"
    ],
    "correctIndex": 1,
    "explanation": "A diferencia de una cola tradicional que borra los mensajes una vez consumidos, un topic de Kafka persiste los mensajes en un log de adición continua (append-only), permitiendo lecturas independientes a múltiples grupos de consumidores.",
    "compiledJS": "# Two independent consumer groups reading the same topic\n# Group 1: Analytics service — starts from the beginning\nkafka-console-consumer.sh \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --group analytics-group \\\n  --from-beginning\n\n# Group 2: Fulfillment service — reads only new messages\nkafka-console-consumer.sh \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group\n\n# Both groups get all messages; neither affects the other's offset\n# An SQS queue would only deliver each message to ONE consumer",
    "bestPractice": "Use Kafka when you need fan-out to multiple independent consumers or the ability to replay historical events. Use SQS when you need a simpler, managed work queue where each message is processed by exactly one worker and you do not need to replay. Avoid using Kafka as a pure queue replacement — its operational complexity is only justified when you need its multi-consumer or replay capabilities.",
    "source": "Apache Kafka Docs — Topics and Partitions"
  },
  {
    "id": "b09",
    "topic": "Consumer Groups",
    "question": "¿Qué es un grupo de consumidores (consumer group) en Kafka?",
    "code": null,
    "options": [
      "Un cluster de brokers que coordina conjuntos de replicación de partición",
      "Un conjunto de consumidores que lee particiones distintas de un mismo tópico",
      "Un rol administrativo que gestiona la creación y eliminación de tópicos Kafka",
      "Un grupo de productores upstream que comparten el mismo identificador de red"
    ],
    "correctIndex": 1,
    "explanation": "Un grupo de consumidores permite el escalado horizontal del procesamiento de mensajes: cada partición se asigna exactamente a un consumidor dentro del grupo en cada momento.",
    "compiledJS": "// Consumer group with 3 members (KafkaJS)\nconst { Kafka } = require('kafkajs')\nconst kafka = new Kafka({ brokers: ['broker:9092'] })\n\n// Three instances of this code with the SAME groupId form a group\nconst consumer = kafka.consumer({ groupId: 'fulfillment-group' })\nawait consumer.connect()\nawait consumer.subscribe({ topic: 'orders', fromBeginning: false })\n\nawait consumer.run({\n  eachMessage: async ({ topic, partition, message }) => {\n    console.log(`Worker on partition ${partition}: ${message.value}`)\n  },\n})\n// Kafka assigns partitions so no two workers in the same group\n// receive the same message at the same time",
    "bestPractice": "Set the number of consumer instances equal to the number of partitions to achieve maximum parallelism — additional consumers beyond the partition count sit idle. Monitor consumer_lag via JMX or Prometheus; if lag grows persistently, either scale out consumers (up to partition count), increase partition count, or reduce per-message processing time.",
    "source": "Apache Kafka Docs — Consumer Groups"
  },
  {
    "id": "b10",
    "topic": "Global Ordering at Scale",
    "question": "¿Por qué es difícil garantizar un orden global estricto de mensajes a escala en sistemas de mensajería distribuida?",
    "code": null,
    "options": [
      "Latencia de red y nodos paralelos vuelven el orden global un cuello de botella",
      "El orden estricto exige bases relacionales no soportadas por motores de colas",
      "Conexiones de red TCP desordenan paquetes por naturaleza al operar bajo carga",
      "Los brokers desordenan a propósito la entrega para equilibrar consumo de nodos"
    ],
    "correctIndex": 0,
    "explanation": "El ordenamiento global requiere una secuencia ordenada única, lo que fuerza la serialización y crea un cuello de botella de rendimiento; los sistemas particionados sacrifican el orden global en beneficio de la escalabilidad.",
    "compiledJS": null,
    "bestPractice": "Rarely does a system need strict global ordering across all messages. Identify the actual business invariant: usually it is \"events for a given entity (user, order, account) must be ordered.\" Model this with Kafka partition keys (same entity always routes to the same partition) or SQS FIFO MessageGroupIds so ordering is enforced per entity, not globally, allowing full horizontal scaling.",
    "source": "DDIA — Chapter 9: Consistency and Consensus; Apache Kafka Docs — Partitioning"
  },
  {
    "id": "i01",
    "topic": "Visibility Timeout",
    "question": "¿Qué es el tiempo de espera de visibilidad (visibility timeout) de SQS y por qué es importante?",
    "code": null,
    "options": [
      "El tiempo máximo que un mensaje puede permanecer en la cola antes de ser eliminado automáticamente",
      "El periodo durante el cual un mensaje recibido permanece oculto para otros consumidores, evitando el procesamiento duplicado",
      "El retraso antes de que un mensaje recién enviado sea visible para los consumidores",
      "La ventana de tiempo permitida para que un consumidor se autentique antes de leer un mensaje"
    ],
    "correctIndex": 1,
    "explanation": "El visibility timeout oculta un mensaje de otros consumidores mientras un consumidor lo está procesando; si no se elimina antes de que expire el tiempo, el mensaje vuelve a estar visible para un nuevo intento.",
    "compiledJS": "# Receive a message — it is now invisible to others for 30 s (default)\naws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --visibility-timeout 60\n\n# If processing will exceed timeout, extend it dynamically\naws sqs change-message-visibility \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --receipt-handle \"AQEB...\" \\\n  --visibility-timeout 120    # add 2 more minutes\n\n# When done, delete — otherwise message reappears after timeout\naws sqs delete-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --receipt-handle \"AQEB...\"",
    "bestPractice": "Set the visibility timeout to at least 6× the median processing time of your slowest consumer. For long-running jobs, implement a \"heartbeat\" thread that calls ChangeMessageVisibility every 2/3 of the current timeout to keep the message hidden until processing completes. Alert on ApproximateAgeOfOldestMessage to detect consumers that are silently failing to delete messages.",
    "source": "AWS Docs — SQS Visibility Timeout"
  },
  {
    "id": "i02",
    "topic": "Long Polling",
    "question": "¿Cuál es la ventaja de utilizar long polling frente a short polling en SQS?",
    "code": null,
    "options": [
      "Marca mensajes no confirmados como venenosos y los descarta de inmediato para evitar bloqueos en los workers",
      "Oculta el mensaje a otros nodos mientras un worker lo procesa, haciéndolo visible si el timeout expira sin borrado",
      "Guarda mensajes en curso en buckets cifrados de S3 para retención duradera ante caídas del servidor físico",
      "Limita conexiones de clientes a un solo hilo consumidor simultáneo para forzar el consumo estrictamente secuencial"
    ],
    "correctIndex": 1,
    "explanation": "El long polling espera hasta 20 segundos la llegada de un mensaje antes de responder, eliminando la mayoría de las respuestas ReceiveMessage vacías y reduciendo los costes de llamadas a la API.",
    "compiledJS": "# Short polling — returns immediately (bad for idle queues)\naws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders\n# Often returns: { \"Messages\": [] } — costs money, wastes CPU\n\n# Long polling — waits up to 20 s for a message\naws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --wait-time-seconds 20\n# Returns as soon as a message arrives, or after 20 s if still empty\n\n# Set long polling as the queue default (so all clients benefit)\naws sqs set-queue-attributes \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --attributes ReceiveMessageWaitTimeSeconds=20",
    "bestPractice": "Always configure long polling (WaitTimeSeconds=20) at the queue level as a default, and also set it on each ReceiveMessage call. This is a free performance improvement — there is no reason to use short polling unless you have a specific real-time latency requirement that cannot tolerate a 20-second wait, which is rare in practice.",
    "source": "AWS Docs — SQS Long Polling"
  },
  {
    "id": "i03",
    "topic": "SQS Retention and Size",
    "question": "¿Cuáles son los periodos de retención por defecto y máximo para una cola SQS?",
    "code": null,
    "options": [
      "Por defecto 1 día, máximo 7 días",
      "Por defecto 4 días, máximo 14 días",
      "Por defecto 7 días, máximo 30 días",
      "Por defecto 1 hora, máximo 24 horas"
    ],
    "correctIndex": 1,
    "explanation": "SQS retiene los mensajes durante 4 días de forma predeterminada y puede configurarse hasta un máximo de 14 días, tras los cuales los mensajes no entregados son eliminados.",
    "compiledJS": "# Set retention to maximum 14 days (1,209,600 seconds)\naws sqs set-queue-attributes \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --attributes MessageRetentionPeriod=1209600\n\n# Claim-check pattern: large payload stored in S3\n# 1. Upload payload to S3\nS3_KEY=\"payloads/order-$(uuidgen).json\"\naws s3 cp large-order.json s3://my-bucket/$S3_KEY\n\n# 2. Send only the reference in SQS\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --message-body \"{\"s3Key\":\"$S3_KEY\"}\"\n\n# Consumer fetches the real payload from S3",
    "bestPractice": "Keep retention at 14 days for queues connected to DLQs — this gives you maximum time to diagnose and replay failed messages before they expire. For queues handling ephemeral events (e.g., UI click telemetry) a shorter retention of 1–4 hours is fine and prevents unbounded storage growth if consumers fall behind.",
    "source": "AWS Docs — SQS Message Attributes and Limits"
  },
  {
    "id": "i04",
    "topic": "Kafka Partitions",
    "question": "¿Cómo habilitan las particiones de Kafka el paralelismo en el consumo de mensajes?",
    "code": null,
    "options": [
      "Particiones cifran datos en diferentes volúmenes de almacenamiento en disco",
      "Particiones dividen el flujo del tópico para permitir lectura paralela masiva",
      "Particiones comprimen registros para elevar la tasa de procesamiento por nodo",
      "Particiones acumulan lotes de envío para evitar saturación de memoria del broker"
    ],
    "correctIndex": 1,
    "explanation": "Las particiones de Kafka dividen un topic en logs ordenados e independientes; cada partición puede ser leída por un único consumidor por grupo, lo que permite un procesamiento paralelo proporcional al número de particiones.",
    "compiledJS": "# Topic with 6 partitions — 6-way consumer parallelism possible\nkafka-topics.sh --create \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 6 \\\n  --replication-factor 3\n\n# Check partition assignment for a consumer group\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --describe\n# Output:\n# CONSUMER-ID          PARTITION  CURRENT-OFFSET  LOG-END  LAG\n# worker-1             0          1024            1024     0\n# worker-1             1          980             980      0\n# worker-2             2          1100            1100     0\n# worker-2             3          995             995      0\n# worker-3             4          870             870      0\n# worker-3             5          910             910      0",
    "bestPractice": "Size partitions generously (err on the side of more) because increasing partitions on a live topic is a one-way operation that triggers rebalancing and ordering disruption. A common heuristic is: target throughput / per-partition throughput (≈10 MB/s) + 20% headroom. Avoid more than ~4,000 partitions per broker to keep memory pressure and rebalance times manageable.",
    "source": "Apache Kafka Docs — Topics and Partitions; Confluent Blog — How to Choose the Number of Partitions"
  },
  {
    "id": "i05",
    "topic": "Committed vs Latest Offset",
    "question": "¿Cuál es la diferencia entre un offset confirmado (committed offset) y el último offset (latest offset) en Kafka?",
    "code": null,
    "options": [
      "Offset committed es el próximo a escribir; offset latest es el log más antiguo",
      "Offset committed es el confirmado por el grupo; offset latest es el fin del log",
      "Offset committed vive guardado en disco; offset latest reside solo en la RAM",
      "Offset committed rige lotes del emisor; offset latest rige el retraso del grupo"
    ],
    "correctIndex": 1,
    "explanation": "El retraso del consumidor (consumer lag) es la diferencia entre el último offset (final del log de la partición) y el offset confirmado (última posición confirmada), representando los mensajes pendientes de procesar.",
    "compiledJS": "# Check committed offsets and lag for a consumer group\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --describe\n\n# Output columns:\n# TOPIC    PARTITION  CURRENT-OFFSET(committed)  LOG-END-OFFSET(latest)  LAG\n# orders   0          5420                        5420                    0     <- healthy\n# orders   1          5100                        5420                    320   <- consumer behind!\n# orders   2          5380                        5420                    40    <- slight lag\n\n# Reset offsets to re-process from beginning (use with care)\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --topic orders \\\n  --reset-offsets --to-earliest --execute",
    "bestPractice": "Commit offsets AFTER successful processing, not before. Use Kafka's auto.commit=false in production and commit manually after the business logic succeeds. Alert on consumer lag > a threshold (e.g., 10,000 messages or growing for more than 5 minutes) to catch processing bottlenecks before they become outages.",
    "source": "Apache Kafka Docs — Offset Management"
  },
  {
    "id": "i06",
    "topic": "Consumer Group Rebalancing",
    "question": "¿Qué provoca un rebalanceo (rebalance) de un grupo de consumidores en Kafka?",
    "code": null,
    "options": [
      "Un administrador incrementa la cantidad de particiones de un tópico activo",
      "Un consumidor se une, sale o sufre timeout, redistribuyendo particiones",
      "Un productor envía mensajes mayores al límite configurado para segmentos",
      "El cluster de brokers ejecuta una nueva elección de metadados vía KRaft"
    ],
    "correctIndex": 1,
    "explanation": "El rebalanceo redistribuye la asignación de particiones entre consumidores cuando cambia la pertenencia al grupo o falla el heartbeat de un consumidor, pausando temporalmente el consumo.",
    "compiledJS": "// Consumer config to reduce rebalance impact\nconst consumer = kafka.consumer({\n  groupId: 'fulfillment-group',\n  sessionTimeout: 30000,          // 30 s — time before broker marks consumer dead\n  heartbeatInterval: 3000,        // 3 s — send heartbeat every 3 s\n  maxPollIntervalMs: 300000,      // 5 min — max time between poll() calls\n  // Cooperative rebalancing (Kafka 2.4+)\n  rebalanceTimeout: 60000,\n})\n\n// Listen for rebalance events\nconsumer.on(consumer.events.REBALANCING, () => {\n  console.log('Rebalance in progress — pausing processing')\n})\nconsumer.on(consumer.events.GROUP_JOIN, () => {\n  console.log('Joined group — resuming')\n})",
    "bestPractice": "Minimise rebalances by setting maxPollIntervalMs comfortably above your slowest message processing time, and deploying consumer updates with rolling restarts rather than killing all instances simultaneously. Enable cooperative rebalancing (partition.assignment.strategy=CooperativeStickyAssignor) in Kafka 2.4+ to avoid the full stop-the-world pause. Monitor kafka_consumer_group_rebalances_per_second in Grafana — frequent rebalances indicate an unhealthy consumer fleet.",
    "source": "Apache Kafka Docs — Consumer Group Rebalancing; KIP-429 Incremental Cooperative Rebalancing"
  },
  {
    "id": "i07",
    "topic": "Replication Factor and ISR",
    "question": "¿Cuál es el propósito del factor de replicación en Kafka y qué significa ISR?",
    "code": null,
    "options": [
      "Factor de replicación fija TTL; ISR mide ventanas de retención de segmentos",
      "Replicación define total de copias; ISR son réplicas sincronizadas con el líder",
      "Replicación controla concurrencia; ISR rastrea el retraso de offset del grupo",
      "Replicación define compresión zstd; ISR guarda sumas de comprobación en disco"
    ],
    "correctIndex": 1,
    "explanation": "Un factor de replicación más alto mejora la durabilidad; Kafka solo confirma una escritura cuando el número requerido de réplicas ISR la ha confirmado, equilibrando durabilidad y latencia.",
    "compiledJS": "# Topic with replication factor 3\nkafka-topics.sh --create \\\n  --topic payments \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 6 \\\n  --replication-factor 3\n\n# Check ISR for each partition\nkafka-topics.sh --describe \\\n  --topic payments \\\n  --bootstrap-server localhost:9092\n# Output:\n# Partition: 0  Leader: 1  Replicas: 1,2,3  Isr: 1,2,3  <- all in sync\n# Partition: 1  Leader: 2  Replicas: 2,3,1  Isr: 2,3    <- broker 1 lagging!\n\n# Producer config for maximum durability\n# acks=all + min.insync.replicas=2 on broker",
    "bestPractice": "Use replication factor 3 with min.insync.replicas=2 and acks=all on producers for production data. This tolerates one broker failure without data loss and without blocking producers. Never set min.insync.replicas equal to the replication factor — if one replica is temporarily offline, all produces will block. Monitor UnderReplicatedPartitions JMX metric; a non-zero value means data is not fully replicated and the cluster is at risk.",
    "source": "Apache Kafka Docs — Replication; Confluent Docs — ISR"
  },
  {
    "id": "i08",
    "topic": "Exactly-Once Semantics",
    "question": "¿Qué configuración de Kafka permite lograr semántica de exactamente una vez (exactly-once semantics) de extremo a extremo?",
    "code": null,
    "options": [
      "Fijar acks=0 en el emisor para evitar reintentos y usar tópicos FIFO de partición única con commit manual de offset",
      "Habilitar productores idempotentes con APIs transaccionales y fijar consumers con `isolation.level=read_committed`",
      "Desactivar lotes en el emisor y delegar la deduplicación de mensajes a un cluster ZooKeeper tolerante a fallos",
      "Usar replicación síncrona en todos los brokers permitiendo que el consumidor confirme offsets de modo automático"
    ],
    "correctIndex": 1,
    "explanation": "La entrega exactly-once de Kafka requiere productores idempotentes para prevenir duplicados y APIs transaccionales para producir y registrar offsets atómicamente, con consumidores leyendo únicamente datos confirmados.",
    "compiledJS": "// Producer with exactly-once semantics\nconst producer = kafka.producer({\n  transactionalId: 'payment-processor-1',  // unique per producer instance\n  maxInFlightRequests: 5,\n  idempotent: true,   // enable.idempotence=true\n})\nawait producer.connect()\nawait producer.transaction(async (tx) => {\n  await tx.send({ topic: 'payments', messages: [{ value: 'pay-123' }] })\n  await tx.sendOffsets({\n    consumerGroupId: 'payment-consumer',\n    topics: [{ topic: 'orders', partitions: [{ partition: 0, offset: '42' }] }],\n  })\n  // Both the produce AND the offset commit happen atomically\n})\n\n// Consumer reads only committed transactions\nconst consumer = kafka.consumer({\n  groupId: 'payment-consumer',\n  readUncommitted: false,  // isolation.level=read_committed\n})",
    "bestPractice": "EOS comes at a performance cost (roughly 10–20% throughput reduction) due to transaction coordination overhead. Use it only when duplicates would cause real harm (e.g., financial debit operations). For most event streaming use cases, at-least-once delivery with idempotent consumers is simpler, more performant, and equally correct.",
    "source": "Apache Kafka Docs — Exactly-Once Semantics; Kafka KIP-98"
  },
  {
    "id": "i09",
    "topic": "SQS vs SNS vs EventBridge",
    "question": "¿Cuál es la diferencia fundamental entre Amazon SQS, Amazon SNS y Amazon EventBridge?",
    "code": null,
    "options": [
      "SQS es cola punto a punto para tareas; SNS es pub/sub fanout para tópicos; EventBridge es bus con reglas y esquemas",
      "SQS procesa streaming continuo pesado; SNS ejecuta tareas por lotes offline; EventBridge conecta solo sensores de IoT",
      "Los tres servicios comparten el mismo protocolo de red, variando únicamente en cómo AWS tarifa peticiones por segundo",
      "SNS retiene mensajes por 14 días como SQS; EventBridge opera en memoria volátil sin filtros por contenido JSON"
    ],
    "correctIndex": 0,
    "explanation": "SQS desacopla consumidores individuales, SNS distribuye mensajes en abanico a múltiples suscriptores simultáneamente y EventBridge añade reglas de enrutamiento basadas en contenido e integraciones SaaS.",
    "compiledJS": "# SNS → SQS fan-out pattern (each subscriber gets its own queue)\n\n# 1. Create SNS topic\nSNS_ARN=$(aws sns create-topic --name order-events --query TopicArn --output text)\n\n# 2. Create per-subscriber SQS queues\nQ1_URL=$(aws sqs create-queue --queue-name analytics-queue --query QueueUrl --output text)\nQ2_URL=$(aws sqs create-queue --queue-name fulfillment-queue --query QueueUrl --output text)\n\n# 3. Subscribe both queues to the SNS topic\nQ1_ARN=$(aws sqs get-queue-attributes --queue-url $Q1_URL \\\n  --attribute-names QueueArn --query Attributes.QueueArn --output text)\naws sns subscribe --topic-arn $SNS_ARN --protocol sqs --notification-endpoint $Q1_ARN\n\n# Now one SNS publish → both queues receive a copy",
    "bestPractice": "Use the SNS→SQS fan-out pattern when you need durable fan-out: SNS delivers to each SQS queue independently, so a slow analytics consumer cannot block the fulfillment consumer. Use EventBridge when events come from external SaaS systems or when you need content-based routing rules that evolve independently of producers and consumers.",
    "source": "AWS Docs — Amazon SNS vs SQS vs EventBridge; AWS Blog — Fan-out pattern"
  },
  {
    "id": "i10",
    "topic": "Log Compaction",
    "question": "¿Qué es la compactación de logs (log compaction) en Kafka y cuándo debe utilizarse?",
    "code": null,
    "options": [
      "Un daemon de fondo que comprime logs con gzip para reducir espacio en disco",
      "Una retención que preserva solo el valor más reciente de cada clave del log",
      "Un operador Kafka Streams que une dos tópicos en un solo flujo ordenado",
      "Una rutina de limpieza que borra registros que superaron el tiempo de retención"
    ],
    "correctIndex": 1,
    "explanation": "La compactación de logs retiene el valor más reciente para cada clave, haciendo que el topic funcione como un changelog o almacén clave-valor, permitiendo a los consumidores reconstruir el estado actual.",
    "compiledJS": "# Create a compacted topic for user profile state\nkafka-topics.sh --create \\\n  --topic user-profiles \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 12 \\\n  --replication-factor 3 \\\n  --config cleanup.policy=compact \\\n  --config min.cleanable.dirty.ratio=0.1 \\\n  --config segment.ms=3600000    # compact at least every hour\n\n# Producer: update user 42's profile\nkafka-console-producer.sh \\\n  --topic user-profiles --bootstrap-server localhost:9092 \\\n  --property \"parse.key=true\" --property \"key.separator=:\"\n42:{\"name\":\"Alice\",\"email\":\"alice@example.com\"}   # v1\n42:{\"name\":\"Alice\",\"email\":\"alice@new.com\"}        # v2 — v1 eventually removed by compaction\n\n# Delete user 42 — send a tombstone (null value)\n42:null",
    "bestPractice": "Use log compaction for topics that represent mutable state (user profiles, account balances, configuration). Use time-based retention for immutable event streams (audit logs, click events). Never mix compaction with downstream consumers that depend on seeing every historical version of a key — compaction gives you latest-only semantics, not full history.",
    "source": "Apache Kafka Docs — Log Compaction"
  },
  {
    "id": "a01",
    "topic": "Log Segment Internals",
    "question": "¿Cuáles son los tres archivos que componen un segmento de log en Kafka y qué almacena cada uno?",
    "code": null,
    "options": [
      ".log guarda bytes de datos; .index mapea offsets a bytes; .timeindex las marcas",
      ".log guarda metadatos; .index graba registros binarios; .timeindex el lag de nodos",
      ".log guarda estado de grupo; .index IDs de productores; .timeindex datos de réplicas",
      ".log guarda lotes comprimidos; .index IDs de esquemas; .timeindex tiempos de TTL"
    ],
    "correctIndex": 0,
    "explanation": "El archivo .log contiene los datos reales de los mensajes; el .index proporciona una búsqueda dispersa de offset a posición de bytes para búsquedas rápidas; el .timeindex permite búsquedas basadas en tiempo.",
    "compiledJS": "# Inspect log segment files on a Kafka broker\nls -la /var/kafka-logs/orders-0/\n# 00000000000000000000.index\n# 00000000000000000000.log\n# 00000000000000000000.timeindex\n# 00000000000001048576.index    <- next segment starts at offset 1,048,576\n# 00000000000001048576.log\n# 00000000000001048576.timeindex\n# leader-epoch-checkpoint\n\n# Dump the .log file in human-readable format\nkafka-dump-log.sh \\\n  --files /var/kafka-logs/orders-0/00000000000000000000.log \\\n  --print-data-log\n# Output: offset: 0 ... key: null value: {\"orderId\": \"abc\"}\n\n# Read from a specific timestamp (uses .timeindex internally)\nkafka-console-consumer.sh \\\n  --topic orders --bootstrap-server localhost:9092 \\\n  --offset 1048576 --partition 0",
    "bestPractice": "Tune log.segment.bytes (default 1 GB) and log.segment.ms (default 7 days) to balance segment count against recovery time. Smaller segments mean more files (higher inode pressure) but faster log compaction and faster retention cleanup. Monitor kafka_log_log_size and kafka_log_log_start_offset_delta in Prometheus; set up disk usage alerts well in advance of filling the broker disk, as a full Kafka disk is an immediate availability incident.",
    "source": "Apache Kafka Docs — Log Segments; Confluent Blog — Kafka Storage Internals"
  },
  {
    "id": "a02",
    "topic": "Hot Partitions",
    "question": "¿Qué es una partición caliente (hot partition) en Kafka y cómo la causa el particionamiento basado en claves?",
    "code": null,
    "options": [
      "Una partición con demasiadas réplicas; el hash distribuye copias de forma dispar",
      "Una partición sobrecargada porque una clave repetida hace hash siempre en ella",
      "Una partición desconectada; el algoritmo de hash la ignora hasta reiniciar el nodo",
      "Una partición compactada; la distribución round-robin evita dicha compactación"
    ],
    "correctIndex": 1,
    "explanation": "Cuando unas pocas claves concentran la mayor parte del tráfico, siempre caen en la misma partición mediante hash, generando una carga desigual que puede saturar a un broker específico y a su consumidor.",
    "compiledJS": "// Custom partitioner to detect and re-route hot keys\nconst { Partitioners } = require('kafkajs')\n\nfunction hotKeyAwarePartitioner({ topic, partitionMetadata, message }) {\n  const numPartitions = partitionMetadata.length\n  const key = message.key?.toString()\n\n  // Known hot keys get spread across a dedicated partition range\n  const HOT_KEYS = new Set(['user-viral-123', 'tenant-mega-corp'])\n  if (key && HOT_KEYS.has(key)) {\n    // Hash into the upper half of partitions to spread hot-key load\n    const slot = Math.abs(hashFnv32a(key + Date.now().toString()))\n    return (Math.floor(numPartitions / 2) + (slot % Math.floor(numPartitions / 2)))\n  }\n  // Normal key-based routing for the rest\n  return Partitioners.DefaultPartitioner()({ topic, partitionMetadata, message })\n}",
    "bestPractice": "Detect hot partitions via kafka_topic_partition_messages_in_per_sec per partition in Grafana — a partition receiving 10× the median is a hot partition. Mitigations: (1) add a random salt suffix to the hot key to spread it across multiple partitions (trading ordering for load balance), (2) pre-partition hot tenants into dedicated topics, (3) increase partition count and add a custom partitioner. Always measure partition skew before scaling consumer instances.",
    "source": "Apache Kafka Docs — Custom Partitioners; Confluent Blog — Tackling Hot Partitions"
  },
  {
    "id": "a03",
    "topic": "Back-Pressure",
    "question": "¿Cómo se manifiesta el back-pressure en una cadena de consumidores de Kafka y cuál es una estrategia habitual de mitigación?",
    "code": null,
    "options": [
      "El back-pressure aparece como limitación (throttling) en el productor; la mitigación es incrementar la cantidad de topics",
      "Aparece como lag del consumidor; se gestiona escalando instancias o ajustando intervalos de poll y max.poll.records",
      "El back-pressure se manifiesta como saturación de disco en el broker; la mitigación es habilitar la compactación de logs",
      "El back-pressure se manifiesta como timeouts de ZooKeeper; la mitigación es actualizar al modo KRaft"
    ],
    "correctIndex": 1,
    "explanation": "El aumento del consumer lag es la señal directa de back-pressure; la solución estándar consiste en escalar consumidores hasta el límite de particiones, reparticionar para mayor paralelismo o reducir el tiempo de proceso por mensaje.",
    "compiledJS": "# Monitor consumer lag — the key back-pressure signal\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --describe\n# Watch LAG column — if it grows every minute, back-pressure is occurring\n\n# Prometheus query: alert when lag > 50k for > 10 minutes\n# kafka_consumer_group_lag{group=\"fulfillment-group\"} > 50000\n\n# Scale consumers: add more instances (up to partition count)\n# kubectl scale deployment fulfillment-consumer --replicas=6\n# (topic has 6 partitions — 6 consumers = max parallelism)\n\n# If consumers == partitions and lag still grows → increase partitions\nkafka-topics.sh --alter \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 12   # double partitions, then scale consumers to 12",
    "bestPractice": "Instrument consumer lag alerting from day one: set a warning at lag > 10,000 messages and a critical alert at lag growing for more than 5 minutes. Use the lag-to-time metric (lag / messages-per-second) to estimate how far behind consumers are in real time. Pre-provision spare consumer capacity (N+1 or N+2) so that a single consumer crash does not immediately cause lag spikes in production.",
    "source": "Confluent Docs — Consumer Lag Monitoring; DDIA — Chapter 11: Stream Processing"
  },
  {
    "id": "a04",
    "topic": "Kafka Streams vs Flink vs Spark",
    "question": "¿En qué se diferencia Kafka Streams de Apache Flink y Apache Spark Structured Streaming para el procesamiento de streams con estado (stateful)?",
    "code": null,
    "options": [
      "Kafka Streams es un framework por lotes; Flink y Spark son motores puros de streaming",
      "Kafka Streams es una biblioteca cliente integrada, mientras que Spark y Flink requieren clusters dedicados",
      "Kafka Streams requiere Kubernetes; Flink y Spark operan únicamente sobre servidores dedicados",
      "Kafka Streams no soporta operaciones con estado; Flink y Spark sí lo hacen"
    ],
    "correctIndex": 1,
    "explanation": "Kafka Streams se integra directamente en una aplicación JVM y aprovecha las particiones de Kafka para el paralelismo, mientras que Flink y Spark funcionan como clusters distribuidos independientes con APIs más extensas y gestión autónoma de recursos.",
    "compiledJS": "// Kafka Streams: word count (runs in-process, no cluster needed)\nconst { KafkaStreams } = require('kafka-streams')\nconst config = { noptions: { 'metadata.broker.list': 'localhost:9092' } }\nconst factory = new KafkaStreams(config)\nconst stream = factory.getKStream()\n\nstream\n  .from('text-input')\n  .mapJSONConvenience()\n  .map(msg => msg.word)\n  .countByKey('word-counts', 'word')\n  .to('word-counts-output')\n\nfactory.start()\n// State is stored locally in RocksDB — no Flink/Spark cluster needed\n// Scale by adding more application instances (each handles a partition subset)",
    "bestPractice": "Choose Kafka Streams for microservices that need lightweight stateful processing close to the data (aggregations, joins, enrichment) without the overhead of a separate processing cluster. Choose Flink when you need exactly-once stateful processing across multiple Kafka clusters, complex windowing over out-of-order events, or SQL-based stream analytics at scale. Avoid Spark Structured Streaming for real-time (< 1 s) requirements due to micro-batch overhead.",
    "source": "Apache Kafka Docs — Kafka Streams; Flink Docs; DDIA — Chapter 11"
  },
  {
    "id": "a05",
    "topic": "SQS FIFO Throughput and Message Groups",
    "question": "¿Cuál es el límite de procesamiento de una cola SQS FIFO y de qué forma influyen los Message Group IDs?",
    "code": null,
    "options": [
      "Las colas FIFO soportan procesamiento ilimitado; los Message Group IDs no tienen efecto sobre el rendimiento",
      "Colas FIFO garantizan orden estricto y deduplicación con tasa limitada; colas Standard ofrecen throughput casi ilimitado",
      "Las colas FIFO soportan 10.000 mensajes/segundo; cada Group ID añade 1.000 mensajes/segundo de capacidad",
      "Las colas FIFO soportan hasta 1.000 mensajes/segundo sin importar los Group IDs"
    ],
    "correctIndex": 1,
    "explanation": "Las colas FIFO de SQS procesan 300 TPS (3.000 con lotes); dentro de un mismo Group ID, el orden estricto serializa el procesamiento, de modo que distribuir el tráfico entre múltiples Group IDs es la clave para maximizar el paralelismo.",
    "compiledJS": "# Bad: single group ID — serialised, low throughput\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/payments.fifo \\\n  --message-body '{\"amount\":100}' \\\n  --message-group-id \"ALL_PAYMENTS\"  # ← bottleneck!\n\n# Good: per-user group IDs — parallel, high throughput\nfor USER_ID in user-1 user-2 user-3 user-4 user-5; do\n  aws sqs send-message \\\n    --queue-url https://sqs.us-east-1.amazonaws.com/123/payments.fifo \\\n    --message-body \"{\"userId\":\"$USER_ID\",\"amount\":100}\" \\\n    --message-group-id \"$USER_ID\"     # ← each user's messages ordered\ndone\n# 5 groups → up to 5 consumers processing in parallel\n# Ordering preserved per user, not globally",
    "bestPractice": "Design MessageGroupId as a business entity key (userId, orderId, accountId) rather than a constant. This gives you per-entity ordering (the actual business requirement) while enabling full parallelism across entities. Monitor the SQS console for any single MessageGroupId that dominates the queue depth — that is your throughput bottleneck.",
    "source": "AWS Docs — SQS FIFO Queues: Throughput and Limits"
  },
  {
    "id": "a06",
    "topic": "Schema Registry",
    "question": "¿Por qué es importante un registro de esquemas (schema registry) al usar Avro o Protobuf con Kafka y qué problema resuelve?",
    "code": null,
    "options": [
      "Un schema registry cifra los mensajes en tránsito; sin él, las cargas Avro se transmiten en texto plano",
      "Centraliza esquemas para que productores y consumidores validen contratos de forma desacoplada y verifiquen compatibilidad",
      "Un schema registry es un plugin del broker Kafka que valida límites de tamaño de mensaje",
      "Un schema registry sustituye a ZooKeeper en la gestión de metadatos de cluster en versiones recientes"
    ],
    "correctIndex": 1,
    "explanation": "Incluir solo el ID del esquema en lugar del esquema completo en cada mensaje reduce drásticamente el tamaño del payload, mientras el registro impone reglas de compatibilidad para evitar roturas en los consumidores existentes.",
    "compiledJS": "// Producer: register and use schema\nconst { SchemaRegistry } = require('@kafkajs/confluent-schema-registry')\nconst registry = new SchemaRegistry({ host: 'http://schema-registry:8081' })\n\nconst schemaId = await registry.register({\n  type: 'AVRO',\n  schema: JSON.stringify({\n    type: 'record',\n    name: 'Order',\n    fields: [\n      { name: 'orderId', type: 'string' },\n      { name: 'total',   type: 'double' },\n      { name: 'status',  type: ['null', 'string'], default: null },  // optional field\n    ],\n  }),\n  // Compatibility: BACKWARD — new schema can read old data\n}, { compatibility: 'BACKWARD' })\n\nconst encoded = await registry.encode(schemaId, { orderId: 'abc', total: 99.0 })\n// Wire format: [magic byte 0x00][4-byte schema ID][avro bytes]\n// Consumer fetches schema by ID — no schema in every message",
    "bestPractice": "Enforce BACKWARD compatibility as the default: new schema must be able to read messages produced with the previous schema. Add new fields with defaults (never remove required fields). Run schema validation in CI — use the Schema Registry REST API compatibility check endpoint before merging producer changes. This prevents the most common breaking change: a consumer deployed before the producer update fails to deserialise new messages.",
    "source": "Confluent Docs — Schema Registry; Apache Avro Docs — Schema Resolution"
  },
  {
    "id": "a07",
    "topic": "Consumer Lag Monitoring",
    "question": "¿Qué métricas y herramientas se utilizan habitualmente en producción para monitorizar el consumer lag de Kafka?",
    "code": null,
    "options": [
      "El consumer lag solo puede consultarse en la interfaz web nativa de Kafka",
      "Monitorear el lag mediante métricas de consumer groups o Prometheus; escalar consumidores hasta el límite de particiones",
      "El consumer lag solo se puede ver en AWS CloudWatch cuando se utiliza Amazon MSK",
      "El consumer lag se rastrea leyendo el topic __consumer_offsets de forma directa desde el código de la aplicación"
    ],
    "correctIndex": 1,
    "explanation": "El comando kafka-consumer-groups.sh brinda una instantánea puntual, mientras que las métricas JMX expuestas con Prometheus y graficadas en Grafana permiten alertar continuamente sobre tendencias de lag en producción.",
    "compiledJS": "# CLI: point-in-time lag snapshot\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --describe\n\n# Prometheus scrape config (kafka-exporter)\n# prometheus.yml:\n# scrape_configs:\n#   - job_name: kafka\n#     static_configs:\n#       - targets: ['kafka-exporter:9308']\n\n# Grafana alert rule (PromQL):\n# ALERT KafkaConsumerLagHigh\n# IF max(kafka_consumergroup_lag{consumergroup=\"fulfillment-group\"}) > 10000\n# FOR 5m\n# LABELS { severity=\"critical\" }\n\n# AWS MSK CloudWatch metric\naws cloudwatch get-metric-statistics \\\n  --namespace AWS/Kafka \\\n  --metric-name EstimatedTimeLag \\\n  --dimensions Name=ConsumerGroup,Value=fulfillment-group \\\n  --period 60 --statistics Average \\\n  --start-time 2024-01-01T00:00:00Z --end-time 2024-01-01T01:00:00Z",
    "bestPractice": "Track both records-lag (message count) and time-lag (seconds behind) — a large record lag on a low-velocity topic may only be seconds of delay, while a small lag on a high-velocity topic may represent critical processing backlog. Set paged alerts on time-lag > 60 seconds for payment or order-processing consumers; use records-lag for capacity planning dashboards.",
    "source": "Confluent Docs — Monitoring Kafka; AWS Docs — MSK Monitoring Metrics"
  },
  {
    "id": "a08",
    "topic": "Transactional Outbox Pattern",
    "question": "¿Qué es el patrón Transactional Outbox y cómo soluciona el problema de escritura dual (dual-write) entre una base de datos y un broker de mensajería?",
    "code": null,
    "options": [
      "El patrón outbox almacena mensajes en una cola SQS FIFO antes de escribir en la base de datos, asegurando que la base solo cambie si la cola acepta el mensaje",
      "Registrar el estado de negocio y el evento en una única transacción de base de datos, enviándolos luego a Kafka",
      "El patrón outbox utiliza confirmación en dos fases (two-phase commit) entre la base de datos y Kafka para garantizar escrituras simultáneas",
      "El patrón outbox almacena mensajes en la memoria de la aplicación y los envía a Kafka después de hacer commit en la base de datos"
    ],
    "correctIndex": 1,
    "explanation": "Al escribir el evento en una tabla outbox dentro de la misma transacción ACID de los datos de negocio, el patrón elimina el riesgo de confirmar en la base de datos y fallar en la publicación, mientras el relay garantiza entrega al menos una vez al broker.",
    "compiledJS": "-- Transactional outbox: one DB transaction, no distributed 2PC\nBEGIN;\n\n-- 1. Update business state\nUPDATE orders SET status = 'CONFIRMED' WHERE id = 'order-123';\n\n-- 2. Insert event into outbox (same transaction)\nINSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload, created_at)\nVALUES (\n  gen_random_uuid(),\n  'ORDER',\n  'order-123',\n  'ORDER_CONFIRMED',\n  '{\"orderId\":\"order-123\",\"total\":99.0}'::jsonb,\n  NOW()\n);\n\nCOMMIT;\n-- If COMMIT fails, both writes roll back — no orphaned event\n\n-- Relay process (Debezium CDC reads WAL and publishes to Kafka)\n-- No polling needed — Debezium streams the outbox table changes\n-- to kafka topic: outbox.event.ORDER",
    "bestPractice": "Use Debezium with the Outbox Event Router SMT for the relay — it reads PostgreSQL WAL via CDC and routes outbox records directly to Kafka topics without polling the database table. This is more efficient than a polling loop and scales to high-insert-rate scenarios. Mark outbox records as published (or delete them) after Debezium confirms delivery to avoid unbounded table growth.",
    "source": "microservices.io — Transactional Outbox Pattern; Debezium Docs — Outbox Event Router"
  },
  {
    "id": "a09",
    "topic": "Kafka Connect",
    "question": "¿Qué es Kafka Connect y cuáles son sus dos tipos principales de conectores?",
    "code": null,
    "options": [
      "Kafka Connect es una biblioteca cliente para crear grupos de consumidores personalizados; sus dos tipos son de sondeo (polling) y push",
      "Un framework integrado para conectar Kafka con bases de datos y almacenamiento mediante conectores Source y Sink",
      "Kafka Connect es una herramienta de monitorización; sus tipos de conectores son de métricas y de logs",
      "Kafka Connect es una extensión del registro de esquemas; sus conectores son de tipo Avro y Protobuf"
    ],
    "correctIndex": 1,
    "explanation": "Kafka Connect ofrece un framework escalable y tolerante a fallos: los conectores Source extraen datos de bases de datos, archivos o APIs hacia topics de Kafka, mientras los conectores Sink envían datos de topics a almacenes de datos, motores de búsqueda o almacenamiento.",
    "compiledJS": "# Deploy a JDBC Source connector (polls Postgres, pushes to Kafka)\ncurl -X POST http://localhost:8083/connectors \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"name\": \"postgres-source\",\n    \"config\": {\n      \"connector.class\": \"io.confluent.connect.jdbc.JdbcSourceConnector\",\n      \"connection.url\": \"jdbc:postgresql://db:5432/mydb\",\n      \"connection.user\": \"kafka_user\",\n      \"connection.password\": \"secret\",\n      \"table.whitelist\": \"orders,customers\",\n      \"mode\": \"timestamp+incrementing\",\n      \"timestamp.column.name\": \"updated_at\",\n      \"incrementing.column.name\": \"id\",\n      \"topic.prefix\": \"postgres.\"\n    }\n  }'\n\n# Deploy an S3 Sink connector (Kafka → S3 for analytics)\ncurl -X POST http://localhost:8083/connectors \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"name\": \"s3-sink\",\n    \"config\": {\n      \"connector.class\": \"io.confluent.connect.s3.S3SinkConnector\",\n      \"tasks.max\": \"3\",\n      \"topics\": \"orders\",\n      \"s3.region\": \"us-east-1\",\n      \"s3.bucket.name\": \"my-kafka-data\",\n      \"storage.class\": \"io.confluent.connect.s3.storage.S3Storage\",\n      \"format.class\": \"io.confluent.connect.s3.format.parquet.ParquetFormat\",\n      \"flush.size\": \"1000\"\n    }\n  }'",
    "bestPractice": "Prefer Kafka Connect over custom producer/consumer code for standard data pipeline tasks — the connector ecosystem has hundreds of pre-built, battle-tested connectors. Run Connect workers in distributed mode (not standalone) in production for automatic fault recovery. Use Debezium as your Source connector for database change data capture — it reads the WAL directly and is far more reliable and low-overhead than polling.",
    "source": "Apache Kafka Docs — Kafka Connect; Debezium Docs"
  },
  {
    "id": "a10",
    "topic": "Cross-Region Replication",
    "question": "¿En qué se diferencia la replicación entre regiones mediante fan-out con SQS y Kafka MirrorMaker 2?",
    "code": null,
    "options": [
      "El fan-out de SQS y MirrorMaker 2 son idénticos funcionalmente; la elección se basa exclusivamente en costes",
      "SNS realiza fan-out directo a múltiples colas SQS regionales, mientras Kafka usa MirrorMaker 2 para replicación entre clusters",
      "El fan-out de SQS replica mensajes con Kafka Connect; MirrorMaker 2 utiliza AWS DataSync",
      "MirrorMaker 2 opera únicamente con semántica exactly-once; el fan-out de SQS solo con at-most-once"
    ],
    "correctIndex": 1,
    "explanation": "La replicación entre regiones con SQS normalmente emplea el fan-out multirregión de SNS para patrones push simples, mientras que MirrorMaker 2 es una herramienta especializada de replicación en Kafka que también sincroniza offsets, facilitando la conmutación por error entre clusters.",
    "compiledJS": "# MirrorMaker 2 config: us-east-1 → eu-west-1 (active-passive DR)\n# mm2.properties\nclusters = us-east, eu-west\nus-east.bootstrap.servers = broker1.us-east:9092,broker2.us-east:9092\neu-west.bootstrap.servers = broker1.eu-west:9092,broker2.eu-west:9092\n\nus-east->eu-west.enabled = true\nus-east->eu-west.topics = .*             # replicate all topics\nus-east->eu-west.groups = .*             # replicate all consumer offsets\n\n# Topic prefix in destination: us-east.orders (preserves source identity)\nreplication.factor = 3\nemit.checkpoints.interval.seconds = 60  # offset sync frequency\n\n# Start MM2\nconnect-mirror-maker.sh mm2.properties\n\n# SNS → SQS multi-region fan-out (managed, no MM2 needed)\naws sns subscribe --topic-arn $SNS_ARN_US_EAST \\\n  --protocol sqs --notification-endpoint $SQS_ARN_EU_WEST\n# SNS delivers to both regions on every publish",
    "bestPractice": "For Kafka DR, use MirrorMaker 2 with checkpoints enabled so consumer group offsets are replicated — without this, failing over to the DR cluster causes consumers to reprocess from the beginning or skip messages depending on auto.offset.reset. For SQS-based systems, use the SNS→SQS multi-region fan-out pattern and ensure your DLQs exist in both regions. Test failover quarterly; a DR topology you have never exercised is not a DR topology.",
    "source": "Apache Kafka Docs — MirrorMaker 2; AWS Docs — SNS Cross-Region Delivery"
  }
]
