import type { InterviewQuestion } from '@/lib/interviewTypes'

export const DATABASE_INDEXING_QUESTIONS_ES: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "What is an Index",
    "question": "¿Qué es un índice de base de datos?",
    "code": null,
    "options": [
      "Una instantánea comprimida de respaldo guardada en almacenamiento secundario",
      "Una estructura que acelera búsquedas al costo de sobrecarga en la escritura",
      "Una restricción de seguridad que cifra columnas contra ataques de inyección",
      "Un cursor temporal en memoria asignado durante operaciones de join complejas"
    ],
    "correctIndex": 1,
    "explanation": "Un índice es una estructura de datos auxiliar (comúnmente un árbol B) que almacena un subconjunto ordenado de valores de columna junto a punteros a las filas correspondientes de la heap, lo que permite al motor localizar filas sin escanear toda la tabla.",
    "compiledJS": "-- Create a standard B-Tree index on orders.customer_id\nCREATE INDEX idx_orders_customer_id\n  ON orders (customer_id);\n\n-- EXPLAIN shows Index Scan instead of Seq Scan after index creation\nEXPLAIN SELECT * FROM orders WHERE customer_id = 42;\n/*\nIndex Scan using idx_orders_customer_id on orders\n  (cost=0.43..8.45 rows=1 width=72)\n  Index Cond: (customer_id = 42)\n*/",
    "bestPractice": "Senior engineers add indexes incrementally based on slow-query logs and pg_stat_user_indexes data, not speculatively. Before adding an index, confirm the column is highly selective (many distinct values). After creation, run EXPLAIN ANALYZE to verify the planner actually uses the new index — stale statistics can cause it to be ignored until ANALYZE runs.",
    "source": "PostgreSQL Docs — Chapter 11: Indexes"
  },
  {
    "id": "b02",
    "topic": "Read vs Write Cost",
    "question": "¿Cuál de las siguientes opciones describe mejor el trade-off entre lectura y escritura al agregar un índice?",
    "code": null,
    "options": [
      "Los índices aceleran tanto las lecturas como las escrituras por igual",
      "Los índices ralentizan las lecturas porque el optimizador debe verificar primero el índice",
      "Los índices aceleran las lecturas, pero agregan sobrecarga a las operaciones INSERT, UPDATE y DELETE",
      "Los índices solo afectan el rendimiento de DELETE, no de SELECT"
    ],
    "correctIndex": 2,
    "explanation": "Cada escritura debe actualizar tanto los datos de la tabla como cada uno de sus índices; por lo tanto, los índices sacrifican rendimiento de escritura a cambio de consultas de lectura (SELECT) más rápidas.",
    "compiledJS": "-- Measure write overhead with EXPLAIN ANALYZE\nEXPLAIN ANALYZE INSERT INTO orders (customer_id, amount)\nVALUES (42, 99.99);\n/*\nInsert on orders (cost=0.00..0.01 rows=0 width=0)\n  (actual time=1.832..1.833 rows=0 loops=1)\n  -- Each additional index adds ~0.2–0.5 ms write overhead per row\nBuffers: shared hit=7 read=1\n  -- 1 heap page + N index pages written\n*/\n\n-- Check total index count on a table\nSELECT count(*) FROM pg_indexes WHERE tablename = 'orders';",
    "bestPractice": "On write-heavy tables (event logs, audit trails, time-series inserts) minimize index count to the absolute essential set — primary key plus any foreign key columns needed for JOIN performance. For analytical reads on the same data, consider a separate read replica or a materialized view with dedicated indexes rather than burdening the write path.",
    "source": "PostgreSQL Docs — Chapter 11.1: Introduction; DDIA — Chapter 3: Storage and Retrieval"
  },
  {
    "id": "b03",
    "topic": "Primary Index",
    "question": "¿Qué distingue a un índice primario de un índice secundario?",
    "code": null,
    "options": [
      "Índices primarios aceptan duplicados; secundarios imponen unicidad estricta",
      "Índice primario rige la clave u orden; secundario indexa otros campos útiles",
      "Índices primarios residen en memoria RAM; secundarios se guardan en el disco",
      "Índices primarios soportan rangos; secundarios admiten solo filtros de igualdad"
    ],
    "correctIndex": 1,
    "explanation": "Un índice primario está asociado con la clave primaria (y en almacenamiento agrupado o clusterizado define el orden físico), mientras que los índices secundarios cubren columnas adicionales para soportar otros patrones de consulta.",
    "compiledJS": "-- Primary key implicitly creates a unique B-Tree index\nCREATE TABLE orders (\n  id        BIGSERIAL PRIMARY KEY,   -- creates idx: orders_pkey\n  customer_id INT NOT NULL,\n  created_at  TIMESTAMPTZ DEFAULT now()\n);\n\n-- Secondary index on a non-PK column\nCREATE INDEX idx_orders_created_at ON orders (created_at);\n\n-- pg_indexes shows both\nSELECT indexname, indexdef FROM pg_indexes\nWHERE tablename = 'orders';",
    "bestPractice": "Always declare a surrogate primary key (BIGSERIAL or UUID) even when a natural key exists. Natural keys can change, cascade updates through foreign keys, and tend to be wider — making every secondary index larger. Use the natural key as a UNIQUE constraint instead; it enforces integrity without making it the physical lookup anchor.",
    "source": "PostgreSQL Docs — Chapter 5.3: Constraints; DDIA — Chapter 3: B-Trees"
  },
  {
    "id": "b04",
    "topic": "Full Table Scan",
    "question": "¿Qué es un escaneo completo de tabla (full table scan) y cuándo lo utiliza la base de datos?",
    "code": null,
    "options": [
      "Leer solo el primer y último bloque para estimar la cantidad total de filas",
      "Leer todas las filas en secuencia cuando ningún índice conviene por costo",
      "Recorrer todos los índices secundarios antes de acceder a la tabla principal",
      "Validar restricciones de claves foráneas en secuencia sobre la tabla padre"
    ],
    "correctIndex": 0,
    "explanation": "Un escaneo secuencial (full table scan) lee cada página de datos del disco; el optimizador lo selecciona cuando no hay un índice útil o cuando la selectividad es tan baja que el I/O aleatorio mediante un índice resultaría más costoso.",
    "compiledJS": "EXPLAIN SELECT * FROM orders WHERE amount > 0;\n/*\nSeq Scan on orders  (cost=0.00..18450.00 rows=1000000 width=72)\n  Filter: (amount > 0)\n*/\n-- Planner chose Seq Scan because nearly every row matches.\n\n-- Force index use for testing (never do this in production)\nSET enable_seqscan = off;\nEXPLAIN SELECT * FROM orders WHERE amount > 0;\n/*\nIndex Scan using idx_orders_amount on orders (cost=0.43..95000.00 ...)\n-- More expensive! Random I/O over the whole table is worse.\n*/\nRESET enable_seqscan;",
    "bestPractice": "A seq scan is not always bad — for queries that return >5–10% of a table it is usually optimal. Profile first with EXPLAIN ANALYZE; only add an index if the planner's row estimate is accurate and the seq scan is genuinely slow. Investigate stale statistics (run ANALYZE) before assuming an index is needed.",
    "source": "PostgreSQL Docs — Chapter 14.1: Using EXPLAIN; Use The Index, Luke — When the Planner Ignores Indexes"
  },
  {
    "id": "b05",
    "topic": "WHERE Clause Index Usage",
    "question": "Dada la consulta `SELECT * FROM orders WHERE customer_id = 42`, ¿qué condición permite a la base de datos usar un índice en `customer_id`?",
    "code": "SELECT * FROM orders WHERE customer_id = 42;",
    "options": [
      "La tabla debe tener menos de 1.000 filas",
      "Debe existir un índice en la columna `customer_id`",
      "`customer_id` debe ser la primera columna definida en la tabla",
      "La consulta debe incluir `LIMIT 1`"
    ],
    "correctIndex": 1,
    "explanation": "El optimizador de consultas solo puede utilizar un índice en `customer_id` si dicho índice ha sido creado; de lo contrario, recurrirá a un escaneo secuencial.",
    "compiledJS": "-- Before index: Seq Scan\nEXPLAIN SELECT * FROM orders WHERE customer_id = 42;\n-- Seq Scan on orders (cost=0.00..18450.00 rows=10 width=72)\n\n-- Create the index\nCREATE INDEX idx_orders_customer_id ON orders (customer_id);\n\n-- After index: Index Scan\nEXPLAIN SELECT * FROM orders WHERE customer_id = 42;\n-- Index Scan using idx_orders_customer_id on orders\n--   Index Cond: (customer_id = 42)",
    "bestPractice": "After creating an index, always run ANALYZE on the table to refresh statistics, then re-run EXPLAIN to confirm the planner adopts the new path. In staging environments with small datasets the planner may still prefer a seq scan because the cost model shows the table fits in shared_buffers — test with production-scale data.",
    "source": "PostgreSQL Docs — Chapter 11.1: Introduction"
  },
  {
    "id": "b06",
    "topic": "Unique Index",
    "question": "¿Qué garantiza un índice UNIQUE?",
    "code": null,
    "options": [
      "Que la columna indexada nunca sea NULL",
      "Que no existan dos filas con el mismo valor en la(s) columna(s) indexada(s)",
      "Que el índice se almacene en un tablespace separado de los datos de la tabla",
      "Que las consultas SELECT sobre esa columna siempre devuelvan resultados ordenados"
    ],
    "correctIndex": 1,
    "explanation": "Un índice UNIQUE impone una restricción de unicidad: la base de datos rechaza cualquier INSERT o UPDATE que genere un valor duplicado en la(s) columna(s) indexada(s).",
    "compiledJS": "CREATE UNIQUE INDEX uq_users_email ON users (email);\n\n-- This INSERT succeeds:\nINSERT INTO users (email) VALUES ('a@example.com');\n\n-- This INSERT fails with a duplicate key violation:\nINSERT INTO users (email) VALUES ('a@example.com');\n-- ERROR: duplicate key value violates unique constraint \"uq_users_email\"\n-- DETAIL:  Key (email)=(a@example.com) already exists.\n\n-- NULL is allowed multiple times (PostgreSQL behaviour):\nINSERT INTO users (email) VALUES (NULL);  -- succeeds\nINSERT INTO users (email) VALUES (NULL);  -- also succeeds",
    "bestPractice": "Prefer UNIQUE constraints (ALTER TABLE … ADD CONSTRAINT … UNIQUE) over standalone UNIQUE indexes when the goal is integrity enforcement — they are semantically clearer and the planner treats them identically. Use a standalone UNIQUE index when you need partial uniqueness (e.g., UNIQUE WHERE deleted_at IS NULL) which constraints cannot express.",
    "source": "PostgreSQL Docs — Chapter 11.6: Unique Indexes"
  },
  {
    "id": "b07",
    "topic": "EXPLAIN Output",
    "question": "En PostgreSQL, ¿qué muestra el comando `EXPLAIN`?",
    "code": "EXPLAIN SELECT * FROM orders WHERE customer_id = 42;",
    "options": [
      "El texto SQL reescrito tras aplicar reglas y sustituciones de vistas",
      "El árbol de ejecución con nodos de operación, costos y filas estimadas",
      "Un informe con todos los índices y restricciones configurados en la tabla",
      "El tiempo total transcurrido y la tasa de CPU consumida por la consulta"
    ],
    "correctIndex": 1,
    "explanation": "`EXPLAIN` genera el árbol del plan de ejecución elegido por el optimizador con estimaciones de costo; `EXPLAIN ANALYZE` además ejecuta la consulta y reporta los tiempos reales medidos.",
    "compiledJS": "EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;\n/*\nIndex Scan using idx_orders_customer_id on orders\n  (cost=0.43..8.45 rows=1 width=72)\n  (actual time=0.041..0.044 rows=1 loops=1)\n  Index Cond: (customer_id = 42)\nBuffers: shared hit=3\nPlanning Time: 0.128 ms\nExecution Time: 0.063 ms\n*/\n-- \"cost=startup..total\"  — planner estimates in arbitrary cost units\n-- \"rows=1\"               — estimated vs actual row count\n-- \"Buffers: shared hit\"  — pages served from shared_buffers (no disk I/O)",
    "bestPractice": "Always use EXPLAIN (ANALYZE, BUFFERS) — the BUFFERS option reveals whether pages were served from cache (shared hit) or disk (read), which is critical for diagnosing I/O bottlenecks. In production use EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) and pipe the output to a visualizer like explain.dalibo.com for complex multi-join plans.",
    "source": "PostgreSQL Docs — Chapter 14.1: Using EXPLAIN"
  },
  {
    "id": "b08",
    "topic": "Clustered Index",
    "question": "¿Cuál es la diferencia clave entre un índice clusterizado (agrupado) y uno no clusterizado?",
    "code": null,
    "options": [
      "Agrupado ordena filas en disco; no agrupado almacena punteros de datos",
      "Agrupado admite una columna; no agrupado admite múltiples columnas útiles",
      "Agrupado requiere memoria RAM; no agrupado vive en el disco de datos físico",
      "Agrupado sirve para joins; no agrupado solo para operaciones de agregación"
    ],
    "correctIndex": 0,
    "explanation": "Un índice clusterizado ordena físicamente las filas (o almacena los datos en el nivel hoja del propio índice), por lo que los escaneos por rango son muy rápidos; un índice no clusterizado es una estructura independiente que almacena valores de clave y punteros de ubicación.",
    "compiledJS": "-- In PostgreSQL, physically reorder heap pages to match an index (one-time)\nCLUSTER orders USING idx_orders_created_at;\n\n-- Verify row correlation (1.0 = perfectly correlated, 0 = random)\nSELECT attname, correlation\nFROM pg_stats\nWHERE tablename = 'orders' AND attname = 'created_at';\n-- correlation: 0.9998 → range scans on created_at benefit greatly",
    "bestPractice": "PostgreSQL does not maintain clustering automatically — run CLUSTER periodically on tables with high range-scan workloads (e.g., time-series tables queried by date range). For new tables use BRIN indexes instead of CLUSTER when physical ordering is naturally preserved (append-only inserts), as BRIN is far cheaper to maintain.",
    "source": "PostgreSQL Docs — Chapter 11.10: Use of Indexes; Use The Index, Luke — Clustered Indexes"
  },
  {
    "id": "b09",
    "topic": "Low-Cardinality Columns",
    "question": "¿Por qué los índices en columnas de baja cardinalidad (por ejemplo, un booleano `is_active`) suelen ser ineficaces?",
    "code": null,
    "options": [
      "Índices B-Tree no se pueden construir sobre columnas con tipos booleanos",
      "Pocos valores distintos hacen que el escaneo toque casi toda la tabla",
      "Índices de baja cardinalidad son descartados automáticamente por el motor",
      "Columnas booleanas requieren motores columnares ausentes en PostgreSQL"
    ],
    "correctIndex": 1,
    "explanation": "Con pocos valores distintos, cada valor abarca una proporción elevada de las filas; el costo de I/O aleatorio al consultar el índice suele superar el costo de un escaneo secuencial.",
    "compiledJS": "-- Low-cardinality index is often ignored by the planner:\nCREATE INDEX idx_users_is_active ON users (is_active);\n\nEXPLAIN SELECT * FROM users WHERE is_active = true;\n-- Seq Scan on users  (cost=0.00..24500.00 rows=950000 width=88)\n-- Index ignored because ~95% of rows are active.\n\n-- Better: partial index only on the interesting minority\nCREATE INDEX idx_users_inactive ON users (id)\nWHERE is_active = false;\n\nEXPLAIN SELECT * FROM users WHERE is_active = false;\n-- Index Scan using idx_users_inactive on users",
    "bestPractice": "Replace a full index on a low-cardinality column with a partial index covering only the rare/interesting subset of rows (e.g., WHERE status = 'pending' for a queue table where pending rows are a small minority). The partial index is smaller, faster to scan, and cheaper to maintain than a full index the planner would usually ignore.",
    "source": "Use The Index, Luke — Index Selectivity; PostgreSQL Docs — Chapter 11.8: Partial Indexes"
  },
  {
    "id": "b10",
    "topic": "Index Maintenance on DML",
    "question": "¿Qué ocurre con un índice cuando se actualiza la columna indexada de una fila?",
    "code": null,
    "options": [
      "Nada — las actualizaciones de índice ocurren durante el siguiente VACUUM",
      "La entrada antigua del índice se elimina y se inserta una nueva clave",
      "El índice entero se reconstruye desde cero de forma asíncrona por motor",
      "El nodo correspondiente se marca como inválido hasta la próxima lectura"
    ],
    "correctIndex": 1,
    "explanation": "Actualizar una columna indexada hace que el motor elimine la entrada antigua e inserte una nueva, razón por la cual cargas de trabajo intensas en UPDATE sobre columnas indexadas provocan amplificación de escritura.",
    "compiledJS": "-- Before UPDATE: index has entry key=100 → TID(0,1)\nUPDATE orders SET customer_id = 200 WHERE id = 1;\n\n-- After UPDATE (MVCC):\n--   Heap: old tuple TID(0,1) xmax=txid (dead), new tuple TID(0,2) xmin=txid\n--   Index: old entry customer_id=100 → TID(0,1) [dead, awaiting VACUUM]\n--          new entry customer_id=200 → TID(0,2) [live]\n\n-- View dead tuple accumulation:\nSELECT n_dead_tup, n_live_tup\nFROM pg_stat_user_tables WHERE relname = 'orders';",
    "bestPractice": "Minimize indexes on columns that are frequently updated (status fields, counters, timestamps). If you must index such a column, enable autovacuum aggressively (lower autovacuum_vacuum_scale_factor) to reclaim dead entries before index bloat degrades performance. Consider HOT (Heap Only Tuple) updates — PostgreSQL uses them automatically when no indexed column changes, avoiding index writes entirely.",
    "source": "PostgreSQL Docs — Chapter 24.1: Routine Vacuuming; DDIA — Chapter 3: Update-in-place vs append-only"
  },
  {
    "id": "i01",
    "topic": "B-Tree Traversal",
    "question": "Al recorrer un índice en árbol B para encontrar el valor de una clave, ¿cuál es la complejidad temporal de la búsqueda?",
    "code": null,
    "options": [
      "O(n): lineal respecto al número de filas",
      "O(log n): logarítmica respecto al número de filas",
      "O(1): tiempo constante sin importar el tamaño de la tabla",
      "O(n²): cuadrática respecto al número de filas"
    ],
    "correctIndex": 1,
    "explanation": "Un árbol B es una estructura balanceada; cada nivel reduce a la mitad el espacio de búsqueda, por lo que encontrar una clave requiere a lo sumo O(log n) lecturas de nodos.",
    "compiledJS": "-- Visualise B-Tree depth for a large table\nSELECT\n  level,\n  count(*) AS pages_at_level\nFROM bt_page_stats('idx_orders_customer_id', generate_series(1,5))  -- pgstattuple extension\nGROUP BY level ORDER BY level;\n\n-- Practical depth check via pageinspect extension\nSELECT type, live_items, avg_item_size\nFROM bt_page_stats('idx_orders_customer_id', 1);\n-- root page → internal pages → leaf pages\n-- For 10M rows with 4-byte keys, depth ≈ 3–4 levels",
    "bestPractice": "B-Tree's O(log n) complexity means indexes remain fast as tables grow to hundreds of millions of rows — but only if the tree stays balanced and the upper levels stay cached. Monitor shared_buffers hit ratio for critical indexes. If the root and upper internal pages are not cached, each query incurs extra disk reads. Size shared_buffers so hot index pages stay resident.",
    "source": "DDIA — Chapter 3: B-Trees; PostgreSQL Docs — Chapter 67: B-Tree Indexes"
  },
  {
    "id": "i02",
    "topic": "Hash Index vs B-Tree",
    "question": "¿Qué afirmación contrasta correctamente un índice hash con un índice en árbol B?",
    "code": null,
    "options": [
      "Índices hash operan en rangos; B-Trees atienden solo búsquedas puntuales",
      "Índices hash dan O(1) en igualdad sin rangos; B-Trees soportan ambos",
      "Índices hash ordenan claves físicamente para acelerar filtros de rango",
      "Índices hash y B-Tree tienen curvas de rendimiento idénticas en consultas"
    ],
    "correctIndex": 1,
    "explanation": "Los índices hash agrupan valores mediante funciones hash, logrando búsquedas por igualdad en O(1), pero el hash destruye el orden, impidiendo atender predicados de rango u operaciones de ordenamiento.",
    "compiledJS": "-- Create a hash index for pure equality workloads\nCREATE INDEX idx_sessions_token_hash ON sessions USING HASH (token);\n\n-- Works: O(1) equality\nEXPLAIN SELECT * FROM sessions WHERE token = 'abc123';\n-- Index Scan using idx_sessions_token_hash on sessions\n\n-- Does NOT work: range predicates fall back to Seq Scan\nEXPLAIN SELECT * FROM sessions WHERE token > 'abc123';\n-- Seq Scan on sessions (hash index cannot satisfy range)",
    "bestPractice": "Use hash indexes for UUID or token lookups where you only ever use = equality and the column has very high cardinality. Stick with B-Tree (the default) for everything else — B-Tree handles equality, ranges, ORDER BY, and prefix LIKE patterns with a single structure. The O(1) vs O(log n) difference rarely matters in practice since B-Tree upper levels are typically cache-resident.",
    "source": "PostgreSQL Docs — Chapter 11.2: Index Types; Use The Index, Luke — Hash Indexes"
  },
  {
    "id": "i03",
    "topic": "Composite Index",
    "question": "Dado un índice compuesto en `(last_name, first_name)`, ¿cuál cláusula WHERE puede utilizar el índice de manera eficiente?",
    "code": "CREATE INDEX idx_name ON users (last_name, first_name);",
    "options": [
      "`WHERE first_name = 'Alice'` (omitiendo `last_name`)",
      "`WHERE last_name = 'Smith'`",
      "`WHERE first_name = 'Alice' AND last_name = 'Smith'`: solo cuando aparecen ambas columnas",
      "Ninguna columna puede usar el índice a menos que la consulta incluya todas las columnas indexadas"
    ],
    "correctIndex": 1,
    "explanation": "Un índice compuesto en árbol B se ordena primero por la columna situada más a la izquierda; las consultas que filtran por `last_name` (columna principal) pueden buscar en el índice, pero filtros únicamente en `first_name` no pueden.",
    "compiledJS": "-- Efficient: uses leading column\nEXPLAIN SELECT * FROM users WHERE last_name = 'Smith';\n-- Index Scan using idx_name on users\n--   Index Cond: ((last_name)::text = 'Smith'::text)\n\n-- Efficient: uses both columns\nEXPLAIN SELECT * FROM users WHERE last_name = 'Smith' AND first_name = 'Alice';\n-- Index Scan using idx_name on users\n--   Index Cond: (last_name = 'Smith' AND first_name = 'Alice')\n\n-- Inefficient: skips leading column — full index scan or seq scan\nEXPLAIN SELECT * FROM users WHERE first_name = 'Alice';\n-- Seq Scan on users  (leading column not filtered)",
    "bestPractice": "Order composite index columns from most-selective / most-frequently-filtered to least. Put equality-filtered columns before range-filtered columns — range predicates on an intermediate column break the leading-column prefix and prevent further index key narrowing. When unsure, create the index in the order WHERE conditions appear in your most critical query.",
    "source": "Use The Index, Luke — The Column Order of a Composite Index; PostgreSQL Docs — Chapter 11.3: Multicolumn Indexes"
  },
  {
    "id": "i04",
    "topic": "Covering Index",
    "question": "¿Qué es un índice de cobertura (covering index)?",
    "code": null,
    "options": [
      "Un índice que incluye automáticamente todas las columnas de la tabla para eliminar el uso de almacenamiento en heap",
      "Un índice que contiene todas las columnas exigidas por la consulta, respondiendo sin acceder a la heap de la tabla",
      "Un índice dinámico que detecta consultas lentas y añade columnas a su estructura B-Tree durante la ejecución",
      "Un índice agrupado que reorganiza el orden físico de las filas en disco para evitar lecturas aleatorias en rangos"
    ],
    "correctIndex": 1,
    "explanation": "Cuando un índice incluye todas las columnas requeridas por una consulta (en la clave o mediante cláusula INCLUDE), la base de datos resuelve la consulta directamente desde las páginas del índice, eliminando accesos adicionales a la heap.",
    "compiledJS": "-- Covering index with INCLUDE for non-key payload columns\nCREATE INDEX idx_orders_covering\n  ON orders (customer_id)\n  INCLUDE (amount, created_at);\n\n-- Index-Only Scan: zero heap fetches\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT customer_id, amount, created_at\nFROM orders\nWHERE customer_id = 42;\n/*\nIndex Only Scan using idx_orders_covering on orders\n  (cost=0.43..4.45 rows=1 width=20)\n  (actual time=0.018..0.021 rows=1 loops=1)\n  Heap Fetches: 0    ← no heap access\n*/",
    "bestPractice": "Use INCLUDE to add frequently SELECTed columns without widening the index key. Avoid including too many columns — wide covering indexes consume more memory in shared_buffers and slow down writes. Identify the 2–3 most common SELECT patterns on a hot table and build a targeted covering index for each rather than one giant index.",
    "source": "PostgreSQL Docs — Chapter 11.9: Index-Only Scans and Covering Indexes"
  },
  {
    "id": "i05",
    "topic": "Index Selectivity",
    "question": "¿Qué es la selectividad de un índice y por qué es importante para el optimizador de consultas?",
    "code": null,
    "options": [
      "El total de bloques de disco del índice; tamaños mayores leen más rápido",
      "La proporción de valores distintos por fila; alta selectividad ayuda al uso",
      "La condición de si el índice fue creado sobre una columna de clave primaria",
      "El porcentaje histórico de consultas SELECT que filtran por la columna clave"
    ],
    "correctIndex": 1,
    "explanation": "Una alta selectividad (cercana a 1.0) indica que cada valor de clave identifica muy pocas filas, acotando eficientemente el conjunto de resultados; una baja selectividad produce muchas filas por clave y el optimizador puede optar por un escaneo secuencial.",
    "compiledJS": "-- Inspect selectivity statistics for a column\nSELECT\n  attname,\n  n_distinct,\n  correlation,\n  most_common_vals,\n  most_common_freqs\nFROM pg_stats\nWHERE tablename = 'orders' AND attname = 'customer_id';\n/*\nattname     | customer_id\nn_distinct  | 50000        -- 50k distinct customers\ncorrelation | 0.0023       -- values are randomly distributed in heap\nmost_common_vals  | {42,17,99,...}\nmost_common_freqs | {0.0001,...}  -- each customer ≈ 0.01% of rows → high selectivity\n*/",
    "bestPractice": "Run ANALYZE regularly (autovacuum handles this, but run it manually after bulk loads) so the planner has accurate statistics. For skewed distributions — where a few values appear very frequently — use CREATE STATISTICS to build extended statistics on column correlations. Use pg_stats.most_common_freqs to identify low-selectivity values that will trigger seq scans even with an index.",
    "source": "PostgreSQL Docs — Chapter 14.2: Statistics Used by the Planner; Use The Index, Luke — Index Selectivity"
  },
  {
    "id": "i06",
    "topic": "Partial Index",
    "question": "¿Qué es un índice parcial en PostgreSQL?",
    "code": null,
    "options": [
      "Un índice creado sobre los primeros bytes de campos de texto largos",
      "Un índice que incluye solo filas que cumplen un predicado WHERE",
      "Un índice que cubre solo la primera columna de una clave compuesta",
      "Un índice generado en tiempo de ejecución para una única consulta"
    ],
    "correctIndex": 1,
    "explanation": "Un índice parcial se crea con una cláusula WHERE (por ejemplo, `CREATE INDEX ... WHERE status = 'active'`), por lo que indexa solo las filas coincidentes, reduciendo el tamaño del archivo y el costo de mantenimiento.",
    "compiledJS": "-- Full index on status: large, mostly unused for rare values\n-- CREATE INDEX idx_orders_status ON orders (status);\n\n-- Partial index: only index pending orders (1% of table)\nCREATE INDEX idx_orders_pending\n  ON orders (created_at)\nWHERE status = 'pending';\n\n-- Planner uses the partial index:\nEXPLAIN SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at;\n/*\nIndex Scan using idx_orders_pending on orders\n  (cost=0.43..320.00 rows=500 width=72)\n-- Tiny index, very fast\n*/\n\n-- Query WITHOUT status = 'pending' cannot use this index:\nEXPLAIN SELECT * FROM orders WHERE status = 'shipped' ORDER BY created_at;\n-- Seq Scan (partial index predicate not satisfied)",
    "bestPractice": "Partial indexes are one of the highest-leverage optimizations available: they can reduce index size by 10–100x for skewed distributions, dramatically improve write throughput on the indexed table, and keep the working set in shared_buffers small. Use them liberally for queue-pattern tables, soft-delete patterns, and any column with a \"hot minority\" of rows.",
    "source": "PostgreSQL Docs — Chapter 11.8: Partial Indexes"
  },
  {
    "id": "i07",
    "topic": "Function-Based Index",
    "question": "¿Qué es un índice basado en funciones (o de expresiones)?",
    "code": null,
    "options": [
      "Un índice definido como procedimiento almacenado reconstruido de noche",
      "Un índice sobre expresiones o funciones que acelera búsquedas calculadas",
      "Un índice que activa funciones trigger ante cualquier mutación de fila",
      "Un índice que calcula hashes criptográficos para proteger los registros"
    ],
    "correctIndex": 1,
    "explanation": "Un índice basado en funciones (por ejemplo, `CREATE INDEX ON users (lower(email))`) almacena el resultado precalculado de la función, permitiendo que consultas como `WHERE lower(email) = '...'` usen el índice en lugar de escanear toda la tabla.",
    "compiledJS": "-- Case-insensitive email lookup without function index: Seq Scan\nEXPLAIN SELECT * FROM users WHERE lower(email) = 'alice@example.com';\n-- Seq Scan (function computed per row)\n\n-- Create expression index\nCREATE INDEX idx_users_lower_email ON users (lower(email));\n\n-- Now uses the index:\nEXPLAIN SELECT * FROM users WHERE lower(email) = 'alice@example.com';\n/*\nIndex Scan using idx_users_lower_email on users\n  (cost=0.43..8.45 rows=1 width=88)\n  Index Cond: (lower(email) = 'alice@example.com'::text)\n*/",
    "bestPractice": "Expression indexes are powerful but add write overhead because the expression is re-evaluated on every INSERT/UPDATE to the indexed column. Ensure the expression is truly IMMUTABLE. For JSON columns, prefer generated columns (GENERATED ALWAYS AS (payload->'field') STORED) combined with a regular index — this separates the expression cost from the index maintenance path and makes the computed value queryable without the expression syntax.",
    "source": "PostgreSQL Docs — Chapter 11.7: Indexes on Expressions"
  },
  {
    "id": "i08",
    "topic": "VACUUM",
    "question": "¿Qué es la hinchazón de índices (index bloat) y cómo ayuda VACUUM en PostgreSQL?",
    "code": null,
    "options": [
      "Bloat es exceso de columnas en el índice; VACUUM elimina columnas sobrantes",
      "Bloat son páginas con tuplas muertas de updates; VACUUM libera espacio reusable",
      "Bloat ocurre cuando el índice supera a la tabla; VACUUM comprime sus bloques",
      "Bloat surge de conexiones concurrentes; VACUUM reinicia pools de conexión"
    ],
    "correctIndex": 1,
    "explanation": "El modelo MVCC de PostgreSQL genera versiones de tuplas muertas en la heap y entradas antiguas en los índices; VACUUM remueve esas entradas muertas, liberando espacio y manteniendo el índice optimizado.",
    "compiledJS": "-- Check index bloat using pgstattuple extension\nSELECT\n  index_name,\n  index_size,\n  leaf_pages,\n  dead_leaf_pages,\n  round(dead_leaf_pages::numeric / leaf_pages * 100, 2) AS bloat_pct\nFROM (\n  SELECT\n    indexrelid::regclass AS index_name,\n    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,\n    (pgstatindex(indexrelid::regclass)).leaf_pages,\n    (pgstatindex(indexrelid::regclass)).deleted_pages AS dead_leaf_pages\n  FROM pg_index\n  WHERE indrelid = 'orders'::regclass\n) t;\n\n-- Force rebuild if bloat > 30%\nREINDEX INDEX CONCURRENTLY idx_orders_customer_id;",
    "bestPractice": "Configure autovacuum aggressively for hot tables: set autovacuum_vacuum_scale_factor = 0.01 (1% dead tuples triggers vacuum) rather than the default 20%. Monitor pg_stat_user_tables.n_dead_tup and pg_stat_user_tables.last_autovacuum. For indexes with >20% bloat despite regular autovacuum, run REINDEX CONCURRENTLY during a low-traffic window to rebuild without locking the table.",
    "source": "PostgreSQL Docs — Chapter 24.1: Routine Vacuuming; DDIA — Chapter 3: B-Tree compaction"
  },
  {
    "id": "i09",
    "topic": "Planner Ignoring Index",
    "question": "¿Por qué el optimizador de consultas de PostgreSQL podría ignorar un índice aunque exista en la columna filtrada?",
    "code": null,
    "options": [
      "El motor de base de datos nunca ignora un índice activo — siempre lo utiliza",
      "El planificador estima que el escaneo secuencial es más barato por volumen",
      "El índice solo puede usarse si la consulta incluye un orden ORDER BY explícito",
      "Índices B-Tree solo se evalúan en cláusulas JOIN, nunca en filtros WHERE de filas"
    ],
    "correctIndex": 1,
    "explanation": "El optimizador evalúa costos estimados: si las estadísticas sugieren que la mayoría de las filas cumplen el predicado, el I/O aleatorio del índice es más costoso que una lectura secuencial, por lo que se descarta el índice.",
    "compiledJS": "-- Statistics show why the planner ignores an index\nSELECT\n  tablename, attname,\n  n_distinct,\n  most_common_vals,\n  most_common_freqs[1] AS top_val_freq\nFROM pg_stats\nWHERE tablename = 'orders' AND attname = 'status';\n/*\ntop_val_freq = 0.92  → 92% of rows have status='completed'\nPlanner correctly skips index for WHERE status = 'completed'\n*/\n\n-- Force statistics update after bulk data change\nANALYZE orders;\n\n-- Temporarily disable seq scan to test what index scan costs\nSET enable_seqscan = off;\nEXPLAIN SELECT * FROM orders WHERE status = 'completed';\nRESET enable_seqscan;",
    "bestPractice": "Before concluding an index is \"broken,\" verify statistics freshness with SELECT last_analyze FROM pg_stat_user_tables. Run ANALYZE and re-check the plan. If the planner still ignores the index and you are confident it should be used, investigate whether the query predicate can be rewritten, whether a partial index would improve selectivity, or whether the random_page_cost GUC needs tuning for your storage type (SSDs warrant lower values like 1.1 vs the default 4.0).",
    "source": "PostgreSQL Docs — Chapter 14.3: Controlling the Planner with Explicit JOIN Clauses; Use The Index, Luke — When the Planner Ignores Indexes"
  },
  {
    "id": "i10",
    "topic": "LIKE and Index Usage",
    "question": "Dado un índice en árbol B en una columna `name`, ¿qué patrón LIKE puede utilizar el índice?",
    "code": "CREATE INDEX idx_users_name ON users (name);",
    "options": [
      "`WHERE name LIKE '%smith'` (comodín como sufijo)",
      "`WHERE name LIKE '%smith%'` (comodines en ambos extremos)",
      "`WHERE name LIKE 'smith%'` (comodín como prefijo)",
      "Ninguno: LIKE nunca utiliza un índice en árbol B"
    ],
    "correctIndex": 2,
    "explanation": "Un índice en árbol B se encuentra ordenado lexicográficamente; una búsqueda por prefijo (`'smith%'`) equivale a un escaneo por rango en el índice, mientras que un comodín inicial impide conocer el prefijo común obligando a un escaneo completo.",
    "compiledJS": "-- Works with prefix wildcard (requires C collation or text_pattern_ops)\nCREATE INDEX idx_users_name_pattern\n  ON users (name text_pattern_ops);\n\nEXPLAIN SELECT * FROM users WHERE name LIKE 'smith%';\n/*\nIndex Scan using idx_users_name_pattern on users\n  Index Cond: ((name ~>=~ 'smith'::text) AND (name ~<~ 'smitI'::text))\n*/\n\n-- Does NOT use index (leading wildcard)\nEXPLAIN SELECT * FROM users WHERE name LIKE '%smith';\n-- Seq Scan on users  Filter: ((name)::text ~~ '%smith'::text)\n\n-- For suffix/substring searches use pg_trgm + GIN index instead:\nCREATE INDEX idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);\nEXPLAIN SELECT * FROM users WHERE name LIKE '%smith%';\n-- Bitmap Index Scan using idx_users_name_trgm",
    "bestPractice": "For suffix or substring LIKE patterns, install the pg_trgm extension and create a GIN index with gin_trgm_ops — it supports arbitrary LIKE/ILIKE patterns including leading wildcards. For full-text search on prose, use tsvector + GIN. Avoid leading wildcards in B-Tree columns entirely; redesign queries to use trigram or full-text indexes or rewrite to prefix scans where possible.",
    "source": "PostgreSQL Docs — Chapter 11.5: Operator Classes and Operator Families; Use The Index, Luke — Wildcard LIKE"
  },
  {
    "id": "a01",
    "topic": "GiST / GIN / BRIN",
    "question": "¿Qué tipo de índice de PostgreSQL está diseñado para tipos de datos geométricos y espaciales como puntos, cajas y polígonos?",
    "code": null,
    "options": [
      "GIN (Generalized Inverted Index)",
      "BRIN (Block Range INdex)",
      "GiST (Generalized Search Tree)",
      "SPGIST (Space-Partitioned GiST)"
    ],
    "correctIndex": 2,
    "explanation": "GiST es un framework de indexación extensible que admite tipos de datos no escalares, incluidas figuras geométricas, búsqueda de texto completo con `tsvector` y rangos, facilitando consultas de contención y solapamiento.",
    "compiledJS": "-- GiST index for 2D point nearest-neighbour search\nCREATE INDEX idx_locations_point\n  ON locations USING GIST (coordinates);\n\n-- KNN query using GiST index\nEXPLAIN SELECT name, coordinates\nFROM locations\nORDER BY coordinates <-> point(40.7128, -74.0060)  -- distance to NYC\nLIMIT 10;\n/*\nLimit  (rows=10)\n  ->  Index Scan using idx_locations_point on locations\n        Order By: (coordinates <-> '(40.7128,-74.006)'::point)\n-- GiST enables ORDER BY distance without a seq scan\n*/\n\n-- Range type overlap query\nCREATE INDEX idx_reservations_period\n  ON reservations USING GIST (period);\nSELECT * FROM reservations WHERE period && '[2024-01-01,2024-01-07)';",
    "bestPractice": "Choose the index type based on the operators your queries use: GiST for spatial/range/overlap, GIN for array containment/full-text search, BRIN for append-only time-series, B-Tree for everything else. Install PostGIS for production geospatial workloads — it provides optimised GiST operator classes and spatial functions far beyond the built-in geometric types.",
    "source": "PostgreSQL Docs — Chapter 11.2: Index Types; PostgreSQL Docs — Chapter 68: GiST Indexes"
  },
  {
    "id": "a02",
    "topic": "Full-Text GIN Index",
    "question": "¿Para qué tipo de columna resulta más apropiado un índice GIN (Generalized Inverted Index)?",
    "code": null,
    "options": [
      "Una clave primaria entera autoincrementable",
      "Columnas compuestas como arrays, JSONB o tsvector",
      "Un timestamp estrictamente creciente en tablas",
      "Una bandera booleana de estado de baja cardinalidad"
    ],
    "correctIndex": 1,
    "explanation": "GIN genera un índice invertido sobre los elementos individuales de valores compuestos (elementos de array, claves JSON, lexemas), haciéndolo ideal para operadores de contención como `@>` o búsquedas de texto con `@@`.",
    "compiledJS": "-- Full-text search with GIN index\nALTER TABLE articles ADD COLUMN search_vector tsvector\n  GENERATED ALWAYS AS (\n    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,''))\n  ) STORED;\n\nCREATE INDEX idx_articles_fts ON articles USING GIN (search_vector);\n\n-- Full-text search query\nEXPLAIN SELECT id, title FROM articles\nWHERE search_vector @@ to_tsquery('english', 'database & index');\n/*\nBitmap Index Scan using idx_articles_fts on articles\n  Recheck Cond: (search_vector @@ to_tsquery('english', 'database & index'))\n*/\n\n-- JSONB containment with GIN\nCREATE INDEX idx_events_payload ON events USING GIN (payload);\nSELECT * FROM events WHERE payload @> '{\"type\": \"click\"}';",
    "bestPractice": "GIN indexes are fast for reads but slow to update because each element maps to a potentially large posting list. Use the fastupdate GIN storage parameter (on by default) which batches pending insertions in a list and merges them lazily. For real-time insert-heavy full-text workloads, consider GiST with tsvector — GiST updates faster but queries slightly slower than GIN.",
    "source": "PostgreSQL Docs — Chapter 70: GIN Indexes"
  },
  {
    "id": "a03",
    "topic": "LSM-Tree",
    "question": "¿Qué es la 'amplificación de escritura' (write amplification) en el contexto de índices LSM-tree (Log-Structured Merge-tree)?",
    "code": null,
    "options": [
      "Cada escritura lógica se escribe físicamente múltiples veces en diferentes niveles del árbol LSM durante la compactación",
      "La base de datos escribe una copia redundante de cada fila en el registro de transacciones",
      "La sobrecarga generada al actualizar los nodos padre de un árbol B tras la división de una hoja (leaf split)",
      "La latencia adicional producida al vaciar el write-ahead log al disco"
    ],
    "correctIndex": 0,
    "explanation": "En los árboles LSM, los datos avanzan por varios niveles (L0 a L1 hasta Ln) mediante compactación; una sola clave lógica puede reescribirse muchas veces, por lo que la relación entre bytes físicos y bytes lógicos constituye el factor de amplificación de escritura.",
    "compiledJS": "-- RocksDB / Cassandra style LSM write flow (conceptual SQL analogy)\n\n-- Level 0: recent writes (unsorted, overlapping key ranges)\n-- L0: [SSTable-a: keys 1-100], [SSTable-b: keys 50-200]  ← written fast\n\n-- Compaction merges L0 into L1 (sorted, non-overlapping)\n-- L1: [keys 1-49], [keys 50-100], [keys 101-200]\n-- Each key rewritten once more → write amplification ×2\n\n-- L1 eventually compacts into L2 → each key rewritten again\n-- A key written once may be physically written 10-30× total\n\n-- Monitor write amplification in RocksDB:\n-- db.GetProperty(\"rocksdb.stats\")\n-- Look for: \"Write Amplification\" metric\n\n-- In PostgreSQL: WAL + heap + N index pages = write amplification\n-- Every UPDATE writes: 1 WAL record + 1 heap page + N index pages",
    "bestPractice": "LSM trees optimise for write throughput at the cost of read amplification (must search multiple SSTables) and write amplification (compaction). Choose LSM-based storage (Cassandra, RocksDB) for append-heavy, write-intensive workloads. Tune the level size ratio and compaction strategy (Leveled vs Size-Tiered) to balance write vs read amplification. Monitor compaction I/O — excessive compaction can saturate disk bandwidth and starve foreground reads.",
    "source": "DDIA — Chapter 3: SSTables and LSM-Trees; RocksDB Wiki — Write Amplification"
  },
  {
    "id": "a04",
    "topic": "CREATE INDEX CONCURRENTLY",
    "question": "¿Cuál es el propósito de `CREATE INDEX CONCURRENTLY` en PostgreSQL?",
    "code": "CREATE INDEX CONCURRENTLY idx_orders_customer_id\nON orders (customer_id);",
    "options": [
      "Construye el índice en todos los núcleos de CPU en paralelo para reducir el tiempo de creación de páginas B-Tree",
      "Construye el índice sin adquirir bloqueo exclusivo de escritura en la tabla, permitiendo lecturas y escrituras",
      "Genera la estructura en una réplica de lectura antes de promoverla a principal, ahorrando I/O en el nodo primario",
      "Pospone la validación de unicidad hasta el commit final de la transacción, priorizando la tasa de carga masiva"
    ],
    "correctIndex": 1,
    "explanation": "`CREATE INDEX CONCURRENTLY` realiza múltiples pasadas sobre la tabla y solo retiene bloqueos breves, permitiendo el acceso total para lecturas y escrituras durante la creación, algo indispensable en producción.",
    "compiledJS": "-- Safe for production: no write blocking\nCREATE INDEX CONCURRENTLY idx_orders_customer_id\n  ON orders (customer_id);\n\n-- Monitor build progress (PostgreSQL 12+)\nSELECT\n  phase,\n  blocks_done,\n  blocks_total,\n  round(blocks_done::numeric / nullif(blocks_total,0) * 100, 1) AS pct_done\nFROM pg_stat_progress_create_index\nWHERE relid = 'orders'::regclass;\n\n-- If the build fails mid-way, an INVALID index remains:\nSELECT indexname, indisvalid\nFROM pg_indexes\nJOIN pg_index ON indexrelid = (SELECT oid FROM pg_class WHERE relname = indexname)\nWHERE tablename = 'orders';\n-- indisvalid = false → DROP INDEX CONCURRENTLY and retry",
    "bestPractice": "Always use CREATE INDEX CONCURRENTLY on production tables that receive writes. If the concurrent build fails (e.g., due to a lock timeout or connection drop), the invalid index must be dropped before retrying — it consumes space and write overhead without being usable. Wrap index creation in a deployment script that checks pg_indexes.indisvalid after creation and alerts if the index is invalid.",
    "source": "PostgreSQL Docs — Chapter 11.12: Building Indexes Concurrently"
  },
  {
    "id": "a05",
    "topic": "Invisible Index",
    "question": "¿Qué es un 'índice invisible' (soportado en MySQL 8+ y Oracle) y cuál es su caso de uso principal?",
    "code": null,
    "options": [
      "Un índice cifrado en disco para evitar inspección por administradores",
      "Un índice mantenido por el motor pero oculto del planner para probar descarte",
      "Un índice volátil en memoria RAM que nunca se persiste en disco permanente",
      "Un índice interno de catálogo oculto de las vistas estándar de metadados"
    ],
    "correctIndex": 1,
    "explanation": "Los índices invisibles siguen actualizándose con las operaciones de escritura, pero el optimizador los ignora de forma predeterminada; esto permite a los DBA simular la eliminación del índice y revisar planes de consulta antes de ejecutar un DROP INDEX.",
    "compiledJS": "-- MySQL 8+ invisible index syntax\nALTER TABLE orders ALTER INDEX idx_orders_customer_id INVISIBLE;\n\n-- Verify: optimizer ignores it\nEXPLAIN SELECT * FROM orders WHERE customer_id = 42;\n-- Full Table Scan (index is invisible to optimizer)\n\n-- Re-enable to restore original plan\nALTER TABLE orders ALTER INDEX idx_orders_customer_id VISIBLE;\n\n-- PostgreSQL equivalent: session-level index disable for testing\nSET enable_indexscan = off;\nSET enable_bitmapscan = off;\nEXPLAIN SELECT * FROM orders WHERE customer_id = 42;\n-- Seq Scan (simulates index absence)\nRESET enable_indexscan;\nRESET enable_bitmapscan;",
    "bestPractice": "Never drop an index in production without first testing the impact. Use invisible indexes (MySQL/Oracle) or session-level planner controls (PostgreSQL) to observe plan changes under real load before committing to removal. Also check pg_stat_user_indexes.idx_scan to confirm the index has zero (or near-zero) scans over a representative time window before dropping.",
    "source": "MySQL 8.0 Docs — Invisible Indexes; Use The Index, Luke — Safely Dropping Indexes"
  },
  {
    "id": "a06",
    "topic": "MVCC Dead Tuples",
    "question": "¿De qué forma contribuye el modelo MVCC (Multi-Version Concurrency Control) de PostgreSQL al fenómeno de hinchazón de índices (index bloat) con el tiempo?",
    "code": null,
    "options": [
      "MVCC comprime versiones antiguas de filas provocando fragmentación en páginas",
      "UPDATEs crean nuevas versiones; claves viejas y nuevas conviven hasta VACUUM",
      "MVCC añade IDs de transacción en cada hoja del índice, duplicando su tamaño",
      "MVCC aísla páginas de índice de modo que tuplas muertas afectan solo a la heap"
    ],
    "correctIndex": 1,
    "explanation": "Debido a que PostgreSQL nunca actualiza una fila in-place (escribe una nueva versión), el índice debe apuntar a la nueva versión mientras la entrada previa se mantiene hasta que VACUUM limpie la tupla muerta que ya no es visible.",
    "compiledJS": "-- Monitor MVCC dead tuple accumulation\nSELECT\n  relname,\n  n_live_tup,\n  n_dead_tup,\n  round(n_dead_tup::numeric / nullif(n_live_tup + n_dead_tup, 0) * 100, 2) AS dead_pct,\n  last_vacuum,\n  last_autovacuum\nFROM pg_stat_user_tables\nWHERE relname = 'orders'\nORDER BY n_dead_tup DESC;\n\n-- If dead_pct > 10% and no recent vacuum, trigger manually:\nVACUUM ANALYZE orders;\n\n-- For severe bloat, rebuild without locking:\nREINDEX TABLE CONCURRENTLY orders;",
    "bestPractice": "Tune autovacuum per-table rather than globally for hot OLTP tables. Set storage parameters at the table level: ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000). This triggers autovacuum after just 1,000 + 1% dead tuples rather than the default 50,000 + 20%. On very high-write tables, also reduce autovacuum_vacuum_cost_delay to give autovacuum more I/O bandwidth.",
    "source": "PostgreSQL Docs — Chapter 24.1: Routine Vacuuming; PostgreSQL Docs — Chapter 74: MVCC"
  },
  {
    "id": "a07",
    "topic": "Bitmap Scan",
    "question": "¿Cuándo elige el optimizador de PostgreSQL un Bitmap Index Scan en lugar de un Index Scan convencional?",
    "code": null,
    "options": [
      "Cuando la consulta devuelve una sola fila filtrada por restricción de unicidad, omitiendo lecturas en la heap",
      "Al combinar múltiples índices o leer filas en el orden físico de las páginas heap para eliminar seeks aleatorios",
      "Cuando la tabla carece de páginas heap porque los datos residen por completo en las hojas de un índice agrupado",
      "Cuando el optimizador fuerza scans de mapa de bits por considerarlos incondicionalmente superiores a búsquedas directas"
    ],
    "correctIndex": 1,
    "explanation": "Un Bitmap Index Scan almacena los TIDs correspondientes en un mapa de bits en memoria, los ordena por posición física y lee las páginas de la heap en secuencia, resultando muy eficaz para volúmenes intermedios y combinación de múltiples índices que no se pueden unificar con un escaneo común.",
    "compiledJS": "EXPLAIN ANALYZE\nSELECT * FROM orders\nWHERE customer_id = 42 OR status = 'pending';\n/*\nBitmap Heap Scan on orders\n  (cost=240.00..8500.00 rows=1200 width=72)\n  Recheck Cond: ((customer_id = 42) OR (status = 'pending'))\n  ->  BitmapOr\n        ->  Bitmap Index Scan on idx_orders_customer_id\n              Index Cond: (customer_id = 42)\n        ->  Bitmap Index Scan on idx_orders_status\n              Index Cond: (status = 'pending')\n*/\n-- Two separate indexes combined in memory before any heap access",
    "bestPractice": "The planner transitions from Index Scan → Bitmap Index Scan → Seq Scan as estimated row count increases. Understanding this continuum helps debug plan regressions: if a query suddenly switches from Index Scan to Seq Scan, the estimate likely jumped across the threshold. Use partial indexes or updated statistics to keep estimates accurate. For OR conditions spanning multiple columns, ensure each column has a dedicated index so BitmapOr can be used.",
    "source": "PostgreSQL Docs — Chapter 11.5: Combining Multiple Indexes; Use The Index, Luke — Bitmap Heap Scan"
  },
  {
    "id": "a08",
    "topic": "Partitioned Indexes",
    "question": "En una tabla particionada, ¿cuál es una consideración fundamental al crear índices para asegurar que beneficien a todas las particiones?",
    "code": null,
    "options": [
      "Índices deben crearse en la clave de partición; otras columnas no se indexan",
      "Crear índice en la tabla padre propaga la definición a todas las particiones",
      "Cada partición requiere la creación manual de un índice con nombre único local",
      "Tablas particionadas rechazan B-Trees y admiten exclusivamente tipos de BRIN"
    ],
    "correctIndex": 1,
    "explanation": "A partir de PostgreSQL 11, ejecutar `CREATE INDEX` sobre una tabla particionada genera el índice local correspondiente en cada partición y lo aplica automáticamente a nuevas particiones cuando se acoplan.",
    "compiledJS": "-- Partitioned table with automatic index propagation (PG 11+)\nCREATE TABLE orders (\n  id          BIGSERIAL,\n  created_at  TIMESTAMPTZ NOT NULL,\n  customer_id INT\n) PARTITION BY RANGE (created_at);\n\nCREATE TABLE orders_2024\n  PARTITION OF orders\n  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');\n\n-- Create index on parent → propagates to all partitions\nCREATE INDEX idx_orders_customer_id\n  ON orders (customer_id);\n\n-- Verify propagation\nSELECT indexname, tablename\nFROM pg_indexes\nWHERE tablename LIKE 'orders%' AND indexname LIKE '%customer%';\n-- idx_orders_customer_id on orders (partitioned)\n-- orders_2024_customer_id_idx on orders_2024 (local)",
    "bestPractice": "Always create indexes on the parent partitioned table, never manually on individual child partitions — this ensures future partitions are automatically covered. For UNIQUE constraints on partitioned tables the constraint must include the partition key (PG limitation). Monitor per-partition index sizes with pg_relation_size to identify hot partitions that may need dedicated tuning or partial indexes.",
    "source": "PostgreSQL Docs — Chapter 5.11: Table Partitioning; PostgreSQL Docs — Chapter 11.11: Indexes and Table Partitioning"
  },
  {
    "id": "a09",
    "topic": "BRIN Index",
    "question": "¿Qué es un índice BRIN y para qué característica de tabla es más adecuado?",
    "code": null,
    "options": [
      "Un índice de bloque con min/max para columnas ordenadas físicamente en heap",
      "Un índice balanceado diseñado para sustituir B-Trees en datos numéricos",
      "Un índice de mapa de bits hecho para acelerar lecturas aleatorias en heap",
      "Un índice binario limitado a identificadores UUID y claves primarias fijas"
    ],
    "correctIndex": 0,
    "explanation": "BRIN almacena únicamente los valores mínimo y máximo de cada bloque de páginas, por lo que es sumamente pequeño y económico de mantener; resulta óptimo cuando los valores de las columnas presentan una correlación física natural con el almacenamiento en disco.",
    "compiledJS": "-- BRIN index on append-only time-series table\nCREATE INDEX idx_events_created_brin\n  ON events USING BRIN (created_at)\n  WITH (pages_per_range = 64);  -- smaller ranges = more precision, larger index\n\n-- Check correlation (must be high for BRIN to help)\nSELECT attname, correlation\nFROM pg_stats\nWHERE tablename = 'events' AND attname = 'created_at';\n-- correlation ≈ 1.0 → BRIN works perfectly (new rows always have newer timestamps)\n\n-- Size comparison\nSELECT\n  pg_size_pretty(pg_relation_size('events')) AS table_size,\n  pg_size_pretty(pg_relation_size('idx_events_created_brin')) AS brin_size;\n-- table: 4200 MB, BRIN: 48 kB  ← orders of magnitude smaller than B-Tree",
    "bestPractice": "Use BRIN indexes on large append-only tables (event logs, IoT sensor data, financial tick data) where the indexed column is naturally correlated with insertion order (timestamps, auto-increment IDs). Replace the B-Tree on created_at/id with a BRIN — it can reduce index maintenance overhead by >99% while still enabling fast date-range queries. Do not use BRIN on OLTP tables with random writes or updates; correlation degrades quickly and the index becomes useless.",
    "source": "PostgreSQL Docs — Chapter 71: BRIN Indexes; DDIA — Chapter 3: Other Indexing Structures"
  },
  {
    "id": "a10",
    "topic": "pg_stat_user_indexes",
    "question": "¿Qué vista de sistema de PostgreSQL consultarías para obtener el recuento de escaneos de índice, escaneos secuenciales y tuplas recuperadas de índices de usuario?",
    "code": null,
    "options": [
      "`pg_indexes`",
      "`information_schema.table_constraints`",
      "`pg_stat_user_indexes`",
      "`pg_index`"
    ],
    "correctIndex": 2,
    "explanation": "La vista `pg_stat_user_indexes` expone estadísticas acumuladas por índice, tales como `idx_scan` (escaneos iniciados), `idx_tup_read` e `idx_tup_fetch`, siendo la herramienta clave para diagnosticar índices infrautilizados o de alto impacto.",
    "compiledJS": "-- Find unused indexes (idx_scan = 0 over observation window)\nSELECT\n  schemaname,\n  relname AS table_name,\n  indexrelname AS index_name,\n  idx_scan,\n  idx_tup_read,\n  idx_tup_fetch,\n  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size\nFROM pg_stat_user_indexes\nWHERE schemaname = 'public'\nORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC;\n\n-- Find write-heavy tables to identify index maintenance cost\nSELECT\n  relname,\n  n_tup_ins + n_tup_upd + n_tup_del AS total_writes,\n  pg_size_pretty(pg_total_relation_size(relid)) AS total_size\nFROM pg_stat_user_tables\nORDER BY total_writes DESC\nLIMIT 20;",
    "bestPractice": "Schedule a weekly index audit query against pg_stat_user_indexes. Any index with idx_scan = 0 over 2+ weeks and non-trivial size should be reviewed for removal. Before dropping, make the index invisible (MySQL) or use session-level disable (PostgreSQL) to confirm no plan regressions. Also cross-reference with pg_stat_user_tables.n_tup_upd to understand write cost savings from removing unused indexes on hot tables.",
    "source": "PostgreSQL Docs — Chapter 28.2: The Statistics Collector — pg_stat_user_indexes"
  }
]
