import type { InterviewQuestion } from '@/lib/interviewTypes'

export const DATABASE_INDEXING_QUESTIONS_PT: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "What is an Index",
    "question": "O que é um índice de banco de dados?",
    "code": null,
    "options": [
      "Um snapshot compactado de backup gravado em fitas secundárias",
      "Uma estrutura de dados que acelera buscas ao custo de sobrecarga na escrita",
      "Uma restrição de segurança que criptografa colunas contra ataques de injeção",
      "Um cursor temporário em memória alocado durante junções analíticas pesadas"
    ],
    "correctIndex": 1,
    "explanation": "Um índice é uma estrutura de dados auxiliar (geralmente uma árvore B) que armazena um subconjunto ordenado de valores de colunas junto a ponteiros para as linhas correspondentes na heap, permitindo que o mecanismo localize registros sem varrer a tabela inteira.",
    "compiledJS": "-- Create a standard B-Tree index on orders.customer_id\nCREATE INDEX idx_orders_customer_id\n  ON orders (customer_id);\n\n-- EXPLAIN shows Index Scan instead of Seq Scan after index creation\nEXPLAIN SELECT * FROM orders WHERE customer_id = 42;\n/*\nIndex Scan using idx_orders_customer_id on orders\n  (cost=0.43..8.45 rows=1 width=72)\n  Index Cond: (customer_id = 42)\n*/",
    "bestPractice": "Senior engineers add indexes incrementally based on slow-query logs and pg_stat_user_indexes data, not speculatively. Before adding an index, confirm the column is highly selective (many distinct values). After creation, run EXPLAIN ANALYZE to verify the planner actually uses the new index — stale statistics can cause it to be ignored until ANALYZE runs.",
    "source": "PostgreSQL Docs — Chapter 11: Indexes"
  },
  {
    "id": "b02",
    "topic": "Read vs Write Cost",
    "question": "Qual das seguintes alternativas melhor descreve o trade-off entre leitura e escrita ao adicionar um índice?",
    "code": null,
    "options": [
      "Índices aceleram leituras e escritas igualmente",
      "Índices tornam as leituras mais lentas porque o planejador precisa verificar o índice primeiro",
      "Índices aceleram as leituras, mas adicionam sobrecarga às operações de INSERT, UPDATE e DELETE",
      "Índices afetam apenas o desempenho do DELETE, não do SELECT"
    ],
    "correctIndex": 2,
    "explanation": "Cada escrita precisa atualizar os dados da tabela e todos os índices existentes nela; dessa forma, os índices trocam vazão de escrita por consultas de leitura (SELECT) mais rápidas.",
    "compiledJS": "-- Measure write overhead with EXPLAIN ANALYZE\nEXPLAIN ANALYZE INSERT INTO orders (customer_id, amount)\nVALUES (42, 99.99);\n/*\nInsert on orders (cost=0.00..0.01 rows=0 width=0)\n  (actual time=1.832..1.833 rows=0 loops=1)\n  -- Each additional index adds ~0.2–0.5 ms write overhead per row\nBuffers: shared hit=7 read=1\n  -- 1 heap page + N index pages written\n*/\n\n-- Check total index count on a table\nSELECT count(*) FROM pg_indexes WHERE tablename = 'orders';",
    "bestPractice": "On write-heavy tables (event logs, audit trails, time-series inserts) minimize index count to the absolute essential set — primary key plus any foreign key columns needed for JOIN performance. For analytical reads on the same data, consider a separate read replica or a materialized view with dedicated indexes rather than burdening the write path.",
    "source": "PostgreSQL Docs — Chapter 11.1: Introduction; DDIA — Chapter 3: Storage and Retrieval"
  },
  {
    "id": "b03",
    "topic": "Primary Index",
    "question": "O que distingue um índice primário de um índice secundário?",
    "code": null,
    "options": [
      "Índices primários aceitam duplicatas; secundários impõem unicidade estrita",
      "Índice primário rege a chave ou ordenação; secundário indexa outros campos",
      "Índices primários residem na memória RAM; secundários ficam no disco físico",
      "Índices primários suportam intervalos; secundários suportam apenas igualdade"
    ],
    "correctIndex": 1,
    "explanation": "O índice primário é associado à chave primária (e em estruturas clusterizadas define a ordenação física), enquanto índices secundários cobrem colunas adicionais para atender a outros padrões de consulta.",
    "compiledJS": "-- Primary key implicitly creates a unique B-Tree index\nCREATE TABLE orders (\n  id        BIGSERIAL PRIMARY KEY,   -- creates idx: orders_pkey\n  customer_id INT NOT NULL,\n  created_at  TIMESTAMPTZ DEFAULT now()\n);\n\n-- Secondary index on a non-PK column\nCREATE INDEX idx_orders_created_at ON orders (created_at);\n\n-- pg_indexes shows both\nSELECT indexname, indexdef FROM pg_indexes\nWHERE tablename = 'orders';",
    "bestPractice": "Always declare a surrogate primary key (BIGSERIAL or UUID) even when a natural key exists. Natural keys can change, cascade updates through foreign keys, and tend to be wider — making every secondary index larger. Use the natural key as a UNIQUE constraint instead; it enforces integrity without making it the physical lookup anchor.",
    "source": "PostgreSQL Docs — Chapter 5.3: Constraints; DDIA — Chapter 3: B-Trees"
  },
  {
    "id": "b04",
    "topic": "Full Table Scan",
    "question": "O que é uma varredura completa da tabela (full table scan) e quando o banco de dados a utiliza?",
    "code": null,
    "options": [
      "Ler apenas o primeiro e o último bloco para estimar a quantidade de linhas",
      "Ler todas as linhas sequencialmente quando nenhum índice convém pelo custo",
      "Percorrer todos os índices secundários antes de tocar na tabela de dados",
      "Validar restrições de chave estrangeira sequencialmente na tabela pai"
    ],
    "correctIndex": 0,
    "explanation": "A varredura sequencial (full table scan) lê todas as páginas de dados do disco; o planejador a escolhe quando não existe índice utilizável ou quando a seletividade é tão baixa que o custo de I/O aleatório via índice superaria o da leitura sequencial.",
    "compiledJS": "EXPLAIN SELECT * FROM orders WHERE amount > 0;\n/*\nSeq Scan on orders  (cost=0.00..18450.00 rows=1000000 width=72)\n  Filter: (amount > 0)\n*/\n-- Planner chose Seq Scan because nearly every row matches.\n\n-- Force index use for testing (never do this in production)\nSET enable_seqscan = off;\nEXPLAIN SELECT * FROM orders WHERE amount > 0;\n/*\nIndex Scan using idx_orders_amount on orders (cost=0.43..95000.00 ...)\n-- More expensive! Random I/O over the whole table is worse.\n*/\nRESET enable_seqscan;",
    "bestPractice": "A seq scan is not always bad — for queries that return >5–10% of a table it is usually optimal. Profile first with EXPLAIN ANALYZE; only add an index if the planner's row estimate is accurate and the seq scan is genuinely slow. Investigate stale statistics (run ANALYZE) before assuming an index is needed.",
    "source": "PostgreSQL Docs — Chapter 14.1: Using EXPLAIN; Use The Index, Luke — When the Planner Ignores Indexes"
  },
  {
    "id": "b05",
    "topic": "WHERE Clause Index Usage",
    "question": "Dada a consulta `SELECT * FROM orders WHERE customer_id = 42`, qual condição permite ao banco de dados utilizar um índice em `customer_id`?",
    "code": "SELECT * FROM orders WHERE customer_id = 42;",
    "options": [
      "A tabela deve ter menos de 1.000 linhas",
      "Deve existir um índice na coluna `customer_id`",
      "`customer_id` deve ser a primeira coluna definida na tabela",
      "A consulta precisa usar `LIMIT 1`"
    ],
    "correctIndex": 1,
    "explanation": "O planejador de consultas só pode usar um índice em `customer_id` se esse índice tiver sido criado; caso contrário, recorrerá a uma varredura sequencial.",
    "compiledJS": "-- Before index: Seq Scan\nEXPLAIN SELECT * FROM orders WHERE customer_id = 42;\n-- Seq Scan on orders (cost=0.00..18450.00 rows=10 width=72)\n\n-- Create the index\nCREATE INDEX idx_orders_customer_id ON orders (customer_id);\n\n-- After index: Index Scan\nEXPLAIN SELECT * FROM orders WHERE customer_id = 42;\n-- Index Scan using idx_orders_customer_id on orders\n--   Index Cond: (customer_id = 42)",
    "bestPractice": "After creating an index, always run ANALYZE on the table to refresh statistics, then re-run EXPLAIN to confirm the planner adopts the new path. In staging environments with small datasets the planner may still prefer a seq scan because the cost model shows the table fits in shared_buffers — test with production-scale data.",
    "source": "PostgreSQL Docs — Chapter 11.1: Introduction"
  },
  {
    "id": "b06",
    "topic": "Unique Index",
    "question": "O que um índice UNIQUE garante?",
    "code": null,
    "options": [
      "Que a coluna indexada nunca contenha NULL",
      "Que nenhum par de registros compartilhe o mesmo valor na(s) coluna(s) indexada(s)",
      "Que o índice seja armazenado em uma tablespace separada dos dados da tabela",
      "Que consultas SELECT nessa coluna sempre retornem resultados ordenados"
    ],
    "correctIndex": 1,
    "explanation": "Um índice UNIQUE impõe uma restrição de unicidade: o banco rejeita qualquer INSERT ou UPDATE que resulte em valores duplicados na(s) coluna(s) indexada(s).",
    "compiledJS": "CREATE UNIQUE INDEX uq_users_email ON users (email);\n\n-- This INSERT succeeds:\nINSERT INTO users (email) VALUES ('a@example.com');\n\n-- This INSERT fails with a duplicate key violation:\nINSERT INTO users (email) VALUES ('a@example.com');\n-- ERROR: duplicate key value violates unique constraint \"uq_users_email\"\n-- DETAIL:  Key (email)=(a@example.com) already exists.\n\n-- NULL is allowed multiple times (PostgreSQL behaviour):\nINSERT INTO users (email) VALUES (NULL);  -- succeeds\nINSERT INTO users (email) VALUES (NULL);  -- also succeeds",
    "bestPractice": "Prefer UNIQUE constraints (ALTER TABLE … ADD CONSTRAINT … UNIQUE) over standalone UNIQUE indexes when the goal is integrity enforcement — they are semantically clearer and the planner treats them identically. Use a standalone UNIQUE index when you need partial uniqueness (e.g., UNIQUE WHERE deleted_at IS NULL) which constraints cannot express.",
    "source": "PostgreSQL Docs — Chapter 11.6: Unique Indexes"
  },
  {
    "id": "b07",
    "topic": "EXPLAIN Output",
    "question": "No PostgreSQL, o que o comando `EXPLAIN` exibe?",
    "code": "EXPLAIN SELECT * FROM orders WHERE customer_id = 42;",
    "options": [
      "O texto SQL reescrito após a aplicação de regras e substituições de views",
      "A árvore de execução com nós de operação, custos e contagem de linhas",
      "Um relatório com todos os índices e restrições configurados para as tabelas",
      "O tempo real decorrido e a taxa de uso de CPU gasto para concluir a consulta"
    ],
    "correctIndex": 1,
    "explanation": "O comando `EXPLAIN` exibe a árvore do plano de execução escolhida pelo planejador com estimativas de custo; já o `EXPLAIN ANALYZE` também executa a consulta e relata os tempos reais observados.",
    "compiledJS": "EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;\n/*\nIndex Scan using idx_orders_customer_id on orders\n  (cost=0.43..8.45 rows=1 width=72)\n  (actual time=0.041..0.044 rows=1 loops=1)\n  Index Cond: (customer_id = 42)\nBuffers: shared hit=3\nPlanning Time: 0.128 ms\nExecution Time: 0.063 ms\n*/\n-- \"cost=startup..total\"  — planner estimates in arbitrary cost units\n-- \"rows=1\"               — estimated vs actual row count\n-- \"Buffers: shared hit\"  — pages served from shared_buffers (no disk I/O)",
    "bestPractice": "Always use EXPLAIN (ANALYZE, BUFFERS) — the BUFFERS option reveals whether pages were served from cache (shared hit) or disk (read), which is critical for diagnosing I/O bottlenecks. In production use EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) and pipe the output to a visualizer like explain.dalibo.com for complex multi-join plans.",
    "source": "PostgreSQL Docs — Chapter 14.1: Using EXPLAIN"
  },
  {
    "id": "b08",
    "topic": "Clustered Index",
    "question": "Qual é a principal diferença entre um índice clusterizado (clustered) e um não clusterizado (non-clustered)?",
    "code": null,
    "options": [
      "Clusterizado ordena linhas no disco; não clusterizado guarda ponteiros",
      "Clusterizado aceita uma coluna; não clusterizado aceita várias colunas",
      "Clusterizado exige cache em RAM; não clusterizado fica no disco físico",
      "Clusterizado serve para joins; não clusterizado apenas para agregações"
    ],
    "correctIndex": 0,
    "explanation": "Um índice clusterizado ordena fisicamente os dados (ou armazena os dados no nível folha do próprio índice), tornando buscas por intervalo muito rápidas; já um índice não clusterizado é uma estrutura separada com valores de chave e ponteiros para as linhas.",
    "compiledJS": "-- In PostgreSQL, physically reorder heap pages to match an index (one-time)\nCLUSTER orders USING idx_orders_created_at;\n\n-- Verify row correlation (1.0 = perfectly correlated, 0 = random)\nSELECT attname, correlation\nFROM pg_stats\nWHERE tablename = 'orders' AND attname = 'created_at';\n-- correlation: 0.9998 → range scans on created_at benefit greatly",
    "bestPractice": "PostgreSQL does not maintain clustering automatically — run CLUSTER periodically on tables with high range-scan workloads (e.g., time-series tables queried by date range). For new tables use BRIN indexes instead of CLUSTER when physical ordering is naturally preserved (append-only inserts), as BRIN is far cheaper to maintain.",
    "source": "PostgreSQL Docs — Chapter 11.10: Use of Indexes; Use The Index, Luke — Clustered Indexes"
  },
  {
    "id": "b09",
    "topic": "Low-Cardinality Columns",
    "question": "Por que índices em colunas de baixa cardinalidade (como um booleano `is_active`) costumam ser ineficazes?",
    "code": null,
    "options": [
      "Índices B-Tree não podem ser construídos sobre colunas com tipo booleano",
      "Poucos valores distintos fazem a busca varrer a tabela, encarecendo seeks",
      "Índices de baixa cardinalidade são expurgados sozinhos pelo banco de dados",
      "Colunas booleanas requerem motores colunares ausentes no PostgreSQL padrão"
    ],
    "correctIndex": 1,
    "explanation": "Com poucos valores distintos, cada valor aparece em uma fração considerável das linhas; o custo de I/O aleatório ao percorrer o índice frequentemente supera o custo de uma varredura sequencial.",
    "compiledJS": "-- Low-cardinality index is often ignored by the planner:\nCREATE INDEX idx_users_is_active ON users (is_active);\n\nEXPLAIN SELECT * FROM users WHERE is_active = true;\n-- Seq Scan on users  (cost=0.00..24500.00 rows=950000 width=88)\n-- Index ignored because ~95% of rows are active.\n\n-- Better: partial index only on the interesting minority\nCREATE INDEX idx_users_inactive ON users (id)\nWHERE is_active = false;\n\nEXPLAIN SELECT * FROM users WHERE is_active = false;\n-- Index Scan using idx_users_inactive on users",
    "bestPractice": "Replace a full index on a low-cardinality column with a partial index covering only the rare/interesting subset of rows (e.g., WHERE status = 'pending' for a queue table where pending rows are a small minority). The partial index is smaller, faster to scan, and cheaper to maintain than a full index the planner would usually ignore.",
    "source": "Use The Index, Luke — Index Selectivity; PostgreSQL Docs — Chapter 11.8: Partial Indexes"
  },
  {
    "id": "b10",
    "topic": "Index Maintenance on DML",
    "question": "O que acontece com um índice quando você atualiza a coluna indexada de um registro?",
    "code": null,
    "options": [
      "Nada — as atualizações de índice ocorrem apenas durante o próximo VACUUM",
      "A entrada antiga do índice é removida e uma nova entrada é inserida",
      "O índice inteiro é reconstruído do zero de forma assíncrona pelo motor",
      "O nó correspondente do índice fica inválido até a próxima consulta SELECT"
    ],
    "correctIndex": 1,
    "explanation": "Atualizar uma coluna indexada faz com que o mecanismo remova a entrada da chave antiga e insira uma nova, motivo pelo qual cargas intensas de UPDATE em colunas indexadas geram amplificação de escrita.",
    "compiledJS": "-- Before UPDATE: index has entry key=100 → TID(0,1)\nUPDATE orders SET customer_id = 200 WHERE id = 1;\n\n-- After UPDATE (MVCC):\n--   Heap: old tuple TID(0,1) xmax=txid (dead), new tuple TID(0,2) xmin=txid\n--   Index: old entry customer_id=100 → TID(0,1) [dead, awaiting VACUUM]\n--          new entry customer_id=200 → TID(0,2) [live]\n\n-- View dead tuple accumulation:\nSELECT n_dead_tup, n_live_tup\nFROM pg_stat_user_tables WHERE relname = 'orders';",
    "bestPractice": "Minimize indexes on columns that are frequently updated (status fields, counters, timestamps). If you must index such a column, enable autovacuum aggressively (lower autovacuum_vacuum_scale_factor) to reclaim dead entries before index bloat degrades performance. Consider HOT (Heap Only Tuple) updates — PostgreSQL uses them automatically when no indexed column changes, avoiding index writes entirely.",
    "source": "PostgreSQL Docs — Chapter 24.1: Routine Vacuuming; DDIA — Chapter 3: Update-in-place vs append-only"
  },
  {
    "id": "i01",
    "topic": "B-Tree Traversal",
    "question": "Ao percorrer um índice em árvore B para localizar o valor de uma chave, qual é a complexidade de tempo da busca?",
    "code": null,
    "options": [
      "O(n): linear em relação ao número de registros",
      "O(log n): logarítmica em relação ao número de registros",
      "O(1): tempo constante independentemente do tamanho da tabela",
      "O(n²): quadrática em relação ao número de registros"
    ],
    "correctIndex": 1,
    "explanation": "A árvore B é uma árvore balanceada; cada nível reduz pela metade o espaço de busca, portanto localizar uma chave requer no máximo O(log n) leituras de nós.",
    "compiledJS": "-- Visualise B-Tree depth for a large table\nSELECT\n  level,\n  count(*) AS pages_at_level\nFROM bt_page_stats('idx_orders_customer_id', generate_series(1,5))  -- pgstattuple extension\nGROUP BY level ORDER BY level;\n\n-- Practical depth check via pageinspect extension\nSELECT type, live_items, avg_item_size\nFROM bt_page_stats('idx_orders_customer_id', 1);\n-- root page → internal pages → leaf pages\n-- For 10M rows with 4-byte keys, depth ≈ 3–4 levels",
    "bestPractice": "B-Tree's O(log n) complexity means indexes remain fast as tables grow to hundreds of millions of rows — but only if the tree stays balanced and the upper levels stay cached. Monitor shared_buffers hit ratio for critical indexes. If the root and upper internal pages are not cached, each query incurs extra disk reads. Size shared_buffers so hot index pages stay resident.",
    "source": "DDIA — Chapter 3: B-Trees; PostgreSQL Docs — Chapter 67: B-Tree Indexes"
  },
  {
    "id": "i02",
    "topic": "Hash Index vs B-Tree",
    "question": "Qual afirmação compara corretamente um índice hash e um índice em árvore B?",
    "code": null,
    "options": [
      "Índices hash operam em intervalos; B-Trees atendem apenas buscas pontuais",
      "Índices hash dão O(1) em igualdade mas sem intervalos; B-Trees dão ambos",
      "Índices hash ordenam chaves fisicamente para agilizar buscas por faixa",
      "Índices hash e B-Tree possuem curvas de desempenho idênticas no banco"
    ],
    "correctIndex": 1,
    "explanation": "Índices hash agrupam valores por hash, oferecendo buscas por igualdade em O(1), mas o cálculo de hash elimina a ordenação, impossibilitando consultas por intervalo ou cláusulas de ordenação.",
    "compiledJS": "-- Create a hash index for pure equality workloads\nCREATE INDEX idx_sessions_token_hash ON sessions USING HASH (token);\n\n-- Works: O(1) equality\nEXPLAIN SELECT * FROM sessions WHERE token = 'abc123';\n-- Index Scan using idx_sessions_token_hash on sessions\n\n-- Does NOT work: range predicates fall back to Seq Scan\nEXPLAIN SELECT * FROM sessions WHERE token > 'abc123';\n-- Seq Scan on sessions (hash index cannot satisfy range)",
    "bestPractice": "Use hash indexes for UUID or token lookups where you only ever use = equality and the column has very high cardinality. Stick with B-Tree (the default) for everything else — B-Tree handles equality, ranges, ORDER BY, and prefix LIKE patterns with a single structure. The O(1) vs O(log n) difference rarely matters in practice since B-Tree upper levels are typically cache-resident.",
    "source": "PostgreSQL Docs — Chapter 11.2: Index Types; Use The Index, Luke — Hash Indexes"
  },
  {
    "id": "i03",
    "topic": "Composite Index",
    "question": "Dado um índice composto em `(last_name, first_name)`, qual cláusula WHERE pode utilizar o índice de forma eficiente?",
    "code": "CREATE INDEX idx_name ON users (last_name, first_name);",
    "options": [
      "`WHERE first_name = 'Alice'` (ignorando `last_name`)",
      "`WHERE last_name = 'Smith'`",
      "`WHERE first_name = 'Alice' AND last_name = 'Smith'`: apenas quando ambas as colunas aparecem",
      "Nenhuma das colunas pode usar o índice a menos que a consulta inclua todas as colunas indexadas"
    ],
    "correctIndex": 1,
    "explanation": "Um índice composto em árvore B é ordenado primeiramente pela coluna mais à esquerda; consultas que filtram por `last_name` (a coluna inicial) podem navegar no índice, mas filtros apenas em `first_name` não conseguem.",
    "compiledJS": "-- Efficient: uses leading column\nEXPLAIN SELECT * FROM users WHERE last_name = 'Smith';\n-- Index Scan using idx_name on users\n--   Index Cond: ((last_name)::text = 'Smith'::text)\n\n-- Efficient: uses both columns\nEXPLAIN SELECT * FROM users WHERE last_name = 'Smith' AND first_name = 'Alice';\n-- Index Scan using idx_name on users\n--   Index Cond: (last_name = 'Smith' AND first_name = 'Alice')\n\n-- Inefficient: skips leading column — full index scan or seq scan\nEXPLAIN SELECT * FROM users WHERE first_name = 'Alice';\n-- Seq Scan on users  (leading column not filtered)",
    "bestPractice": "Order composite index columns from most-selective / most-frequently-filtered to least. Put equality-filtered columns before range-filtered columns — range predicates on an intermediate column break the leading-column prefix and prevent further index key narrowing. When unsure, create the index in the order WHERE conditions appear in your most critical query.",
    "source": "Use The Index, Luke — The Column Order of a Composite Index; PostgreSQL Docs — Chapter 11.3: Multicolumn Indexes"
  },
  {
    "id": "i04",
    "topic": "Covering Index",
    "question": "O que é um índice de cobertura (covering index)?",
    "code": null,
    "options": [
      "Um índice que inclui automaticamente todas as colunas físicas da tabela para eliminar o uso de armazenamento na heap",
      "Um índice que contém todas as colunas exigidas pela consulta, respondendo diretamente sem acessar a heap da tabela",
      "Um índice dinâmico que detecta consultas lentas e adiciona colunas à sua estrutura B-Tree durante a execução",
      "Um índice clusterizado que reorganiza a ordem física das linhas no disco para evitar leituras aleatórias em faixas"
    ],
    "correctIndex": 1,
    "explanation": "Quando um índice inclui todas as colunas referenciadas por uma consulta (na própria chave ou via INCLUDE), o banco de dados responde à consulta exclusivamente pelas páginas do índice, eliminando acessos à heap.",
    "compiledJS": "-- Covering index with INCLUDE for non-key payload columns\nCREATE INDEX idx_orders_covering\n  ON orders (customer_id)\n  INCLUDE (amount, created_at);\n\n-- Index-Only Scan: zero heap fetches\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT customer_id, amount, created_at\nFROM orders\nWHERE customer_id = 42;\n/*\nIndex Only Scan using idx_orders_covering on orders\n  (cost=0.43..4.45 rows=1 width=20)\n  (actual time=0.018..0.021 rows=1 loops=1)\n  Heap Fetches: 0    ← no heap access\n*/",
    "bestPractice": "Use INCLUDE to add frequently SELECTed columns without widening the index key. Avoid including too many columns — wide covering indexes consume more memory in shared_buffers and slow down writes. Identify the 2–3 most common SELECT patterns on a hot table and build a targeted covering index for each rather than one giant index.",
    "source": "PostgreSQL Docs — Chapter 11.9: Index-Only Scans and Covering Indexes"
  },
  {
    "id": "i05",
    "topic": "Index Selectivity",
    "question": "O que é seletividade de índice e por que ela é importante para o planejador de consultas?",
    "code": null,
    "options": [
      "O total de páginas de disco do índice; tamanhos maiores varrem mais rápido",
      "A razão de valores distintos por linhas; alta seletividade favorece o índice",
      "A verificação se o índice foi criado diretamente sobre uma chave primária",
      "O percentual histórico de consultas SELECT que filtram pela coluna chave"
    ],
    "correctIndex": 1,
    "explanation": "Alta seletividade (próxima a 1,0) significa que cada valor de chave identifica pouquíssimos registros, refinando o resultado de forma eficiente; baixa seletividade gera muitos registros por chave e o planejador tende a preferir a varredura sequencial.",
    "compiledJS": "-- Inspect selectivity statistics for a column\nSELECT\n  attname,\n  n_distinct,\n  correlation,\n  most_common_vals,\n  most_common_freqs\nFROM pg_stats\nWHERE tablename = 'orders' AND attname = 'customer_id';\n/*\nattname     | customer_id\nn_distinct  | 50000        -- 50k distinct customers\ncorrelation | 0.0023       -- values are randomly distributed in heap\nmost_common_vals  | {42,17,99,...}\nmost_common_freqs | {0.0001,...}  -- each customer ≈ 0.01% of rows → high selectivity\n*/",
    "bestPractice": "Run ANALYZE regularly (autovacuum handles this, but run it manually after bulk loads) so the planner has accurate statistics. For skewed distributions — where a few values appear very frequently — use CREATE STATISTICS to build extended statistics on column correlations. Use pg_stats.most_common_freqs to identify low-selectivity values that will trigger seq scans even with an index.",
    "source": "PostgreSQL Docs — Chapter 14.2: Statistics Used by the Planner; Use The Index, Luke — Index Selectivity"
  },
  {
    "id": "i06",
    "topic": "Partial Index",
    "question": "O que é um índice parcial no PostgreSQL?",
    "code": null,
    "options": [
      "Um índice criado apenas sobre os primeiros bytes de textos longos",
      "Um índice que indexa apenas linhas que atendem a um filtro WHERE",
      "Um índice cobrindo apenas a primeira coluna de uma chave composta",
      "Um índice criado em tempo de execução para atender uma única query"
    ],
    "correctIndex": 1,
    "explanation": "Um índice parcial é criado com uma cláusula WHERE (por exemplo, `CREATE INDEX ... WHERE status = 'active'`), indexando apenas linhas que atendem à condição e gerando uma estrutura menor e mais rápida de manter.",
    "compiledJS": "-- Full index on status: large, mostly unused for rare values\n-- CREATE INDEX idx_orders_status ON orders (status);\n\n-- Partial index: only index pending orders (1% of table)\nCREATE INDEX idx_orders_pending\n  ON orders (created_at)\nWHERE status = 'pending';\n\n-- Planner uses the partial index:\nEXPLAIN SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at;\n/*\nIndex Scan using idx_orders_pending on orders\n  (cost=0.43..320.00 rows=500 width=72)\n-- Tiny index, very fast\n*/\n\n-- Query WITHOUT status = 'pending' cannot use this index:\nEXPLAIN SELECT * FROM orders WHERE status = 'shipped' ORDER BY created_at;\n-- Seq Scan (partial index predicate not satisfied)",
    "bestPractice": "Partial indexes are one of the highest-leverage optimizations available: they can reduce index size by 10–100x for skewed distributions, dramatically improve write throughput on the indexed table, and keep the working set in shared_buffers small. Use them liberally for queue-pattern tables, soft-delete patterns, and any column with a \"hot minority\" of rows.",
    "source": "PostgreSQL Docs — Chapter 11.8: Partial Indexes"
  },
  {
    "id": "i07",
    "topic": "Function-Based Index",
    "question": "O que é um índice baseado em função (índice de expressão)?",
    "code": null,
    "options": [
      "Um índice definido como stored procedure reconstruída toda noite",
      "Um índice sobre expressões ou funções que acelera buscas calculadas",
      "Um índice que dispara funções de gatilho durante qualquer inserção",
      "Um índice que calcula hashes criptográficos para proteger registros"
    ],
    "correctIndex": 1,
    "explanation": "Um índice baseado em função (por exemplo, `CREATE INDEX ON users (lower(email))`) armazena o resultado pré-computado da expressão, permitindo que consultas como `WHERE lower(email) = '...'` utilizem o índice em vez de escanear toda a tabela.",
    "compiledJS": "-- Case-insensitive email lookup without function index: Seq Scan\nEXPLAIN SELECT * FROM users WHERE lower(email) = 'alice@example.com';\n-- Seq Scan (function computed per row)\n\n-- Create expression index\nCREATE INDEX idx_users_lower_email ON users (lower(email));\n\n-- Now uses the index:\nEXPLAIN SELECT * FROM users WHERE lower(email) = 'alice@example.com';\n/*\nIndex Scan using idx_users_lower_email on users\n  (cost=0.43..8.45 rows=1 width=88)\n  Index Cond: (lower(email) = 'alice@example.com'::text)\n*/",
    "bestPractice": "Expression indexes are powerful but add write overhead because the expression is re-evaluated on every INSERT/UPDATE to the indexed column. Ensure the expression is truly IMMUTABLE. For JSON columns, prefer generated columns (GENERATED ALWAYS AS (payload->'field') STORED) combined with a regular index — this separates the expression cost from the index maintenance path and makes the computed value queryable without the expression syntax.",
    "source": "PostgreSQL Docs — Chapter 11.7: Indexes on Expressions"
  },
  {
    "id": "i08",
    "topic": "VACUUM",
    "question": "O que é inchaço de índice (index bloat) e como o comando VACUUM ajuda no PostgreSQL?",
    "code": null,
    "options": [
      "Bloat é excesso de colunas no índice; VACUUM descarta colunas extras no banco",
      "Bloat são páginas com tuplas mortas de updates; VACUUM libera espaço reusável",
      "Bloat significa índice maior que a tabela; VACUUM comprime ambos ao mesmo peso",
      "Bloat surge de conexões concorrentes; VACUUM reinicia os pools de conexão"
    ],
    "correctIndex": 1,
    "explanation": "O modelo MVCC do PostgreSQL deixa versões de tuplas mortas na heap e entradas antigas de índice apontando para elas; o VACUUM remove essas entradas mortas, liberando espaço e mantendo o índice enxuto.",
    "compiledJS": "-- Check index bloat using pgstattuple extension\nSELECT\n  index_name,\n  index_size,\n  leaf_pages,\n  dead_leaf_pages,\n  round(dead_leaf_pages::numeric / leaf_pages * 100, 2) AS bloat_pct\nFROM (\n  SELECT\n    indexrelid::regclass AS index_name,\n    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,\n    (pgstatindex(indexrelid::regclass)).leaf_pages,\n    (pgstatindex(indexrelid::regclass)).deleted_pages AS dead_leaf_pages\n  FROM pg_index\n  WHERE indrelid = 'orders'::regclass\n) t;\n\n-- Force rebuild if bloat > 30%\nREINDEX INDEX CONCURRENTLY idx_orders_customer_id;",
    "bestPractice": "Configure autovacuum aggressively for hot tables: set autovacuum_vacuum_scale_factor = 0.01 (1% dead tuples triggers vacuum) rather than the default 20%. Monitor pg_stat_user_tables.n_dead_tup and pg_stat_user_tables.last_autovacuum. For indexes with >20% bloat despite regular autovacuum, run REINDEX CONCURRENTLY during a low-traffic window to rebuild without locking the table.",
    "source": "PostgreSQL Docs — Chapter 24.1: Routine Vacuuming; DDIA — Chapter 3: B-Tree compaction"
  },
  {
    "id": "i09",
    "topic": "Planner Ignoring Index",
    "question": "Por que o planejador de consultas do PostgreSQL pode ignorar um índice mesmo quando ele existe na coluna filtrada?",
    "code": null,
    "options": [
      "O motor de banco nunca ignora um índice ativo criado — ele é sempre usado",
      "O otimizador estima que o scan sequencial é mais barato pelo volume de linhas",
      "O índice só pode ser usado se a consulta contiver ordenação ORDER BY explícita",
      "Índices B-Tree só operam em cláusulas JOIN, nunca em predicados WHERE normais"
    ],
    "correctIndex": 1,
    "explanation": "O planejador compara os custos estimados: se as estatísticas indicarem que a maioria das linhas corresponde ao filtro, o custo de I/O aleatório do índice será superior ao de uma varredura sequencial, fazendo com que o índice seja ignorado.",
    "compiledJS": "-- Statistics show why the planner ignores an index\nSELECT\n  tablename, attname,\n  n_distinct,\n  most_common_vals,\n  most_common_freqs[1] AS top_val_freq\nFROM pg_stats\nWHERE tablename = 'orders' AND attname = 'status';\n/*\ntop_val_freq = 0.92  → 92% of rows have status='completed'\nPlanner correctly skips index for WHERE status = 'completed'\n*/\n\n-- Force statistics update after bulk data change\nANALYZE orders;\n\n-- Temporarily disable seq scan to test what index scan costs\nSET enable_seqscan = off;\nEXPLAIN SELECT * FROM orders WHERE status = 'completed';\nRESET enable_seqscan;",
    "bestPractice": "Before concluding an index is \"broken,\" verify statistics freshness with SELECT last_analyze FROM pg_stat_user_tables. Run ANALYZE and re-check the plan. If the planner still ignores the index and you are confident it should be used, investigate whether the query predicate can be rewritten, whether a partial index would improve selectivity, or whether the random_page_cost GUC needs tuning for your storage type (SSDs warrant lower values like 1.1 vs the default 4.0).",
    "source": "PostgreSQL Docs — Chapter 14.3: Controlling the Planner with Explicit JOIN Clauses; Use The Index, Luke — When the Planner Ignores Indexes"
  },
  {
    "id": "i10",
    "topic": "LIKE and Index Usage",
    "question": "Dado um índice em árvore B em uma coluna `name`, qual padrão de busca com LIKE pode utilizar o índice?",
    "code": "CREATE INDEX idx_users_name ON users (name);",
    "options": [
      "`WHERE name LIKE '%smith'` (curinga no início / sufixo)",
      "`WHERE name LIKE '%smith%'` (curingas em ambos os lados)",
      "`WHERE name LIKE 'smith%'` (curinga no final / prefixo)",
      "Nenhum: o operador LIKE nunca utiliza índices em árvore B"
    ],
    "correctIndex": 2,
    "explanation": "O índice em árvore B é ordenado lexicograficamente; buscas por prefixo (`'smith%'`) mapeiam diretamente para uma varredura por intervalo no índice, enquanto curingas no início forçam uma varredura completa porque o prefixo comum é desconhecido.",
    "compiledJS": "-- Works with prefix wildcard (requires C collation or text_pattern_ops)\nCREATE INDEX idx_users_name_pattern\n  ON users (name text_pattern_ops);\n\nEXPLAIN SELECT * FROM users WHERE name LIKE 'smith%';\n/*\nIndex Scan using idx_users_name_pattern on users\n  Index Cond: ((name ~>=~ 'smith'::text) AND (name ~<~ 'smitI'::text))\n*/\n\n-- Does NOT use index (leading wildcard)\nEXPLAIN SELECT * FROM users WHERE name LIKE '%smith';\n-- Seq Scan on users  Filter: ((name)::text ~~ '%smith'::text)\n\n-- For suffix/substring searches use pg_trgm + GIN index instead:\nCREATE INDEX idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);\nEXPLAIN SELECT * FROM users WHERE name LIKE '%smith%';\n-- Bitmap Index Scan using idx_users_name_trgm",
    "bestPractice": "For suffix or substring LIKE patterns, install the pg_trgm extension and create a GIN index with gin_trgm_ops — it supports arbitrary LIKE/ILIKE patterns including leading wildcards. For full-text search on prose, use tsvector + GIN. Avoid leading wildcards in B-Tree columns entirely; redesign queries to use trigram or full-text indexes or rewrite to prefix scans where possible.",
    "source": "PostgreSQL Docs — Chapter 11.5: Operator Classes and Operator Families; Use The Index, Luke — Wildcard LIKE"
  },
  {
    "id": "a01",
    "topic": "GiST / GIN / BRIN",
    "question": "Qual tipo de índice do PostgreSQL é projetado para tipos de dados geométricos e espaciais, como pontos, caixas (boxes) e polígonos?",
    "code": null,
    "options": [
      "GIN (Generalized Inverted Index)",
      "BRIN (Block Range INdex)",
      "GiST (Generalized Search Tree)",
      "SPGIST (Space-Partitioned GiST)"
    ],
    "correctIndex": 2,
    "explanation": "GiST é uma estrutura de indexação extensível que suporta tipos de dados não escalares, incluindo formas geométricas, busca textual com `tsvector` e tipos de intervalo, permitindo consultas de contenção e sobreposição.",
    "compiledJS": "-- GiST index for 2D point nearest-neighbour search\nCREATE INDEX idx_locations_point\n  ON locations USING GIST (coordinates);\n\n-- KNN query using GiST index\nEXPLAIN SELECT name, coordinates\nFROM locations\nORDER BY coordinates <-> point(40.7128, -74.0060)  -- distance to NYC\nLIMIT 10;\n/*\nLimit  (rows=10)\n  ->  Index Scan using idx_locations_point on locations\n        Order By: (coordinates <-> '(40.7128,-74.006)'::point)\n-- GiST enables ORDER BY distance without a seq scan\n*/\n\n-- Range type overlap query\nCREATE INDEX idx_reservations_period\n  ON reservations USING GIST (period);\nSELECT * FROM reservations WHERE period && '[2024-01-01,2024-01-07)';",
    "bestPractice": "Choose the index type based on the operators your queries use: GiST for spatial/range/overlap, GIN for array containment/full-text search, BRIN for append-only time-series, B-Tree for everything else. Install PostGIS for production geospatial workloads — it provides optimised GiST operator classes and spatial functions far beyond the built-in geometric types.",
    "source": "PostgreSQL Docs — Chapter 11.2: Index Types; PostgreSQL Docs — Chapter 68: GiST Indexes"
  },
  {
    "id": "a02",
    "topic": "Full-Text GIN Index",
    "question": "Um índice GIN (Generalized Inverted Index) é mais adequado para qual tipo de coluna?",
    "code": null,
    "options": [
      "Uma chave primária inteira autoincrementável",
      "Colunas compostas como arrays, JSONB ou tsvector",
      "Um timestamp estritamente crescente em tabelas",
      "Uma flag booleana de status de baixa cardinalidade"
    ],
    "correctIndex": 1,
    "explanation": "O índice GIN constrói um índice invertido sobre elementos individuais de valores compostos (elementos de array, chaves JSON, lexemas), sendo ideal para operadores de contenção como `@>` ou busca textual com `@@`.",
    "compiledJS": "-- Full-text search with GIN index\nALTER TABLE articles ADD COLUMN search_vector tsvector\n  GENERATED ALWAYS AS (\n    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,''))\n  ) STORED;\n\nCREATE INDEX idx_articles_fts ON articles USING GIN (search_vector);\n\n-- Full-text search query\nEXPLAIN SELECT id, title FROM articles\nWHERE search_vector @@ to_tsquery('english', 'database & index');\n/*\nBitmap Index Scan using idx_articles_fts on articles\n  Recheck Cond: (search_vector @@ to_tsquery('english', 'database & index'))\n*/\n\n-- JSONB containment with GIN\nCREATE INDEX idx_events_payload ON events USING GIN (payload);\nSELECT * FROM events WHERE payload @> '{\"type\": \"click\"}';",
    "bestPractice": "GIN indexes are fast for reads but slow to update because each element maps to a potentially large posting list. Use the fastupdate GIN storage parameter (on by default) which batches pending insertions in a list and merges them lazily. For real-time insert-heavy full-text workloads, consider GiST with tsvector — GiST updates faster but queries slightly slower than GIN.",
    "source": "PostgreSQL Docs — Chapter 70: GIN Indexes"
  },
  {
    "id": "a03",
    "topic": "LSM-Tree",
    "question": "O que é 'amplificação de escrita' (write amplification) no contexto de índices LSM-tree (Log-Structured Merge-tree)?",
    "code": null,
    "options": [
      "Cada escrita lógica é gravada fisicamente múltiplas vezes através dos diferentes níveis da LSM-tree durante os processos de compactação",
      "O banco de dados grava uma cópia redundante de cada linha no log de transações",
      "A amplificação de escrita refere-se à sobrecarga de atualizar nós pais de uma árvore B após a divisão de uma folha (leaf split)",
      "É a latência adicional gerada pela persistência do log de escrita prévia (write-ahead log) no disco"
    ],
    "correctIndex": 0,
    "explanation": "Nas árvores LSM, os dados fluem por múltiplos níveis (L0 para L1 até Ln) através da compactação; uma mesma chave lógica pode ser reescrita várias vezes, sendo a amplificação de escrita a proporção entre bytes físicos gravados e bytes lógicos solicitados.",
    "compiledJS": "-- RocksDB / Cassandra style LSM write flow (conceptual SQL analogy)\n\n-- Level 0: recent writes (unsorted, overlapping key ranges)\n-- L0: [SSTable-a: keys 1-100], [SSTable-b: keys 50-200]  ← written fast\n\n-- Compaction merges L0 into L1 (sorted, non-overlapping)\n-- L1: [keys 1-49], [keys 50-100], [keys 101-200]\n-- Each key rewritten once more → write amplification ×2\n\n-- L1 eventually compacts into L2 → each key rewritten again\n-- A key written once may be physically written 10-30× total\n\n-- Monitor write amplification in RocksDB:\n-- db.GetProperty(\"rocksdb.stats\")\n-- Look for: \"Write Amplification\" metric\n\n-- In PostgreSQL: WAL + heap + N index pages = write amplification\n-- Every UPDATE writes: 1 WAL record + 1 heap page + N index pages",
    "bestPractice": "LSM trees optimise for write throughput at the cost of read amplification (must search multiple SSTables) and write amplification (compaction). Choose LSM-based storage (Cassandra, RocksDB) for append-heavy, write-intensive workloads. Tune the level size ratio and compaction strategy (Leveled vs Size-Tiered) to balance write vs read amplification. Monitor compaction I/O — excessive compaction can saturate disk bandwidth and starve foreground reads.",
    "source": "DDIA — Chapter 3: SSTables and LSM-Trees; RocksDB Wiki — Write Amplification"
  },
  {
    "id": "a04",
    "topic": "CREATE INDEX CONCURRENTLY",
    "question": "Qual é a finalidade do comando `CREATE INDEX CONCURRENTLY` no PostgreSQL?",
    "code": "CREATE INDEX CONCURRENTLY idx_orders_customer_id\nON orders (customer_id);",
    "options": [
      "Constrói o índice em todos os núcleos de CPU simultaneamente para minimizar o tempo de criação de páginas B-Tree",
      "Constrói o índice sem adquirir trava exclusiva de escrita na tabela, permitindo leituras e escritas durante o build",
      "Gera a estrutura do índice em uma réplica de leitura antes de promovê-la a primária, poupando I/O no nó principal",
      "Adia a validação de unicidade até o commit final da transação, priorizando a taxa de transferência em lotes"
    ],
    "correctIndex": 1,
    "explanation": "O `CREATE INDEX CONCURRENTLY` realiza múltiplas leituras na tabela adquirindo apenas bloqueios curtos, mantendo a tabela totalmente acessível durante a criação, algo fundamental para tabelas em produção que não toleram indisponibilidade.",
    "compiledJS": "-- Safe for production: no write blocking\nCREATE INDEX CONCURRENTLY idx_orders_customer_id\n  ON orders (customer_id);\n\n-- Monitor build progress (PostgreSQL 12+)\nSELECT\n  phase,\n  blocks_done,\n  blocks_total,\n  round(blocks_done::numeric / nullif(blocks_total,0) * 100, 1) AS pct_done\nFROM pg_stat_progress_create_index\nWHERE relid = 'orders'::regclass;\n\n-- If the build fails mid-way, an INVALID index remains:\nSELECT indexname, indisvalid\nFROM pg_indexes\nJOIN pg_index ON indexrelid = (SELECT oid FROM pg_class WHERE relname = indexname)\nWHERE tablename = 'orders';\n-- indisvalid = false → DROP INDEX CONCURRENTLY and retry",
    "bestPractice": "Always use CREATE INDEX CONCURRENTLY on production tables that receive writes. If the concurrent build fails (e.g., due to a lock timeout or connection drop), the invalid index must be dropped before retrying — it consumes space and write overhead without being usable. Wrap index creation in a deployment script that checks pg_indexes.indisvalid after creation and alerts if the index is invalid.",
    "source": "PostgreSQL Docs — Chapter 11.12: Building Indexes Concurrently"
  },
  {
    "id": "a05",
    "topic": "Invisible Index",
    "question": "O que é um 'índice invisível' (suportado no MySQL 8+ e Oracle) e qual é seu principal caso de uso?",
    "code": null,
    "options": [
      "Um índice criptografado em disco para evitar inspeção por administradores",
      "Um índice mantido pelo motor mas oculto do planner para testar sua remoção",
      "Um índice volátil mantido em RAM que nunca é gravado no disco permanente",
      "Um índice interno de catálogo de sistema oculto das visões de metadados"
    ],
    "correctIndex": 1,
    "explanation": "Índices invisíveis continuam sendo atualizados em operações de escrita, mas o otimizador os ignora por padrão; isso permite que DBAs simulem a remoção do índice e verifiquem os planos de consulta antes de executar um DROP INDEX definitivo.",
    "compiledJS": "-- MySQL 8+ invisible index syntax\nALTER TABLE orders ALTER INDEX idx_orders_customer_id INVISIBLE;\n\n-- Verify: optimizer ignores it\nEXPLAIN SELECT * FROM orders WHERE customer_id = 42;\n-- Full Table Scan (index is invisible to optimizer)\n\n-- Re-enable to restore original plan\nALTER TABLE orders ALTER INDEX idx_orders_customer_id VISIBLE;\n\n-- PostgreSQL equivalent: session-level index disable for testing\nSET enable_indexscan = off;\nSET enable_bitmapscan = off;\nEXPLAIN SELECT * FROM orders WHERE customer_id = 42;\n-- Seq Scan (simulates index absence)\nRESET enable_indexscan;\nRESET enable_bitmapscan;",
    "bestPractice": "Never drop an index in production without first testing the impact. Use invisible indexes (MySQL/Oracle) or session-level planner controls (PostgreSQL) to observe plan changes under real load before committing to removal. Also check pg_stat_user_indexes.idx_scan to confirm the index has zero (or near-zero) scans over a representative time window before dropping.",
    "source": "MySQL 8.0 Docs — Invisible Indexes; Use The Index, Luke — Safely Dropping Indexes"
  },
  {
    "id": "a06",
    "topic": "MVCC Dead Tuples",
    "question": "De que maneira o modelo MVCC (Multi-Version Concurrency Control) do PostgreSQL contribui para o inchaço de índices (index bloat) ao longo do tempo?",
    "code": null,
    "options": [
      "MVCC comprime versões antigas de linhas causando fragmentação nas páginas",
      "UPDATEs criam novas versões; chaves antigas e novas coexistem até o VACUUM",
      "MVCC adiciona IDs de transação em cada folha do índice, dobrando o tamanho",
      "MVCC isola páginas de índice de modo que tuplas mortas afetam apenas a heap"
    ],
    "correctIndex": 1,
    "explanation": "Como o PostgreSQL nunca atualiza um registro in-place (ele grava uma nova versão), o índice precisa apontar para a nova versão enquanto a entrada antiga permanece até que o VACUUM colete a tupla morta que já não é mais visível.",
    "compiledJS": "-- Monitor MVCC dead tuple accumulation\nSELECT\n  relname,\n  n_live_tup,\n  n_dead_tup,\n  round(n_dead_tup::numeric / nullif(n_live_tup + n_dead_tup, 0) * 100, 2) AS dead_pct,\n  last_vacuum,\n  last_autovacuum\nFROM pg_stat_user_tables\nWHERE relname = 'orders'\nORDER BY n_dead_tup DESC;\n\n-- If dead_pct > 10% and no recent vacuum, trigger manually:\nVACUUM ANALYZE orders;\n\n-- For severe bloat, rebuild without locking:\nREINDEX TABLE CONCURRENTLY orders;",
    "bestPractice": "Tune autovacuum per-table rather than globally for hot OLTP tables. Set storage parameters at the table level: ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000). This triggers autovacuum after just 1,000 + 1% dead tuples rather than the default 50,000 + 20%. On very high-write tables, also reduce autovacuum_vacuum_cost_delay to give autovacuum more I/O bandwidth.",
    "source": "PostgreSQL Docs — Chapter 24.1: Routine Vacuuming; PostgreSQL Docs — Chapter 74: MVCC"
  },
  {
    "id": "a07",
    "topic": "Bitmap Scan",
    "question": "Quando o planejador do PostgreSQL opta por um Bitmap Index Scan em vez de um Index Scan convencional?",
    "code": null,
    "options": [
      "Quando a consulta retorna uma única linha filtrada por restrição de unicidade, ignorando checagens na heap",
      "Ao combinar múltiplos índices ou ler linhas na ordem física das páginas da heap para eliminar seeks aleatórios",
      "Quando a tabela não possui páginas de heap porque os dados residem inteiramente nas folhas do índice clusterizado",
      "Quando o otimizador força scans bitmap por considerá-los incondicionalmente superiores a buscas diretas por índice"
    ],
    "correctIndex": 1,
    "explanation": "O Bitmap Index Scan reúne todos os TIDs correspondentes em um bitmap em memória, ordena-os pela localização física e lê as páginas da heap de forma sequencial, sendo ideal para resultados moderados e consultas que combinam múltiplos índices que o Index Scan simples não consegue unir.",
    "compiledJS": "EXPLAIN ANALYZE\nSELECT * FROM orders\nWHERE customer_id = 42 OR status = 'pending';\n/*\nBitmap Heap Scan on orders\n  (cost=240.00..8500.00 rows=1200 width=72)\n  Recheck Cond: ((customer_id = 42) OR (status = 'pending'))\n  ->  BitmapOr\n        ->  Bitmap Index Scan on idx_orders_customer_id\n              Index Cond: (customer_id = 42)\n        ->  Bitmap Index Scan on idx_orders_status\n              Index Cond: (status = 'pending')\n*/\n-- Two separate indexes combined in memory before any heap access",
    "bestPractice": "The planner transitions from Index Scan → Bitmap Index Scan → Seq Scan as estimated row count increases. Understanding this continuum helps debug plan regressions: if a query suddenly switches from Index Scan to Seq Scan, the estimate likely jumped across the threshold. Use partial indexes or updated statistics to keep estimates accurate. For OR conditions spanning multiple columns, ensure each column has a dedicated index so BitmapOr can be used.",
    "source": "PostgreSQL Docs — Chapter 11.5: Combining Multiple Indexes; Use The Index, Luke — Bitmap Heap Scan"
  },
  {
    "id": "a08",
    "topic": "Partitioned Indexes",
    "question": "Em uma tabela particionada, qual é a consideração fundamental ao criar índices para assegurar que todas as partições sejam beneficiadas?",
    "code": null,
    "options": [
      "Índices devem residir na chave de partição; outras colunas não são aceitas",
      "Criar índice na tabela pai propaga a definição a todas as partições do banco",
      "Cada partição exige a criação manual de um índice com nome único no esquema",
      "Tabelas particionadas não aceitam B-Trees e utilizam exclusivamente índices BRIN"
    ],
    "correctIndex": 1,
    "explanation": "Desde o PostgreSQL 11, executar `CREATE INDEX` na tabela particionada cria um índice local correspondente em cada partição e gera índices automaticamente em novas partições conforme forem anexadas.",
    "compiledJS": "-- Partitioned table with automatic index propagation (PG 11+)\nCREATE TABLE orders (\n  id          BIGSERIAL,\n  created_at  TIMESTAMPTZ NOT NULL,\n  customer_id INT\n) PARTITION BY RANGE (created_at);\n\nCREATE TABLE orders_2024\n  PARTITION OF orders\n  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');\n\n-- Create index on parent → propagates to all partitions\nCREATE INDEX idx_orders_customer_id\n  ON orders (customer_id);\n\n-- Verify propagation\nSELECT indexname, tablename\nFROM pg_indexes\nWHERE tablename LIKE 'orders%' AND indexname LIKE '%customer%';\n-- idx_orders_customer_id on orders (partitioned)\n-- orders_2024_customer_id_idx on orders_2024 (local)",
    "bestPractice": "Always create indexes on the parent partitioned table, never manually on individual child partitions — this ensures future partitions are automatically covered. For UNIQUE constraints on partitioned tables the constraint must include the partition key (PG limitation). Monitor per-partition index sizes with pg_relation_size to identify hot partitions that may need dedicated tuning or partial indexes.",
    "source": "PostgreSQL Docs — Chapter 5.11: Table Partitioning; PostgreSQL Docs — Chapter 11.11: Indexes and Table Partitioning"
  },
  {
    "id": "a09",
    "topic": "BRIN Index",
    "question": "O que é um índice BRIN e para qual característica de tabela ele é mais indicado?",
    "code": null,
    "options": [
      "Um índice de bloco com min/max para colunas ordenadas fisicamente na heap",
      "Um índice balanceado projetado para substituir B-Trees em dados numéricos",
      "Um índice de mapa de bits feito para acelerar varreduras aleatórias na heap",
      "Um índice binário restrito a identificadores UUID e chaves primárias do banco"
    ],
    "correctIndex": 0,
    "explanation": "O BRIN registra apenas os valores mínimo e máximo de cada conjunto de páginas, tornando-se extremamente compacto e de baixo custo de manutenção; ele funciona perfeitamente quando os valores da coluna estão correlacionados à ordenação física no disco.",
    "compiledJS": "-- BRIN index on append-only time-series table\nCREATE INDEX idx_events_created_brin\n  ON events USING BRIN (created_at)\n  WITH (pages_per_range = 64);  -- smaller ranges = more precision, larger index\n\n-- Check correlation (must be high for BRIN to help)\nSELECT attname, correlation\nFROM pg_stats\nWHERE tablename = 'events' AND attname = 'created_at';\n-- correlation ≈ 1.0 → BRIN works perfectly (new rows always have newer timestamps)\n\n-- Size comparison\nSELECT\n  pg_size_pretty(pg_relation_size('events')) AS table_size,\n  pg_size_pretty(pg_relation_size('idx_events_created_brin')) AS brin_size;\n-- table: 4200 MB, BRIN: 48 kB  ← orders of magnitude smaller than B-Tree",
    "bestPractice": "Use BRIN indexes on large append-only tables (event logs, IoT sensor data, financial tick data) where the indexed column is naturally correlated with insertion order (timestamps, auto-increment IDs). Replace the B-Tree on created_at/id with a BRIN — it can reduce index maintenance overhead by >99% while still enabling fast date-range queries. Do not use BRIN on OLTP tables with random writes or updates; correlation degrades quickly and the index becomes useless.",
    "source": "PostgreSQL Docs — Chapter 71: BRIN Indexes; DDIA — Chapter 3: Other Indexing Structures"
  },
  {
    "id": "a10",
    "topic": "pg_stat_user_indexes",
    "question": "Qual view de sistema do PostgreSQL você consultaria para descobrir o número de varreduras por índice, varreduras sequenciais e tuplas recuperadas para índices criados por usuários?",
    "code": null,
    "options": [
      "`pg_indexes`",
      "`information_schema.table_constraints`",
      "`pg_stat_user_indexes`",
      "`pg_index`"
    ],
    "correctIndex": 2,
    "explanation": "A view `pg_stat_user_indexes` expõe estatísticas acumuladas por índice, incluindo `idx_scan` (número de varreduras iniciadas), `idx_tup_read` e `idx_tup_fetch`, sendo a principal view para identificar índices sem uso ou com uso intenso.",
    "compiledJS": "-- Find unused indexes (idx_scan = 0 over observation window)\nSELECT\n  schemaname,\n  relname AS table_name,\n  indexrelname AS index_name,\n  idx_scan,\n  idx_tup_read,\n  idx_tup_fetch,\n  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size\nFROM pg_stat_user_indexes\nWHERE schemaname = 'public'\nORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC;\n\n-- Find write-heavy tables to identify index maintenance cost\nSELECT\n  relname,\n  n_tup_ins + n_tup_upd + n_tup_del AS total_writes,\n  pg_size_pretty(pg_total_relation_size(relid)) AS total_size\nFROM pg_stat_user_tables\nORDER BY total_writes DESC\nLIMIT 20;",
    "bestPractice": "Schedule a weekly index audit query against pg_stat_user_indexes. Any index with idx_scan = 0 over 2+ weeks and non-trivial size should be reviewed for removal. Before dropping, make the index invisible (MySQL) or use session-level disable (PostgreSQL) to confirm no plan regressions. Also cross-reference with pg_stat_user_tables.n_tup_upd to understand write cost savings from removing unused indexes on hot tables.",
    "source": "PostgreSQL Docs — Chapter 28.2: The Statistics Collector — pg_stat_user_indexes"
  }
]
