import type { InterviewQuestion } from '@/lib/interviewTypes'

export const RABBITMQ_CONCEPTS_QUESTIONS_PT: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "AMQP Broker",
    "question": "O que é o RabbitMQ?",
    "code": null,
    "options": [
      "Um sistema de gerenciamento de banco de dados relacional",
      "Um message broker AMQP de código aberto",
      "Um gateway de API REST",
      "Um armazenamento chave-valor distribuído"
    ],
    "correctIndex": 1,
    "explanation": "O RabbitMQ é um message broker de código aberto que implementa o protocolo AMQP (Advanced Message Queuing Protocol), permitindo que aplicações se comuniquem por meio do envio e recebimento de mensagens.",
    "compiledJS": "# Management CLI — verify broker identity\nrabbitmqctl status\n# => Node: rabbit@hostname\n# => RabbitMQ 3.12.x, Erlang 26.x\n# => Protocols: amqp/0-9-1, amqp/1.0, mqtt, stomp\n\n# Enable management UI on port 15672\nrabbitmq-plugins enable rabbitmq_management",
    "bestPractice": "Always pin RabbitMQ to a specific minor version in your container image and test upgrades in staging first. Use Docker Hubs official image with a digest tag rather than \"latest\" to avoid unintended upgrades. Run the management plugin on every node so you have a ready-to-use dashboard without extra tooling.",
    "source": "RabbitMQ Docs — Introduction"
  },
  {
    "id": "b02",
    "topic": "Exchange→Queue→Consumer",
    "question": "Em um fluxo de mensagens típico do RabbitMQ, qual é a ordem correta dos componentes?",
    "code": null,
    "options": [
      "Consumidor → Fila → Exchange → Produtor",
      "Produtor → Fila → Exchange → Consumidor",
      "Produtor → Exchange → Fila → Consumidor",
      "Exchange → Produtor → Fila → Consumidor"
    ],
    "correctIndex": 2,
    "explanation": "As mensagens fluem do Produtor para a Exchange, a Exchange as roteia para uma ou mais Filas através de bindings (ligações), e os Consumidores leem as mensagens dessas Filas.",
    "compiledJS": "# Trace message flow in the management CLI\nrabbitmqctl trace_on          # enable tracing\n# Messages appear in amq.rabbitmq.trace exchange:\n# routing key pattern: publish.<exchange> and deliver.<queue>\n\n# Example: after publishing to \"orders\" exchange with key \"new\"\n# Trace log line:\n# publish.orders  routing-key=new  payload=<bytes>\n# deliver.orders.created  consumer-tag=ctag1  payload=<bytes>",
    "bestPractice": "Keep producers ignorant of queue names — they should only know the exchange name and routing key. This separation lets you add or remove consumers and queues without touching producer code. Document your exchange/routing-key contracts in a central schema registry so teams do not break each other accidentally.",
    "source": "RabbitMQ Docs — AMQP 0-9-1 Model"
  },
  {
    "id": "b03",
    "topic": "Bindings",
    "question": "O que é uma binding (ligação) no RabbitMQ?",
    "code": null,
    "options": [
      "Uma conexão TCP entre dois brokers",
      "Uma regra que vincula uma exchange a uma fila (ou a outra exchange)",
      "A credencial de autenticação utilizada por um produtor",
      "Uma referência nomeada para um virtual host"
    ],
    "correctIndex": 1,
    "explanation": "Uma binding é uma relação entre uma exchange e uma fila que informa à exchange quais filas devem receber mensagens correspondentes aos critérios da ligação.",
    "compiledJS": "# Declare a binding via management HTTP API\ncurl -u guest:guest -X POST \\\n  http://localhost:15672/api/bindings/%2F/e/my.exchange/q/my.queue \\\n  -H \"content-type: application/json\" \\\n  -d '{\"routing_key\": \"order.created\", \"arguments\": {}}'\n\n# List all bindings for a queue\ncurl -u guest:guest \\\n  http://localhost:15672/api/queues/%2F/my.queue/bindings",
    "bestPractice": "Treat bindings as part of your infrastructure-as-code — store them in Terraform (rabbitmq provider) or Ansible rather than creating them manually. Include routing-key patterns in your service documentation so other teams know how to bind to shared exchanges. Prefer specific routing keys over wildcard-heavy patterns to keep routing logic easy to reason about.",
    "source": "RabbitMQ Docs — Bindings"
  },
  {
    "id": "b04",
    "topic": "Default Exchange",
    "question": "Qual é a exchange padrão (default exchange) no RabbitMQ?",
    "code": null,
    "options": [
      "Uma exchange fanout chamada 'default'",
      "Uma exchange direct pré-declarada com nome de string vazia",
      "Uma exchange topic chamada 'amq.default'",
      "Uma exchange headers que precisa ser declarada antes do uso"
    ],
    "correctIndex": 1,
    "explanation": "A exchange padrão é uma direct exchange com nome de string vazia; toda fila é automaticamente vinculada a ela utilizando o próprio nome da fila como chave de roteamento (routing key).",
    "compiledJS": "# Publish directly to a queue via the default exchange\n# (routing_key == queue name, exchange == \"\")\nrabbitmqadmin publish \\\n  exchange=\"\" \\\n  routing_key=\"my.queue\" \\\n  payload=\"hello world\"\n\n# Equivalent Python (pika)\nchannel.basic_publish(\n    exchange=\"\",        # default exchange\n    routing_key=\"my.queue\",\n    body=b\"hello world\"\n)",
    "bestPractice": "Avoid the default exchange in production service-to-service messaging. Explicit named exchanges make routing intent clear, allow you to change destination queues without changing producer code, and make tracing/debugging easier. Reserve the default exchange for quick scripts, local testing, or CLI tools.",
    "source": "RabbitMQ Docs — AMQP 0-9-1 Model — Default Exchange"
  },
  {
    "id": "b05",
    "topic": "Durable Queues",
    "question": "Qual é a diferença entre uma fila durável (durable) e uma fila transitória (transient)?",
    "code": null,
    "options": [
      "Filas duráveis sobrevivem a reinicializações do broker; filas transitórias não",
      "Filas duráveis são mais rápidas; filas transitórias são mais lentas",
      "Filas duráveis comportam mais mensagens do que filas transitórias",
      "Filas duráveis exigem autenticação; filas transitórias não"
    ],
    "correctIndex": 0,
    "explanation": "Marcar uma fila como durável faz com que o RabbitMQ persista sua definição em disco para sobreviver a reinicializações do broker, ao passo que uma fila transitória (não durável) é perdida ao reiniciar.",
    "compiledJS": "# Declare a durable queue via HTTP API\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/orders \\\n  -H \"content-type: application/json\" \\\n  -d '{\"durable\": true, \"arguments\": {}}'\n\n# Verify durability in rabbitmqctl\nrabbitmqctl list_queues name durable\n# orders   true\n# tmp.q    false",
    "bestPractice": "Always declare queues as durable in production. Pair durable queues with persistent message delivery mode (delivery_mode=2) so that both the queue definition and message content survive restarts. Keep non-durable queues only for truly ephemeral use cases such as exclusive reply queues in the RPC pattern.",
    "source": "RabbitMQ Docs — Queues — Durability"
  },
  {
    "id": "b06",
    "topic": "Ack / Nack",
    "question": "O que um consumidor envia ao RabbitMQ para confirmar que processou uma mensagem com sucesso?",
    "code": null,
    "options": [
      "Um NACK",
      "Um REJECT",
      "Um ACK (acknowledgement)",
      "Um CONFIRM"
    ],
    "correctIndex": 2,
    "explanation": "Um ACK (basic.ack) avisa ao RabbitMQ que a mensagem foi processada com sucesso e pode ser removida da fila.",
    "compiledJS": "# Monitor unacknowledged messages per queue\nrabbitmqctl list_queues name messages_ready messages_unacknowledged\n# orders   0    3\n# → 3 messages delivered but not yet ACKed\n\n# If a consumer crashes, unacked messages requeue:\n# messages_unacknowledged drops back to 0\n# messages_ready rises by 3",
    "bestPractice": "Always use manual acknowledgements in production (auto_ack=False). ACK only after your processing is confirmed complete — e.g., after a database write commits. Use channel-level prefetch (basic.qos) alongside manual acks to prevent a single consumer from hoarding hundreds of unprocessed messages. Never ACK inside a try block without ensuring the message is truly handled on error paths.",
    "source": "RabbitMQ Docs — Consumer Acknowledgements"
  },
  {
    "id": "b07",
    "topic": "Ack / Nack",
    "question": "Qual é a diferença entre uma fila durável (durable) e uma fila transitória (transient)?",
    "code": null,
    "options": [
      "Filas duráveis sobrevivem a reinicializações do broker; filas transitórias não",
      "Filas duráveis sobrevivem a reinicializações do broker; filas transitórias não",
      "Filas duráveis sobrevivem a reinicializações do broker; filas transitórias não",
      "Filas duráveis sobrevivem a reinicializações do broker; filas transitórias não"
    ],
    "correctIndex": 0,
    "explanation": "Marcar uma fila como durável faz com que o RabbitMQ persista sua definição em disco para sobreviver a reinicializações do broker, ao passo que uma fila transitória (não durável) é perdida ao reiniciar.",
    "compiledJS": "# AMQP 0-9-1 frame comparison\n# basic.reject — single message\n# method: basic.reject\n#   delivery-tag: 42\n#   requeue: false   → dead-letter or discard\n\n# basic.nack — multiple messages (RabbitMQ extension)\n# method: basic.nack\n#   delivery-tag: 42\n#   multiple: true   → reject tags 1..42\n#   requeue: true    → redeliver all to ready consumers",
    "bestPractice": "Use basic.nack with multiple=true to bulk-reject messages when your consumer detects a poison-pill batch or a downstream service is unavailable. Combine with a DLX so rejected messages land in a dead-letter queue rather than being silently dropped. Avoid requeue=true in a tight loop — pair it with a backoff or a DLX with TTL to prevent storm requeuing.",
    "source": "RabbitMQ Docs — Consumer Acknowledgements — NACK"
  },
  {
    "id": "b08",
    "topic": "Management UI",
    "question": "Qual plugin nativo do RabbitMQ fornece um painel de gerenciamento e monitoramento no navegador?",
    "code": null,
    "options": [
      "rabbitmq_shovel",
      "rabbitmq_management",
      "rabbitmq_federation",
      "rabbitmq_stomp"
    ],
    "correctIndex": 1,
    "explanation": "O plugin rabbitmq_management disponibiliza uma API baseada em HTTP e uma interface no navegador para gerenciar e monitorar nós, filas, exchanges e bindings do RabbitMQ.",
    "compiledJS": "# Enable management plugin\nrabbitmq-plugins enable rabbitmq_management\n\n# Check its status\nrabbitmq-plugins list | grep management\n# [E*] rabbitmq_management       3.12.x\n# [E*] rabbitmq_management_agent 3.12.x\n\n# Default credentials (change immediately in prod!)\n# http://localhost:15672  guest / guest\n# guest is only allowed from localhost by default",
    "bestPractice": "Never leave the default guest/guest credentials in place on any non-localhost-bound interface. Create per-operator user accounts with the minimum required tags (monitoring, management, or administrator). Expose the management port only on an internal network interface or behind an authenticating reverse proxy. For production alerting, consume the /api/queues endpoint with Prometheus rather than polling the UI.",
    "source": "RabbitMQ Docs — Management Plugin"
  },
  {
    "id": "b09",
    "topic": "Prefetch Count",
    "question": "O que a configuração de prefetch count (basic.qos) controla no RabbitMQ?",
    "code": null,
    "options": [
      "O número máximo de filas que um canal pode assinar",
      "O número máximo de mensagens não confirmadas entregues a um consumidor por vez",
      "O tamanho máximo da mensagem em bytes",
      "O número máximo de conexões por virtual host"
    ],
    "correctIndex": 1,
    "explanation": "O prefetch count do basic.qos limita quantas mensagens sem confirmação podem permanecer em trânsito em um canal, oferecendo controle de fluxo e evitando a sobrecarga dos consumidores.",
    "compiledJS": "# View per-consumer prefetch in management\ncurl -u guest:guest \\\n  \"http://localhost:15672/api/consumers/%2F\" \\\n  | jq '.[].prefetch_count'\n# 10\n# 10\n# → both consumers have prefetch=10\n\n# List channels with unacked counts\nrabbitmqctl list_channels\n#  prefetch_count  messages_unacknowledged\n#  10              7",
    "bestPractice": "Set prefetch to 1 only if each message requires unpredictable time to process and fairness across consumers is critical. For throughput-optimised pipelines, experiment with prefetch values of 10–100 and benchmark. Never leave prefetch at 0 (unlimited) in production — it causes one fast consumer to absorb the entire queue depth before others can receive any messages.",
    "source": "RabbitMQ Docs — Consumer Prefetch"
  },
  {
    "id": "b10",
    "topic": "RabbitMQ vs DB",
    "question": "Por que o RabbitMQ geralmente é preferido em relação a um banco de dados relacional para fluxos de fila de tarefas?",
    "code": null,
    "options": [
      "O RabbitMQ armazena mensagens em tabelas SQL facilitando consultas",
      "O RabbitMQ oferece entrega nativa por push, confirmações e back-pressure sem polling",
      "Um banco de dados não consegue persistir dados após reinicializações",
      "O RabbitMQ gera esquemas SQL automaticamente para metadados de tarefas"
    ],
    "correctIndex": 1,
    "explanation": "Um message broker como o RabbitMQ entrega mensagens via push, gerencia confirmações e novas tentativas de forma nativa e suporta back-pressure, eliminando a necessidade de loops custosos de polling no banco de dados.",
    "compiledJS": null,
    "bestPractice": "Use a message broker for asynchronous task dispatch and a database for business state. If you need exactly-once guarantees or durable workflow state, consider the transactional outbox pattern: write to both DB and a staging table in one transaction, then have a relay process forward staged events to RabbitMQ. This avoids dual-write inconsistency without sacrificing the broker's push-delivery benefits.",
    "source": "RabbitMQ Docs — Use Cases"
  },
  {
    "id": "i01",
    "topic": "Direct Exchange",
    "question": "Como uma exchange direct roteia mensagens?",
    "code": null,
    "options": [
      "Ela transmite a mensagem para todas as filas vinculadas, independentemente da routing key",
      "Ela roteia a mensagem para filas cuja binding key corresponda exatamente à routing key da mensagem",
      "Ela utiliza atributos do cabeçalho da mensagem para decidir o roteamento",
      "Ela roteia com base em padrões de caracteres coringa na binding key"
    ],
    "correctIndex": 1,
    "explanation": "Uma direct exchange realiza uma comparação exata de strings entre a routing key da mensagem e a binding key de cada fila, entregando apenas para as filas que coincidem.",
    "compiledJS": "# Declare exchange, queues, and bindings\nrabbitmqadmin declare exchange name=events type=direct durable=true\nrabbitmqadmin declare queue name=events.orders durable=true\nrabbitmqadmin declare binding \\\n  source=events destination=events.orders routing_key=order.created\n\n# Publish — will reach events.orders\nrabbitmqadmin publish exchange=events routing_key=order.created payload=\"{...}\"\n\n# Publish — will NOT match — message dropped\nrabbitmqadmin publish exchange=events routing_key=order.updated payload=\"{...}\"",
    "bestPractice": "Use direct exchanges for precise event dispatch where each event type goes to exactly one consumer group. Define routing keys as dot-separated namespaced strings (e.g., order.created, payment.failed) and document them in a contract file checked into your repo. When you need multiple teams to consume the same event, bind multiple queues with the same key rather than switching to fanout, so you preserve per-consumer independence.",
    "source": "RabbitMQ Docs — Exchange Types — Direct"
  },
  {
    "id": "i02",
    "topic": "Fanout Exchange",
    "question": "Qual é o comportamento definidor de uma exchange fanout?",
    "code": null,
    "options": [
      "Ela roteia mensagens apenas para filas cuja binding key corresponda à routing key",
      "Ela transmite toda mensagem para todas as filas vinculadas, ignorando completamente a routing key",
      "Ela roteia mensagens usando padrões coringa (* e #)",
      "Ela envia mensagens apenas para filas no mesmo nó"
    ],
    "correctIndex": 1,
    "explanation": "Uma fanout exchange copia e entrega todas as mensagens recebidas para todas as filas vinculadas a ela, tornando-a perfeita para cenários de broadcast ou pub/sub.",
    "compiledJS": "# Declare fanout exchange and two subscriber queues\nrabbitmqadmin declare exchange name=notifications type=fanout durable=true\nrabbitmqadmin declare queue name=notif.email durable=true\nrabbitmqadmin declare queue name=notif.sms durable=true\nrabbitmqadmin declare binding source=notifications destination=notif.email\nrabbitmqadmin declare binding source=notifications destination=notif.sms\n\n# Publish once — both queues receive the message\nrabbitmqadmin publish exchange=notifications routing_key=\"\" payload=\"user.signup\"\n# notif.email: messages_ready=1\n# notif.sms:   messages_ready=1",
    "bestPractice": "Use fanout for true broadcast scenarios where every subscriber must receive every message regardless of content. Give each subscriber service its own exclusive queue bound to the fanout exchange so consumer failures are isolated — if the SMS service crashes, the email service is unaffected. For selective broadcast (only some subscribers want some events), use topic exchange instead.",
    "source": "RabbitMQ Docs — Exchange Types — Fanout"
  },
  {
    "id": "i03",
    "topic": "Topic Exchange",
    "question": "Na binding key de uma topic exchange, o que o caractere coringa '#' casa?",
    "code": null,
    "options": [
      "Exatamente uma palavra separada por ponto",
      "Qualquer caractere individual",
      "Zero ou mais palavras separadas por ponto",
      "Apenas caracteres numéricos"
    ],
    "correctIndex": 2,
    "explanation": "Em uma topic exchange, '#' corresponde a zero ou mais palavras delimitadas por ponto, ao passo que '*' corresponde a exatamente uma palavra, viabilizando hierarquias de roteamento flexíveis.",
    "compiledJS": "# Topic exchange routing key examples\n# Binding key        Matches                        Does NOT match\n# order.#            order.created                  payment.created\n#                    order.payment.failed\n#                    order  (zero trailing words)\n# order.*            order.created                  order.payment.failed\n#                    order.deleted\n# *.created          order.created                  order.payment.created\n#                    payment.created\n\n# Declare and bind\nrabbitmqadmin declare exchange name=events type=topic durable=true\nrabbitmqadmin declare queue name=all.order.events durable=true\nrabbitmqadmin declare binding source=events \\\n  destination=all.order.events routing_key=\"order.#\"",
    "bestPractice": "Design routing key hierarchies in decreasing specificity (e.g., domain.entity.action) so subscribers can use wildcard prefixes naturally. Avoid overly broad patterns like \"#\" on a shared topic exchange — they behave like a fanout and can overwhelm consumers not designed for high volume. Document all routing key patterns in a single schema file and enforce them with a CI check to prevent undocumented events from silently going undelivered.",
    "source": "RabbitMQ Docs — Exchange Types — Topic"
  },
  {
    "id": "i04",
    "topic": "Headers Exchange",
    "question": "Como uma headers exchange decide quais filas recebem uma mensagem?",
    "code": null,
    "options": [
      "Ela compara a routing key da mensagem com coringas presentes na binding key",
      "Ela ignora completamente as routing keys e roteia com base em atributos do cabeçalho da mensagem que correspondam aos argumentos da binding",
      "Ela distribui as mensagens em round-robin entre todas as filas vinculadas",
      "Ela roteia com base no tipo de conteúdo (content-type) do corpo da mensagem"
    ],
    "correctIndex": 1,
    "explanation": "Uma headers exchange utiliza o argumento de binding x-match ('all' ou 'any') para comparar os cabeçalhos da mensagem com os argumentos da tabela de binding, ignorando inteiramente a routing key.",
    "compiledJS": "# Binding a queue to a headers exchange\n# x-match=all: message must have BOTH headers\ncurl -u guest:guest -X POST \\\n  http://localhost:15672/api/bindings/%2F/e/reports/q/pdf.reports \\\n  -H \"content-type: application/json\" \\\n  -d '{\n    \"arguments\": {\n      \"x-match\": \"all\",\n      \"format\": \"pdf\",\n      \"region\": \"eu\"\n    }\n  }'\n\n# Only messages with headers {format:pdf, region:eu} reach pdf.reports\n# x-match=any would route on format=pdf OR region=eu",
    "bestPractice": "Headers exchanges are powerful but harder to debug than direct/topic exchanges because the routing criteria are buried in binding arguments rather than visible routing keys. Prefer them only when routing criteria are truly multi-dimensional and cannot be conveniently encoded in a routing key. When you do use them, log the full header set on every published message and add management-UI dashboards showing binding arguments for quick troubleshooting.",
    "source": "RabbitMQ Docs — Exchange Types — Headers"
  },
  {
    "id": "i05",
    "topic": "Routing vs Binding Key",
    "question": "Qual é a diferença conceitual entre uma routing key e uma binding key no RabbitMQ?",
    "code": null,
    "options": [
      "São termos sinônimos que representam o mesmo parâmetro enviado pelo produtor",
      "Routing key é definida na mensagem; binding key é definida na ligação da fila",
      "Binding key é publicada no payload; routing key é configurada no consumidor",
      "Routing keys operam em direct exchanges; binding keys apenas em fanout exchanges"
    ],
    "correctIndex": 1,
    "explanation": "Produtores etiquetam cada mensagem publicada com uma routing key; separadamente, o código ou o administrador define uma binding key ao vincular uma fila a uma exchange, e a exchange as compara para decidir a entrega.",
    "compiledJS": "# AMQP frames — conceptual\n# Producer frame (basic.publish):\n#   exchange:    \"events\"\n#   routing-key: \"order.created\"   ← routing key (set by producer)\n\n# Admin frame (queue.bind):\n#   queue:       \"order.processor\"\n#   exchange:    \"events\"\n#   routing-key: \"order.created\"   ← binding key (set at bind time)\n\n# On a direct exchange: exact string match\n# On a topic exchange:  wildcard pattern match\n# On a fanout exchange: binding key is ignored entirely",
    "bestPractice": "Treat routing keys as part of your event contract — version them (v1.order.created) when the schema changes to avoid breaking consumers that have not updated their bindings. Store binding key patterns alongside the queue definitions in your IaC (infrastructure-as-code) repository so that adding a new consumer is an explicit, reviewed change rather than a silent ad-hoc operation.",
    "source": "RabbitMQ Docs — AMQP 0-9-1 Model — Bindings"
  },
  {
    "id": "i06",
    "topic": "DLX",
    "question": "Como uma Dead Letter Exchange (DLX) é configurada em uma fila?",
    "code": null,
    "options": [
      "Definindo o argumento 'x-dead-letter-exchange' ao declarar a fila",
      "Publicando diretamente em uma exchange chamada 'dlx'",
      "Ativando o plugin rabbitmq_dlx",
      "Definindo a propriedade 'dead-letter' em cada mensagem individualmente"
    ],
    "correctIndex": 0,
    "explanation": "Uma DLX é atribuída ao passar o argumento 'x-dead-letter-exchange' (e opcionalmente 'x-dead-letter-routing-key') no momento em que a fila de origem é declarada.",
    "compiledJS": "# Declare a queue with DLX configured\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/orders \\\n  -H \"content-type: application/json\" \\\n  -d '{\n    \"durable\": true,\n    \"arguments\": {\n      \"x-dead-letter-exchange\": \"orders.dlx\",\n      \"x-dead-letter-routing-key\": \"failed\",\n      \"x-message-ttl\": 30000,\n      \"x-max-length\": 10000\n    }\n  }'\n\n# Messages that expire, are nacked, or overflow go to orders.dlx\n# with routing key \"failed\" instead of their original routing key",
    "bestPractice": "Always configure a DLX on production queues so that rejected or expired messages are preserved for analysis rather than silently dropped. Pair the DLX with a dedicated dead-letter queue and an alert on its depth — a growing DLX queue is a reliable signal of processing errors or misconfigured consumers. Periodically reprocess DLX messages by republishing them to the original exchange after fixing the underlying bug.",
    "source": "RabbitMQ Docs — Dead Letter Exchanges"
  },
  {
    "id": "i07",
    "topic": "Message TTL",
    "question": "Qual é a diferença entre uma fila durável (durable) e uma fila transitória (transient)?",
    "code": null,
    "options": [
      "TTL de fila vale para toda a fila; TTL de mensagem expira itens individuais",
      "TTL de mensagem tem prioridade absoluta, anulando qualquer TTL de fila ativo",
      "TTL de fila exige plugins externos; TTL de mensagem é nativo do broker AMQP",
      "Ambos os mecanismos provocam reações idênticas sem nenhuma diferença prática"
    ],
    "correctIndex": 0,
    "explanation": "Marcar uma fila como durável faz com que o RabbitMQ persista sua definição em disco para sobreviver a reinicializações do broker, ao passo que uma fila transitória (não durável) é perdida ao reiniciar.",
    "compiledJS": "# Queue-level TTL (all messages expire after 60 seconds)\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/session.events \\\n  -d '{\"durable\":true,\"arguments\":{\"x-message-ttl\":60000}}'\n\n# Per-message TTL in AMQP properties\n# (Python pika example)\nchannel.basic_publish(\n    exchange=\"events\",\n    routing_key=\"session.started\",\n    body=payload,\n    properties=pika.BasicProperties(\n        expiration=\"10000\",   # 10 s for this message only\n        delivery_mode=2\n    )\n)\n# Effective TTL = min(queue x-message-ttl, message expiration)",
    "bestPractice": "Use queue-level TTL for time-sensitive workloads where all messages have a uniform deadline (e.g., OTP codes, session events). Use per-message TTL sparingly — it complicates reasoning about queue depth and can create a head-of-line blocking effect because expired messages in the middle of the queue are only evicted when they reach the head. When in doubt, prefer queue-level TTL combined with a DLX for dead messages.",
    "source": "RabbitMQ Docs — TTL"
  },
  {
    "id": "i08",
    "topic": "Publisher Confirms",
    "question": "Qual é a principal vantagem dos publisher confirms em comparação com transações AMQP (tx.select/tx.commit) no RabbitMQ?",
    "code": null,
    "options": [
      "Publisher confirms bloqueiam canais até que o broker grave a mensagem no disco",
      "Publisher confirms dão acks assíncronos leves sem o peso do two-phase commit",
      "Transações AMQP aceitam confirmação em lote; publisher confirms apenas avulsos",
      "Publisher confirms funcionam exclusivamente em filas quorum de alta durabilidade"
    ],
    "correctIndex": 1,
    "explanation": "Os publisher confirms são uma extensão do RabbitMQ que permite confirmação assíncrona por mensagem por parte do broker com um impacto na vazão muito menor do que as transações AMQP 0-9-1.",
    "compiledJS": "# Throughput comparison (approximate, single producer, durable queue)\n# Fire-and-forget:    ~50,000 msg/s\n# Publisher confirms: ~25,000 msg/s (batched acks)\n# AMQP transactions:  ~2,000  msg/s  ← ~25x slower\n\n# Enable confirms on a channel (rabbitmqadmin does not support this;\n# shown as pseudocode for clarity)\nchannel.confirm_select()       # puts channel in confirm mode\nchannel.basic_publish(...)     # send n messages\nchannel.wait_for_confirms()    # block until all acked/nacked\n# nacked delivery-tags → republish or alert",
    "bestPractice": "Use publisher confirms in async batched mode rather than waiting synchronously after every single message. Collect delivery tags as you publish and reconcile nacks in a callback. Never use AMQP transactions for new code — they exist for legacy compatibility. For at-least-once guarantee, combine publisher confirms with durable queues and persistent messages (delivery_mode=2).",
    "source": "RabbitMQ Docs — Publisher Confirms"
  },
  {
    "id": "i09",
    "topic": "Shovel Plugin",
    "question": "Qual é a finalidade principal do plugin Shovel do RabbitMQ?",
    "code": null,
    "options": [
      "Espelhar filas entre nós do cluster para assegurar alta disponibilidade",
      "Mover mensagens de forma confiável entre filas ou exchanges de destino",
      "Expor payloads de filas como endpoints REST HTTP públicos para aplicações",
      "Compactar o corpo de mensagens usando algoritmos zstandard antes do disco"
    ],
    "correctIndex": 1,
    "explanation": "O plugin Shovel consome mensagens continuamente de uma origem (fila ou exchange) e as republica em um destino, que pode estar situado no mesmo broker ou em um remoto.",
    "compiledJS": "# Create a dynamic shovel via HTTP API\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/parameters/shovel/%2F/migrate-orders \\\n  -H \"content-type: application/json\" \\\n  -d '{\n    \"value\": {\n      \"src-protocol\": \"amqp091\",\n      \"src-uri\": \"amqp://source-broker:5672\",\n      \"src-queue\": \"orders\",\n      \"dest-protocol\": \"amqp091\",\n      \"dest-uri\": \"amqp://dest-broker:5672\",\n      \"dest-queue\": \"orders.migrated\",\n      \"ack-mode\": \"on-confirm\"\n    }\n  }'",
    "bestPractice": "Use Shovel for point-to-point message migration, disaster recovery failover, or draining a legacy broker before decomissioning it. For long-lived cross-datacenter topologies, prefer Federation (which is designed for loosely coupled, independently managed brokers) over Shovel. Always set ack-mode to on-confirm so the source message is ACKed only after the destination confirms receipt, preventing message loss during network interruptions.",
    "source": "RabbitMQ Docs — Shovel Plugin"
  },
  {
    "id": "i10",
    "topic": "Quorum Queues",
    "question": "Qual é a principal diferença arquitetural entre quorum queues e classic mirrored queues?",
    "code": null,
    "options": [
      "Quorum queues usam consenso Raft; mirrored queues usam cópias master-mirror",
      "Classic mirrored usam consenso Raft; quorum queues adotam two-phase commit",
      "Quorum queues residem em um nó só; mirrored queues espalham por todo o cluster",
      "Ambas usam motores de replicação idênticos mudando apenas a convenção de nomes"
    ],
    "correctIndex": 0,
    "explanation": "Quorum queues utilizam o algoritmo de consenso distribuído Raft para garantir forte confiabilidade na replicação, enquanto as classic mirrored queues utilizavam uma abordagem mestre-espelho assíncrona suscetível a perdas de dados em failovers.",
    "compiledJS": "# Declare a quorum queue\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/orders \\\n  -H \"content-type: application/json\" \\\n  -d '{\n    \"durable\": true,\n    \"arguments\": {\n      \"x-queue-type\": \"quorum\",\n      \"x-quorum-initial-group-size\": 3\n    }\n  }'\n\n# Verify replication state\nrabbitmqctl list_queues name type leader members\n# orders   quorum   rabbit@node1   [rabbit@node1, rabbit@node2, rabbit@node3]",
    "bestPractice": "Use quorum queues for all new production workloads that require durability and HA. Migrate away from classic mirrored queues — they were deprecated in RabbitMQ 3.9 and removed in 4.0. Size quorum queue membership at 3 or 5 nodes (always odd) to maintain a quorum during single-node failures. Quorum queues do not support per-message priority and have slightly higher write latency than classic queues — factor this in for latency-sensitive pipelines.",
    "source": "RabbitMQ Docs — Quorum Queues"
  },
  {
    "id": "a01",
    "topic": "Channel Multiplexing",
    "question": "Como o AMQP 0-9-1 viabiliza múltiplos fluxos lógicos de comunicação sobre uma única conexão TCP no RabbitMQ?",
    "code": null,
    "options": [
      "Abrindo múltiplos sockets TCP agrupados em um único objeto de conexão cliente",
      "Por meio de canais — conexões virtuais leves multiplexadas em um único TCP",
      "Usando multiplexação de streams HTTP/2 embutida no handshake do protocolo AMQP",
      "Codificando cada fluxo individual de comunicação como um virtual host separado"
    ],
    "correctIndex": 1,
    "explanation": "O AMQP 0-9-1 multiplexa canais em uma única conexão TCP; cada canal representa um fluxo lógico independente com seu próprio estado, viabilizando operações concorrentes sem o custo de abrir múltiplas conexões TCP.",
    "compiledJS": "# AMQP frame structure (simplified)\n# +--------+------+--------+--..--+------+\n# | type   | chan | size   | body | 0xCE |\n# +--------+------+--------+--..--+------+\n# type: 1=method, 2=header, 3=body, 4=heartbeat\n# chan: channel number (0 = connection-level)\n\n# View open channels per connection in management\ncurl -u guest:guest \\\n  \"http://localhost:15672/api/channels\" \\\n  | jq '.[] | {connection: .connection_details.name, number: .number}'",
    "bestPractice": "Use one channel per thread or async task — channels are not thread-safe in most client libraries. Do not use a single channel for both publish and consume operations in the same goroutine/thread; use separate channels to avoid head-of-line blocking. Keep total channel count per connection below a few hundred; beyond that, consider opening additional connections or using a connection pool. Close unused channels promptly to free broker-side state.",
    "source": "AMQP 0-9-1 Specification — Channels"
  },
  {
    "id": "a02",
    "topic": "Flow Control",
    "question": "O que o mecanismo channel.flow do AMQP 0-9-1 faz?",
    "code": null,
    "options": [
      "Ele expande o prefetch do consumidor dinamicamente quando a fila está vazia",
      "Permite pausar e retomar a entrega de mensagens no canal para contrapressão",
      "Migra um canal ativo para outra conexão TCP sem interromper o processamento",
      "Grava todos os buffers pendentes de memória do canal para o disco permanente"
    ],
    "correctIndex": 1,
    "explanation": "channel.flow é um método do AMQP que tanto o broker quanto o cliente podem enviar para pausar (active=false) ou retomar (active=true) o fluxo de mensagens em um canal, atuando como um controle básico de back-pressure.",
    "compiledJS": "# Broker-side flow control alarm thresholds\n# rabbitmq.conf:\nmemory_high_watermark.relative = 0.4   # 40% of RAM → memory alarm\ndisk_free_limit.absolute = 2GB          # < 2 GB free → disk alarm\n\n# When alarm fires, broker sends channel.flow(active=false)\n# to all publisher channels.\n# Management shows connection state:\ncurl -u guest:guest \\\n  \"http://localhost:15672/api/connections\" \\\n  | jq '.[] | {name:.name, state:.state}'\n# {\"name\":\"...\",\"state\":\"flow\"}  ← connection under flow control",
    "bestPractice": "Monitor for connection state=\"flow\" in the management API or Prometheus — it is a leading indicator that the broker is under memory or disk pressure before a hard block occurs. Tune the memory watermark conservatively (0.4–0.6) rather than raising it to avoid OOM kills. On the producer side, implement exponential backoff when you detect channel.flow(active=false) to avoid tight loops. Address the root cause (slow consumers, undersized broker) rather than simply raising the watermark.",
    "source": "RabbitMQ Docs — Flow Control"
  },
  {
    "id": "a03",
    "topic": "Lazy Queues",
    "question": "Qual é o principal benefício operacional de declarar uma fila como lazy queue?",
    "code": null,
    "options": [
      "Filas lazy ignoram acknowledgements para elevar a taxa de vazão no broker",
      "Filas lazy gravam mensagens direto no disco, poupando RAM em filas profundas",
      "Filas lazy escrevem no disco permanente apenas durante reinicializações de nós",
      "Filas lazy adiam a avaliação de bindings até a conexão do primeiro consumidor"
    ],
    "correctIndex": 1,
    "explanation": "Lazy queues transferem as mensagens para o disco assim que chegam em vez de retê-las na memória RAM, diminuindo drasticamente o consumo de memória quando as filas acumulam um grande volume de mensagens.",
    "compiledJS": "# Declare a lazy classic queue\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/bulk.imports \\\n  -H \"content-type: application/json\" \\\n  -d '{\n    \"durable\": true,\n    \"arguments\": {\n      \"x-queue-mode\": \"lazy\"\n    }\n  }'\n\n# Convert an existing queue via policy (no redeclare needed)\nrabbitmqctl set_policy lazy-mode \"^bulk\\.\" \\\n  '{\"queue-mode\":\"lazy\"}' --apply-to queues",
    "bestPractice": "Apply lazy mode (or use quorum queues, which are inherently disk-first) for batch import, ETL, or audit-log queues that may accumulate millions of messages overnight. Avoid lazy mode for latency-sensitive queues where sub-millisecond dequeue is required. Monitor rabbitmq_queue_disk_reads_total and rabbitmq_queue_disk_writes_total in Prometheus to measure I/O impact, and size broker disk with at least 3× the expected peak queue depth.",
    "source": "RabbitMQ Docs — Lazy Queues"
  },
  {
    "id": "a04",
    "topic": "Federation Plugin",
    "question": "Qual é a principal diferença arquitetural entre o plugin Federation e o plugin Shovel?",
    "code": null,
    "options": [
      "Links de federation são fixos; conexões shovel se apagam após uma mensagem",
      "Federation conecta brokers autônomos; Shovel move mensagens ponto a ponto",
      "Shovel suporta AMQP 1.0; Federation opera exclusivamente com AMQP 0-9-1",
      "Ambos os plugins realizam tarefas idênticas, sendo Federation apenas mais novo"
    ],
    "correctIndex": 1,
    "explanation": "O Federation foi concebido para topologias fracamente acopladas e distribuídas via WAN onde cada broker permanece independente; o Shovel é uma ferramenta de mais baixo nível que simplesmente consome de um endpoint e republica em outro.",
    "compiledJS": "# Federation: upstream declaration on downstream broker\ncurl -u guest:guest -X PUT \\\n  http://downstream:15672/api/parameters/federation-upstream/%2F/us-east \\\n  -H \"content-type: application/json\" \\\n  -d '{\n    \"value\": {\n      \"uri\": \"amqp://upstream-broker:5672\",\n      \"expires\": 3600000\n    }\n  }'\n\n# Apply federation policy to all exchanges matching \"^federated\\.\"\nrabbitmqctl set_policy federate-events \"^federated\\.\" \\\n  '{\"federation-upstream-set\":\"all\"}' \\\n  --apply-to exchanges",
    "bestPractice": "Use Federation for geographically distributed deployments where each datacenter runs an independent cluster and you want events to propagate across regions without tight coupling. Use Shovel when you need deterministic point-to-point message movement (e.g., draining a queue from a decommissioned broker). Never use both for the same queue/exchange pair — the interaction can cause unexpected message duplication.",
    "source": "RabbitMQ Docs — Federation Plugin"
  },
  {
    "id": "a05",
    "topic": "Consistent Hash Exchange",
    "question": "O que o plugin consistent hash exchange realiza que uma exchange direct ou topic padrão não consegue?",
    "code": null,
    "options": [
      "Roteia para uma fila por hash de chave, mantendo chaves iguais agrupadas",
      "Duplica mensagens para todas as filas usando regras de deduplicação por hash",
      "Verifica o hash de integridade do payload antes de qualquer decisão de envio",
      "Distribui mensagens em round-robin independente da chave de roteamento usada"
    ],
    "correctIndex": 0,
    "explanation": "A exchange de hash consistente usa o hash da routing key (ou cabeçalho/propriedade da mensagem) para selecionar deterministicamente uma fila do grupo vinculado, permitindo particionamento ordenado por chave com balanceamento de carga.",
    "compiledJS": "# Install the plugin\nrabbitmq-plugins enable rabbitmq_consistent_hash_exchange\n\n# Declare a consistent hash exchange\nrabbitmqadmin declare exchange \\\n  name=orders.partitioned \\\n  type=x-consistent-hash \\\n  durable=true\n\n# Bind 3 queues with weight \"1\" each (equal distribution)\nrabbitmqadmin declare binding \\\n  source=orders.partitioned destination=orders.p1 routing_key=\"1\"\nrabbitmqadmin declare binding \\\n  source=orders.partitioned destination=orders.p2 routing_key=\"1\"\nrabbitmqadmin declare binding \\\n  source=orders.partitioned destination=orders.p3 routing_key=\"1\"\n# Weight \"2\" would give that queue double the hash ring slots",
    "bestPractice": "Use the consistent hash exchange when you need ordered processing of messages that share a natural partition key (e.g., user_id, order_id) across multiple parallel consumer queues. Bind queues with equal weights for uniform distribution, or use higher weights for queues on more powerful nodes. Remember that adding or removing bound queues causes re-hashing, potentially sending subsequent messages for a given key to a different queue — plan migrations carefully.",
    "source": "RabbitMQ Docs — Consistent Hash Exchange Plugin"
  },
  {
    "id": "a06",
    "topic": "Clustering",
    "question": "Em um cluster RabbitMQ, qual é a diferença funcional entre nós de disco (disc nodes) e nós de memória (RAM nodes)?",
    "code": null,
    "options": [
      "Nós disc gravam metadados em disco; nós RAM mantêm metadados em memória",
      "Nós RAM cuidam de roteamento; nós disc cuidam apenas de persistência em disco",
      "Nós disc hospedam quorum queues; nós RAM não aceitam ligações de quorum queues",
      "Ambas as categorias foram descontinuadas e os nós atuais operam de modo idêntico"
    ],
    "correctIndex": 0,
    "explanation": "Nós de disco gravam metadados do cluster no disco, sendo essenciais para a reinicialização do cluster; nós de RAM armazenam metadados somente na memória (o conteúdo das mensagens é sempre gravado em disco para filas persistentes, independentemente do tipo do nó).",
    "compiledJS": "# Check node types in a cluster\nrabbitmqctl cluster_status\n# Disk Nodes:  rabbit@node1, rabbit@node2\n# RAM Nodes:   rabbit@node3\n# Running:     rabbit@node1, rabbit@node2, rabbit@node3\n\n# Change a node to RAM type (requires restart)\nrabbitmqctl change_cluster_node_type ram\n\n# RabbitMQ 3.12+ recommendation:\n# RAM nodes provide minimal benefit in modern hardware;\n# use disc nodes for all cluster members.",
    "bestPractice": "In modern deployments (RabbitMQ 3.12+), use disc nodes exclusively. The performance advantage of RAM nodes has diminished as hardware costs dropped, and RAM nodes introduce operational risk: if all RAM nodes restart simultaneously the cluster loses its entire topology and requires a complete reconfiguration. The RabbitMQ team officially recommends against RAM nodes for new clusters.",
    "source": "RabbitMQ Docs — Clustering Guide — Disc and RAM Nodes"
  },
  {
    "id": "a07",
    "topic": "Raft Consensus",
    "question": "Como as quorum queues utilizam o algoritmo de consenso Raft para garantir a segurança dos dados?",
    "code": null,
    "options": [
      "Mensagens confirmam apenas quando a maioria de quorum das réplicas grava",
      "Raft atua apenas na eleição de líder; gravação usa protocolos two-phase commit",
      "Quorum queues exigem confirmação unânime e síncrona de todas as réplicas do nó",
      "Raft garante deduplicação automática de mensagens entre todos os nós ativos"
    ],
    "correctIndex": 0,
    "explanation": "Quorum queues implementam o Raft de modo que cada operação de enfileiramento seja replicada para a maioria dos nós membros antes de ser confirmada, garantindo durabilidade desde que um quórum de nós permaneça online.",
    "compiledJS": "# Inspect quorum queue Raft state\nrabbitmq-diagnostics quorum_status orders\n# Leader:  rabbit@node1\n# Members: [rabbit@node1, rabbit@node2, rabbit@node3]\n# Log Index:       12345\n# Commit Index:    12344  ← 1 entry pending replication\n\n# Check for under-replicated queues\ncurl -u guest:guest \\\n  \"http://localhost:15672/api/queues/%2F\" \\\n  | jq '.[] | select(.type==\"quorum\") | {name:.name, members:.quorum_spi}'",
    "bestPractice": "Deploy quorum queues with an odd number of members (3 or 5) to always maintain a clear majority. Do not shrink a 3-member quorum queue to 2 members — the cluster loses its ability to tolerate any single failure. Monitor the \"under-replicated\" metric in Prometheus (rabbitmq_quorum_queue_underreplicated) and alert on it immediately — an under-replicated queue is degraded and a second failure would make it unavailable. Avoid co-locating all quorum members on the same physical rack or AZ.",
    "source": "RabbitMQ Docs — Quorum Queues — Raft"
  },
  {
    "id": "a08",
    "topic": "Policy vs Argument Precedence",
    "question": "Quando tanto uma política por fila quanto um argumento de declaração de fila (ex.: x-message-ttl) são configurados para a mesma chave, qual tem precedência no RabbitMQ?",
    "code": null,
    "options": [
      "Políticas de fila sempre têm prioridade sobre argumentos de declaração",
      "Argumentos de declaração sempre têm prioridade sobre políticas do broker",
      "Argumentos definidos na criação da fila têm precedência sobre políticas",
      "Ambas as opções se somam de modo cumulativo sem que uma anule a outra"
    ],
    "correctIndex": 2,
    "explanation": "Para parâmetros definidos pelo operador como x-message-ttl e x-dead-letter-exchange, os argumentos passados na declaração da fila têm precedência sobre as políticas para a mesma chave, pois são estabelecidos na criação e são imutáveis.",
    "compiledJS": "# Policy sets TTL to 60000 ms\nrabbitmqctl set_policy ttl-policy \"^orders$\" \\\n  '{\"message-ttl\":60000}' --apply-to queues\n\n# But queue was declared with x-message-ttl=10000\n# → effective TTL = 10000 (argument wins)\n\n# Verify effective parameters\ncurl -u guest:guest \\\n  \"http://localhost:15672/api/queues/%2F/orders\" \\\n  | jq .effective_policy_definition\n# {\"message-ttl\": 10000}  ← from declaration argument\n# policy definition shows 60000 but is overridden",
    "bestPractice": "Avoid setting queue parameters in both declaration arguments and policies — choose one mechanism per parameter and document the choice. Prefer policies for operator-managed parameters (TTL, max-length, DLX) so they can be updated without downtime or queue recreation. If a queue was declared with hardcoded arguments and you need to change them, you must delete and redeclare the queue (during a maintenance window or via a blue-green migration).",
    "source": "RabbitMQ Docs — Parameters and Policies"
  },
  {
    "id": "a09",
    "topic": "Monitoring",
    "question": "Qual par de métricas de gerenciamento do RabbitMQ indica mais diretamente que os consumidores estão ficando para trás em relação aos produtores?",
    "code": null,
    "options": [
      "publish_rate e deliver_rate: quando publish_rate excede deliver_rate de forma constante, messages_ready aumentará",
      "memory_used e disk_free: um aumento de memory_used com queda de disk_free indica atraso do consumidor",
      "connection_count e channel_count: excesso de canais indica acúmulo de trabalho nos consumidores",
      "node_uptime e gc_reclaim_rate: alta atividade do coletor de lixo confirma atraso do consumidor"
    ],
    "correctIndex": 0,
    "explanation": "Quando publish_rate supera deliver_rate, o contador messages_ready sobe, indicando que os consumidores não estão acompanhando o ritmo; o aumento concomitante de messages_unacknowledged revela mensagens entregues mas ainda não confirmadas.",
    "compiledJS": "# Key metrics via management HTTP API\ncurl -u guest:guest \\\n  \"http://localhost:15672/api/queues/%2F/orders\" \\\n  | jq '{\n      ready:        .messages_ready,\n      unacked:      .messages_unacknowledged,\n      publish_rate: .message_stats.publish_details.rate,\n      deliver_rate: .message_stats.deliver_details.rate\n    }'\n# {\"ready\":4500,\"unacked\":10,\"publish_rate\":120,\"deliver_rate\":30}\n# → publish 4× faster than delivery: backlog growing at ~90 msg/s",
    "bestPractice": "Set Prometheus alerts on messages_ready crossing a threshold (e.g., > 10,000 for a latency-sensitive queue) and on a sustained positive delta of (publish_rate - deliver_rate) over a 5-minute window. Pair the alert with a consumer-count check: if consumers are zero, page immediately. Export RabbitMQ metrics via the rabbitmq_prometheus plugin and build dashboards that show queue depth alongside consumer count and node memory so you can distinguish consumer failure from simply slow consumers.",
    "source": "RabbitMQ Docs — Monitoring — Key Metrics"
  },
  {
    "id": "a10",
    "topic": "Graceful Shutdown",
    "question": "Qual é a abordagem recomendada para o encerramento gracioso (graceful shutdown) de um consumidor no RabbitMQ para evitar perda de mensagens?",
    "code": null,
    "options": [
      "Encerrar o processo no ato; o broker reenfileira automaticamente mensagens",
      "Cancelar inscrições, processar itens pendentes, enviar ACKs e fechar canais",
      "Chamar basic.reject e cortar o socket sem enviar frames de encerramento AMQP",
      "Zerar o prefetch e aguardar o broker esvaziar totalmente a fila antes do fim"
    ],
    "correctIndex": 1,
    "explanation": "O encerramento gracioso exige cancelar o consumidor (basic.cancel), processar e confirmar todas as mensagens já recebidas e, em seguida, fechar de forma limpa o canal e a conexão TCP para que o RabbitMQ gerencie adequadamente as mensagens não confirmadas se necessário.",
    "compiledJS": "# Graceful shutdown sequence (pseudocode)\n# 1. Signal handler receives SIGTERM\nsignal.SIGTERM → begin_shutdown()\n\n# 2. Cancel consumer — no more deliveries\nchannel.basic_cancel(consumer_tag)\n\n# 3. Wait for in-flight messages to complete\n#    (drain internal processing queue with timeout)\nwait_for_inflight(timeout=30s)\n\n# 4. ACK/NACK all processed messages\nfor msg in processed:\n    channel.basic_ack(msg.delivery_tag)\n\n# 5. Clean close\nchannel.close(reply_code=200)\nconnection.close(reply_code=200)",
    "bestPractice": "Register a SIGTERM handler in every consumer process that triggers the graceful shutdown sequence. Set a maximum drain timeout (typically 30–60 s) so a stuck message does not block the shutdown indefinitely — NACK with requeue=true after the timeout expires. In Kubernetes, set terminationGracePeriodSeconds to a value longer than your drain timeout so the pod is not SIGKILL-ed before it finishes. Test your shutdown path in staging by sending SIGTERM and verifying zero message loss in the dead-letter queue.",
    "source": "RabbitMQ Docs — Consumer Acknowledgements — Graceful Shutdown"
  }
]
