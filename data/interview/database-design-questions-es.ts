import type { InterviewQuestion } from '@/lib/interviewTypes'

export const DATABASE_DESIGN_QUESTIONS_ES: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "Primary Key",
    "question": "¿Cuál es el propósito principal de una clave primaria en una base de datos relacional?",
    "code": null,
    "options": [
      "Ordenar filas de la tabla automáticamente en orden alfabético",
      "Identificar de forma única cada registro individual en una tabla",
      "Establecer un enlace referencial externo entre dos tablas",
      "Aplicar restricciones NOT NULL obligatorias en todas las columnas"
    ],
    "correctIndex": 1,
    "explanation": "Una clave primaria identifica de forma única cada fila en una tabla, garantizando que no existan dos filas con el mismo valor de clave.",
    "compiledJS": "-- DDL with primary key\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n  email TEXT NOT NULL UNIQUE\n);\n\n-- The engine implicitly creates:\n-- UNIQUE INDEX users_pkey ON users(id)",
    "bestPractice": "Prefer a surrogate integer or UUID as the primary key over a natural key (email, username) — natural keys change and FK relationships break with them. In PostgreSQL use BIGINT GENERATED ALWAYS AS IDENTITY; in MySQL use BIGINT AUTO_INCREMENT. Avoid composite primary keys on large tables unless the relationship table genuinely has no other identity.",
    "source": "PostgreSQL Docs — Constraints: Primary Keys"
  },
  {
    "id": "b02",
    "topic": "Foreign Key",
    "question": "¿Qué hace una clave foránea en una base de datos relacional?",
    "code": null,
    "options": [
      "Cifra valores de columnas sensibles usando claves AES-256 para garantizar seguridad criptográfica en el disco",
      "Referencia la clave primaria de otra tabla, asegurando que la base de datos aplique integridad referencial",
      "Acelera consultas SELECT analíticas al indexar columnas de clave foránea en árboles B-Tree en memoria",
      "Evita que registros duplicados se inserten en una sola tabla sin requerir restricciones de unicidad explícitas"
    ],
    "correctIndex": 1,
    "explanation": "Una clave foránea establece un vínculo entre dos tablas al hacer referencia a la clave primaria de la tabla principal, garantizando la integridad referencial.",
    "compiledJS": "CREATE TABLE orders (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT NOT NULL\n    REFERENCES users(id)\n    ON DELETE CASCADE\n    ON UPDATE CASCADE\n);\n\n-- Attempting to insert an order for a non-existent user:\n-- INSERT INTO orders(id, user_id) VALUES (1, 9999);\n-- ERROR: insert or update on table \"orders\" violates\n-- foreign key constraint \"orders_user_id_fkey\"",
    "bestPractice": "Always add an index on foreign key columns — the database enforces the constraint via a lookup on the parent table, and without an index every FK check is a sequential scan. In PostgreSQL this index is NOT created automatically (unlike MySQL InnoDB). Use ON DELETE RESTRICT or ON DELETE CASCADE consciously; leaving it as the default (RESTRICT) is safer for audit-sensitive data.",
    "source": "PostgreSQL Docs — Referential Integrity"
  },
  {
    "id": "b03",
    "topic": "NoSQL",
    "question": "¿Cuál de las siguientes opciones describe mejor una base de datos NoSQL?",
    "code": null,
    "options": [
      "Un motor de almacenamiento plano sin soporte para índices de búsqueda",
      "Una base relacional diseñada para guardar solo métricas numéricas",
      "Una base no relacional que soporta modelos de documento, clave-valor o grafo",
      "Un motor relacional tradicional que prohíbe sintaxis de consultas SQL"
    ],
    "correctIndex": 2,
    "explanation": "Las bases de datos NoSQL son no relacionales y admiten modelos de datos flexibles como documentos, clave-valor, familias de columnas y grafos.",
    "compiledJS": null,
    "bestPractice": "Choose NoSQL when your access pattern is known, simple, and unlikely to require ad-hoc joins — e.g. a user session store (key-value), a product catalog with varying attributes (document), or a social graph (graph DB). Do not reach for NoSQL to avoid schema design — a poorly thought-out document schema becomes just as painful as a badly normalised relational one.",
    "source": "Martin Fowler — NoSQL Distilled (overview)"
  },
  {
    "id": "b04",
    "topic": "CRUD",
    "question": "¿Qué significa CRUD en el contexto de operaciones de base de datos?",
    "code": null,
    "options": [
      "Copiar, Reemplazar, Actualizar, Eliminar",
      "Crear, Leer, Actualizar, Eliminar",
      "Conectar, Recuperar, Subir, Borrar",
      "Crear, Restaurar, Deshacer, Implementar"
    ],
    "correctIndex": 1,
    "explanation": "CRUD significa Crear, Leer, Actualizar y Eliminar (Create, Read, Update, Delete), las cuatro operaciones fundamentales realizadas sobre registros de base de datos.",
    "compiledJS": "-- Create\nINSERT INTO users (email) VALUES ('alice@example.com');\n\n-- Read\nSELECT * FROM users WHERE id = 1;\n\n-- Update\nUPDATE users SET email = 'new@example.com' WHERE id = 1;\n\n-- Delete\nDELETE FROM users WHERE id = 1;",
    "bestPractice": "In production systems, prefer soft deletes (marking a row as deleted with a timestamp) over hard deletes for any entity with audit or compliance requirements. This preserves history without physically removing data, and allows tombstone-based CDC (change data capture) streams to propagate the deletion to downstream consumers.",
    "source": "PostgreSQL Docs — Data Manipulation"
  },
  {
    "id": "b05",
    "topic": "NULL Semantics",
    "question": "¿Qué valor representa NULL en SQL?",
    "code": null,
    "options": [
      "Un valor numérico entero cero (`0`)",
      "Una cadena de texto vacía sin contenido (`''`)",
      "La ausencia de un valor o un estado desconocido",
      "Una evaluación de condición booleana falsa (`FALSE`)"
    ],
    "correctIndex": 2,
    "explanation": "NULL en SQL representa la ausencia de un valor o un valor desconocido, siendo distinto de cero o de una cadena vacía.",
    "compiledJS": "-- This returns NO rows:\nSELECT * FROM users WHERE deleted_at = NULL;\n\n-- Correct:\nSELECT * FROM users WHERE deleted_at IS NULL;\n\n-- NULL propagates through expressions:\nSELECT NULL + 1;   -- result: NULL\nSELECT NULL = NULL; -- result: NULL (not TRUE)",
    "bestPractice": "Avoid nullable columns where possible — add NOT NULL constraints at the DB level and use sentinel values (empty string, epoch timestamp, 0) only when they carry genuine semantic meaning. When NULLs are unavoidable, use COALESCE() in queries to supply defaults and document the nullability intent in column comments.",
    "source": "SQL Standard — Three-Valued Logic"
  },
  {
    "id": "b06",
    "topic": "Relationships",
    "question": "¿Qué tipo de relación existe cuando una fila en la tabla A puede relacionarse con varias filas en la tabla B, y una fila en la tabla B también puede relacionarse con varias filas en la tabla A?",
    "code": null,
    "options": [
      "Uno a Uno (1:1)",
      "Uno a Muchos (1:N)",
      "Muchos a Muchos (M:N)",
      "Auto-referencial"
    ],
    "correctIndex": 2,
    "explanation": "Una relación muchos a muchos (M:N) significa que cada fila de cualquier lado puede relacionarse con múltiples filas del otro lado, resolviéndose habitualmente mediante una tabla de unión (junction table).",
    "compiledJS": "-- Junction table resolving M:N between students and courses\nCREATE TABLE enrolments (\n  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,\n  course_id  BIGINT REFERENCES courses(id)  ON DELETE CASCADE,\n  enrolled_at TIMESTAMPTZ DEFAULT NOW(),\n  PRIMARY KEY (student_id, course_id)\n);",
    "bestPractice": "Add extra columns to the junction table to store relationship metadata (enrolled_at, role, status) — this often turns out to be necessary as requirements grow. Use a composite PK on the two FK columns unless you need to reference the junction row from a third table, in which case add a surrogate PK.",
    "source": "Database Design for Mere Mortals — Chapter 11"
  },
  {
    "id": "b07",
    "topic": "Normalization",
    "question": "¿Qué es la normalización de una base de datos?",
    "code": null,
    "options": [
      "Convertir todos los nombres de columnas a minúsculas",
      "Organizar los datos para reducir la redundancia e mejorar la integridad",
      "Unir todas las tablas en una sola tabla plana para el rendimiento",
      "Realizar un respaldo de datos a un servidor secundario"
    ],
    "correctIndex": 1,
    "explanation": "La normalización es el proceso de organizar un esquema de base de datos para minimizar la redundancia de datos y garantizar la integridad de los datos mediante formas normales definidas.",
    "compiledJS": null,
    "bestPractice": "Normalise to at least 3NF as the default starting point, then consciously denormalize only where profiling shows a specific read bottleneck. Do not skip normalisation in favour of \"just adding more columns to avoid joins\" — the inconsistency bugs that arise from duplicated data are among the hardest to diagnose in production.",
    "source": "C. J. Date — An Introduction to Database Systems"
  },
  {
    "id": "b08",
    "topic": "ACID — Atomicity",
    "question": "¿Qué propiedad de las transacciones ACID asegura que una transacción se complete completamente o no tenga ningún efecto en absoluto?",
    "code": null,
    "options": [
      "Consistencia",
      "Aislamiento",
      "Atomicidad",
      "Durabilidad"
    ],
    "correctIndex": 2,
    "explanation": "La atomicidad garantiza que todas las operaciones dentro de una transacción se traten como una sola unidad: todas se completan con éxito o todas se revierten.",
    "compiledJS": "-- Both INSERTs succeed or neither does\nBEGIN;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n\n-- If the process crashes after the first UPDATE:\n-- On restart, PostgreSQL replays the WAL and rolls\n-- back the incomplete transaction automatically.",
    "bestPractice": "Wrap logically related mutations in a single transaction — never rely on application-level retries to compensate for partial writes. In ORMs, be explicit about transaction boundaries rather than using auto-commit mode; it is far too easy to leave a connection in an uncommitted state under ORM defaults.",
    "source": "PostgreSQL Docs — Transactions"
  },
  {
    "id": "b09",
    "topic": "SQL vs NoSQL",
    "question": "¿Cuál es la principal diferencia entre los modelos de consulta SQL y NoSQL?",
    "code": null,
    "options": [
      "SQL usa esquemas JSON fijos; NoSQL usa jerarquías dinámicas en XML",
      "SQL usa esquemas rígidos con SQL; NoSQL usa modelos de datos flexibles",
      "SQL corre solo en Windows; NoSQL está limitado a contenedores Linux",
      "SQL requiere índices agrupados; NoSQL prohíbe índices secundarios"
    ],
    "correctIndex": 1,
    "explanation": "Las bases de datos SQL utilizan un lenguaje de consulta estructurado sobre esquemas predefinidos, mientras que las bases de datos NoSQL ofrecen modelos de datos flexibles con diversas API de consulta adaptadas a su estructura de datos.",
    "compiledJS": null,
    "bestPractice": "SQL is the right default for most applications because its flexibility for ad-hoc querying and strong consistency are invaluable as requirements change. Adopt NoSQL only when you have identified a specific access pattern that a relational model cannot serve well at your scale — premature adoption of NoSQL to appear modern is a common engineering mistake.",
    "source": "DDIA — Chapter 2: Data Models and Query Languages"
  },
  {
    "id": "b10",
    "topic": "Migrations",
    "question": "¿Cuál es el propósito de una migración de base de datos?",
    "code": null,
    "options": [
      "Mover volúmenes de almacenamiento a otro centro de datos en la nube",
      "Exportar tablas relacionales a archivos planos comprimidos en CSV",
      "Aplicar cambios de esquema versionados e incrementales en la base",
      "Convertir tablas relacionales y restricciones a colecciones NoSQL"
    ],
    "correctIndex": 2,
    "explanation": "Las migraciones de bases de datos son scripts versionados que aplican cambios incrementales de esquema, permitiendo a los equipos evolucionar el esquema de forma controlada y repetible.",
    "compiledJS": "-- Example Flyway migration: V3__add_deleted_at_to_users.sql\nALTER TABLE users\n  ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;\n\nCREATE INDEX CONCURRENTLY idx_users_deleted_at\n  ON users(deleted_at)\n  WHERE deleted_at IS NOT NULL;",
    "bestPractice": "Never modify a migration file that has already been applied to any environment — treat migrations as immutable history. For zero-downtime deployments follow the expand-contract pattern: first add the new column as nullable (expand), deploy the new code, then backfill and add constraints (contract) in a subsequent migration.",
    "source": "Flyway Docs — Versioned Migrations"
  },
  {
    "id": "i01",
    "topic": "2NF",
    "question": "¿Cuál forma normal requiere que cada atributo no clave esté completamente dependiente de la clave primaria (eliminando dependencias parciales)?",
    "code": null,
    "options": [
      "Primera Forma Normal (1FN)",
      "Segunda Forma Normal (2FN)",
      "Tercera Forma Normal (3FN)",
      "Forma Normal de Boyce-Codd (BCNF)"
    ],
    "correctIndex": 1,
    "explanation": "La 2FN se basa en la 1FN al requerir que cada atributo no clave dependa funcionalmente de toda la clave primaria compuesta, no solo de una parte de ella.",
    "compiledJS": "-- Violates 2NF: product_name depends only on product_id, not (order_id, product_id)\nCREATE TABLE order_items_bad (\n  order_id    BIGINT,\n  product_id  BIGINT,\n  product_name TEXT,   -- partial dependency!\n  quantity    INT,\n  PRIMARY KEY (order_id, product_id)\n);\n\n-- 2NF-compliant split:\nCREATE TABLE products (\n  id   BIGINT PRIMARY KEY,\n  name TEXT NOT NULL\n);\nCREATE TABLE order_items (\n  order_id   BIGINT,\n  product_id BIGINT REFERENCES products(id),\n  quantity   INT,\n  PRIMARY KEY (order_id, product_id)\n);",
    "bestPractice": "Surrogate primary keys (single-column auto-increment or UUID) automatically satisfy 2NF because partial dependencies cannot exist without a composite key. This is one of several reasons senior engineers prefer surrogate keys.",
    "source": "C. J. Date — An Introduction to Database Systems, Chapter 11"
  },
  {
    "id": "i02",
    "topic": "1NF",
    "question": "¿Qué requiere la Primera Forma Normal (1FN)?",
    "code": null,
    "options": [
      "Ausencia de dependencias transitivas entre columnas que no son clave",
      "Valores de columna atómicos y cada columna con un tipo de dato único",
      "Todas las claves foráneas apuntando a claves primarias existentes",
      "Una clave primaria compuesta por dos o más columnas de la entidad"
    ],
    "correctIndex": 1,
    "explanation": "La 1FN requiere que cada columna contenga únicamente valores atómicos e indivisibles y que cada columna almacene valores de un único tipo de datos, sin grupos repetitivos.",
    "compiledJS": "-- Violates 1NF: tags is a comma-separated list\nCREATE TABLE posts_bad (\n  id   BIGINT PRIMARY KEY,\n  tags TEXT   -- e.g. \"typescript,nodejs,backend\"\n);\n\n-- 1NF-compliant: move repeating group to its own table\nCREATE TABLE post_tags (\n  post_id BIGINT REFERENCES posts(id),\n  tag     TEXT NOT NULL,\n  PRIMARY KEY (post_id, tag)\n);",
    "bestPractice": "PostgreSQL ARRAY and JSONB columns technically store non-atomic values and can violate 1NF in spirit. Use them only when the data is genuinely schemaless or when you have benchmarked that the flexibility outweighs the query complexity. For structured repeating groups, always normalise into a child table.",
    "source": "E. F. Codd — A Relational Model of Data for Large Shared Data Banks (1970)"
  },
  {
    "id": "i03",
    "topic": "Denormalization",
    "question": "¿Cuál de las siguientes es una razón válida para denormalizar intencionalmente una base de datos?",
    "code": null,
    "options": [
      "Para cumplir con restricciones estrictas de borrado en cascada",
      "Para mejorar lecturas reduciendo la cantidad de joins en consultas",
      "Para forzar validaciones de dominio de negocio más estrictas",
      "Para garantizar que todas las tablas cumplan con la forma 3NF"
    ],
    "correctIndex": 1,
    "explanation": "La desnormalización introduce redundancia de forma deliberada para reducir costosas operaciones de join, mejorando el rendimiento de lectura a costa de una mayor complejidad de escritura y un riesgo potencial de inconsistencia.",
    "compiledJS": "-- Denormalized: posts stores comment_count to avoid COUNT(*) JOIN on every read\nCREATE TABLE posts (\n  id            BIGINT PRIMARY KEY,\n  title         TEXT NOT NULL,\n  comment_count INT  NOT NULL DEFAULT 0  -- redundant, kept in sync by trigger\n);\n\n-- Trigger that keeps comment_count accurate:\nCREATE FUNCTION inc_comment_count() RETURNS TRIGGER LANGUAGE plpgsql AS $$\nBEGIN\n  UPDATE posts SET comment_count = comment_count + 1\n  WHERE id = NEW.post_id;\n  RETURN NEW;\nEND $$;\n\nCREATE TRIGGER after_comment_insert\n  AFTER INSERT ON comments\n  FOR EACH ROW EXECUTE FUNCTION inc_comment_count();",
    "bestPractice": "Always measure before denormalizing — most join overhead is eliminated by proper indexing and does not require redundancy. When you do denormalize, enforce consistency with a database trigger or an application-level transactional update, and document the invariant clearly so future engineers do not break it.",
    "source": "DDIA — Chapter 3: Storage and Retrieval"
  },
  {
    "id": "i04",
    "topic": "Surrogate Keys",
    "question": "¿Qué es una llave de sustitución?",
    "code": null,
    "options": [
      "Una clave natural derivada de datos de negocio como un correo",
      "Una clave del sistema (UUID o identity) sin significado de negocio",
      "Una clave compuesta que identifica relaciones en tablas intermedias",
      "Una clave foránea recursiva que apunta a la clave de su misma tabla"
    ],
    "correctIndex": 1,
    "explanation": "Una clave subrogada (surrogate key) es un identificador artificial generado por el sistema (como un ID autoincremental o UUID) que no tiene significado de negocio inherente.",
    "compiledJS": "-- Surrogate key (BIGINT IDENTITY)\nCREATE TABLE customers (\n  id    BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n  email TEXT NOT NULL UNIQUE  -- natural key demoted to a UNIQUE constraint\n);\n\n-- vs Natural key (fragile: email can change, breaking all FK references)\nCREATE TABLE customers_bad (\n  email TEXT PRIMARY KEY,\n  name  TEXT\n);",
    "bestPractice": "Use BIGINT surrogate keys as the default. Choose UUID (v7 for sequential inserts) only when you need globally unique identifiers across distributed systems or when you need to generate IDs client-side before inserting. Expose natural keys as UNIQUE constraints rather than PKs so they can be validated and changed without cascading FK updates.",
    "source": "Database Design for Mere Mortals — Chapter 9"
  },
  {
    "id": "i05",
    "topic": "ER Diagrams",
    "question": "En un diagrama ER, ¿qué indica una línea doble (participación total) en el lado de una entidad de una relación?",
    "code": null,
    "options": [
      "La entidad posee una clave primaria compuesta por varias columnas",
      "Cada instancia de la entidad debe participar siempre en la relación",
      "La entidad define una asociación Many-to-Many mediante tabla intermedia",
      "La entidad representa una entidad débil con clave identificadora parcial"
    ],
    "correctIndex": 1,
    "explanation": "Una línea doble (participación total) en un diagrama ER indica que cada instancia de esa entidad debe participar en la relación, sin miembros opcionales en ese lado.",
    "compiledJS": "-- Total participation of Employee in \"Works-In\" maps to NOT NULL FK:\nCREATE TABLE employees (\n  id          BIGINT PRIMARY KEY,\n  name        TEXT   NOT NULL,\n  department_id BIGINT NOT NULL  -- NOT NULL enforces total participation\n    REFERENCES departments(id)\n);\n\n-- Partial participation (nullable FK):\nCREATE TABLE employees_optional (\n  id          BIGINT PRIMARY KEY,\n  name        TEXT NOT NULL,\n  department_id BIGINT  -- nullable = partial participation\n    REFERENCES departments(id)\n);",
    "bestPractice": "Translate total participation directly to NOT NULL foreign key constraints at the DDL level — do not rely on application code to enforce it. Database constraints catch bugs in every code path (migrations, scripts, ORM bypasses) whereas application-level checks only guard the happy path.",
    "source": "Ramez Elmasri — Fundamentals of Database Systems, Chapter 7"
  },
  {
    "id": "i06",
    "topic": "CAP Theorem",
    "question": "Según el teorema CAP, una base de datos distribuida puede garantizar a lo más cuántas de las tres propiedades simultáneamente?",
    "code": null,
    "options": [
      "Las tres: Coherencia, Disponibilidad y Tolerancia a la Partición",
      "Solo una",
      "Cualquiera dos",
      "Ninguno: siempre están en conflicto"
    ],
    "correctIndex": 2,
    "explanation": "El teorema CAP establece que un sistema distribuido solo puede garantizar como máximo dos de las tres propiedades simultáneamente: Consistencia, Disponibilidad y Tolerancia a particiones.",
    "compiledJS": null,
    "bestPractice": "CAP is a useful mental model but is often oversimplified. In practice, use the PACELC model which also accounts for latency trade-offs in the absence of partitions. Most teams should default to a CP store (PostgreSQL, Spanner) unless they have specific requirements for geographic distribution or always-on availability that justify AP trade-offs.",
    "source": "Eric Brewer — Towards Robust Distributed Systems (2000)"
  },
  {
    "id": "i07",
    "topic": "OLTP vs OLAP",
    "question": "¿Cuál es la diferencia clave entre las cargas de trabajo OLTP y OLAP?",
    "code": null,
    "options": [
      "OLTP procesa datos JSON; OLAP gestiona solo esquemas estructurados SQL",
      "OLTP maneja transacciones rápidas; OLAP ejecuta consultas analíticas complejas",
      "OLAP requiere bloqueos ACID; OLTP usa consistencia eventual en memoria",
      "OLTP corre solo en la nube; OLAP opera exclusivamente en servidores locales"
    ],
    "correctIndex": 1,
    "explanation": "OLTP está optimizado para operaciones transaccionales de alta frecuencia y baja latencia; OLAP está optimizado para agregaciones complejas y consultas analíticas sobre grandes conjuntos de datos históricos.",
    "compiledJS": null,
    "bestPractice": "Never run OLAP-style analytics queries directly against your production OLTP database — long-running scans hold locks and degrade transaction latency for all users. Route analytics traffic to a read replica, a materialized view, or a separate data warehouse fed via CDC (change data capture) or ETL.",
    "source": "DDIA — Chapter 3: Storage and Retrieval"
  },
  {
    "id": "i08",
    "topic": "Isolation Levels",
    "question": "¿Cuál nivel de aislamiento de transacción previene las lecturas sucias pero aún permite lecturas no repetibles?",
    "code": null,
    "options": [
      "Lectura No Comprobada",
      "Lectura Comprobada",
      "Lectura Repetible",
      "Serializable"
    ],
    "correctIndex": 1,
    "explanation": "Read Committed evita lecturas sucias leyendo únicamente datos confirmados (committed), pero una segunda lectura de la misma fila dentro de la misma transacción puede ver un valor distinto si otra transacción realiza un commit entre ambas lecturas.",
    "compiledJS": "-- Set isolation for the current transaction:\nBEGIN ISOLATION LEVEL READ COMMITTED;\n-- (this is the PostgreSQL default)\n\n-- Anomalies per level:\n-- Read Uncommitted : dirty reads allowed\n-- Read Committed   : dirty reads prevented, non-repeatable reads allowed  ← default\n-- Repeatable Read  : + non-repeatable reads prevented, phantom reads allowed\n-- Serializable     : all anomalies prevented (highest cost)",
    "bestPractice": "Use the default Read Committed for most web application workloads. Bump to Serializable only for financial or inventory operations where phantom reads could cause double-spends or race conditions. Be aware that Serializable increases lock contention and can cause transaction aborts that your retry logic must handle.",
    "source": "PostgreSQL Docs — Transaction Isolation"
  },
  {
    "id": "i09",
    "topic": "Soft vs Hard Delete",
    "question": "¿Cuál es la diferencia entre una eliminación suave y una eliminación dura?",
    "code": null,
    "options": [
      "Soft delete elimina filas al instante; hard delete fija un TTL de expiración",
      "Soft delete marca filas como inactivas; hard delete borra el registro del disco",
      "Soft delete borra solo índices; hard delete elimina registros de la tabla",
      "Ambos representan la misma operación de borrado físico ejecutada en segundo plano"
    ],
    "correctIndex": 1,
    "explanation": "Una eliminación lógica (soft delete) establece un indicador (como is_deleted o deleted_at) para ocultar la fila de las consultas habituales mientras preserva los datos; una eliminación física (hard delete) elimina permanentemente la fila de la tabla.",
    "compiledJS": "-- Soft delete\nUPDATE users\n  SET deleted_at = NOW()\nWHERE id = 42;\n\n-- Every query must filter:\nSELECT * FROM users WHERE deleted_at IS NULL;\n\n-- Automate with a view:\nCREATE VIEW active_users AS\n  SELECT * FROM users WHERE deleted_at IS NULL;\n\n-- Hard delete\nDELETE FROM users WHERE id = 42;",
    "bestPractice": "For GDPR/CCPA compliance, prefer a hybrid: soft-delete first (replace PII columns with a tombstone value, set deleted_at), then schedule hard deletion after the required retention window. Use a partial index on deleted_at IS NULL to keep normal queries fast without scanning deleted rows.",
    "source": "PostgreSQL Docs — Partial Indexes; GDPR Article 17"
  },
  {
    "id": "i10",
    "topic": "Schema-on-Read vs Write",
    "question": "¿Qué significa 'schema-on-write' en comparación con 'schema-on-read'?",
    "code": null,
    "options": [
      "Schema-on-write valida en inserción; schema-on-read valida al consultar",
      "Schema-on-write es exclusivo de NoSQL; schema-on-read es propio de bases SQL",
      "Schema-on-read exige tipos estáticos previos antes de guardar los datos",
      "Ambos modelos validan tipos con rigor idéntico al momento de la inserción"
    ],
    "correctIndex": 0,
    "explanation": "Schema-on-write (RDBMS tradicional) valida los datos frente a un esquema definido al momento de la escritura, mientras que schema-on-read (por ejemplo, data lakes o MongoDB) interpreta el esquema al momento de la consulta, permitiendo un almacenamiento flexible.",
    "compiledJS": null,
    "bestPractice": "Prefer schema-on-write for operational databases — catching schema violations at write time is vastly cheaper than discovering corrupted data weeks later during a reporting query. Use schema-on-read in data lakes and event stores where you don't control the producer's data shape, but validate with tools like Great Expectations or dbt tests before promoting data to reporting models.",
    "source": "DDIA — Chapter 4: Encoding and Evolution"
  },
  {
    "id": "a01",
    "topic": "Sharding",
    "question": "En el particionamiento basado en hash, ¿cuál es la principal ventaja frente al particionamiento basado en rango?",
    "code": null,
    "options": [
      "El sharding por hash optimiza consultas por rango secuencial de claves",
      "El sharding por hash distribuye datos de forma uniforme, evitando hotspots",
      "El sharding por hash permite sumar nodos sin requerir rebalanceo de datos",
      "El sharding por hash prescinde de definir una clave de particionamiento"
    ],
    "correctIndex": 1,
    "explanation": "El particionamiento basado en hash aplica una función hash a la clave de partición (shard key) para distribuir los datos de forma uniforme, evitando puntos calientes (hotspots) de escritura que pueden ocurrir al usar claves secuenciales con particionamiento por rango.",
    "compiledJS": null,
    "bestPractice": "Hash sharding is the right default for high-write-throughput systems with random key distributions (UUIDs, hashed user IDs). Use range sharding only when your queries are naturally range-based (time-series, geospatial) and you can tolerate hotspot mitigation strategies like pre-splitting or write throttling on hot shards.",
    "source": "DDIA — Chapter 6: Partitioning"
  },
  {
    "id": "a02",
    "topic": "Replication",
    "question": "¿Cuál es el principal trade-off de la replicación síncrona frente a la replicación asincrónica?",
    "code": null,
    "options": [
      "La replicación síncrona tiene menor latencia pero pierde datos en fallos",
      "La replicación síncrona asegura cero pérdida con mayor latencia de escritura",
      "La replicación asíncrona asegura consistencia estricta con cero pérdida",
      "La replicación síncrona opera solo en bases documentales como MongoDB"
    ],
    "correctIndex": 1,
    "explanation": "La replicación sincrónica garantiza que la réplica confirme la escritura antes de que el nodo principal confirme el éxito, evitando la pérdida de datos a costa de una mayor latencia de escritura.",
    "compiledJS": "-- PostgreSQL: configure synchronous standby\nALTER SYSTEM SET synchronous_standby_names = 'FIRST 1 (replica1)';\n-- Writes now wait for replica1 to confirm WAL receipt before COMMIT returns.\n\n-- Check current replication lag:\nSELECT\n  client_addr,\n  state,\n  sent_lsn - write_lsn AS write_lag_bytes,\n  sent_lsn - flush_lsn AS flush_lag_bytes\nFROM pg_stat_replication;",
    "bestPractice": "Use synchronous replication for financial data where data loss is unacceptable. For most web applications, configure semi-synchronous replication or use PostgreSQL's synchronous_commit = remote_write (durability without fsync wait on the replica) to balance safety and latency. Always monitor replication lag — a lagging replica is a ticking clock of potential data loss.",
    "source": "DDIA — Chapter 5: Replication"
  },
  {
    "id": "a03",
    "topic": "Event Sourcing",
    "question": "¿Qué distingue al Event Sourcing de un modelo de datos CRUD tradicional?",
    "code": null,
    "options": [
      "Event Sourcing guarda el estado actual; CRUD registra todo el historial",
      "Event Sourcing guarda eventos inmutables; el estado se deriva por reproducción",
      "Event Sourcing exige bases SQL; CRUD opera solo en almacenes NoSQL de clave-valor",
      "Event Sourcing actualiza filas in-place; CRUD anexa versiones secuencialmente"
    ],
    "correctIndex": 1,
    "explanation": "En Event Sourcing, el sistema persiste un registro inmutable append-only de eventos de dominio; el estado actual se reconstruye reproduciendo dichos eventos, lo que habilita pistas de auditoría completas y consultas temporales.",
    "compiledJS": "-- Events table (append-only, never updated or deleted)\nCREATE TABLE account_events (\n  id           BIGSERIAL PRIMARY KEY,\n  aggregate_id UUID       NOT NULL,\n  event_type   TEXT       NOT NULL,  -- \"MoneyDeposited\", \"MoneyWithdrawn\"\n  payload      JSONB      NOT NULL,\n  occurred_at  TIMESTAMPTZ DEFAULT NOW()\n);\n\n-- Current balance derived by replaying events:\nSELECT\n  SUM(CASE event_type\n    WHEN 'MoneyDeposited'  THEN (payload->>'amount')::NUMERIC\n    WHEN 'MoneyWithdrawn'  THEN -(payload->>'amount')::NUMERIC\n  END) AS balance\nFROM account_events\nWHERE aggregate_id = '<uuid>';",
    "bestPractice": "Event Sourcing adds significant complexity — replay performance degrades as the event log grows (use snapshots after N events), and debugging eventual-consistency bugs requires tracing event streams. Apply it only to domains where auditability and temporal querying are first-class requirements (finance, healthcare, compliance). Most CRUD applications do not need it.",
    "source": "Martin Fowler — Event Sourcing (martinfowler.com)"
  },
  {
    "id": "a04",
    "topic": "CQRS",
    "question": "¿Qué problema resuelve principalmente CQRS (Command Query Responsibility Segregation)?",
    "code": null,
    "options": [
      "Elimina la necesidad de índices manteniendo caché de documentos en memoria",
      "Separa modelos de lectura y escritura para optimizar y escalar cada uno aparte",
      "Reemplaza transacciones ACID por bloqueos distribuidos de consistencia eventual",
      "Aplica normalización estricta 3NF en todas las tablas de microservicios"
    ],
    "correctIndex": 1,
    "explanation": "CQRS separa el modelo de datos utilizado para escrituras (comandos) del modelo utilizado para lecturas (consultas), permitiendo escalabilidad, almacenamiento en caché y optimización independientes para cada lado.",
    "compiledJS": null,
    "bestPractice": "CQRS is most powerful when combined with Event Sourcing — events from the write side rebuild the read-model projections. Without ES, CQRS can be implemented with simple DB triggers or CDC that populate a denormalised read table. Do not apply CQRS to simple CRUD screens — the added infrastructure (separate read store, synchronisation logic, eventual consistency) is pure overhead for most features.",
    "source": "Martin Fowler — CQRS (martinfowler.com)"
  },
  {
    "id": "a05",
    "topic": "Locking",
    "question": "¿Cuál es la diferencia clave entre el bloqueo optimista y el bloqueo pesimista?",
    "code": null,
    "options": [
      "El bloqueo optimista impide lecturas concurrentes; el bloqueo pesimista admite lecturas sucias en la base",
      "El bloqueo optimista valida versiones al confirmar asumiendo pocos conflictos; el pesimista adquiere bloqueos antes",
      "El bloqueo pesimista es el único modelo en bases SQL; el bloqueo optimista es propio de motores NoSQL sin ACID",
      "Ambos enfoques comparten el mismo mecanismo de bloqueo en disco, diferenciándose solo en la sintaxis SQL"
    ],
    "correctIndex": 1,
    "explanation": "El bloqueo optimista permite el acceso concurrente y valida conflictos (por ejemplo, mediante una columna de versión) solo al momento del commit, mientras que el bloqueo pesimista mantiene un bloqueo durante la transacción para impedir modificaciones concurrentes.",
    "compiledJS": "-- Pessimistic: lock the row immediately\nBEGIN;\nSELECT * FROM inventory WHERE product_id = 5 FOR UPDATE;\n-- ... business logic ...\nUPDATE inventory SET stock = stock - 1 WHERE product_id = 5;\nCOMMIT;\n\n-- Optimistic: version column checked at update time\nUPDATE inventory\n  SET stock = stock - 1, version = version + 1\nWHERE product_id = 5 AND version = 7;\n-- If 0 rows updated → conflict → retry",
    "bestPractice": "Use optimistic locking for web forms where conflicts are rare (user profile edits) and pessimistic locking for inventory or financial operations where two concurrent transactions acting on the same row would both succeed naively (double-booking, overselling). Expose the version column as an ETag in your API so clients can detect conflicts without hitting the DB.",
    "source": "DDIA — Chapter 7: Transactions"
  },
  {
    "id": "a06",
    "topic": "Partitioning",
    "question": "¿Cuál es la diferencia entre una eliminación suave y una eliminación dura?",
    "code": null,
    "options": [
      "Horizontal divide filas entre nodos; vertical divide columnas en distintas tablas",
      "Horizontal divide columnas en tablas; vertical divide filas entre múltiples nodos",
      "Partición horizontal es para SQL; partición vertical es propia de motores NoSQL",
      "Ambas estrategias representan operaciones físicas idénticas en la misma máquina"
    ],
    "correctIndex": 0,
    "explanation": "Una eliminación lógica (soft delete) establece un indicador (como is_deleted o deleted_at) para ocultar la fila de las consultas habituales mientras preserva los datos; una eliminación física (hard delete) elimina permanentemente la fila de la tabla.",
    "compiledJS": "-- PostgreSQL declarative horizontal partitioning by month:\nCREATE TABLE events (\n  id         BIGINT,\n  created_at TIMESTAMPTZ NOT NULL,\n  payload    JSONB\n) PARTITION BY RANGE (created_at);\n\nCREATE TABLE events_2024_01 PARTITION OF events\n  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');\n\nCREATE TABLE events_2024_02 PARTITION OF events\n  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');",
    "bestPractice": "Use PostgreSQL declarative table partitioning for time-series data with a clear partition key — partition pruning eliminates entire months from scans. Pair with pg_partman for automated partition creation and old-partition dropping. For vertical partitioning, split wide tables when profiling shows that hot queries are needlessly reading large columns (BYTEA, TEXT, JSONB) they do not use.",
    "source": "PostgreSQL Docs — Table Partitioning; DDIA Chapter 6"
  },
  {
    "id": "a07",
    "topic": "Two-Phase Commit",
    "question": "¿Qué problema resuelve el protocolo Two-Phase Commit (2PC) en bases de datos distribuidas?",
    "code": null,
    "options": [
      "Acelera consultas de lectura distribuidas entre nodos fragmentados del cluster",
      "Asegura confirmación atómica para que todos los nodos confirmen o aborten juntos",
      "Replica registros de transacciones WAL de la base primaria a réplicas de lectura",
      "Comprime registros de transacciones para reducir el espacio de disco en los nodos"
    ],
    "correctIndex": 1,
    "explanation": "Two-Phase Commit garantiza atomicidad en transacciones distribuidas: en la primera fase un coordinador solicita a los participantes prepararse; en la segunda fase les instruye hacer commit o abortar según el acuerdo unánime.",
    "compiledJS": null,
    "bestPractice": "Avoid 2PC across microservices — it introduces tight coupling, blocking failures, and is unsupported by most cloud databases. Use the Saga pattern instead: decompose the transaction into a sequence of local transactions with compensating actions for rollback. Reserve 2PC for cases where both databases are under your control and support the protocol natively (PostgreSQL PREPARE TRANSACTION).",
    "source": "DDIA — Chapter 9: Consistency and Consensus"
  },
  {
    "id": "a08",
    "topic": "Time-Series Design",
    "question": "¿Cuál técnica de modelado de datos es más adecuada para datos de serie temporal con alta tasa de escritura y consultas basadas en rango de tiempo?",
    "code": null,
    "options": [
      "Guardar todos los eventos en una sola fila JSON desnormalizada por cada entidad",
      "Usar tablas append-only particionadas por tiempo con timestamp en clave primaria",
      "Diseñar tablas intermedias Many-to-Many con referencias de claves foráneas",
      "Aplicar normalización 3NF estricta para eliminar atributos temporales redundantes"
    ],
    "correctIndex": 1,
    "explanation": "Los datos de series temporales se benefician de escrituras append-only y particionamiento por rangos temporales: incluir la marca de tiempo en la clave primaria permite escaneos por rango eficientes, y el particionamiento mantiene acotado el tamaño de las particiones activas.",
    "compiledJS": "-- Append-only, time-range partitioned metrics table\nCREATE TABLE metrics (\n  metric_name TEXT        NOT NULL,\n  recorded_at TIMESTAMPTZ NOT NULL,\n  value       DOUBLE PRECISION NOT NULL,\n  PRIMARY KEY (metric_name, recorded_at)  -- clustered by time per metric\n) PARTITION BY RANGE (recorded_at);\n\n-- Query: last 24 hours (partition pruning eliminates all other partitions)\nSELECT AVG(value)\nFROM metrics\nWHERE metric_name = 'cpu_usage'\n  AND recorded_at >= NOW() - INTERVAL '24 hours';",
    "bestPractice": "For production time-series at scale, evaluate TimescaleDB (PostgreSQL extension) or ClickHouse before building your own partitioning scheme. TimescaleDB automates hypertable creation, chunk management, and compression. ClickHouse provides columnar storage that achieves 10–100x better compression and query speed for analytical time-series workloads.",
    "source": "TimescaleDB Docs — Time-Series Best Practices"
  },
  {
    "id": "a09",
    "topic": "Multi-Tenancy",
    "question": "En una aplicación SaaS multiinquilino, ¿cuál es la ventaja principal de la estrategia de aislamiento 'base de datos por inquilino' frente a un esquema compartido?",
    "code": null,
    "options": [
      "Consume menos almacenamiento en disco y memoria que un esquema compartido",
      "Asegura aislamiento fuerte de datos, respaldos simples y evita vecinos ruidosos",
      "Descarta la necesidad de migraciones de esquema al registrar nuevos clientes",
      "Es el único patrón multi-inquilino capaz de soportar transacciones ACID"
    ],
    "correctIndex": 1,
    "explanation": "La estrategia de base de datos por inquilino otorga a cada inquilino una base de datos completamente aislada, garantizando que los datos no se filtren entre inquilinos, permitiendo copias de seguridad independientes y evitando que consultas pesadas de un inquilino afecten a los demás.",
    "compiledJS": null,
    "bestPractice": "For early-stage SaaS, start with shared schema + row-level security (PostgreSQL RLS) — it is operationally simpler and scales well to thousands of small tenants. Offer database-per-tenant as a premium isolation tier for enterprise customers with compliance requirements (HIPAA, SOC 2). Use a connection pooler (PgBouncer, RDS Proxy) to avoid connection exhaustion when managing many tenant databases.",
    "source": "Citus Data — Multi-Tenant Architecture Patterns"
  },
  {
    "id": "a10",
    "topic": "Saga Pattern",
    "question": "¿Cómo aborda el patrón Saga la consistencia de transacciones distribuidas sin usar 2PC?",
    "code": null,
    "options": [
      "Bloquea tablas de todos los servicios mediante transacciones XA hasta que un coordinador confirme el commit final",
      "Divide la transacción en transacciones locales, donde eventos coordinan pasos y fallos activan compensaciones",
      "Graba operaciones pendientes en una base compartida que centraliza bloqueos de fila entre múltiples microservicios",
      "Encola mutaciones en memoria temporal esperando que un worker ejecute una única transacción ACID unificada"
    ],
    "correctIndex": 1,
    "explanation": "El patrón Saga encadena transacciones locales entre servicios mediante eventos u orquestación; si un paso falla, los pasos ya completados se revierten utilizando transacciones compensatorias, logrando consistencia eventual sin bloqueos distribuidos.",
    "compiledJS": null,
    "bestPractice": "Use orchestration-based Sagas (a central workflow engine like Temporal or AWS Step Functions) over choreography for complex business flows — the explicit workflow definition makes debugging, monitoring, and adding new steps far easier than tracing event chains across services. Always design compensating transactions before implementing forward steps: if you cannot undo a step, you cannot safely include it in a Saga.",
    "source": "Chris Richardson — Microservices Patterns, Chapter 4"
  }
]
