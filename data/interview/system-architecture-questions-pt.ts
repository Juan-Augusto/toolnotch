import type { InterviewQuestion } from '@/lib/interviewTypes'

export const SYSTEM_ARCHITECTURE_QUESTIONS_PT: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "Monolith vs Microservices",
    "question": "Qual é a principal diferença entre uma arquitetura monolítica e uma de microsserviços?",
    "code": null,
    "options": [
      "Um monólito roda em Docker; microsserviços usam máquinas bare-metal",
      "Um monólito é implantado como unidade só; microsserviços de modo autônomo",
      "Microsserviços devem compartilhar um banco só; monólitos isolam esquemas",
      "Um monólito escala só verticalmente; microsserviços rodam em um só nó"
    ],
    "correctIndex": 1,
    "explanation": "Em uma arquitetura monolítica, todas as funcionalidades são agrupadas e implantadas juntas, enquanto os microsserviços decompõem a aplicação em serviços que podem ser implantados de forma independente.",
    "compiledJS": "# Monolith\ndocker build -t my-app .\ndocker run -p 3000:3000 my-app\n# → one process, all routes, all DB connections in one container\n\n# Microservices (docker-compose)\nversion: \"3.9\"\nservices:\n  orders:\n    image: orders-service:1.4.2\n    ports: [\"3001:3000\"]\n  payments:\n    image: payments-service:2.1.0\n    ports: [\"3002:3000\"]\n  api-gateway:\n    image: nginx:alpine\n    ports: [\"80:80\"]\n# → each service is its own container, deployed & scaled independently",
    "bestPractice": "Start with a well-structured monolith (modular monolith) and extract services only when you have clear team, scaling, or deployment boundaries. Premature microservices add network overhead and operational burden without matching benefit. Senior engineers extract a service when one module needs a different deployment cadence or technology stack, not simply because microservices are fashionable.",
    "source": "Martin Fowler — MonolithFirst"
  },
  {
    "id": "b02",
    "topic": "REST API",
    "question": "Qual método HTTP é convencionalmente utilizado para ATUALIZAR um recurso existente em uma API REST?",
    "code": "# Partial update (PATCH) — only the fields sent are modified\nPATCH /users/42\nContent-Type: application/json\n\n{ \"email\": \"new@example.com\" }\n\n# Full replacement (PUT) — missing fields are reset to defaults\nPUT /users/42\nContent-Type: application/json\n\n{ \"name\": \"Alice\", \"email\": \"new@example.com\", \"role\": \"admin\" }",
    "options": [
      "POST",
      "GET",
      "PUT",
      "DELETE"
    ],
    "correctIndex": 2,
    "explanation": "O método PUT (ou PATCH para atualizações parciais) é a convenção RESTful para atualizar um recurso existente identificado por sua URI.",
    "compiledJS": "# Correct PATCH implementation in Express\napp.patch('/users/:id', async (req, res) => {\n  const updated = await db.users.update(\n    { where: { id: req.params.id } },\n    { $set: req.body }         // only supplied fields are changed\n  )\n  res.json(updated)\n})\n\n# Idempotency check: calling PUT /users/42 twice with the same body\n# MUST produce the same result — the second call is a no-op",
    "bestPractice": "Prefer PATCH over PUT for partial updates in production APIs — it reduces payload size and avoids accidentally overwriting fields the client did not intend to change. Always validate that PATCH handlers merge rather than replace. Return 200 with the updated resource or 204 with no body, depending on whether the client needs the new state.",
    "source": "RFC 7231 — HTTP/1.1 Semantics and Content"
  },
  {
    "id": "b03",
    "topic": "Docker",
    "question": "Em uma frase, o que o Docker faz?",
    "code": "# Dockerfile — build a reproducible image\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"dist/index.js\"]\n\n# Build and run\ndocker build -t my-api:1.0.0 .\ndocker run --rm -p 3000:3000 --env-file .env my-api:1.0.0",
    "options": [
      "Provisiona máquinas virtuais bare-metal em nuvens públicas globais",
      "Empacota código e dependências em contêineres portáteis e isolados",
      "Substitui o kernel do sistema operacional host para ganhar agilidade",
      "Orquestra clusters de servidores e malhas de rede em data centers"
    ],
    "correctIndex": 1,
    "explanation": "O Docker utiliza virtualização em nível de sistema operacional para empacotar o código e seu ambiente de execução em contêineres leves e reproduzíveis.",
    "compiledJS": "# Verify the image runs identically in three environments\n# Local dev\ndocker run --rm my-api:1.0.0\n\n# CI pipeline (GitHub Actions)\n- name: Run integration tests\n  run: docker run --rm -e NODE_ENV=test my-api:1.0.0 npm test\n\n# Kubernetes prod\nkubectl set image deployment/api api=my-api:1.0.0\n# → same image bytes, no environment drift",
    "bestPractice": "Tag images with an immutable digest or semantic version — never use :latest in production. Use multi-stage Dockerfiles to keep runtime images small (Alpine base, no dev dependencies, no build tools). Pin the base image digest to prevent silent upstream changes that could introduce security vulnerabilities or runtime regressions.",
    "source": "Docker Docs — Dockerfile best practices"
  },
  {
    "id": "b04",
    "topic": "CI/CD",
    "question": "O que significa a sigla CI/CD?",
    "code": "# .github/workflows/ci.yml — minimal CI/CD pipeline\nname: CI/CD\non:\n  push:\n    branches: [main]\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Install\n        run: npm ci\n      - name: Test\n        run: npm test\n      - name: Build image\n        run: docker build -t my-api:${{ github.sha }} .\n      - name: Push to registry\n        run: docker push my-api:${{ github.sha }}\n      - name: Deploy to staging\n        run: kubectl set image deployment/api api=my-api:${{ github.sha }}",
    "options": [
      "Container Integration / Container Delivery",
      "Continuous Inspection / Continuous Deployment",
      "Continuous Integration / Continuous Delivery",
      "Centralized Infrastructure / Cloud Deployment"
    ],
    "correctIndex": 2,
    "explanation": "CI/CD significa Integração Contínua e Entrega Contínua (ou Implantação Contínua), automatizando pipelines de compilação, testes e lançamento.",
    "compiledJS": "# Deployment frequency chart — illustrates CI/CD impact\n# Before CI/CD:  monthly releases, large risky batches\n# After CI/CD:   multiple deploys per day, small safe increments\n\n# Key metrics (DORA):\n# Deployment frequency      → how often you ship\n# Lead time for changes     → commit → production time\n# Change failure rate       → % of deploys causing incidents\n# Mean time to recover      → how fast you fix a bad deploy",
    "bestPractice": "Keep the main branch always deployable: enforce required status checks (tests, lint, security scan) before merging. Use short-lived feature branches and merge frequently to avoid divergence. Trunk-based development combined with feature flags is the pattern preferred by high-performing teams because it eliminates long-lived merge conflicts.",
    "source": "Google DORA — State of DevOps Report"
  },
  {
    "id": "b05",
    "topic": "Environment Variables",
    "question": "Por que variáveis de ambiente são preferíveis em relação a valores embutidos no código para segredos de uma aplicação?",
    "code": "# ✗ Hard-coded secret — NEVER do this\nconst client = new S3Client({ accessKeyId: 'AKIAIOSFODNN7EXAMPLE' })\n\n# ✓ Environment variable — correct approach\nconst client = new S3Client({\n  accessKeyId: process.env.AWS_ACCESS_KEY_ID,\n  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,\n})\n\n# Inject at runtime (Docker)\ndocker run -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \\\n           -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \\\n           my-api:1.0.0",
    "options": [
      "Aceleram a compilação do código e otimizam alocação de memória do app",
      "Mantêm segredos fora do código e permitem configurações por ambiente",
      "Impoem criptografia automática no nível do sistema operacional host",
      "São restrições obrigatórias exigidas diretamente pelo daemon do Docker"
    ],
    "correctIndex": 1,
    "explanation": "Externalizar segredos como variáveis de ambiente evita que sejam adicionados ao controle de versão e permite que a mesma imagem execute em desenvolvimento, homologação e produção.",
    "compiledJS": "# Production-grade secret injection with AWS Secrets Manager\n# 1. Store secret in AWS\naws secretsmanager create-secret --name prod/db-password --secret-string \"s3cr3t\"\n\n# 2. At container start, fetch and export\nexport DB_PASSWORD=$(aws secretsmanager get-secret-value \\\n  --secret-id prod/db-password --query SecretString --output text)\n\n# 3. Kubernetes: mount as env from Secret object\nenv:\n  - name: DB_PASSWORD\n    valueFrom:\n      secretKeyRef:\n        name: db-credentials\n        key: password",
    "bestPractice": "Never store secrets in environment variables that are logged or exposed via /metrics or /debug endpoints. Rotate secrets automatically and use short-lived credentials (IAM roles, Workload Identity) instead of long-lived keys wherever possible. Audit access with a secrets manager audit trail.",
    "source": "12factor.net — III. Config"
  },
  {
    "id": "b06",
    "topic": "Load Balancer",
    "question": "Qual é o principal papel de um balanceador de carga?",
    "code": "# nginx.conf — upstream round-robin load balancing\nupstream api_servers {\n  server api-1:3000;\n  server api-2:3000;\n  server api-3:3000;\n}\n\nserver {\n  listen 80;\n  location / {\n    proxy_pass http://api_servers;\n    proxy_set_header X-Real-IP $remote_addr;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n  }\n}",
    "options": [
      "Comprimir respostas HTTP antes que cheguem ao cliente",
      "Distribuir o tráfego de rede de entrada entre múltiplos servidores",
      "Armazenar em cache os resultados de consultas ao banco de dados",
      "Monitorar logs da aplicação em tempo real"
    ],
    "correctIndex": 1,
    "explanation": "Um balanceador de carga encaminha as requisições recebidas para um pool de servidores a fim de maximizar a vazão, minimizar a latência e evitar a sobrecarga de qualquer nó individual.",
    "compiledJS": "# AWS ALB target group health check config\naws elbv2 create-target-group \\\n  --name api-targets \\\n  --protocol HTTP \\\n  --port 3000 \\\n  --health-check-path /health \\\n  --healthy-threshold-count 2 \\\n  --unhealthy-threshold-count 3\n\n# Register instances\naws elbv2 register-targets \\\n  --target-group-arn arn:aws:... \\\n  --targets Id=i-abc123 Id=i-def456 Id=i-ghi789",
    "bestPractice": "Configure health checks with tight thresholds so unhealthy instances are removed quickly. Use connection draining (deregistration delay) to allow in-flight requests to complete before an instance is removed. For Kubernetes, use Services with readiness probes rather than configuring health checks on the load balancer directly.",
    "source": "AWS Docs — Application Load Balancer"
  },
  {
    "id": "b07",
    "topic": "Horizontal Scaling",
    "question": "Qual é a diferença entre escalabilidade horizontal e vertical?",
    "code": "# Vertical scaling: resize the single EC2 instance\naws ec2 modify-instance-attribute \\\n  --instance-id i-abc123 \\\n  --instance-type '{\"Value\":\"m5.4xlarge\"}'\n# → downtime required, hard ceiling (largest available instance type)\n\n# Horizontal scaling: add more instances\naws autoscaling set-desired-capacity \\\n  --auto-scaling-group-name api-asg \\\n  --desired-capacity 6\n# → zero downtime, theoretically unlimited, requires stateless services",
    "options": [
      "Escalabilidade horizontal adiciona mais CPU/RAM a um único servidor; escalabilidade vertical adiciona mais servidores",
      "Escalabilidade horizontal adiciona mais servidores; escalabilidade vertical adiciona mais CPU/RAM a um servidor existente",
      "São o mesmo conceito, mas com nomes diferentes em cada provedor de nuvem",
      "Escalabilidade horizontal aplica-se apenas a bancos de dados; escalabilidade vertical aplica-se apenas a servidores web"
    ],
    "correctIndex": 1,
    "explanation": "Escalar horizontalmente (scale out) significa adicionar mais instâncias, enquanto escalar verticalmente (scale up) significa aumentar os recursos de uma instância existente.",
    "compiledJS": "# Kubernetes HorizontalPodAutoscaler (HPA)\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: api-hpa\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: api\n  minReplicas: 3\n  maxReplicas: 20\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 60",
    "bestPractice": "Design stateless services from the start to enable horizontal scaling. Use the HPA in Kubernetes with both CPU and custom metrics (queue depth, request latency) to scale on the right signal. Always set a minimum replica count greater than 1 for production workloads to survive a pod restart without downtime.",
    "source": "Kubernetes Docs — Horizontal Pod Autoscaling"
  },
  {
    "id": "b08",
    "topic": "Reverse Proxy",
    "question": "Quando o Nginx é usado como proxy reverso, qual direção de tráfego ele gerencia principalmente?",
    "code": "# nginx.conf — reverse proxy with SSL termination\nserver {\n  listen 443 ssl http2;\n  server_name api.example.com;\n\n  ssl_certificate     /etc/letsencrypt/live/api.example.com/fullchain.pem;\n  ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;\n\n  location / {\n    proxy_pass         http://localhost:3000;  # backend over plain HTTP\n    proxy_http_version 1.1;\n    proxy_set_header   Upgrade $http_upgrade;\n    proxy_set_header   Connection keep-alive;\n    proxy_set_header   Host $host;\n  }\n}",
    "options": [
      "Requisições de serviços internos para o banco de dados",
      "Requisições de saída do servidor para APIs externas",
      "Requisições de clientes recebidas que são encaminhadas para servidores de aplicação backend",
      "Tráfego entre microsserviços dentro de um cluster Kubernetes"
    ],
    "correctIndex": 2,
    "explanation": "Um proxy reverso como o Nginx fica posicionado à frente dos servidores backend, recebendo as requisições dos clientes e encaminhando-as para o serviço upstream apropriado.",
    "compiledJS": "# Effect: clients only ever see the proxy's IP\n# Backend servers are not exposed to the internet\n\n# Before reverse proxy:\n# Client → port 3000 on server (application exposed directly)\n\n# After reverse proxy:\n# Client → nginx :443 → localhost:3000 (application hidden)\n\n# Additional benefits nginx provides:\n# - gzip compression\n# - static file caching\n# - rate limiting (limit_req_zone)\n# - connection buffering (protects slow apps from slow clients)",
    "bestPractice": "Use Nginx or a cloud load balancer for SSL termination so your application servers never handle TLS overhead. Enable HTTP/2 on the proxy tier to multiplex requests and improve browser performance. In Kubernetes, use an Ingress controller (Nginx or Traefik) rather than exposing NodePorts directly.",
    "source": "Nginx Docs — Reverse Proxy"
  },
  {
    "id": "b09",
    "topic": "Health Checks",
    "question": "Qual é o propósito de um endpoint de health check (por exemplo, GET /health) em um serviço web?",
    "code": "// Express health check implementation\napp.get('/health', async (req, res) => {\n  const dbOk = await db.ping().then(() => true).catch(() => false)\n  const status = dbOk ? 200 : 503\n  res.status(status).json({\n    status: dbOk ? 'ok' : 'degraded',\n    db: dbOk,\n    uptime: process.uptime(),\n    ts: new Date().toISOString(),\n  })\n})",
    "options": [
      "Retornar o consumo de CPU e alocação de heap ao usuário da aplicação",
      "Permitir que balanceadores e orquestradores validem a saúde do serviço",
      "Disparar reinicializações manuais e coletar core dumps de diagnóstico",
      "Expor documentação interna de OpenAPI e schemas de endpoints do app"
    ],
    "correctIndex": 1,
    "explanation": "Endpoints de verificação de integridade (health check) fornecem a ferramentas de orquestração como o Kubernetes e balanceadores de carga um sinal confiável para decidir se o tráfego deve ser enviado a uma determinada instância.",
    "compiledJS": "# Kubernetes liveness + readiness probe configuration\nlivenessProbe:\n  httpGet:\n    path: /health\n    port: 3000\n  initialDelaySeconds: 10\n  periodSeconds: 15\n  failureThreshold: 3   # restart pod after 3 consecutive failures\n\nreadinessProbe:\n  httpGet:\n    path: /health\n    port: 3000\n  initialDelaySeconds: 5\n  periodSeconds: 5\n  failureThreshold: 2   # remove from load balancer after 2 failures",
    "bestPractice": "Implement separate liveness and readiness endpoints. Liveness should be cheap (does the process respond?). Readiness should check all dependencies the service needs to handle a request — if the database is down, return 503 so traffic is rerouted, not just dropped. Never put a slow dependency check (e.g., a full DB query) in the liveness probe or it will trigger spurious restarts.",
    "source": "Kubernetes Docs — Configure Liveness, Readiness and Startup Probes"
  },
  {
    "id": "b10",
    "topic": "Rollback",
    "question": "Em um pipeline de implantação, o que um rollback realiza?",
    "code": "# Kubernetes rollback using rollout history\nkubectl rollout history deployment/api\n# REVISION  CHANGE-CAUSE\n# 1         image: api:1.3.0\n# 2         image: api:1.4.0  ← current (broken)\n\nkubectl rollout undo deployment/api\n# → reverts to revision 1 (api:1.3.0)\n\n# Pin to a specific revision\nkubectl rollout undo deployment/api --to-revision=1\n\n# Monitor rollback progress\nkubectl rollout status deployment/api",
    "options": [
      "Apaga todos os dados gravados no banco desde a última versão lançada",
      "Reverte a aplicação em execução para uma versão anterior estável",
      "Escala a quantidade de instâncias para zero para cortar o tráfego",
      "Restaura variáveis de ambiente e segredos para seus valores padrões"
    ],
    "correctIndex": 1,
    "explanation": "Um rollback implanta novamente um artefato ou imagem estável anterior quando a versão atual apresenta defeitos.",
    "compiledJS": "# Helm rollback\nhelm history my-release\n# REVISION  STATUS     DESCRIPTION\n# 1         superseded installed\n# 2         deployed   upgrade to v1.4.0\n\nhelm rollback my-release 1\n# → re-installs revision 1 in seconds\n\n# GitOps rollback (ArgoCD)\ngit revert HEAD  # revert the bad commit\ngit push origin main\n# ArgoCD detects the change and syncs the cluster back automatically",
    "bestPractice": "Invest in fast rollback rather than trying to make every deployment perfect. Aim for a rollback time under 5 minutes. Keep a minimum of 3 Kubernetes deployment revisions (revisionHistoryLimit: 3). For database-backed services, design migrations to be backward-compatible (expand-contract) so you can roll back code without rolling back schema.",
    "source": "Kubernetes Docs — Deployments (rolling updates and rollbacks)"
  },
  {
    "id": "i01",
    "topic": "12-Factor App",
    "question": "O fator 'Configurações' da metodologia The Twelve-Factor App estabelece que as configurações devem ser armazenadas em:",
    "code": "# Factor III: Config — store config in the environment\n# ✗ Wrong: config committed to code\n# config/database.yml → contains real credentials\n\n# ✓ Correct: config injected at runtime\nDATABASE_URL=postgres://user:pass@host:5432/db\nREDIS_URL=redis://cache:6379\nLOG_LEVEL=info\n\n# The same image runs in every environment\ndocker run \\\n  -e DATABASE_URL=$PROD_DB_URL \\\n  -e LOG_LEVEL=warn \\\n  my-api:1.4.0",
    "options": [
      "Um arquivo de configuração commitado junto ao código-fonte",
      "Variáveis de ambiente",
      "Um microsserviço dedicado a configurações",
      "Uma tabela de banco de dados relacional"
    ],
    "correctIndex": 1,
    "explanation": "O fator III do 12-Factor App determina que qualquer elemento que varie entre implantações (credenciais, handles de recursos) deve ser armazenado em variáveis de ambiente, nunca no código.",
    "compiledJS": "# 12 Factors at a glance (all 12 for context)\n# I.   Codebase      — one repo, many deploys\n# II.  Dependencies  — explicitly declare and isolate\n# III. Config        — store in the environment ← this question\n# IV.  Backing svcs  — treat as attached resources\n# V.   Build/release/run — strictly separate stages\n# VI.  Processes     — stateless, share-nothing\n# VII. Port binding  — export services via port\n# VIII.Concurrency   — scale via the process model\n# IX.  Disposability — fast startup, graceful shutdown\n# X.   Dev/prod parity — keep environments as similar as possible\n# XI.  Logs          — treat as event streams\n# XII. Admin processes — run as one-off processes",
    "bestPractice": "Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) for sensitive values and inject them as environment variables at container startup rather than baking secrets into images or config files. Validate required environment variables at application startup and fail fast with a clear error if any are missing.",
    "source": "12factor.net — III. Config"
  },
  {
    "id": "i02",
    "topic": "Blue/Green Deploy",
    "question": "Em uma implantação blue/green, o que acontece com o ambiente 'blue' após a troca bem-sucedida para o 'green'?",
    "code": "# AWS ALB listener rule: switch all traffic to green\naws elbv2 modify-listener \\\n  --listener-arn arn:aws:elasticloadbalancing:... \\\n  --default-actions Type=forward,TargetGroupArn=$GREEN_TG_ARN\n\n# Blue is now idle but still running — ready for instant rollback\n# Rollback: point listener back to blue in < 30 seconds\naws elbv2 modify-listener \\\n  --listener-arn arn:aws:elasticloadbalancing:... \\\n  --default-actions Type=forward,TargetGroupArn=$BLUE_TG_ARN",
    "options": [
      "É excluído permanentemente para reduzir custos",
      "Continua recebendo 50% do tráfego de produção",
      "Permanece ocioso e pode servir como alvo de rollback",
      "É atualizado automaticamente para corresponder ao ambiente green"
    ],
    "correctIndex": 2,
    "explanation": "O ambiente blue antigo permanece em espera (standby) para que o tráfego possa ser revertido instantaneamente caso um defeito crítico seja identificado no green.",
    "compiledJS": "# Deployment timeline\n# T=0   Blue (v1.3) serving 100% traffic\n# T=5m  Green (v1.4) deployed alongside blue — no traffic yet\n# T=10m Smoke tests pass on green\n# T=11m ALB rule updated: 100% traffic → green\n# T=11m Blue still running, receiving 0% traffic\n# T=11m+30m  No alerts fired → blue decommissioned\n# T=12m (if bug found) ALB rule reverted to blue in <30 seconds\n\n# Kubernetes equivalent: two Deployments, one Service selector\n# kubectl patch service api -p '{\"spec\":{\"selector\":{\"version\":\"green\"}}}'",
    "bestPractice": "Run automated smoke tests against the green environment before the cutover. Use weighted routing (e.g., Route 53 weighted records or ALB weighted target groups) to do a brief canary validation on a small traffic slice before committing 100% to green. Keep the blue environment alive for at least the p99 session length of your users.",
    "source": "Martin Fowler — BlueGreenDeployment"
  },
  {
    "id": "i03",
    "topic": "Kubernetes",
    "question": "No Kubernetes, qual é o papel de um Pod?",
    "code": "# Kubernetes Pod manifest\napiVersion: v1\nkind: Pod\nmetadata:\n  name: api-pod\n  labels:\n    app: api\nspec:\n  containers:\n    - name: api\n      image: my-api:1.4.0\n      ports:\n        - containerPort: 3000\n      env:\n        - name: DATABASE_URL\n          valueFrom:\n            secretKeyRef:\n              name: db-secret\n              key: url\n    - name: log-sidecar        # second container shares same network\n      image: fluentd:v1.16",
    "options": [
      "O binário do control plane que agenda contêineres nos nós trabalhadores",
      "A menor unidade implantável, unindo contêineres com rede e disco comuns",
      "Uma camada de abstração de máquina virtual gerenciada pelo hypervisor",
      "O manifesto YAML declarativo que define as políticas de segurança do nó"
    ],
    "correctIndex": 1,
    "explanation": "Um Pod é a unidade atômica de implantação no Kubernetes: contêineres dentro do mesmo Pod compartilham um endereço IP, rede localhost e volumes montados.",
    "compiledJS": "# Deployment wraps Pods with desired-state management\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: api\n  template:            # ← this is the Pod template\n    metadata:\n      labels:\n        app: api\n    spec:\n      containers:\n        - name: api\n          image: my-api:1.4.0\n          resources:\n            requests: { cpu: \"100m\", memory: \"128Mi\" }\n            limits:   { cpu: \"500m\", memory: \"256Mi\" }",
    "bestPractice": "Never deploy bare Pods in production — always use a Deployment or StatefulSet so Kubernetes can reschedule them on node failure. Set both resource requests and limits so the scheduler can bin-pack efficiently and prevent a runaway container from starving others on the same node. Use PodDisruptionBudgets to protect availability during node upgrades.",
    "source": "Kubernetes Docs — Pods"
  },
  {
    "id": "i04",
    "topic": "Service Discovery",
    "question": "Qual é a principal diferença entre a descoberta de serviços (service discovery) baseada em DNS e baseada em registro?",
    "code": "# DNS-based (Kubernetes internal DNS)\n# Service name resolves automatically within the cluster\nconst res = await fetch('http://payments-service:3000/pay')\n# → CoreDNS resolves payments-service → ClusterIP\n\n# Registry-based (Consul)\nconst consul = new Consul()\nconst services = await consul.health.service('payments')\nconst { Address, Port } = services[0].Service\nconst res = await fetch(`http://${Address}:${Port}/pay`)\n# → client queries Consul for a live, healthy instance",
    "options": [
      "Descoberta DNS opera em um host só; registros operam entre vários hosts",
      "Descoberta DNS resolve nomes para IPs; registros consultam nós ativos",
      "Descoberta por registro gera gargalos de latência em cada chamada HTTP",
      "Ambos os mecanismos alcançam o mesmo resultado e usam a mesma API interna"
    ],
    "correctIndex": 1,
    "explanation": "A descoberta por DNS utiliza registros DNS convencionais para roteamento, enquanto a descoberta via registro consulta serviços como Consul ou Eureka para obter uma lista atualizada de instâncias saudáveis.",
    "compiledJS": "# Consul service registration\ncurl -XPUT http://consul:8500/v1/agent/service/register \\\n  -d '{\n    \"Name\": \"payments\",\n    \"Address\": \"10.0.1.42\",\n    \"Port\": 3001,\n    \"Check\": {\n      \"HTTP\": \"http://10.0.1.42:3001/health\",\n      \"Interval\": \"10s\"\n    }\n  }'\n\n# Kubernetes DNS — automatic, no registration needed\n# CoreDNS rule: <service>.<namespace>.svc.cluster.local",
    "bestPractice": "In Kubernetes, rely on DNS-based service discovery for east-west traffic — it is automatic, low-overhead, and works without client-side libraries. For multi-datacenter or hybrid environments where Kubernetes DNS does not span the network boundary, use Consul or a service mesh (Istio) for cross-cluster discovery with health checking.",
    "source": "Consul Docs — Service Discovery"
  },
  {
    "id": "i05",
    "topic": "API Gateway",
    "question": "Qual problema o padrão API Gateway resolve em uma arquitetura de microsserviços?",
    "code": "# Kong API Gateway — route + auth + rate limiting in one config\n_format_version: \"3.0\"\nservices:\n  - name: orders-service\n    url: http://orders:3000\n    routes:\n      - name: orders-route\n        paths: [/orders]\n    plugins:\n      - name: jwt           # auth — handled centrally\n      - name: rate-limiting\n        config:\n          minute: 100       # 100 req/min per consumer\n      - name: request-transformer\n        config:\n          add:\n            headers: [\"X-Request-ID:$(uuid)\"]",
    "options": [
      "Substitui filas de mensageria assíncrona entre microsserviços via sockets UDP diretos ponto a ponto de baixa latência",
      "Provê um ponto de entrada único para clientes, gerenciando roteamento, autenticação e limitação de taxa de requisições",
      "Sincroniza transações ACID distribuídas entre os diferentes bancos relacionais de microsserviços usando two-phase commit",
      "Elimina a necessidade de operadores de cluster configurarem probes de inicialização e health checks em contêineres"
    ],
    "correctIndex": 1,
    "explanation": "Um API Gateway funciona como porta de entrada para todas as requisições de clientes, centralizando aspectos como autenticação, terminação SSL e roteamento de requisições fora dos serviços individuais.",
    "compiledJS": "# Architecture diagram (as comment)\n# Client\n#   ↓ HTTPS\n# [API Gateway]  ← auth, rate-limit, routing, logging, SSL termination\n#   ↙       ↘\n# [Orders]  [Payments]  [Users]   ← internal services (plain HTTP)\n#   ↓          ↓           ↓\n# [Order DB] [Pay DB]  [User DB]\n\n# Without gateway: each service implements auth independently\n# With gateway:    one JWT validation plugin protects all routes",
    "bestPractice": "Keep the gateway thin — routing, auth, rate limiting, and observability headers only. Do not put business logic in the gateway. Use a Backend-for-Frontend (BFF) pattern when different client types (mobile, web, third-party) need significantly different API shapes — each BFF sits behind the gateway and aggregates calls for its specific client.",
    "source": "NGINX — What is an API Gateway?"
  },
  {
    "id": "i06",
    "topic": "Stateless Services",
    "question": "Por que os microsserviços devem ser projetados para serem sem estado (stateless)?",
    "code": "# ✗ Stateful — session stored in memory\n// app.ts\nconst sessions = new Map()  // dies if the pod restarts\n\n// ✓ Stateless — session in Redis (external store)\nimport Redis from 'ioredis'\nconst redis = new Redis(process.env.REDIS_URL)\n\napp.use(session({\n  store: new RedisStore({ client: redis }),\n  secret: process.env.SESSION_SECRET,\n  resave: false,\n  saveUninitialized: false,\n}))\n# → any pod can handle any request",
    "options": [
      "Serviços stateless rodam mais rápido por nunca gravar dados no disco",
      "Serviços stateless escalam horizontalmente sem migrar estado de sessão",
      "Serviços stateless dispensam o uso de balanceadores de carga reversos",
      "Serviços stateless são o único padrão de carga suportado no Kubernetes"
    ],
    "correctIndex": 1,
    "explanation": "Quando um serviço não mantém estado local, qualquer instância pode atender a qualquer requisição, tornando a escalabilidade horizontal e a recuperação de falhas muito mais simples.",
    "compiledJS": "# Kubernetes: stateless deployment vs StatefulSet\n# Stateless: simple Deployment, any pod can restart freely\nkubectl scale deployment/api --replicas=5\nkubectl rollout restart deployment/api  # zero downtime\n\n# Stateful: StatefulSet with stable network identity + PVCs\n# → much harder: ordered startup, sticky storage, DNS names\n# → use only for databases, Kafka, Elasticsearch\nkubectl get statefulset elasticsearch\n# NAME            READY   AGE\n# elasticsearch   3/3     30d",
    "bestPractice": "Externalise all state to dedicated backing services: sessions to Redis, files to object storage (S3), queued work to SQS or Kafka. This is the share-nothing architecture described in the 12-Factor App. The only data that should live in a container's ephemeral filesystem is non-critical scratch data that you can reconstruct.",
    "source": "12factor.net — VI. Processes"
  },
  {
    "id": "i07",
    "topic": "Circuit Breaker",
    "question": "No padrão Circuit Breaker, o que o estado 'Half-Open' representa?",
    "code": "// Circuit breaker states (pseudo-TypeScript)\ntype CBState = 'Closed' | 'Open' | 'HalfOpen'\n\nclass CircuitBreaker {\n  state: CBState = 'Closed'\n  failureCount = 0\n  readonly threshold = 5\n  readonly timeout = 30_000   // 30s before trying again\n\n  async call<T>(fn: () => Promise<T>): Promise<T> {\n    if (this.state === 'Open') throw new Error('Circuit open — fast-fail')\n\n    try {\n      const result = await fn()\n      if (this.state === 'HalfOpen') this.reset()  // success → close\n      return result\n    } catch (err) {\n      this.recordFailure()\n      throw err\n    }\n  }\n\n  private recordFailure() {\n    if (++this.failureCount >= this.threshold) {\n      this.state = 'Open'\n      setTimeout(() => { this.state = 'HalfOpen' }, this.timeout)\n    }\n  }\n  private reset() { this.state = 'Closed'; this.failureCount = 0 }\n}",
    "options": [
      "O circuito foi desativado permanentemente por operadores e descarta no ato qualquer requisição ao serviço downstream",
      "O circuito permite a passagem de requisições de teste para avaliar se o serviço downstream se recuperou da instabilidade",
      "O circuito opera com vazão máxima de requisições após confirmar que o serviço downstream recuperou sua saúde normal",
      "O circuito bloqueia chamadas externas mantendo apenas a emissão de logs e métricas de auditoria para daemons locais"
    ],
    "correctIndex": 1,
    "explanation": "O estado Half-Open é uma fase de teste: um pequeno volume de requisições é encaminhado; se forem bem-sucedidas, o circuito fecha novamente; caso contrário, reabre.",
    "compiledJS": "# Resilience4j configuration (Java — widely used reference)\nresilience4j:\n  circuitbreaker:\n    instances:\n      payments:\n        slidingWindowSize: 10\n        failureRateThreshold: 50        # open after 50% failures\n        waitDurationInOpenState: 30s    # stay open for 30s\n        permittedNumberOfCallsInHalfOpenState: 3  # probe calls\n        slowCallRateThreshold: 80       # also trip on slow calls\n        slowCallDurationThreshold: 2s",
    "bestPractice": "Combine circuit breakers with fallback logic: when the circuit is open, return a cached response, a degraded response, or a user-friendly error — not a 500. Use libraries like Resilience4j (JVM), Polly (.NET), or opossum (Node.js) rather than implementing circuit breakers from scratch. Expose circuit breaker state as a Prometheus metric so you can alert on open circuits.",
    "source": "Martin Fowler — Circuit Breaker"
  },
  {
    "id": "i08",
    "topic": "Rate Limiting",
    "question": "Como o algoritmo de balde de tokens (token bucket) se diferencia do algoritmo de balde furado (leaky bucket) no controle de taxa?",
    "code": "// Token bucket — allows bursts\nclass TokenBucket {\n  private tokens: number\n  constructor(\n    private readonly capacity: number,    // e.g. 100\n    private readonly refillRate: number,  // tokens per second\n  ) { this.tokens = capacity }\n\n  consume(n = 1): boolean {\n    this.refill()\n    if (this.tokens < n) return false  // reject\n    this.tokens -= n\n    return true   // allow burst up to capacity\n  }\n  private refill() { /* add refillRate tokens per elapsed second */ }\n}\n\n// Leaky bucket — strict constant output\n// Requests queue; bucket drains at fixed rate regardless of input",
    "options": [
      "O token bucket impõe uma taxa de saída rigorosamente constante; o leaky bucket permite picos de tráfego até a capacidade do balde",
      "O token bucket permite picos de tráfego até a capacidade do balde; o leaky bucket impõe uma taxa de saída rigorosamente constante",
      "Eles são idênticos: apenas nomes distintos utilizados por diferentes fornecedores",
      "O leaky bucket é usado apenas para tráfego UDP; o token bucket é para HTTP"
    ],
    "correctIndex": 1,
    "explanation": "O token bucket acumula tokens ao longo do tempo e permite rajadas de tráfego ao consumir múltiplos tokens de uma vez, enquanto o leaky bucket esvazia a uma taxa fixa constante, independentemente da taxa de entrada.",
    "compiledJS": "# Redis-based token bucket (Node.js)\nconst CAPACITY = 100\nconst REFILL_RATE = 10   # tokens per second\n\nasync function isAllowed(userId: string): Promise<boolean> {\n  const key = `rate:${userId}`\n  const now = Date.now() / 1000\n\n  const [tokens, lastRefill] = await redis.hmget(key, 'tokens', 'last')\n  const elapsed = now - (Number(lastRefill) || now)\n  const refilled = Math.min(CAPACITY, (Number(tokens) || CAPACITY) + elapsed * REFILL_RATE)\n\n  if (refilled < 1) return false\n\n  await redis.hset(key, { tokens: refilled - 1, last: now })\n  await redis.expire(key, 3600)\n  return true\n}",
    "bestPractice": "Store rate-limit state in Redis rather than in-process memory so it works correctly when multiple application instances are running. Return 429 Too Many Requests with a Retry-After header so well-behaved clients know when to retry. Implement separate rate limits per API key, per IP, and per endpoint — a single global limit is too blunt.",
    "source": "Cloudflare Docs — Rate Limiting"
  },
  {
    "id": "i09",
    "topic": "Immutable Infrastructure",
    "question": "O que significa 'infraestrutura imutável'?",
    "code": "# Mutable (traditional) — patch in place ← avoid\nssh prod-server \"apt-get upgrade -y nginx && systemctl reload nginx\"\n# → configuration drift, unknown state, unrepeatable\n\n# Immutable — replace, never patch ← correct\n# 1. Build new image with updated nginx\ndocker build -t my-app:1.5.0 --build-arg NGINX_VERSION=1.25.3 .\ndocker push registry/my-app:1.5.0\n\n# 2. Roll out new instances\nkubectl set image deployment/app app=registry/my-app:1.5.0\n\n# 3. Old pods are terminated; new ones spin up from the immutable image\n# → every running instance is in a known, tested state",
    "options": [
      "Servidores recebem patches in-place e nunca são reiniciados no cluster",
      "Servidores nunca são alterados; mudanças criam novas instâncias limpas",
      "Arquivos de configuração ficam gravados em buckets S3 somente leitura",
      "Todos os nós físicos do cluster devem ter hardware rigorosamente igual"
    ],
    "correctIndex": 1,
    "explanation": "A infraestrutura imutável trata servidores como artefatos descartáveis: em vez de aplicar patches em máquinas ativas, cria-se uma nova imagem e implantam-se instâncias novas, eliminando desvios de configuração.",
    "compiledJS": "# HashiCorp Packer — build an immutable AMI\nsource \"amazon-ebs\" \"api\" {\n  ami_name      = \"my-api-{{timestamp}}\"\n  instance_type = \"t3.medium\"\n  source_ami_filter {\n    filters = { name = \"ubuntu/images/hvm-ssd/ubuntu-22.04-amd64-server-*\" }\n  }\n}\n\nbuild {\n  sources = [\"source.amazon-ebs.api\"]\n  provisioner \"shell\" {\n    inline = [\n      \"apt-get update -y\",\n      \"apt-get install -y nodejs=20.*\",\n      \"npm install -g pm2\",\n    ]\n  }\n}\n# → new AMI ID: ami-0abc123  (never SSH into it again)",
    "bestPractice": "Combine immutable infrastructure with GitOps: every change to a running system must go through a pull request that builds a new image. Use image scanning (Trivy, Snyk) in the build pipeline so vulnerabilities are caught before deployment. Tag images with the git commit SHA so you always know exactly what code is running.",
    "source": "HashiCorp — What is Immutable Infrastructure?"
  },
  {
    "id": "i10",
    "topic": "Readiness Probes",
    "question": "Por que uma atualização progressiva (rolling update) no Kubernetes usa readiness probes antes de direcionar tráfego para novos pods?",
    "code": "# Deployment with readiness probe — zero-downtime rolling update\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api\nspec:\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 1        # allow 1 extra pod during update\n      maxUnavailable: 0  # never remove an old pod until a new one is ready\n  template:\n    spec:\n      containers:\n        - name: api\n          image: my-api:1.5.0\n          readinessProbe:\n            httpGet:\n              path: /health\n              port: 3000\n            initialDelaySeconds: 5\n            periodSeconds: 5\n            failureThreshold: 2",
    "options": [
      "Verificar se a assinatura criptográfica da imagem confere com o registry",
      "Garantir que o novo pod está pronto para servir antes de encerrar o antigo",
      "Reduzir a taxa de implantação para não sobrecarregar o scheduler do nó",
      "Executar migrações de banco de dados antes de liberar as portas do pod"
    ],
    "correctIndex": 1,
    "explanation": "O Kubernetes condiciona o tráfego às sondas de prontidão (readiness probes) para garantir atualizações contínuas sem indisponibilidade: um pod só entra no rodízio do balanceador após passar na validação da sonda.",
    "compiledJS": "# Observe a zero-downtime rolling update\nkubectl get pods -w\n# NAME                   READY   STATUS\n# api-75f8c-xkv2q        1/1     Running   ← old pod\n# api-9d4bf-pmnr7        0/1     Running   ← new pod (starting)\n# api-9d4bf-pmnr7        1/1     Running   ← readiness probe passed\n# api-75f8c-xkv2q        1/1     Terminating ← old pod removed AFTER new one is ready\n\n# Check readiness probe status\nkubectl describe pod api-9d4bf-pmnr7 | grep -A5 \"Readiness\"",
    "bestPractice": "Always set both readiness and liveness probes on production containers. Keep readiness probe logic fast (< 1 second) but meaningful — check that the app has loaded its config and connected to the database. Use initialDelaySeconds to give the container time to start before probing begins, and set a conservative failureThreshold so a momentary blip does not pull a healthy pod from rotation.",
    "source": "Kubernetes Docs — Configure Liveness, Readiness and Startup Probes"
  },
  {
    "id": "a01",
    "topic": "Expand-Contract Migration",
    "question": "O que é o padrão expand-contract (mudança paralela) para migrações de banco de dados?",
    "code": "-- Phase 1: EXPAND — add new column alongside old one\n-- Both old and new application code can run simultaneously\nALTER TABLE users ADD COLUMN full_name TEXT;\n\n-- Backfill (batched to avoid lock contention)\nUPDATE users SET full_name = first_name || ' ' || last_name\nWHERE full_name IS NULL AND id BETWEEN 1 AND 100000;\n\n-- Phase 2: Deploy new application code that writes to BOTH columns\n-- Phase 3: CONTRACT — once old code is fully replaced, drop old column\nALTER TABLE users DROP COLUMN first_name, DROP COLUMN last_name;",
    "options": [
      "Executar backup completo antes e depois de cada alteração de estrutura",
      "Expandir o esquema para ambos os formatos, atualizar código e contrair o velho",
      "Escalar o cluster de banco horizontalmente antes de iniciar as migrações",
      "Usar feature flags para ocultar colunas até que a indexação esteja pronta"
    ],
    "correctIndex": 1,
    "explanation": "O padrão expand-contract desacopla as alterações de esquema das implantações de código para que tanto a versão antiga quanto a nova da aplicação possam executar simultaneamente, permitindo migrações sem indisponibilidade.",
    "compiledJS": "# Zero-downtime migration timeline\n# Day 0 — EXPAND:  ALTER TABLE users ADD COLUMN full_name TEXT\n#                   (nullable — old code ignores it, no breakage)\n# Day 1 — BACKFILL: UPDATE users SET full_name = first_name || ' ' || last_name\n# Day 2 — DEPLOY v2: code writes to first_name, last_name, AND full_name\n# Day 3 — DEPLOY v3: code reads only from full_name (old columns still exist)\n# Day 4 — CONTRACT:  ALTER TABLE users DROP COLUMN first_name, DROP COLUMN last_name\n\n# Tools that implement this: Flyway, Liquibase, golang-migrate\n# Run with --dry-run first to see the generated SQL",
    "bestPractice": "Never apply a destructive migration (DROP COLUMN, ALTER TYPE with USING) in the same deployment as the code change that removes references to it. Always ship the expand phase first, wait for the rollout to stabilise (at minimum one successful deployment cycle), then ship the contract phase. Use a migration tool with a lock timeout (lock_timeout = 3s in PostgreSQL) to prevent migrations from holding exclusive locks for too long.",
    "source": "Martin Fowler — Parallel Change"
  },
  {
    "id": "a02",
    "topic": "Idempotency",
    "question": "No contexto de sistemas distribuídos, o que a idempotência de uma API garante?",
    "code": "// Idempotent payment handler using idempotency key\napp.post('/payments', async (req, res) => {\n  const idempotencyKey = req.headers['idempotency-key']\n  if (!idempotencyKey) return res.status(400).json({ error: 'missing idempotency-key' })\n\n  // Check if we already processed this request\n  const cached = await redis.get(`idem:${idempotencyKey}`)\n  if (cached) {\n    return res.status(200).json(JSON.parse(cached))  // replay stored response\n  }\n\n  // Process the payment once\n  const result = await chargeCard(req.body)\n\n  // Store result for 24 hours\n  await redis.setex(`idem:${idempotencyKey}`, 86400, JSON.stringify(result))\n  res.status(201).json(result)\n})",
    "options": [
      "Que uma requisição sempre será processada em menos de 100 ms",
      "Que fazer a mesma requisição múltiplas vezes produz o mesmo resultado que realizá-la uma única vez",
      "Que a API repetirá automaticamente requisições que falharam em nome do cliente",
      "Que cada requisição é processada exatamente por uma instância de servidor"
    ],
    "correctIndex": 1,
    "explanation": "A idempotência é essencial para tentativas de reenvio seguras em redes instáveis: se o cliente não souber se uma requisição teve sucesso, reenviá-la não deve provocar efeitos colaterais duplicados.",
    "compiledJS": "# Stripe-style idempotency key\ncurl -X POST https://api.stripe.com/v1/charges \\\n  -H \"Idempotency-Key: a1b2c3d4-unique-per-intent\" \\\n  -d amount=2000 \\\n  -d currency=usd \\\n  -d source=tok_visa\n\n# If the network drops and you retry with the SAME key:\n# → Stripe returns the SAME response, does NOT charge twice\n\n# Message consumer idempotency (SQS)\nasync function processMessage(msg: SQSMessage) {\n  const dedupeKey = msg.MessageId\n  const alreadyProcessed = await db.processedMessages.findOne(dedupeKey)\n  if (alreadyProcessed) return  // skip — already handled\n  await doWork(msg.Body)\n  await db.processedMessages.insert(dedupeKey)\n}",
    "bestPractice": "Use a UUID idempotency key generated by the client, stored with the request result in Redis or the database. On retry, return the previously stored response without re-executing side effects. For message consumers, use the message ID as the deduplication key and implement an at-least-once + idempotent-consumer pattern rather than trying to guarantee exactly-once delivery at the broker level.",
    "source": "Stripe API Docs — Idempotent Requests"
  },
  {
    "id": "a03",
    "topic": "Saga Pattern",
    "question": "Qual é a principal diferença entre a descoberta de serviços (service discovery) baseada em DNS e baseada em registro?",
    "code": "// Orchestration: a central SagaOrchestrator drives each step\nclass OrderSagaOrchestrator {\n  async execute(orderId: string) {\n    await this.inventoryService.reserve(orderId)     // step 1\n    try {\n      await this.paymentService.charge(orderId)      // step 2\n    } catch {\n      await this.inventoryService.release(orderId)   // compensate step 1\n      throw new SagaFailedError()\n    }\n    await this.shippingService.schedule(orderId)     // step 3\n  }\n}\n\n// Choreography: services react to domain events (no central brain)\n// OrderPlaced → InventoryService → InventoryReserved\n// InventoryReserved → PaymentService → PaymentCharged\n// PaymentFailed → InventoryService listens → releases reservation",
    "options": [
      "Coreografia usa coordenador centralizado; orquestração adota pub/sub de eventos",
      "Coreografia faz serviços reagirem a eventos; orquestração usa maestro central",
      "Coreografia é restrita a consultas; orquestração é focada em escritas de dados",
      "Ambos os padrões são implementações idênticas compartilhando o mesmo coordenador"
    ],
    "correctIndex": 1,
    "explanation": "A descoberta por DNS utiliza registros DNS convencionais para roteamento, enquanto a descoberta via registro consulta serviços como Consul ou Eureka para obter uma lista atualizada de instâncias saudáveis.",
    "compiledJS": "# Event-driven choreography (AWS EventBridge)\n# OrderService publishes:\n{\n  \"source\": \"order-service\",\n  \"detail-type\": \"OrderPlaced\",\n  \"detail\": { \"orderId\": \"ord-123\", \"items\": [...] }\n}\n\n# InventoryService rule (EventBridge):\n{\n  \"source\": [\"order-service\"],\n  \"detail-type\": [\"OrderPlaced\"]\n}\n# → triggers Lambda: reserve stock, emit InventoryReserved\n\n# Orchestration (AWS Step Functions)\n# OrderSaga state machine:\n# [ReserveInventory] → [ChargePayment] → [ScheduleShipping]\n#         ↓ (on failure)\n# [ReleaseInventory] → [RefundPayment]",
    "bestPractice": "Use choreography for simple, linear flows where each service is clearly the owner of one domain event. Prefer orchestration when you need complex compensation logic, conditional branching, or easy visibility into saga state — AWS Step Functions or Temporal make this tractable. Always design compensating transactions before implementing the forward path.",
    "source": "DDIA — Chapter 9: Consistency and Consensus"
  },
  {
    "id": "a04",
    "topic": "Strangler Fig",
    "question": "O padrão Strangler Fig é utilizado para:",
    "code": "# Strangler Fig implementation with Nginx routing\n# Step 1: Route old paths to monolith, new /payments to microservice\nupstream monolith  { server legacy:8080; }\nupstream payments  { server payments-svc:3000; }\n\nserver {\n  listen 80;\n  # New microservice handles /payments\n  location /payments {\n    proxy_pass http://payments;\n  }\n  # Everything else still goes to the monolith\n  location / {\n    proxy_pass http://monolith;\n  }\n}\n\n# Step 2: Migrate /orders → Step 3: Migrate /users → retire monolith",
    "options": [
      "Substitui monólitos legados gradualmente roteando recursos para novos microsserviços até que o legado seja aposentado",
      "Estrangula o tráfego do sistema antigo via throttling para forçar os usuários a migrarem para as novas APIs antes da hora",
      "Injeta falhas deliberadas em serviços legados em produção para revelar dependências circulares ocultas do sistema",
      "Envolve tabelas de bancos legados com uma camada de ORM para isolar o código de persistência da lógica de negócio"
    ],
    "correctIndex": 0,
    "explanation": "Inspirado na figueira estranguladora, o padrão intercepta chamadas ao sistema antigo e as redireciona incrementalmente para novos serviços até que o sistema legado possa ser completamente desativado.",
    "compiledJS": "# Migration progress tracker (as comments)\n# Month 1: /payments       → migrated to payments-service ✓\n# Month 2: /orders         → migrated to orders-service   ✓\n# Month 3: /users          → migrated to users-service    ✓\n# Month 4: /inventory      → migrated to inventory-service✓\n# Month 5: /notifications  → migrated to notify-service   ✓\n# Month 6: monolith decommissioned — no more strangler fig needed\n\n# Key: the proxy/facade is the control point\n# Nginx, API Gateway (Kong), AWS API Gateway, or Ambassador all work\n# The facade also handles data migration and backward compat",
    "bestPractice": "Identify the bounded contexts in the monolith before migrating — each context becomes a candidate microservice. Migrate leaf features (those with few inbound dependencies) first to build confidence. Never try to run two systems against the same database without a clear data ownership boundary; add an anti-corruption layer to translate between the monolith's data model and the new service's model.",
    "source": "Martin Fowler — Strangler Fig Application"
  },
  {
    "id": "a05",
    "topic": "Chaos Engineering",
    "question": "Qual é o principal objetivo de ferramentas de engenharia do caos como Chaos Monkey e Gremlin?",
    "code": "# Gremlin attack: terminate a random pod in production\ngremlin attack-container \\\n  --target-container api \\\n  --attack shutdown\n\n# Chaos Monkey (Netflix) equivalent for Kubernetes — Chaos Mesh\napiVersion: chaos-mesh.org/v1alpha1\nkind: PodChaos\nmetadata:\n  name: kill-api-pod\nspec:\n  action: pod-kill\n  mode: one\n  selector:\n    namespaces: [production]\n    labelSelectors:\n      app: api\n  scheduler:\n    cron: \"@every 1h\"   # kill a random api pod every hour",
    "options": [
      "Testar bancos relacionais disparando milhões de operações de escrita mock",
      "Injetar falhas em produção para revelar fraquezas antes de panes reais",
      "Simular latência de rede exclusivamente durante testes em homologação",
      "Executar fuzzing de payloads de API para identificar falhas de segurança"
    ],
    "correctIndex": 1,
    "explanation": "A engenharia do caos introduz turbulências deliberadamente (derrubando instâncias, descartando pacotes de rede, esgotando CPU) para validar se os mecanismos de resiliência do sistema funcionam antes que ocorra um incidente real.",
    "compiledJS": "# Chaos engineering workflow\n# 1. Define the steady state (what \"normal\" looks like)\n#    e.g., p99 latency < 200ms, error rate < 0.1%\n\n# 2. Hypothesise that steady state holds during the attack\n# 3. Introduce the experiment (Chaos Mesh, Gremlin)\n# 4. Observe metrics (Prometheus/Grafana)\n\n# Example Chaos Mesh network partition experiment\napiVersion: chaos-mesh.org/v1alpha1\nkind: NetworkChaos\nmetadata:\n  name: delay-payments\nspec:\n  action: delay\n  mode: one\n  selector:\n    labelSelectors:\n      app: payments-service\n  delay:\n    latency: \"500ms\"\n    jitter: \"100ms\"\n  duration: \"5m\"",
    "bestPractice": "Start chaos experiments in staging, establish a clear steady-state metric, and have a kill switch ready before running experiments in production. Run experiments during business hours when the on-call team is available. Document every experiment and its outcome — the value is in the learning and in the system improvements that follow, not in the breaking itself.",
    "source": "Principles of Chaos Engineering — principlesofchaos.org"
  },
  {
    "id": "a06",
    "topic": "Service Mesh",
    "question": "O que uma malha de serviços (service mesh) como Istio ou Linkerd oferece que um API Gateway tradicional não oferece?",
    "code": "# Istio — automatic mTLS between ALL service-to-service calls\n# No application code changes required — the sidecar handles it\napiVersion: security.istio.io/v1beta1\nkind: PeerAuthentication\nmetadata:\n  name: default\n  namespace: production\nspec:\n  mtls:\n    mode: STRICT   # all east-west traffic encrypted + authenticated\n\n# Traffic shifting: canary 10% to v2\napiVersion: networking.istio.io/v1alpha3\nkind: VirtualService\nmetadata:\n  name: orders\nspec:\n  http:\n    - route:\n        - destination: { host: orders, subset: v1 }\n          weight: 90\n        - destination: { host: orders, subset: v2 }\n          weight: 10",
    "options": [
      "Um gateway externo único roteando requisições públicas de clientes para dentro",
      "Mutual TLS, observabilidade e roteamento fino entre serviços dentro do nó",
      "Autoscaling horizontal de pods baseado puramente na vazão da interface de rede",
      "Resolução DNS para serviços distribuídos entre múltiplos namespaces no cluster"
    ],
    "correctIndex": 1,
    "explanation": "Uma service mesh atua na camada leste-oeste (serviço a serviço) por meio de proxies sidecar, fornecendo criptografia mTLS, circuit breaker e telemetria para toda a comunicação interna, além do que um API Gateway norte-sul abrange.",
    "compiledJS": "# What Istio offloads from your application code\n# Before service mesh: each service implements:\n# - mTLS certificate management\n# - distributed tracing (add trace headers)\n# - circuit breaking (custom code)\n# - retry logic\n# - rate limiting\n\n# After Istio:\n# - mTLS: automatic (PeerAuthentication STRICT)\n# - tracing: Envoy sidecar injects B3 trace headers\n# - circuit breaking: DestinationRule outlierDetection\n# - retries: VirtualService retries spec\n# - rate limiting: EnvoyFilter or external rate limiter",
    "bestPractice": "Do not adopt a service mesh just because it is popular. Istio adds significant operational complexity (CRDs, Envoy configuration, certificate rotation). Evaluate Linkerd first if your primary needs are mTLS and observability — it is lighter-weight. If you are already using Kubernetes network policies and OpenTelemetry, you may get 80% of the benefit with much less complexity.",
    "source": "Istio Docs — What is a Service Mesh?"
  },
  {
    "id": "a07",
    "topic": "GitOps",
    "question": "No GitOps (utilizando ArgoCD ou Flux), qual é a fonte única da verdade para o estado desejado do cluster?",
    "code": "# ArgoCD Application — declares that the cluster must match the Git repo\napiVersion: argoproj.io/v1alpha1\nkind: Application\nmetadata:\n  name: production-api\n  namespace: argocd\nspec:\n  project: default\n  source:\n    repoURL: https://github.com/myorg/k8s-manifests\n    targetRevision: HEAD\n    path: apps/api/overlays/production\n  destination:\n    server: https://kubernetes.default.svc\n    namespace: production\n  syncPolicy:\n    automated:\n      prune: true      # remove resources deleted from Git\n      selfHeal: true   # revert manual cluster changes",
    "options": [
      "O estado dos contêineres em execução nos nós do cluster de produção",
      "Um repositório Git com manifestos declarativos da infraestrutura e app",
      "A imagem mais recente compilada pela pipeline de integração contínua (CI)",
      "Um runbook operacional de infraestrutura arquivado na wiki da engenharia"
    ],
    "correctIndex": 1,
    "explanation": "O GitOps estabelece que um repositório Git é o registro definitivo do estado desejado; o controlador GitOps reconcilia continuamente o cluster em tempo real para corresponder ao que está declarado nesse repositório.",
    "compiledJS": "# GitOps workflow\n# 1. Developer opens PR: changes Deployment image tag in git repo\n#    apps/api/overlays/production/kustomization.yaml:\n#      images:\n#        - name: my-api\n#          newTag: 1.5.0   ← changed from 1.4.0\n\n# 2. PR reviewed and merged to main\n\n# 3. ArgoCD detects drift (repo ≠ cluster)\n# 4. ArgoCD reconciles: kubectl apply (no kubectl from a human)\n\n# 5. Rollback = git revert PR + merge\n#    ArgoCD re-applies → cluster reverts in seconds\n\n# Audit trail: every cluster change has a git commit + PR link",
    "bestPractice": "Use a separate Git repository for infrastructure manifests (the \"config repo\") rather than mixing it with application code. Enable branch protection and require PR reviews for the config repo. Use Kustomize or Helm to manage environment-specific overlays rather than duplicating manifests. Set up ArgoCD notifications to Slack so the team is alerted when apps fall out of sync.",
    "source": "ArgoCD Docs — Getting Started with GitOps"
  },
  {
    "id": "a08",
    "topic": "Multi-Region Active-Active",
    "question": "Em uma arquitetura ativo-ativo multirregião, qual desafio de consistência deve ser explicitamente tratado?",
    "code": "# CockroachDB multi-region — handles write conflicts automatically\n# Region topology\nCREATE DATABASE mydb PRIMARY REGION \"us-east1\"\n  REGIONS \"eu-west1\", \"ap-southeast1\";\n\n# REGIONAL BY ROW — each row is homed in the region where it was written\nALTER TABLE orders SET LOCALITY REGIONAL BY ROW;\n\n# Application-level conflict resolution — last-write-wins with vector clock\ninterface WriteIntent {\n  key: string\n  value: unknown\n  timestamp: number     // lamport clock\n  region: string\n}\n// On conflict: compare timestamps; if equal, region name is tie-breaker",
    "options": [
      "Garantir que todas as regiões usem o mesmo digest de imagem de contêiner",
      "Tratar conflitos de escrita e lag quando regiões alteram dados em paralelo",
      "Rotear gravações para uma única região primária para evitar conflitos locais",
      "Sincronizar relógios de hardware dos nós do Kubernetes entre regiões via NTP"
    ],
    "correctIndex": 1,
    "explanation": "Configurações ativo-ativo permitem escritas em todas as regiões; portanto, o sistema deve implementar uma estratégia de resolução de conflitos (como last-write-wins, CRDTs ou relógios vetoriais) e tolerar o atraso transitório de replicação.",
    "compiledJS": "# AWS Global Tables (DynamoDB) — managed multi-region active-active\naws dynamodb create-global-table \\\n  --global-table-name Orders \\\n  --replication-group RegionName=us-east-1 RegionName=eu-west-1 RegionName=ap-southeast-1\n\n# DynamoDB uses last-writer-wins (wall clock) for conflict resolution\n# Approximate replication lag: < 1 second under normal conditions\n\n# Custom conflict resolution pattern (event sourcing)\n# Append-only event log per region → merge event streams by timestamp\n# → no conflicts, full history, eventual consistency",
    "bestPractice": "Choose the right consistency model for each data type: user profiles can tolerate eventual consistency, payment records cannot. Use event sourcing or append-only data structures wherever possible — they avoid write conflicts by design. Define your Recovery Point Objective (RPO) and Recovery Time Objective (RTO) before choosing a replication strategy, since lower RPO means higher write latency.",
    "source": "DDIA — Chapter 5: Replication"
  },
  {
    "id": "a09",
    "topic": "FinOps",
    "question": "Qual combinação de estratégias melhor descreve o right-sizing e a otimização de custos de FinOps para infraestrutura em nuvem?",
    "code": "# AWS Cost Explorer: identify over-provisioned instances\naws ce get-rightsizing-recommendation \\\n  --service \"AmazonEC2\" \\\n  --configuration '{\"RecommendationTarget\":\"SAME_INSTANCE_FAMILY\",\"BenefitsConsidered\":true}'\n\n# Kubernetes: VPA right-sizes pod CPU/memory requests\napiVersion: autoscaling.k8s.io/v1\nkind: VerticalPodAutoscaler\nmetadata:\n  name: api-vpa\nspec:\n  targetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: api\n  updatePolicy:\n    updateMode: \"Off\"   # recommendation-only; apply manually in prod",
    "options": [
      "Contratar instâncias reservadas de 3 anos para reduzir a conta por hora",
      "Dimensionar instâncias por métricas, usando nós spot e autoscaling dinâmico",
      "Superdimensionar instâncias em 3x para garantir margem contra picos de uso",
      "Migrar nós para a região mais barata da nuvem independente do usuário final"
    ],
    "correctIndex": 1,
    "explanation": "A otimização em FinOps apoia-se em três alavancas complementares: right-sizing (adequar os recursos de instâncias/pods à utilização real medida, não a suposições), instâncias spot/preemptivas (60–90% mais baratas que sob demanda; seguras para cargas tolerantes a falhas e sem estado) e auto-scaling (reduzir a zero ou quase zero em períodos de baixo tráfego). Instâncias reservadas oferecem descontos significativos, mas devem ser contratadas apenas para a carga base estável.",
    "compiledJS": "# KEDA: scale to zero when no messages in queue\napiVersion: keda.sh/v1alpha1\nkind: ScaledObject\nmetadata:\n  name: worker-scaler\nspec:\n  scaleTargetRef:\n    name: queue-worker\n  minReplicaCount: 0   # scale to zero at night\n  maxReplicaCount: 50\n  triggers:\n    - type: aws-sqs-queue\n      metadata:\n        queueURL: https://sqs.us-east-1.amazonaws.com/.../jobs\n        queueLength: \"5\"   # 1 pod per 5 messages\n\n# Spot instance node group (EKS managed node group)\n# → 70% cost saving for batch / stateless workers",
    "bestPractice": "Tag all cloud resources with team, environment, and service labels to allocate costs accurately. Review utilisation weekly in the first 3 months of a new service — it is common to provision for worst-case load and then never adjust. Use Spot instances for CI/CD workers, batch jobs, and stateless APIs with retries; use on-demand for stateful databases and control plane components that must not be interrupted.",
    "source": "FinOps Foundation — FinOps Framework"
  },
  {
    "id": "a10",
    "topic": "Observability",
    "question": "Quais são os três pilares da observabilidade completa em um sistema distribuído e por que IDs de correlação são importantes?",
    "code": "// OpenTelemetry: propagate correlation ID across all services\nimport { trace, context, propagation } from '@opentelemetry/api'\n\napp.use((req, res, next) => {\n  // Extract trace context from incoming headers (W3C TraceContext)\n  const ctx = propagation.extract(context.active(), req.headers)\n  const span = trace.getTracer('api').startSpan('http.request', {}, ctx)\n\n  // Attach correlation ID to logs\n  const traceId = span.spanContext().traceId\n  req.log = logger.child({ traceId, service: 'api' })\n  req.log.info({ method: req.method, path: req.url }, 'request received')\n\n  context.with(trace.setSpan(ctx, span), () => next())\n  res.on('finish', () => span.end())\n})",
    "options": [
      "Uptime, latência, erros; correlation IDs vinculam alertas a plantonistas",
      "Logs, métricas, traces; correlation IDs rastreiam requisições ponta a ponta",
      "Dashboards, alertas, runbooks; correlation IDs substituem tracing distribuído",
      "CPU, memória, disco; correlation IDs associam métricas a deploys no cluster"
    ],
    "correctIndex": 1,
    "explanation": "Logs, métricas e rastreamentos distribuídos são os três pilares da observabilidade; um ID de correlação propagado em cada chamada de serviço conecta os três sinais, tornando possível reconstituir toda a trajetória de uma requisição em um sistema de microsserviços.",
    "compiledJS": "# OpenTelemetry Collector pipeline\n# app → OTLP → OTel Collector → Jaeger (traces) + Prometheus (metrics) + Loki (logs)\n\n# Grafana query: find all logs for a specific trace\n{service=\"payments\"} | json | traceId=\"4bf92f3577b34da6a3ce929d0e0e4736\"\n\n# Jaeger: visualise the full request journey\n# api (50ms) → orders (30ms) → payments (120ms ← bottleneck)\n#                            ↘ inventory (15ms)\n\n# Prometheus alert: high error rate triggers investigation\n# → query Jaeger for failing trace IDs\n# → search Loki logs by those trace IDs for root cause",
    "bestPractice": "Instrument every service with OpenTelemetry from day one — it is vendor-neutral and lets you switch between Jaeger, Zipkin, Datadog, or Honeycomb without code changes. Generate trace IDs at the API gateway and propagate them in the traceparent header (W3C TraceContext). Attach the trace ID to every log line so you can pivot from a log alert directly to the distributed trace.",
    "source": "OpenTelemetry Docs — What is Observability?"
  }
]
