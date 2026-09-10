import type { InterviewQuestion } from '@/lib/interviewTypes'

export const MESSAGING_SQS_KAFKA_QUESTIONS_PT: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "Message Queues",
    "question": "Qual é o objetivo principal de uma fila de mensagens em um sistema distribuído?",
    "code": null,
    "options": [
      "Armazenar dados permanentemente em tabelas relacionais",
      "Desacoplar produtores e consumidores em fluxos assíncronos",
      "Sincronizar requisições HTTP bloqueantes entre serviços",
      "Prover camada de cache chave-valor em memória para nós"
    ],
    "correctIndex": 1,
    "explanation": "Uma fila de mensagens desacopla os produtores dos consumidores, permitindo que cada lado processe em seu próprio ritmo, sem necessidade de sincronização direta.",
    "compiledJS": "// Producer (Order Service) — does NOT call Consumer directly\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/order-queue \\\n  --message-body '{\"orderId\":\"abc\",\"total\":49.99}'\n# Producer immediately returns; Consumer is invoked separately\n\n// Consumer (Fulfillment Service) — runs on its own schedule\naws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/order-queue \\\n  --max-number-of-messages 10\n# If consumer is offline, messages wait — producer never blocks",
    "bestPractice": "In production, always pair queue-based decoupling with a Dead Letter Queue so that messages that repeatedly fail are captured for inspection rather than silently lost. Use CloudWatch metrics on ApproximateNumberOfMessagesVisible to detect when consumers are falling behind and trigger auto-scaling.",
    "source": "AWS Docs — Amazon SQS: How It Works"
  },
  {
    "id": "b02",
    "topic": "Producer/Consumer",
    "question": "No modelo produtor/consumidor, qual é o papel de um produtor?",
    "code": null,
    "options": [
      "Ler e processar mensagens da fila",
      "Gerenciar a infraestrutura da fila e as regras de roteamento",
      "Enviar mensagens para a fila visando o processamento posterior",
      "Monitorar a profundidade da fila e acionar o escalonamento automático"
    ],
    "correctIndex": 2,
    "explanation": "Um produtor publica mensagens na fila; na outra ponta, um consumidor lê e processa essas mensagens.",
    "compiledJS": "// Producer: write a message (Kafka example)\nconst { Kafka } = require('kafkajs')\nconst kafka = new Kafka({ clientId: 'order-svc', brokers: ['broker:9092'] })\nconst producer = kafka.producer()\nawait producer.connect()\nawait producer.send({\n  topic: 'orders',\n  messages: [{ key: 'order-1', value: JSON.stringify({ orderId: 1, total: 99 }) }],\n})\nawait producer.disconnect()\n\n// Consumer: read messages\nconst consumer = kafka.consumer({ groupId: 'fulfillment-group' })\nawait consumer.connect()\nawait consumer.subscribe({ topic: 'orders', fromBeginning: false })\nawait consumer.run({ eachMessage: async ({ message }) => {\n  console.log('Processing:', message.value?.toString())\n}})",
    "bestPractice": "Producers should always serialize messages using a versioned schema (Avro/Protobuf with a schema registry) rather than raw JSON strings — this prevents deserialization failures when the payload shape changes. Set acks=all on Kafka producers to ensure the message is confirmed by all ISR replicas before the send call returns.",
    "source": "Apache Kafka Docs — Producer API"
  },
  {
    "id": "b03",
    "topic": "SQS Basics",
    "question": "O que é o Amazon SQS?",
    "code": null,
    "options": [
      "Um serviço de banco de dados relacional totalmente gerenciado da AWS",
      "Um serviço de enfileiramento de mensagens totalmente gerenciado da AWS",
      "Uma plataforma distribuída de streaming de código aberto",
      "Um mecanismo de computação serverless para trabalhos em lote"
    ],
    "correctIndex": 1,
    "explanation": "O Amazon SQS (Simple Queue Service) é um serviço de enfileiramento de mensagens serverless e totalmente gerenciado oferecido pela AWS.",
    "compiledJS": "# Create a Standard SQS queue\naws sqs create-queue --queue-name my-orders\n\n# Send a message\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123456789/my-orders \\\n  --message-body '{\"event\":\"ORDER_PLACED\",\"orderId\":\"xyz\"}'\n\n# Receive and delete a message\nMSG=$(aws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123456789/my-orders \\\n  --query 'Messages[0]')\nRECEIPT=$(echo $MSG | jq -r '.ReceiptHandle')\naws sqs delete-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123456789/my-orders \\\n  --receipt-handle \"$RECEIPT\"",
    "bestPractice": "Always enable server-side encryption (SSE) on SQS queues using AWS KMS for queues that carry sensitive data. Configure a Dead Letter Queue with a redrive policy (maxReceiveCount: 3–5) from day one — finding out a bug has silently discarded messages in production is very expensive.",
    "source": "AWS Docs — Amazon SQS Developer Guide"
  },
  {
    "id": "b04",
    "topic": "FIFO Queue",
    "question": "Qual é a principal diferença entre uma fila SQS Standard e uma fila SQS FIFO?",
    "code": null,
    "options": [
      "Filas padrão garantem ordem estrita; filas FIFO operam com entrega aleatória",
      "Filas FIFO garantem ordem e deduplicação; filas padrão operam com best-effort",
      "Filas padrão forçam criptografia em repouso; filas FIFO não suportam chaves KMS",
      "Filas FIFO têm menor custo por mensagem; filas padrão impõem limites rígidos"
    ],
    "correctIndex": 1,
    "explanation": "As filas FIFO preservam rigorosamente a ordem das mensagens e evitam duplicatas, enquanto as filas Standard oferecem maior vazão (throughput) com ordenação por melhor esforço e entrega at-least-once.",
    "compiledJS": "# Create a FIFO queue — note the .fifo suffix is REQUIRED\naws sqs create-queue \\\n  --queue-name payment-events.fifo \\\n  --attributes FifoQueue=true,ContentBasedDeduplication=true\n\n# Send a message with a MessageGroupId (required for FIFO)\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/payment-events.fifo \\\n  --message-body '{\"type\":\"PAYMENT\",\"amount\":100}' \\\n  --message-group-id \"user-42\" \\\n  --message-deduplication-id \"txn-9876\"\n# Messages with the same GroupId are processed in order",
    "bestPractice": "Use MessageGroupId to scope ordering to a logical entity (e.g., user ID or order ID) rather than a single global group — a single group serializes all processing and tanks throughput. Spread traffic across many distinct group IDs to approach the 3,000 TPS ceiling while preserving per-entity ordering.",
    "source": "AWS Docs — Amazon SQS FIFO Queues"
  },
  {
    "id": "b05",
    "topic": "At-Least-Once Delivery",
    "question": "O que significa 'entrega pelo menos uma vez' (at-least-once delivery) em um sistema de mensageria?",
    "code": null,
    "options": [
      "A mensagem é entregue estritamente uma única vez sem chance de duplicatas",
      "A mensagem pode chegar mais de uma vez, exigindo consumidores idempotentes",
      "A mensagem é entregue somente quando instâncias consumidoras estão ativas",
      "A mensagem permanece retida na memória até a confirmação de todo o grupo"
    ],
    "correctIndex": 1,
    "explanation": "A entrega at-least-once garante que a mensagem chegue ao consumidor, mas admite duplicatas, exigindo que os consumidores sejam idempotentes.",
    "compiledJS": "// Idempotent consumer pattern (Node.js + DynamoDB)\nconst { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')\nconst db = new DynamoDBClient({})\n\nasync function processMessage(msg) {\n  const msgId = msg.MessageId\n  try {\n    // Conditional write: fails if item already exists\n    await db.send(new PutItemCommand({\n      TableName: 'ProcessedMessages',\n      Item: { messageId: { S: msgId } },\n      ConditionExpression: 'attribute_not_exists(messageId)',\n    }))\n  } catch (e) {\n    if (e.name === 'ConditionalCheckFailedException') {\n      console.log('Duplicate — skipping', msgId)\n      return // already processed, safe to delete from queue\n    }\n    throw e\n  }\n  // ... actual business logic ...\n}",
    "bestPractice": "Design every SQS consumer to be naturally idempotent: use database upserts rather than inserts, emit events that are safe to replay, and store a deduplication token (the SQS MessageId) in your datastore. For SQS FIFO queues, enable ContentBasedDeduplication or supply a MessageDeduplicationId — but still write idempotent consumers as a defence-in-depth measure.",
    "source": "AWS Docs — SQS at-least-once delivery; DDIA — Chapter 11"
  },
  {
    "id": "b06",
    "topic": "Dead Letter Queue",
    "question": "O que é uma Dead Letter Queue (DLQ)?",
    "code": null,
    "options": [
      "Uma fila temporária de alta velocidade que expurga mensagens caso não sejam consumidas em até 60 segundos",
      "Uma fila secundária que captura mensagens que excederam o número máximo de tentativas falhas de processamento",
      "Uma fila de prioridade crítica com replicação multirregional para disparar alertas urgentes de indisponibilidade",
      "Uma fila exclusiva de auditoria que grava metadados e checkpoints de transações concluídas com sucesso por workers"
    ],
    "correctIndex": 1,
    "explanation": "Uma DLQ captura mensagens que falham repetidamente no processamento, permitindo que sejam inspecionadas e reprocessadas sem bloquear a fila principal.",
    "compiledJS": "# 1. Create the DLQ\naws sqs create-queue --queue-name orders-dlq\nDLQ_ARN=$(aws sqs get-queue-attributes \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders-dlq \\\n  --attribute-names QueueArn --query Attributes.QueueArn --output text)\n\n# 2. Create the main queue with a redrive policy\naws sqs create-queue \\\n  --queue-name orders \\\n  --attributes \"{\n    \\\"RedrivePolicy\\\": \\\"{\\\\\\\"deadLetterTargetArn\\\\\\\":\\\\\\\"$DLQ_ARN\\\\\\\",\\\\\\\"maxReceiveCount\\\\\\\":\\\\\\\"3\\\\\\\"}\\\"\n  }\"\n# After 3 failed receive+delete cycles, message moves to orders-dlq",
    "bestPractice": "Set a CloudWatch alarm on ApproximateNumberOfMessagesVisible for every DLQ — a non-zero DLQ depth indicates a consumer bug or data quality problem that needs immediate attention. Keep DLQ message retention at the maximum (14 days) so you have time to diagnose and replay; for Kafka, route failures to a -error topic with the original topic, partition, and offset in the message headers for easy replay.",
    "source": "AWS Docs — SQS Dead Letter Queues"
  },
  {
    "id": "b07",
    "topic": "Kafka Introduction",
    "question": "O que é o Apache Kafka?",
    "code": null,
    "options": [
      "Um banco relacional otimizado para gravação contínua de séries temporais",
      "Uma plataforma de streaming distribuído para logs tolerantes a falhas",
      "Um cache em memória projetado para substituir o Redis em funções sem servidor",
      "Um gateway de API criado para roteamento de chamadas HTTP síncronas REST"
    ],
    "correctIndex": 1,
    "explanation": "O Apache Kafka é uma plataforma distribuída de streaming de eventos de código aberto, utilizada para mensageria no modelo publicação-assinatura (pub/sub) com alta vazão, durabilidade e tolerância a falhas.",
    "compiledJS": "# Start a local Kafka cluster (KRaft mode — no ZooKeeper)\ndocker run -d --name kafka \\\n  -e KAFKA_NODE_ID=1 \\\n  -e KAFKA_PROCESS_ROLES=broker,controller \\\n  -e KAFKA_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093 \\\n  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \\\n  -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@localhost:9093 \\\n  -p 9092:9092 \\\n  apache/kafka:3.7.0\n\n# Create a topic with 3 partitions, replication factor 1\nkafka-topics.sh --create \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 3 \\\n  --replication-factor 1\n\n# Produce a message\necho \"order-1:{'total':99}\" | kafka-console-producer.sh \\\n  --topic orders --bootstrap-server localhost:9092 --property \"parse.key=true\"",
    "bestPractice": "Always deploy Kafka with a replication factor of at least 3 in production, with min.insync.replicas=2 and acks=all on producers. This configuration tolerates one broker failure without data loss. Use Amazon MSK or Confluent Cloud for managed operations unless you have dedicated SRE capacity to manage Kafka clusters yourself.",
    "source": "Apache Kafka Docs — Introduction"
  },
  {
    "id": "b08",
    "topic": "Topic vs Queue",
    "question": "Como um tópico do Kafka se diferencia de uma fila de mensagens tradicional?",
    "code": null,
    "options": [
      "Um tópico descarta mensagens assim que o primeiro consumidor lê a carga",
      "Um tópico mantém um log imutável permitindo leitura por múltiplos grupos",
      "Um tópico restringe o envio a apenas um único produtor conectado por vez",
      "Um tópico assegura latência submilisegundo em qualquer condição de carga"
    ],
    "correctIndex": 1,
    "explanation": "Ao contrário de uma fila tradicional que remove mensagens após o consumo, um tópico do Kafka persiste mensagens em um log somente de acréscimo (append-only), permitindo leituras independentes por múltiplos grupos de consumidores.",
    "compiledJS": "# Two independent consumer groups reading the same topic\n# Group 1: Analytics service — starts from the beginning\nkafka-console-consumer.sh \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --group analytics-group \\\n  --from-beginning\n\n# Group 2: Fulfillment service — reads only new messages\nkafka-console-consumer.sh \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group\n\n# Both groups get all messages; neither affects the other's offset\n# An SQS queue would only deliver each message to ONE consumer",
    "bestPractice": "Use Kafka when you need fan-out to multiple independent consumers or the ability to replay historical events. Use SQS when you need a simpler, managed work queue where each message is processed by exactly one worker and you do not need to replay. Avoid using Kafka as a pure queue replacement — its operational complexity is only justified when you need its multi-consumer or replay capabilities.",
    "source": "Apache Kafka Docs — Topics and Partitions"
  },
  {
    "id": "b09",
    "topic": "Consumer Groups",
    "question": "O que é um grupo de consumidores (consumer group) no Kafka?",
    "code": null,
    "options": [
      "Um cluster de brokers que coordena conjuntos de replicação de partição",
      "Um conjunto de consumidores que lê fatias distintas de partições do tópico",
      "Um perfil administrativo que gerencia a criação e exclusão de tópicos Kafka",
      "Um grupo de produtores upstream que compartilham a mesma identificação"
    ],
    "correctIndex": 1,
    "explanation": "Um grupo de consumidores possibilita o escalonamento horizontal do processamento de mensagens: cada partição é atribuída a exatamente um consumidor do grupo em determinado momento.",
    "compiledJS": "// Consumer group with 3 members (KafkaJS)\nconst { Kafka } = require('kafkajs')\nconst kafka = new Kafka({ brokers: ['broker:9092'] })\n\n// Three instances of this code with the SAME groupId form a group\nconst consumer = kafka.consumer({ groupId: 'fulfillment-group' })\nawait consumer.connect()\nawait consumer.subscribe({ topic: 'orders', fromBeginning: false })\n\nawait consumer.run({\n  eachMessage: async ({ topic, partition, message }) => {\n    console.log(`Worker on partition ${partition}: ${message.value}`)\n  },\n})\n// Kafka assigns partitions so no two workers in the same group\n// receive the same message at the same time",
    "bestPractice": "Set the number of consumer instances equal to the number of partitions to achieve maximum parallelism — additional consumers beyond the partition count sit idle. Monitor consumer_lag via JMX or Prometheus; if lag grows persistently, either scale out consumers (up to partition count), increase partition count, or reduce per-message processing time.",
    "source": "Apache Kafka Docs — Consumer Groups"
  },
  {
    "id": "b10",
    "topic": "Global Ordering at Scale",
    "question": "Por que a ordenação global estrita de mensagens é difícil de garantir em escala em sistemas de mensageria distribuída?",
    "code": null,
    "options": [
      "Latência de rede e nós paralelos tornam ordenação global um gargalo no cluster",
      "Ordem estrita exige tabelas relacionais incompatíveis com motores de mensageria",
      "Conexões de rede TCP naturalmente embaralham pacotes quando operam sob carga",
      "Brokers randomizam intencionalmente a entrega para balancear consumo de nós"
    ],
    "correctIndex": 0,
    "explanation": "A ordenação global requer uma sequência única e ordenada, forçando a serialização e tornando-se um gargalo de taxa de transferência; sistemas particionados abrem mão da ordem global em favor da escalabilidade.",
    "compiledJS": null,
    "bestPractice": "Rarely does a system need strict global ordering across all messages. Identify the actual business invariant: usually it is \"events for a given entity (user, order, account) must be ordered.\" Model this with Kafka partition keys (same entity always routes to the same partition) or SQS FIFO MessageGroupIds so ordering is enforced per entity, not globally, allowing full horizontal scaling.",
    "source": "DDIA — Chapter 9: Consistency and Consensus; Apache Kafka Docs — Partitioning"
  },
  {
    "id": "i01",
    "topic": "Visibility Timeout",
    "question": "O que é o timeout de visibilidade (visibility timeout) do SQS e por que ele é importante?",
    "code": null,
    "options": [
      "O tempo máximo que uma mensagem pode permanecer na fila antes de ser excluída automaticamente",
      "O período durante o qual uma mensagem recebida fica oculta para outros consumidores, evitando processamento duplicado",
      "O atraso antes que uma mensagem recém-enviada fique visível para os consumidores",
      "A janela de tempo permitida para um consumidor se autenticar antes de ler uma mensagem"
    ],
    "correctIndex": 1,
    "explanation": "O timeout de visibilidade oculta a mensagem de outros consumidores enquanto um consumidor a está processando; se a mensagem não for excluída antes que o tempo expire, ela volta a ficar visível para novas tentativas.",
    "compiledJS": "# Receive a message — it is now invisible to others for 30 s (default)\naws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --visibility-timeout 60\n\n# If processing will exceed timeout, extend it dynamically\naws sqs change-message-visibility \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --receipt-handle \"AQEB...\" \\\n  --visibility-timeout 120    # add 2 more minutes\n\n# When done, delete — otherwise message reappears after timeout\naws sqs delete-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --receipt-handle \"AQEB...\"",
    "bestPractice": "Set the visibility timeout to at least 6× the median processing time of your slowest consumer. For long-running jobs, implement a \"heartbeat\" thread that calls ChangeMessageVisibility every 2/3 of the current timeout to keep the message hidden until processing completes. Alert on ApproximateAgeOfOldestMessage to detect consumers that are silently failing to delete messages.",
    "source": "AWS Docs — SQS Visibility Timeout"
  },
  {
    "id": "i02",
    "topic": "Long Polling",
    "question": "Qual é a vantagem do long polling em relação ao short polling no SQS?",
    "code": null,
    "options": [
      "Marca mensagens não confirmadas como venenosas e as descarta imediatamente para evitar travamentos de workers",
      "Oculta a mensagem de outros nós enquanto um worker a processa, tornando-a visível se o timeout expirar sem deleção",
      "Grava mensagens em trânsito em buckets criptografados do S3 para retenção durável durante falhas de máquinas",
      "Limita conexões de clientes a uma única thread consumidora simultânea para forçar o consumo estritamente sequencial"
    ],
    "correctIndex": 1,
    "explanation": "O long polling aguarda até 20 segundos pela chegada de uma mensagem antes de responder, eliminando a maioria das respostas vazias de ReceiveMessage e reduzindo os custos com chamadas de API.",
    "compiledJS": "# Short polling — returns immediately (bad for idle queues)\naws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders\n# Often returns: { \"Messages\": [] } — costs money, wastes CPU\n\n# Long polling — waits up to 20 s for a message\naws sqs receive-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --wait-time-seconds 20\n# Returns as soon as a message arrives, or after 20 s if still empty\n\n# Set long polling as the queue default (so all clients benefit)\naws sqs set-queue-attributes \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --attributes ReceiveMessageWaitTimeSeconds=20",
    "bestPractice": "Always configure long polling (WaitTimeSeconds=20) at the queue level as a default, and also set it on each ReceiveMessage call. This is a free performance improvement — there is no reason to use short polling unless you have a specific real-time latency requirement that cannot tolerate a 20-second wait, which is rare in practice.",
    "source": "AWS Docs — SQS Long Polling"
  },
  {
    "id": "i03",
    "topic": "SQS Retention and Size",
    "question": "Quais são os períodos de retenção de mensagem padrão e máximo em uma fila do SQS?",
    "code": null,
    "options": [
      "Padrão de 1 dia, máximo de 7 dias",
      "Padrão de 4 dias, máximo de 14 dias",
      "Padrão de 7 dias, máximo de 30 dias",
      "Padrão de 1 hora, máximo de 24 horas"
    ],
    "correctIndex": 1,
    "explanation": "O SQS retém mensagens por 4 dias por padrão e pode ser configurado para até um máximo de 14 dias, após o qual as mensagens não entregues são excluídas.",
    "compiledJS": "# Set retention to maximum 14 days (1,209,600 seconds)\naws sqs set-queue-attributes \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --attributes MessageRetentionPeriod=1209600\n\n# Claim-check pattern: large payload stored in S3\n# 1. Upload payload to S3\nS3_KEY=\"payloads/order-$(uuidgen).json\"\naws s3 cp large-order.json s3://my-bucket/$S3_KEY\n\n# 2. Send only the reference in SQS\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/orders \\\n  --message-body \"{\"s3Key\":\"$S3_KEY\"}\"\n\n# Consumer fetches the real payload from S3",
    "bestPractice": "Keep retention at 14 days for queues connected to DLQs — this gives you maximum time to diagnose and replay failed messages before they expire. For queues handling ephemeral events (e.g., UI click telemetry) a shorter retention of 1–4 hours is fine and prevents unbounded storage growth if consumers fall behind.",
    "source": "AWS Docs — SQS Message Attributes and Limits"
  },
  {
    "id": "i04",
    "topic": "Kafka Partitions",
    "question": "Como as partições do Kafka viabilizam o paralelismo no consumo de mensagens?",
    "code": null,
    "options": [
      "Partições criptografam dados em diferentes volumes de armazenamento em disco",
      "Partições dividem o fluxo do tópico para permitir leitura paralela horizontal",
      "Partições comprimem registros para acelerar a vazão de processamento por nós",
      "Partições acumulam lotes de escrita para evitar esgotamento de memória no broker"
    ],
    "correctIndex": 1,
    "explanation": "As partições do Kafka dividem um tópico em logs ordenados e independentes; cada partição pode ser consumida por exatamente um consumidor por grupo, permitindo processamento paralelo proporcional à contagem de partições.",
    "compiledJS": "# Topic with 6 partitions — 6-way consumer parallelism possible\nkafka-topics.sh --create \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 6 \\\n  --replication-factor 3\n\n# Check partition assignment for a consumer group\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --describe\n# Output:\n# CONSUMER-ID          PARTITION  CURRENT-OFFSET  LOG-END  LAG\n# worker-1             0          1024            1024     0\n# worker-1             1          980             980      0\n# worker-2             2          1100            1100     0\n# worker-2             3          995             995      0\n# worker-3             4          870             870      0\n# worker-3             5          910             910      0",
    "bestPractice": "Size partitions generously (err on the side of more) because increasing partitions on a live topic is a one-way operation that triggers rebalancing and ordering disruption. A common heuristic is: target throughput / per-partition throughput (≈10 MB/s) + 20% headroom. Avoid more than ~4,000 partitions per broker to keep memory pressure and rebalance times manageable.",
    "source": "Apache Kafka Docs — Topics and Partitions; Confluent Blog — How to Choose the Number of Partitions"
  },
  {
    "id": "i05",
    "topic": "Committed vs Latest Offset",
    "question": "Qual é a diferença entre o offset confirmado (committed offset) e o offset mais recente (latest offset) no Kafka?",
    "code": null,
    "options": [
      "Offset committed é o próximo a gravar; offset latest é o log mais antigo",
      "Offset committed é o confirmado pelo grupo; offset latest é a ponta do log",
      "Offset committed fica gravado no disco; offset latest reside apenas na RAM",
      "Offset committed rege lotes do produtor; offset latest rege o lag dos clientes"
    ],
    "correctIndex": 1,
    "explanation": "O atraso do consumidor (consumer lag) é a diferença entre o offset mais recente (fim do log da partição) e o offset confirmado (última posição confirmada), representando mensagens ainda não processadas.",
    "compiledJS": "# Check committed offsets and lag for a consumer group\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --describe\n\n# Output columns:\n# TOPIC    PARTITION  CURRENT-OFFSET(committed)  LOG-END-OFFSET(latest)  LAG\n# orders   0          5420                        5420                    0     <- healthy\n# orders   1          5100                        5420                    320   <- consumer behind!\n# orders   2          5380                        5420                    40    <- slight lag\n\n# Reset offsets to re-process from beginning (use with care)\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --topic orders \\\n  --reset-offsets --to-earliest --execute",
    "bestPractice": "Commit offsets AFTER successful processing, not before. Use Kafka's auto.commit=false in production and commit manually after the business logic succeeds. Alert on consumer lag > a threshold (e.g., 10,000 messages or growing for more than 5 minutes) to catch processing bottlenecks before they become outages.",
    "source": "Apache Kafka Docs — Offset Management"
  },
  {
    "id": "i06",
    "topic": "Consumer Group Rebalancing",
    "question": "O que dispara um rebalanceamento (rebalance) de grupo de consumidores no Kafka?",
    "code": null,
    "options": [
      "Um administrador aumenta a contagem de partições do tópico em produção",
      "Um consumidor entra, sai ou sofre timeout, redistribuindo as partições",
      "Um produtor envia lotes de mensagens maiores que o limite de segmento local",
      "O cluster de brokers executa eleições de metadados via ZooKeeper ou KRaft"
    ],
    "correctIndex": 1,
    "explanation": "O rebalanceamento redistribui a posse das partições entre os consumidores sempre que a composição do grupo muda ou um consumidor falha no heartbeat, pausando temporariamente o consumo.",
    "compiledJS": "// Consumer config to reduce rebalance impact\nconst consumer = kafka.consumer({\n  groupId: 'fulfillment-group',\n  sessionTimeout: 30000,          // 30 s — time before broker marks consumer dead\n  heartbeatInterval: 3000,        // 3 s — send heartbeat every 3 s\n  maxPollIntervalMs: 300000,      // 5 min — max time between poll() calls\n  // Cooperative rebalancing (Kafka 2.4+)\n  rebalanceTimeout: 60000,\n})\n\n// Listen for rebalance events\nconsumer.on(consumer.events.REBALANCING, () => {\n  console.log('Rebalance in progress — pausing processing')\n})\nconsumer.on(consumer.events.GROUP_JOIN, () => {\n  console.log('Joined group — resuming')\n})",
    "bestPractice": "Minimise rebalances by setting maxPollIntervalMs comfortably above your slowest message processing time, and deploying consumer updates with rolling restarts rather than killing all instances simultaneously. Enable cooperative rebalancing (partition.assignment.strategy=CooperativeStickyAssignor) in Kafka 2.4+ to avoid the full stop-the-world pause. Monitor kafka_consumer_group_rebalances_per_second in Grafana — frequent rebalances indicate an unhealthy consumer fleet.",
    "source": "Apache Kafka Docs — Consumer Group Rebalancing; KIP-429 Incremental Cooperative Rebalancing"
  },
  {
    "id": "i07",
    "topic": "Replication Factor and ISR",
    "question": "Qual é o objetivo do fator de replicação no Kafka e o que significa ISR?",
    "code": null,
    "options": [
      "Fator de replicação define TTL; ISR mede janelas de retenção de segmentos",
      "Replicação define total de cópias; ISR são réplicas sincronizadas com o líder",
      "Replicação controla concorrência; ISR rastreia o atraso de offset no cluster",
      "Replicação define compressão zstd; ISR armazena checksums de integridade"
    ],
    "correctIndex": 1,
    "explanation": "Um fator de replicação mais alto melhora a durabilidade; o Kafka só confirma uma gravação quando o número necessário de réplicas ISR tiver confirmado o recebimento, equilibrando durabilidade com latência.",
    "compiledJS": "# Topic with replication factor 3\nkafka-topics.sh --create \\\n  --topic payments \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 6 \\\n  --replication-factor 3\n\n# Check ISR for each partition\nkafka-topics.sh --describe \\\n  --topic payments \\\n  --bootstrap-server localhost:9092\n# Output:\n# Partition: 0  Leader: 1  Replicas: 1,2,3  Isr: 1,2,3  <- all in sync\n# Partition: 1  Leader: 2  Replicas: 2,3,1  Isr: 2,3    <- broker 1 lagging!\n\n# Producer config for maximum durability\n# acks=all + min.insync.replicas=2 on broker",
    "bestPractice": "Use replication factor 3 with min.insync.replicas=2 and acks=all on producers for production data. This tolerates one broker failure without data loss and without blocking producers. Never set min.insync.replicas equal to the replication factor — if one replica is temporarily offline, all produces will block. Monitor UnderReplicatedPartitions JMX metric; a non-zero value means data is not fully replicated and the cluster is at risk.",
    "source": "Apache Kafka Docs — Replication; Confluent Docs — ISR"
  },
  {
    "id": "i08",
    "topic": "Exactly-Once Semantics",
    "question": "Qual configuração do Kafka atinge a semântica de exatamente uma vez (exactly-once semantics) ponta a ponta?",
    "code": null,
    "options": [
      "Configurar acks=0 no produtor para evitar retries e usar tópicos FIFO de partição única com commit manual de offset",
      "Ativar produtores idempotentes com APIs transacionais e configurar consumers com `isolation.level=read_committed`",
      "Desativar batches no produtor e delegar a deduplicação de mensagens a um cluster ZooKeeper com tolerância a falhas",
      "Usar replicação síncrona em todos os brokers permitindo que o consumidor comite offsets automaticamente a cada payload"
    ],
    "correctIndex": 1,
    "explanation": "A entrega exactly-once do Kafka exige produtores idempotentes para evitar gravações duplicadas e APIs transacionais para produzir e comitar offsets atomicamente, enquanto consumidores leem apenas dados confirmados.",
    "compiledJS": "// Producer with exactly-once semantics\nconst producer = kafka.producer({\n  transactionalId: 'payment-processor-1',  // unique per producer instance\n  maxInFlightRequests: 5,\n  idempotent: true,   // enable.idempotence=true\n})\nawait producer.connect()\nawait producer.transaction(async (tx) => {\n  await tx.send({ topic: 'payments', messages: [{ value: 'pay-123' }] })\n  await tx.sendOffsets({\n    consumerGroupId: 'payment-consumer',\n    topics: [{ topic: 'orders', partitions: [{ partition: 0, offset: '42' }] }],\n  })\n  // Both the produce AND the offset commit happen atomically\n})\n\n// Consumer reads only committed transactions\nconst consumer = kafka.consumer({\n  groupId: 'payment-consumer',\n  readUncommitted: false,  // isolation.level=read_committed\n})",
    "bestPractice": "EOS comes at a performance cost (roughly 10–20% throughput reduction) due to transaction coordination overhead. Use it only when duplicates would cause real harm (e.g., financial debit operations). For most event streaming use cases, at-least-once delivery with idempotent consumers is simpler, more performant, and equally correct.",
    "source": "Apache Kafka Docs — Exactly-Once Semantics; Kafka KIP-98"
  },
  {
    "id": "i09",
    "topic": "SQS vs SNS vs EventBridge",
    "question": "Qual é a principal diferença entre o Amazon SQS, Amazon SNS e Amazon EventBridge?",
    "code": null,
    "options": [
      "SQS é fila ponto a ponto para tarefas; SNS é pub/sub fanout para tópicos; EventBridge é barramento com regras e schemas",
      "SQS processa streaming contínuo pesado; SNS executa rotinas em lote offline; EventBridge atende apenas sensores de IoT",
      "Os três serviços compartilham o mesmo protocolo de rede, diferenciando-se apenas na tarifação de pacotes por segundo",
      "SNS armazena mensagens por 14 dias como o SQS; EventBridge opera em memória volátil sem filtros por conteúdo JSON"
    ],
    "correctIndex": 0,
    "explanation": "O SQS desacopla consumidores individuais, o SNS faz fan-out para múltiplos assinantes simultaneamente e o EventBridge acrescenta regras de roteamento baseadas em conteúdo e integrações com fontes SaaS.",
    "compiledJS": "# SNS → SQS fan-out pattern (each subscriber gets its own queue)\n\n# 1. Create SNS topic\nSNS_ARN=$(aws sns create-topic --name order-events --query TopicArn --output text)\n\n# 2. Create per-subscriber SQS queues\nQ1_URL=$(aws sqs create-queue --queue-name analytics-queue --query QueueUrl --output text)\nQ2_URL=$(aws sqs create-queue --queue-name fulfillment-queue --query QueueUrl --output text)\n\n# 3. Subscribe both queues to the SNS topic\nQ1_ARN=$(aws sqs get-queue-attributes --queue-url $Q1_URL \\\n  --attribute-names QueueArn --query Attributes.QueueArn --output text)\naws sns subscribe --topic-arn $SNS_ARN --protocol sqs --notification-endpoint $Q1_ARN\n\n# Now one SNS publish → both queues receive a copy",
    "bestPractice": "Use the SNS→SQS fan-out pattern when you need durable fan-out: SNS delivers to each SQS queue independently, so a slow analytics consumer cannot block the fulfillment consumer. Use EventBridge when events come from external SaaS systems or when you need content-based routing rules that evolve independently of producers and consumers.",
    "source": "AWS Docs — Amazon SNS vs SQS vs EventBridge; AWS Blog — Fan-out pattern"
  },
  {
    "id": "i10",
    "topic": "Log Compaction",
    "question": "O que é a compactação de log (log compaction) no Kafka e quando ela deve ser usada?",
    "code": null,
    "options": [
      "Um daemon de segundo plano que compacta logs com gzip para poupar espaço",
      "Uma retenção que preserva apenas o valor mais recente para cada chave do log",
      "Um operador Kafka Streams que une dois tópicos em um único fluxo ordenado",
      "Uma rotina de limpeza que apaga registros que superaram o tempo de retenção"
    ],
    "correctIndex": 1,
    "explanation": "A compactação de log preserva o valor mais recente para cada chave de mensagem, tornando o tópico adequado como changelog ou armazenamento chave-valor, enquanto ainda permite aos consumidores reproduzir o estado mais recente.",
    "compiledJS": "# Create a compacted topic for user profile state\nkafka-topics.sh --create \\\n  --topic user-profiles \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 12 \\\n  --replication-factor 3 \\\n  --config cleanup.policy=compact \\\n  --config min.cleanable.dirty.ratio=0.1 \\\n  --config segment.ms=3600000    # compact at least every hour\n\n# Producer: update user 42's profile\nkafka-console-producer.sh \\\n  --topic user-profiles --bootstrap-server localhost:9092 \\\n  --property \"parse.key=true\" --property \"key.separator=:\"\n42:{\"name\":\"Alice\",\"email\":\"alice@example.com\"}   # v1\n42:{\"name\":\"Alice\",\"email\":\"alice@new.com\"}        # v2 — v1 eventually removed by compaction\n\n# Delete user 42 — send a tombstone (null value)\n42:null",
    "bestPractice": "Use log compaction for topics that represent mutable state (user profiles, account balances, configuration). Use time-based retention for immutable event streams (audit logs, click events). Never mix compaction with downstream consumers that depend on seeing every historical version of a key — compaction gives you latest-only semantics, not full history.",
    "source": "Apache Kafka Docs — Log Compaction"
  },
  {
    "id": "a01",
    "topic": "Log Segment Internals",
    "question": "Quais são os três arquivos que compõem um segmento de log do Kafka e o que cada um armazena?",
    "code": null,
    "options": [
      ".log guarda bytes da carga; .index mapeia offsets para bytes; .timeindex horários",
      ".log guarda metadados; .index grava registros binários; .timeindex o lag de nós",
      ".log guarda estado do grupo; .index IDs de produtores; .timeindex dados de réplica",
      ".log guarda lotes compactados; .index IDs de schemas; .timeindex tempos de expiração"
    ],
    "correctIndex": 0,
    "explanation": "O arquivo .log de cada segmento contém os dados brutos da mensagem; o .index oferece uma busca esparsa de offset para posição em bytes para leituras rápidas; o .timeindex permite buscas de offset baseadas em tempo para consumo com viagem no tempo.",
    "compiledJS": "# Inspect log segment files on a Kafka broker\nls -la /var/kafka-logs/orders-0/\n# 00000000000000000000.index\n# 00000000000000000000.log\n# 00000000000000000000.timeindex\n# 00000000000001048576.index    <- next segment starts at offset 1,048,576\n# 00000000000001048576.log\n# 00000000000001048576.timeindex\n# leader-epoch-checkpoint\n\n# Dump the .log file in human-readable format\nkafka-dump-log.sh \\\n  --files /var/kafka-logs/orders-0/00000000000000000000.log \\\n  --print-data-log\n# Output: offset: 0 ... key: null value: {\"orderId\": \"abc\"}\n\n# Read from a specific timestamp (uses .timeindex internally)\nkafka-console-consumer.sh \\\n  --topic orders --bootstrap-server localhost:9092 \\\n  --offset 1048576 --partition 0",
    "bestPractice": "Tune log.segment.bytes (default 1 GB) and log.segment.ms (default 7 days) to balance segment count against recovery time. Smaller segments mean more files (higher inode pressure) but faster log compaction and faster retention cleanup. Monitor kafka_log_log_size and kafka_log_log_start_offset_delta in Prometheus; set up disk usage alerts well in advance of filling the broker disk, as a full Kafka disk is an immediate availability incident.",
    "source": "Apache Kafka Docs — Log Segments; Confluent Blog — Kafka Storage Internals"
  },
  {
    "id": "a02",
    "topic": "Hot Partitions",
    "question": "O que é uma partição quente (hot partition) no Kafka e como o particionamento baseado em chaves a provoca?",
    "code": null,
    "options": [
      "Uma partição com réplicas demais; o hash distribui cópias de forma desigual",
      "Uma partição sobrecarregada porque uma chave frequente faz hash para ela",
      "Uma partição desconectada; o algoritmo de hash a ignora até o nó retornar",
      "Uma partição compactada; a distribuição round-robin evita essa compactação"
    ],
    "correctIndex": 1,
    "explanation": "Quando um pequeno número de chaves concentra a maior parte do tráfego, essas chaves sempre são roteadas para a mesma partição, gerando uma carga desbalanceada capaz de saturar um broker individual e seu consumidor.",
    "compiledJS": "// Custom partitioner to detect and re-route hot keys\nconst { Partitioners } = require('kafkajs')\n\nfunction hotKeyAwarePartitioner({ topic, partitionMetadata, message }) {\n  const numPartitions = partitionMetadata.length\n  const key = message.key?.toString()\n\n  // Known hot keys get spread across a dedicated partition range\n  const HOT_KEYS = new Set(['user-viral-123', 'tenant-mega-corp'])\n  if (key && HOT_KEYS.has(key)) {\n    // Hash into the upper half of partitions to spread hot-key load\n    const slot = Math.abs(hashFnv32a(key + Date.now().toString()))\n    return (Math.floor(numPartitions / 2) + (slot % Math.floor(numPartitions / 2)))\n  }\n  // Normal key-based routing for the rest\n  return Partitioners.DefaultPartitioner()({ topic, partitionMetadata, message })\n}",
    "bestPractice": "Detect hot partitions via kafka_topic_partition_messages_in_per_sec per partition in Grafana — a partition receiving 10× the median is a hot partition. Mitigations: (1) add a random salt suffix to the hot key to spread it across multiple partitions (trading ordering for load balance), (2) pre-partition hot tenants into dedicated topics, (3) increase partition count and add a custom partitioner. Always measure partition skew before scaling consumer instances.",
    "source": "Apache Kafka Docs — Custom Partitioners; Confluent Blog — Tackling Hot Partitions"
  },
  {
    "id": "a03",
    "topic": "Back-Pressure",
    "question": "Como o back-pressure se manifesta em uma cadeia de consumidores do Kafka e qual é uma estratégia comum de mitigação?",
    "code": null,
    "options": [
      "O back-pressure surge como controle de taxa (throttling) no produtor; a mitigação consiste em aumentar o número de tópicos",
      "Aparece como consumer lag; consumidores lidam escalando instâncias ou ajustando intervalos de poll e max.poll.records",
      "O back-pressure surge como saturação de disco do broker; a mitigação é ativar a compactação de log",
      "O back-pressure surge como timeouts do ZooKeeper; a mitigação é migrar para o modo KRaft"
    ],
    "correctIndex": 1,
    "explanation": "O aumento no atraso do consumidor (lag) sinaliza back-pressure; a solução padrão é escalar consumidores até o número de partições, reparticionar para obter mais paralelismo ou reduzir o tempo de processamento por mensagem.",
    "compiledJS": "# Monitor consumer lag — the key back-pressure signal\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --describe\n# Watch LAG column — if it grows every minute, back-pressure is occurring\n\n# Prometheus query: alert when lag > 50k for > 10 minutes\n# kafka_consumer_group_lag{group=\"fulfillment-group\"} > 50000\n\n# Scale consumers: add more instances (up to partition count)\n# kubectl scale deployment fulfillment-consumer --replicas=6\n# (topic has 6 partitions — 6 consumers = max parallelism)\n\n# If consumers == partitions and lag still grows → increase partitions\nkafka-topics.sh --alter \\\n  --topic orders \\\n  --bootstrap-server localhost:9092 \\\n  --partitions 12   # double partitions, then scale consumers to 12",
    "bestPractice": "Instrument consumer lag alerting from day one: set a warning at lag > 10,000 messages and a critical alert at lag growing for more than 5 minutes. Use the lag-to-time metric (lag / messages-per-second) to estimate how far behind consumers are in real time. Pre-provision spare consumer capacity (N+1 or N+2) so that a single consumer crash does not immediately cause lag spikes in production.",
    "source": "Confluent Docs — Consumer Lag Monitoring; DDIA — Chapter 11: Stream Processing"
  },
  {
    "id": "a04",
    "topic": "Kafka Streams vs Flink vs Spark",
    "question": "Como o Kafka Streams difere do Apache Flink e do Apache Spark Structured Streaming para processamento de stream com estado (stateful)?",
    "code": null,
    "options": [
      "O Kafka Streams é um framework em lote; Flink e Spark são motores puros de streaming",
      "Kafka Streams é uma biblioteca cliente embutida, enquanto Spark e Flink exigem clusters de computação dedicados",
      "O Kafka Streams exige Kubernetes; Flink e Spark rodam apenas em bare metal",
      "O Kafka Streams não oferece suporte a operações com estado; Flink e Spark oferecem"
    ],
    "correctIndex": 1,
    "explanation": "O Kafka Streams é incorporado diretamente em uma aplicação JVM e aproveita as partições do Kafka para paralelismo, ao passo que Flink e Spark operam como clusters distribuídos separados, com APIs de processamento mais ricas e agendamento de recursos independente.",
    "compiledJS": "// Kafka Streams: word count (runs in-process, no cluster needed)\nconst { KafkaStreams } = require('kafka-streams')\nconst config = { noptions: { 'metadata.broker.list': 'localhost:9092' } }\nconst factory = new KafkaStreams(config)\nconst stream = factory.getKStream()\n\nstream\n  .from('text-input')\n  .mapJSONConvenience()\n  .map(msg => msg.word)\n  .countByKey('word-counts', 'word')\n  .to('word-counts-output')\n\nfactory.start()\n// State is stored locally in RocksDB — no Flink/Spark cluster needed\n// Scale by adding more application instances (each handles a partition subset)",
    "bestPractice": "Choose Kafka Streams for microservices that need lightweight stateful processing close to the data (aggregations, joins, enrichment) without the overhead of a separate processing cluster. Choose Flink when you need exactly-once stateful processing across multiple Kafka clusters, complex windowing over out-of-order events, or SQL-based stream analytics at scale. Avoid Spark Structured Streaming for real-time (< 1 s) requirements due to micro-batch overhead.",
    "source": "Apache Kafka Docs — Kafka Streams; Flink Docs; DDIA — Chapter 11"
  },
  {
    "id": "a05",
    "topic": "SQS FIFO Throughput and Message Groups",
    "question": "Qual é o limite de vazão de uma fila SQS FIFO e de que forma os IDs de grupo de mensagens (Message Group IDs) o influenciam?",
    "code": null,
    "options": [
      "Filas FIFO suportam vazão ilimitada; os IDs de grupo de mensagens não exercem efeito sobre a vazão",
      "Filas FIFO garantem ordem estrita e deduplicação com taxa limitada; filas Standard oferecem throughput quase ilimitado",
      "Filas FIFO suportam 10.000 mensagens/segundo; cada Group ID adiciona 1.000 mensagens/segundo de capacidade",
      "Filas FIFO suportam até 1.000 mensagens/segundo, independentemente dos Group IDs"
    ],
    "correctIndex": 1,
    "explanation": "Filas SQS FIFO processam 300 TPS (3.000 com lotes); dentro de um mesmo Group ID, a ordenação estrita serializa o processamento, de modo que distribuir o tráfego entre múltiplos Group IDs é essencial para maximizar o paralelismo.",
    "compiledJS": "# Bad: single group ID — serialised, low throughput\naws sqs send-message \\\n  --queue-url https://sqs.us-east-1.amazonaws.com/123/payments.fifo \\\n  --message-body '{\"amount\":100}' \\\n  --message-group-id \"ALL_PAYMENTS\"  # ← bottleneck!\n\n# Good: per-user group IDs — parallel, high throughput\nfor USER_ID in user-1 user-2 user-3 user-4 user-5; do\n  aws sqs send-message \\\n    --queue-url https://sqs.us-east-1.amazonaws.com/123/payments.fifo \\\n    --message-body \"{\"userId\":\"$USER_ID\",\"amount\":100}\" \\\n    --message-group-id \"$USER_ID\"     # ← each user's messages ordered\ndone\n# 5 groups → up to 5 consumers processing in parallel\n# Ordering preserved per user, not globally",
    "bestPractice": "Design MessageGroupId as a business entity key (userId, orderId, accountId) rather than a constant. This gives you per-entity ordering (the actual business requirement) while enabling full parallelism across entities. Monitor the SQS console for any single MessageGroupId that dominates the queue depth — that is your throughput bottleneck.",
    "source": "AWS Docs — SQS FIFO Queues: Throughput and Limits"
  },
  {
    "id": "a06",
    "topic": "Schema Registry",
    "question": "Por que um schema registry é importante ao usar Avro ou Protobuf com Kafka, e qual problema ele soluciona?",
    "code": null,
    "options": [
      "Um schema registry criptografa mensagens em trânsito; sem ele, payloads Avro são enviados em texto simples",
      "Centraliza esquemas para produtores e consumidores validarem contratos de forma desacoplada e checarem compatibilidade",
      "Um schema registry é um plugin de broker do Kafka que valida limites de tamanho de mensagem",
      "Um schema registry substitui o ZooKeeper no gerenciamento de metadados de cluster em versões recentes do Kafka"
    ],
    "correctIndex": 1,
    "explanation": "Incluir apenas o ID do esquema em vez do esquema completo em cada mensagem reduz drasticamente o tamanho do payload, enquanto o registry impõe regras de compatibilidade para evitar que mudanças quebrem consumidores existentes.",
    "compiledJS": "// Producer: register and use schema\nconst { SchemaRegistry } = require('@kafkajs/confluent-schema-registry')\nconst registry = new SchemaRegistry({ host: 'http://schema-registry:8081' })\n\nconst schemaId = await registry.register({\n  type: 'AVRO',\n  schema: JSON.stringify({\n    type: 'record',\n    name: 'Order',\n    fields: [\n      { name: 'orderId', type: 'string' },\n      { name: 'total',   type: 'double' },\n      { name: 'status',  type: ['null', 'string'], default: null },  // optional field\n    ],\n  }),\n  // Compatibility: BACKWARD — new schema can read old data\n}, { compatibility: 'BACKWARD' })\n\nconst encoded = await registry.encode(schemaId, { orderId: 'abc', total: 99.0 })\n// Wire format: [magic byte 0x00][4-byte schema ID][avro bytes]\n// Consumer fetches schema by ID — no schema in every message",
    "bestPractice": "Enforce BACKWARD compatibility as the default: new schema must be able to read messages produced with the previous schema. Add new fields with defaults (never remove required fields). Run schema validation in CI — use the Schema Registry REST API compatibility check endpoint before merging producer changes. This prevents the most common breaking change: a consumer deployed before the producer update fails to deserialise new messages.",
    "source": "Confluent Docs — Schema Registry; Apache Avro Docs — Schema Resolution"
  },
  {
    "id": "a07",
    "topic": "Consumer Lag Monitoring",
    "question": "Quais métricas e ferramentas são habitualmente utilizadas para monitorar o atraso do consumidor (consumer lag) do Kafka em produção?",
    "code": null,
    "options": [
      "O consumer lag só pode ser monitorado por meio do painel de interface web integrado do Kafka",
      "Monitorar o lag via métricas de consumer groups ou Prometheus; escalar consumidores até o limite de partições se o lag subir",
      "O consumer lag só é visível no AWS CloudWatch quando se utiliza o Amazon MSK",
      "O consumer lag é rastreado por meio da leitura do tópico __consumer_offsets diretamente pelo código da aplicação"
    ],
    "correctIndex": 1,
    "explanation": "A CLI kafka-consumer-groups.sh oferece uma visão pontual, enquanto métricas JMX exportadas via Prometheus e visualizadas no Grafana fornecem alertas contínuos sobre tendências de atraso em produção.",
    "compiledJS": "# CLI: point-in-time lag snapshot\nkafka-consumer-groups.sh \\\n  --bootstrap-server localhost:9092 \\\n  --group fulfillment-group \\\n  --describe\n\n# Prometheus scrape config (kafka-exporter)\n# prometheus.yml:\n# scrape_configs:\n#   - job_name: kafka\n#     static_configs:\n#       - targets: ['kafka-exporter:9308']\n\n# Grafana alert rule (PromQL):\n# ALERT KafkaConsumerLagHigh\n# IF max(kafka_consumergroup_lag{consumergroup=\"fulfillment-group\"}) > 10000\n# FOR 5m\n# LABELS { severity=\"critical\" }\n\n# AWS MSK CloudWatch metric\naws cloudwatch get-metric-statistics \\\n  --namespace AWS/Kafka \\\n  --metric-name EstimatedTimeLag \\\n  --dimensions Name=ConsumerGroup,Value=fulfillment-group \\\n  --period 60 --statistics Average \\\n  --start-time 2024-01-01T00:00:00Z --end-time 2024-01-01T01:00:00Z",
    "bestPractice": "Track both records-lag (message count) and time-lag (seconds behind) — a large record lag on a low-velocity topic may only be seconds of delay, while a small lag on a high-velocity topic may represent critical processing backlog. Set paged alerts on time-lag > 60 seconds for payment or order-processing consumers; use records-lag for capacity planning dashboards.",
    "source": "Confluent Docs — Monitoring Kafka; AWS Docs — MSK Monitoring Metrics"
  },
  {
    "id": "a08",
    "topic": "Transactional Outbox Pattern",
    "question": "O que é o padrão Transactional Outbox e como ele resolve problemas de gravação dupla (dual-write) entre um banco de dados e um broker de mensageria?",
    "code": null,
    "options": [
      "O padrão outbox armazena mensagens em uma fila SQS FIFO antes de gravar no banco de dados, garantindo que o banco só atualize se a fila aceitar a mensagem",
      "Gravar o estado de negócio e o evento em uma única transação no banco, enviando-os depois de forma assíncrona ao Kafka",
      "O padrão outbox utiliza confirmação em duas fases (two-phase commit) entre o banco de dados e o broker Kafka para garantir gravações simultâneas",
      "O padrão outbox armazena mensagens na memória da aplicação e as envia ao Kafka após a transação do banco de dados ser confirmada"
    ],
    "correctIndex": 1,
    "explanation": "Ao gravar o evento em uma tabela outbox dentro da mesma transação ACID dos dados de negócio, o padrão elimina o risco de comitar no banco e falhar na publicação, com o processo de relay garantindo entrega at-least-once ao broker.",
    "compiledJS": "-- Transactional outbox: one DB transaction, no distributed 2PC\nBEGIN;\n\n-- 1. Update business state\nUPDATE orders SET status = 'CONFIRMED' WHERE id = 'order-123';\n\n-- 2. Insert event into outbox (same transaction)\nINSERT INTO outbox_events (id, aggregate_type, aggregate_id, event_type, payload, created_at)\nVALUES (\n  gen_random_uuid(),\n  'ORDER',\n  'order-123',\n  'ORDER_CONFIRMED',\n  '{\"orderId\":\"order-123\",\"total\":99.0}'::jsonb,\n  NOW()\n);\n\nCOMMIT;\n-- If COMMIT fails, both writes roll back — no orphaned event\n\n-- Relay process (Debezium CDC reads WAL and publishes to Kafka)\n-- No polling needed — Debezium streams the outbox table changes\n-- to kafka topic: outbox.event.ORDER",
    "bestPractice": "Use Debezium with the Outbox Event Router SMT for the relay — it reads PostgreSQL WAL via CDC and routes outbox records directly to Kafka topics without polling the database table. This is more efficient than a polling loop and scales to high-insert-rate scenarios. Mark outbox records as published (or delete them) after Debezium confirms delivery to avoid unbounded table growth.",
    "source": "microservices.io — Transactional Outbox Pattern; Debezium Docs — Outbox Event Router"
  },
  {
    "id": "a09",
    "topic": "Kafka Connect",
    "question": "O que é o Kafka Connect e quais são seus dois tipos principais de conectores?",
    "code": null,
    "options": [
      "O Kafka Connect é uma biblioteca cliente para construir grupos customizados de consumidores; seus dois tipos são conectores de polling e push",
      "Um framework integrado para conectar o Kafka a bancos e storages usando conectores declarativos Source e Sink",
      "O Kafka Connect é uma ferramenta de monitoramento; seus tipos de conectores são para métricas e para logs",
      "O Kafka Connect é uma extensão do schema registry; seus tipos são conectores Avro e conectores Protobuf"
    ],
    "correctIndex": 1,
    "explanation": "O Kafka Connect oferece um framework de pipeline escalável e tolerante a falhas: conectores Source extraem dados de bancos, arquivos ou APIs para tópicos do Kafka, enquanto conectores Sink enviam dados de tópicos para data warehouses, mecanismos de busca ou sistemas de armazenamento.",
    "compiledJS": "# Deploy a JDBC Source connector (polls Postgres, pushes to Kafka)\ncurl -X POST http://localhost:8083/connectors \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"name\": \"postgres-source\",\n    \"config\": {\n      \"connector.class\": \"io.confluent.connect.jdbc.JdbcSourceConnector\",\n      \"connection.url\": \"jdbc:postgresql://db:5432/mydb\",\n      \"connection.user\": \"kafka_user\",\n      \"connection.password\": \"secret\",\n      \"table.whitelist\": \"orders,customers\",\n      \"mode\": \"timestamp+incrementing\",\n      \"timestamp.column.name\": \"updated_at\",\n      \"incrementing.column.name\": \"id\",\n      \"topic.prefix\": \"postgres.\"\n    }\n  }'\n\n# Deploy an S3 Sink connector (Kafka → S3 for analytics)\ncurl -X POST http://localhost:8083/connectors \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"name\": \"s3-sink\",\n    \"config\": {\n      \"connector.class\": \"io.confluent.connect.s3.S3SinkConnector\",\n      \"tasks.max\": \"3\",\n      \"topics\": \"orders\",\n      \"s3.region\": \"us-east-1\",\n      \"s3.bucket.name\": \"my-kafka-data\",\n      \"storage.class\": \"io.confluent.connect.s3.storage.S3Storage\",\n      \"format.class\": \"io.confluent.connect.s3.format.parquet.ParquetFormat\",\n      \"flush.size\": \"1000\"\n    }\n  }'",
    "bestPractice": "Prefer Kafka Connect over custom producer/consumer code for standard data pipeline tasks — the connector ecosystem has hundreds of pre-built, battle-tested connectors. Run Connect workers in distributed mode (not standalone) in production for automatic fault recovery. Use Debezium as your Source connector for database change data capture — it reads the WAL directly and is far more reliable and low-overhead than polling.",
    "source": "Apache Kafka Docs — Kafka Connect; Debezium Docs"
  },
  {
    "id": "a10",
    "topic": "Cross-Region Replication",
    "question": "Como a replicação entre regiões difere entre o fan-out baseado em SQS e o Kafka MirrorMaker 2?",
    "code": null,
    "options": [
      "O fan-out do SQS e o MirrorMaker 2 são funcionalmente idênticos; a escolha depende exclusivamente do custo",
      "SNS faz fan-out direto para múltiplas filas SQS regionais, enquanto o Kafka usa MirrorMaker 2 para replicação entre clusters",
      "O fan-out do SQS replica mensagens usando o Kafka Connect; o MirrorMaker 2 usa o AWS DataSync",
      "O MirrorMaker 2 funciona apenas com semântica exactly-once; o fan-out do SQS funciona apenas com semântica at-most-once"
    ],
    "correctIndex": 1,
    "explanation": "A replicação entre regiões com SQS normalmente adota o fan-out multirregional do SNS para padrões simples de push, enquanto o MirrorMaker 2 é uma ferramenta dedicada de replicação do Kafka que também espelha offsets, viabilizando o failover transparente de consumidores entre clusters.",
    "compiledJS": "# MirrorMaker 2 config: us-east-1 → eu-west-1 (active-passive DR)\n# mm2.properties\nclusters = us-east, eu-west\nus-east.bootstrap.servers = broker1.us-east:9092,broker2.us-east:9092\neu-west.bootstrap.servers = broker1.eu-west:9092,broker2.eu-west:9092\n\nus-east->eu-west.enabled = true\nus-east->eu-west.topics = .*             # replicate all topics\nus-east->eu-west.groups = .*             # replicate all consumer offsets\n\n# Topic prefix in destination: us-east.orders (preserves source identity)\nreplication.factor = 3\nemit.checkpoints.interval.seconds = 60  # offset sync frequency\n\n# Start MM2\nconnect-mirror-maker.sh mm2.properties\n\n# SNS → SQS multi-region fan-out (managed, no MM2 needed)\naws sns subscribe --topic-arn $SNS_ARN_US_EAST \\\n  --protocol sqs --notification-endpoint $SQS_ARN_EU_WEST\n# SNS delivers to both regions on every publish",
    "bestPractice": "For Kafka DR, use MirrorMaker 2 with checkpoints enabled so consumer group offsets are replicated — without this, failing over to the DR cluster causes consumers to reprocess from the beginning or skip messages depending on auto.offset.reset. For SQS-based systems, use the SNS→SQS multi-region fan-out pattern and ensure your DLQs exist in both regions. Test failover quarterly; a DR topology you have never exercised is not a DR topology.",
    "source": "Apache Kafka Docs — MirrorMaker 2; AWS Docs — SNS Cross-Region Delivery"
  }
]
