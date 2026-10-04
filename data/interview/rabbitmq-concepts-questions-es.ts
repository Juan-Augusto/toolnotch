import type { InterviewQuestion } from '@/lib/interviewTypes'

export const RABBITMQ_CONCEPTS_QUESTIONS_ES: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "AMQP Broker",
    "question": "¿Qué es RabbitMQ?",
    "code": null,
    "options": [
      "Un sistema de gestión de bases de datos relacionales",
      "Un broker de mensajería AMQP de código abierto",
      "Una pasarela de API REST",
      "Un almacén clave-valor distribuido"
    ],
    "correctIndex": 1,
    "explanation": "RabbitMQ es un broker de mensajería de código abierto que implementa el protocolo AMQP (Advanced Message Queuing Protocol), permitiendo que las aplicaciones se comuniquen enviando y recibiendo mensajes.",
    "compiledJS": "# Management CLI — verify broker identity\nrabbitmqctl status\n# => Node: rabbit@hostname\n# => RabbitMQ 3.12.x, Erlang 26.x\n# => Protocols: amqp/0-9-1, amqp/1.0, mqtt, stomp\n\n# Enable management UI on port 15672\nrabbitmq-plugins enable rabbitmq_management",
    "bestPractice": "Always pin RabbitMQ to a specific minor version in your container image and test upgrades in staging first. Use Docker Hubs official image with a digest tag rather than \"latest\" to avoid unintended upgrades. Run the management plugin on every node so you have a ready-to-use dashboard without extra tooling.",
    "source": "RabbitMQ Docs — Introduction"
  },
  {
    "id": "b02",
    "topic": "Exchange→Queue→Consumer",
    "question": "En un flujo típico de mensajes en RabbitMQ, ¿cuál es el orden correcto de los componentes?",
    "code": null,
    "options": [
      "Consumidor → Cola → Exchange → Productor",
      "Productor → Cola → Exchange → Consumidor",
      "Productor → Exchange → Cola → Consumidor",
      "Exchange → Productor → Cola → Consumidor"
    ],
    "correctIndex": 2,
    "explanation": "Los mensajes viajan del Productor a la Exchange, la Exchange los enruta a una o varias Colas mediante enlaces (bindings), y los Consumidores leen los mensajes de esas Colas.",
    "compiledJS": "# Trace message flow in the management CLI\nrabbitmqctl trace_on          # enable tracing\n# Messages appear in amq.rabbitmq.trace exchange:\n# routing key pattern: publish.<exchange> and deliver.<queue>\n\n# Example: after publishing to \"orders\" exchange with key \"new\"\n# Trace log line:\n# publish.orders  routing-key=new  payload=<bytes>\n# deliver.orders.created  consumer-tag=ctag1  payload=<bytes>",
    "bestPractice": "Keep producers ignorant of queue names — they should only know the exchange name and routing key. This separation lets you add or remove consumers and queues without touching producer code. Document your exchange/routing-key contracts in a central schema registry so teams do not break each other accidentally.",
    "source": "RabbitMQ Docs — AMQP 0-9-1 Model"
  },
  {
    "id": "b03",
    "topic": "Bindings",
    "question": "¿Qué es un enlace (binding) en RabbitMQ?",
    "code": null,
    "options": [
      "Una conexión TCP entre dos brokers",
      "Una regla que vincula una exchange con una cola (o con otra exchange)",
      "La credencial de autenticación utilizada por un productor",
      "Una referencia con nombre a un virtual host"
    ],
    "correctIndex": 1,
    "explanation": "Un binding es una relación entre una exchange y una cola que indica a la exchange qué colas deben recibir los mensajes que coincidan con los criterios del enlace.",
    "compiledJS": "# Declare a binding via management HTTP API\ncurl -u guest:guest -X POST \\\n  http://localhost:15672/api/bindings/%2F/e/my.exchange/q/my.queue \\\n  -H \"content-type: application/json\" \\\n  -d '{\"routing_key\": \"order.created\", \"arguments\": {}}'\n\n# List all bindings for a queue\ncurl -u guest:guest \\\n  http://localhost:15672/api/queues/%2F/my.queue/bindings",
    "bestPractice": "Treat bindings as part of your infrastructure-as-code — store them in Terraform (rabbitmq provider) or Ansible rather than creating them manually. Include routing-key patterns in your service documentation so other teams know how to bind to shared exchanges. Prefer specific routing keys over wildcard-heavy patterns to keep routing logic easy to reason about.",
    "source": "RabbitMQ Docs — Bindings"
  },
  {
    "id": "b04",
    "topic": "Default Exchange",
    "question": "¿Qué es la exchange predeterminada (default exchange) en RabbitMQ?",
    "code": null,
    "options": [
      "Una exchange fanout llamada 'default'",
      "Una exchange direct predeclarada con nombre de cadena vacía",
      "Una exchange topic llamada 'amq.default'",
      "Una exchange headers que debe declararse antes de usarse"
    ],
    "correctIndex": 1,
    "explanation": "La exchange predeterminada es una direct exchange con nombre de cadena vacía; cada cola queda vinculada automáticamente a ella usando el propio nombre de la cola como routing key.",
    "compiledJS": "# Publish directly to a queue via the default exchange\n# (routing_key == queue name, exchange == \"\")\nrabbitmqadmin publish \\\n  exchange=\"\" \\\n  routing_key=\"my.queue\" \\\n  payload=\"hello world\"\n\n# Equivalent Python (pika)\nchannel.basic_publish(\n    exchange=\"\",        # default exchange\n    routing_key=\"my.queue\",\n    body=b\"hello world\"\n)",
    "bestPractice": "Avoid the default exchange in production service-to-service messaging. Explicit named exchanges make routing intent clear, allow you to change destination queues without changing producer code, and make tracing/debugging easier. Reserve the default exchange for quick scripts, local testing, or CLI tools.",
    "source": "RabbitMQ Docs — AMQP 0-9-1 Model — Default Exchange"
  },
  {
    "id": "b05",
    "topic": "Durable Queues",
    "question": "¿Cuál es la diferencia entre una cola durable y una cola transitoria (transient)?",
    "code": null,
    "options": [
      "Las colas durables sobreviven al reinicio del broker; las colas transitorias no",
      "Las colas durables son más rápidas; las colas transitorias son más lentas",
      "Las colas durables pueden contener más mensajes que las colas transitorias",
      "Las colas durables requieren autenticación; las colas transitorias no"
    ],
    "correctIndex": 0,
    "explanation": "Marcar una cola como durable hace que RabbitMQ guarde su definición en disco para conservarla tras reiniciar el broker, mientras que una cola transitoria (no durable) se pierde al reiniciar.",
    "compiledJS": "# Declare a durable queue via HTTP API\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/orders \\\n  -H \"content-type: application/json\" \\\n  -d '{\"durable\": true, \"arguments\": {}}'\n\n# Verify durability in rabbitmqctl\nrabbitmqctl list_queues name durable\n# orders   true\n# tmp.q    false",
    "bestPractice": "Always declare queues as durable in production. Pair durable queues with persistent message delivery mode (delivery_mode=2) so that both the queue definition and message content survive restarts. Keep non-durable queues only for truly ephemeral use cases such as exclusive reply queues in the RPC pattern.",
    "source": "RabbitMQ Docs — Queues — Durability"
  },
  {
    "id": "b06",
    "topic": "Ack / Nack",
    "question": "¿Qué envía un consumidor a RabbitMQ para confirmar que ha procesado un mensaje con éxito?",
    "code": null,
    "options": [
      "Un NACK",
      "Un REJECT",
      "Un ACK (acknowledgement)",
      "Un CONFIRM"
    ],
    "correctIndex": 2,
    "explanation": "Un ACK (basic.ack) notifica a RabbitMQ que el mensaje se procesó con éxito y puede eliminarse de la cola.",
    "compiledJS": "# Monitor unacknowledged messages per queue\nrabbitmqctl list_queues name messages_ready messages_unacknowledged\n# orders   0    3\n# → 3 messages delivered but not yet ACKed\n\n# If a consumer crashes, unacked messages requeue:\n# messages_unacknowledged drops back to 0\n# messages_ready rises by 3",
    "bestPractice": "Always use manual acknowledgements in production (auto_ack=False). ACK only after your processing is confirmed complete — e.g., after a database write commits. Use channel-level prefetch (basic.qos) alongside manual acks to prevent a single consumer from hoarding hundreds of unprocessed messages. Never ACK inside a try block without ensuring the message is truly handled on error paths.",
    "source": "RabbitMQ Docs — Consumer Acknowledgements"
  },
  {
    "id": "b07",
    "topic": "Ack / Nack",
    "question": "¿Cuál es la diferencia entre una cola durable y una cola transitoria (transient)?",
    "code": null,
    "options": [
      "Las colas durables sobreviven al reinicio del broker; las colas transitorias no",
      "Las colas durables sobreviven al reinicio del broker; las colas transitorias no",
      "Las colas durables sobreviven al reinicio del broker; las colas transitorias no",
      "Las colas durables sobreviven al reinicio del broker; las colas transitorias no"
    ],
    "correctIndex": 0,
    "explanation": "Marcar una cola como durable hace que RabbitMQ guarde su definición en disco para conservarla tras reiniciar el broker, mientras que una cola transitoria (no durable) se pierde al reiniciar.",
    "compiledJS": "# AMQP 0-9-1 frame comparison\n# basic.reject — single message\n# method: basic.reject\n#   delivery-tag: 42\n#   requeue: false   → dead-letter or discard\n\n# basic.nack — multiple messages (RabbitMQ extension)\n# method: basic.nack\n#   delivery-tag: 42\n#   multiple: true   → reject tags 1..42\n#   requeue: true    → redeliver all to ready consumers",
    "bestPractice": "Use basic.nack with multiple=true to bulk-reject messages when your consumer detects a poison-pill batch or a downstream service is unavailable. Combine with a DLX so rejected messages land in a dead-letter queue rather than being silently dropped. Avoid requeue=true in a tight loop — pair it with a backoff or a DLX with TTL to prevent storm requeuing.",
    "source": "RabbitMQ Docs — Consumer Acknowledgements — NACK"
  },
  {
    "id": "b08",
    "topic": "Management UI",
    "question": "¿Qué plugin nativo de RabbitMQ proporciona un panel de gestión y monitorización accesible desde el navegador?",
    "code": null,
    "options": [
      "rabbitmq_shovel",
      "rabbitmq_management",
      "rabbitmq_federation",
      "rabbitmq_stomp"
    ],
    "correctIndex": 1,
    "explanation": "El plugin rabbitmq_management proporciona una API HTTP y una interfaz web de navegador para gestionar y monitorizar nodos, colas, exchanges y bindings de RabbitMQ.",
    "compiledJS": "# Enable management plugin\nrabbitmq-plugins enable rabbitmq_management\n\n# Check its status\nrabbitmq-plugins list | grep management\n# [E*] rabbitmq_management       3.12.x\n# [E*] rabbitmq_management_agent 3.12.x\n\n# Default credentials (change immediately in prod!)\n# http://localhost:15672  guest / guest\n# guest is only allowed from localhost by default",
    "bestPractice": "Never leave the default guest/guest credentials in place on any non-localhost-bound interface. Create per-operator user accounts with the minimum required tags (monitoring, management, or administrator). Expose the management port only on an internal network interface or behind an authenticating reverse proxy. For production alerting, consume the /api/queues endpoint with Prometheus rather than polling the UI.",
    "source": "RabbitMQ Docs — Management Plugin"
  },
  {
    "id": "b09",
    "topic": "Prefetch Count",
    "question": "¿Qué controla el ajuste prefetch count (basic.qos) en RabbitMQ?",
    "code": null,
    "options": [
      "El número máximo de colas a las que un canal puede suscribirse",
      "El número máximo de mensajes no confirmados entregados a un consumidor al mismo tiempo",
      "El tamaño máximo del mensaje en bytes",
      "El número máximo de conexiones por virtual host"
    ],
    "correctIndex": 1,
    "explanation": "El prefetch count de basic.qos limita cuántos mensajes pendientes de confirmación pueden permanecer abiertos en un canal, proporcionando control de flujo y evitando sobrecargar a los consumidores.",
    "compiledJS": "# View per-consumer prefetch in management\ncurl -u guest:guest \\\n  \"http://localhost:15672/api/consumers/%2F\" \\\n  | jq '.[].prefetch_count'\n# 10\n# 10\n# → both consumers have prefetch=10\n\n# List channels with unacked counts\nrabbitmqctl list_channels\n#  prefetch_count  messages_unacknowledged\n#  10              7",
    "bestPractice": "Set prefetch to 1 only if each message requires unpredictable time to process and fairness across consumers is critical. For throughput-optimised pipelines, experiment with prefetch values of 10–100 and benchmark. Never leave prefetch at 0 (unlimited) in production — it causes one fast consumer to absorb the entire queue depth before others can receive any messages.",
    "source": "RabbitMQ Docs — Consumer Prefetch"
  },
  {
    "id": "b10",
    "topic": "RabbitMQ vs DB",
    "question": "¿Por qué suele preferirse RabbitMQ sobre una base de datos relacional para colas de tareas?",
    "code": null,
    "options": [
      "RabbitMQ almacena los mensajes en tablas SQL para facilitar consultas",
      "RabbitMQ ofrece entrega nativa por push, confirmaciones y back-pressure sin sondeo (polling)",
      "Una base de datos no puede persistir datos tras un reinicio",
      "RabbitMQ genera esquemas SQL automáticamente para metadados de tareas"
    ],
    "correctIndex": 1,
    "explanation": "Un broker de mensajería como RabbitMQ entrega mensajes vía push, administra confirmaciones y reintentos de forma nativa y admite back-pressure, eliminando la necesidad de costosos bucles de sondeo en la base de datos.",
    "compiledJS": null,
    "bestPractice": "Use a message broker for asynchronous task dispatch and a database for business state. If you need exactly-once guarantees or durable workflow state, consider the transactional outbox pattern: write to both DB and a staging table in one transaction, then have a relay process forward staged events to RabbitMQ. This avoids dual-write inconsistency without sacrificing the broker's push-delivery benefits.",
    "source": "RabbitMQ Docs — Use Cases"
  },
  {
    "id": "i01",
    "topic": "Direct Exchange",
    "question": "¿Cómo enruta mensajes una exchange de tipo direct?",
    "code": null,
    "options": [
      "Difunde el mensaje a todas las colas vinculadas independientemente de la routing key",
      "Enruta el mensaje a las colas cuya binding key coincida con exactitud con la routing key del mensaje",
      "Utiliza atributos de las cabeceras del mensaje para decidir el enrutamiento",
      "Enruta basándose en patrones de comodines en la binding key"
    ],
    "correctIndex": 1,
    "explanation": "Una direct exchange efectúa una comparación exacta entre la routing key del mensaje y la binding key de cada cola, entregando únicamente a las colas que coinciden.",
    "compiledJS": "# Declare exchange, queues, and bindings\nrabbitmqadmin declare exchange name=events type=direct durable=true\nrabbitmqadmin declare queue name=events.orders durable=true\nrabbitmqadmin declare binding \\\n  source=events destination=events.orders routing_key=order.created\n\n# Publish — will reach events.orders\nrabbitmqadmin publish exchange=events routing_key=order.created payload=\"{...}\"\n\n# Publish — will NOT match — message dropped\nrabbitmqadmin publish exchange=events routing_key=order.updated payload=\"{...}\"",
    "bestPractice": "Use direct exchanges for precise event dispatch where each event type goes to exactly one consumer group. Define routing keys as dot-separated namespaced strings (e.g., order.created, payment.failed) and document them in a contract file checked into your repo. When you need multiple teams to consume the same event, bind multiple queues with the same key rather than switching to fanout, so you preserve per-consumer independence.",
    "source": "RabbitMQ Docs — Exchange Types — Direct"
  },
  {
    "id": "i02",
    "topic": "Fanout Exchange",
    "question": "¿Cuál es el comportamiento distintivo de una exchange fanout?",
    "code": null,
    "options": [
      "Enruta mensajes únicamente a colas cuya binding key coincida con la routing key",
      "Difunde cada mensaje a todas las colas vinculadas, ignorando totalmente la routing key",
      "Enruta mensajes utilizando patrones con comodines (* y #)",
      "Envía mensajes únicamente a colas ubicadas en el mismo nodo"
    ],
    "correctIndex": 1,
    "explanation": "Una fanout exchange duplica y distribuye cada mensaje recibido a todas las colas enlazadas a ella, siendo idónea para patrones de difusión o pub/sub.",
    "compiledJS": "# Declare fanout exchange and two subscriber queues\nrabbitmqadmin declare exchange name=notifications type=fanout durable=true\nrabbitmqadmin declare queue name=notif.email durable=true\nrabbitmqadmin declare queue name=notif.sms durable=true\nrabbitmqadmin declare binding source=notifications destination=notif.email\nrabbitmqadmin declare binding source=notifications destination=notif.sms\n\n# Publish once — both queues receive the message\nrabbitmqadmin publish exchange=notifications routing_key=\"\" payload=\"user.signup\"\n# notif.email: messages_ready=1\n# notif.sms:   messages_ready=1",
    "bestPractice": "Use fanout for true broadcast scenarios where every subscriber must receive every message regardless of content. Give each subscriber service its own exclusive queue bound to the fanout exchange so consumer failures are isolated — if the SMS service crashes, the email service is unaffected. For selective broadcast (only some subscribers want some events), use topic exchange instead.",
    "source": "RabbitMQ Docs — Exchange Types — Fanout"
  },
  {
    "id": "i03",
    "topic": "Topic Exchange",
    "question": "En la binding key de una exchange topic, ¿con qué coincide el comodín '#'?",
    "code": null,
    "options": [
      "Exactamente una palabra separada por puntos",
      "Cualquier carácter individual",
      "Cero o más palabras separadas por puntos",
      "Únicamente caracteres numéricos"
    ],
    "correctIndex": 2,
    "explanation": "En una exchange topic, '#' coincide con cero o más palabras delimitadas por puntos, mientras que '*' coincide exactamente con una palabra, posibilitando jerarquías de enrutamiento flexibles.",
    "compiledJS": "# Topic exchange routing key examples\n# Binding key        Matches                        Does NOT match\n# order.#            order.created                  payment.created\n#                    order.payment.failed\n#                    order  (zero trailing words)\n# order.*            order.created                  order.payment.failed\n#                    order.deleted\n# *.created          order.created                  order.payment.created\n#                    payment.created\n\n# Declare and bind\nrabbitmqadmin declare exchange name=events type=topic durable=true\nrabbitmqadmin declare queue name=all.order.events durable=true\nrabbitmqadmin declare binding source=events \\\n  destination=all.order.events routing_key=\"order.#\"",
    "bestPractice": "Design routing key hierarchies in decreasing specificity (e.g., domain.entity.action) so subscribers can use wildcard prefixes naturally. Avoid overly broad patterns like \"#\" on a shared topic exchange — they behave like a fanout and can overwhelm consumers not designed for high volume. Document all routing key patterns in a single schema file and enforce them with a CI check to prevent undocumented events from silently going undelivered.",
    "source": "RabbitMQ Docs — Exchange Types — Topic"
  },
  {
    "id": "i04",
    "topic": "Headers Exchange",
    "question": "¿Cómo determina una headers exchange qué colas reciben un mensaje?",
    "code": null,
    "options": [
      "Compara la routing key del mensaje contra los comodines de la binding key",
      "Ignora por completo las routing keys y enruta en función de los atributos de cabecera del mensaje que coincidan con los argumentos del binding",
      "Distribuye los mensajes en round-robin entre todas las colas vinculadas",
      "Enruta basándose en el tipo de contenido (content-type) del cuerpo del mensaje"
    ],
    "correctIndex": 1,
    "explanation": "Una headers exchange emplea el argumento de binding x-match ('all' o 'any') para cotejar las cabeceras del mensaje contra los argumentos del enlace, prescindiendo por completo de la routing key.",
    "compiledJS": "# Binding a queue to a headers exchange\n# x-match=all: message must have BOTH headers\ncurl -u guest:guest -X POST \\\n  http://localhost:15672/api/bindings/%2F/e/reports/q/pdf.reports \\\n  -H \"content-type: application/json\" \\\n  -d '{\n    \"arguments\": {\n      \"x-match\": \"all\",\n      \"format\": \"pdf\",\n      \"region\": \"eu\"\n    }\n  }'\n\n# Only messages with headers {format:pdf, region:eu} reach pdf.reports\n# x-match=any would route on format=pdf OR region=eu",
    "bestPractice": "Headers exchanges are powerful but harder to debug than direct/topic exchanges because the routing criteria are buried in binding arguments rather than visible routing keys. Prefer them only when routing criteria are truly multi-dimensional and cannot be conveniently encoded in a routing key. When you do use them, log the full header set on every published message and add management-UI dashboards showing binding arguments for quick troubleshooting.",
    "source": "RabbitMQ Docs — Exchange Types — Headers"
  },
  {
    "id": "i05",
    "topic": "Routing vs Binding Key",
    "question": "¿Cuál es la diferencia conceptual entre una routing key y una binding key en RabbitMQ?",
    "code": null,
    "options": [
      "Son términos sinónimos que representan el mismo parámetro enviado por emisor",
      "Routing key se fija en el mensaje; binding key se configura en la unión de cola",
      "Binding key se publica en el payload; routing key se define en el consumidor",
      "Routing keys operan en direct exchanges; binding keys solo en fanout exchanges"
    ],
    "correctIndex": 1,
    "explanation": "Los productores marcan cada mensaje publicado con una routing key; de manera independiente, un administrador o el código establece una binding key al enlazar una cola a una exchange, y la exchange las compara para decidir la entrega.",
    "compiledJS": "# AMQP frames — conceptual\n# Producer frame (basic.publish):\n#   exchange:    \"events\"\n#   routing-key: \"order.created\"   ← routing key (set by producer)\n\n# Admin frame (queue.bind):\n#   queue:       \"order.processor\"\n#   exchange:    \"events\"\n#   routing-key: \"order.created\"   ← binding key (set at bind time)\n\n# On a direct exchange: exact string match\n# On a topic exchange:  wildcard pattern match\n# On a fanout exchange: binding key is ignored entirely",
    "bestPractice": "Treat routing keys as part of your event contract — version them (v1.order.created) when the schema changes to avoid breaking consumers that have not updated their bindings. Store binding key patterns alongside the queue definitions in your IaC (infrastructure-as-code) repository so that adding a new consumer is an explicit, reviewed change rather than a silent ad-hoc operation.",
    "source": "RabbitMQ Docs — AMQP 0-9-1 Model — Bindings"
  },
  {
    "id": "i06",
    "topic": "DLX",
    "question": "¿Cómo se configura una Dead Letter Exchange (DLX) para una cola?",
    "code": null,
    "options": [
      "Estableciendo el argumento 'x-dead-letter-exchange' al declarar la cola",
      "Publicando directamente hacia una exchange llamada 'dlx'",
      "Habilitando el plugin rabbitmq_dlx",
      "Configurando la propiedad 'dead-letter' en cada mensaje de forma individual"
    ],
    "correctIndex": 0,
    "explanation": "Una DLX se asigna pasando el argumento 'x-dead-letter-exchange' (y opcionalmente 'x-dead-letter-routing-key') al momento de declarar la cola de origen.",
    "compiledJS": "# Declare a queue with DLX configured\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/orders \\\n  -H \"content-type: application/json\" \\\n  -d '{\n    \"durable\": true,\n    \"arguments\": {\n      \"x-dead-letter-exchange\": \"orders.dlx\",\n      \"x-dead-letter-routing-key\": \"failed\",\n      \"x-message-ttl\": 30000,\n      \"x-max-length\": 10000\n    }\n  }'\n\n# Messages that expire, are nacked, or overflow go to orders.dlx\n# with routing key \"failed\" instead of their original routing key",
    "bestPractice": "Always configure a DLX on production queues so that rejected or expired messages are preserved for analysis rather than silently dropped. Pair the DLX with a dedicated dead-letter queue and an alert on its depth — a growing DLX queue is a reliable signal of processing errors or misconfigured consumers. Periodically reprocess DLX messages by republishing them to the original exchange after fixing the underlying bug.",
    "source": "RabbitMQ Docs — Dead Letter Exchanges"
  },
  {
    "id": "i07",
    "topic": "Message TTL",
    "question": "¿Cuál es la diferencia entre una cola durable y una cola transitoria (transient)?",
    "code": null,
    "options": [
      "TTL de cola aplica a toda la cola; TTL de mensaje expira ítems particulares",
      "TTL de mensaje tiene prioridad absoluta, anulando cualquier TTL de cola activo",
      "TTL de cola requiere plugins externos; TTL de mensaje es nativo del broker AMQP",
      "Ambos mecanismos causan reacciones idénticas sin ninguna diferencia práctica"
    ],
    "correctIndex": 0,
    "explanation": "Marcar una cola como durable hace que RabbitMQ guarde su definición en disco para conservarla tras reiniciar el broker, mientras que una cola transitoria (no durable) se pierde al reiniciar.",
    "compiledJS": "# Queue-level TTL (all messages expire after 60 seconds)\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/session.events \\\n  -d '{\"durable\":true,\"arguments\":{\"x-message-ttl\":60000}}'\n\n# Per-message TTL in AMQP properties\n# (Python pika example)\nchannel.basic_publish(\n    exchange=\"events\",\n    routing_key=\"session.started\",\n    body=payload,\n    properties=pika.BasicProperties(\n        expiration=\"10000\",   # 10 s for this message only\n        delivery_mode=2\n    )\n)\n# Effective TTL = min(queue x-message-ttl, message expiration)",
    "bestPractice": "Use queue-level TTL for time-sensitive workloads where all messages have a uniform deadline (e.g., OTP codes, session events). Use per-message TTL sparingly — it complicates reasoning about queue depth and can create a head-of-line blocking effect because expired messages in the middle of the queue are only evicted when they reach the head. When in doubt, prefer queue-level TTL combined with a DLX for dead messages.",
    "source": "RabbitMQ Docs — TTL"
  },
  {
    "id": "i08",
    "topic": "Publisher Confirms",
    "question": "¿Cuál es la ventaja primordial de los publisher confirms frente a las transacciones AMQP (tx.select/tx.commit) en RabbitMQ?",
    "code": null,
    "options": [
      "Publisher confirms bloquean canales hasta que el broker confirme en disco",
      "Publisher confirms dan acks asíncronos ligeros sin el peso de two-phase commit",
      "Transacciones AMQP admiten confirmación en lote; publisher confirms solo únicas",
      "Publisher confirms funcionan exclusivamente en colas quorum de alta durabilidad"
    ],
    "correctIndex": 1,
    "explanation": "Los publisher confirms son una extensión de RabbitMQ que permite confirmaciones asíncronas mensaje a mensaje desde el broker con un impacto en el rendimiento mucho menor que las transacciones AMQP 0-9-1.",
    "compiledJS": "# Throughput comparison (approximate, single producer, durable queue)\n# Fire-and-forget:    ~50,000 msg/s\n# Publisher confirms: ~25,000 msg/s (batched acks)\n# AMQP transactions:  ~2,000  msg/s  ← ~25x slower\n\n# Enable confirms on a channel (rabbitmqadmin does not support this;\n# shown as pseudocode for clarity)\nchannel.confirm_select()       # puts channel in confirm mode\nchannel.basic_publish(...)     # send n messages\nchannel.wait_for_confirms()    # block until all acked/nacked\n# nacked delivery-tags → republish or alert",
    "bestPractice": "Use publisher confirms in async batched mode rather than waiting synchronously after every single message. Collect delivery tags as you publish and reconcile nacks in a callback. Never use AMQP transactions for new code — they exist for legacy compatibility. For at-least-once guarantee, combine publisher confirms with durable queues and persistent messages (delivery_mode=2).",
    "source": "RabbitMQ Docs — Publisher Confirms"
  },
  {
    "id": "i09",
    "topic": "Shovel Plugin",
    "question": "¿Cuál es el propósito primordial del plugin Shovel en RabbitMQ?",
    "code": null,
    "options": [
      "Espejar colas entre nodos del cluster para garantizar alta disponibilidad",
      "Mover mensajes de forma confiable entre colas o exchanges de destino",
      "Exponer cargas de colas como endpoints REST HTTP públicos para clientes",
      "Comprimir el cuerpo de mensajes usando algoritmos zstandard antes de grabar"
    ],
    "correctIndex": 1,
    "explanation": "El plugin Shovel consume mensajes continuamente de un origen (cola o exchange) y los republica en un destino, que puede encontrarse en el mismo broker o en uno remoto.",
    "compiledJS": "# Create a dynamic shovel via HTTP API\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/parameters/shovel/%2F/migrate-orders \\\n  -H \"content-type: application/json\" \\\n  -d '{\n    \"value\": {\n      \"src-protocol\": \"amqp091\",\n      \"src-uri\": \"amqp://source-broker:5672\",\n      \"src-queue\": \"orders\",\n      \"dest-protocol\": \"amqp091\",\n      \"dest-uri\": \"amqp://dest-broker:5672\",\n      \"dest-queue\": \"orders.migrated\",\n      \"ack-mode\": \"on-confirm\"\n    }\n  }'",
    "bestPractice": "Use Shovel for point-to-point message migration, disaster recovery failover, or draining a legacy broker before decomissioning it. For long-lived cross-datacenter topologies, prefer Federation (which is designed for loosely coupled, independently managed brokers) over Shovel. Always set ack-mode to on-confirm so the source message is ACKed only after the destination confirms receipt, preventing message loss during network interruptions.",
    "source": "RabbitMQ Docs — Shovel Plugin"
  },
  {
    "id": "i10",
    "topic": "Quorum Queues",
    "question": "¿Cuál es la principal diferencia arquitectónica entre las quorum queues y las classic mirrored queues?",
    "code": null,
    "options": [
      "Quorum queues usan consenso Raft; mirrored queues usan copias master-mirror",
      "Classic mirrored usan consenso Raft; quorum queues adoptan two-phase commit",
      "Quorum queues residen en un solo nodo; mirrored queues cruzan todo el cluster",
      "Ambas usan motores de replicación idénticos cambiando solo el nombre interno"
    ],
    "correctIndex": 0,
    "explanation": "Las quorum queues implementan el algoritmo de consenso distribuido Raft para ofrecer sólidas garantías de replicación, mientras que las classic mirrored queues dependían de un modelo asíncrono maestro-espejo expuesto a pérdidas de datos durante fallos.",
    "compiledJS": "# Declare a quorum queue\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/orders \\\n  -H \"content-type: application/json\" \\\n  -d '{\n    \"durable\": true,\n    \"arguments\": {\n      \"x-queue-type\": \"quorum\",\n      \"x-quorum-initial-group-size\": 3\n    }\n  }'\n\n# Verify replication state\nrabbitmqctl list_queues name type leader members\n# orders   quorum   rabbit@node1   [rabbit@node1, rabbit@node2, rabbit@node3]",
    "bestPractice": "Use quorum queues for all new production workloads that require durability and HA. Migrate away from classic mirrored queues — they were deprecated in RabbitMQ 3.9 and removed in 4.0. Size quorum queue membership at 3 or 5 nodes (always odd) to maintain a quorum during single-node failures. Quorum queues do not support per-message priority and have slightly higher write latency than classic queues — factor this in for latency-sensitive pipelines.",
    "source": "RabbitMQ Docs — Quorum Queues"
  },
  {
    "id": "a01",
    "topic": "Channel Multiplexing",
    "question": "¿Cómo permite AMQP 0-9-1 múltiples flujos lógicos de comunicación sobre una sola conexión TCP en RabbitMQ?",
    "code": null,
    "options": [
      "Abriendo múltiples sockets TCP agrupados en un solo objeto de conexión cliente",
      "Mediante canales — conexiones virtuales ligeras multiplexadas en un único TCP",
      "Usando multiplexación de streams HTTP/2 dentro del protocolo de transporte AMQP",
      "Codificando cada flujo individual de comunicación como un virtual host separado"
    ],
    "correctIndex": 1,
    "explanation": "AMQP 0-9-1 multiplexa canales sobre una sola conexión TCP; cada canal es un flujo lógico independiente con estado propio, permitiendo operaciones concurrentes sin la sobrecarga de múltiples conexiones TCP.",
    "compiledJS": "# AMQP frame structure (simplified)\n# +--------+------+--------+--..--+------+\n# | type   | chan | size   | body | 0xCE |\n# +--------+------+--------+--..--+------+\n# type: 1=method, 2=header, 3=body, 4=heartbeat\n# chan: channel number (0 = connection-level)\n\n# View open channels per connection in management\ncurl -u guest:guest \\\n  \"http://localhost:15672/api/channels\" \\\n  | jq '.[] | {connection: .connection_details.name, number: .number}'",
    "bestPractice": "Use one channel per thread or async task — channels are not thread-safe in most client libraries. Do not use a single channel for both publish and consume operations in the same goroutine/thread; use separate channels to avoid head-of-line blocking. Keep total channel count per connection below a few hundred; beyond that, consider opening additional connections or using a connection pool. Close unused channels promptly to free broker-side state.",
    "source": "AMQP 0-9-1 Specification — Channels"
  },
  {
    "id": "a02",
    "topic": "Flow Control",
    "question": "¿Qué función cumple el mecanismo channel.flow de AMQP 0-9-1?",
    "code": null,
    "options": [
      "Expande el prefetch del consumidor de forma dinámica con cargas bajas de cola",
      "Permite pausar y reanudar la entrega en el canal para aplicar contrapresión",
      "Migra un canal activo a otra conexión TCP sin interrumpir el procesamiento",
      "Vuelca todos los búferes de memoria pendientes del canal a bloques de disco"
    ],
    "correctIndex": 1,
    "explanation": "channel.flow es un método AMQP que el broker o el cliente pueden enviar para pausar (active=false) o reanudar (active=true) el flujo de mensajes en un canal, actuando como un mecanismo elemental de contrapresión (back-pressure).",
    "compiledJS": "# Broker-side flow control alarm thresholds\n# rabbitmq.conf:\nmemory_high_watermark.relative = 0.4   # 40% of RAM → memory alarm\ndisk_free_limit.absolute = 2GB          # < 2 GB free → disk alarm\n\n# When alarm fires, broker sends channel.flow(active=false)\n# to all publisher channels.\n# Management shows connection state:\ncurl -u guest:guest \\\n  \"http://localhost:15672/api/connections\" \\\n  | jq '.[] | {name:.name, state:.state}'\n# {\"name\":\"...\",\"state\":\"flow\"}  ← connection under flow control",
    "bestPractice": "Monitor for connection state=\"flow\" in the management API or Prometheus — it is a leading indicator that the broker is under memory or disk pressure before a hard block occurs. Tune the memory watermark conservatively (0.4–0.6) rather than raising it to avoid OOM kills. On the producer side, implement exponential backoff when you detect channel.flow(active=false) to avoid tight loops. Address the root cause (slow consumers, undersized broker) rather than simply raising the watermark.",
    "source": "RabbitMQ Docs — Flow Control"
  },
  {
    "id": "a03",
    "topic": "Lazy Queues",
    "question": "¿Cuál es el beneficio operativo primordial de declarar una cola como lazy queue?",
    "code": null,
    "options": [
      "Colas lazy descartan acuses de recibo para elevar la tasa de entrada de datos",
      "Colas lazy graban mensajes directo en disco, ahorrando RAM en colas profundas",
      "Colas lazy escriben en disco permanente solo al reiniciar los nodos del broker",
      "Colas lazy posponen la evaluación de bindings hasta que un consumidor conecte"
    ],
    "correctIndex": 1,
    "explanation": "Las lazy queues trasladan los mensajes a disco tan pronto como llegan en lugar de retenerlos en memoria RAM, reduciendo significativamente la presión sobre la memoria cuando se acumulan grandes colas.",
    "compiledJS": "# Declare a lazy classic queue\ncurl -u guest:guest -X PUT \\\n  http://localhost:15672/api/queues/%2F/bulk.imports \\\n  -H \"content-type: application/json\" \\\n  -d '{\n    \"durable\": true,\n    \"arguments\": {\n      \"x-queue-mode\": \"lazy\"\n    }\n  }'\n\n# Convert an existing queue via policy (no redeclare needed)\nrabbitmqctl set_policy lazy-mode \"^bulk\\.\" \\\n  '{\"queue-mode\":\"lazy\"}' --apply-to queues",
    "bestPractice": "Apply lazy mode (or use quorum queues, which are inherently disk-first) for batch import, ETL, or audit-log queues that may accumulate millions of messages overnight. Avoid lazy mode for latency-sensitive queues where sub-millisecond dequeue is required. Monitor rabbitmq_queue_disk_reads_total and rabbitmq_queue_disk_writes_total in Prometheus to measure I/O impact, and size broker disk with at least 3× the expected peak queue depth.",
    "source": "RabbitMQ Docs — Lazy Queues"
  },
  {
    "id": "a04",
    "topic": "Federation Plugin",
    "question": "¿Cuál es la principal diferencia arquitectónica entre el plugin Federation y el plugin Shovel?",
    "code": null,
    "options": [
      "Enlaces federation son fijos; conexiones shovel se eliminan tras un mensaje",
      "Federation conecta brokers autónomos; Shovel mueve mensajes punto a punto",
      "Shovel soporta AMQP 1.0; Federation opera exclusivamente con AMQP 0-9-1",
      "Ambos plugins realizan tareas idénticas, siendo Federation la API más reciente"
    ],
    "correctIndex": 1,
    "explanation": "Federation está diseñado para topologías débilmente acopladas a través de redes WAN en las que cada broker opera de manera autónoma; Shovel es una utilidad de nivel más bajo que simplemente consume de un origen y republica en un destino.",
    "compiledJS": "# Federation: upstream declaration on downstream broker\ncurl -u guest:guest -X PUT \\\n  http://downstream:15672/api/parameters/federation-upstream/%2F/us-east \\\n  -H \"content-type: application/json\" \\\n  -d '{\n    \"value\": {\n      \"uri\": \"amqp://upstream-broker:5672\",\n      \"expires\": 3600000\n    }\n  }'\n\n# Apply federation policy to all exchanges matching \"^federated\\.\"\nrabbitmqctl set_policy federate-events \"^federated\\.\" \\\n  '{\"federation-upstream-set\":\"all\"}' \\\n  --apply-to exchanges",
    "bestPractice": "Use Federation for geographically distributed deployments where each datacenter runs an independent cluster and you want events to propagate across regions without tight coupling. Use Shovel when you need deterministic point-to-point message movement (e.g., draining a queue from a decommissioned broker). Never use both for the same queue/exchange pair — the interaction can cause unexpected message duplication.",
    "source": "RabbitMQ Docs — Federation Plugin"
  },
  {
    "id": "a05",
    "topic": "Consistent Hash Exchange",
    "question": "¿Qué logra el plugin consistent hash exchange que no puede hacer una direct o topic exchange convencional?",
    "code": null,
    "options": [
      "Enruta a una sola cola por hash de clave, manteniendo claves iguales unidas",
      "Duplica mensajes a todas las colas usando reglas de deduplicación por hash",
      "Verifica el hash de integridad del payload antes de tomar decisiones de envío",
      "Distribuye mensajes en round-robin sin importar la clave de enrutamiento usada"
    ],
    "correctIndex": 0,
    "explanation": "La exchange de hash consistente emplea el hash de la routing key (o cabecera/propiedad del mensaje) para elegir de forma determinista una cola del conjunto vinculado, permitiendo particionamiento ordenado por clave con balanceo de carga.",
    "compiledJS": "# Install the plugin\nrabbitmq-plugins enable rabbitmq_consistent_hash_exchange\n\n# Declare a consistent hash exchange\nrabbitmqadmin declare exchange \\\n  name=orders.partitioned \\\n  type=x-consistent-hash \\\n  durable=true\n\n# Bind 3 queues with weight \"1\" each (equal distribution)\nrabbitmqadmin declare binding \\\n  source=orders.partitioned destination=orders.p1 routing_key=\"1\"\nrabbitmqadmin declare binding \\\n  source=orders.partitioned destination=orders.p2 routing_key=\"1\"\nrabbitmqadmin declare binding \\\n  source=orders.partitioned destination=orders.p3 routing_key=\"1\"\n# Weight \"2\" would give that queue double the hash ring slots",
    "bestPractice": "Use the consistent hash exchange when you need ordered processing of messages that share a natural partition key (e.g., user_id, order_id) across multiple parallel consumer queues. Bind queues with equal weights for uniform distribution, or use higher weights for queues on more powerful nodes. Remember that adding or removing bound queues causes re-hashing, potentially sending subsequent messages for a given key to a different queue — plan migrations carefully.",
    "source": "RabbitMQ Docs — Consistent Hash Exchange Plugin"
  },
  {
    "id": "a06",
    "topic": "Clustering",
    "question": "En un cluster de RabbitMQ, ¿cuál es la diferencia funcional entre nodos de disco (disc nodes) y nodos de memoria (RAM nodes)?",
    "code": null,
    "options": [
      "Nodos disc guardan metadatos en disco; nodos RAM los mantienen en memoria",
      "Nodos RAM rigen el enrutamiento; nodos disc gestionan persistencia de datos",
      "Nodos disc alojan quorum queues; nodos RAM rechazan enlaces de quorum queues",
      "Ambas categorías fueron deprecadas y los nodos modernos operan de modo idéntico"
    ],
    "correctIndex": 0,
    "explanation": "Los nodos de disco guardan los metadatos del cluster en almacenamiento permanente, resultando imprescindibles para el reinicio del cluster; los nodos de RAM guardan metadatos solo en memoria (el contenido de los mensajes siempre va a disco en colas persistentes, sin importar el tipo de nodo).",
    "compiledJS": "# Check node types in a cluster\nrabbitmqctl cluster_status\n# Disk Nodes:  rabbit@node1, rabbit@node2\n# RAM Nodes:   rabbit@node3\n# Running:     rabbit@node1, rabbit@node2, rabbit@node3\n\n# Change a node to RAM type (requires restart)\nrabbitmqctl change_cluster_node_type ram\n\n# RabbitMQ 3.12+ recommendation:\n# RAM nodes provide minimal benefit in modern hardware;\n# use disc nodes for all cluster members.",
    "bestPractice": "In modern deployments (RabbitMQ 3.12+), use disc nodes exclusively. The performance advantage of RAM nodes has diminished as hardware costs dropped, and RAM nodes introduce operational risk: if all RAM nodes restart simultaneously the cluster loses its entire topology and requires a complete reconfiguration. The RabbitMQ team officially recommends against RAM nodes for new clusters.",
    "source": "RabbitMQ Docs — Clustering Guide — Disc and RAM Nodes"
  },
  {
    "id": "a07",
    "topic": "Raft Consensus",
    "question": "¿Cómo emplean las quorum queues el algoritmo de consenso Raft para garantizar la seguridad de los datos?",
    "code": null,
    "options": [
      "Mensajes confirman solo cuando la mayoría de quorum de réplicas los graba",
      "Raft actúa solo en la elección de líder; la persistencia usa two-phase commit",
      "Quorum queues exigen confirmación unánime y síncrona de todas las réplicas",
      "Raft garantiza deduplicación automática de mensajes entre todos los nodos"
    ],
    "correctIndex": 0,
    "explanation": "Las quorum queues implementan Raft para replicar cada operación de encolado en la mayoría de nodos miembros antes de confirmarla, garantizando durabilidad siempre que se disponga de un quórum de nodos.",
    "compiledJS": "# Inspect quorum queue Raft state\nrabbitmq-diagnostics quorum_status orders\n# Leader:  rabbit@node1\n# Members: [rabbit@node1, rabbit@node2, rabbit@node3]\n# Log Index:       12345\n# Commit Index:    12344  ← 1 entry pending replication\n\n# Check for under-replicated queues\ncurl -u guest:guest \\\n  \"http://localhost:15672/api/queues/%2F\" \\\n  | jq '.[] | select(.type==\"quorum\") | {name:.name, members:.quorum_spi}'",
    "bestPractice": "Deploy quorum queues with an odd number of members (3 or 5) to always maintain a clear majority. Do not shrink a 3-member quorum queue to 2 members — the cluster loses its ability to tolerate any single failure. Monitor the \"under-replicated\" metric in Prometheus (rabbitmq_quorum_queue_underreplicated) and alert on it immediately — an under-replicated queue is degraded and a second failure would make it unavailable. Avoid co-locating all quorum members on the same physical rack or AZ.",
    "source": "RabbitMQ Docs — Quorum Queues — Raft"
  },
  {
    "id": "a08",
    "topic": "Policy vs Argument Precedence",
    "question": "Cuando se configuran a la vez una política de cola y un argumento de declaración (ej.: x-message-ttl) para la misma clave, ¿cuál tiene prioridad en RabbitMQ?",
    "code": null,
    "options": [
      "Políticas de cola siempre tienen prioridad sobre argumentos de declaración",
      "Argumentos de declaración siempre tienen prioridad sobre políticas de broker",
      "Argumentos fijados al crear la cola tienen prioridad sobre las políticas",
      "Ambas opciones se combinan de modo acumulativo sin anularse mutuamente"
    ],
    "correctIndex": 2,
    "explanation": "Para parámetros configurados por el operador como x-message-ttl y x-dead-letter-exchange, los argumentos de declaración de cola prevalecen sobre las políticas para esa clave, dado que se fijan al momento de su creación y resultan inmutables.",
    "compiledJS": "# Policy sets TTL to 60000 ms\nrabbitmqctl set_policy ttl-policy \"^orders$\" \\\n  '{\"message-ttl\":60000}' --apply-to queues\n\n# But queue was declared with x-message-ttl=10000\n# → effective TTL = 10000 (argument wins)\n\n# Verify effective parameters\ncurl -u guest:guest \\\n  \"http://localhost:15672/api/queues/%2F/orders\" \\\n  | jq .effective_policy_definition\n# {\"message-ttl\": 10000}  ← from declaration argument\n# policy definition shows 60000 but is overridden",
    "bestPractice": "Avoid setting queue parameters in both declaration arguments and policies — choose one mechanism per parameter and document the choice. Prefer policies for operator-managed parameters (TTL, max-length, DLX) so they can be updated without downtime or queue recreation. If a queue was declared with hardcoded arguments and you need to change them, you must delete and redeclare the queue (during a maintenance window or via a blue-green migration).",
    "source": "RabbitMQ Docs — Parameters and Policies"
  },
  {
    "id": "a09",
    "topic": "Monitoring",
    "question": "¿Qué par de métricas de gestión de RabbitMQ indica de forma más directa que los consumidores se están quedando rezagados respecto a los productores?",
    "code": null,
    "options": [
      "publish_rate y deliver_rate: cuando publish_rate supera sostenidamente a deliver_rate, messages_ready crecerá",
      "memory_used y disk_free: un aumento de memory_used con descenso de disk_free refleja desfase del consumidor",
      "connection_count y channel_count: demasiados canales indican acumulación de mensajes",
      "node_uptime y gc_reclaim_rate: una actividad intensa del recolector de basura confirma desfase del consumidor"
    ],
    "correctIndex": 0,
    "explanation": "Cuando publish_rate sobrepasa a deliver_rate, el contador messages_ready aumenta, señalando que los consumidores no dan abasto; un incremento simultáneo de messages_unacknowledged delata mensajes en tránsito todavía no confirmados.",
    "compiledJS": "# Key metrics via management HTTP API\ncurl -u guest:guest \\\n  \"http://localhost:15672/api/queues/%2F/orders\" \\\n  | jq '{\n      ready:        .messages_ready,\n      unacked:      .messages_unacknowledged,\n      publish_rate: .message_stats.publish_details.rate,\n      deliver_rate: .message_stats.deliver_details.rate\n    }'\n# {\"ready\":4500,\"unacked\":10,\"publish_rate\":120,\"deliver_rate\":30}\n# → publish 4× faster than delivery: backlog growing at ~90 msg/s",
    "bestPractice": "Set Prometheus alerts on messages_ready crossing a threshold (e.g., > 10,000 for a latency-sensitive queue) and on a sustained positive delta of (publish_rate - deliver_rate) over a 5-minute window. Pair the alert with a consumer-count check: if consumers are zero, page immediately. Export RabbitMQ metrics via the rabbitmq_prometheus plugin and build dashboards that show queue depth alongside consumer count and node memory so you can distinguish consumer failure from simply slow consumers.",
    "source": "RabbitMQ Docs — Monitoring — Key Metrics"
  },
  {
    "id": "a10",
    "topic": "Graceful Shutdown",
    "question": "¿Cuál es el enfoque recomendado para el apagado ordenado (graceful shutdown) de un consumidor en RabbitMQ para evitar la pérdida de mensajes?",
    "code": null,
    "options": [
      "Cerrar el proceso de inmediato; el broker reencola los mensajes pendientes",
      "Cancelar suscripciones, procesar ítems en vuelo, enviar ACKs y cerrar canales",
      "Llamar basic.reject y cortar el socket sin enviar tramas de cierre de AMQP",
      "Fijar prefetch en cero y esperar que el broker vacíe la cola antes de salir"
    ],
    "correctIndex": 1,
    "explanation": "El apagado ordenado requiere cancelar el consumidor (basic.cancel), procesar y confirmar todos los mensajes ya recibidos y, finalmente, cerrar de forma limpia el canal y la conexión para que RabbitMQ reencole con seguridad los mensajes pendientes si fuera necesario.",
    "compiledJS": "# Graceful shutdown sequence (pseudocode)\n# 1. Signal handler receives SIGTERM\nsignal.SIGTERM → begin_shutdown()\n\n# 2. Cancel consumer — no more deliveries\nchannel.basic_cancel(consumer_tag)\n\n# 3. Wait for in-flight messages to complete\n#    (drain internal processing queue with timeout)\nwait_for_inflight(timeout=30s)\n\n# 4. ACK/NACK all processed messages\nfor msg in processed:\n    channel.basic_ack(msg.delivery_tag)\n\n# 5. Clean close\nchannel.close(reply_code=200)\nconnection.close(reply_code=200)",
    "bestPractice": "Register a SIGTERM handler in every consumer process that triggers the graceful shutdown sequence. Set a maximum drain timeout (typically 30–60 s) so a stuck message does not block the shutdown indefinitely — NACK with requeue=true after the timeout expires. In Kubernetes, set terminationGracePeriodSeconds to a value longer than your drain timeout so the pod is not SIGKILL-ed before it finishes. Test your shutdown path in staging by sending SIGTERM and verifying zero message loss in the dead-letter queue.",
    "source": "RabbitMQ Docs — Consumer Acknowledgements — Graceful Shutdown"
  }
]
