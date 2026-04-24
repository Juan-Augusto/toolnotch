import type { InterviewQuestion } from '@/lib/interviewTypes'

export const DATABASE_INDEXING_QUESTIONS: InterviewQuestion[] = [
  // ── Beginner (b01–b10) ──────────────────────────────────────────────────────

  {
    id: 'b01',
    topic: 'What is an Index',
    question: 'What is a database index?',
    code: null,
    options: [
      'A backup copy of the entire table stored on a separate disk',
      'A separate data structure that maps column values to row locations, speeding up data retrieval',
      'A constraint that enforces row uniqueness across a table',
      'A transaction log that records every INSERT, UPDATE, and DELETE',
    ],
    correctIndex: 1,
    explanation:
      'An index is an auxiliary data structure — most commonly a B-Tree — that stores a sorted subset of column values alongside pointers (TIDs) to the corresponding heap rows. When a query filters on an indexed column the engine walks the index tree to locate matching TIDs and fetches only those pages instead of reading every row. This dramatically reduces I/O for selective queries. Without an index the planner has no choice but to perform a full sequential scan, reading every data page from disk.',
    compiledJS: `-- Create a standard B-Tree index on orders.customer_id
CREATE INDEX idx_orders_customer_id
  ON orders (customer_id);

-- EXPLAIN shows Index Scan instead of Seq Scan after index creation
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;
/*
Index Scan using idx_orders_customer_id on orders
  (cost=0.43..8.45 rows=1 width=72)
  Index Cond: (customer_id = 42)
*/`,
    bestPractice:
      'Senior engineers add indexes incrementally based on slow-query logs and pg_stat_user_indexes data, not speculatively. Before adding an index, confirm the column is highly selective (many distinct values). After creation, run EXPLAIN ANALYZE to verify the planner actually uses the new index — stale statistics can cause it to be ignored until ANALYZE runs.',
    source: 'PostgreSQL Docs — Chapter 11: Indexes',
  },

  {
    id: 'b02',
    topic: 'Read vs Write Cost',
    question: 'Which of the following best describes the read vs. write trade-off of adding an index?',
    code: null,
    options: [
      'Indexes speed up both reads and writes equally',
      'Indexes slow down reads because the planner must check the index first',
      'Indexes speed up reads but add overhead to INSERT, UPDATE, and DELETE operations',
      'Indexes only affect DELETE performance, not SELECT',
    ],
    correctIndex: 2,
    explanation:
      'Every DML statement that modifies an indexed column must also update the index structure to keep it consistent with the heap. For a table with five indexes, a single INSERT writes to the heap page plus five index pages — six writes instead of one. This write amplification is why over-indexing hurts OLTP workloads with high write throughput. The benefit is that SELECT queries gain fast lookup paths, so the trade-off is: more indexes → faster reads, slower writes.',
    compiledJS: `-- Measure write overhead with EXPLAIN ANALYZE
EXPLAIN ANALYZE INSERT INTO orders (customer_id, amount)
VALUES (42, 99.99);
/*
Insert on orders (cost=0.00..0.01 rows=0 width=0)
  (actual time=1.832..1.833 rows=0 loops=1)
  -- Each additional index adds ~0.2–0.5 ms write overhead per row
Buffers: shared hit=7 read=1
  -- 1 heap page + N index pages written
*/

-- Check total index count on a table
SELECT count(*) FROM pg_indexes WHERE tablename = 'orders';`,
    bestPractice:
      'On write-heavy tables (event logs, audit trails, time-series inserts) minimize index count to the absolute essential set — primary key plus any foreign key columns needed for JOIN performance. For analytical reads on the same data, consider a separate read replica or a materialized view with dedicated indexes rather than burdening the write path.',
    source: 'PostgreSQL Docs — Chapter 11.1: Introduction; DDIA — Chapter 3: Storage and Retrieval',
  },

  {
    id: 'b03',
    topic: 'Primary Index',
    question: 'What distinguishes a primary index from a secondary index?',
    code: null,
    options: [
      'A primary index is always a hash index; secondary indexes are always B-Trees',
      'A primary index is built on the primary key and typically determines physical row order; secondary indexes are on other columns',
      'A primary index can only be defined at table creation; secondary indexes can be added at any time',
      'There is no practical difference — the terms are interchangeable',
    ],
    correctIndex: 1,
    explanation:
      'A primary index is associated with the primary key column(s). In databases that use clustered storage (SQL Server, InnoDB), the primary index physically orders the heap — leaf nodes contain the actual row data, so range scans by primary key are extremely efficient. PostgreSQL\'s heap storage is not physically clustered by default, but the primary key index still serves as the canonical lookup path. Secondary indexes cover other columns and store TID pointers back to the heap, adding a heap-fetch step for non-covering queries.',
    compiledJS: `-- Primary key implicitly creates a unique B-Tree index
CREATE TABLE orders (
  id        BIGSERIAL PRIMARY KEY,   -- creates idx: orders_pkey
  customer_id INT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Secondary index on a non-PK column
CREATE INDEX idx_orders_created_at ON orders (created_at);

-- pg_indexes shows both
SELECT indexname, indexdef FROM pg_indexes
WHERE tablename = 'orders';`,
    bestPractice:
      'Always declare a surrogate primary key (BIGSERIAL or UUID) even when a natural key exists. Natural keys can change, cascade updates through foreign keys, and tend to be wider — making every secondary index larger. Use the natural key as a UNIQUE constraint instead; it enforces integrity without making it the physical lookup anchor.',
    source: 'PostgreSQL Docs — Chapter 5.3: Constraints; DDIA — Chapter 3: B-Trees',
  },

  {
    id: 'b04',
    topic: 'Full Table Scan',
    question: 'What is a full table scan, and when does the database use one?',
    code: null,
    options: [
      'Reading every row in a table sequentially; used when no suitable index exists or when the planner estimates it is cheaper than an index scan',
      'Reading only the first and last rows of a table to estimate table size',
      'A special operation that rebuilds all indexes on the table',
      'A scan that only reads rows matching a WHERE clause',
    ],
    correctIndex: 0,
    explanation:
      'A sequential scan (Seq Scan in PostgreSQL\'s EXPLAIN) reads every data page from disk in order, bypassing all index structures. The planner chooses it when no usable index exists, when a large fraction of rows matches the predicate (making random I/O via an index costlier than sequential reads), or when table statistics are stale. Sequential I/O is faster per byte than random I/O, so for large result sets the seq scan often wins even when an index exists.',
    compiledJS: `EXPLAIN SELECT * FROM orders WHERE amount > 0;
/*
Seq Scan on orders  (cost=0.00..18450.00 rows=1000000 width=72)
  Filter: (amount > 0)
*/
-- Planner chose Seq Scan because nearly every row matches.

-- Force index use for testing (never do this in production)
SET enable_seqscan = off;
EXPLAIN SELECT * FROM orders WHERE amount > 0;
/*
Index Scan using idx_orders_amount on orders (cost=0.43..95000.00 ...)
-- More expensive! Random I/O over the whole table is worse.
*/
RESET enable_seqscan;`,
    bestPractice:
      'A seq scan is not always bad — for queries that return >5–10% of a table it is usually optimal. Profile first with EXPLAIN ANALYZE; only add an index if the planner\'s row estimate is accurate and the seq scan is genuinely slow. Investigate stale statistics (run ANALYZE) before assuming an index is needed.',
    source: 'PostgreSQL Docs — Chapter 14.1: Using EXPLAIN; Use The Index, Luke — When the Planner Ignores Indexes',
  },

  {
    id: 'b05',
    topic: 'WHERE Clause Index Usage',
    question: "Given the query `SELECT * FROM orders WHERE customer_id = 42`, which condition allows the database to use an index on `customer_id`?",
    code: `SELECT * FROM orders WHERE customer_id = 42;`,
    options: [
      'The table must have fewer than 1,000 rows',
      'An index must exist on the `customer_id` column',
      '`customer_id` must be the first column defined in the table',
      'The query must use `LIMIT 1`',
    ],
    correctIndex: 1,
    explanation:
      'The query planner can only leverage an index if the index exists on the filtered column and the predicate is compatible with the index type (equality works for both B-Tree and hash indexes). Column declaration order in the CREATE TABLE statement has no bearing on index eligibility — only the index definition matters. Row count and LIMIT may influence whether the planner chooses the index, but they cannot enable a nonexistent one.',
    compiledJS: `-- Before index: Seq Scan
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;
-- Seq Scan on orders (cost=0.00..18450.00 rows=10 width=72)

-- Create the index
CREATE INDEX idx_orders_customer_id ON orders (customer_id);

-- After index: Index Scan
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;
-- Index Scan using idx_orders_customer_id on orders
--   Index Cond: (customer_id = 42)`,
    bestPractice:
      'After creating an index, always run ANALYZE on the table to refresh statistics, then re-run EXPLAIN to confirm the planner adopts the new path. In staging environments with small datasets the planner may still prefer a seq scan because the cost model shows the table fits in shared_buffers — test with production-scale data.',
    source: 'PostgreSQL Docs — Chapter 11.1: Introduction',
  },

  {
    id: 'b06',
    topic: 'Unique Index',
    question: 'What does a UNIQUE index guarantee?',
    code: null,
    options: [
      'That the indexed column is never NULL',
      'That no two rows share the same value in the indexed column(s)',
      'That the index is stored in a separate tablespace from the table data',
      'That SELECT queries on that column always return results in sorted order',
    ],
    correctIndex: 1,
    explanation:
      'A UNIQUE index enforces a data integrity constraint: the database engine rejects any INSERT or UPDATE that would create a duplicate value in the indexed column(s). It does not prevent NULL values — most databases (including PostgreSQL) treat each NULL as distinct, so multiple NULLs are allowed in a UNIQUE column unless a separate NOT NULL constraint is added. The uniqueness check happens at write time via a lock on the index entry.',
    compiledJS: `CREATE UNIQUE INDEX uq_users_email ON users (email);

-- This INSERT succeeds:
INSERT INTO users (email) VALUES ('a@example.com');

-- This INSERT fails with a duplicate key violation:
INSERT INTO users (email) VALUES ('a@example.com');
-- ERROR: duplicate key value violates unique constraint "uq_users_email"
-- DETAIL:  Key (email)=(a@example.com) already exists.

-- NULL is allowed multiple times (PostgreSQL behaviour):
INSERT INTO users (email) VALUES (NULL);  -- succeeds
INSERT INTO users (email) VALUES (NULL);  -- also succeeds`,
    bestPractice:
      'Prefer UNIQUE constraints (ALTER TABLE … ADD CONSTRAINT … UNIQUE) over standalone UNIQUE indexes when the goal is integrity enforcement — they are semantically clearer and the planner treats them identically. Use a standalone UNIQUE index when you need partial uniqueness (e.g., UNIQUE WHERE deleted_at IS NULL) which constraints cannot express.',
    source: 'PostgreSQL Docs — Chapter 11.6: Unique Indexes',
  },

  {
    id: 'b07',
    topic: 'EXPLAIN Output',
    question: 'In PostgreSQL, what does the `EXPLAIN` command show you?',
    code: `EXPLAIN SELECT * FROM orders WHERE customer_id = 42;`,
    options: [
      'The SQL standard version of your query after automatic rewriting',
      'The query execution plan the planner intends to use, including node types, estimated costs, and row counts',
      'A list of all indexes on the tables referenced in the query',
      'The wall-clock time the query took to execute',
    ],
    correctIndex: 1,
    explanation:
      'EXPLAIN outputs the planner\'s chosen execution plan tree before actually running the query. Each node shows the plan type (Seq Scan, Index Scan, Hash Join, etc.), estimated startup cost, estimated total cost, and estimated row count. Adding ANALYZE causes the query to execute and overlays actual timings and row counts, revealing estimation errors. EXPLAIN alone is safe to run on production — it does not execute DML and does not return data.',
    compiledJS: `EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;
/*
Index Scan using idx_orders_customer_id on orders
  (cost=0.43..8.45 rows=1 width=72)
  (actual time=0.041..0.044 rows=1 loops=1)
  Index Cond: (customer_id = 42)
Buffers: shared hit=3
Planning Time: 0.128 ms
Execution Time: 0.063 ms
*/
-- "cost=startup..total"  — planner estimates in arbitrary cost units
-- "rows=1"               — estimated vs actual row count
-- "Buffers: shared hit"  — pages served from shared_buffers (no disk I/O)`,
    bestPractice:
      'Always use EXPLAIN (ANALYZE, BUFFERS) — the BUFFERS option reveals whether pages were served from cache (shared hit) or disk (read), which is critical for diagnosing I/O bottlenecks. In production use EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) and pipe the output to a visualizer like explain.dalibo.com for complex multi-join plans.',
    source: 'PostgreSQL Docs — Chapter 14.1: Using EXPLAIN',
  },

  {
    id: 'b08',
    topic: 'Clustered Index',
    question: 'What is the key difference between a clustered and a non-clustered index?',
    code: null,
    options: [
      'A clustered index stores the actual row data in index order; a non-clustered index stores only pointers to the data rows',
      'A clustered index can only be on a single column; non-clustered indexes support multiple columns',
      'Non-clustered indexes are faster for all query types',
      'Clustered indexes require more disk space than non-clustered indexes',
    ],
    correctIndex: 0,
    explanation:
      'In a clustered index (InnoDB\'s PRIMARY KEY, or a table CLUSTERed in PostgreSQL), the leaf pages of the index contain the actual row data, so a range scan by the clustered key reads rows in physical order with minimal random I/O. A non-clustered index stores only key values and TID (tuple ID) pointers; fetching the actual row requires a separate heap lookup called a "heap fetch" or "table lookup." PostgreSQL\'s CLUSTER command physically reorders heap pages to match an index once, but the ordering is not maintained on subsequent writes.',
    compiledJS: `-- In PostgreSQL, physically reorder heap pages to match an index (one-time)
CLUSTER orders USING idx_orders_created_at;

-- Verify row correlation (1.0 = perfectly correlated, 0 = random)
SELECT attname, correlation
FROM pg_stats
WHERE tablename = 'orders' AND attname = 'created_at';
-- correlation: 0.9998 → range scans on created_at benefit greatly`,
    bestPractice:
      'PostgreSQL does not maintain clustering automatically — run CLUSTER periodically on tables with high range-scan workloads (e.g., time-series tables queried by date range). For new tables use BRIN indexes instead of CLUSTER when physical ordering is naturally preserved (append-only inserts), as BRIN is far cheaper to maintain.',
    source: 'PostgreSQL Docs — Chapter 11.10: Use of Indexes; Use The Index, Luke — Clustered Indexes',
  },

  {
    id: 'b09',
    topic: 'Low-Cardinality Columns',
    question: 'Why are indexes on low-cardinality columns (e.g., a boolean `is_active`) often ineffective?',
    code: null,
    options: [
      'The database cannot build B-Tree indexes on boolean columns',
      'When a column has very few distinct values, an index scan may touch most of the table, making a sequential scan cheaper',
      'Low-cardinality indexes are automatically dropped by the database engine',
      'Indexes on booleans require a special storage engine not available in standard PostgreSQL',
    ],
    correctIndex: 1,
    explanation:
      'Index selectivity is the ratio of distinct values to total rows. A boolean column has at most 2 distinct values, so each value corresponds to roughly 50% of all rows. When the planner estimates that 50% of the table matches the predicate, the random I/O cost of following ~500,000 TID pointers through the index typically exceeds the cost of a single sequential pass. The planner\'s cost model computes this and opts for the seq scan. The same issue applies to status columns with 3–5 values unless most rows are in one state and queries target a rare minority.',
    compiledJS: `-- Low-cardinality index is often ignored by the planner:
CREATE INDEX idx_users_is_active ON users (is_active);

EXPLAIN SELECT * FROM users WHERE is_active = true;
-- Seq Scan on users  (cost=0.00..24500.00 rows=950000 width=88)
-- Index ignored because ~95% of rows are active.

-- Better: partial index only on the interesting minority
CREATE INDEX idx_users_inactive ON users (id)
WHERE is_active = false;

EXPLAIN SELECT * FROM users WHERE is_active = false;
-- Index Scan using idx_users_inactive on users`,
    bestPractice:
      'Replace a full index on a low-cardinality column with a partial index covering only the rare/interesting subset of rows (e.g., WHERE status = \'pending\' for a queue table where pending rows are a small minority). The partial index is smaller, faster to scan, and cheaper to maintain than a full index the planner would usually ignore.',
    source: 'Use The Index, Luke — Index Selectivity; PostgreSQL Docs — Chapter 11.8: Partial Indexes',
  },

  {
    id: 'b10',
    topic: 'Index Maintenance on DML',
    question: "What happens to an index when you update a row's indexed column?",
    code: null,
    options: [
      'Nothing — indexes are refreshed only during the next VACUUM',
      'The old index entry is deleted and a new entry is inserted to reflect the updated value',
      'The entire index is rebuilt from scratch after every UPDATE',
      'The index entry is marked as invalid until the next SELECT is executed',
    ],
    correctIndex: 1,
    explanation:
      'In PostgreSQL, an UPDATE on an indexed column is implemented as a DELETE + INSERT at the heap level (MVCC writes a new tuple version). The index must reflect both operations: the old key entry is marked dead (pointing to the old dead tuple) and a new entry is inserted pointing to the new heap location. This means updating a row that has N indexes requires N old-entry invalidations and N new-entry insertions — heavy UPDATE workloads on heavily-indexed tables suffer significant write amplification. VACUUM later reclaims the dead index entries.',
    compiledJS: `-- Before UPDATE: index has entry key=100 → TID(0,1)
UPDATE orders SET customer_id = 200 WHERE id = 1;

-- After UPDATE (MVCC):
--   Heap: old tuple TID(0,1) xmax=txid (dead), new tuple TID(0,2) xmin=txid
--   Index: old entry customer_id=100 → TID(0,1) [dead, awaiting VACUUM]
--          new entry customer_id=200 → TID(0,2) [live]

-- View dead tuple accumulation:
SELECT n_dead_tup, n_live_tup
FROM pg_stat_user_tables WHERE relname = 'orders';`,
    bestPractice:
      'Minimize indexes on columns that are frequently updated (status fields, counters, timestamps). If you must index such a column, enable autovacuum aggressively (lower autovacuum_vacuum_scale_factor) to reclaim dead entries before index bloat degrades performance. Consider HOT (Heap Only Tuple) updates — PostgreSQL uses them automatically when no indexed column changes, avoiding index writes entirely.',
    source: 'PostgreSQL Docs — Chapter 24.1: Routine Vacuuming; DDIA — Chapter 3: Update-in-place vs append-only',
  },

  // ── Intermediate (i01–i10) ──────────────────────────────────────────────────

  {
    id: 'i01',
    topic: 'B-Tree Traversal',
    question: 'When the B-Tree index is traversed to find a key value, what is the time complexity of the search?',
    code: null,
    options: [
      'O(n) — linear in the number of rows',
      'O(log n) — logarithmic in the number of rows',
      'O(1) — constant time regardless of table size',
      'O(n²) — quadratic in the number of rows',
    ],
    correctIndex: 1,
    explanation:
      'A B-Tree maintains balance: every leaf is at the same depth from the root. At each internal node the search compares the target key against the node\'s sorted key array and descends to the appropriate child. With a branching factor (fan-out) of several hundred, a B-Tree over 1 billion rows is only ~5–6 levels deep. This means locating any key requires at most O(log n) page reads — typically 2–4 I/Os for production-sized tables when the upper levels are cached in buffer pool memory.',
    compiledJS: `-- Visualise B-Tree depth for a large table
SELECT
  level,
  count(*) AS pages_at_level
FROM bt_page_stats('idx_orders_customer_id', generate_series(1,5))  -- pgstattuple extension
GROUP BY level ORDER BY level;

-- Practical depth check via pageinspect extension
SELECT type, live_items, avg_item_size
FROM bt_page_stats('idx_orders_customer_id', 1);
-- root page → internal pages → leaf pages
-- For 10M rows with 4-byte keys, depth ≈ 3–4 levels`,
    bestPractice:
      'B-Tree\'s O(log n) complexity means indexes remain fast as tables grow to hundreds of millions of rows — but only if the tree stays balanced and the upper levels stay cached. Monitor shared_buffers hit ratio for critical indexes. If the root and upper internal pages are not cached, each query incurs extra disk reads. Size shared_buffers so hot index pages stay resident.',
    source: 'DDIA — Chapter 3: B-Trees; PostgreSQL Docs — Chapter 67: B-Tree Indexes',
  },

  {
    id: 'i02',
    topic: 'Hash Index vs B-Tree',
    question: 'Which statement correctly contrasts a hash index with a B-Tree index?',
    code: null,
    options: [
      'Hash indexes support range queries (>, <, BETWEEN); B-Trees do not',
      'Hash indexes offer O(1) equality lookups but cannot support range queries or ORDER BY; B-Trees support all of these',
      'Hash indexes store data in sorted order, making range scans very fast',
      'B-Tree and hash indexes have identical performance characteristics; the choice is purely cosmetic',
    ],
    correctIndex: 1,
    explanation:
      'A hash index computes a hash of each key value and stores it in a hash table, giving O(1) average-case equality lookups — there is no tree traversal. However, hashing destroys the ordering information that B-Trees preserve. Without ordering, the engine cannot satisfy range predicates (>, <, BETWEEN), sort requirements (ORDER BY), or prefix matching (LIKE \'foo%\'). In PostgreSQL 10+ hash indexes are WAL-logged and crash-safe, making them a viable alternative to B-Trees for pure equality workloads on high-cardinality columns.',
    compiledJS: `-- Create a hash index for pure equality workloads
CREATE INDEX idx_sessions_token_hash ON sessions USING HASH (token);

-- Works: O(1) equality
EXPLAIN SELECT * FROM sessions WHERE token = 'abc123';
-- Index Scan using idx_sessions_token_hash on sessions

-- Does NOT work: range predicates fall back to Seq Scan
EXPLAIN SELECT * FROM sessions WHERE token > 'abc123';
-- Seq Scan on sessions (hash index cannot satisfy range)`,
    bestPractice:
      'Use hash indexes for UUID or token lookups where you only ever use = equality and the column has very high cardinality. Stick with B-Tree (the default) for everything else — B-Tree handles equality, ranges, ORDER BY, and prefix LIKE patterns with a single structure. The O(1) vs O(log n) difference rarely matters in practice since B-Tree upper levels are typically cache-resident.',
    source: 'PostgreSQL Docs — Chapter 11.2: Index Types; Use The Index, Luke — Hash Indexes',
  },

  {
    id: 'i03',
    topic: 'Composite Index',
    question: 'Given a composite index on `(last_name, first_name)`, which WHERE clause can use the index efficiently?',
    code: `CREATE INDEX idx_name ON users (last_name, first_name);`,
    options: [
      '`WHERE first_name = \'Alice\'` (skipping `last_name`)',
      '`WHERE last_name = \'Smith\'`',
      '`WHERE first_name = \'Alice\' AND last_name = \'Smith\'` — only when both columns appear',
      'Neither column can use the index unless the query includes all indexed columns',
    ],
    correctIndex: 1,
    explanation:
      'A composite B-Tree index is sorted first by the leading column, then by subsequent columns within equal leading-column values. Queries that filter on `last_name` (the leading column) can perform a range seek into the index, finding the subtree for "Smith" in O(log n). Queries on `first_name` alone cannot seek because `first_name` values are interleaved across different `last_name` subtrees — the engine would need to scan the entire index. Both columns together also benefit, as does last_name with a range on first_name.',
    compiledJS: `-- Efficient: uses leading column
EXPLAIN SELECT * FROM users WHERE last_name = 'Smith';
-- Index Scan using idx_name on users
--   Index Cond: ((last_name)::text = 'Smith'::text)

-- Efficient: uses both columns
EXPLAIN SELECT * FROM users WHERE last_name = 'Smith' AND first_name = 'Alice';
-- Index Scan using idx_name on users
--   Index Cond: (last_name = 'Smith' AND first_name = 'Alice')

-- Inefficient: skips leading column — full index scan or seq scan
EXPLAIN SELECT * FROM users WHERE first_name = 'Alice';
-- Seq Scan on users  (leading column not filtered)`,
    bestPractice:
      'Order composite index columns from most-selective / most-frequently-filtered to least. Put equality-filtered columns before range-filtered columns — range predicates on an intermediate column break the leading-column prefix and prevent further index key narrowing. When unsure, create the index in the order WHERE conditions appear in your most critical query.',
    source: 'Use The Index, Luke — The Column Order of a Composite Index; PostgreSQL Docs — Chapter 11.3: Multicolumn Indexes',
  },

  {
    id: 'i04',
    topic: 'Covering Index',
    question: 'What is a covering index?',
    code: null,
    options: [
      'An index that spans every column in the table',
      'An index that contains all columns needed to satisfy a query, allowing the engine to return results from the index alone without accessing the table heap',
      'An index that automatically expands to cover new columns as they are added to the table',
      'An index that covers NULL values that standard indexes would normally skip',
    ],
    correctIndex: 1,
    explanation:
      'When every column referenced in a query (SELECT list, WHERE clause, ORDER BY) is present in the index — either as a key column or via the INCLUDE clause — the database can answer the query entirely from index pages, eliminating the expensive heap fetch (random I/O back to the data pages). This is called an "index-only scan" in PostgreSQL. The INCLUDE clause allows non-key columns to ride along in leaf pages without affecting index ordering, preventing index key bloat.',
    compiledJS: `-- Covering index with INCLUDE for non-key payload columns
CREATE INDEX idx_orders_covering
  ON orders (customer_id)
  INCLUDE (amount, created_at);

-- Index-Only Scan: zero heap fetches
EXPLAIN (ANALYZE, BUFFERS)
SELECT customer_id, amount, created_at
FROM orders
WHERE customer_id = 42;
/*
Index Only Scan using idx_orders_covering on orders
  (cost=0.43..4.45 rows=1 width=20)
  (actual time=0.018..0.021 rows=1 loops=1)
  Heap Fetches: 0    ← no heap access
*/`,
    bestPractice:
      'Use INCLUDE to add frequently SELECTed columns without widening the index key. Avoid including too many columns — wide covering indexes consume more memory in shared_buffers and slow down writes. Identify the 2–3 most common SELECT patterns on a hot table and build a targeted covering index for each rather than one giant index.',
    source: 'PostgreSQL Docs — Chapter 11.9: Index-Only Scans and Covering Indexes',
  },

  {
    id: 'i05',
    topic: 'Index Selectivity',
    question: 'What is index selectivity, and why does it matter to the query planner?',
    code: null,
    options: [
      'The number of pages the index occupies on disk; higher page counts mean faster scans',
      'The ratio of distinct values to total rows; high selectivity means few rows per key value, making the index more useful for lookups',
      'Whether the index was created on a primary key column',
      'The percentage of queries in the workload that reference the indexed column',
    ],
    correctIndex: 1,
    explanation:
      'Selectivity = distinct values / total rows. A selectivity near 1.0 (e.g., an email column with 1M distinct values in 1M rows) means each predicate matches very few rows, so the index can efficiently narrow the result set. A selectivity near 0 (boolean with 2 distinct values) means each predicate still matches half the table, negating the index\'s benefit. The planner uses column statistics (pg_stats.n_distinct, histogram_bounds) to estimate row counts and choose between index and sequential scans accordingly.',
    compiledJS: `-- Inspect selectivity statistics for a column
SELECT
  attname,
  n_distinct,
  correlation,
  most_common_vals,
  most_common_freqs
FROM pg_stats
WHERE tablename = 'orders' AND attname = 'customer_id';
/*
attname     | customer_id
n_distinct  | 50000        -- 50k distinct customers
correlation | 0.0023       -- values are randomly distributed in heap
most_common_vals  | {42,17,99,...}
most_common_freqs | {0.0001,...}  -- each customer ≈ 0.01% of rows → high selectivity
*/`,
    bestPractice:
      'Run ANALYZE regularly (autovacuum handles this, but run it manually after bulk loads) so the planner has accurate statistics. For skewed distributions — where a few values appear very frequently — use CREATE STATISTICS to build extended statistics on column correlations. Use pg_stats.most_common_freqs to identify low-selectivity values that will trigger seq scans even with an index.',
    source: 'PostgreSQL Docs — Chapter 14.2: Statistics Used by the Planner; Use The Index, Luke — Index Selectivity',
  },

  {
    id: 'i06',
    topic: 'Partial Index',
    question: 'What is a partial index in PostgreSQL?',
    code: null,
    options: [
      'An index built on only the first N bytes of a text column',
      'An index that includes only rows satisfying a WHERE predicate, reducing its size and maintenance cost',
      'An index that covers only half of a composite key',
      'An index automatically created by the planner for a single query execution',
    ],
    correctIndex: 1,
    explanation:
      'A partial index is defined with a WHERE clause that restricts which rows are indexed. Only rows matching the predicate are stored in the index structure, making it smaller and faster to maintain than a full index. The planner can use a partial index only for queries whose WHERE clause is logically implied by the index predicate. Classic use cases: indexing only unprocessed queue items (WHERE status = \'pending\'), only non-deleted rows (WHERE deleted_at IS NULL), or only rows in a certain state.',
    compiledJS: `-- Full index on status: large, mostly unused for rare values
-- CREATE INDEX idx_orders_status ON orders (status);

-- Partial index: only index pending orders (1% of table)
CREATE INDEX idx_orders_pending
  ON orders (created_at)
WHERE status = 'pending';

-- Planner uses the partial index:
EXPLAIN SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at;
/*
Index Scan using idx_orders_pending on orders
  (cost=0.43..320.00 rows=500 width=72)
-- Tiny index, very fast
*/

-- Query WITHOUT status = 'pending' cannot use this index:
EXPLAIN SELECT * FROM orders WHERE status = 'shipped' ORDER BY created_at;
-- Seq Scan (partial index predicate not satisfied)`,
    bestPractice:
      'Partial indexes are one of the highest-leverage optimizations available: they can reduce index size by 10–100x for skewed distributions, dramatically improve write throughput on the indexed table, and keep the working set in shared_buffers small. Use them liberally for queue-pattern tables, soft-delete patterns, and any column with a "hot minority" of rows.',
    source: 'PostgreSQL Docs — Chapter 11.8: Partial Indexes',
  },

  {
    id: 'i07',
    topic: 'Function-Based Index',
    question: 'What is a function-based (expression) index?',
    code: null,
    options: [
      'An index stored as a stored procedure that regenerates itself nightly',
      'An index built on the result of an expression or function applied to one or more columns, enabling index scans on computed predicates',
      'An index that triggers a user-defined function whenever a row is inserted',
      "An index whose key values are encrypted using a hash function for security",
    ],
    correctIndex: 1,
    explanation:
      'A function-based index stores the pre-computed result of an expression (e.g., lower(email), date_trunc(\'month\', created_at), or a JSON extraction) as the index key. When a query\'s WHERE clause uses the same expression, the planner can seek directly into the index instead of computing the expression for every row and scanning. The function must be IMMUTABLE (same input always produces the same output) so the stored value remains valid across rows.',
    compiledJS: `-- Case-insensitive email lookup without function index: Seq Scan
EXPLAIN SELECT * FROM users WHERE lower(email) = 'alice@example.com';
-- Seq Scan (function computed per row)

-- Create expression index
CREATE INDEX idx_users_lower_email ON users (lower(email));

-- Now uses the index:
EXPLAIN SELECT * FROM users WHERE lower(email) = 'alice@example.com';
/*
Index Scan using idx_users_lower_email on users
  (cost=0.43..8.45 rows=1 width=88)
  Index Cond: (lower(email) = 'alice@example.com'::text)
*/`,
    bestPractice:
      'Expression indexes are powerful but add write overhead because the expression is re-evaluated on every INSERT/UPDATE to the indexed column. Ensure the expression is truly IMMUTABLE. For JSON columns, prefer generated columns (GENERATED ALWAYS AS (payload->\'field\') STORED) combined with a regular index — this separates the expression cost from the index maintenance path and makes the computed value queryable without the expression syntax.',
    source: "PostgreSQL Docs — Chapter 11.7: Indexes on Expressions",
  },

  {
    id: 'i08',
    topic: 'VACUUM',
    question: 'What is index bloat and how does VACUUM help in PostgreSQL?',
    code: null,
    options: [
      'Index bloat occurs when an index has too many columns; VACUUM removes extra columns automatically',
      'Index bloat is the accumulation of dead tuple references in index pages from UPDATEs and DELETEs; VACUUM reclaims those pages and marks them reusable',
      'Index bloat means the index file exceeds the size of the table; VACUUM compresses both to the same size',
      'Index bloat is caused by too many concurrent reads; VACUUM resets read counters',
    ],
    correctIndex: 1,
    explanation:
      'PostgreSQL\'s MVCC model never updates a row in-place; every UPDATE writes a new tuple version and leaves the old one as a dead tuple. Every index on the table then has dead entries pointing to these old versions. Over time these dead entries accumulate, inflating index size (bloat) and slowing scans because the engine reads more pages to find live entries. VACUUM scans the heap, identifies dead tuples no longer visible to any active transaction, then removes the corresponding index entries and reclaims the pages for reuse.',
    compiledJS: `-- Check index bloat using pgstattuple extension
SELECT
  index_name,
  index_size,
  leaf_pages,
  dead_leaf_pages,
  round(dead_leaf_pages::numeric / leaf_pages * 100, 2) AS bloat_pct
FROM (
  SELECT
    indexrelid::regclass AS index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size,
    (pgstatindex(indexrelid::regclass)).leaf_pages,
    (pgstatindex(indexrelid::regclass)).deleted_pages AS dead_leaf_pages
  FROM pg_index
  WHERE indrelid = 'orders'::regclass
) t;

-- Force rebuild if bloat > 30%
REINDEX INDEX CONCURRENTLY idx_orders_customer_id;`,
    bestPractice:
      'Configure autovacuum aggressively for hot tables: set autovacuum_vacuum_scale_factor = 0.01 (1% dead tuples triggers vacuum) rather than the default 20%. Monitor pg_stat_user_tables.n_dead_tup and pg_stat_user_tables.last_autovacuum. For indexes with >20% bloat despite regular autovacuum, run REINDEX CONCURRENTLY during a low-traffic window to rebuild without locking the table.',
    source: 'PostgreSQL Docs — Chapter 24.1: Routine Vacuuming; DDIA — Chapter 3: B-Tree compaction',
  },

  {
    id: 'i09',
    topic: 'Planner Ignoring Index',
    question: 'Why might the PostgreSQL query planner ignore an index even when one exists on the filtered column?',
    code: null,
    options: [
      'PostgreSQL never ignores an index once it is created — it is always used',
      'The planner\'s cost model estimates that a sequential scan is cheaper, often because the predicate matches a large fraction of rows or table statistics are stale',
      'The index can only be used if the query includes an ORDER BY clause on the indexed column',
      'Indexes are only used for JOIN operations, never for WHERE clause filtering',
    ],
    correctIndex: 1,
    explanation:
      'The planner is cost-based: it estimates the total cost of each candidate plan and chooses the cheapest. If table statistics (pg_stats) suggest that the WHERE predicate matches a large fraction of rows, the estimated cost of random heap fetches via the index exceeds the cost of a sequential scan (which benefits from read-ahead prefetching). Common causes: stale statistics after a large bulk load (fix: run ANALYZE), a low-selectivity predicate, or the table fits entirely in shared_buffers making seq scan essentially free.',
    compiledJS: `-- Statistics show why the planner ignores an index
SELECT
  tablename, attname,
  n_distinct,
  most_common_vals,
  most_common_freqs[1] AS top_val_freq
FROM pg_stats
WHERE tablename = 'orders' AND attname = 'status';
/*
top_val_freq = 0.92  → 92% of rows have status='completed'
Planner correctly skips index for WHERE status = 'completed'
*/

-- Force statistics update after bulk data change
ANALYZE orders;

-- Temporarily disable seq scan to test what index scan costs
SET enable_seqscan = off;
EXPLAIN SELECT * FROM orders WHERE status = 'completed';
RESET enable_seqscan;`,
    bestPractice:
      'Before concluding an index is "broken," verify statistics freshness with SELECT last_analyze FROM pg_stat_user_tables. Run ANALYZE and re-check the plan. If the planner still ignores the index and you are confident it should be used, investigate whether the query predicate can be rewritten, whether a partial index would improve selectivity, or whether the random_page_cost GUC needs tuning for your storage type (SSDs warrant lower values like 1.1 vs the default 4.0).',
    source: 'PostgreSQL Docs — Chapter 14.3: Controlling the Planner with Explicit JOIN Clauses; Use The Index, Luke — When the Planner Ignores Indexes',
  },

  {
    id: 'i10',
    topic: 'LIKE and Index Usage',
    question: "Given a B-Tree index on a `name` column, which LIKE pattern can use the index?",
    code: `CREATE INDEX idx_users_name ON users (name);`,
    options: [
      "`WHERE name LIKE '%smith'` (suffix wildcard)",
      "`WHERE name LIKE '%smith%'` (both sides wildcard)",
      "`WHERE name LIKE 'smith%'` (prefix wildcard)",
      'None — LIKE never uses a B-Tree index',
    ],
    correctIndex: 2,
    explanation:
      'A B-Tree index stores keys in sorted lexicographic order. A prefix wildcard (`\'smith%\'`) translates directly to a range scan: seek to the first key >= \'smith\' and scan forward until keys no longer start with \'smith\'. A leading wildcard (`\'%smith\'` or `\'%smith%\'`) cannot benefit from sorted order because the common prefix is unknown — the engine must evaluate the pattern against every key, effectively making it a full index scan. In PostgreSQL, the column must use a deterministic collation (e.g., C or ICU with text_pattern_ops operator class) for prefix LIKE to use a B-Tree.',
    compiledJS: `-- Works with prefix wildcard (requires C collation or text_pattern_ops)
CREATE INDEX idx_users_name_pattern
  ON users (name text_pattern_ops);

EXPLAIN SELECT * FROM users WHERE name LIKE 'smith%';
/*
Index Scan using idx_users_name_pattern on users
  Index Cond: ((name ~>=~ 'smith'::text) AND (name ~<~ 'smitI'::text))
*/

-- Does NOT use index (leading wildcard)
EXPLAIN SELECT * FROM users WHERE name LIKE '%smith';
-- Seq Scan on users  Filter: ((name)::text ~~ '%smith'::text)

-- For suffix/substring searches use pg_trgm + GIN index instead:
CREATE INDEX idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);
EXPLAIN SELECT * FROM users WHERE name LIKE '%smith%';
-- Bitmap Index Scan using idx_users_name_trgm`,
    bestPractice:
      'For suffix or substring LIKE patterns, install the pg_trgm extension and create a GIN index with gin_trgm_ops — it supports arbitrary LIKE/ILIKE patterns including leading wildcards. For full-text search on prose, use tsvector + GIN. Avoid leading wildcards in B-Tree columns entirely; redesign queries to use trigram or full-text indexes or rewrite to prefix scans where possible.',
    source: 'PostgreSQL Docs — Chapter 11.5: Operator Classes and Operator Families; Use The Index, Luke — Wildcard LIKE',
  },

  // ── Advanced (a01–a10) ──────────────────────────────────────────────────────

  {
    id: 'a01',
    topic: 'GiST / GIN / BRIN',
    question: 'Which PostgreSQL index type is designed for geometric and spatial data types such as points, boxes, and polygons?',
    code: null,
    options: [
      'GIN (Generalized Inverted Index)',
      'BRIN (Block Range INdex)',
      'GiST (Generalized Search Tree)',
      'SP-GiST (Space-Partitioned GiST)',
    ],
    correctIndex: 2,
    explanation:
      'GiST (Generalized Search Tree) is an extensible index framework that supports arbitrary index structures through a plug-in interface. Built-in GiST operator classes handle geometric types (point, box, polygon, circle), range types (int4range, tstzrange), full-text tsvector, and network address types (inet). GiST enables operators like containment (@>), overlap (&&), and nearest-neighbour searches (ORDER BY ... <->) that standard B-Trees cannot express. The PostGIS extension uses GiST heavily for spatial queries.',
    compiledJS: `-- GiST index for 2D point nearest-neighbour search
CREATE INDEX idx_locations_point
  ON locations USING GIST (coordinates);

-- KNN query using GiST index
EXPLAIN SELECT name, coordinates
FROM locations
ORDER BY coordinates <-> point(40.7128, -74.0060)  -- distance to NYC
LIMIT 10;
/*
Limit  (rows=10)
  ->  Index Scan using idx_locations_point on locations
        Order By: (coordinates <-> '(40.7128,-74.006)'::point)
-- GiST enables ORDER BY distance without a seq scan
*/

-- Range type overlap query
CREATE INDEX idx_reservations_period
  ON reservations USING GIST (period);
SELECT * FROM reservations WHERE period && '[2024-01-01,2024-01-07)';`,
    bestPractice:
      'Choose the index type based on the operators your queries use: GiST for spatial/range/overlap, GIN for array containment/full-text search, BRIN for append-only time-series, B-Tree for everything else. Install PostGIS for production geospatial workloads — it provides optimised GiST operator classes and spatial functions far beyond the built-in geometric types.',
    source: 'PostgreSQL Docs — Chapter 11.2: Index Types; PostgreSQL Docs — Chapter 68: GiST Indexes',
  },

  {
    id: 'a02',
    topic: 'Full-Text GIN Index',
    question: 'A GIN (Generalized Inverted Index) is most appropriate for which type of column?',
    code: null,
    options: [
      'A single-value integer primary key',
      'A column containing composite values such as arrays, JSONB, or `tsvector` full-text search documents',
      'A monotonically increasing timestamp column in an append-only table',
      'A low-cardinality boolean column',
    ],
    correctIndex: 1,
    explanation:
      'GIN builds an inverted index over the individual elements of composite values. For a tsvector column, GIN indexes every lexeme (normalised word) and maps it to the list of document IDs containing it — the classic inverted index structure used by search engines. For JSONB columns, GIN indexes every JSON key and value. For array columns, GIN indexes every array element. The containment operators @> and <@ and the full-text search operator @@ then use these inverted maps for fast multi-element lookups.',
    compiledJS: `-- Full-text search with GIN index
ALTER TABLE articles ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,''))
  ) STORED;

CREATE INDEX idx_articles_fts ON articles USING GIN (search_vector);

-- Full-text search query
EXPLAIN SELECT id, title FROM articles
WHERE search_vector @@ to_tsquery('english', 'database & index');
/*
Bitmap Index Scan using idx_articles_fts on articles
  Recheck Cond: (search_vector @@ to_tsquery('english', 'database & index'))
*/

-- JSONB containment with GIN
CREATE INDEX idx_events_payload ON events USING GIN (payload);
SELECT * FROM events WHERE payload @> '{"type": "click"}';`,
    bestPractice:
      'GIN indexes are fast for reads but slow to update because each element maps to a potentially large posting list. Use the fastupdate GIN storage parameter (on by default) which batches pending insertions in a list and merges them lazily. For real-time insert-heavy full-text workloads, consider GiST with tsvector — GiST updates faster but queries slightly slower than GIN.',
    source: 'PostgreSQL Docs — Chapter 70: GIN Indexes',
  },

  {
    id: 'a03',
    topic: 'LSM-Tree',
    question: "What is 'write amplification' in the context of LSM-tree (Log-Structured Merge-tree) indexes?",
    code: null,
    options: [
      'Each logical write is physically written multiple times across different levels of the LSM tree during compaction',
      'The database writes a redundant copy of every row to the transaction log',
      "Write amplification refers to the overhead of updating a B-Tree's parent nodes after a leaf split",
      'It is the extra latency caused by flushing the write-ahead log to disk',
    ],
    correctIndex: 0,
    explanation:
      'LSM trees absorb writes into an in-memory buffer (MemTable), then flush to immutable sorted string tables (SSTables) on disk. To prevent unbounded growth, background compaction merges and rewrites SSTables from level L into level L+1. A key written once may be physically rewritten 5–50 times as it migrates through compaction levels. This write amplification factor means SSDs wear out faster and compaction I/O competes with foreground queries. RocksDB, Cassandra, ScyllaDB, and LevelDB all use LSM trees and expose write amplification metrics.',
    compiledJS: `-- RocksDB / Cassandra style LSM write flow (conceptual SQL analogy)

-- Level 0: recent writes (unsorted, overlapping key ranges)
-- L0: [SSTable-a: keys 1-100], [SSTable-b: keys 50-200]  ← written fast

-- Compaction merges L0 into L1 (sorted, non-overlapping)
-- L1: [keys 1-49], [keys 50-100], [keys 101-200]
-- Each key rewritten once more → write amplification ×2

-- L1 eventually compacts into L2 → each key rewritten again
-- A key written once may be physically written 10-30× total

-- Monitor write amplification in RocksDB:
-- db.GetProperty("rocksdb.stats")
-- Look for: "Write Amplification" metric

-- In PostgreSQL: WAL + heap + N index pages = write amplification
-- Every UPDATE writes: 1 WAL record + 1 heap page + N index pages`,
    bestPractice:
      'LSM trees optimise for write throughput at the cost of read amplification (must search multiple SSTables) and write amplification (compaction). Choose LSM-based storage (Cassandra, RocksDB) for append-heavy, write-intensive workloads. Tune the level size ratio and compaction strategy (Leveled vs Size-Tiered) to balance write vs read amplification. Monitor compaction I/O — excessive compaction can saturate disk bandwidth and starve foreground reads.',
    source: 'DDIA — Chapter 3: SSTables and LSM-Trees; RocksDB Wiki — Write Amplification',
  },

  {
    id: 'a04',
    topic: 'CREATE INDEX CONCURRENTLY',
    question: 'What is the purpose of `CREATE INDEX CONCURRENTLY` in PostgreSQL?',
    code: `CREATE INDEX CONCURRENTLY idx_orders_customer_id
ON orders (customer_id);`,
    options: [
      'It builds the index on multiple CPU cores simultaneously to reduce build time',
      'It builds the index without taking an exclusive table lock, allowing concurrent reads and writes during index creation at the cost of a longer build time',
      'It creates the index on a replica before promoting it to the primary, avoiding downtime',
      'It defers index enforcement until after a COMMIT, improving transaction throughput',
    ],
    correctIndex: 1,
    explanation:
      'Standard CREATE INDEX takes a ShareLock on the table, blocking all writes until the build completes — unacceptable for production tables receiving continuous traffic. CREATE INDEX CONCURRENTLY performs three passes: first building the index structure, then scanning for rows modified during the first pass, then waiting for all open transactions to complete before marking the index valid. This means no exclusive lock is held, but the build takes 2–3× longer and the index remains in the "not ready" state until all passes finish.',
    compiledJS: `-- Safe for production: no write blocking
CREATE INDEX CONCURRENTLY idx_orders_customer_id
  ON orders (customer_id);

-- Monitor build progress (PostgreSQL 12+)
SELECT
  phase,
  blocks_done,
  blocks_total,
  round(blocks_done::numeric / nullif(blocks_total,0) * 100, 1) AS pct_done
FROM pg_stat_progress_create_index
WHERE relid = 'orders'::regclass;

-- If the build fails mid-way, an INVALID index remains:
SELECT indexname, indisvalid
FROM pg_indexes
JOIN pg_index ON indexrelid = (SELECT oid FROM pg_class WHERE relname = indexname)
WHERE tablename = 'orders';
-- indisvalid = false → DROP INDEX CONCURRENTLY and retry`,
    bestPractice:
      'Always use CREATE INDEX CONCURRENTLY on production tables that receive writes. If the concurrent build fails (e.g., due to a lock timeout or connection drop), the invalid index must be dropped before retrying — it consumes space and write overhead without being usable. Wrap index creation in a deployment script that checks pg_indexes.indisvalid after creation and alerts if the index is invalid.',
    source: 'PostgreSQL Docs — Chapter 11.12: Building Indexes Concurrently',
  },

  {
    id: 'a05',
    topic: 'Invisible Index',
    question: "What is an 'invisible index' (supported in MySQL 8+ and Oracle) and what is its primary use case?",
    code: null,
    options: [
      'An index encrypted at rest so its contents cannot be read by unauthorized users',
      'An index that is maintained by the engine but hidden from the query planner, used to safely test the impact of dropping an index before actually removing it',
      'An index stored in memory only, never persisted to disk',
      'An index on system catalog tables that is not exposed in information_schema views',
    ],
    correctIndex: 1,
    explanation:
      'An invisible index continues to be maintained on every write (keeping it current), but the query optimizer ignores it as if it did not exist. This allows DBAs to simulate the effect of dropping an index by making it invisible, observe query plan changes and performance impact in production traffic, and then either make it visible again or permanently drop it — all without the risk of a DROP INDEX being irreversible. MySQL 8+ supports ALTER TABLE … ALTER INDEX … INVISIBLE. PostgreSQL does not have native invisible indexes, but the same effect can be approximated using SET enable_indexscan/enable_bitmapscan = off in a session.',
    compiledJS: `-- MySQL 8+ invisible index syntax
ALTER TABLE orders ALTER INDEX idx_orders_customer_id INVISIBLE;

-- Verify: optimizer ignores it
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;
-- Full Table Scan (index is invisible to optimizer)

-- Re-enable to restore original plan
ALTER TABLE orders ALTER INDEX idx_orders_customer_id VISIBLE;

-- PostgreSQL equivalent: session-level index disable for testing
SET enable_indexscan = off;
SET enable_bitmapscan = off;
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;
-- Seq Scan (simulates index absence)
RESET enable_indexscan;
RESET enable_bitmapscan;`,
    bestPractice:
      'Never drop an index in production without first testing the impact. Use invisible indexes (MySQL/Oracle) or session-level planner controls (PostgreSQL) to observe plan changes under real load before committing to removal. Also check pg_stat_user_indexes.idx_scan to confirm the index has zero (or near-zero) scans over a representative time window before dropping.',
    source: 'MySQL 8.0 Docs — Invisible Indexes; Use The Index, Luke — Safely Dropping Indexes',
  },

  {
    id: 'a06',
    topic: 'MVCC Dead Tuples',
    question: "How does PostgreSQL's MVCC (Multi-Version Concurrency Control) model contribute to index bloat over time?",
    code: null,
    options: [
      'MVCC compresses old row versions, causing indexes to fragment over time',
      'Every UPDATE creates a new heap tuple version while leaving the old version in place; both the old and new index entries coexist until VACUUM reclaims the dead tuples',
      'MVCC forces the index to store the transaction ID alongside every key, doubling its size',
      'MVCC has no effect on indexes — only heap pages accumulate dead tuples',
    ],
    correctIndex: 1,
    explanation:
      'PostgreSQL implements MVCC by never overwriting existing row data. An UPDATE marks the old tuple with an xmax (the transaction ID that obsoleted it) and writes a new tuple with a fresh xmin. Both heap tuples remain on disk and both corresponding index entries — one for the old version, one for the new — coexist in the index. Index entries do not store visibility information themselves; the planner must follow the TID pointer to the heap tuple and check its xmin/xmax against the current transaction snapshot to determine visibility. VACUUM identifies dead tuples (where xmax is older than all active transactions) and removes the stale index entries.',
    compiledJS: `-- Monitor MVCC dead tuple accumulation
SELECT
  relname,
  n_live_tup,
  n_dead_tup,
  round(n_dead_tup::numeric / nullif(n_live_tup + n_dead_tup, 0) * 100, 2) AS dead_pct,
  last_vacuum,
  last_autovacuum
FROM pg_stat_user_tables
WHERE relname = 'orders'
ORDER BY n_dead_tup DESC;

-- If dead_pct > 10% and no recent vacuum, trigger manually:
VACUUM ANALYZE orders;

-- For severe bloat, rebuild without locking:
REINDEX TABLE CONCURRENTLY orders;`,
    bestPractice:
      'Tune autovacuum per-table rather than globally for hot OLTP tables. Set storage parameters at the table level: ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000). This triggers autovacuum after just 1,000 + 1% dead tuples rather than the default 50,000 + 20%. On very high-write tables, also reduce autovacuum_vacuum_cost_delay to give autovacuum more I/O bandwidth.',
    source: 'PostgreSQL Docs — Chapter 24.1: Routine Vacuuming; PostgreSQL Docs — Chapter 74: MVCC',
  },

  {
    id: 'a07',
    topic: 'Bitmap Scan',
    question: 'When does the PostgreSQL planner choose a Bitmap Index Scan over a plain Index Scan?',
    code: null,
    options: [
      'When the query returns only a single row',
      'When multiple indexes must be combined (AND/OR) or when the estimated row count is moderate, allowing heap pages to be read once in physical order rather than via many random seeks',
      'When the table has no heap pages — data is stored in the index itself',
      'Bitmap Index Scan is always faster and is always preferred over a plain Index Scan',
    ],
    correctIndex: 1,
    explanation:
      'A plain Index Scan follows each TID pointer immediately to fetch the heap row — efficient for very selective queries returning a handful of rows. When the query returns a moderate number of rows (hundreds to thousands), random heap I/O becomes expensive. A Bitmap Index Scan instead collects all matching TIDs into an in-memory bitmap, sorts them by physical page location, then reads each heap page exactly once in sequential order. This converts random I/O into sequential I/O. Crucially, bitmap scans also allow BitmapAnd and BitmapOr nodes to combine multiple index scans before touching the heap.',
    compiledJS: `EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 42 OR status = 'pending';
/*
Bitmap Heap Scan on orders
  (cost=240.00..8500.00 rows=1200 width=72)
  Recheck Cond: ((customer_id = 42) OR (status = 'pending'))
  ->  BitmapOr
        ->  Bitmap Index Scan on idx_orders_customer_id
              Index Cond: (customer_id = 42)
        ->  Bitmap Index Scan on idx_orders_status
              Index Cond: (status = 'pending')
*/
-- Two separate indexes combined in memory before any heap access`,
    bestPractice:
      'The planner transitions from Index Scan → Bitmap Index Scan → Seq Scan as estimated row count increases. Understanding this continuum helps debug plan regressions: if a query suddenly switches from Index Scan to Seq Scan, the estimate likely jumped across the threshold. Use partial indexes or updated statistics to keep estimates accurate. For OR conditions spanning multiple columns, ensure each column has a dedicated index so BitmapOr can be used.',
    source: 'PostgreSQL Docs — Chapter 11.5: Combining Multiple Indexes; Use The Index, Luke — Bitmap Heap Scan',
  },

  {
    id: 'a08',
    topic: 'Partitioned Indexes',
    question: 'In a partitioned table, what is a key consideration when creating indexes to ensure all partitions benefit?',
    code: null,
    options: [
      'Indexes must be created on the partition key column only; other columns cannot be indexed',
      'Creating an index on the parent partitioned table in PostgreSQL 11+ automatically propagates the index to all existing and future partitions',
      'Each partition requires a manually created index with a unique name; there is no automatic propagation',
      'Partitioned tables do not support B-Tree indexes; only BRIN indexes are available',
    ],
    correctIndex: 1,
    explanation:
      'Since PostgreSQL 11, CREATE INDEX on a partitioned (declarative) table creates a "partitioned index" on the parent and automatically creates corresponding local indexes on all existing child partitions. New partitions attached later also automatically receive the index. Each child partition\'s index is an independent physical structure, so index maintenance stays local to each partition. This local-index approach means partition pruning eliminates irrelevant partition indexes from the plan, keeping index scans fast even with hundreds of partitions.',
    compiledJS: `-- Partitioned table with automatic index propagation (PG 11+)
CREATE TABLE orders (
  id          BIGSERIAL,
  created_at  TIMESTAMPTZ NOT NULL,
  customer_id INT
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024
  PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Create index on parent → propagates to all partitions
CREATE INDEX idx_orders_customer_id
  ON orders (customer_id);

-- Verify propagation
SELECT indexname, tablename
FROM pg_indexes
WHERE tablename LIKE 'orders%' AND indexname LIKE '%customer%';
-- idx_orders_customer_id on orders (partitioned)
-- orders_2024_customer_id_idx on orders_2024 (local)`,
    bestPractice:
      'Always create indexes on the parent partitioned table, never manually on individual child partitions — this ensures future partitions are automatically covered. For UNIQUE constraints on partitioned tables the constraint must include the partition key (PG limitation). Monitor per-partition index sizes with pg_relation_size to identify hot partitions that may need dedicated tuning or partial indexes.',
    source: 'PostgreSQL Docs — Chapter 5.11: Table Partitioning; PostgreSQL Docs — Chapter 11.11: Indexes and Table Partitioning',
  },

  {
    id: 'a09',
    topic: 'BRIN Index',
    question: 'What is a BRIN index and for which table characteristic is it best suited?',
    code: null,
    options: [
      'A block range index that stores min/max values per range of pages; best for large, physically ordered (correlated) columns like `created_at` in append-only tables',
      'A balanced range index that replaces B-Trees for all numeric columns',
      'A bitmap range index used to speed up bitmap heap scans on random data',
      'A binary range index that only works with UUID primary keys',
    ],
    correctIndex: 0,
    explanation:
      'BRIN (Block Range INdex) divides the heap into contiguous block ranges (default: 128 pages per range) and stores only the minimum and maximum value of the indexed column within each range. A query with a range predicate consults the BRIN summary to identify which block ranges could contain matching rows and reads only those. BRIN is extremely small (kilobytes for million-row tables) and trivially maintained. Its weakness is low precision: if data values are not correlated with physical storage order (e.g., random UUIDs), every block range overlaps every predicate value and BRIN provides no benefit.',
    compiledJS: `-- BRIN index on append-only time-series table
CREATE INDEX idx_events_created_brin
  ON events USING BRIN (created_at)
  WITH (pages_per_range = 64);  -- smaller ranges = more precision, larger index

-- Check correlation (must be high for BRIN to help)
SELECT attname, correlation
FROM pg_stats
WHERE tablename = 'events' AND attname = 'created_at';
-- correlation ≈ 1.0 → BRIN works perfectly (new rows always have newer timestamps)

-- Size comparison
SELECT
  pg_size_pretty(pg_relation_size('events')) AS table_size,
  pg_size_pretty(pg_relation_size('idx_events_created_brin')) AS brin_size;
-- table: 4200 MB, BRIN: 48 kB  ← orders of magnitude smaller than B-Tree`,
    bestPractice:
      'Use BRIN indexes on large append-only tables (event logs, IoT sensor data, financial tick data) where the indexed column is naturally correlated with insertion order (timestamps, auto-increment IDs). Replace the B-Tree on created_at/id with a BRIN — it can reduce index maintenance overhead by >99% while still enabling fast date-range queries. Do not use BRIN on OLTP tables with random writes or updates; correlation degrades quickly and the index becomes useless.',
    source: 'PostgreSQL Docs — Chapter 71: BRIN Indexes; DDIA — Chapter 3: Other Indexing Structures',
  },

  {
    id: 'a10',
    topic: 'pg_stat_user_indexes',
    question: 'Which PostgreSQL system view would you query to find the number of index scans, sequential scans, and tuples fetched for user-created indexes?',
    code: null,
    options: [
      'pg_indexes',
      'information_schema.table_constraints',
      'pg_stat_user_indexes',
      'pg_index',
    ],
    correctIndex: 2,
    explanation:
      'pg_stat_user_indexes exposes cumulative I/O and usage statistics per index: idx_scan (total number of index scans initiated since last stats reset), idx_tup_read (number of index entries returned by scans), and idx_tup_fetch (number of heap rows fetched via the index). An index with idx_scan = 0 over a multi-week observation window is a strong candidate for removal. pg_indexes shows DDL metadata (index definition, tablespace) but no usage statistics. pg_index is the raw catalog table with flags like indisvalid, indisprimary, and indisunique.',
    compiledJS: `-- Find unused indexes (idx_scan = 0 over observation window)
SELECT
  schemaname,
  relname AS table_name,
  indexrelname AS index_name,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC;

-- Find write-heavy tables to identify index maintenance cost
SELECT
  relname,
  n_tup_ins + n_tup_upd + n_tup_del AS total_writes,
  pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_stat_user_tables
ORDER BY total_writes DESC
LIMIT 20;`,
    bestPractice:
      'Schedule a weekly index audit query against pg_stat_user_indexes. Any index with idx_scan = 0 over 2+ weeks and non-trivial size should be reviewed for removal. Before dropping, make the index invisible (MySQL) or use session-level disable (PostgreSQL) to confirm no plan regressions. Also cross-reference with pg_stat_user_tables.n_tup_upd to understand write cost savings from removing unused indexes on hot tables.',
    source: 'PostgreSQL Docs — Chapter 28.2: The Statistics Collector — pg_stat_user_indexes',
  },
]
