import type { InterviewQuestion } from '@/lib/interviewTypes'

export const DATABASE_DESIGN_QUESTIONS: InterviewQuestion[] = [
  // ── Beginner ───────────────────────────────────────────────────────────────
  {
    id: 'b01',
    topic: 'Primary Key',
    question: 'What is the primary purpose of a primary key in a relational database?',
    code: null,
    options: [
      'To sort rows alphabetically',
      'To uniquely identify each row in a table',
      'To link two tables together',
      'To enforce NOT NULL on all columns',
    ],
    correctIndex: 1,
    explanation:
      'A primary key uniquely identifies every row in a table — no two rows can share the same key value and the column(s) cannot be NULL. The database engine automatically creates a unique index on the primary key, making lookups by that key extremely fast. In InnoDB (MySQL) the table is physically ordered by the primary key (clustered index), which is why choosing a narrow, monotonically increasing key like a BIGINT matters for write performance.',
    compiledJS:
      '-- DDL with primary key\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n  email TEXT NOT NULL UNIQUE\n);\n\n-- The engine implicitly creates:\n-- UNIQUE INDEX users_pkey ON users(id)',
    bestPractice:
      'Prefer a surrogate integer or UUID as the primary key over a natural key (email, username) — natural keys change and FK relationships break with them. In PostgreSQL use BIGINT GENERATED ALWAYS AS IDENTITY; in MySQL use BIGINT AUTO_INCREMENT. Avoid composite primary keys on large tables unless the relationship table genuinely has no other identity.',
    source: 'PostgreSQL Docs — Constraints: Primary Keys',
  },
  {
    id: 'b02',
    topic: 'Foreign Key',
    question: 'What does a foreign key do in a relational database?',
    code: null,
    options: [
      'Encrypts column values for security',
      'References the primary key of another table to enforce referential integrity',
      'Speeds up SELECT queries on large tables',
      'Prevents duplicate rows within a single table',
    ],
    correctIndex: 1,
    explanation:
      'A foreign key is a column (or group of columns) in one table that references the primary key of another table. The database engine enforces referential integrity — it will reject an INSERT or UPDATE that would create a dangling reference, and it will enforce the ON DELETE / ON UPDATE action (CASCADE, SET NULL, RESTRICT) when the parent row changes. Without foreign keys, orphan rows accumulate silently and data integrity has to be enforced at the application layer, which is error-prone.',
    compiledJS:
      'CREATE TABLE orders (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT NOT NULL\n    REFERENCES users(id)\n    ON DELETE CASCADE\n    ON UPDATE CASCADE\n);\n\n-- Attempting to insert an order for a non-existent user:\n-- INSERT INTO orders(id, user_id) VALUES (1, 9999);\n-- ERROR: insert or update on table "orders" violates\n-- foreign key constraint "orders_user_id_fkey"',
    bestPractice:
      'Always add an index on foreign key columns — the database enforces the constraint via a lookup on the parent table, and without an index every FK check is a sequential scan. In PostgreSQL this index is NOT created automatically (unlike MySQL InnoDB). Use ON DELETE RESTRICT or ON DELETE CASCADE consciously; leaving it as the default (RESTRICT) is safer for audit-sensitive data.',
    source: 'PostgreSQL Docs — Referential Integrity',
  },
  {
    id: 'b03',
    topic: 'NoSQL',
    question: 'Which of the following best describes a NoSQL database?',
    code: null,
    options: [
      'A database that never uses indexes',
      'A database that only stores numbers',
      'A non-relational database that stores data in formats like documents, key-value pairs, or graphs',
      'A database that forbids SQL syntax entirely',
    ],
    correctIndex: 2,
    explanation:
      'NoSQL ("Not Only SQL") databases are non-relational stores that trade the rigid table-and-schema model of RDBMS for flexible data models: document stores (MongoDB, Firestore), key-value stores (Redis, DynamoDB), wide-column stores (Cassandra, HBase), and graph databases (Neo4j). They often sacrifice ACID guarantees and relational joins in exchange for horizontal scalability, schema flexibility, and optimised access patterns for specific data shapes.',
    compiledJS: null,
    bestPractice:
      'Choose NoSQL when your access pattern is known, simple, and unlikely to require ad-hoc joins — e.g. a user session store (key-value), a product catalog with varying attributes (document), or a social graph (graph DB). Do not reach for NoSQL to avoid schema design — a poorly thought-out document schema becomes just as painful as a badly normalised relational one.',
    source: 'Martin Fowler — NoSQL Distilled (overview)',
  },
  {
    id: 'b04',
    topic: 'CRUD',
    question: 'What does CRUD stand for in the context of database operations?',
    code: null,
    options: [
      'Copy, Replace, Update, Delete',
      'Create, Read, Update, Delete',
      'Connect, Retrieve, Upload, Drop',
      'Create, Restore, Undo, Deploy',
    ],
    correctIndex: 1,
    explanation:
      'CRUD — Create, Read, Update, Delete — maps to the four fundamental operations on persistent data. In SQL they map to INSERT, SELECT, UPDATE, and DELETE respectively. Every REST API and most UI interactions can be reduced to one of these four operations. Understanding CRUD is the foundation for reasoning about data flow, access control, and audit logging in any system.',
    compiledJS:
      '-- Create\nINSERT INTO users (email) VALUES (\'alice@example.com\');\n\n-- Read\nSELECT * FROM users WHERE id = 1;\n\n-- Update\nUPDATE users SET email = \'new@example.com\' WHERE id = 1;\n\n-- Delete\nDELETE FROM users WHERE id = 1;',
    bestPractice:
      'In production systems, prefer soft deletes (marking a row as deleted with a timestamp) over hard deletes for any entity with audit or compliance requirements. This preserves history without physically removing data, and allows tombstone-based CDC (change data capture) streams to propagate the deletion to downstream consumers.',
    source: 'PostgreSQL Docs — Data Manipulation',
  },
  {
    id: 'b05',
    topic: 'NULL Semantics',
    question: 'What value does a NULL represent in SQL?',
    code: null,
    options: [
      'Zero',
      'An empty string',
      'The absence of a value or unknown',
      'False',
    ],
    correctIndex: 2,
    explanation:
      "NULL in SQL represents the absence of a value or an unknown — it is not zero, not an empty string, and not false. This has important consequences: NULL compared with anything (even NULL) returns UNKNOWN, not TRUE or FALSE, which is why `WHERE col = NULL` never matches rows; you must use `IS NULL`. Aggregate functions like COUNT, SUM, and AVG silently ignore NULL values, which can produce surprising results if you are not aware of it.",
    compiledJS:
      "-- This returns NO rows:\nSELECT * FROM users WHERE deleted_at = NULL;\n\n-- Correct:\nSELECT * FROM users WHERE deleted_at IS NULL;\n\n-- NULL propagates through expressions:\nSELECT NULL + 1;   -- result: NULL\nSELECT NULL = NULL; -- result: NULL (not TRUE)",
    bestPractice:
      'Avoid nullable columns where possible — add NOT NULL constraints at the DB level and use sentinel values (empty string, epoch timestamp, 0) only when they carry genuine semantic meaning. When NULLs are unavoidable, use COALESCE() in queries to supply defaults and document the nullability intent in column comments.',
    source: 'SQL Standard — Three-Valued Logic',
  },
  {
    id: 'b06',
    topic: 'Relationships',
    question: 'Which relationship type exists when one row in Table A can relate to many rows in Table B, and one row in Table B can also relate to many rows in Table A?',
    code: null,
    options: [
      'One-to-One (1:1)',
      'One-to-Many (1:N)',
      'Many-to-Many (M:N)',
      'Self-referential',
    ],
    correctIndex: 2,
    explanation:
      'A Many-to-Many (M:N) relationship means each row on either side can be associated with multiple rows on the other side. Because a relational table cannot store a list of foreign keys in a single column, M:N relationships are resolved by introducing a junction (or associative) table that holds a pair of foreign keys — one referencing each parent table. For example, students and courses have an M:N relationship resolved by an enrolments table.',
    compiledJS:
      '-- Junction table resolving M:N between students and courses\nCREATE TABLE enrolments (\n  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,\n  course_id  BIGINT REFERENCES courses(id)  ON DELETE CASCADE,\n  enrolled_at TIMESTAMPTZ DEFAULT NOW(),\n  PRIMARY KEY (student_id, course_id)\n);',
    bestPractice:
      'Add extra columns to the junction table to store relationship metadata (enrolled_at, role, status) — this often turns out to be necessary as requirements grow. Use a composite PK on the two FK columns unless you need to reference the junction row from a third table, in which case add a surrogate PK.',
    source: 'Database Design for Mere Mortals — Chapter 11',
  },
  {
    id: 'b07',
    topic: 'Normalization',
    question: 'What is database normalization?',
    code: null,
    options: [
      'Converting all column names to lowercase',
      'Organizing data to reduce redundancy and improve integrity',
      'Merging all tables into a single flat table for performance',
      'Backing up data to a secondary server',
    ],
    correctIndex: 1,
    explanation:
      'Normalization is the systematic process of structuring a relational schema to reduce data redundancy and eliminate update, insertion, and deletion anomalies. It is defined through a series of normal forms (1NF, 2NF, 3NF, BCNF…), each imposing progressively stricter rules about functional dependencies between columns. A fully normalised schema stores each fact exactly once, so a change to that fact requires updating exactly one row — no risk of inconsistency.',
    compiledJS: null,
    bestPractice:
      'Normalise to at least 3NF as the default starting point, then consciously denormalize only where profiling shows a specific read bottleneck. Do not skip normalisation in favour of "just adding more columns to avoid joins" — the inconsistency bugs that arise from duplicated data are among the hardest to diagnose in production.',
    source: 'C. J. Date — An Introduction to Database Systems',
  },
  {
    id: 'b08',
    topic: 'ACID — Atomicity',
    question: 'Which property of ACID transactions ensures that a transaction either fully completes or has no effect at all?',
    code: null,
    options: [
      'Consistency',
      'Isolation',
      'Atomicity',
      'Durability',
    ],
    correctIndex: 2,
    explanation:
      'Atomicity guarantees that all operations within a transaction are treated as a single indivisible unit — they either all succeed (COMMIT) or all fail and are rolled back (ROLLBACK). If a server crash occurs mid-transaction, the database engine replays the write-ahead log (WAL) on restart and rolls back any uncommitted transactions. Without atomicity, a transfer between two bank accounts could debit one account without crediting the other.',
    compiledJS:
      '-- Both INSERTs succeed or neither does\nBEGIN;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n\n-- If the process crashes after the first UPDATE:\n-- On restart, PostgreSQL replays the WAL and rolls\n-- back the incomplete transaction automatically.',
    bestPractice:
      'Wrap logically related mutations in a single transaction — never rely on application-level retries to compensate for partial writes. In ORMs, be explicit about transaction boundaries rather than using auto-commit mode; it is far too easy to leave a connection in an uncommitted state under ORM defaults.',
    source: 'PostgreSQL Docs — Transactions',
  },
  {
    id: 'b09',
    topic: 'SQL vs NoSQL',
    question: 'What is the main difference between the SQL and NoSQL query models?',
    code: null,
    options: [
      'SQL uses JSON while NoSQL uses XML',
      'SQL uses structured query language on fixed schemas; NoSQL databases use flexible, often API-based query patterns',
      'SQL can only run on Windows servers',
      'NoSQL databases never support indexing',
    ],
    correctIndex: 1,
    explanation:
      'SQL (Structured Query Language) is a declarative language designed for querying data organised into fixed, predefined schemas with tables, columns, and typed rows. NoSQL systems trade the fixed schema for a flexible data model and provide their own query mechanisms — DynamoDB uses a key-value API with filter expressions, MongoDB uses document query predicates, Cassandra uses a limited CQL that optimises for partition-key access. Most NoSQL stores do support indexing, but the index types and query capabilities differ significantly from SQL.',
    compiledJS: null,
    bestPractice:
      'SQL is the right default for most applications because its flexibility for ad-hoc querying and strong consistency are invaluable as requirements change. Adopt NoSQL only when you have identified a specific access pattern that a relational model cannot serve well at your scale — premature adoption of NoSQL to appear modern is a common engineering mistake.',
    source: 'DDIA — Chapter 2: Data Models and Query Languages',
  },
  {
    id: 'b10',
    topic: 'Migrations',
    question: 'What is the purpose of a database migration?',
    code: null,
    options: [
      'Moving the database server to a different data center',
      'Exporting data to a CSV file',
      'Applying versioned, incremental changes to a database schema over time',
      'Switching from SQL to NoSQL',
    ],
    correctIndex: 2,
    explanation:
      'Database migrations are versioned scripts (SQL or DSL) that describe incremental schema changes — adding a column, dropping a table, creating an index — and can be applied forward (up) or reversed (down). Migration tools like Flyway, Liquibase, and Prisma Migrate track which migrations have already been applied in a schema history table, so the schema can evolve in step with the application code across environments (dev → staging → production) in a controlled, repeatable way.',
    compiledJS:
      '-- Example Flyway migration: V3__add_deleted_at_to_users.sql\nALTER TABLE users\n  ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;\n\nCREATE INDEX CONCURRENTLY idx_users_deleted_at\n  ON users(deleted_at)\n  WHERE deleted_at IS NOT NULL;',
    bestPractice:
      'Never modify a migration file that has already been applied to any environment — treat migrations as immutable history. For zero-downtime deployments follow the expand-contract pattern: first add the new column as nullable (expand), deploy the new code, then backfill and add constraints (contract) in a subsequent migration.',
    source: 'Flyway Docs — Versioned Migrations',
  },

  // ── Intermediate ───────────────────────────────────────────────────────────
  {
    id: 'i01',
    topic: '2NF',
    question: 'Which normal form requires that every non-key attribute is fully functionally dependent on the entire primary key, eliminating partial dependencies?',
    code: null,
    options: [
      'First Normal Form (1NF)',
      'Second Normal Form (2NF)',
      'Third Normal Form (3NF)',
      'Boyce-Codd Normal Form (BCNF)',
    ],
    correctIndex: 1,
    explanation:
      '2NF applies only to tables with a composite primary key. A partial dependency exists when a non-key column depends on only part of the composite key rather than the whole key. To eliminate it, you split the table: move the partially-dependent column and the part of the key it depends on into a new table. For example, if (order_id, product_id) is the composite PK but product_name depends only on product_id, product_name violates 2NF and belongs in a separate products table.',
    compiledJS:
      '-- Violates 2NF: product_name depends only on product_id, not (order_id, product_id)\nCREATE TABLE order_items_bad (\n  order_id    BIGINT,\n  product_id  BIGINT,\n  product_name TEXT,   -- partial dependency!\n  quantity    INT,\n  PRIMARY KEY (order_id, product_id)\n);\n\n-- 2NF-compliant split:\nCREATE TABLE products (\n  id   BIGINT PRIMARY KEY,\n  name TEXT NOT NULL\n);\nCREATE TABLE order_items (\n  order_id   BIGINT,\n  product_id BIGINT REFERENCES products(id),\n  quantity   INT,\n  PRIMARY KEY (order_id, product_id)\n);',
    bestPractice:
      'Surrogate primary keys (single-column auto-increment or UUID) automatically satisfy 2NF because partial dependencies cannot exist without a composite key. This is one of several reasons senior engineers prefer surrogate keys.',
    source: 'C. J. Date — An Introduction to Database Systems, Chapter 11',
  },
  {
    id: 'i02',
    topic: '1NF',
    question: 'What does First Normal Form (1NF) require?',
    code: null,
    options: [
      'No transitive dependencies between non-key columns',
      'All columns contain atomic (indivisible) values and each column holds values of a single type',
      'All foreign keys reference existing rows',
      'The table has a composite primary key',
    ],
    correctIndex: 1,
    explanation:
      '1NF is the foundational normal form. It requires: (1) each column holds only atomic values — no lists, arrays, or nested records; (2) each column holds values of a single, consistent type; (3) there are no repeating groups of columns (phone_1, phone_2, phone_3). Violating 1NF forces application-side string splitting or column counting, which breaks indexing, querying, and integrity. Storing comma-separated IDs in a VARCHAR column is the classic 1NF violation.',
    compiledJS:
      '-- Violates 1NF: tags is a comma-separated list\nCREATE TABLE posts_bad (\n  id   BIGINT PRIMARY KEY,\n  tags TEXT   -- e.g. "typescript,nodejs,backend"\n);\n\n-- 1NF-compliant: move repeating group to its own table\nCREATE TABLE post_tags (\n  post_id BIGINT REFERENCES posts(id),\n  tag     TEXT NOT NULL,\n  PRIMARY KEY (post_id, tag)\n);',
    bestPractice:
      'PostgreSQL ARRAY and JSONB columns technically store non-atomic values and can violate 1NF in spirit. Use them only when the data is genuinely schemaless or when you have benchmarked that the flexibility outweighs the query complexity. For structured repeating groups, always normalise into a child table.',
    source: 'E. F. Codd — A Relational Model of Data for Large Shared Data Banks (1970)',
  },
  {
    id: 'i03',
    topic: 'Denormalization',
    question: 'Which of the following is a valid reason to intentionally denormalize a database?',
    code: null,
    options: [
      'To satisfy foreign key constraints',
      'To improve read query performance by reducing the number of joins',
      'To enforce stricter data integrity',
      'To ensure every table is in 3NF',
    ],
    correctIndex: 1,
    explanation:
      'Denormalization deliberately introduces controlled redundancy to avoid expensive join operations on hot read paths. Common techniques include caching an aggregate (e.g. storing comment_count on a posts row), duplicating a frequently-read column (e.g. user_name on the orders table), or materializing a view. The trade-off is that every write must now update the redundant copy, introducing the risk of inconsistency if the update path is not atomic.',
    compiledJS:
      '-- Denormalized: posts stores comment_count to avoid COUNT(*) JOIN on every read\nCREATE TABLE posts (\n  id            BIGINT PRIMARY KEY,\n  title         TEXT NOT NULL,\n  comment_count INT  NOT NULL DEFAULT 0  -- redundant, kept in sync by trigger\n);\n\n-- Trigger that keeps comment_count accurate:\nCREATE FUNCTION inc_comment_count() RETURNS TRIGGER LANGUAGE plpgsql AS $$\nBEGIN\n  UPDATE posts SET comment_count = comment_count + 1\n  WHERE id = NEW.post_id;\n  RETURN NEW;\nEND $$;\n\nCREATE TRIGGER after_comment_insert\n  AFTER INSERT ON comments\n  FOR EACH ROW EXECUTE FUNCTION inc_comment_count();',
    bestPractice:
      'Always measure before denormalizing — most join overhead is eliminated by proper indexing and does not require redundancy. When you do denormalize, enforce consistency with a database trigger or an application-level transactional update, and document the invariant clearly so future engineers do not break it.',
    source: 'DDIA — Chapter 3: Storage and Retrieval',
  },
  {
    id: 'i04',
    topic: 'Surrogate Keys',
    question: 'What is a surrogate key?',
    code: null,
    options: [
      'A key derived from business data such as an email address',
      'A system-generated key (e.g., auto-increment integer or UUID) with no business meaning',
      'A key that spans multiple columns',
      'A foreign key that references itself',
    ],
    correctIndex: 1,
    explanation:
      "A surrogate key is an artificial identifier generated by the system — typically a BIGINT auto-increment or a UUID — with no inherent business meaning. It is contrasted with a natural key, which is derived from the data itself (SSN, email, ISBN). Surrogate keys never change even if the business data changes (e.g. a user changes their email), making foreign key relationships stable. They are also typically smaller and faster to index than composite or natural keys.",
    compiledJS:
      '-- Surrogate key (BIGINT IDENTITY)\nCREATE TABLE customers (\n  id    BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n  email TEXT NOT NULL UNIQUE  -- natural key demoted to a UNIQUE constraint\n);\n\n-- vs Natural key (fragile: email can change, breaking all FK references)\nCREATE TABLE customers_bad (\n  email TEXT PRIMARY KEY,\n  name  TEXT\n);',
    bestPractice:
      'Use BIGINT surrogate keys as the default. Choose UUID (v7 for sequential inserts) only when you need globally unique identifiers across distributed systems or when you need to generate IDs client-side before inserting. Expose natural keys as UNIQUE constraints rather than PKs so they can be validated and changed without cascading FK updates.',
    source: 'Database Design for Mere Mortals — Chapter 9',
  },
  {
    id: 'i05',
    topic: 'ER Diagrams',
    question: 'In an ER diagram, what does a double-line (total participation) on an entity side of a relationship indicate?',
    code: null,
    options: [
      'The entity has a composite primary key',
      'Every instance of that entity must participate in the relationship',
      'The relationship is Many-to-Many',
      'The entity is a weak entity',
    ],
    correctIndex: 1,
    explanation:
      'In Chen-notation ER diagrams, a single line between an entity and a relationship diamond indicates partial participation (some instances may not participate), while a double line indicates total participation (every instance must participate). For example, if every employee must be assigned to a department, the Employee entity has a double line to the "Works-In" relationship. This maps to a NOT NULL foreign key constraint in the physical schema.',
    compiledJS:
      '-- Total participation of Employee in "Works-In" maps to NOT NULL FK:\nCREATE TABLE employees (\n  id          BIGINT PRIMARY KEY,\n  name        TEXT   NOT NULL,\n  department_id BIGINT NOT NULL  -- NOT NULL enforces total participation\n    REFERENCES departments(id)\n);\n\n-- Partial participation (nullable FK):\nCREATE TABLE employees_optional (\n  id          BIGINT PRIMARY KEY,\n  name        TEXT NOT NULL,\n  department_id BIGINT  -- nullable = partial participation\n    REFERENCES departments(id)\n);',
    bestPractice:
      'Translate total participation directly to NOT NULL foreign key constraints at the DDL level — do not rely on application code to enforce it. Database constraints catch bugs in every code path (migrations, scripts, ORM bypasses) whereas application-level checks only guard the happy path.',
    source: 'Ramez Elmasri — Fundamentals of Database Systems, Chapter 7',
  },
  {
    id: 'i06',
    topic: 'CAP Theorem',
    question: 'According to the CAP theorem, a distributed database can guarantee at most how many of the three properties simultaneously?',
    code: null,
    options: [
      'All three: Consistency, Availability, and Partition Tolerance',
      'Only one',
      'Any two',
      'None — they are always in conflict',
    ],
    correctIndex: 2,
    explanation:
      'The CAP theorem (Brewer, 2000) states that a distributed system can satisfy at most two of: Consistency (every read receives the most recent write), Availability (every request receives a non-error response), and Partition Tolerance (the system continues to operate despite network partitions). Because network partitions are unavoidable in practice, real systems choose between CP (consistent but may reject requests during partitions — e.g. HBase, Zookeeper) and AP (available but may return stale data — e.g. Cassandra, CouchDB).',
    compiledJS: null,
    bestPractice:
      'CAP is a useful mental model but is often oversimplified. In practice, use the PACELC model which also accounts for latency trade-offs in the absence of partitions. Most teams should default to a CP store (PostgreSQL, Spanner) unless they have specific requirements for geographic distribution or always-on availability that justify AP trade-offs.',
    source: 'Eric Brewer — Towards Robust Distributed Systems (2000)',
  },
  {
    id: 'i07',
    topic: 'OLTP vs OLAP',
    question: 'What is the key distinction between OLTP and OLAP workloads?',
    code: null,
    options: [
      'OLTP stores only structured data; OLAP stores only unstructured data',
      'OLTP handles many short transactional read/write operations; OLAP handles complex analytical queries over large historical datasets',
      'OLAP requires ACID transactions; OLTP does not',
      'OLTP is cloud-only; OLAP is on-premises only',
    ],
    correctIndex: 1,
    explanation:
      'OLTP (Online Transaction Processing) optimizes for high-frequency, low-latency, small read/write operations — e.g. "insert an order" or "fetch a user profile". It typically uses row-oriented storage so that individual rows can be read or written efficiently. OLAP (Online Analytical Processing) optimizes for complex aggregations over large historical datasets — e.g. "sum revenue by region for the last 12 months". It uses columnar storage (Redshift, BigQuery, ClickHouse) so that only the needed columns are scanned.',
    compiledJS: null,
    bestPractice:
      'Never run OLAP-style analytics queries directly against your production OLTP database — long-running scans hold locks and degrade transaction latency for all users. Route analytics traffic to a read replica, a materialized view, or a separate data warehouse fed via CDC (change data capture) or ETL.',
    source: 'DDIA — Chapter 3: Storage and Retrieval',
  },
  {
    id: 'i08',
    topic: 'Isolation Levels',
    question: 'Which transaction isolation level prevents dirty reads but still allows non-repeatable reads?',
    code: null,
    options: [
      'Read Uncommitted',
      'Read Committed',
      'Repeatable Read',
      'Serializable',
    ],
    correctIndex: 1,
    explanation:
      'Read Committed prevents dirty reads by only reading rows that have been committed, but it allows non-repeatable reads — if you read the same row twice within a transaction, a concurrent COMMIT between those two reads can cause the second read to return a different value. Read Uncommitted allows dirty reads. Repeatable Read prevents non-repeatable reads but allows phantom reads (new rows inserted by other transactions may appear). Serializable prevents all three anomalies by serializing concurrent transactions.',
    compiledJS:
      '-- Set isolation for the current transaction:\nBEGIN ISOLATION LEVEL READ COMMITTED;\n-- (this is the PostgreSQL default)\n\n-- Anomalies per level:\n-- Read Uncommitted : dirty reads allowed\n-- Read Committed   : dirty reads prevented, non-repeatable reads allowed  ← default\n-- Repeatable Read  : + non-repeatable reads prevented, phantom reads allowed\n-- Serializable     : all anomalies prevented (highest cost)',
    bestPractice:
      'Use the default Read Committed for most web application workloads. Bump to Serializable only for financial or inventory operations where phantom reads could cause double-spends or race conditions. Be aware that Serializable increases lock contention and can cause transaction aborts that your retry logic must handle.',
    source: 'PostgreSQL Docs — Transaction Isolation',
  },
  {
    id: 'i09',
    topic: 'Soft vs Hard Delete',
    question: 'What is the difference between a soft delete and a hard delete?',
    code: null,
    options: [
      'Soft delete removes the row immediately; hard delete marks it with a timestamp',
      'Soft delete marks a row as deleted (e.g., with an is_deleted flag) without removing it; hard delete permanently removes the row',
      'Soft delete applies only to indexes; hard delete applies to table rows',
      'They are two names for the same SQL DELETE operation',
    ],
    correctIndex: 1,
    explanation:
      'A soft delete sets a flag (is_deleted, deleted_at) to hide the row from normal queries while keeping the data in the table. A hard delete runs DELETE and permanently removes the row. Soft deletes are favoured for audit trails, GDPR right-of-erasure workflows (replace PII with a tombstone), and CDC streams where downstream consumers need to react to deletions. The downside is that every query must include a WHERE deleted_at IS NULL filter, and forgotten queries silently return deleted records.',
    compiledJS:
      '-- Soft delete\nUPDATE users\n  SET deleted_at = NOW()\nWHERE id = 42;\n\n-- Every query must filter:\nSELECT * FROM users WHERE deleted_at IS NULL;\n\n-- Automate with a view:\nCREATE VIEW active_users AS\n  SELECT * FROM users WHERE deleted_at IS NULL;\n\n-- Hard delete\nDELETE FROM users WHERE id = 42;',
    bestPractice:
      'For GDPR/CCPA compliance, prefer a hybrid: soft-delete first (replace PII columns with a tombstone value, set deleted_at), then schedule hard deletion after the required retention window. Use a partial index on deleted_at IS NULL to keep normal queries fast without scanning deleted rows.',
    source: 'PostgreSQL Docs — Partial Indexes; GDPR Article 17',
  },
  {
    id: 'i10',
    topic: 'Schema-on-Read vs Write',
    question: "What does 'schema-on-write' mean compared to 'schema-on-read'?",
    code: null,
    options: [
      'Schema-on-write applies the schema when data is written; schema-on-read applies it when data is queried',
      'Schema-on-write is used only by NoSQL databases',
      'Schema-on-read requires strict column definitions before inserting data',
      'They are equivalent — both enforce the schema at insertion time',
    ],
    correctIndex: 0,
    explanation:
      "Schema-on-write (the RDBMS approach) validates each row against a predefined schema at INSERT/UPDATE time — a wrong type or a missing NOT NULL column causes an immediate error. Schema-on-read (data lakes, MongoDB, Parquet files) allows any shape of data to be stored and interprets the schema only when the data is queried. Schema-on-read is more flexible for evolving data but pushes schema errors downstream to query time, often making them harder to diagnose.",
    compiledJS: null,
    bestPractice:
      "Prefer schema-on-write for operational databases — catching schema violations at write time is vastly cheaper than discovering corrupted data weeks later during a reporting query. Use schema-on-read in data lakes and event stores where you don't control the producer's data shape, but validate with tools like Great Expectations or dbt tests before promoting data to reporting models.",
    source: 'DDIA — Chapter 4: Encoding and Evolution',
  },

  // ── Advanced ───────────────────────────────────────────────────────────────
  {
    id: 'a01',
    topic: 'Sharding',
    question: 'In hash-based sharding, what is the main advantage over range-based sharding?',
    code: null,
    options: [
      'Hash sharding makes range queries faster',
      'Hash sharding distributes data more evenly across shards, reducing hotspots',
      'Hash sharding allows unlimited shards without rebalancing',
      'Hash sharding requires no shard key',
    ],
    correctIndex: 1,
    explanation:
      'Hash-based sharding applies a deterministic hash function (e.g. CRC32 mod n_shards) to the shard key to distribute rows uniformly across shards. Range-based sharding routes rows by value ranges (e.g. user IDs 1–1M → shard 1, 1M–2M → shard 2), which is susceptible to hotspots when inserts are sequential (all new rows land on the last shard) or when a range becomes disproportionately popular. Hash sharding sacrifices the ability to do efficient range scans across shards.',
    compiledJS: null,
    bestPractice:
      'Hash sharding is the right default for high-write-throughput systems with random key distributions (UUIDs, hashed user IDs). Use range sharding only when your queries are naturally range-based (time-series, geospatial) and you can tolerate hotspot mitigation strategies like pre-splitting or write throttling on hot shards.',
    source: 'DDIA — Chapter 6: Partitioning',
  },
  {
    id: 'a02',
    topic: 'Replication',
    question: 'What is the main trade-off of synchronous replication compared to asynchronous replication?',
    code: null,
    options: [
      'Synchronous replication is faster but loses data on failure',
      'Synchronous replication guarantees no data loss but increases write latency because the primary waits for replica acknowledgment',
      'Asynchronous replication guarantees zero data loss',
      'Synchronous replication only works with document databases',
    ],
    correctIndex: 1,
    explanation:
      'In synchronous replication the primary waits for at least one replica to confirm it has durably written the data before acknowledging success to the client. This guarantees zero data loss on failover but adds the replica\'s network round-trip to every write latency. In asynchronous replication the primary acknowledges immediately and replicates in the background — higher write throughput but a window of potential data loss (replication lag) if the primary crashes before the replica catches up.',
    compiledJS:
      '-- PostgreSQL: configure synchronous standby\nALTER SYSTEM SET synchronous_standby_names = \'FIRST 1 (replica1)\';\n-- Writes now wait for replica1 to confirm WAL receipt before COMMIT returns.\n\n-- Check current replication lag:\nSELECT\n  client_addr,\n  state,\n  sent_lsn - write_lsn AS write_lag_bytes,\n  sent_lsn - flush_lsn AS flush_lag_bytes\nFROM pg_stat_replication;',
    bestPractice:
      'Use synchronous replication for financial data where data loss is unacceptable. For most web applications, configure semi-synchronous replication or use PostgreSQL\'s synchronous_commit = remote_write (durability without fsync wait on the replica) to balance safety and latency. Always monitor replication lag — a lagging replica is a ticking clock of potential data loss.',
    source: 'DDIA — Chapter 5: Replication',
  },
  {
    id: 'a03',
    topic: 'Event Sourcing',
    question: 'What distinguishes Event Sourcing from a traditional CRUD data model?',
    code: null,
    options: [
      'Event Sourcing stores only the latest state; CRUD stores a full event log',
      'Event Sourcing stores an immutable log of all state-changing events; current state is derived by replaying them',
      'Event Sourcing requires a relational database; CRUD works with any database',
      'They are functionally identical but use different SQL syntax',
    ],
    correctIndex: 1,
    explanation:
      "In a CRUD model you overwrite state in place — an UPDATE changes the row and history is lost unless you built an audit table separately. Event Sourcing persists every state-changing event as an immutable fact in an append-only event log. Current state is derived by replaying (folding) all past events for an entity. This gives you a complete audit trail, temporal queries (\"what was the state on March 3rd?\"), and the ability to rebuild read models from scratch by replaying history.",
    compiledJS:
      '-- Events table (append-only, never updated or deleted)\nCREATE TABLE account_events (\n  id           BIGSERIAL PRIMARY KEY,\n  aggregate_id UUID       NOT NULL,\n  event_type   TEXT       NOT NULL,  -- "MoneyDeposited", "MoneyWithdrawn"\n  payload      JSONB      NOT NULL,\n  occurred_at  TIMESTAMPTZ DEFAULT NOW()\n);\n\n-- Current balance derived by replaying events:\nSELECT\n  SUM(CASE event_type\n    WHEN \'MoneyDeposited\'  THEN (payload->>\'amount\')::NUMERIC\n    WHEN \'MoneyWithdrawn\'  THEN -(payload->>\'amount\')::NUMERIC\n  END) AS balance\nFROM account_events\nWHERE aggregate_id = \'<uuid>\';',
    bestPractice:
      'Event Sourcing adds significant complexity — replay performance degrades as the event log grows (use snapshots after N events), and debugging eventual-consistency bugs requires tracing event streams. Apply it only to domains where auditability and temporal querying are first-class requirements (finance, healthcare, compliance). Most CRUD applications do not need it.',
    source: 'Martin Fowler — Event Sourcing (martinfowler.com)',
  },
  {
    id: 'a04',
    topic: 'CQRS',
    question: 'What problem does CQRS (Command Query Responsibility Segregation) primarily solve?',
    code: null,
    options: [
      'It eliminates the need for database indexes',
      'It separates the write model (commands) from the read model (queries), allowing each to be optimized independently',
      'It replaces transactions with eventual consistency',
      'It enforces strict 3NF normalization on all tables',
    ],
    correctIndex: 1,
    explanation:
      "CQRS (Greg Young, 2010) separates the model used for writes (commands: CreateOrder, UpdateProfile) from the model used for reads (queries: GetOrderDetails, ListUserOrders). The write model can be fully normalised and ACID-transactional; the read model can be denormalised, pre-joined, and stored in a different store (Redis, Elasticsearch, a separate read DB) optimised purely for the UI's query shape. This eliminates the impedance mismatch between \"how we store data\" and \"how we query data\" at scale.",
    compiledJS: null,
    bestPractice:
      'CQRS is most powerful when combined with Event Sourcing — events from the write side rebuild the read-model projections. Without ES, CQRS can be implemented with simple DB triggers or CDC that populate a denormalised read table. Do not apply CQRS to simple CRUD screens — the added infrastructure (separate read store, synchronisation logic, eventual consistency) is pure overhead for most features.',
    source: 'Martin Fowler — CQRS (martinfowler.com)',
  },
  {
    id: 'a05',
    topic: 'Locking',
    question: 'What is the key difference between optimistic and pessimistic locking?',
    code: null,
    options: [
      'Optimistic locking prevents all concurrent reads; pessimistic locking allows them',
      'Optimistic locking assumes conflicts are rare and detects them at commit time; pessimistic locking acquires locks upfront to prevent concurrent modification',
      'Pessimistic locking is only available in NoSQL databases',
      'They differ only in syntax, not in behavior',
    ],
    correctIndex: 1,
    explanation:
      'Pessimistic locking (SELECT … FOR UPDATE) acquires an exclusive row lock at read time, blocking other transactions from modifying the row until the lock is released. Optimistic locking reads the row without locking, performs work, then re-checks a version column or ETag at commit time — if the version has changed, the transaction is aborted and retried. Optimistic locking has higher throughput under low-contention workloads; pessimistic locking is safer under high-contention or long-running transactions.',
    compiledJS:
      '-- Pessimistic: lock the row immediately\nBEGIN;\nSELECT * FROM inventory WHERE product_id = 5 FOR UPDATE;\n-- ... business logic ...\nUPDATE inventory SET stock = stock - 1 WHERE product_id = 5;\nCOMMIT;\n\n-- Optimistic: version column checked at update time\nUPDATE inventory\n  SET stock = stock - 1, version = version + 1\nWHERE product_id = 5 AND version = 7;\n-- If 0 rows updated → conflict → retry',
    bestPractice:
      'Use optimistic locking for web forms where conflicts are rare (user profile edits) and pessimistic locking for inventory or financial operations where two concurrent transactions acting on the same row would both succeed naively (double-booking, overselling). Expose the version column as an ETag in your API so clients can detect conflicts without hitting the DB.',
    source: 'DDIA — Chapter 7: Transactions',
  },
  {
    id: 'a06',
    topic: 'Partitioning',
    question: 'What is the difference between horizontal partitioning (sharding) and vertical partitioning?',
    code: null,
    options: [
      'Horizontal partitioning splits rows across multiple nodes; vertical partitioning splits columns into separate tables or stores',
      'Horizontal partitioning splits columns; vertical partitioning splits rows',
      'They are the same concept with different names',
      'Vertical partitioning applies only to NoSQL databases',
    ],
    correctIndex: 0,
    explanation:
      "Horizontal partitioning (sharding) distributes rows across multiple partitions based on a partition key — each partition holds a subset of rows but all columns. Vertical partitioning splits a wide table into narrower tables grouping related columns together — for example moving a user's large BLOB profile_picture column to a separate table so the hot user lookup path doesn't touch it. Vertical partitioning is also used in columnar stores (Parquet, ORC) which store each column separately for efficient analytical scans.",
    compiledJS:
      '-- PostgreSQL declarative horizontal partitioning by month:\nCREATE TABLE events (\n  id         BIGINT,\n  created_at TIMESTAMPTZ NOT NULL,\n  payload    JSONB\n) PARTITION BY RANGE (created_at);\n\nCREATE TABLE events_2024_01 PARTITION OF events\n  FOR VALUES FROM (\'2024-01-01\') TO (\'2024-02-01\');\n\nCREATE TABLE events_2024_02 PARTITION OF events\n  FOR VALUES FROM (\'2024-02-01\') TO (\'2024-03-01\');',
    bestPractice:
      'Use PostgreSQL declarative table partitioning for time-series data with a clear partition key — partition pruning eliminates entire months from scans. Pair with pg_partman for automated partition creation and old-partition dropping. For vertical partitioning, split wide tables when profiling shows that hot queries are needlessly reading large columns (BYTEA, TEXT, JSONB) they do not use.',
    source: 'PostgreSQL Docs — Table Partitioning; DDIA Chapter 6',
  },
  {
    id: 'a07',
    topic: 'Two-Phase Commit',
    question: 'What problem does the Two-Phase Commit (2PC) protocol solve in distributed databases?',
    code: null,
    options: [
      'It speeds up read queries across multiple shards',
      'It coordinates an atomic commit across multiple participating nodes so all commit or all abort',
      'It replicates data from primary to read replicas',
      'It compresses transaction logs to save disk space',
    ],
    correctIndex: 1,
    explanation:
      '2PC ensures atomicity when a transaction spans multiple independent nodes (e.g. two separate databases). In Phase 1 (Prepare) the coordinator asks all participants to prepare the transaction and report ready/abort. In Phase 2 (Commit) the coordinator sends commit to all if everyone prepared, or abort if anyone failed. The fatal weakness of 2PC is the blocking problem: if the coordinator crashes after Phase 1 but before Phase 2, all participants are blocked holding locks indefinitely — they cannot decide alone.',
    compiledJS: null,
    bestPractice:
      'Avoid 2PC across microservices — it introduces tight coupling, blocking failures, and is unsupported by most cloud databases. Use the Saga pattern instead: decompose the transaction into a sequence of local transactions with compensating actions for rollback. Reserve 2PC for cases where both databases are under your control and support the protocol natively (PostgreSQL PREPARE TRANSACTION).',
    source: 'DDIA — Chapter 9: Consistency and Consensus',
  },
  {
    id: 'a08',
    topic: 'Time-Series Design',
    question: 'Which data modeling technique is best suited for time-series data with high write throughput and range-based time queries?',
    code: null,
    options: [
      'Storing all events in a single normalized row per entity',
      'Using an append-only table partitioned by time range, with a monotonically increasing timestamp as part of the primary key',
      'Using a Many-to-Many junction table',
      'Applying 3NF normalization to eliminate all redundancy',
    ],
    correctIndex: 1,
    explanation:
      'Time-series data has three key characteristics: always appended (never updated in place), queried by time range, and old data is eventually dropped. An append-only table with range partitioning by time keeps hot (recent) partitions small, allows old partitions to be dropped in O(1) (DROP PARTITION vs DELETE), and enables partition pruning for time-range queries. Including the timestamp in the primary key ensures the clustered index organises rows chronologically, maximising sequential I/O for range scans.',
    compiledJS:
      '-- Append-only, time-range partitioned metrics table\nCREATE TABLE metrics (\n  metric_name TEXT        NOT NULL,\n  recorded_at TIMESTAMPTZ NOT NULL,\n  value       DOUBLE PRECISION NOT NULL,\n  PRIMARY KEY (metric_name, recorded_at)  -- clustered by time per metric\n) PARTITION BY RANGE (recorded_at);\n\n-- Query: last 24 hours (partition pruning eliminates all other partitions)\nSELECT AVG(value)\nFROM metrics\nWHERE metric_name = \'cpu_usage\'\n  AND recorded_at >= NOW() - INTERVAL \'24 hours\';',
    bestPractice:
      'For production time-series at scale, evaluate TimescaleDB (PostgreSQL extension) or ClickHouse before building your own partitioning scheme. TimescaleDB automates hypertable creation, chunk management, and compression. ClickHouse provides columnar storage that achieves 10–100x better compression and query speed for analytical time-series workloads.',
    source: 'TimescaleDB Docs — Time-Series Best Practices',
  },
  {
    id: 'a09',
    topic: 'Multi-Tenancy',
    question: "In a multi-tenant SaaS application, what is the main advantage of the 'database-per-tenant' isolation strategy over a shared schema?",
    code: null,
    options: [
      'It uses less total storage than a shared schema',
      'It provides stronger data isolation, simplifies per-tenant backups, and avoids noisy-neighbor query contention',
      'It requires no schema migrations when adding new tenants',
      'It is the only approach that supports ACID transactions',
    ],
    correctIndex: 1,
    explanation:
      "Database-per-tenant gives each tenant a fully isolated database instance, ensuring that a SQL bug cannot leak tenant A's data to tenant B, that backups and restores are tenant-scoped, and that a tenant running expensive queries cannot degrade performance for others (noisy-neighbor problem). The trade-offs are higher operational overhead (managing thousands of DB connections, running migrations across all tenant databases) and higher infrastructure cost compared to shared schema where row-level security and tenant_id columns provide logical isolation in a single database.",
    compiledJS: null,
    bestPractice:
      "For early-stage SaaS, start with shared schema + row-level security (PostgreSQL RLS) — it is operationally simpler and scales well to thousands of small tenants. Offer database-per-tenant as a premium isolation tier for enterprise customers with compliance requirements (HIPAA, SOC 2). Use a connection pooler (PgBouncer, RDS Proxy) to avoid connection exhaustion when managing many tenant databases.",
    source: 'Citus Data — Multi-Tenant Architecture Patterns',
  },
  {
    id: 'a10',
    topic: 'Saga Pattern',
    question: 'How does the Saga pattern address distributed transaction consistency without using 2PC?',
    code: null,
    options: [
      'It locks all involved services until the transaction completes',
      'It breaks a distributed transaction into a sequence of local transactions, each publishing an event; compensating transactions undo completed steps on failure',
      'It relies on a central coordinator to hold a global lock',
      'It buffers all writes in memory until the entire operation succeeds',
    ],
    correctIndex: 1,
    explanation:
      "The Saga pattern (Hector Garcia-Molina, 1987) decomposes a long-running distributed transaction into a series of local transactions, each scoped to a single service/database. Each step publishes an event (choreography-based Saga) or sends a command to an orchestrator (orchestration-based Saga). If a step fails, previously completed steps are reversed using compensating transactions — semantic undos that leave the system in a consistent state. Unlike 2PC, Sagas never hold distributed locks, so they don't block and scale horizontally.",
    compiledJS: null,
    bestPractice:
      'Use orchestration-based Sagas (a central workflow engine like Temporal or AWS Step Functions) over choreography for complex business flows — the explicit workflow definition makes debugging, monitoring, and adding new steps far easier than tracing event chains across services. Always design compensating transactions before implementing forward steps: if you cannot undo a step, you cannot safely include it in a Saga.',
    source: 'Chris Richardson — Microservices Patterns, Chapter 4',
  },
]
