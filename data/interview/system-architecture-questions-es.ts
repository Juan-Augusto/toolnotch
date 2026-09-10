import type { InterviewQuestion } from '@/lib/interviewTypes'

export const SYSTEM_ARCHITECTURE_QUESTIONS_ES: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "Monolith vs Microservices",
    "question": "¿Cuál es la principal diferencia entre una arquitectura monolítica y una de microservicios?",
    "code": null,
    "options": [
      "Un monolito corre en Docker; microservicios usan servidores bare-metal",
      "Un monolito se despliega en una unidad; microservicios de modo autónomo",
      "Microservicios deben compartir una sola base; monolitos aíslan esquemas",
      "Un monolito escala solo verticalmente; microservicios operan en un nodo"
    ],
    "correctIndex": 1,
    "explanation": "En una arquitectura monolítica toda la funcionalidad se empaqueta y despliega conjuntamente, mientras que los microservicios descomponen la aplicación en servicios desplegables de manera independiente.",
    "compiledJS": "# Monolith\ndocker build -t my-app .\ndocker run -p 3000:3000 my-app\n# → one process, all routes, all DB connections in one container\n\n# Microservices (docker-compose)\nversion: \"3.9\"\nservices:\n  orders:\n    image: orders-service:1.4.2\n    ports: [\"3001:3000\"]\n  payments:\n    image: payments-service:2.1.0\n    ports: [\"3002:3000\"]\n  api-gateway:\n    image: nginx:alpine\n    ports: [\"80:80\"]\n# → each service is its own container, deployed & scaled independently",
    "bestPractice": "Start with a well-structured monolith (modular monolith) and extract services only when you have clear team, scaling, or deployment boundaries. Premature microservices add network overhead and operational burden without matching benefit. Senior engineers extract a service when one module needs a different deployment cadence or technology stack, not simply because microservices are fashionable.",
    "source": "Martin Fowler — MonolithFirst"
  },
  {
    "id": "b02",
    "topic": "REST API",
    "question": "¿Qué método HTTP se utiliza convencionalmente para ACTUALIZAR un recurso existente en una API REST?",
    "code": "# Partial update (PATCH) — only the fields sent are modified\nPATCH /users/42\nContent-Type: application/json\n\n{ \"email\": \"new@example.com\" }\n\n# Full replacement (PUT) — missing fields are reset to defaults\nPUT /users/42\nContent-Type: application/json\n\n{ \"name\": \"Alice\", \"email\": \"new@example.com\", \"role\": \"admin\" }",
    "options": [
      "POST",
      "GET",
      "PUT",
      "DELETE"
    ],
    "correctIndex": 2,
    "explanation": "PUT (o PATCH para actualizaciones parciales) es la convención RESTful para actualizar un recurso existente identificado por su URI.",
    "compiledJS": "# Correct PATCH implementation in Express\napp.patch('/users/:id', async (req, res) => {\n  const updated = await db.users.update(\n    { where: { id: req.params.id } },\n    { $set: req.body }         // only supplied fields are changed\n  )\n  res.json(updated)\n})\n\n# Idempotency check: calling PUT /users/42 twice with the same body\n# MUST produce the same result — the second call is a no-op",
    "bestPractice": "Prefer PATCH over PUT for partial updates in production APIs — it reduces payload size and avoids accidentally overwriting fields the client did not intend to change. Always validate that PATCH handlers merge rather than replace. Return 200 with the updated resource or 204 with no body, depending on whether the client needs the new state.",
    "source": "RFC 7231 — HTTP/1.1 Semantics and Content"
  },
  {
    "id": "b03",
    "topic": "Docker",
    "question": "En una frase, ¿qué hace Docker?",
    "code": "# Dockerfile — build a reproducible image\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"dist/index.js\"]\n\n# Build and run\ndocker build -t my-api:1.0.0 .\ndocker run --rm -p 3000:3000 --env-file .env my-api:1.0.0",
    "options": [
      "Provisiona máquinas virtuales bare-metal en nubes públicas globales",
      "Empaqueta código y dependencias en contenedores portátiles y aislados",
      "Reemplaza el kernel del sistema operativo host para ganar agilidad",
      "Orquesta clusters de servidores y mallas de red en centros de datos"
    ],
    "correctIndex": 1,
    "explanation": "Docker emplea virtualización a nivel de sistema operativo para empaquetar el código y su entorno en contenedores ligeros y reproducibles.",
    "compiledJS": "# Verify the image runs identically in three environments\n# Local dev\ndocker run --rm my-api:1.0.0\n\n# CI pipeline (GitHub Actions)\n- name: Run integration tests\n  run: docker run --rm -e NODE_ENV=test my-api:1.0.0 npm test\n\n# Kubernetes prod\nkubectl set image deployment/api api=my-api:1.0.0\n# → same image bytes, no environment drift",
    "bestPractice": "Tag images with an immutable digest or semantic version — never use :latest in production. Use multi-stage Dockerfiles to keep runtime images small (Alpine base, no dev dependencies, no build tools). Pin the base image digest to prevent silent upstream changes that could introduce security vulnerabilities or runtime regressions.",
    "source": "Docker Docs — Dockerfile best practices"
  },
  {
    "id": "b04",
    "topic": "CI/CD",
    "question": "¿Qué significan las siglas CI/CD?",
    "code": "# .github/workflows/ci.yml — minimal CI/CD pipeline\nname: CI/CD\non:\n  push:\n    branches: [main]\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Install\n        run: npm ci\n      - name: Test\n        run: npm test\n      - name: Build image\n        run: docker build -t my-api:${{ github.sha }} .\n      - name: Push to registry\n        run: docker push my-api:${{ github.sha }}\n      - name: Deploy to staging\n        run: kubectl set image deployment/api api=my-api:${{ github.sha }}",
    "options": [
      "Container Integration / Container Delivery",
      "Continuous Inspection / Continuous Deployment",
      "Continuous Integration / Continuous Delivery",
      "Centralized Infrastructure / Cloud Deployment"
    ],
    "correctIndex": 2,
    "explanation": "CI/CD significa Integración Continua y Entrega Continua (o Despliegue Continuo), automatizando las etapas de construcción, pruebas y publicación.",
    "compiledJS": "# Deployment frequency chart — illustrates CI/CD impact\n# Before CI/CD:  monthly releases, large risky batches\n# After CI/CD:   multiple deploys per day, small safe increments\n\n# Key metrics (DORA):\n# Deployment frequency      → how often you ship\n# Lead time for changes     → commit → production time\n# Change failure rate       → % of deploys causing incidents\n# Mean time to recover      → how fast you fix a bad deploy",
    "bestPractice": "Keep the main branch always deployable: enforce required status checks (tests, lint, security scan) before merging. Use short-lived feature branches and merge frequently to avoid divergence. Trunk-based development combined with feature flags is the pattern preferred by high-performing teams because it eliminates long-lived merge conflicts.",
    "source": "Google DORA — State of DevOps Report"
  },
  {
    "id": "b05",
    "topic": "Environment Variables",
    "question": "¿Por qué se prefieren las variables de entorno sobre valores fijos en el código para almacenar secretos en una aplicación?",
    "code": "# ✗ Hard-coded secret — NEVER do this\nconst client = new S3Client({ accessKeyId: 'AKIAIOSFODNN7EXAMPLE' })\n\n# ✓ Environment variable — correct approach\nconst client = new S3Client({\n  accessKeyId: process.env.AWS_ACCESS_KEY_ID,\n  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,\n})\n\n# Inject at runtime (Docker)\ndocker run -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \\\n           -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \\\n           my-api:1.0.0",
    "options": [
      "Aceleran la compilación del código y optimizan uso de memoria del app",
      "Mantienen secretos fuera del código y permiten ajustes por ambiente",
      "Imponen cifrado automático en el nivel del sistema operativo del host",
      "Son restricciones obligatorias requeridas por el demonio de Docker"
    ],
    "correctIndex": 1,
    "explanation": "Externalizar secretos como variables de entorno evita que se suban al control de versiones y permite que la misma imagen se ejecute en desarrollo, pruebas y producción.",
    "compiledJS": "# Production-grade secret injection with AWS Secrets Manager\n# 1. Store secret in AWS\naws secretsmanager create-secret --name prod/db-password --secret-string \"s3cr3t\"\n\n# 2. At container start, fetch and export\nexport DB_PASSWORD=$(aws secretsmanager get-secret-value \\\n  --secret-id prod/db-password --query SecretString --output text)\n\n# 3. Kubernetes: mount as env from Secret object\nenv:\n  - name: DB_PASSWORD\n    valueFrom:\n      secretKeyRef:\n        name: db-credentials\n        key: password",
    "bestPractice": "Never store secrets in environment variables that are logged or exposed via /metrics or /debug endpoints. Rotate secrets automatically and use short-lived credentials (IAM roles, Workload Identity) instead of long-lived keys wherever possible. Audit access with a secrets manager audit trail.",
    "source": "12factor.net — III. Config"
  },
  {
    "id": "b06",
    "topic": "Load Balancer",
    "question": "¿Cuál es la función principal de un balanceador de carga (load balancer)?",
    "code": "# nginx.conf — upstream round-robin load balancing\nupstream api_servers {\n  server api-1:3000;\n  server api-2:3000;\n  server api-3:3000;\n}\n\nserver {\n  listen 80;\n  location / {\n    proxy_pass http://api_servers;\n    proxy_set_header X-Real-IP $remote_addr;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n  }\n}",
    "options": [
      "Comprimir respuestas HTTP antes de que lleguen al cliente",
      "Distribuir el tráfico de red entrante entre múltiples servidores",
      "Almacenar en caché los resultados de consultas a la base de datos",
      "Monitorizar registros (logs) de la aplicación en tiempo real"
    ],
    "correctIndex": 1,
    "explanation": "Un balanceador de carga enruta las solicitudes entrantes a través de un grupo de servidores para maximizar el rendimiento, minimizar la latencia y evitar la sobrecarga de un nodo individual.",
    "compiledJS": "# AWS ALB target group health check config\naws elbv2 create-target-group \\\n  --name api-targets \\\n  --protocol HTTP \\\n  --port 3000 \\\n  --health-check-path /health \\\n  --healthy-threshold-count 2 \\\n  --unhealthy-threshold-count 3\n\n# Register instances\naws elbv2 register-targets \\\n  --target-group-arn arn:aws:... \\\n  --targets Id=i-abc123 Id=i-def456 Id=i-ghi789",
    "bestPractice": "Configure health checks with tight thresholds so unhealthy instances are removed quickly. Use connection draining (deregistration delay) to allow in-flight requests to complete before an instance is removed. For Kubernetes, use Services with readiness probes rather than configuring health checks on the load balancer directly.",
    "source": "AWS Docs — Application Load Balancer"
  },
  {
    "id": "b07",
    "topic": "Horizontal Scaling",
    "question": "¿Cuál es la diferencia entre escalabilidad horizontal y vertical?",
    "code": "# Vertical scaling: resize the single EC2 instance\naws ec2 modify-instance-attribute \\\n  --instance-id i-abc123 \\\n  --instance-type '{\"Value\":\"m5.4xlarge\"}'\n# → downtime required, hard ceiling (largest available instance type)\n\n# Horizontal scaling: add more instances\naws autoscaling set-desired-capacity \\\n  --auto-scaling-group-name api-asg \\\n  --desired-capacity 6\n# → zero downtime, theoretically unlimited, requires stateless services",
    "options": [
      "La escalabilidad horizontal añade más CPU/RAM a un solo servidor; la vertical añade más servidores",
      "La escalabilidad horizontal añade más servidores; la vertical añade más CPU/RAM a un servidor existente",
      "Son el mismo concepto pero con diferentes nombres según el proveedor de nube",
      "La escalabilidad horizontal solo aplica a bases de datos; la vertical solo aplica a servidores web"
    ],
    "correctIndex": 1,
    "explanation": "Escalar horizontalmente (scale out) consiste en añadir más instancias, mientras que escalar verticalmente (scale up) implica aumentar los recursos de una instancia existente.",
    "compiledJS": "# Kubernetes HorizontalPodAutoscaler (HPA)\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: api-hpa\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: api\n  minReplicas: 3\n  maxReplicas: 20\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 60",
    "bestPractice": "Design stateless services from the start to enable horizontal scaling. Use the HPA in Kubernetes with both CPU and custom metrics (queue depth, request latency) to scale on the right signal. Always set a minimum replica count greater than 1 for production workloads to survive a pod restart without downtime.",
    "source": "Kubernetes Docs — Horizontal Pod Autoscaling"
  },
  {
    "id": "b08",
    "topic": "Reverse Proxy",
    "question": "Cuando se usa Nginx como proxy inverso, ¿qué dirección de tráfico gestiona principalmente?",
    "code": "# nginx.conf — reverse proxy with SSL termination\nserver {\n  listen 443 ssl http2;\n  server_name api.example.com;\n\n  ssl_certificate     /etc/letsencrypt/live/api.example.com/fullchain.pem;\n  ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;\n\n  location / {\n    proxy_pass         http://localhost:3000;  # backend over plain HTTP\n    proxy_http_version 1.1;\n    proxy_set_header   Upgrade $http_upgrade;\n    proxy_set_header   Connection keep-alive;\n    proxy_set_header   Host $host;\n  }\n}",
    "options": [
      "Solicitudes de servicios internos hacia la base de datos",
      "Solicitudes salientes del servidor hacia APIs externas",
      "Solicitudes entrantes de clientes reenviadas a servidores de aplicaciones backend",
      "Tráfico entre microservicios dentro de un clúster de Kubernetes"
    ],
    "correctIndex": 2,
    "explanation": "Un proxy inverso como Nginx se sitúa delante de los servidores backend, recibiendo solicitudes de clientes y reenviándolas al servicio upstream correspondiente.",
    "compiledJS": "# Effect: clients only ever see the proxy's IP\n# Backend servers are not exposed to the internet\n\n# Before reverse proxy:\n# Client → port 3000 on server (application exposed directly)\n\n# After reverse proxy:\n# Client → nginx :443 → localhost:3000 (application hidden)\n\n# Additional benefits nginx provides:\n# - gzip compression\n# - static file caching\n# - rate limiting (limit_req_zone)\n# - connection buffering (protects slow apps from slow clients)",
    "bestPractice": "Use Nginx or a cloud load balancer for SSL termination so your application servers never handle TLS overhead. Enable HTTP/2 on the proxy tier to multiplex requests and improve browser performance. In Kubernetes, use an Ingress controller (Nginx or Traefik) rather than exposing NodePorts directly.",
    "source": "Nginx Docs — Reverse Proxy"
  },
  {
    "id": "b09",
    "topic": "Health Checks",
    "question": "¿Cuál es el propósito de un endpoint de health check (por ejemplo, GET /health) en un servicio web?",
    "code": "// Express health check implementation\napp.get('/health', async (req, res) => {\n  const dbOk = await db.ping().then(() => true).catch(() => false)\n  const status = dbOk ? 200 : 503\n  res.status(status).json({\n    status: dbOk ? 'ok' : 'degraded',\n    db: dbOk,\n    uptime: process.uptime(),\n    ts: new Date().toISOString(),\n  })\n})",
    "options": [
      "Informar el consumo de CPU y memoria del proceso al usuario final",
      "Permitir a balanceadores y orquestadores validar la salud del servicio",
      "Disparar reinicios manuales y volcar volcados de memoria de procesos",
      "Exponer documentación interna de OpenAPI y contratos de endpoints"
    ],
    "correctIndex": 1,
    "explanation": "Los endpoints de health check proporcionan a las herramientas de orquestación como Kubernetes y a los balanceadores de carga una señal fiable para decidir si se debe enviar tráfico a una instancia concreta.",
    "compiledJS": "# Kubernetes liveness + readiness probe configuration\nlivenessProbe:\n  httpGet:\n    path: /health\n    port: 3000\n  initialDelaySeconds: 10\n  periodSeconds: 15\n  failureThreshold: 3   # restart pod after 3 consecutive failures\n\nreadinessProbe:\n  httpGet:\n    path: /health\n    port: 3000\n  initialDelaySeconds: 5\n  periodSeconds: 5\n  failureThreshold: 2   # remove from load balancer after 2 failures",
    "bestPractice": "Implement separate liveness and readiness endpoints. Liveness should be cheap (does the process respond?). Readiness should check all dependencies the service needs to handle a request — if the database is down, return 503 so traffic is rerouted, not just dropped. Never put a slow dependency check (e.g., a full DB query) in the liveness probe or it will trigger spurious restarts.",
    "source": "Kubernetes Docs — Configure Liveness, Readiness and Startup Probes"
  },
  {
    "id": "b10",
    "topic": "Rollback",
    "question": "En un pipeline de despliegue, ¿qué logra un rollback?",
    "code": "# Kubernetes rollback using rollout history\nkubectl rollout history deployment/api\n# REVISION  CHANGE-CAUSE\n# 1         image: api:1.3.0\n# 2         image: api:1.4.0  ← current (broken)\n\nkubectl rollout undo deployment/api\n# → reverts to revision 1 (api:1.3.0)\n\n# Pin to a specific revision\nkubectl rollout undo deployment/api --to-revision=1\n\n# Monitor rollback progress\nkubectl rollout status deployment/api",
    "options": [
      "Borra todos los registros guardados en la base desde el último release",
      "Revierte la aplicación en ejecución a una versión anterior estable",
      "Escala el total de instancias a cero para detener el tráfico entrante",
      "Restaura variables de entorno y secretos a sus valores de fábrica"
    ],
    "correctIndex": 1,
    "explanation": "Un rollback vuelve a desplegar un artefacto o imagen estable previa cuando se detecta que la versión actual presenta fallos.",
    "compiledJS": "# Helm rollback\nhelm history my-release\n# REVISION  STATUS     DESCRIPTION\n# 1         superseded installed\n# 2         deployed   upgrade to v1.4.0\n\nhelm rollback my-release 1\n# → re-installs revision 1 in seconds\n\n# GitOps rollback (ArgoCD)\ngit revert HEAD  # revert the bad commit\ngit push origin main\n# ArgoCD detects the change and syncs the cluster back automatically",
    "bestPractice": "Invest in fast rollback rather than trying to make every deployment perfect. Aim for a rollback time under 5 minutes. Keep a minimum of 3 Kubernetes deployment revisions (revisionHistoryLimit: 3). For database-backed services, design migrations to be backward-compatible (expand-contract) so you can roll back code without rolling back schema.",
    "source": "Kubernetes Docs — Deployments (rolling updates and rollbacks)"
  },
  {
    "id": "i01",
    "topic": "12-Factor App",
    "question": "El principio 'Configuración' de la metodología 12-Factor App establece que la configuración debe almacenarse en:",
    "code": "# Factor III: Config — store config in the environment\n# ✗ Wrong: config committed to code\n# config/database.yml → contains real credentials\n\n# ✓ Correct: config injected at runtime\nDATABASE_URL=postgres://user:pass@host:5432/db\nREDIS_URL=redis://cache:6379\nLOG_LEVEL=info\n\n# The same image runs in every environment\ndocker run \\\n  -e DATABASE_URL=$PROD_DB_URL \\\n  -e LOG_LEVEL=warn \\\n  my-api:1.4.0",
    "options": [
      "Un archivo de configuración incluido en el repositorio junto al código fuente",
      "Variables de entorno",
      "Un microservicio dedicado a la configuración",
      "Una tabla de base de datos relacional"
    ],
    "correctIndex": 1,
    "explanation": "El factor III de 12-Factor App estipula que todo lo que varíe entre despliegues (credenciales, descriptores de recursos) debe almacenarse en variables de entorno, no en el código.",
    "compiledJS": "# 12 Factors at a glance (all 12 for context)\n# I.   Codebase      — one repo, many deploys\n# II.  Dependencies  — explicitly declare and isolate\n# III. Config        — store in the environment ← this question\n# IV.  Backing svcs  — treat as attached resources\n# V.   Build/release/run — strictly separate stages\n# VI.  Processes     — stateless, share-nothing\n# VII. Port binding  — export services via port\n# VIII.Concurrency   — scale via the process model\n# IX.  Disposability — fast startup, graceful shutdown\n# X.   Dev/prod parity — keep environments as similar as possible\n# XI.  Logs          — treat as event streams\n# XII. Admin processes — run as one-off processes",
    "bestPractice": "Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) for sensitive values and inject them as environment variables at container startup rather than baking secrets into images or config files. Validate required environment variables at application startup and fail fast with a clear error if any are missing.",
    "source": "12factor.net — III. Config"
  },
  {
    "id": "i02",
    "topic": "Blue/Green Deploy",
    "question": "En un despliegue blue/green, ¿qué ocurre con el entorno 'blue' tras el cambio exitoso a 'green'?",
    "code": "# AWS ALB listener rule: switch all traffic to green\naws elbv2 modify-listener \\\n  --listener-arn arn:aws:elasticloadbalancing:... \\\n  --default-actions Type=forward,TargetGroupArn=$GREEN_TG_ARN\n\n# Blue is now idle but still running — ready for instant rollback\n# Rollback: point listener back to blue in < 30 seconds\naws elbv2 modify-listener \\\n  --listener-arn arn:aws:elasticloadbalancing:... \\\n  --default-actions Type=forward,TargetGroupArn=$BLUE_TG_ARN",
    "options": [
      "Se elimina permanentemente para reducir costes",
      "Sigue recibiendo el 50 % del tráfico de producción",
      "Se mantiene inactivo y puede servir como destino de rollback",
      "Se actualiza automáticamente para coincidir con el entorno green"
    ],
    "correctIndex": 2,
    "explanation": "El entorno blue anterior permanece en espera (standby) para que el tráfico pueda revertirse al instante si se detecta un fallo crítico en green.",
    "compiledJS": "# Deployment timeline\n# T=0   Blue (v1.3) serving 100% traffic\n# T=5m  Green (v1.4) deployed alongside blue — no traffic yet\n# T=10m Smoke tests pass on green\n# T=11m ALB rule updated: 100% traffic → green\n# T=11m Blue still running, receiving 0% traffic\n# T=11m+30m  No alerts fired → blue decommissioned\n# T=12m (if bug found) ALB rule reverted to blue in <30 seconds\n\n# Kubernetes equivalent: two Deployments, one Service selector\n# kubectl patch service api -p '{\"spec\":{\"selector\":{\"version\":\"green\"}}}'",
    "bestPractice": "Run automated smoke tests against the green environment before the cutover. Use weighted routing (e.g., Route 53 weighted records or ALB weighted target groups) to do a brief canary validation on a small traffic slice before committing 100% to green. Keep the blue environment alive for at least the p99 session length of your users.",
    "source": "Martin Fowler — BlueGreenDeployment"
  },
  {
    "id": "i03",
    "topic": "Kubernetes",
    "question": "En Kubernetes, ¿cuál es la función de un Pod?",
    "code": "# Kubernetes Pod manifest\napiVersion: v1\nkind: Pod\nmetadata:\n  name: api-pod\n  labels:\n    app: api\nspec:\n  containers:\n    - name: api\n      image: my-api:1.4.0\n      ports:\n        - containerPort: 3000\n      env:\n        - name: DATABASE_URL\n          valueFrom:\n            secretKeyRef:\n              name: db-secret\n              key: url\n    - name: log-sidecar        # second container shares same network\n      image: fluentd:v1.16",
    "options": [
      "El binario del control plane que programa contenedores en los nodos",
      "La menor unidad desplegable, uniendo contenedores con red y disco común",
      "Una capa de abstracción de máquina virtual gestionada por hypervisor",
      "El manifiesto YAML declarativo que fija políticas de seguridad del cluster"
    ],
    "correctIndex": 1,
    "explanation": "Un Pod es la unidad atómica de despliegue en Kubernetes: los contenedores dentro de un mismo Pod comparten dirección IP, red localhost y volúmenes montados.",
    "compiledJS": "# Deployment wraps Pods with desired-state management\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: api\n  template:            # ← this is the Pod template\n    metadata:\n      labels:\n        app: api\n    spec:\n      containers:\n        - name: api\n          image: my-api:1.4.0\n          resources:\n            requests: { cpu: \"100m\", memory: \"128Mi\" }\n            limits:   { cpu: \"500m\", memory: \"256Mi\" }",
    "bestPractice": "Never deploy bare Pods in production — always use a Deployment or StatefulSet so Kubernetes can reschedule them on node failure. Set both resource requests and limits so the scheduler can bin-pack efficiently and prevent a runaway container from starving others on the same node. Use PodDisruptionBudgets to protect availability during node upgrades.",
    "source": "Kubernetes Docs — Pods"
  },
  {
    "id": "i04",
    "topic": "Service Discovery",
    "question": "¿Cuál es la principal diferencia entre el descubrimiento de servicios (service discovery) basado en DNS y basado en registro?",
    "code": "# DNS-based (Kubernetes internal DNS)\n# Service name resolves automatically within the cluster\nconst res = await fetch('http://payments-service:3000/pay')\n# → CoreDNS resolves payments-service → ClusterIP\n\n# Registry-based (Consul)\nconst consul = new Consul()\nconst services = await consul.health.service('payments')\nconst { Address, Port } = services[0].Service\nconst res = await fetch(`http://${Address}:${Port}/pay`)\n# → client queries Consul for a live, healthy instance",
    "options": [
      "Descubrimiento DNS opera en un host; registros operan entre múltiples hosts",
      "Descubrimiento DNS resuelve nombres a IPs; registros consultan nodos vivos",
      "Descubrimiento por registro genera cuellos de botella en cada llamada HTTP",
      "Ambos mecanismos logran el mismo resultado y usan la misma API interna"
    ],
    "correctIndex": 1,
    "explanation": "El descubrimiento basado en DNS recurre a registros DNS tradicionales para el enrutamiento, mientras que el descubrimiento con registro consulta herramientas como Consul o Eureka para disponer de una lista actualizada de instancias operativas.",
    "compiledJS": "# Consul service registration\ncurl -XPUT http://consul:8500/v1/agent/service/register \\\n  -d '{\n    \"Name\": \"payments\",\n    \"Address\": \"10.0.1.42\",\n    \"Port\": 3001,\n    \"Check\": {\n      \"HTTP\": \"http://10.0.1.42:3001/health\",\n      \"Interval\": \"10s\"\n    }\n  }'\n\n# Kubernetes DNS — automatic, no registration needed\n# CoreDNS rule: <service>.<namespace>.svc.cluster.local",
    "bestPractice": "In Kubernetes, rely on DNS-based service discovery for east-west traffic — it is automatic, low-overhead, and works without client-side libraries. For multi-datacenter or hybrid environments where Kubernetes DNS does not span the network boundary, use Consul or a service mesh (Istio) for cross-cluster discovery with health checking.",
    "source": "Consul Docs — Service Discovery"
  },
  {
    "id": "i05",
    "topic": "API Gateway",
    "question": "¿Qué problema resuelve el patrón API Gateway en una arquitectura de microservicios?",
    "code": "# Kong API Gateway — route + auth + rate limiting in one config\n_format_version: \"3.0\"\nservices:\n  - name: orders-service\n    url: http://orders:3000\n    routes:\n      - name: orders-route\n        paths: [/orders]\n    plugins:\n      - name: jwt           # auth — handled centrally\n      - name: rate-limiting\n        config:\n          minute: 100       # 100 req/min per consumer\n      - name: request-transformer\n        config:\n          add:\n            headers: [\"X-Request-ID:$(uuid)\"]",
    "options": [
      "Reemplaza colas de mensajería entre microservicios mediante sockets UDP directos punto a punto de baja latencia",
      "Provee un punto de entrada único para clientes, gestionando enrutamiento, autenticación y límites de peticiones",
      "Sincroniza transacciones ACID distribuidas entre bases de datos de microservicios usando protocolo two-phase commit",
      "Elimina la necesidad de que administradores configuren probes de inicio y verificaciones de salud en contenedores"
    ],
    "correctIndex": 1,
    "explanation": "Un API Gateway actúa como puerta de acceso principal para todas las peticiones de clientes, centralizando aspectos como autenticación, terminación SSL y enrutamiento de solicitudes al margen de los servicios individuales.",
    "compiledJS": "# Architecture diagram (as comment)\n# Client\n#   ↓ HTTPS\n# [API Gateway]  ← auth, rate-limit, routing, logging, SSL termination\n#   ↙       ↘\n# [Orders]  [Payments]  [Users]   ← internal services (plain HTTP)\n#   ↓          ↓           ↓\n# [Order DB] [Pay DB]  [User DB]\n\n# Without gateway: each service implements auth independently\n# With gateway:    one JWT validation plugin protects all routes",
    "bestPractice": "Keep the gateway thin — routing, auth, rate limiting, and observability headers only. Do not put business logic in the gateway. Use a Backend-for-Frontend (BFF) pattern when different client types (mobile, web, third-party) need significantly different API shapes — each BFF sits behind the gateway and aggregates calls for its specific client.",
    "source": "NGINX — What is an API Gateway?"
  },
  {
    "id": "i06",
    "topic": "Stateless Services",
    "question": "¿Por qué los microservicios deben diseñarse para ser sin estado (stateless)?",
    "code": "# ✗ Stateful — session stored in memory\n// app.ts\nconst sessions = new Map()  // dies if the pod restarts\n\n// ✓ Stateless — session in Redis (external store)\nimport Redis from 'ioredis'\nconst redis = new Redis(process.env.REDIS_URL)\n\napp.use(session({\n  store: new RedisStore({ client: redis }),\n  secret: process.env.SESSION_SECRET,\n  resave: false,\n  saveUninitialized: false,\n}))\n# → any pod can handle any request",
    "options": [
      "Servicios stateless corren más rápido al no persistir datos en disco",
      "Servicios stateless escalan horizontalmente sin migrar estado de sesión",
      "Servicios stateless descartan el uso de balanceadores de carga reversos",
      "Servicios stateless son el único patrón admitido en clusters Kubernetes"
    ],
    "correctIndex": 1,
    "explanation": "Cuando un servicio no almacena estado local, cualquier instancia puede procesar cualquier solicitud, facilitando enormemente el escalado horizontal y la recuperación ante fallos.",
    "compiledJS": "# Kubernetes: stateless deployment vs StatefulSet\n# Stateless: simple Deployment, any pod can restart freely\nkubectl scale deployment/api --replicas=5\nkubectl rollout restart deployment/api  # zero downtime\n\n# Stateful: StatefulSet with stable network identity + PVCs\n# → much harder: ordered startup, sticky storage, DNS names\n# → use only for databases, Kafka, Elasticsearch\nkubectl get statefulset elasticsearch\n# NAME            READY   AGE\n# elasticsearch   3/3     30d",
    "bestPractice": "Externalise all state to dedicated backing services: sessions to Redis, files to object storage (S3), queued work to SQS or Kafka. This is the share-nothing architecture described in the 12-Factor App. The only data that should live in a container's ephemeral filesystem is non-critical scratch data that you can reconstruct.",
    "source": "12factor.net — VI. Processes"
  },
  {
    "id": "i07",
    "topic": "Circuit Breaker",
    "question": "En el patrón Circuit Breaker, ¿qué representa el estado 'Half-Open'?",
    "code": "// Circuit breaker states (pseudo-TypeScript)\ntype CBState = 'Closed' | 'Open' | 'HalfOpen'\n\nclass CircuitBreaker {\n  state: CBState = 'Closed'\n  failureCount = 0\n  readonly threshold = 5\n  readonly timeout = 30_000   // 30s before trying again\n\n  async call<T>(fn: () => Promise<T>): Promise<T> {\n    if (this.state === 'Open') throw new Error('Circuit open — fast-fail')\n\n    try {\n      const result = await fn()\n      if (this.state === 'HalfOpen') this.reset()  // success → close\n      return result\n    } catch (err) {\n      this.recordFailure()\n      throw err\n    }\n  }\n\n  private recordFailure() {\n    if (++this.failureCount >= this.threshold) {\n      this.state = 'Open'\n      setTimeout(() => { this.state = 'HalfOpen' }, this.timeout)\n    }\n  }\n  private reset() { this.state = 'Closed'; this.failureCount = 0 }\n}",
    "options": [
      "El circuito fue apagado en forma permanente por operadores y descarta cualquier llamada hacia el servicio downstream",
      "El circuito permite el paso de peticiones de prueba para evaluar si el servicio downstream se recuperó de la caída",
      "El circuito opera con tasa máxima de peticiones tras confirmar que el servicio downstream recuperó su salud normal",
      "El circuito bloquea llamadas externas conservando solo la emisión de logs y métricas de auditoría hacia daemons locales"
    ],
    "correctIndex": 1,
    "explanation": "El estado Half-Open es una fase de sondeo: se envía un número reducido de solicitudes; si tienen éxito el circuito vuelve a cerrarse, de lo contrario se reabre.",
    "compiledJS": "# Resilience4j configuration (Java — widely used reference)\nresilience4j:\n  circuitbreaker:\n    instances:\n      payments:\n        slidingWindowSize: 10\n        failureRateThreshold: 50        # open after 50% failures\n        waitDurationInOpenState: 30s    # stay open for 30s\n        permittedNumberOfCallsInHalfOpenState: 3  # probe calls\n        slowCallRateThreshold: 80       # also trip on slow calls\n        slowCallDurationThreshold: 2s",
    "bestPractice": "Combine circuit breakers with fallback logic: when the circuit is open, return a cached response, a degraded response, or a user-friendly error — not a 500. Use libraries like Resilience4j (JVM), Polly (.NET), or opossum (Node.js) rather than implementing circuit breakers from scratch. Expose circuit breaker state as a Prometheus metric so you can alert on open circuits.",
    "source": "Martin Fowler — Circuit Breaker"
  },
  {
    "id": "i08",
    "topic": "Rate Limiting",
    "question": "¿En qué se diferencia el algoritmo token bucket del algoritmo leaky bucket para la limitación de tasa (rate limiting)?",
    "code": "// Token bucket — allows bursts\nclass TokenBucket {\n  private tokens: number\n  constructor(\n    private readonly capacity: number,    // e.g. 100\n    private readonly refillRate: number,  // tokens per second\n  ) { this.tokens = capacity }\n\n  consume(n = 1): boolean {\n    this.refill()\n    if (this.tokens < n) return false  // reject\n    this.tokens -= n\n    return true   // allow burst up to capacity\n  }\n  private refill() { /* add refillRate tokens per elapsed second */ }\n}\n\n// Leaky bucket — strict constant output\n// Requests queue; bucket drains at fixed rate regardless of input",
    "options": [
      "Token bucket impone una tasa de salida estrictamente constante; leaky bucket permite ráfagas hasta la capacidad del depósito",
      "Token bucket permite ráfagas hasta la capacidad del depósito; leaky bucket impone una tasa de salida estrictamente constante",
      "Son idénticos: únicamente nombres distintos empleados por diferentes proveedores",
      "Leaky bucket solo se usa para tráfico UDP; token bucket es para HTTP"
    ],
    "correctIndex": 1,
    "explanation": "Token bucket acumula fichas con el tiempo y tolera ráfagas al gastar múltiples fichas a la vez, mientras que leaky bucket procesa a una tasa fija y constante sin importar la velocidad de entrada.",
    "compiledJS": "# Redis-based token bucket (Node.js)\nconst CAPACITY = 100\nconst REFILL_RATE = 10   # tokens per second\n\nasync function isAllowed(userId: string): Promise<boolean> {\n  const key = `rate:${userId}`\n  const now = Date.now() / 1000\n\n  const [tokens, lastRefill] = await redis.hmget(key, 'tokens', 'last')\n  const elapsed = now - (Number(lastRefill) || now)\n  const refilled = Math.min(CAPACITY, (Number(tokens) || CAPACITY) + elapsed * REFILL_RATE)\n\n  if (refilled < 1) return false\n\n  await redis.hset(key, { tokens: refilled - 1, last: now })\n  await redis.expire(key, 3600)\n  return true\n}",
    "bestPractice": "Store rate-limit state in Redis rather than in-process memory so it works correctly when multiple application instances are running. Return 429 Too Many Requests with a Retry-After header so well-behaved clients know when to retry. Implement separate rate limits per API key, per IP, and per endpoint — a single global limit is too blunt.",
    "source": "Cloudflare Docs — Rate Limiting"
  },
  {
    "id": "i09",
    "topic": "Immutable Infrastructure",
    "question": "¿Qué significa 'infraestructura inmutable'?",
    "code": "# Mutable (traditional) — patch in place ← avoid\nssh prod-server \"apt-get upgrade -y nginx && systemctl reload nginx\"\n# → configuration drift, unknown state, unrepeatable\n\n# Immutable — replace, never patch ← correct\n# 1. Build new image with updated nginx\ndocker build -t my-app:1.5.0 --build-arg NGINX_VERSION=1.25.3 .\ndocker push registry/my-app:1.5.0\n\n# 2. Roll out new instances\nkubectl set image deployment/app app=registry/my-app:1.5.0\n\n# 3. Old pods are terminated; new ones spin up from the immutable image\n# → every running instance is in a known, tested state",
    "options": [
      "Servidores reciben parches in-place y nunca se reinician en el cluster",
      "Servidores nunca se modifican; cambios despliegan nuevas instancias limpias",
      "Archivos de configuración viven en buckets S3 de almacenamiento de solo lectura",
      "Todos los servidores del cluster deben compartir hardware idéntico de base"
    ],
    "correctIndex": 1,
    "explanation": "La infraestructura inmutable trata a los servidores como artefactos desechables: en lugar de actualizar servidores en vivo, se compila una nueva imagen y se despliegan instancias limpias, erradicando el desfase de configuración.",
    "compiledJS": "# HashiCorp Packer — build an immutable AMI\nsource \"amazon-ebs\" \"api\" {\n  ami_name      = \"my-api-{{timestamp}}\"\n  instance_type = \"t3.medium\"\n  source_ami_filter {\n    filters = { name = \"ubuntu/images/hvm-ssd/ubuntu-22.04-amd64-server-*\" }\n  }\n}\n\nbuild {\n  sources = [\"source.amazon-ebs.api\"]\n  provisioner \"shell\" {\n    inline = [\n      \"apt-get update -y\",\n      \"apt-get install -y nodejs=20.*\",\n      \"npm install -g pm2\",\n    ]\n  }\n}\n# → new AMI ID: ami-0abc123  (never SSH into it again)",
    "bestPractice": "Combine immutable infrastructure with GitOps: every change to a running system must go through a pull request that builds a new image. Use image scanning (Trivy, Snyk) in the build pipeline so vulnerabilities are caught before deployment. Tag images with the git commit SHA so you always know exactly what code is running.",
    "source": "HashiCorp — What is Immutable Infrastructure?"
  },
  {
    "id": "i10",
    "topic": "Readiness Probes",
    "question": "¿Por qué una actualización gradual (rolling update) en Kubernetes utiliza readiness probes antes de enviar tráfico a los nuevos pods?",
    "code": "# Deployment with readiness probe — zero-downtime rolling update\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api\nspec:\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 1        # allow 1 extra pod during update\n      maxUnavailable: 0  # never remove an old pod until a new one is ready\n  template:\n    spec:\n      containers:\n        - name: api\n          image: my-api:1.5.0\n          readinessProbe:\n            httpGet:\n              path: /health\n              port: 3000\n            initialDelaySeconds: 5\n            periodSeconds: 5\n            failureThreshold: 2",
    "options": [
      "Verificar que la firma criptográfica de la imagen coincida con el registry",
      "Asegurar que el nuevo pod esté listo para servir antes de apagar el viejo",
      "Dosificar la tasa de despliegue para no saturar el scheduler del cluster",
      "Ejecutar migraciones de base de datos antes de liberar las conexiones"
    ],
    "correctIndex": 1,
    "explanation": "Kubernetes condiciona el tráfico a las readiness probes para garantizar despliegues graduales sin tiempo de inactividad: un pod solo entra en la rotación del balanceador de carga cuando supera la sonda con éxito.",
    "compiledJS": "# Observe a zero-downtime rolling update\nkubectl get pods -w\n# NAME                   READY   STATUS\n# api-75f8c-xkv2q        1/1     Running   ← old pod\n# api-9d4bf-pmnr7        0/1     Running   ← new pod (starting)\n# api-9d4bf-pmnr7        1/1     Running   ← readiness probe passed\n# api-75f8c-xkv2q        1/1     Terminating ← old pod removed AFTER new one is ready\n\n# Check readiness probe status\nkubectl describe pod api-9d4bf-pmnr7 | grep -A5 \"Readiness\"",
    "bestPractice": "Always set both readiness and liveness probes on production containers. Keep readiness probe logic fast (< 1 second) but meaningful — check that the app has loaded its config and connected to the database. Use initialDelaySeconds to give the container time to start before probing begins, and set a conservative failureThreshold so a momentary blip does not pull a healthy pod from rotation.",
    "source": "Kubernetes Docs — Configure Liveness, Readiness and Startup Probes"
  },
  {
    "id": "a01",
    "topic": "Expand-Contract Migration",
    "question": "¿En qué consiste el patrón expand-contract (cambio paralelo) para migraciones de bases de datos?",
    "code": "-- Phase 1: EXPAND — add new column alongside old one\n-- Both old and new application code can run simultaneously\nALTER TABLE users ADD COLUMN full_name TEXT;\n\n-- Backfill (batched to avoid lock contention)\nUPDATE users SET full_name = first_name || ' ' || last_name\nWHERE full_name IS NULL AND id BETWEEN 1 AND 100000;\n\n-- Phase 2: Deploy new application code that writes to BOTH columns\n-- Phase 3: CONTRACT — once old code is fully replaced, drop old column\nALTER TABLE users DROP COLUMN first_name, DROP COLUMN last_name;",
    "options": [
      "Ejecutar respaldo completo antes y después de cada alteración de esquema",
      "Expandir el esquema para ambos formatos, actualizar código y contraer el viejo",
      "Escalar el cluster de base horizontalmente antes de iniciar migraciones",
      "Usar feature flags para ocultar columnas hasta finalizar la indexación"
    ],
    "correctIndex": 1,
    "explanation": "El patrón expand-contract desacopla las modificaciones de esquema de los despliegues de código para que las versiones antigua y nueva de la aplicación funcionen en paralelo, permitiendo migraciones sin tiempo de inactividad.",
    "compiledJS": "# Zero-downtime migration timeline\n# Day 0 — EXPAND:  ALTER TABLE users ADD COLUMN full_name TEXT\n#                   (nullable — old code ignores it, no breakage)\n# Day 1 — BACKFILL: UPDATE users SET full_name = first_name || ' ' || last_name\n# Day 2 — DEPLOY v2: code writes to first_name, last_name, AND full_name\n# Day 3 — DEPLOY v3: code reads only from full_name (old columns still exist)\n# Day 4 — CONTRACT:  ALTER TABLE users DROP COLUMN first_name, DROP COLUMN last_name\n\n# Tools that implement this: Flyway, Liquibase, golang-migrate\n# Run with --dry-run first to see the generated SQL",
    "bestPractice": "Never apply a destructive migration (DROP COLUMN, ALTER TYPE with USING) in the same deployment as the code change that removes references to it. Always ship the expand phase first, wait for the rollout to stabilise (at minimum one successful deployment cycle), then ship the contract phase. Use a migration tool with a lock timeout (lock_timeout = 3s in PostgreSQL) to prevent migrations from holding exclusive locks for too long.",
    "source": "Martin Fowler — Parallel Change"
  },
  {
    "id": "a02",
    "topic": "Idempotency",
    "question": "En el contexto de los sistemas distribuidos, ¿qué garantiza la idempotencia de una API?",
    "code": "// Idempotent payment handler using idempotency key\napp.post('/payments', async (req, res) => {\n  const idempotencyKey = req.headers['idempotency-key']\n  if (!idempotencyKey) return res.status(400).json({ error: 'missing idempotency-key' })\n\n  // Check if we already processed this request\n  const cached = await redis.get(`idem:${idempotencyKey}`)\n  if (cached) {\n    return res.status(200).json(JSON.parse(cached))  // replay stored response\n  }\n\n  // Process the payment once\n  const result = await chargeCard(req.body)\n\n  // Store result for 24 hours\n  await redis.setex(`idem:${idempotencyKey}`, 86400, JSON.stringify(result))\n  res.status(201).json(result)\n})",
    "options": [
      "Que una solicitud siempre se procesará en menos de 100 ms",
      "Que realizar la misma solicitud múltiples veces produce el mismo resultado que haberla ejecutado una sola vez",
      "Que la API reintentará automáticamente solicitudes fallidas en nombre del cliente",
      "Que cada solicitud es procesada exactamente por una sola instancia de servidor"
    ],
    "correctIndex": 1,
    "explanation": "La idempotencia resulta fundamental para reintentos seguros en redes poco fiables: si el cliente desconoce si una solicitud prosperó, reenviarla no debe originar efectos secundarios duplicados.",
    "compiledJS": "# Stripe-style idempotency key\ncurl -X POST https://api.stripe.com/v1/charges \\\n  -H \"Idempotency-Key: a1b2c3d4-unique-per-intent\" \\\n  -d amount=2000 \\\n  -d currency=usd \\\n  -d source=tok_visa\n\n# If the network drops and you retry with the SAME key:\n# → Stripe returns the SAME response, does NOT charge twice\n\n# Message consumer idempotency (SQS)\nasync function processMessage(msg: SQSMessage) {\n  const dedupeKey = msg.MessageId\n  const alreadyProcessed = await db.processedMessages.findOne(dedupeKey)\n  if (alreadyProcessed) return  // skip — already handled\n  await doWork(msg.Body)\n  await db.processedMessages.insert(dedupeKey)\n}",
    "bestPractice": "Use a UUID idempotency key generated by the client, stored with the request result in Redis or the database. On retry, return the previously stored response without re-executing side effects. For message consumers, use the message ID as the deduplication key and implement an at-least-once + idempotent-consumer pattern rather than trying to guarantee exactly-once delivery at the broker level.",
    "source": "Stripe API Docs — Idempotent Requests"
  },
  {
    "id": "a03",
    "topic": "Saga Pattern",
    "question": "¿Cuál es la principal diferencia entre el descubrimiento de servicios (service discovery) basado en DNS y basado en registro?",
    "code": "// Orchestration: a central SagaOrchestrator drives each step\nclass OrderSagaOrchestrator {\n  async execute(orderId: string) {\n    await this.inventoryService.reserve(orderId)     // step 1\n    try {\n      await this.paymentService.charge(orderId)      // step 2\n    } catch {\n      await this.inventoryService.release(orderId)   // compensate step 1\n      throw new SagaFailedError()\n    }\n    await this.shippingService.schedule(orderId)     // step 3\n  }\n}\n\n// Choreography: services react to domain events (no central brain)\n// OrderPlaced → InventoryService → InventoryReserved\n// InventoryReserved → PaymentService → PaymentCharged\n// PaymentFailed → InventoryService listens → releases reservation",
    "options": [
      "Coreografía usa coordinador centralizado; orquestación adopta pub/sub de eventos",
      "Coreografía hace a servicios reaccionar a eventos; orquestación usa orquestador",
      "Coreografía se limita a consultas; orquestación se enfoca en escrituras de datos",
      "Ambos patrones son implementaciones idénticas compartiendo el mismo coordinador"
    ],
    "correctIndex": 1,
    "explanation": "El descubrimiento basado en DNS recurre a registros DNS tradicionales para el enrutamiento, mientras que el descubrimiento con registro consulta herramientas como Consul o Eureka para disponer de una lista actualizada de instancias operativas.",
    "compiledJS": "# Event-driven choreography (AWS EventBridge)\n# OrderService publishes:\n{\n  \"source\": \"order-service\",\n  \"detail-type\": \"OrderPlaced\",\n  \"detail\": { \"orderId\": \"ord-123\", \"items\": [...] }\n}\n\n# InventoryService rule (EventBridge):\n{\n  \"source\": [\"order-service\"],\n  \"detail-type\": [\"OrderPlaced\"]\n}\n# → triggers Lambda: reserve stock, emit InventoryReserved\n\n# Orchestration (AWS Step Functions)\n# OrderSaga state machine:\n# [ReserveInventory] → [ChargePayment] → [ScheduleShipping]\n#         ↓ (on failure)\n# [ReleaseInventory] → [RefundPayment]",
    "bestPractice": "Use choreography for simple, linear flows where each service is clearly the owner of one domain event. Prefer orchestration when you need complex compensation logic, conditional branching, or easy visibility into saga state — AWS Step Functions or Temporal make this tractable. Always design compensating transactions before implementing the forward path.",
    "source": "DDIA — Chapter 9: Consistency and Consensus"
  },
  {
    "id": "a04",
    "topic": "Strangler Fig",
    "question": "El patrón Strangler Fig se utiliza para:",
    "code": "# Strangler Fig implementation with Nginx routing\n# Step 1: Route old paths to monolith, new /payments to microservice\nupstream monolith  { server legacy:8080; }\nupstream payments  { server payments-svc:3000; }\n\nserver {\n  listen 80;\n  # New microservice handles /payments\n  location /payments {\n    proxy_pass http://payments;\n  }\n  # Everything else still goes to the monolith\n  location / {\n    proxy_pass http://monolith;\n  }\n}\n\n# Step 2: Migrate /orders → Step 3: Migrate /users → retire monolith",
    "options": [
      "Reemplaza monolitos legados de forma gradual enrutando funciones a microservicios hasta poder retirar el sistema viejo",
      "Estrangula el tráfico del sistema viejo mediante throttling para forzar a usuarios a migrar a las nuevas APIs antes",
      "Inyecta fallos deliberados en servicios legados en producción para descubrir dependencias circulares ocultas del app",
      "Envuelve tablas de bases legadas con una capa de ORM para aislar el código de persistencia de la lógica de negocio"
    ],
    "correctIndex": 0,
    "explanation": "Inspirado en la higuera estranguladora, este patrón intercepta peticiones dirigidas al sistema antiguo y las desvía progresivamente hacia nuevos servicios hasta dar de baja definitiva al sistema heredado.",
    "compiledJS": "# Migration progress tracker (as comments)\n# Month 1: /payments       → migrated to payments-service ✓\n# Month 2: /orders         → migrated to orders-service   ✓\n# Month 3: /users          → migrated to users-service    ✓\n# Month 4: /inventory      → migrated to inventory-service✓\n# Month 5: /notifications  → migrated to notify-service   ✓\n# Month 6: monolith decommissioned — no more strangler fig needed\n\n# Key: the proxy/facade is the control point\n# Nginx, API Gateway (Kong), AWS API Gateway, or Ambassador all work\n# The facade also handles data migration and backward compat",
    "bestPractice": "Identify the bounded contexts in the monolith before migrating — each context becomes a candidate microservice. Migrate leaf features (those with few inbound dependencies) first to build confidence. Never try to run two systems against the same database without a clear data ownership boundary; add an anti-corruption layer to translate between the monolith's data model and the new service's model.",
    "source": "Martin Fowler — Strangler Fig Application"
  },
  {
    "id": "a05",
    "topic": "Chaos Engineering",
    "question": "¿Cuál es el objetivo principal de herramientas de ingeniería del caos como Chaos Monkey y Gremlin?",
    "code": "# Gremlin attack: terminate a random pod in production\ngremlin attack-container \\\n  --target-container api \\\n  --attack shutdown\n\n# Chaos Monkey (Netflix) equivalent for Kubernetes — Chaos Mesh\napiVersion: chaos-mesh.org/v1alpha1\nkind: PodChaos\nmetadata:\n  name: kill-api-pod\nspec:\n  action: pod-kill\n  mode: one\n  selector:\n    namespaces: [production]\n    labelSelectors:\n      app: api\n  scheduler:\n    cron: \"@every 1h\"   # kill a random api pod every hour",
    "options": [
      "Probar bases relacionales disparando millones de escrituras simuladas",
      "Inyectar fallos en producción para revelar debilidades antes de caídas reales",
      "Simular latencia de red exclusivamente durante pruebas en homologación",
      "Ejecutar fuzzing en peticiones de API para identificar fallas de seguridad"
    ],
    "correctIndex": 1,
    "explanation": "La ingeniería del caos introduce turbulencias de manera intencionada (apagando instancias, descartando paquetes de red, agotando CPU) para verificar que los mecanismos de resiliencia del sistema funcionen antes de una incidencia real.",
    "compiledJS": "# Chaos engineering workflow\n# 1. Define the steady state (what \"normal\" looks like)\n#    e.g., p99 latency < 200ms, error rate < 0.1%\n\n# 2. Hypothesise that steady state holds during the attack\n# 3. Introduce the experiment (Chaos Mesh, Gremlin)\n# 4. Observe metrics (Prometheus/Grafana)\n\n# Example Chaos Mesh network partition experiment\napiVersion: chaos-mesh.org/v1alpha1\nkind: NetworkChaos\nmetadata:\n  name: delay-payments\nspec:\n  action: delay\n  mode: one\n  selector:\n    labelSelectors:\n      app: payments-service\n  delay:\n    latency: \"500ms\"\n    jitter: \"100ms\"\n  duration: \"5m\"",
    "bestPractice": "Start chaos experiments in staging, establish a clear steady-state metric, and have a kill switch ready before running experiments in production. Run experiments during business hours when the on-call team is available. Document every experiment and its outcome — the value is in the learning and in the system improvements that follow, not in the breaking itself.",
    "source": "Principles of Chaos Engineering — principlesofchaos.org"
  },
  {
    "id": "a06",
    "topic": "Service Mesh",
    "question": "¿Qué proporciona una malla de servicios (service mesh) como Istio o Linkerd que no ofrezca un API Gateway tradicional?",
    "code": "# Istio — automatic mTLS between ALL service-to-service calls\n# No application code changes required — the sidecar handles it\napiVersion: security.istio.io/v1beta1\nkind: PeerAuthentication\nmetadata:\n  name: default\n  namespace: production\nspec:\n  mtls:\n    mode: STRICT   # all east-west traffic encrypted + authenticated\n\n# Traffic shifting: canary 10% to v2\napiVersion: networking.istio.io/v1alpha3\nkind: VirtualService\nmetadata:\n  name: orders\nspec:\n  http:\n    - route:\n        - destination: { host: orders, subset: v1 }\n          weight: 90\n        - destination: { host: orders, subset: v2 }\n          weight: 10",
    "options": [
      "Un gateway externo único enrutando llamadas públicas de clientes hacia dentro",
      "Mutual TLS, observabilidad y enrutamiento fino entre servicios del cluster",
      "Autoscaling horizontal de pods basado en la tasa de la interfaz de red",
      "Resolución DNS para servicios distribuidos entre varios namespaces del cluster"
    ],
    "correctIndex": 1,
    "explanation": "Una service mesh opera en la capa este-oeste (servicio a servicio) a través de proxies sidecar, ofreciendo cifrado mTLS, circuit breaker y telemetría para toda la comunicación interna, más allá de lo que gestiona un API Gateway norte-sur.",
    "compiledJS": "# What Istio offloads from your application code\n# Before service mesh: each service implements:\n# - mTLS certificate management\n# - distributed tracing (add trace headers)\n# - circuit breaking (custom code)\n# - retry logic\n# - rate limiting\n\n# After Istio:\n# - mTLS: automatic (PeerAuthentication STRICT)\n# - tracing: Envoy sidecar injects B3 trace headers\n# - circuit breaking: DestinationRule outlierDetection\n# - retries: VirtualService retries spec\n# - rate limiting: EnvoyFilter or external rate limiter",
    "bestPractice": "Do not adopt a service mesh just because it is popular. Istio adds significant operational complexity (CRDs, Envoy configuration, certificate rotation). Evaluate Linkerd first if your primary needs are mTLS and observability — it is lighter-weight. If you are already using Kubernetes network policies and OpenTelemetry, you may get 80% of the benefit with much less complexity.",
    "source": "Istio Docs — What is a Service Mesh?"
  },
  {
    "id": "a07",
    "topic": "GitOps",
    "question": "En GitOps (usando ArgoCD o Flux), ¿cuál es la fuente única de verdad para el estado deseado del clúster?",
    "code": "# ArgoCD Application — declares that the cluster must match the Git repo\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: production-api\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/myorg/k8s-manifests\n    targetRevision: HEAD\n    path: apps/api/overlays/production\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: production\n  syncPolicy:\n    automated:\n      prune: true      # remove resources deleted from Git\n      selfHeal: true   # revert manual cluster changes",
    "options": [
      "El estado de los contenedores en ejecución en los nodos de producción",
      "Un repositorio Git con manifiestos declarativos de la infra y la app",
      "La imagen más reciente compilada por la pipeline de integración continua (CI)",
      "Un runbook operacional de infraestructura archivado en la wiki de ingeniería"
    ],
    "correctIndex": 1,
    "explanation": "GitOps establece que el repositorio Git es el registro de autoridad del estado deseado; el controlador de GitOps reconcilia de manera continua el clúster en vivo para ajustarlo a lo declarado en dicho repositorio.",
    "compiledJS": "# GitOps workflow\n# 1. Developer opens PR: changes Deployment image tag in git repo\n#    apps/api/overlays/production/kustomization.yaml:\n#      images:\n#        - name: my-api\n#          newTag: 1.5.0   ← changed from 1.4.0\n\n# 2. PR reviewed and merged to main\n\n# 3. ArgoCD detects drift (repo ≠ cluster)\n# 4. ArgoCD reconciles: kubectl apply (no kubectl from a human)\n\n# 5. Rollback = git revert PR + merge\n#    ArgoCD re-applies → cluster reverts in seconds\n\n# Audit trail: every cluster change has a git commit + PR link",
    "bestPractice": "Use a separate Git repository for infrastructure manifests (the \"config repo\") rather than mixing it with application code. Enable branch protection and require PR reviews for the config repo. Use Kustomize or Helm to manage environment-specific overlays rather than duplicating manifests. Set up ArgoCD notifications to Slack so the team is alerted when apps fall out of sync.",
    "source": "ArgoCD Docs — Getting Started with GitOps"
  },
  {
    "id": "a08",
    "topic": "Multi-Region Active-Active",
    "question": "En una arquitectura multirregión activo-activo, ¿qué desafío de consistencia debe resolverse de forma explícita?",
    "code": "# CockroachDB multi-region — handles write conflicts automatically\n# Region topology\nCREATE DATABASE mydb PRIMARY REGION \"us-east1\"\n  REGIONS \"eu-west1\", \"ap-southeast1\";\n\n# REGIONAL BY ROW — each row is homed in the region where it was written\nALTER TABLE orders SET LOCALITY REGIONAL BY ROW;\n\n# Application-level conflict resolution — last-write-wins with vector clock\ninterface WriteIntent {\n  key: string\n  value: unknown\n  timestamp: number     // lamport clock\n  region: string\n}\n// On conflict: compare timestamps; if equal, region name is tie-breaker",
    "options": [
      "Asegurar que todas las regiones usen el mismo digest de imagen de contenedor",
      "Tratar conflictos de escritura y lag cuando regiones mutan datos en paralelo",
      "Enrutar escrituras a una sola región primaria para evitar conflictos locales",
      "Sincronizar relojes de hardware de los nodos entre regiones usando NTP"
    ],
    "correctIndex": 1,
    "explanation": "Las arquitecturas activo-activo permiten operaciones de escritura en todas las regiones, por lo que el sistema debe definir una estrategia de resolución de conflictos (como last-write-wins, CRDTs o relojes vectoriales) y tolerar el retraso transitorio de replicación.",
    "compiledJS": "# AWS Global Tables (DynamoDB) — managed multi-region active-active\naws dynamodb create-global-table \\\n  --global-table-name Orders \\\n  --replication-group RegionName=us-east-1 RegionName=eu-west-1 RegionName=ap-southeast-1\n\n# DynamoDB uses last-writer-wins (wall clock) for conflict resolution\n# Approximate replication lag: < 1 second under normal conditions\n\n# Custom conflict resolution pattern (event sourcing)\n# Append-only event log per region → merge event streams by timestamp\n# → no conflicts, full history, eventual consistency",
    "bestPractice": "Choose the right consistency model for each data type: user profiles can tolerate eventual consistency, payment records cannot. Use event sourcing or append-only data structures wherever possible — they avoid write conflicts by design. Define your Recovery Point Objective (RPO) and Recovery Time Objective (RTO) before choosing a replication strategy, since lower RPO means higher write latency.",
    "source": "DDIA — Chapter 5: Replication"
  },
  {
    "id": "a09",
    "topic": "FinOps",
    "question": "¿Qué combinación de estrategias describe mejor el right-sizing y la optimización de costes de FinOps para infraestructura en la nube?",
    "code": "# AWS Cost Explorer: identify over-provisioned instances\naws ce get-rightsizing-recommendation \\\n  --service \"AmazonEC2\" \\\n  --configuration '{\"RecommendationTarget\":\"SAME_INSTANCE_FAMILY\",\"BenefitsConsidered\":true}'\n\n# Kubernetes: VPA right-sizes pod CPU/memory requests\napiVersion: autoscaling.k8s.io/v1\nkind: VerticalPodAutoscaler\nmetadata:\n  name: api-vpa\nspec:\n  targetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: api\n  updatePolicy:\n    updateMode: \"Off\"   # recommendation-only; apply manually in prod",
    "options": [
      "Contratar instancias reservadas de 3 años para abaratar el costo por hora",
      "Dimensionar instancias por métricas, usando nodos spot y autoscaling dinámico",
      "Sobredimensionar instancias 3x para garantizar margen ante picos de uso",
      "Migrar nodos a la región más barata de la nube sin importar el usuario final"
    ],
    "correctIndex": 1,
    "explanation": "La optimización en FinOps se apoya en tres palancas complementarias: right-sizing (adecuar los recursos de instancias/pods a la utilización real medida, no a conjeturas), instancias spot/preemptibles (60–90% más económicas que bajo demanda; seguras para cargas sin estado y tolerantes a fallos) y auto-scaling (escalar a cero o casi cero durante periodos de bajo tráfico).",
    "compiledJS": "# KEDA: scale to zero when no messages in queue\napiVersion: keda.sh/v1alpha1\nkind: ScaledObject\nmetadata:\n  name: worker-scaler\nspec:\n  scaleTargetRef:\n    name: queue-worker\n  minReplicaCount: 0   # scale to zero at night\n  maxReplicaCount: 50\n  triggers:\n    - type: aws-sqs-queue\n      metadata:\n        queueURL: https://sqs.us-east-1.amazonaws.com/.../jobs\n        queueLength: \"5\"   # 1 pod per 5 messages\n\n# Spot instance node group (EKS managed node group)\n# → 70% cost saving for batch / stateless workers",
    "bestPractice": "Tag all cloud resources with team, environment, and service labels to allocate costs accurately. Review utilisation weekly in the first 3 months of a new service — it is common to provision for worst-case load and then never adjust. Use Spot instances for CI/CD workers, batch jobs, and stateless APIs with retries; use on-demand for stateful databases and control plane components that must not be interrupted.",
    "source": "FinOps Foundation — FinOps Framework"
  },
  {
    "id": "a10",
    "topic": "Observability",
    "question": "¿Cuáles son los tres pilares de la observabilidad completa en un sistema distribuido y por qué son importantes los IDs de correlación?",
    "code": "// OpenTelemetry: propagate correlation ID across all services\nimport { trace, context, propagation } from '@opentelemetry/api'\n\napp.use((req, res, next) => {\n  // Extract trace context from incoming headers (W3C TraceContext)\n  const ctx = propagation.extract(context.active(), req.headers)\n  const span = trace.getTracer('api').startSpan('http.request', {}, ctx)\n\n  // Attach correlation ID to logs\n  const traceId = span.spanContext().traceId\n  req.log = logger.child({ traceId, service: 'api' })\n  req.log.info({ method: req.method, path: req.url }, 'request received')\n\n  context.with(trace.setSpan(ctx, span), () => next())\n  res.on('finish', () => span.end())\n})",
    "options": [
      "Uptime, latencia, errores; correlation IDs asocian alertas a guardias",
      "Logs, métricas, traces; correlation IDs rastrean peticiones de punta a punta",
      "Dashboards, alertas, runbooks; correlation IDs reemplazan tracing distribuido",
      "CPU, memoria, disco; correlation IDs vinculan métricas a despliegues de apps"
    ],
    "correctIndex": 1,
    "explanation": "Logs, métricas y trazas distribuidas constituyen los tres pilares de la observabilidad; un ID de correlación propagado a través de cada llamada entre servicios conecta las tres fuentes, permitiendo reconstruir el recorrido completo de una petición en una arquitectura de microservicios.",
    "compiledJS": "# OpenTelemetry Collector pipeline\n# app → OTLP → OTel Collector → Jaeger (traces) + Prometheus (metrics) + Loki (logs)\n\n# Grafana query: find all logs for a specific trace\n{service=\"payments\"} | json | traceId=\"4bf92f3577b34da6a3ce929d0e0e4736\"\n\n# Jaeger: visualise the full request journey\n# api (50ms) → orders (30ms) → payments (120ms ← bottleneck)\n#                            ↘ inventory (15ms)\n\n# Prometheus alert: high error rate triggers investigation\n# → query Jaeger for failing trace IDs\n# → search Loki logs by those trace IDs for root cause",
    "bestPractice": "Instrument every service with OpenTelemetry from day one — it is vendor-neutral and lets you switch between Jaeger, Zipkin, Datadog, or Honeycomb without code changes. Generate trace IDs at the API gateway and propagate them in the traceparent header (W3C TraceContext). Attach the trace ID to every log line so you can pivot from a log alert directly to the distributed trace.",
    "source": "OpenTelemetry Docs — What is Observability?"
  }
]
