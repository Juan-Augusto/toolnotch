import type { InterviewQuestion } from '@/lib/interviewTypes'

export const DATABASE_DESIGN_QUESTIONS_PT: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "Primary Key",
    "question": "Qual é o objetivo principal de uma chave primária em um banco de dados relacional?",
    "code": null,
    "options": [
      "Ordenar linhas da tabela automaticamente em ordem alfabética",
      "Identificar de forma única cada registro individual em uma tabela",
      "Estabelecer uma ligação referencial estrangeira entre duas tabelas",
      "Aplicar restrições NOT NULL obrigatórias em todas as colunas"
    ],
    "correctIndex": 1,
    "explanation": "Uma chave primária identifica de forma única cada registro em uma tabela, garantindo que não existam dois registros com o mesmo valor de chave.",
    "compiledJS": "-- DDL with primary key\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n  email TEXT NOT NULL UNIQUE\n);\n\n-- The engine implicitly creates:\n-- UNIQUE INDEX users_pkey ON users(id)",
    "bestPractice": "Prefer a surrogate integer or UUID as the primary key over a natural key (email, username) — natural keys change and FK relationships break with them. In PostgreSQL use BIGINT GENERATED ALWAYS AS IDENTITY; in MySQL use BIGINT AUTO_INCREMENT. Avoid composite primary keys on large tables unless the relationship table genuinely has no other identity.",
    "source": "PostgreSQL Docs — Constraints: Primary Keys"
  },
  {
    "id": "b02",
    "topic": "Foreign Key",
    "question": "O que uma chave estrangeira faz em um banco de dados relacional?",
    "code": null,
    "options": [
      "Criptografa valores de colunas sensíveis usando chaves AES-256 para garantir segurança criptográfica no disco",
      "Referencia a chave primária de outra tabela, garantindo que o banco de dados imponha integridade referencial",
      "Acelera consultas SELECT analíticas ao indexar colunas de chave estrangeira em árvores B-Tree na memória",
      "Impede que registros duplicados sejam inseridos em uma única tabela sem exigir restrições de unicidade"
    ],
    "correctIndex": 1,
    "explanation": "Uma chave estrangeira estabelece uma relação entre duas tabelas ao referenciar a chave primária da tabela pai, garantindo a integridade referencial.",
    "compiledJS": "CREATE TABLE orders (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT NOT NULL\n    REFERENCES users(id)\n    ON DELETE CASCADE\n    ON UPDATE CASCADE\n);\n\n-- Attempting to insert an order for a non-existent user:\n-- INSERT INTO orders(id, user_id) VALUES (1, 9999);\n-- ERROR: insert or update on table \"orders\" violates\n-- foreign key constraint \"orders_user_id_fkey\"",
    "bestPractice": "Always add an index on foreign key columns — the database enforces the constraint via a lookup on the parent table, and without an index every FK check is a sequential scan. In PostgreSQL this index is NOT created automatically (unlike MySQL InnoDB). Use ON DELETE RESTRICT or ON DELETE CASCADE consciously; leaving it as the default (RESTRICT) is safer for audit-sensitive data.",
    "source": "PostgreSQL Docs — Referential Integrity"
  },
  {
    "id": "b03",
    "topic": "NoSQL",
    "question": "Qual das seguintes opções descreve melhor um banco de dados NoSQL?",
    "code": null,
    "options": [
      "Um motor de armazenamento plano sem suporte a criação de índices",
      "Um banco relacional projetado para armazenar dados puramente numéricos",
      "Um banco não relacional com suporte a modelos de documento, chave-valor ou grafo",
      "Um banco relacional tradicional que proíbe comandos e sintaxe SQL padrão"
    ],
    "correctIndex": 2,
    "explanation": "Bancos de dados NoSQL são não relacionais e suportam modelos de dados flexíveis, como documentos, chave-valor, famílias de colunas e grafos.",
    "compiledJS": null,
    "bestPractice": "Choose NoSQL when your access pattern is known, simple, and unlikely to require ad-hoc joins — e.g. a user session store (key-value), a product catalog with varying attributes (document), or a social graph (graph DB). Do not reach for NoSQL to avoid schema design — a poorly thought-out document schema becomes just as painful as a badly normalised relational one.",
    "source": "Martin Fowler — NoSQL Distilled (overview)"
  },
  {
    "id": "b04",
    "topic": "CRUD",
    "question": "O que significa a sigla CRUD no contexto de operações em bancos de dados?",
    "code": null,
    "options": [
      "Copiar, Substituir, Atualizar, Excluir (Copy, Replace, Update, Delete)",
      "Criar, Ler, Atualizar, Excluir (Create, Read, Update, Delete)",
      "Conectar, Recuperar, Carregar, Descartar (Connect, Retrieve, Upload, Drop)",
      "Criar, Restaurar, Desfazer, Implantar (Create, Restore, Undo, Deploy)"
    ],
    "correctIndex": 1,
    "explanation": "CRUD significa Create, Read, Update e Delete (Criar, Ler, Atualizar e Excluir), as quatro operações fundamentais realizadas em registros de bancos de dados.",
    "compiledJS": "-- Create\nINSERT INTO users (email) VALUES ('alice@example.com');\n\n-- Read\nSELECT * FROM users WHERE id = 1;\n\n-- Update\nUPDATE users SET email = 'new@example.com' WHERE id = 1;\n\n-- Delete\nDELETE FROM users WHERE id = 1;",
    "bestPractice": "In production systems, prefer soft deletes (marking a row as deleted with a timestamp) over hard deletes for any entity with audit or compliance requirements. This preserves history without physically removing data, and allows tombstone-based CDC (change data capture) streams to propagate the deletion to downstream consumers.",
    "source": "PostgreSQL Docs — Data Manipulation"
  },
  {
    "id": "b05",
    "topic": "NULL Semantics",
    "question": "O que o valor NULL representa no SQL?",
    "code": null,
    "options": [
      "Um valor numérico inteiro zero (`0`)",
      "Uma cadeia de caracteres de texto vazia (`''`)",
      "A ausência de um valor ou um estado desconhecido",
      "Uma avaliação de condição booleana falsa (`FALSE`)"
    ],
    "correctIndex": 2,
    "explanation": "O valor NULL no SQL representa a ausência de um valor ou um valor desconhecido, sendo distinto de zero ou de uma string vazia.",
    "compiledJS": "-- This returns NO rows:\nSELECT * FROM users WHERE deleted_at = NULL;\n\n-- Correct:\nSELECT * FROM users WHERE deleted_at IS NULL;\n\n-- NULL propagates through expressions:\nSELECT NULL + 1;   -- result: NULL\nSELECT NULL = NULL; -- result: NULL (not TRUE)",
    "bestPractice": "Avoid nullable columns where possible — add NOT NULL constraints at the DB level and use sentinel values (empty string, epoch timestamp, 0) only when they carry genuine semantic meaning. When NULLs are unavoidable, use COALESCE() in queries to supply defaults and document the nullability intent in column comments.",
    "source": "SQL Standard — Three-Valued Logic"
  },
  {
    "id": "b06",
    "topic": "Relationships",
    "question": "Que tipo de relacionamento existe quando um registro na tabela A pode se relacionar com vários registros na tabela B, e um registro na tabela B também pode se relacionar com vários registros na tabela A?",
    "code": null,
    "options": [
      "Um para Um (1:1)",
      "Um para Muitos (1:N)",
      "Muitos para Muitos (M:N)",
      "Autorrelacionamento"
    ],
    "correctIndex": 2,
    "explanation": "Um relacionamento Muitos para Muitos (M:N) significa que registros de ambos os lados podem se relacionar com múltiplos registros do outro lado, sendo tipicamente resolvido por meio de uma tabela de junção (tabela associativa).",
    "compiledJS": "-- Junction table resolving M:N between students and courses\nCREATE TABLE enrolments (\n  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,\n  course_id  BIGINT REFERENCES courses(id)  ON DELETE CASCADE,\n  enrolled_at TIMESTAMPTZ DEFAULT NOW(),\n  PRIMARY KEY (student_id, course_id)\n);",
    "bestPractice": "Add extra columns to the junction table to store relationship metadata (enrolled_at, role, status) — this often turns out to be necessary as requirements grow. Use a composite PK on the two FK columns unless you need to reference the junction row from a third table, in which case add a surrogate PK.",
    "source": "Database Design for Mere Mortals — Chapter 11"
  },
  {
    "id": "b07",
    "topic": "Normalization",
    "question": "O que é normalização de banco de dados?",
    "code": null,
    "options": [
      "Converter todos os nomes de colunas para letras minúsculas",
      "Organizar os dados para reduzir a redundância e melhorar a integridade",
      "Mesclar todas as tabelas em uma única tabela plana para ganho de desempenho",
      "Fazer backup dos dados em um servidor secundário"
    ],
    "correctIndex": 1,
    "explanation": "A normalização é o processo de organização do esquema de um banco de dados para minimizar a redundância e garantir a integridade dos dados por meio de formas normais definidas.",
    "compiledJS": null,
    "bestPractice": "Normalise to at least 3NF as the default starting point, then consciously denormalize only where profiling shows a specific read bottleneck. Do not skip normalisation in favour of \"just adding more columns to avoid joins\" — the inconsistency bugs that arise from duplicated data are among the hardest to diagnose in production.",
    "source": "C. J. Date — An Introduction to Database Systems"
  },
  {
    "id": "b08",
    "topic": "ACID — Atomicity",
    "question": "Qual propriedade das transações ACID garante que uma transação seja totalmente concluída ou não produza nenhum efeito?",
    "code": null,
    "options": [
      "Consistência",
      "Isolamento",
      "Atomicidade",
      "Durabilidade"
    ],
    "correctIndex": 2,
    "explanation": "A atomicidade garante que todas as operações dentro de uma transação sejam tratadas como uma única unidade: ou todas são executadas com sucesso, ou todas sofrem rollback.",
    "compiledJS": "-- Both INSERTs succeed or neither does\nBEGIN;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n\n-- If the process crashes after the first UPDATE:\n-- On restart, PostgreSQL replays the WAL and rolls\n-- back the incomplete transaction automatically.",
    "bestPractice": "Wrap logically related mutations in a single transaction — never rely on application-level retries to compensate for partial writes. In ORMs, be explicit about transaction boundaries rather than using auto-commit mode; it is far too easy to leave a connection in an uncommitted state under ORM defaults.",
    "source": "PostgreSQL Docs — Transactions"
  },
  {
    "id": "b09",
    "topic": "SQL vs NoSQL",
    "question": "Qual é a principal diferença entre os modelos de consulta SQL e NoSQL?",
    "code": null,
    "options": [
      "SQL usa esquemas JSON fixos; NoSQL usa hierarquias dinâmicas em XML",
      "SQL usa esquemas rígidos com SQL; NoSQL usa modelos de dados flexíveis",
      "SQL roda apenas em Windows; NoSQL é restrito a containers Linux",
      "SQL exige índices clusterizados; NoSQL proíbe índices secundários"
    ],
    "correctIndex": 1,
    "explanation": "Bancos de dados SQL usam uma linguagem estruturada de consulta em esquemas predefinidos, enquanto bancos NoSQL oferecem modelos de dados flexíveis com diversas APIs de consulta adaptadas às suas estruturas.",
    "compiledJS": null,
    "bestPractice": "SQL is the right default for most applications because its flexibility for ad-hoc querying and strong consistency are invaluable as requirements change. Adopt NoSQL only when you have identified a specific access pattern that a relational model cannot serve well at your scale — premature adoption of NoSQL to appear modern is a common engineering mistake.",
    "source": "DDIA — Chapter 2: Data Models and Query Languages"
  },
  {
    "id": "b10",
    "topic": "Migrations",
    "question": "Qual é o objetivo de uma migração de banco de dados?",
    "code": null,
    "options": [
      "Mover volumes de armazenamento para outro data center na nuvem",
      "Exportar tabelas relacionais para arquivos compactados em CSV",
      "Aplicar alterações versionadas e incrementais de esquema no banco",
      "Converter tabelas relacionais e restrições em coleções NoSQL"
    ],
    "correctIndex": 2,
    "explanation": "Migrações de banco de dados são scripts versionados que aplicam mudanças incrementais no esquema, permitindo que as equipes evoluam a estrutura do banco de forma controlada e reproduzível.",
    "compiledJS": "-- Example Flyway migration: V3__add_deleted_at_to_users.sql\nALTER TABLE users\n  ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;\n\nCREATE INDEX CONCURRENTLY idx_users_deleted_at\n  ON users(deleted_at)\n  WHERE deleted_at IS NOT NULL;",
    "bestPractice": "Never modify a migration file that has already been applied to any environment — treat migrations as immutable history. For zero-downtime deployments follow the expand-contract pattern: first add the new column as nullable (expand), deploy the new code, then backfill and add constraints (contract) in a subsequent migration.",
    "source": "Flyway Docs — Versioned Migrations"
  },
  {
    "id": "i01",
    "topic": "2NF",
    "question": "Qual forma normal exige que todo atributo não chave seja totalmente dependente de forma funcional de toda a chave primária (eliminando dependências parciais)?",
    "code": null,
    "options": [
      "Primeira Forma Normal (1FN)",
      "Segunda Forma Normal (2FN)",
      "Terceira Forma Normal (3FN)",
      "Forma Normal de Boyce-Codd (FNBC)"
    ],
    "correctIndex": 1,
    "explanation": "A 2FN se apoia na 1FN exigindo que cada atributo não chave dependa de toda a chave primária composta, e não apenas de parte dela.",
    "compiledJS": "-- Violates 2NF: product_name depends only on product_id, not (order_id, product_id)\nCREATE TABLE order_items_bad (\n  order_id    BIGINT,\n  product_id  BIGINT,\n  product_name TEXT,   -- partial dependency!\n  quantity    INT,\n  PRIMARY KEY (order_id, product_id)\n);\n\n-- 2NF-compliant split:\nCREATE TABLE products (\n  id   BIGINT PRIMARY KEY,\n  name TEXT NOT NULL\n);\nCREATE TABLE order_items (\n  order_id   BIGINT,\n  product_id BIGINT REFERENCES products(id),\n  quantity   INT,\n  PRIMARY KEY (order_id, product_id)\n);",
    "bestPractice": "Surrogate primary keys (single-column auto-increment or UUID) automatically satisfy 2NF because partial dependencies cannot exist without a composite key. This is one of several reasons senior engineers prefer surrogate keys.",
    "source": "C. J. Date — An Introduction to Database Systems, Chapter 11"
  },
  {
    "id": "i02",
    "topic": "1NF",
    "question": "O que a Primeira Forma Normal (1FN) exige?",
    "code": null,
    "options": [
      "Ausência de dependências transitivas entre colunas não chave na tabela",
      "Valores de colunas atômicos e cada coluna com um tipo de dado único",
      "Todas as chaves estrangeiras referenciando chaves primárias válidas",
      "Uma chave primária composta definida por duas ou mais colunas da tabela"
    ],
    "correctIndex": 1,
    "explanation": "A 1FN exige que cada coluna contenha apenas valores atômicos e indivisíveis e que cada coluna armazene valores de um único tipo de dado, sem grupos de repetição.",
    "compiledJS": "-- Violates 1NF: tags is a comma-separated list\nCREATE TABLE posts_bad (\n  id   BIGINT PRIMARY KEY,\n  tags TEXT   -- e.g. \"typescript,nodejs,backend\"\n);\n\n-- 1NF-compliant: move repeating group to its own table\nCREATE TABLE post_tags (\n  post_id BIGINT REFERENCES posts(id),\n  tag     TEXT NOT NULL,\n  PRIMARY KEY (post_id, tag)\n);",
    "bestPractice": "PostgreSQL ARRAY and JSONB columns technically store non-atomic values and can violate 1NF in spirit. Use them only when the data is genuinely schemaless or when you have benchmarked that the flexibility outweighs the query complexity. For structured repeating groups, always normalise into a child table.",
    "source": "E. F. Codd — A Relational Model of Data for Large Shared Data Banks (1970)"
  },
  {
    "id": "i03",
    "topic": "Denormalization",
    "question": "Qual das seguintes opções é uma razão válida para desnormalizar intencionalmente um banco de dados?",
    "code": null,
    "options": [
      "Para atender a restrições rígidas de exclusão em cascata externa",
      "Para melhorar a taxa de leitura reduzindo junções entre tabelas",
      "Para impor validações de domínio de negócio mais rigorosas no banco",
      "Para garantir que todas as tabelas atendam estritamente à 3NF"
    ],
    "correctIndex": 1,
    "explanation": "A desnormalização introduz redundância deliberadamente para reduzir operações de join de alto custo, melhorando a performance de leitura ao custo de maior complexidade na escrita e risco de inconsistência.",
    "compiledJS": "-- Denormalized: posts stores comment_count to avoid COUNT(*) JOIN on every read\nCREATE TABLE posts (\n  id            BIGINT PRIMARY KEY,\n  title         TEXT NOT NULL,\n  comment_count INT  NOT NULL DEFAULT 0  -- redundant, kept in sync by trigger\n);\n\n-- Trigger that keeps comment_count accurate:\nCREATE FUNCTION inc_comment_count() RETURNS TRIGGER LANGUAGE plpgsql AS $$\nBEGIN\n  UPDATE posts SET comment_count = comment_count + 1\n  WHERE id = NEW.post_id;\n  RETURN NEW;\nEND $$;\n\nCREATE TRIGGER after_comment_insert\n  AFTER INSERT ON comments\n  FOR EACH ROW EXECUTE FUNCTION inc_comment_count();",
    "bestPractice": "Always measure before denormalizing — most join overhead is eliminated by proper indexing and does not require redundancy. When you do denormalize, enforce consistency with a database trigger or an application-level transactional update, and document the invariant clearly so future engineers do not break it.",
    "source": "DDIA — Chapter 3: Storage and Retrieval"
  },
  {
    "id": "i04",
    "topic": "Surrogate Keys",
    "question": "O que é uma chave substituta (surrogate key)?",
    "code": null,
    "options": [
      "Uma chave natural derivada de atributos do negócio como e-mail",
      "Uma chave gerada pelo sistema (UUID ou identity) sem valor de negócio",
      "Uma chave composta que identifica relações em tabelas de junção",
      "Uma chave estrangeira recursiva apontando para a própria tabela"
    ],
    "correctIndex": 1,
    "explanation": "Uma chave substituta (surrogate key) é um identificador artificial gerado pelo sistema (como um ID autoincrementável ou UUID) que não possui significado de negócio intrínseco.",
    "compiledJS": "-- Surrogate key (BIGINT IDENTITY)\nCREATE TABLE customers (\n  id    BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n  email TEXT NOT NULL UNIQUE  -- natural key demoted to a UNIQUE constraint\n);\n\n-- vs Natural key (fragile: email can change, breaking all FK references)\nCREATE TABLE customers_bad (\n  email TEXT PRIMARY KEY,\n  name  TEXT\n);",
    "bestPractice": "Use BIGINT surrogate keys as the default. Choose UUID (v7 for sequential inserts) only when you need globally unique identifiers across distributed systems or when you need to generate IDs client-side before inserting. Expose natural keys as UNIQUE constraints rather than PKs so they can be validated and changed without cascading FK updates.",
    "source": "Database Design for Mere Mortals — Chapter 9"
  },
  {
    "id": "i05",
    "topic": "ER Diagrams",
    "question": "Em um diagrama entidade-relacionamento (DER), o que indica uma linha dupla (participação total) no lado de uma entidade em um relacionamento?",
    "code": null,
    "options": [
      "A entidade possui uma chave primária composta de várias colunas",
      "Cada instância da entidade deve participar obrigatoriamente da relação",
      "A entidade define uma associação Many-to-Many com tabela de junção",
      "A entidade representa uma entidade fraca com chave identificadora parcial"
    ],
    "correctIndex": 1,
    "explanation": "Uma linha dupla (participação total) em um diagrama entidade-relacionamento significa que toda instância da entidade deve obrigatoriamente participar do relacionamento, sem participantes opcionais daquele lado.",
    "compiledJS": "-- Total participation of Employee in \"Works-In\" maps to NOT NULL FK:\nCREATE TABLE employees (\n  id          BIGINT PRIMARY KEY,\n  name        TEXT   NOT NULL,\n  department_id BIGINT NOT NULL  -- NOT NULL enforces total participation\n    REFERENCES departments(id)\n);\n\n-- Partial participation (nullable FK):\nCREATE TABLE employees_optional (\n  id          BIGINT PRIMARY KEY,\n  name        TEXT NOT NULL,\n  department_id BIGINT  -- nullable = partial participation\n    REFERENCES departments(id)\n);",
    "bestPractice": "Translate total participation directly to NOT NULL foreign key constraints at the DDL level — do not rely on application code to enforce it. Database constraints catch bugs in every code path (migrations, scripts, ORM bypasses) whereas application-level checks only guard the happy path.",
    "source": "Ramez Elmasri — Fundamentals of Database Systems, Chapter 7"
  },
  {
    "id": "i06",
    "topic": "CAP Theorem",
    "question": "De acordo com o teorema CAP, um banco de dados distribuído pode garantir no máximo quantas das três propriedades simultaneamente?",
    "code": null,
    "options": [
      "Todas as três: Consistência, Disponibilidade e Tolerância a Partições",
      "Apenas uma",
      "Quaisquer duas",
      "Nenhuma: elas estão sempre em conflito"
    ],
    "correctIndex": 2,
    "explanation": "O teorema CAP estabelece que um sistema distribuído pode garantir no máximo duas das três propriedades ao mesmo tempo: Consistência, Disponibilidade e Tolerância a Partições.",
    "compiledJS": null,
    "bestPractice": "CAP is a useful mental model but is often oversimplified. In practice, use the PACELC model which also accounts for latency trade-offs in the absence of partitions. Most teams should default to a CP store (PostgreSQL, Spanner) unless they have specific requirements for geographic distribution or always-on availability that justify AP trade-offs.",
    "source": "Eric Brewer — Towards Robust Distributed Systems (2000)"
  },
  {
    "id": "i07",
    "topic": "OLTP vs OLAP",
    "question": "Qual é a principal distinção entre cargas de trabalho OLTP e OLAP?",
    "code": null,
    "options": [
      "OLTP armazena dados JSON; OLAP gerencia apenas esquemas estruturados SQL",
      "OLTP foca em transações rápidas; OLAP executa consultas analíticas complexas",
      "OLAP exige transações ACID; OLTP adota consistência eventual em memória",
      "OLTP roda apenas na nuvem; OLAP opera exclusivamente em servidores locais"
    ],
    "correctIndex": 1,
    "explanation": "OLTP é otimizado para operações transacionais frequentes e de baixa latência; OLAP é otimizado para agregações complexas e consultas analíticas em grandes bases de dados históricas.",
    "compiledJS": null,
    "bestPractice": "Never run OLAP-style analytics queries directly against your production OLTP database — long-running scans hold locks and degrade transaction latency for all users. Route analytics traffic to a read replica, a materialized view, or a separate data warehouse fed via CDC (change data capture) or ETL.",
    "source": "DDIA — Chapter 3: Storage and Retrieval"
  },
  {
    "id": "i08",
    "topic": "Isolation Levels",
    "question": "Qual nível de isolamento de transação impede leituras sujas (dirty reads), mas ainda permite leituras não repetíveis (non-repeatable reads)?",
    "code": null,
    "options": [
      "Read Uncommitted",
      "Read Committed",
      "Repeatable Read",
      "Serializable"
    ],
    "correctIndex": 1,
    "explanation": "O nível Read Committed impede leituras sujas lendo apenas dados já confirmados (committed), mas uma segunda leitura da mesma linha na mesma transação pode encontrar um valor diferente se outra transação fizer commit no intervalo.",
    "compiledJS": "-- Set isolation for the current transaction:\nBEGIN ISOLATION LEVEL READ COMMITTED;\n-- (this is the PostgreSQL default)\n\n-- Anomalies per level:\n-- Read Uncommitted : dirty reads allowed\n-- Read Committed   : dirty reads prevented, non-repeatable reads allowed  ← default\n-- Repeatable Read  : + non-repeatable reads prevented, phantom reads allowed\n-- Serializable     : all anomalies prevented (highest cost)",
    "bestPractice": "Use the default Read Committed for most web application workloads. Bump to Serializable only for financial or inventory operations where phantom reads could cause double-spends or race conditions. Be aware that Serializable increases lock contention and can cause transaction aborts that your retry logic must handle.",
    "source": "PostgreSQL Docs — Transaction Isolation"
  },
  {
    "id": "i09",
    "topic": "Soft vs Hard Delete",
    "question": "Qual é a diferença entre uma exclusão lógica (soft delete) e uma exclusão física (hard delete)?",
    "code": null,
    "options": [
      "Soft delete remove linhas no ato; hard delete define um TTL de expiração",
      "Soft delete marca linhas como inativas; hard delete remove o registro do disco",
      "Soft delete descarta apenas índices; hard delete apaga registros de tabelas",
      "Ambos são nomes sinônimos para a mesma instrução de exclusão em segundo plano"
    ],
    "correctIndex": 1,
    "explanation": "A exclusão lógica (soft delete) define um indicador (como is_deleted ou deleted_at) para ocultar o registro das consultas normais preservando os dados; a exclusão física (hard delete) remove permanentemente o registro da tabela.",
    "compiledJS": "-- Soft delete\nUPDATE users\n  SET deleted_at = NOW()\nWHERE id = 42;\n\n-- Every query must filter:\nSELECT * FROM users WHERE deleted_at IS NULL;\n\n-- Automate with a view:\nCREATE VIEW active_users AS\n  SELECT * FROM users WHERE deleted_at IS NULL;\n\n-- Hard delete\nDELETE FROM users WHERE id = 42;",
    "bestPractice": "For GDPR/CCPA compliance, prefer a hybrid: soft-delete first (replace PII columns with a tombstone value, set deleted_at), then schedule hard deletion after the required retention window. Use a partial index on deleted_at IS NULL to keep normal queries fast without scanning deleted rows.",
    "source": "PostgreSQL Docs — Partial Indexes; GDPR Article 17"
  },
  {
    "id": "i10",
    "topic": "Schema-on-Read vs Write",
    "question": "O que significa 'schema-on-write' em comparação com 'schema-on-read'?",
    "code": null,
    "options": [
      "Schema-on-write valida na inserção; schema-on-read valida na consulta",
      "Schema-on-write é exclusivo de NoSQL; schema-on-read é exclusivo de bancos SQL",
      "Schema-on-read exige tipos estáticos prévios antes de qualquer gravação",
      "Ambos os modelos validam tipos com rigor idêntico no momento de inserção"
    ],
    "correctIndex": 0,
    "explanation": "Schema-on-write (típico de RDBMS tradicionais) valida os dados contra um esquema definido no momento da gravação, enquanto schema-on-read (como em data lakes e MongoDB) interpreta a estrutura no momento da consulta, proporcionando flexibilidade no armazenamento.",
    "compiledJS": null,
    "bestPractice": "Prefer schema-on-write for operational databases — catching schema violations at write time is vastly cheaper than discovering corrupted data weeks later during a reporting query. Use schema-on-read in data lakes and event stores where you don't control the producer's data shape, but validate with tools like Great Expectations or dbt tests before promoting data to reporting models.",
    "source": "DDIA — Chapter 4: Encoding and Evolution"
  },
  {
    "id": "a01",
    "topic": "Sharding",
    "question": "No particionamento baseado em hash (hash-based sharding), qual é a principal vantagem em relação ao particionamento por faixa (range-based sharding)?",
    "code": null,
    "options": [
      "O sharding por hash otimiza consultas por intervalo sequencial de chaves",
      "O sharding por hash distribui dados uniformemente, evitando pontos quentes",
      "O sharding por hash permite adicionar nós sem necessidade de rebalanceamento",
      "O sharding por hash dispensa a definição de uma chave de particionamento"
    ],
    "correctIndex": 1,
    "explanation": "O particionamento baseado em hash aplica uma função hash à chave de partição para distribuir os dados uniformemente, evitando pontos de concentração (hotspots) de escrita comuns ao usar chaves sequenciais com particionamento por faixa.",
    "compiledJS": null,
    "bestPractice": "Hash sharding is the right default for high-write-throughput systems with random key distributions (UUIDs, hashed user IDs). Use range sharding only when your queries are naturally range-based (time-series, geospatial) and you can tolerate hotspot mitigation strategies like pre-splitting or write throttling on hot shards.",
    "source": "DDIA — Chapter 6: Partitioning"
  },
  {
    "id": "a02",
    "topic": "Replication",
    "question": "Qual é o principal trade-off da replicação síncrona em comparação com a replicação assíncrona?",
    "code": null,
    "options": [
      "A replicação síncrona tem menor latência mas perde dados em falhas",
      "A replicação síncrona garante perda zero ao custo de maior latência",
      "A replicação assíncrona assegura consistência estrita com zero perda",
      "A replicação síncrona opera apenas em bancos documentais como MongoDB"
    ],
    "correctIndex": 1,
    "explanation": "A replicação síncrona garante que a réplica confirme a gravação antes de o primário retornar sucesso, garantindo perda zero de dados ao custo de uma latência de escrita mais alta.",
    "compiledJS": "-- PostgreSQL: configure synchronous standby\nALTER SYSTEM SET synchronous_standby_names = 'FIRST 1 (replica1)';\n-- Writes now wait for replica1 to confirm WAL receipt before COMMIT returns.\n\n-- Check current replication lag:\nSELECT\n  client_addr,\n  state,\n  sent_lsn - write_lsn AS write_lag_bytes,\n  sent_lsn - flush_lsn AS flush_lag_bytes\nFROM pg_stat_replication;",
    "bestPractice": "Use synchronous replication for financial data where data loss is unacceptable. For most web applications, configure semi-synchronous replication or use PostgreSQL's synchronous_commit = remote_write (durability without fsync wait on the replica) to balance safety and latency. Always monitor replication lag — a lagging replica is a ticking clock of potential data loss.",
    "source": "DDIA — Chapter 5: Replication"
  },
  {
    "id": "a03",
    "topic": "Event Sourcing",
    "question": "O que distingue o Event Sourcing de um modelo de dados CRUD tradicional?",
    "code": null,
    "options": [
      "Event Sourcing salva o estado atual; CRUD registra todo o log histórico",
      "Event Sourcing grava eventos imutáveis; o estado atual é derivado por replay",
      "Event Sourcing exige bancos SQL; CRUD funciona apenas em bancos NoSQL chave-valor",
      "Event Sourcing atualiza linhas in-place; CRUD anexa versões sequencialmente"
    ],
    "correctIndex": 1,
    "explanation": "No Event Sourcing, o sistema persiste um log append-only imutável de eventos de domínio; o estado atual é reconstituído reproduzindo esses eventos, permitindo auditoria completa e consultas temporais.",
    "compiledJS": "-- Events table (append-only, never updated or deleted)\nCREATE TABLE account_events (\n  id           BIGSERIAL PRIMARY KEY,\n  aggregate_id UUID       NOT NULL,\n  event_type   TEXT       NOT NULL,  -- \"MoneyDeposited\", \"MoneyWithdrawn\"\n  payload      JSONB      NOT NULL,\n  occurred_at  TIMESTAMPTZ DEFAULT NOW()\n);\n\n-- Current balance derived by replaying events:\nSELECT\n  SUM(CASE event_type\n    WHEN 'MoneyDeposited'  THEN (payload->>'amount')::NUMERIC\n    WHEN 'MoneyWithdrawn'  THEN -(payload->>'amount')::NUMERIC\n  END) AS balance\nFROM account_events\nWHERE aggregate_id = '<uuid>';",
    "bestPractice": "Event Sourcing adds significant complexity — replay performance degrades as the event log grows (use snapshots after N events), and debugging eventual-consistency bugs requires tracing event streams. Apply it only to domains where auditability and temporal querying are first-class requirements (finance, healthcare, compliance). Most CRUD applications do not need it.",
    "source": "Martin Fowler — Event Sourcing (martinfowler.com)"
  },
  {
    "id": "a04",
    "topic": "CQRS",
    "question": "Qual problema o padrão CQRS (Command Query Responsibility Segregation) resolve principalmente?",
    "code": null,
    "options": [
      "Elimina a necessidade de índices mantendo cache de documentos em memória",
      "Separa modelos de leitura e escrita para otimizar e escalar cada um à parte",
      "Substitui transações ACID por bloqueios distribuídos de consistência eventual",
      "Aplica normalização estrita em 3NF em todas as tabelas de microsserviços"
    ],
    "correctIndex": 1,
    "explanation": "O CQRS separa o modelo de dados utilizado para escritas (comandos) do modelo utilizado para leituras (consultas), permitindo escalabilidade, caching e otimização independentes para cada lado.",
    "compiledJS": null,
    "bestPractice": "CQRS is most powerful when combined with Event Sourcing — events from the write side rebuild the read-model projections. Without ES, CQRS can be implemented with simple DB triggers or CDC that populate a denormalised read table. Do not apply CQRS to simple CRUD screens — the added infrastructure (separate read store, synchronisation logic, eventual consistency) is pure overhead for most features.",
    "source": "Martin Fowler — CQRS (martinfowler.com)"
  },
  {
    "id": "a05",
    "topic": "Locking",
    "question": "Qual é a diferença fundamental entre bloqueio otimista (optimistic locking) e bloqueio pessimista (pessimistic locking)?",
    "code": null,
    "options": [
      "O bloqueio otimista impede qualquer leitura concorrente; o bloqueio pessimista tolera leituras sujas no banco",
      "O bloqueio otimista valida versões no commit assumindo poucos conflitos; o pessimista adquire travas antes",
      "O bloqueio pessimista é o único padrão em bancos SQL; o bloqueio otimista é restrito a motores NoSQL sem ACID",
      "Ambas as abordagens compartilham o mesmo mecanismo de trava no disco, diferenciando-se apenas na sintaxe SQL"
    ],
    "correctIndex": 1,
    "explanation": "O bloqueio otimista permite o acesso concorrente e verifica conflitos (por exemplo, via coluna de versão) somente no momento do commit, enquanto o bloqueio pessimista retém a trava durante a transação para barrar atualizações concorrentes.",
    "compiledJS": "-- Pessimistic: lock the row immediately\nBEGIN;\nSELECT * FROM inventory WHERE product_id = 5 FOR UPDATE;\n-- ... business logic ...\nUPDATE inventory SET stock = stock - 1 WHERE product_id = 5;\nCOMMIT;\n\n-- Optimistic: version column checked at update time\nUPDATE inventory\n  SET stock = stock - 1, version = version + 1\nWHERE product_id = 5 AND version = 7;\n-- If 0 rows updated → conflict → retry",
    "bestPractice": "Use optimistic locking for web forms where conflicts are rare (user profile edits) and pessimistic locking for inventory or financial operations where two concurrent transactions acting on the same row would both succeed naively (double-booking, overselling). Expose the version column as an ETag in your API so clients can detect conflicts without hitting the DB.",
    "source": "DDIA — Chapter 7: Transactions"
  },
  {
    "id": "a06",
    "topic": "Partitioning",
    "question": "Qual é a diferença entre uma exclusão lógica (soft delete) e uma exclusão física (hard delete)?",
    "code": null,
    "options": [
      "Horizontal divide linhas entre nós; vertical divide colunas em tabelas distintas",
      "Horizontal divide colunas entre tabelas; vertical divide linhas entre vários nós",
      "Particionamento horizontal é para SQL; particionamento vertical é para NoSQL",
      "Ambas as estratégias representam operações físicas idênticas na mesma máquina"
    ],
    "correctIndex": 0,
    "explanation": "A exclusão lógica (soft delete) define um indicador (como is_deleted ou deleted_at) para ocultar o registro das consultas normais preservando os dados; a exclusão física (hard delete) remove permanentemente o registro da tabela.",
    "compiledJS": "-- PostgreSQL declarative horizontal partitioning by month:\nCREATE TABLE events (\n  id         BIGINT,\n  created_at TIMESTAMPTZ NOT NULL,\n  payload    JSONB\n) PARTITION BY RANGE (created_at);\n\nCREATE TABLE events_2024_01 PARTITION OF events\n  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');\n\nCREATE TABLE events_2024_02 PARTITION OF events\n  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');",
    "bestPractice": "Use PostgreSQL declarative table partitioning for time-series data with a clear partition key — partition pruning eliminates entire months from scans. Pair with pg_partman for automated partition creation and old-partition dropping. For vertical partitioning, split wide tables when profiling shows that hot queries are needlessly reading large columns (BYTEA, TEXT, JSONB) they do not use.",
    "source": "PostgreSQL Docs — Table Partitioning; DDIA Chapter 6"
  },
  {
    "id": "a07",
    "topic": "Two-Phase Commit",
    "question": "Qual problema o protocolo Two-Phase Commit (2PC) resolve em bancos de dados distribuídos?",
    "code": null,
    "options": [
      "Acelera consultas de leitura distribuídas entre nós fragmentados do cluster",
      "Garante confirmação atômica para que todos os nós confirmem ou abortem juntos",
      "Replica logs de transação WAL da instância primária para réplicas de leitura",
      "Compacta logs de transação para economizar consumo de espaço em disco nos nós"
    ],
    "correctIndex": 1,
    "explanation": "O protocolo Two-Phase Commit assegura atomicidade em transações distribuídas: na primeira fase um coordenador solicita a preparação de todos os participantes; na segunda fase ele instrui o commit ou abort com base na resposta unânime.",
    "compiledJS": null,
    "bestPractice": "Avoid 2PC across microservices — it introduces tight coupling, blocking failures, and is unsupported by most cloud databases. Use the Saga pattern instead: decompose the transaction into a sequence of local transactions with compensating actions for rollback. Reserve 2PC for cases where both databases are under your control and support the protocol natively (PostgreSQL PREPARE TRANSACTION).",
    "source": "DDIA — Chapter 9: Consistency and Consensus"
  },
  {
    "id": "a08",
    "topic": "Time-Series Design",
    "question": "Qual técnica de modelagem de dados é mais adequada para dados de séries temporais com alta taxa de escrita e consultas por faixa de tempo?",
    "code": null,
    "options": [
      "Armazenar todos os eventos em uma única linha JSON desnormalizada por entidade",
      "Usar tabelas append-only particionadas por tempo com timestamps na chave primária",
      "Projetar tabelas de junção Many-to-Many com referências de chave estrangeira",
      "Aplicar normalização 3NF estrita para eliminar atributos temporais redundantes"
    ],
    "correctIndex": 1,
    "explanation": "Dados de séries temporais se beneficiam de escritas append-only e particionamento por faixa de tempo: incluir o timestamp na chave primária possibilita varreduras eficientes por faixa, e o particionamento mantém as partições ativas compactas.",
    "compiledJS": "-- Append-only, time-range partitioned metrics table\nCREATE TABLE metrics (\n  metric_name TEXT        NOT NULL,\n  recorded_at TIMESTAMPTZ NOT NULL,\n  value       DOUBLE PRECISION NOT NULL,\n  PRIMARY KEY (metric_name, recorded_at)  -- clustered by time per metric\n) PARTITION BY RANGE (recorded_at);\n\n-- Query: last 24 hours (partition pruning eliminates all other partitions)\nSELECT AVG(value)\nFROM metrics\nWHERE metric_name = 'cpu_usage'\n  AND recorded_at >= NOW() - INTERVAL '24 hours';",
    "bestPractice": "For production time-series at scale, evaluate TimescaleDB (PostgreSQL extension) or ClickHouse before building your own partitioning scheme. TimescaleDB automates hypertable creation, chunk management, and compression. ClickHouse provides columnar storage that achieves 10–100x better compression and query speed for analytical time-series workloads.",
    "source": "TimescaleDB Docs — Time-Series Best Practices"
  },
  {
    "id": "a09",
    "topic": "Multi-Tenancy",
    "question": "Em uma aplicação SaaS multi-tenant, qual é a principal vantagem da estratégia de isolamento 'banco de dados por cliente' (database-per-tenant) em relação a um esquema compartilhado?",
    "code": null,
    "options": [
      "Consome menos espaço em disco e memória compartilhada que um esquema compartilhado",
      "Oferece isolamento forte de dados, backups simples e evita vizinhos barulhentos",
      "Dispensa a execução de migrações de esquema ao cadastrar novos clientes no SaaS",
      "É o único modelo multi-inquilino capaz de oferecer suporte a transações ACID"
    ],
    "correctIndex": 1,
    "explanation": "A estratégia de banco por cliente oferece a cada cliente um banco isolado, assegurando que não haja vazamento de dados entre clientes, simplificando backups independentes e impedindo que consultas pesadas de um usuário afetem os demais.",
    "compiledJS": null,
    "bestPractice": "For early-stage SaaS, start with shared schema + row-level security (PostgreSQL RLS) — it is operationally simpler and scales well to thousands of small tenants. Offer database-per-tenant as a premium isolation tier for enterprise customers with compliance requirements (HIPAA, SOC 2). Use a connection pooler (PgBouncer, RDS Proxy) to avoid connection exhaustion when managing many tenant databases.",
    "source": "Citus Data — Multi-Tenant Architecture Patterns"
  },
  {
    "id": "a10",
    "topic": "Saga Pattern",
    "question": "De que maneira o padrão Saga trata a consistência de transações distribuídas sem a necessidade de usar 2PC?",
    "code": null,
    "options": [
      "Bloqueia tabelas de todos os serviços via transações XA até que um coordenador central confirme o commit final",
      "Divide a transação em transações locais, onde eventos coordenam passos e falhas disparam compensações retroativas",
      "Grava todas as operações pendentes em um banco compartilhado que centraliza bloqueios de linha entre serviços",
      "Enfileira mutações em memória temporária aguardando que um worker execute uma única transação ACID unificada"
    ],
    "correctIndex": 1,
    "explanation": "O padrão Saga encadeia transações locais entre serviços via eventos ou orquestração; se uma etapa falha, transações compensatórias revertem as etapas concluídas anteriormente, garantindo consistência eventual sem necessidade de bloqueios distribuídos.",
    "compiledJS": null,
    "bestPractice": "Use orchestration-based Sagas (a central workflow engine like Temporal or AWS Step Functions) over choreography for complex business flows — the explicit workflow definition makes debugging, monitoring, and adding new steps far easier than tracing event chains across services. Always design compensating transactions before implementing forward steps: if you cannot undo a step, you cannot safely include it in a Saga.",
    "source": "Chris Richardson — Microservices Patterns, Chapter 4"
  }
]
