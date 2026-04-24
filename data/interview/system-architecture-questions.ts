import type { InterviewQuestion } from '@/lib/interviewTypes'

export const SYSTEM_ARCHITECTURE_QUESTIONS: InterviewQuestion[] = [
  // ── Beginner (b01–b10) ───────────────────────────────────────────────────────

  {
    id: 'b01',
    topic: 'Monolith vs Microservices',
    question:
      'What is the primary difference between a monolithic and a microservices architecture?',
    code: null,
    options: [
      'A monolith uses containers; microservices do not',
      'A monolith is deployed as a single unit; microservices are deployed as independent services',
      'Microservices must share a single database; a monolith cannot',
      'A monolith can only run on one server; microservices run on many',
    ],
    correctIndex: 1,
    explanation:
      'In a monolithic architecture, all functionality is bundled into one deployable artifact. A change to any component requires redeploying the entire application. Microservices decompose the system into independently deployable services that communicate over the network. This allows teams to deploy, scale, and fault-isolate individual services. The trade-off is increased operational complexity: service discovery, distributed tracing, and network failures all become concerns you must address explicitly.',
    compiledJS: `# Monolith
docker build -t my-app .
docker run -p 3000:3000 my-app
# → one process, all routes, all DB connections in one container

# Microservices (docker-compose)
version: "3.9"
services:
  orders:
    image: orders-service:1.4.2
    ports: ["3001:3000"]
  payments:
    image: payments-service:2.1.0
    ports: ["3002:3000"]
  api-gateway:
    image: nginx:alpine
    ports: ["80:80"]
# → each service is its own container, deployed & scaled independently`,
    bestPractice:
      'Start with a well-structured monolith (modular monolith) and extract services only when you have clear team, scaling, or deployment boundaries. Premature microservices add network overhead and operational burden without matching benefit. Senior engineers extract a service when one module needs a different deployment cadence or technology stack, not simply because microservices are fashionable.',
    source: 'Martin Fowler — MonolithFirst',
  },

  {
    id: 'b02',
    topic: 'REST API',
    question:
      'Which HTTP method is conventionally used to UPDATE an existing resource in a REST API?',
    code: `# Partial update (PATCH) — only the fields sent are modified
PATCH /users/42
Content-Type: application/json

{ "email": "new@example.com" }

# Full replacement (PUT) — missing fields are reset to defaults
PUT /users/42
Content-Type: application/json

{ "name": "Alice", "email": "new@example.com", "role": "admin" }`,
    options: [
      'POST',
      'GET',
      'PUT',
      'DELETE',
    ],
    correctIndex: 2,
    explanation:
      'PUT is the RESTful convention for a full resource replacement: the request body must contain the complete new state of the resource. PATCH, introduced later, handles partial updates — only the supplied fields are changed. GET is read-only and must be safe and idempotent. POST is typically used for creating a new resource or triggering an action. Using PUT or PATCH correctly signals intent to consumers and intermediary caches.',
    compiledJS: `# Correct PATCH implementation in Express
app.patch('/users/:id', async (req, res) => {
  const updated = await db.users.update(
    { where: { id: req.params.id } },
    { $set: req.body }         // only supplied fields are changed
  )
  res.json(updated)
})

# Idempotency check: calling PUT /users/42 twice with the same body
# MUST produce the same result — the second call is a no-op`,
    bestPractice:
      'Prefer PATCH over PUT for partial updates in production APIs — it reduces payload size and avoids accidentally overwriting fields the client did not intend to change. Always validate that PATCH handlers merge rather than replace. Return 200 with the updated resource or 204 with no body, depending on whether the client needs the new state.',
    source: 'RFC 7231 — HTTP/1.1 Semantics and Content',
  },

  {
    id: 'b03',
    topic: 'Docker',
    question: 'In one sentence, what does Docker do?',
    code: `# Dockerfile — build a reproducible image
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "dist/index.js"]

# Build and run
docker build -t my-api:1.0.0 .
docker run --rm -p 3000:3000 --env-file .env my-api:1.0.0`,
    options: [
      'It provisions virtual machines on cloud providers',
      'It packages an application and its dependencies into a portable container that runs consistently anywhere',
      'It replaces the operating system kernel for better performance',
      'It orchestrates clusters of servers across data centers',
    ],
    correctIndex: 1,
    explanation:
      'Docker uses OS-level virtualisation (cgroups + namespaces) to package an application with its runtime, libraries, and configuration into a container image. Unlike VMs, containers share the host kernel, making them lightweight and fast to start. The image is a portable artifact: it runs identically on a developer laptop, a CI runner, and a production Kubernetes node. This "build once, run anywhere" property is the core value proposition.',
    compiledJS: `# Verify the image runs identically in three environments
# Local dev
docker run --rm my-api:1.0.0

# CI pipeline (GitHub Actions)
- name: Run integration tests
  run: docker run --rm -e NODE_ENV=test my-api:1.0.0 npm test

# Kubernetes prod
kubectl set image deployment/api api=my-api:1.0.0
# → same image bytes, no environment drift`,
    bestPractice:
      'Tag images with an immutable digest or semantic version — never use :latest in production. Use multi-stage Dockerfiles to keep runtime images small (Alpine base, no dev dependencies, no build tools). Pin the base image digest to prevent silent upstream changes that could introduce security vulnerabilities or runtime regressions.',
    source: 'Docker Docs — Dockerfile best practices',
  },

  {
    id: 'b04',
    topic: 'CI/CD',
    question: 'What does CI/CD stand for?',
    code: `# .github/workflows/ci.yml — minimal CI/CD pipeline
name: CI/CD
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install
        run: npm ci
      - name: Test
        run: npm test
      - name: Build image
        run: docker build -t my-api:\${{ github.sha }} .
      - name: Push to registry
        run: docker push my-api:\${{ github.sha }}
      - name: Deploy to staging
        run: kubectl set image deployment/api api=my-api:\${{ github.sha }}`,
    options: [
      'Container Integration / Container Delivery',
      'Continuous Inspection / Continuous Deployment',
      'Continuous Integration / Continuous Delivery (or Deployment)',
      'Code Integration / Code Distribution',
    ],
    correctIndex: 2,
    explanation:
      'Continuous Integration (CI) means every developer commit is automatically built and tested, catching integration errors early. Continuous Delivery (CD) extends CI by ensuring the software is always in a releasable state — deployments to production are a manual button press. Continuous Deployment goes further: every passing build is deployed automatically to production. Together they reduce batch size, shorten feedback loops, and eliminate the "big bang" release problem.',
    compiledJS: `# Deployment frequency chart — illustrates CI/CD impact
# Before CI/CD:  monthly releases, large risky batches
# After CI/CD:   multiple deploys per day, small safe increments

# Key metrics (DORA):
# Deployment frequency      → how often you ship
# Lead time for changes     → commit → production time
# Change failure rate       → % of deploys causing incidents
# Mean time to recover      → how fast you fix a bad deploy`,
    bestPractice:
      'Keep the main branch always deployable: enforce required status checks (tests, lint, security scan) before merging. Use short-lived feature branches and merge frequently to avoid divergence. Trunk-based development combined with feature flags is the pattern preferred by high-performing teams because it eliminates long-lived merge conflicts.',
    source: 'Google DORA — State of DevOps Report',
  },

  {
    id: 'b05',
    topic: 'Environment Variables',
    question:
      'Why are environment variables preferred over hard-coded values for secrets in an application?',
    code: `# ✗ Hard-coded secret — NEVER do this
const client = new S3Client({ accessKeyId: 'AKIAIOSFODNN7EXAMPLE' })

# ✓ Environment variable — correct approach
const client = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

# Inject at runtime (Docker)
docker run -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \\
           -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \\
           my-api:1.0.0`,
    options: [
      'They make the application run faster',
      'They keep sensitive values out of source code and allow configuration per environment',
      'They are automatically encrypted at the OS level',
      'They are required by the Docker runtime',
    ],
    correctIndex: 1,
    explanation:
      'Externalising secrets as environment variables prevents them from being committed to version control, where they would be visible to every team member and in git history forever. The same container image can run in dev, staging, and production simply by changing the injected values, which satisfies the 12-Factor App config factor. Environment variables are not automatically encrypted — that responsibility belongs to secrets managers like AWS Secrets Manager, Vault, or Kubernetes Secrets.',
    compiledJS: `# Production-grade secret injection with AWS Secrets Manager
# 1. Store secret in AWS
aws secretsmanager create-secret --name prod/db-password --secret-string "s3cr3t"

# 2. At container start, fetch and export
export DB_PASSWORD=$(aws secretsmanager get-secret-value \\
  --secret-id prod/db-password --query SecretString --output text)

# 3. Kubernetes: mount as env from Secret object
env:
  - name: DB_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-credentials
        key: password`,
    bestPractice:
      'Never store secrets in environment variables that are logged or exposed via /metrics or /debug endpoints. Rotate secrets automatically and use short-lived credentials (IAM roles, Workload Identity) instead of long-lived keys wherever possible. Audit access with a secrets manager audit trail.',
    source: '12factor.net — III. Config',
  },

  {
    id: 'b06',
    topic: 'Load Balancer',
    question: 'What is the main job of a load balancer?',
    code: `# nginx.conf — upstream round-robin load balancing
upstream api_servers {
  server api-1:3000;
  server api-2:3000;
  server api-3:3000;
}

server {
  listen 80;
  location / {
    proxy_pass http://api_servers;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}`,
    options: [
      'Compressing HTTP responses before they reach the client',
      'Distributing incoming network traffic across multiple servers',
      'Caching database query results',
      'Monitoring application logs in real time',
    ],
    correctIndex: 1,
    explanation:
      'A load balancer routes incoming requests across a pool of backend servers using algorithms such as round-robin, least-connections, or IP hash. This distributes CPU and memory load, prevents any single server from becoming a bottleneck, and provides high availability — if one server fails the load balancer routes traffic only to healthy instances. Layer-7 load balancers (HTTP-aware) can additionally do SSL termination, path-based routing, and sticky sessions.',
    compiledJS: `# AWS ALB target group health check config
aws elbv2 create-target-group \\
  --name api-targets \\
  --protocol HTTP \\
  --port 3000 \\
  --health-check-path /health \\
  --healthy-threshold-count 2 \\
  --unhealthy-threshold-count 3

# Register instances
aws elbv2 register-targets \\
  --target-group-arn arn:aws:... \\
  --targets Id=i-abc123 Id=i-def456 Id=i-ghi789`,
    bestPractice:
      'Configure health checks with tight thresholds so unhealthy instances are removed quickly. Use connection draining (deregistration delay) to allow in-flight requests to complete before an instance is removed. For Kubernetes, use Services with readiness probes rather than configuring health checks on the load balancer directly.',
    source: 'AWS Docs — Application Load Balancer',
  },

  {
    id: 'b07',
    topic: 'Horizontal Scaling',
    question: 'What is the difference between horizontal and vertical scaling?',
    code: `# Vertical scaling: resize the single EC2 instance
aws ec2 modify-instance-attribute \\
  --instance-id i-abc123 \\
  --instance-type '{"Value":"m5.4xlarge"}'
# → downtime required, hard ceiling (largest available instance type)

# Horizontal scaling: add more instances
aws autoscaling set-desired-capacity \\
  --auto-scaling-group-name api-asg \\
  --desired-capacity 6
# → zero downtime, theoretically unlimited, requires stateless services`,
    options: [
      'Horizontal scaling adds more CPU/RAM to a single server; vertical scaling adds more servers',
      'Horizontal scaling adds more servers; vertical scaling adds more CPU/RAM to an existing server',
      'They are the same concept but used in different cloud providers',
      'Horizontal scaling only applies to databases; vertical scaling only applies to web servers',
    ],
    correctIndex: 1,
    explanation:
      'Scaling out (horizontal) means running more instances of the same service — each instance handles a subset of traffic. Scaling up (vertical) means replacing the current instance with a larger one that has more CPU, memory, or network bandwidth. Horizontal scaling is preferred for stateless web tiers because it is elastic, tolerates instance failure, and has no hard ceiling. Vertical scaling is sometimes necessary for databases with large working sets that must fit in memory on a single node.',
    compiledJS: `# Kubernetes HorizontalPodAutoscaler (HPA)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 60`,
    bestPractice:
      'Design stateless services from the start to enable horizontal scaling. Use the HPA in Kubernetes with both CPU and custom metrics (queue depth, request latency) to scale on the right signal. Always set a minimum replica count greater than 1 for production workloads to survive a pod restart without downtime.',
    source: 'Kubernetes Docs — Horizontal Pod Autoscaling',
  },

  {
    id: 'b08',
    topic: 'Reverse Proxy',
    question:
      'When Nginx is used as a reverse proxy, which traffic direction does it primarily handle?',
    code: `# nginx.conf — reverse proxy with SSL termination
server {
  listen 443 ssl http2;
  server_name api.example.com;

  ssl_certificate     /etc/letsencrypt/live/api.example.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

  location / {
    proxy_pass         http://localhost:3000;  # backend over plain HTTP
    proxy_http_version 1.1;
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection keep-alive;
    proxy_set_header   Host $host;
  }
}`,
    options: [
      'Requests from internal services to the database',
      'Outbound requests from the server to external APIs',
      'Inbound client requests forwarded to backend application servers',
      'Traffic between microservices inside a Kubernetes cluster',
    ],
    correctIndex: 2,
    explanation:
      'A reverse proxy sits between external clients and backend servers. Clients connect to the proxy, which forwards the request to the appropriate upstream service and returns the response. This hides internal topology, centralises SSL termination, enables path-based routing, and allows the backend to scale without clients needing to know backend addresses. A forward proxy, by contrast, acts on behalf of clients making outbound requests.',
    compiledJS: `# Effect: clients only ever see the proxy's IP
# Backend servers are not exposed to the internet

# Before reverse proxy:
# Client → port 3000 on server (application exposed directly)

# After reverse proxy:
# Client → nginx :443 → localhost:3000 (application hidden)

# Additional benefits nginx provides:
# - gzip compression
# - static file caching
# - rate limiting (limit_req_zone)
# - connection buffering (protects slow apps from slow clients)`,
    bestPractice:
      'Use Nginx or a cloud load balancer for SSL termination so your application servers never handle TLS overhead. Enable HTTP/2 on the proxy tier to multiplex requests and improve browser performance. In Kubernetes, use an Ingress controller (Nginx or Traefik) rather than exposing NodePorts directly.',
    source: 'Nginx Docs — Reverse Proxy',
  },

  {
    id: 'b09',
    topic: 'Health Checks',
    question:
      'What is the purpose of a health check endpoint (e.g., GET /health) in a web service?',
    code: `// Express health check implementation
app.get('/health', async (req, res) => {
  const dbOk = await db.ping().then(() => true).catch(() => false)
  const status = dbOk ? 200 : 503
  res.status(status).json({
    status: dbOk ? 'ok' : 'degraded',
    db: dbOk,
    uptime: process.uptime(),
    ts: new Date().toISOString(),
  })
})`,
    options: [
      'To return the current CPU and memory usage to the end user',
      'To allow load balancers and orchestrators to verify that the service is running correctly',
      'To trigger a manual restart of the service',
      'To expose internal API documentation',
    ],
    correctIndex: 1,
    explanation:
      'Health check endpoints provide a machine-readable signal that a service is functioning. Load balancers poll the endpoint and remove instances that return non-2xx responses. Kubernetes uses liveness probes to restart crashed containers and readiness probes to hold traffic until a newly started pod is actually ready to serve. A good health check verifies not just that the process is alive but that its dependencies (database connection, cache) are reachable.',
    compiledJS: `# Kubernetes liveness + readiness probe configuration
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 15
  failureThreshold: 3   # restart pod after 3 consecutive failures

readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 2   # remove from load balancer after 2 failures`,
    bestPractice:
      'Implement separate liveness and readiness endpoints. Liveness should be cheap (does the process respond?). Readiness should check all dependencies the service needs to handle a request — if the database is down, return 503 so traffic is rerouted, not just dropped. Never put a slow dependency check (e.g., a full DB query) in the liveness probe or it will trigger spurious restarts.',
    source: 'Kubernetes Docs — Configure Liveness, Readiness and Startup Probes',
  },

  {
    id: 'b10',
    topic: 'Rollback',
    question: 'In a deployment pipeline, what does a rollback accomplish?',
    code: `# Kubernetes rollback using rollout history
kubectl rollout history deployment/api
# REVISION  CHANGE-CAUSE
# 1         image: api:1.3.0
# 2         image: api:1.4.0  ← current (broken)

kubectl rollout undo deployment/api
# → reverts to revision 1 (api:1.3.0)

# Pin to a specific revision
kubectl rollout undo deployment/api --to-revision=1

# Monitor rollback progress
kubectl rollout status deployment/api`,
    options: [
      'It deletes all data written since the last release',
      'It reverts the running application to a previously known-good version',
      'It scales the number of instances back to zero',
      'It resets environment variables to their default values',
    ],
    correctIndex: 1,
    explanation:
      'A rollback redeploys a previous stable artifact — a container image, a Helm chart revision, or an AMI — when the current release is found to be defective. It does not touch data or database schema (rolling back data is a separate, complex operation). Kubernetes keeps a configurable number of ReplicaSet revisions so kubectl rollout undo can be executed in seconds. Blue/green deployments achieve rollback by re-routing the load balancer back to the old (blue) environment.',
    compiledJS: `# Helm rollback
helm history my-release
# REVISION  STATUS     DESCRIPTION
# 1         superseded installed
# 2         deployed   upgrade to v1.4.0

helm rollback my-release 1
# → re-installs revision 1 in seconds

# GitOps rollback (ArgoCD)
git revert HEAD  # revert the bad commit
git push origin main
# ArgoCD detects the change and syncs the cluster back automatically`,
    bestPractice:
      'Invest in fast rollback rather than trying to make every deployment perfect. Aim for a rollback time under 5 minutes. Keep a minimum of 3 Kubernetes deployment revisions (revisionHistoryLimit: 3). For database-backed services, design migrations to be backward-compatible (expand-contract) so you can roll back code without rolling back schema.',
    source: 'Kubernetes Docs — Deployments (rolling updates and rollbacks)',
  },

  // ── Intermediate (i01–i10) ───────────────────────────────────────────────────

  {
    id: 'i01',
    topic: '12-Factor App',
    question:
      "The 12-Factor App methodology's 'Config' factor states that configuration should be stored in:",
    code: `# Factor III: Config — store config in the environment
# ✗ Wrong: config committed to code
# config/database.yml → contains real credentials

# ✓ Correct: config injected at runtime
DATABASE_URL=postgres://user:pass@host:5432/db
REDIS_URL=redis://cache:6379
LOG_LEVEL=info

# The same image runs in every environment
docker run \\
  -e DATABASE_URL=$PROD_DB_URL \\
  -e LOG_LEVEL=warn \\
  my-api:1.4.0`,
    options: [
      'A config file committed alongside the source code',
      'The environment',
      'A dedicated configuration microservice',
      'A relational database table',
    ],
    correctIndex: 1,
    explanation:
      'Factor III of the 12-Factor App methodology states that configuration — anything that varies between deployment environments — must be stored in environment variables. Config committed to code cannot be changed without a new build. A config microservice is a valid pattern for service-level discovery but is a separate concern. The key test is whether the codebase could be made open source at any moment without exposing credentials.',
    compiledJS: `# 12 Factors at a glance (all 12 for context)
# I.   Codebase      — one repo, many deploys
# II.  Dependencies  — explicitly declare and isolate
# III. Config        — store in the environment ← this question
# IV.  Backing svcs  — treat as attached resources
# V.   Build/release/run — strictly separate stages
# VI.  Processes     — stateless, share-nothing
# VII. Port binding  — export services via port
# VIII.Concurrency   — scale via the process model
# IX.  Disposability — fast startup, graceful shutdown
# X.   Dev/prod parity — keep environments as similar as possible
# XI.  Logs          — treat as event streams
# XII. Admin processes — run as one-off processes`,
    bestPractice:
      'Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) for sensitive values and inject them as environment variables at container startup rather than baking secrets into images or config files. Validate required environment variables at application startup and fail fast with a clear error if any are missing.',
    source: '12factor.net — III. Config',
  },

  {
    id: 'i02',
    topic: 'Blue/Green Deploy',
    question:
      "In a blue/green deployment, what happens to the 'blue' environment after a successful switch to 'green'?",
    code: `# AWS ALB listener rule: switch all traffic to green
aws elbv2 modify-listener \\
  --listener-arn arn:aws:elasticloadbalancing:... \\
  --default-actions Type=forward,TargetGroupArn=$GREEN_TG_ARN

# Blue is now idle but still running — ready for instant rollback
# Rollback: point listener back to blue in < 30 seconds
aws elbv2 modify-listener \\
  --listener-arn arn:aws:elasticloadbalancing:... \\
  --default-actions Type=forward,TargetGroupArn=$BLUE_TG_ARN`,
    options: [
      'It is permanently deleted to save cost',
      'It continues to receive 50% of production traffic',
      'It is kept idle and can serve as a rollback target',
      'It is automatically upgraded to match the green environment',
    ],
    correctIndex: 2,
    explanation:
      'After a successful blue/green cutover, the blue environment is kept alive but receives no traffic. If a defect is discovered in the green environment, the load balancer rule is simply updated to point back to blue — a rollback that takes seconds and requires no re-deployment. This is the key advantage over in-place rolling updates, which cannot instantly restore the previous version. The blue environment is typically decommissioned after a confidence period (e.g., 30–60 minutes).',
    compiledJS: `# Deployment timeline
# T=0   Blue (v1.3) serving 100% traffic
# T=5m  Green (v1.4) deployed alongside blue — no traffic yet
# T=10m Smoke tests pass on green
# T=11m ALB rule updated: 100% traffic → green
# T=11m Blue still running, receiving 0% traffic
# T=11m+30m  No alerts fired → blue decommissioned
# T=12m (if bug found) ALB rule reverted to blue in <30 seconds

# Kubernetes equivalent: two Deployments, one Service selector
# kubectl patch service api -p '{"spec":{"selector":{"version":"green"}}}'`,
    bestPractice:
      'Run automated smoke tests against the green environment before the cutover. Use weighted routing (e.g., Route 53 weighted records or ALB weighted target groups) to do a brief canary validation on a small traffic slice before committing 100% to green. Keep the blue environment alive for at least the p99 session length of your users.',
    source: 'Martin Fowler — BlueGreenDeployment',
  },

  {
    id: 'i03',
    topic: 'Kubernetes',
    question: 'In Kubernetes, what is the role of a Pod?',
    code: `# Kubernetes Pod manifest
apiVersion: v1
kind: Pod
metadata:
  name: api-pod
  labels:
    app: api
spec:
  containers:
    - name: api
      image: my-api:1.4.0
      ports:
        - containerPort: 3000
      env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
    - name: log-sidecar        # second container shares same network
      image: fluentd:v1.16`,
    options: [
      'It is the control plane component that schedules containers onto nodes',
      'It is the smallest deployable unit, wrapping one or more co-located containers that share network and storage',
      'It is the Kubernetes equivalent of a virtual machine',
      'It is the configuration manifest for a Kubernetes cluster',
    ],
    correctIndex: 1,
    explanation:
      'A Pod is the atomic unit of deployment in Kubernetes. Containers within the same Pod share an IP address, localhost network stack, and mounted volumes. This makes the sidecar pattern possible — e.g., a log-shipping container alongside the application container. In practice, most Pods contain a single container; multiple containers are used for tightly-coupled helpers. Pods are managed by higher-level controllers (Deployment, StatefulSet) that handle restarts and scaling.',
    compiledJS: `# Deployment wraps Pods with desired-state management
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:            # ← this is the Pod template
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: my-api:1.4.0
          resources:
            requests: { cpu: "100m", memory: "128Mi" }
            limits:   { cpu: "500m", memory: "256Mi" }`,
    bestPractice:
      'Never deploy bare Pods in production — always use a Deployment or StatefulSet so Kubernetes can reschedule them on node failure. Set both resource requests and limits so the scheduler can bin-pack efficiently and prevent a runaway container from starving others on the same node. Use PodDisruptionBudgets to protect availability during node upgrades.',
    source: 'Kubernetes Docs — Pods',
  },

  {
    id: 'i04',
    topic: 'Service Discovery',
    question:
      'What is the key difference between DNS-based and registry-based service discovery?',
    code: `# DNS-based (Kubernetes internal DNS)
# Service name resolves automatically within the cluster
const res = await fetch('http://payments-service:3000/pay')
# → CoreDNS resolves payments-service → ClusterIP

# Registry-based (Consul)
const consul = new Consul()
const services = await consul.health.service('payments')
const { Address, Port } = services[0].Service
const res = await fetch(\`http://\${Address}:\${Port}/pay\`)
# → client queries Consul for a live, healthy instance`,
    options: [
      'DNS-based discovery works only inside a single host; registry-based works across hosts',
      'DNS-based discovery resolves service names to IPs via standard DNS; registry-based services query a dedicated registry (e.g., Consul) for live instance lists',
      'Registry-based discovery is slower because it requires a round trip to the registry on every request',
      'There is no practical difference — both achieve exactly the same result',
    ],
    correctIndex: 1,
    explanation:
      'DNS-based discovery leverages standard DNS records. In Kubernetes, CoreDNS creates A records for every Service, so pods can reach a service by its cluster-internal hostname. DNS caches can cause stale records during rapid scaling events. Registry-based discovery (Consul, Eureka) stores richer metadata — health status, version, tags — and clients query the registry to get a fresh, pre-filtered list of healthy instances. The registry approach supports client-side load balancing and health-aware routing.',
    compiledJS: `# Consul service registration
curl -XPUT http://consul:8500/v1/agent/service/register \\
  -d '{
    "Name": "payments",
    "Address": "10.0.1.42",
    "Port": 3001,
    "Check": {
      "HTTP": "http://10.0.1.42:3001/health",
      "Interval": "10s"
    }
  }'

# Kubernetes DNS — automatic, no registration needed
# CoreDNS rule: <service>.<namespace>.svc.cluster.local`,
    bestPractice:
      'In Kubernetes, rely on DNS-based service discovery for east-west traffic — it is automatic, low-overhead, and works without client-side libraries. For multi-datacenter or hybrid environments where Kubernetes DNS does not span the network boundary, use Consul or a service mesh (Istio) for cross-cluster discovery with health checking.',
    source: 'Consul Docs — Service Discovery',
  },

  {
    id: 'i05',
    topic: 'API Gateway',
    question:
      'What problem does an API gateway pattern solve in a microservices architecture?',
    code: `# Kong API Gateway — route + auth + rate limiting in one config
_format_version: "3.0"
services:
  - name: orders-service
    url: http://orders:3000
    routes:
      - name: orders-route
        paths: [/orders]
    plugins:
      - name: jwt           # auth — handled centrally
      - name: rate-limiting
        config:
          minute: 100       # 100 req/min per consumer
      - name: request-transformer
        config:
          add:
            headers: ["X-Request-ID:$(uuid)"]`,
    options: [
      'It replaces the need for a message broker between services',
      'It provides a single entry point for clients, handling cross-cutting concerns like auth, rate limiting, and routing',
      'It synchronises databases across services automatically',
      'It eliminates the need for service health checks',
    ],
    correctIndex: 1,
    explanation:
      'An API gateway acts as the front door for all client-to-microservice communication. Without a gateway, every service must independently implement authentication, rate limiting, logging, SSL termination, and CORS — leading to duplication and inconsistency. The gateway centralises these cross-cutting concerns. It also simplifies the client API by aggregating multiple downstream calls, handling protocol translation (REST to gRPC), and providing a stable public interface even as internal services evolve.',
    compiledJS: `# Architecture diagram (as comment)
# Client
#   ↓ HTTPS
# [API Gateway]  ← auth, rate-limit, routing, logging, SSL termination
#   ↙       ↘
# [Orders]  [Payments]  [Users]   ← internal services (plain HTTP)
#   ↓          ↓           ↓
# [Order DB] [Pay DB]  [User DB]

# Without gateway: each service implements auth independently
# With gateway:    one JWT validation plugin protects all routes`,
    bestPractice:
      'Keep the gateway thin — routing, auth, rate limiting, and observability headers only. Do not put business logic in the gateway. Use a Backend-for-Frontend (BFF) pattern when different client types (mobile, web, third-party) need significantly different API shapes — each BFF sits behind the gateway and aggregates calls for its specific client.',
    source: 'NGINX — What is an API Gateway?',
  },

  {
    id: 'i06',
    topic: 'Stateless Services',
    question: 'Why should microservices be designed to be stateless?',
    code: `# ✗ Stateful — session stored in memory
// app.ts
const sessions = new Map()  // dies if the pod restarts

// ✓ Stateless — session in Redis (external store)
import Redis from 'ioredis'
const redis = new Redis(process.env.REDIS_URL)

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))
# → any pod can handle any request`,
    options: [
      'Stateless services run faster because they never write to disk',
      'Stateless services can be freely scaled out and replaced without migrating session data',
      'Stateless services do not need a load balancer',
      'Kubernetes only supports stateless workloads',
    ],
    correctIndex: 1,
    explanation:
      'When a service stores no local state, any instance in the pool can handle any request — the load balancer can use simple round-robin routing and any instance can be restarted or replaced without data loss. Stateful services require sticky sessions or complex state migration during rolling updates. Kubernetes supports stateful workloads via StatefulSets, but these are significantly harder to operate, which is why moving state to an external backing service (Redis, PostgreSQL, S3) is strongly preferred.',
    compiledJS: `# Kubernetes: stateless deployment vs StatefulSet
# Stateless: simple Deployment, any pod can restart freely
kubectl scale deployment/api --replicas=5
kubectl rollout restart deployment/api  # zero downtime

# Stateful: StatefulSet with stable network identity + PVCs
# → much harder: ordered startup, sticky storage, DNS names
# → use only for databases, Kafka, Elasticsearch
kubectl get statefulset elasticsearch
# NAME            READY   AGE
# elasticsearch   3/3     30d`,
    bestPractice:
      'Externalise all state to dedicated backing services: sessions to Redis, files to object storage (S3), queued work to SQS or Kafka. This is the share-nothing architecture described in the 12-Factor App. The only data that should live in a container\'s ephemeral filesystem is non-critical scratch data that you can reconstruct.',
    source: '12factor.net — VI. Processes',
  },

  {
    id: 'i07',
    topic: 'Circuit Breaker',
    question:
      "In the circuit breaker pattern, what does the 'Half-Open' state represent?",
    code: `// Circuit breaker states (pseudo-TypeScript)
type CBState = 'Closed' | 'Open' | 'HalfOpen'

class CircuitBreaker {
  state: CBState = 'Closed'
  failureCount = 0
  readonly threshold = 5
  readonly timeout = 30_000   // 30s before trying again

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'Open') throw new Error('Circuit open — fast-fail')

    try {
      const result = await fn()
      if (this.state === 'HalfOpen') this.reset()  // success → close
      return result
    } catch (err) {
      this.recordFailure()
      throw err
    }
  }

  private recordFailure() {
    if (++this.failureCount >= this.threshold) {
      this.state = 'Open'
      setTimeout(() => { this.state = 'HalfOpen' }, this.timeout)
    }
  }
  private reset() { this.state = 'Closed'; this.failureCount = 0 }
}`,
    options: [
      'The circuit is permanently disabled and traffic is rejected',
      'The circuit allows a limited number of test requests through to see whether the downstream service has recovered',
      'The circuit is passing all traffic normally after a successful recovery',
      'The circuit is blocked but still logging requests for audit purposes',
    ],
    correctIndex: 1,
    explanation:
      'The circuit breaker pattern has three states: Closed (requests flow normally), Open (requests fast-fail without hitting the downstream service), and Half-Open (a probe phase). After the Open timeout expires, the breaker transitions to Half-Open and allows a controlled number of test requests through. If they succeed, it closes again; if they fail, it returns to Open. This prevents repeatedly hammering a degraded downstream service and gives it time to recover.',
    compiledJS: `# Resilience4j configuration (Java — widely used reference)
resilience4j:
  circuitbreaker:
    instances:
      payments:
        slidingWindowSize: 10
        failureRateThreshold: 50        # open after 50% failures
        waitDurationInOpenState: 30s    # stay open for 30s
        permittedNumberOfCallsInHalfOpenState: 3  # probe calls
        slowCallRateThreshold: 80       # also trip on slow calls
        slowCallDurationThreshold: 2s`,
    bestPractice:
      'Combine circuit breakers with fallback logic: when the circuit is open, return a cached response, a degraded response, or a user-friendly error — not a 500. Use libraries like Resilience4j (JVM), Polly (.NET), or opossum (Node.js) rather than implementing circuit breakers from scratch. Expose circuit breaker state as a Prometheus metric so you can alert on open circuits.',
    source: 'Martin Fowler — Circuit Breaker',
  },

  {
    id: 'i08',
    topic: 'Rate Limiting',
    question:
      'How does the token bucket algorithm differ from the leaky bucket algorithm for rate limiting?',
    code: `// Token bucket — allows bursts
class TokenBucket {
  private tokens: number
  constructor(
    private readonly capacity: number,    // e.g. 100
    private readonly refillRate: number,  // tokens per second
  ) { this.tokens = capacity }

  consume(n = 1): boolean {
    this.refill()
    if (this.tokens < n) return false  // reject
    this.tokens -= n
    return true   // allow burst up to capacity
  }
  private refill() { /* add refillRate tokens per elapsed second */ }
}

// Leaky bucket — strict constant output
// Requests queue; bucket drains at fixed rate regardless of input`,
    options: [
      'Token bucket enforces a strict constant output rate; leaky bucket allows bursts up to the bucket capacity',
      'Token bucket allows bursts up to the bucket capacity; leaky bucket enforces a strict constant output rate',
      'They are identical — just different names used by different vendors',
      'Leaky bucket is only used for UDP traffic; token bucket is for HTTP',
    ],
    correctIndex: 1,
    explanation:
      'Token bucket accumulates tokens over time up to a maximum capacity, allowing bursts — a client can spend multiple tokens at once. This is suited to APIs that want to allow a burst of activity followed by a quiet period. Leaky bucket treats requests like water poured into a leaky container: it drains at a constant rate regardless of how many requests arrive, smoothing traffic to a predictable output rate. Token bucket is more common for API gateways because it is more user-friendly while still protecting the backend.',
    compiledJS: `# Redis-based token bucket (Node.js)
const CAPACITY = 100
const REFILL_RATE = 10   # tokens per second

async function isAllowed(userId: string): Promise<boolean> {
  const key = \`rate:\${userId}\`
  const now = Date.now() / 1000

  const [tokens, lastRefill] = await redis.hmget(key, 'tokens', 'last')
  const elapsed = now - (Number(lastRefill) || now)
  const refilled = Math.min(CAPACITY, (Number(tokens) || CAPACITY) + elapsed * REFILL_RATE)

  if (refilled < 1) return false

  await redis.hset(key, { tokens: refilled - 1, last: now })
  await redis.expire(key, 3600)
  return true
}`,
    bestPractice:
      'Store rate-limit state in Redis rather than in-process memory so it works correctly when multiple application instances are running. Return 429 Too Many Requests with a Retry-After header so well-behaved clients know when to retry. Implement separate rate limits per API key, per IP, and per endpoint — a single global limit is too blunt.',
    source: 'Cloudflare Docs — Rate Limiting',
  },

  {
    id: 'i09',
    topic: 'Immutable Infrastructure',
    question: "What does 'immutable infrastructure' mean?",
    code: `# Mutable (traditional) — patch in place ← avoid
ssh prod-server "apt-get upgrade -y nginx && systemctl reload nginx"
# → configuration drift, unknown state, unrepeatable

# Immutable — replace, never patch ← correct
# 1. Build new image with updated nginx
docker build -t my-app:1.5.0 --build-arg NGINX_VERSION=1.25.3 .
docker push registry/my-app:1.5.0

# 2. Roll out new instances
kubectl set image deployment/app app=registry/my-app:1.5.0

# 3. Old pods are terminated; new ones spin up from the immutable image
# → every running instance is in a known, tested state`,
    options: [
      'Servers are patched in place and never restarted',
      'Servers are never modified after deployment; changes are applied by replacing instances with new ones built from updated images',
      'Infrastructure configuration files are stored in a read-only S3 bucket',
      'All servers in a cluster must have identical hardware specifications',
    ],
    correctIndex: 1,
    explanation:
      'Immutable infrastructure treats running servers as disposable artifacts: once deployed, a server (or container) is never modified. Patches, config changes, or dependency upgrades require building a new image and rolling it out. This eliminates configuration drift — the gradual divergence between what you think is on a server and what is actually there. It also makes rollback trivial: keep the old image and re-deploy it.',
    compiledJS: `# HashiCorp Packer — build an immutable AMI
source "amazon-ebs" "api" {
  ami_name      = "my-api-{{timestamp}}"
  instance_type = "t3.medium"
  source_ami_filter {
    filters = { name = "ubuntu/images/hvm-ssd/ubuntu-22.04-amd64-server-*" }
  }
}

build {
  sources = ["source.amazon-ebs.api"]
  provisioner "shell" {
    inline = [
      "apt-get update -y",
      "apt-get install -y nodejs=20.*",
      "npm install -g pm2",
    ]
  }
}
# → new AMI ID: ami-0abc123  (never SSH into it again)`,
    bestPractice:
      'Combine immutable infrastructure with GitOps: every change to a running system must go through a pull request that builds a new image. Use image scanning (Trivy, Snyk) in the build pipeline so vulnerabilities are caught before deployment. Tag images with the git commit SHA so you always know exactly what code is running.',
    source: 'HashiCorp — What is Immutable Infrastructure?',
  },

  {
    id: 'i10',
    topic: 'Readiness Probes',
    question:
      'Why does a rolling update in Kubernetes use readiness probes before routing traffic to new pods?',
    code: `# Deployment with readiness probe — zero-downtime rolling update
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # allow 1 extra pod during update
      maxUnavailable: 0  # never remove an old pod until a new one is ready
  template:
    spec:
      containers:
        - name: api
          image: my-api:1.5.0
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
            failureThreshold: 2`,
    options: [
      'To check that the container image was signed by a trusted registry',
      'To ensure the new pod is fully initialised and ready to serve requests before old pods are removed',
      'To throttle the deployment speed to avoid overwhelming the scheduler',
      'To run database migrations inside the new pod before traffic is sent',
    ],
    correctIndex: 1,
    explanation:
      'Kubernetes gates traffic on readiness probes during rolling updates. A new pod is only added to the Service endpoints (and thus the load balancer rotation) once its readiness probe returns success. With maxUnavailable: 0, Kubernetes will not remove any old pods until a replacement has passed its readiness check. This guarantees that there is always at least the desired number of healthy pods serving traffic throughout the update.',
    compiledJS: `# Observe a zero-downtime rolling update
kubectl get pods -w
# NAME                   READY   STATUS
# api-75f8c-xkv2q        1/1     Running   ← old pod
# api-9d4bf-pmnr7        0/1     Running   ← new pod (starting)
# api-9d4bf-pmnr7        1/1     Running   ← readiness probe passed
# api-75f8c-xkv2q        1/1     Terminating ← old pod removed AFTER new one is ready

# Check readiness probe status
kubectl describe pod api-9d4bf-pmnr7 | grep -A5 "Readiness"`,
    bestPractice:
      'Always set both readiness and liveness probes on production containers. Keep readiness probe logic fast (< 1 second) but meaningful — check that the app has loaded its config and connected to the database. Use initialDelaySeconds to give the container time to start before probing begins, and set a conservative failureThreshold so a momentary blip does not pull a healthy pod from rotation.',
    source: 'Kubernetes Docs — Configure Liveness, Readiness and Startup Probes',
  },

  // ── Advanced (a01–a10) ───────────────────────────────────────────────────────

  {
    id: 'a01',
    topic: 'Expand-Contract Migration',
    question:
      'What is the expand-contract (parallel change) pattern for database migrations?',
    code: `-- Phase 1: EXPAND — add new column alongside old one
-- Both old and new application code can run simultaneously
ALTER TABLE users ADD COLUMN full_name TEXT;

-- Backfill (batched to avoid lock contention)
UPDATE users SET full_name = first_name || ' ' || last_name
WHERE full_name IS NULL AND id BETWEEN 1 AND 100000;

-- Phase 2: Deploy new application code that writes to BOTH columns
-- Phase 3: CONTRACT — once old code is fully replaced, drop old column
ALTER TABLE users DROP COLUMN first_name, DROP COLUMN last_name;`,
    options: [
      'Run a full database backup before and after every schema change',
      'First expand the schema to support both old and new shapes, deploy code that works with both, then contract the schema by removing the old shape',
      'Scale the database cluster horizontally before applying a migration, then scale it back down afterwards',
      'Use feature flags to hide new columns from users until the migration is complete',
    ],
    correctIndex: 1,
    explanation:
      'Expand-contract (also called parallel change) separates schema changes from code deployments into three phases: expand (add the new shape alongside the old), transition (deploy code that works with both and backfill data), and contract (remove the old shape once no code references it). This allows rolling deploys where old and new application pods run simultaneously without either crashing. It is the safest way to perform zero-downtime schema migrations on live databases.',
    compiledJS: `# Zero-downtime migration timeline
# Day 0 — EXPAND:  ALTER TABLE users ADD COLUMN full_name TEXT
#                   (nullable — old code ignores it, no breakage)
# Day 1 — BACKFILL: UPDATE users SET full_name = first_name || ' ' || last_name
# Day 2 — DEPLOY v2: code writes to first_name, last_name, AND full_name
# Day 3 — DEPLOY v3: code reads only from full_name (old columns still exist)
# Day 4 — CONTRACT:  ALTER TABLE users DROP COLUMN first_name, DROP COLUMN last_name

# Tools that implement this: Flyway, Liquibase, golang-migrate
# Run with --dry-run first to see the generated SQL`,
    bestPractice:
      'Never apply a destructive migration (DROP COLUMN, ALTER TYPE with USING) in the same deployment as the code change that removes references to it. Always ship the expand phase first, wait for the rollout to stabilise (at minimum one successful deployment cycle), then ship the contract phase. Use a migration tool with a lock timeout (lock_timeout = 3s in PostgreSQL) to prevent migrations from holding exclusive locks for too long.',
    source: 'Martin Fowler — Parallel Change',
  },

  {
    id: 'a02',
    topic: 'Idempotency',
    question:
      'In the context of distributed systems, what does API idempotency guarantee?',
    code: `// Idempotent payment handler using idempotency key
app.post('/payments', async (req, res) => {
  const idempotencyKey = req.headers['idempotency-key']
  if (!idempotencyKey) return res.status(400).json({ error: 'missing idempotency-key' })

  // Check if we already processed this request
  const cached = await redis.get(\`idem:\${idempotencyKey}\`)
  if (cached) {
    return res.status(200).json(JSON.parse(cached))  // replay stored response
  }

  // Process the payment once
  const result = await chargeCard(req.body)

  // Store result for 24 hours
  await redis.setex(\`idem:\${idempotencyKey}\`, 86400, JSON.stringify(result))
  res.status(201).json(result)
})`,
    options: [
      'A request will always be processed in under 100 ms',
      'Making the same request multiple times produces the same result as making it once',
      'The API will automatically retry failed requests on behalf of the client',
      'Each request is processed by exactly one server instance',
    ],
    correctIndex: 1,
    explanation:
      'Idempotency means applying the same operation multiple times has the same effect as applying it once. It is essential for safe retries in distributed systems where networks are unreliable: a client cannot know whether a request that timed out was received and processed. If the operation is idempotent, the client can safely retry. HTTP GET, PUT, and DELETE are idempotent by definition; POST is not unless you implement idempotency keys. Payment APIs, message consumers, and Kubernetes controllers all rely on idempotency to avoid duplicate side effects.',
    compiledJS: `# Stripe-style idempotency key
curl -X POST https://api.stripe.com/v1/charges \\
  -H "Idempotency-Key: a1b2c3d4-unique-per-intent" \\
  -d amount=2000 \\
  -d currency=usd \\
  -d source=tok_visa

# If the network drops and you retry with the SAME key:
# → Stripe returns the SAME response, does NOT charge twice

# Message consumer idempotency (SQS)
async function processMessage(msg: SQSMessage) {
  const dedupeKey = msg.MessageId
  const alreadyProcessed = await db.processedMessages.findOne(dedupeKey)
  if (alreadyProcessed) return  // skip — already handled
  await doWork(msg.Body)
  await db.processedMessages.insert(dedupeKey)
}`,
    bestPractice:
      'Use a UUID idempotency key generated by the client, stored with the request result in Redis or the database. On retry, return the previously stored response without re-executing side effects. For message consumers, use the message ID as the deduplication key and implement an at-least-once + idempotent-consumer pattern rather than trying to guarantee exactly-once delivery at the broker level.',
    source: 'Stripe API Docs — Idempotent Requests',
  },

  {
    id: 'a03',
    topic: 'Saga Pattern',
    question:
      'In the Saga pattern, what is the key difference between choreography and orchestration?',
    code: `// Orchestration: a central SagaOrchestrator drives each step
class OrderSagaOrchestrator {
  async execute(orderId: string) {
    await this.inventoryService.reserve(orderId)     // step 1
    try {
      await this.paymentService.charge(orderId)      // step 2
    } catch {
      await this.inventoryService.release(orderId)   // compensate step 1
      throw new SagaFailedError()
    }
    await this.shippingService.schedule(orderId)     // step 3
  }
}

// Choreography: services react to domain events (no central brain)
// OrderPlaced → InventoryService → InventoryReserved
// InventoryReserved → PaymentService → PaymentCharged
// PaymentFailed → InventoryService listens → releases reservation`,
    options: [
      'Choreography uses a central coordinator to call each service in order; orchestration uses events emitted by each service',
      'Choreography has each service react to domain events and publish new ones; orchestration uses a central saga orchestrator to command each step',
      'Choreography is only used for read operations; orchestration is only for write operations',
      'They are equivalent implementations with different naming conventions',
    ],
    correctIndex: 1,
    explanation:
      'In saga choreography, services communicate exclusively through domain events: a service completes its local transaction and emits an event; downstream services listen and react, emitting their own events. There is no central controller. In orchestration, a dedicated saga orchestrator process explicitly calls each participant service in sequence and handles compensating transactions on failure. Choreography is more decoupled but harder to reason about; orchestration is more explicit but creates a single point of complexity.',
    compiledJS: `# Event-driven choreography (AWS EventBridge)
# OrderService publishes:
{
  "source": "order-service",
  "detail-type": "OrderPlaced",
  "detail": { "orderId": "ord-123", "items": [...] }
}

# InventoryService rule (EventBridge):
{
  "source": ["order-service"],
  "detail-type": ["OrderPlaced"]
}
# → triggers Lambda: reserve stock, emit InventoryReserved

# Orchestration (AWS Step Functions)
# OrderSaga state machine:
# [ReserveInventory] → [ChargePayment] → [ScheduleShipping]
#         ↓ (on failure)
# [ReleaseInventory] → [RefundPayment]`,
    bestPractice:
      'Use choreography for simple, linear flows where each service is clearly the owner of one domain event. Prefer orchestration when you need complex compensation logic, conditional branching, or easy visibility into saga state — AWS Step Functions or Temporal make this tractable. Always design compensating transactions before implementing the forward path.',
    source: 'DDIA — Chapter 9: Consistency and Consensus',
  },

  {
    id: 'a04',
    topic: 'Strangler Fig',
    question: 'The Strangler Fig pattern is used to:',
    code: `# Strangler Fig implementation with Nginx routing
# Step 1: Route old paths to monolith, new /payments to microservice
upstream monolith  { server legacy:8080; }
upstream payments  { server payments-svc:3000; }

server {
  listen 80;
  # New microservice handles /payments
  location /payments {
    proxy_pass http://payments;
  }
  # Everything else still goes to the monolith
  location / {
    proxy_pass http://monolith;
  }
}

# Step 2: Migrate /orders → Step 3: Migrate /users → retire monolith`,
    options: [
      'Gradually replace a legacy monolith by routing specific features to new microservices until the monolith can be retired',
      'Throttle traffic to a legacy system to force users onto a new platform faster',
      'Inject faults into a legacy system to find hidden dependencies before migration',
      'Wrap a legacy database with an ORM to decouple it from the application layer',
    ],
    correctIndex: 0,
    explanation:
      'The Strangler Fig pattern (named after the fig tree that grows around and eventually replaces its host tree) allows you to incrementally migrate a legacy monolith to a new architecture. A facade or proxy sits in front of both systems; as each feature is re-implemented in the new system, the routing rule is updated to direct that traffic away from the monolith. The monolith gradually shrinks until it can be decommissioned. This avoids the "big bang" rewrite — the riskiest migration strategy.',
    compiledJS: `# Migration progress tracker (as comments)
# Month 1: /payments       → migrated to payments-service ✓
# Month 2: /orders         → migrated to orders-service   ✓
# Month 3: /users          → migrated to users-service    ✓
# Month 4: /inventory      → migrated to inventory-service✓
# Month 5: /notifications  → migrated to notify-service   ✓
# Month 6: monolith decommissioned — no more strangler fig needed

# Key: the proxy/facade is the control point
# Nginx, API Gateway (Kong), AWS API Gateway, or Ambassador all work
# The facade also handles data migration and backward compat`,
    bestPractice:
      'Identify the bounded contexts in the monolith before migrating — each context becomes a candidate microservice. Migrate leaf features (those with few inbound dependencies) first to build confidence. Never try to run two systems against the same database without a clear data ownership boundary; add an anti-corruption layer to translate between the monolith\'s data model and the new service\'s model.',
    source: 'Martin Fowler — Strangler Fig Application',
  },

  {
    id: 'a05',
    topic: 'Chaos Engineering',
    question:
      'What is the primary goal of chaos engineering tools like Chaos Monkey and Gremlin?',
    code: `# Gremlin attack: terminate a random pod in production
gremlin attack-container \\
  --target-container api \\
  --attack shutdown

# Chaos Monkey (Netflix) equivalent for Kubernetes — Chaos Mesh
apiVersion: chaos-mesh.org/v1alpha1
kind: PodChaos
metadata:
  name: kill-api-pod
spec:
  action: pod-kill
  mode: one
  selector:
    namespaces: [production]
    labelSelectors:
      app: api
  scheduler:
    cron: "@every 1h"   # kill a random api pod every hour`,
    options: [
      'To stress-test databases by generating millions of random write operations',
      'To proactively inject failures into production systems to expose weaknesses before they cause unplanned outages',
      'To simulate high network latency during load testing in staging environments only',
      'To fuzz API inputs and detect security vulnerabilities in microservices',
    ],
    correctIndex: 1,
    explanation:
      'Chaos engineering deliberately introduces failures — terminated pods, network latency, CPU pressure, DNS failures — into production systems to verify that resilience mechanisms (circuit breakers, retries, failovers) work under real conditions. The hypothesis is: "If I kill a pod, the system should continue serving requests with no user-visible impact." Chaos Monkey, created by Netflix, kills random EC2 instances; Gremlin provides a more controlled suite of attacks. The discipline is based on building confidence through experimentation rather than hoping nothing goes wrong.',
    compiledJS: `# Chaos engineering workflow
# 1. Define the steady state (what "normal" looks like)
#    e.g., p99 latency < 200ms, error rate < 0.1%

# 2. Hypothesise that steady state holds during the attack
# 3. Introduce the experiment (Chaos Mesh, Gremlin)
# 4. Observe metrics (Prometheus/Grafana)

# Example Chaos Mesh network partition experiment
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: delay-payments
spec:
  action: delay
  mode: one
  selector:
    labelSelectors:
      app: payments-service
  delay:
    latency: "500ms"
    jitter: "100ms"
  duration: "5m"`,
    bestPractice:
      'Start chaos experiments in staging, establish a clear steady-state metric, and have a kill switch ready before running experiments in production. Run experiments during business hours when the on-call team is available. Document every experiment and its outcome — the value is in the learning and in the system improvements that follow, not in the breaking itself.',
    source: 'Principles of Chaos Engineering — principlesofchaos.org',
  },

  {
    id: 'a06',
    topic: 'Service Mesh',
    question:
      'What does a service mesh like Istio or Linkerd provide that a traditional API gateway does not?',
    code: `# Istio — automatic mTLS between ALL service-to-service calls
# No application code changes required — the sidecar handles it
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: production
spec:
  mtls:
    mode: STRICT   # all east-west traffic encrypted + authenticated

# Traffic shifting: canary 10% to v2
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: orders
spec:
  http:
    - route:
        - destination: { host: orders, subset: v1 }
          weight: 90
        - destination: { host: orders, subset: v2 }
          weight: 10`,
    options: [
      'A single external entry point for all client-facing HTTP traffic',
      'Mutual TLS, traffic observability, and fine-grained routing between every service-to-service call inside the cluster',
      'Automatic horizontal pod autoscaling based on network throughput',
      'DNS resolution for services that span multiple Kubernetes namespaces',
    ],
    correctIndex: 1,
    explanation:
      'An API gateway handles north-south traffic (client to cluster entry point). A service mesh addresses east-west traffic (service to service inside the cluster) using sidecar proxies (Envoy in Istio, proxy-rs in Linkerd) injected into each Pod. The mesh provides mutual TLS for all inter-service communication, distributed tracing, circuit breaking, retries, and fine-grained traffic management — all without changing application code. This shifts observability and resilience from the application layer to the infrastructure layer.',
    compiledJS: `# What Istio offloads from your application code
# Before service mesh: each service implements:
# - mTLS certificate management
# - distributed tracing (add trace headers)
# - circuit breaking (custom code)
# - retry logic
# - rate limiting

# After Istio:
# - mTLS: automatic (PeerAuthentication STRICT)
# - tracing: Envoy sidecar injects B3 trace headers
# - circuit breaking: DestinationRule outlierDetection
# - retries: VirtualService retries spec
# - rate limiting: EnvoyFilter or external rate limiter`,
    bestPractice:
      'Do not adopt a service mesh just because it is popular. Istio adds significant operational complexity (CRDs, Envoy configuration, certificate rotation). Evaluate Linkerd first if your primary needs are mTLS and observability — it is lighter-weight. If you are already using Kubernetes network policies and OpenTelemetry, you may get 80% of the benefit with much less complexity.',
    source: 'Istio Docs — What is a Service Mesh?',
  },

  {
    id: 'a07',
    topic: 'GitOps',
    question:
      'In GitOps (using ArgoCD or Flux), what is the single source of truth for the desired cluster state?',
    code: `# ArgoCD Application — declares that the cluster must match the Git repo
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: production-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/k8s-manifests
    targetRevision: HEAD
    path: apps/api/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true      # remove resources deleted from Git
      selfHeal: true   # revert manual cluster changes`,
    options: [
      'The running containers in the Kubernetes cluster',
      'A Git repository containing declarative infrastructure and application manifests',
      "The CI pipeline's most recently published artifact",
      'An operations runbook stored in a wiki',
    ],
    correctIndex: 1,
    explanation:
      'GitOps (popularised by WeaveWorks) mandates that every desired cluster state is declared in a Git repository. A GitOps operator (ArgoCD, Flux) continuously polls the repo and reconciles the live cluster to match. This means all changes go through pull requests — providing a full audit trail, code review, and the ability to roll back by reverting a commit. The cluster\'s actual state is treated as derived from the Git repo, not the other way around.',
    compiledJS: `# GitOps workflow
# 1. Developer opens PR: changes Deployment image tag in git repo
#    apps/api/overlays/production/kustomization.yaml:
#      images:
#        - name: my-api
#          newTag: 1.5.0   ← changed from 1.4.0

# 2. PR reviewed and merged to main

# 3. ArgoCD detects drift (repo ≠ cluster)
# 4. ArgoCD reconciles: kubectl apply (no kubectl from a human)

# 5. Rollback = git revert PR + merge
#    ArgoCD re-applies → cluster reverts in seconds

# Audit trail: every cluster change has a git commit + PR link`,
    bestPractice:
      'Use a separate Git repository for infrastructure manifests (the "config repo") rather than mixing it with application code. Enable branch protection and require PR reviews for the config repo. Use Kustomize or Helm to manage environment-specific overlays rather than duplicating manifests. Set up ArgoCD notifications to Slack so the team is alerted when apps fall out of sync.',
    source: 'ArgoCD Docs — Getting Started with GitOps',
  },

  {
    id: 'a08',
    topic: 'Multi-Region Active-Active',
    question:
      'In a multi-region active-active architecture, which consistency challenge must be explicitly addressed?',
    code: `# CockroachDB multi-region — handles write conflicts automatically
# Region topology
CREATE DATABASE mydb PRIMARY REGION "us-east1"
  REGIONS "eu-west1", "ap-southeast1";

# REGIONAL BY ROW — each row is homed in the region where it was written
ALTER TABLE orders SET LOCALITY REGIONAL BY ROW;

# Application-level conflict resolution — last-write-wins with vector clock
interface WriteIntent {
  key: string
  value: unknown
  timestamp: number     // lamport clock
  region: string
}
// On conflict: compare timestamps; if equal, region name is tie-breaker`,
    options: [
      'Ensuring all regions use the same container image digest',
      'Handling write conflicts and replication lag when the same data can be modified concurrently in different regions',
      'Routing all writes through a single primary region to avoid latency',
      'Synchronising Kubernetes node clocks across regions via NTP',
    ],
    correctIndex: 1,
    explanation:
      'Active-active means every region accepts writes, so the same record can be modified simultaneously in US-East and EU-West. The system must define a conflict resolution strategy: last-write-wins (simple, may lose updates), CRDTs (conflict-free replicated data types, automatic merge), or application-level resolution (most correct, most complex). Replication lag means readers in one region may see stale data for seconds or minutes after a write in another region — this is eventual consistency. Systems must be designed to tolerate this or route certain reads to the write region.',
    compiledJS: `# AWS Global Tables (DynamoDB) — managed multi-region active-active
aws dynamodb create-global-table \\
  --global-table-name Orders \\
  --replication-group RegionName=us-east-1 RegionName=eu-west-1 RegionName=ap-southeast-1

# DynamoDB uses last-writer-wins (wall clock) for conflict resolution
# Approximate replication lag: < 1 second under normal conditions

# Custom conflict resolution pattern (event sourcing)
# Append-only event log per region → merge event streams by timestamp
# → no conflicts, full history, eventual consistency`,
    bestPractice:
      'Choose the right consistency model for each data type: user profiles can tolerate eventual consistency, payment records cannot. Use event sourcing or append-only data structures wherever possible — they avoid write conflicts by design. Define your Recovery Point Objective (RPO) and Recovery Time Objective (RTO) before choosing a replication strategy, since lower RPO means higher write latency.',
    source: 'DDIA — Chapter 5: Replication',
  },

  {
    id: 'a09',
    topic: 'FinOps',
    question:
      'Which combination of strategies best describes FinOps right-sizing and cost optimisation for cloud infrastructure?',
    code: `# AWS Cost Explorer: identify over-provisioned instances
aws ce get-rightsizing-recommendation \\
  --service "AmazonEC2" \\
  --configuration '{"RecommendationTarget":"SAME_INSTANCE_FAMILY","BenefitsConsidered":true}'

# Kubernetes: VPA right-sizes pod CPU/memory requests
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: api-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  updatePolicy:
    updateMode: "Off"   # recommendation-only; apply manually in prod`,
    options: [
      'Commit to 3-year reserved instances for all workloads to minimise per-hour cost',
      'Use spot/preemptible instances for stateless workloads, right-size based on actual utilisation metrics, and apply auto-scaling to match demand',
      'Over-provision all services by 3x to ensure headroom and avoid performance incidents',
      'Migrate all workloads to the cheapest cloud region regardless of user geography',
    ],
    correctIndex: 1,
    explanation:
      'FinOps optimisation has three complementary levers: right-sizing (match instance/pod resources to actual measured utilisation, not guesses), spot/preemptible instances (60–90% cheaper than on-demand; safe for stateless, fault-tolerant workloads), and auto-scaling (scale to zero or near-zero during low-traffic periods). Reserved instances offer significant discounts but should be purchased only for the stable baseline load you are confident will run 24/7 — not for burst capacity.',
    compiledJS: `# KEDA: scale to zero when no messages in queue
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: worker-scaler
spec:
  scaleTargetRef:
    name: queue-worker
  minReplicaCount: 0   # scale to zero at night
  maxReplicaCount: 50
  triggers:
    - type: aws-sqs-queue
      metadata:
        queueURL: https://sqs.us-east-1.amazonaws.com/.../jobs
        queueLength: "5"   # 1 pod per 5 messages

# Spot instance node group (EKS managed node group)
# → 70% cost saving for batch / stateless workers`,
    bestPractice:
      'Tag all cloud resources with team, environment, and service labels to allocate costs accurately. Review utilisation weekly in the first 3 months of a new service — it is common to provision for worst-case load and then never adjust. Use Spot instances for CI/CD workers, batch jobs, and stateless APIs with retries; use on-demand for stateful databases and control plane components that must not be interrupted.',
    source: 'FinOps Foundation — FinOps Framework',
  },

  {
    id: 'a10',
    topic: 'Observability',
    question:
      'Which three pillars make up full observability in a distributed system, and why are correlation IDs important?',
    code: `// OpenTelemetry: propagate correlation ID across all services
import { trace, context, propagation } from '@opentelemetry/api'

app.use((req, res, next) => {
  // Extract trace context from incoming headers (W3C TraceContext)
  const ctx = propagation.extract(context.active(), req.headers)
  const span = trace.getTracer('api').startSpan('http.request', {}, ctx)

  // Attach correlation ID to logs
  const traceId = span.spanContext().traceId
  req.log = logger.child({ traceId, service: 'api' })
  req.log.info({ method: req.method, path: req.url }, 'request received')

  context.with(trace.setSpan(ctx, span), () => next())
  res.on('finish', () => span.end())
})`,
    options: [
      'Uptime, latency, and error rate; correlation IDs link SLO alerts to on-call schedules',
      'Logs, metrics, and traces; correlation IDs allow a single request to be tracked end-to-end across all services and their telemetry',
      'Dashboards, alerts, and runbooks; correlation IDs replace the need for distributed tracing',
      'CPU, memory, and disk; correlation IDs map infrastructure metrics to application deployments',
    ],
    correctIndex: 1,
    explanation:
      'The three pillars of observability are: logs (timestamped event records for debugging), metrics (aggregated numeric measurements for alerting and trending), and distributed traces (end-to-end request journeys across service boundaries). Correlation IDs (also called trace IDs or request IDs) are propagated through every service call via HTTP headers. They allow you to correlate a log line in service A, a span in the distributed trace, and a Prometheus metric spike, all for the same user request — without which debugging microservices is nearly impossible.',
    compiledJS: `# OpenTelemetry Collector pipeline
# app → OTLP → OTel Collector → Jaeger (traces) + Prometheus (metrics) + Loki (logs)

# Grafana query: find all logs for a specific trace
{service="payments"} | json | traceId="4bf92f3577b34da6a3ce929d0e0e4736"

# Jaeger: visualise the full request journey
# api (50ms) → orders (30ms) → payments (120ms ← bottleneck)
#                            ↘ inventory (15ms)

# Prometheus alert: high error rate triggers investigation
# → query Jaeger for failing trace IDs
# → search Loki logs by those trace IDs for root cause`,
    bestPractice:
      'Instrument every service with OpenTelemetry from day one — it is vendor-neutral and lets you switch between Jaeger, Zipkin, Datadog, or Honeycomb without code changes. Generate trace IDs at the API gateway and propagate them in the traceparent header (W3C TraceContext). Attach the trace ID to every log line so you can pivot from a log alert directly to the distributed trace.',
    source: 'OpenTelemetry Docs — What is Observability?',
  },
]
