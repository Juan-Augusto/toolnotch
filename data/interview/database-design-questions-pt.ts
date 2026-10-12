import type { InterviewQuestion } from '@/lib/interviewTypes'

export const DATABASE_DESIGN_QUESTIONS_PT: InterviewQuestion[] = [
  {
    "id": "b01",
    "topic": "Chave Primária",
    "question": "Qual é o objetivo principal de uma chave primária em um banco de dados relacional?",
    "code": null,
    "options": [
      "Ordenar linhas da tabela automaticamente em ordem alfabética",
      "Identificar de forma única cada registro individual em uma tabela",
      "Estabelecer uma ligação referencial estrangeira entre duas tabelas",
      "Aplicar restrições NOT NULL obrigatórias em todas as colunas"
    ],
    "correctIndex": 1,
    "explanation": "Uma chave primária identifica de forma única cada registro em uma tabela: duas linhas não podem ter o mesmo valor de chave e a coluna não aceita valores nulos. O banco de dados cria automaticamente um índice exclusivo nessa chave, agilizando buscas diretas. Em motores como o InnoDB (MySQL), a tabela é organizada fisicamente pela chave primária (índice clusterizado), motivo pelo qual escolher uma chave sequencial como BIGINT favorece a performance de escrita.",
    "compiledJS": "-- DDL com chave primária\nCREATE TABLE users (\n  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n  email TEXT NOT NULL UNIQUE\n);\n\n-- O banco cria implicitamente:\n-- UNIQUE INDEX users_pkey ON users(id)",
    "bestPractice": "Prefira um identificador substituto do tipo inteiro ou UUID como chave primária em vez de uma chave natural (como e-mail ou nome de usuário), pois chaves naturais podem sofrer alterações e quebrar relacionamentos de chave estrangeira. No PostgreSQL utilize BIGINT GENERATED ALWAYS AS IDENTITY; no MySQL utilize BIGINT AUTO_INCREMENT. Evite chaves primárias compostas em tabelas volumosas, exceto quando a tabela de relacionamento não tiver nenhuma outra identidade própria.",
    "source": "PostgreSQL Docs: Constraints: Primary Keys"
  },
  {
    "id": "b02",
    "topic": "Chave Estrangeira",
    "question": "O que uma chave estrangeira faz em um banco de dados relacional?",
    "code": null,
    "options": [
      "Criptografa valores de colunas sensíveis usando chaves AES-256 para garantir segurança criptográfica no disco",
      "Referencia a chave primária de outra tabela, garantindo que o banco de dados imponha integridade referencial",
      "Acelera consultas SELECT analíticas ao indexar colunas de chave estrangeira em árvores B-Tree na memória",
      "Impede que registros duplicados sejam inseridos em uma única tabela sem exigir restrições de unicidade"
    ],
    "correctIndex": 1,
    "explanation": "Uma chave estrangeira estabelece uma relação entre duas tabelas ao referenciar a chave primária da tabela pai, assegurando a integridade referencial. O banco de dados rejeita inserções ou atualizações que gerem referências órfãs e aplica ações configuradas para ON DELETE e ON UPDATE (como CASCADE, SET NULL ou RESTRICT). Sem chaves estrangeiras, registros órfãos acumulam-se silenciosamente.",
    "compiledJS": "CREATE TABLE orders (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT NOT NULL\n    REFERENCES users(id)\n    ON DELETE CASCADE\n    ON UPDATE CASCADE\n);\n\n-- Tentativa de inserir pedido para usuário inexistente:\n-- INSERT INTO orders(id, user_id) VALUES (1, 9999);\n-- ERRO: insert or update on table \"orders\" violates\n-- foreign key constraint \"orders_user_id_fkey\"",
    "bestPractice": "Sempre crie um índice nas colunas de chave estrangeira, pois o banco valida a restrição fazendo buscas na tabela pai e, sem um índice, cada validação exige uma varredura sequencial completa. No PostgreSQL esse índice não é criado automaticamente (diferente do InnoDB no MySQL). Configure ON DELETE RESTRICT ou ON DELETE CASCADE conscientemente; manter a opção padrão (RESTRICT) é mais seguro para registros sujeitos a auditoria.",
    "source": "PostgreSQL Docs: Referential Integrity"
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
    "explanation": "Bancos de dados NoSQL (\"Not Only SQL\") são repositórios não relacionais que substituem esquemas rígidos por modelos flexíveis: documentos (MongoDB, Firestore), chave-valor (Redis, DynamoDB), colunas largas (Cassandra) e grafos (Neo4j). Geralmente abrem mão de garantias ACID estritas e junções relacionais em favor de escalabilidade horizontal e padrões de acesso específicos.",
    "compiledJS": null,
    "bestPractice": "Adote NoSQL quando o padrão de acesso for previsível, simples e não exigir junções dinâmicas frequentes, como sessões de usuários (chave-valor), catálogos com atributos heterogêneos (documentos) ou conexões sociais (grafos). Evite recorrer ao NoSQL apenas para ignorar a modelagem de esquema, já que documentos mal planejados causam tanta complexidade quanto bancos relacionais mal estruturados.",
    "source": "Martin Fowler: NoSQL Distilled (visão geral)"
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
    "explanation": "CRUD representa as quatro operações fundamentais em dados persistentes: Create, Read, Update e Delete (Criar, Ler, Atualizar e Excluir). Na linguagem SQL, correspondem respectivamente aos comandos INSERT, SELECT, UPDATE e DELETE. Quase todas as APIs REST e interfaces de usuário operam em torno dessas quatro ações.",
    "compiledJS": "-- Criar\nINSERT INTO users (email) VALUES ('alice@example.com');\n\n-- Ler\nSELECT * FROM users WHERE id = 1;\n\n-- Atualizar\nUPDATE users SET email = 'new@example.com' WHERE id = 1;\n\n-- Excluir\nDELETE FROM users WHERE id = 1;",
    "bestPractice": "Em sistemas de produção, priorize a exclusão lógica (soft delete com registro de timestamp no campo deleted_at) sobre a exclusão física para qualquer entidade sujeita a auditoria ou requisitos regulatórios. Isso mantém o histórico intacto e viabiliza fluxos de captura de dados de alteração (CDC) para sincronizar serviços externos.",
    "source": "PostgreSQL Docs: Data Manipulation"
  },
  {
    "id": "b05",
    "topic": "Semântica do NULL",
    "question": "O que o valor NULL representa no SQL?",
    "code": null,
    "options": [
      "Um valor numérico inteiro zero (`0`)",
      "Uma cadeia de caracteres de texto vazia (`''`)",
      "A ausência de um valor ou um estado desconhecido",
      "Uma avaliação de condição booleana falsa (`FALSE`)"
    ],
    "correctIndex": 2,
    "explanation": "O valor NULL no SQL representa a ausência de valor ou uma informação desconhecida, diferindo de zero, de uma string vazia ou de false. Comparações diretas com NULL retornam UNKNOWN, o que faz com que filtros como `WHERE coluna = NULL` nunca correspondam a registros; a sintaxe correta exige `IS NULL`. Funções agregadas como COUNT, SUM e AVG ignoram valores NULL automaticamente.",
    "compiledJS": "-- Não retorna registros:\nSELECT * FROM users WHERE deleted_at = NULL;\n\n-- Consulta correta:\nSELECT * FROM users WHERE deleted_at IS NULL;\n\n-- NULL se propaga em expressões:\nSELECT NULL + 1;   -- resultado: NULL\nSELECT NULL = NULL; -- resultado: NULL (e não TRUE)",
    "bestPractice": "Evite colunas anuláveis sempre que possível: adicione restrições NOT NULL no esquema do banco e use valores sentinela (como texto vazio, timestamp zero ou 0) apenas se carregarem significado semântico autêntico. Quando o uso de NULL for inevitável, aplique COALESCE() em consultas para estipular padrões e documente o papel da coluna.",
    "source": "SQL Standard: Three-Valued Logic"
  },
  {
    "id": "b06",
    "topic": "Relacionamentos",
    "question": "Que tipo de relacionamento existe quando um registro na tabela A pode se relacionar com vários registros na tabela B, e um registro na tabela B também pode se relacionar com vários registros na tabela A?",
    "code": null,
    "options": [
      "Um para Um (1:1)",
      "Um para Muitos (1:N)",
      "Muitos para Muitos (M:N)",
      "Autorrelacionamento"
    ],
    "correctIndex": 2,
    "explanation": "Um relacionamento Muitos para Muitos (M:N) ocorre quando linhas de ambos os lados podem se conectar a múltiplos registros da outra tabela. Como modelos relacionais não suportam listas de chaves em uma coluna única, a solução é utilizar uma tabela de junção (associativa) contendo duas chaves estrangeiras, conectando cada entidade pai.",
    "compiledJS": "-- Tabela de junção resolvendo relacionamento M:N entre students e courses\nCREATE TABLE enrolments (\n  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,\n  course_id  BIGINT REFERENCES courses(id)  ON DELETE CASCADE,\n  enrolled_at TIMESTAMPTZ DEFAULT NOW(),\n  PRIMARY KEY (student_id, course_id)\n);",
    "bestPractice": "Inclua colunas adicionais na tabela associativa para guardar metadados do relacionamento (como enrolled_at, status ou perfil), visto que esses requisitos costumam surgir com a evolução do sistema. Mantenha uma chave primária composta pelas duas chaves estrangeiras, a não ser que precise vincular essa associação a uma terceira tabela, caso em que uma chave substituta própria simplifica a modelagem.",
    "source": "Database Design for Mere Mortals: Capítulo 11"
  },
  {
    "id": "b07",
    "topic": "Normalização",
    "question": "O que é normalização de banco de dados?",
    "code": null,
    "options": [
      "Converter todos os nomes de colunas para letras minúsculas",
      "Organizar os dados para reduzir a redundância e melhorar a integridade",
      "Mesclar todas as tabelas em uma única tabela plana para ganho de desempenho",
      "Fazer backup dos dados em um servidor secundário"
    ],
    "correctIndex": 1,
    "explanation": "A normalização é a organização estruturada de esquemas relacionais para minimizar duplicações de dados e impedir anomalias de inclusão, atualização e remoção. É guiada por formas normais sucessivas (1FN, 2FN, 3FN, FNBC). Um banco bem normalizado guarda cada fato em um único local, garantindo que qualquer alteração precise afetar somente uma linha.",
    "compiledJS": null,
    "bestPractice": "Tenha a 3FN como meta inicial recomendada e desnormalize pontualmente somente quando testes de carga comprovarem um gargalo estrito de leitura. Não ignore a normalização com o intuito de evitar junções, pois divergências causadas por dados duplicados são extremamente trabalhosas de rastrear em ambientes de produção.",
    "source": "C. J. Date: An Introduction to Database Systems"
  },
  {
    "id": "b08",
    "topic": "Atomicidade no ACID",
    "question": "Qual propriedade das transações ACID garante que uma transação seja totalmente concluída ou não produza nenhum efeito?",
    "code": null,
    "options": [
      "Consistência",
      "Isolamento",
      "Atomicidade",
      "Durabilidade"
    ],
    "correctIndex": 2,
    "explanation": "A atomicidade assegura que todas as operações pertencentes a uma transação sejam executadas como uma unidade única e indivisível: todas são confirmadas (COMMIT) ou todas são revertidas (ROLLBACK). Caso ocorra uma queda no servidor durante a execução, o banco consulta o Write-Ahead Log (WAL) na reinicialização e cancela alterações parciais, impedindo desequilíbrios como debitar fundos sem creditá-los no destino.",
    "compiledJS": "-- Ambas as operações são concluídas ou nenhuma tem efeito\nBEGIN;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n\n-- Se o processo falhar após o primeiro UPDATE:\n-- Ao reiniciar, o PostgreSQL processa o WAL e desfaz\n-- a transação incompleta automaticamente.",
    "bestPractice": "Reúna alterações logicamente interdependentes dentro da mesma transação e nunca delegue à camada de aplicação a tarefa de tentar corrigir gravações incompletas. Em ferramentas ORM, estabeleça explicitamente o escopo das transações em vez de usar o modo auto-commit, reduzindo o perigo de manter conexões abertas em estado indefinido.",
    "source": "PostgreSQL Docs: Transactions"
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
    "explanation": "A linguagem SQL foi criada para operar sobre esquemas relacionais estruturados com tabelas, tipos e colunas predefinidas. Plataformas NoSQL flexibilizam essas definições e utilizam mecanismos alternativos de busca: APIs orientadas a chave-valor (DynamoDB), consultas sobre documentos (MongoDB) ou linguagens específicas focadas em chaves de partição (Cassandra).",
    "compiledJS": null,
    "bestPractice": "Bancos SQL continuam sendo a escolha inicial mais sensata para a grande maioria dos projetos, já que a flexibilidade para consultas dinâmicas e as garantias de consistência são fundamentais ao longo da evolução do software. Adote NoSQL exclusivamente quando encontrar um padrão de acesso claro que o modelo relacional não consiga atender na sua escala de operação.",
    "source": "DDIA: Capítulo 2: Data Models and Query Languages"
  },
  {
    "id": "b10",
    "topic": "Migrações",
    "question": "Qual é o objetivo de uma migração de banco de dados?",
    "code": null,
    "options": [
      "Mover volumes de armazenamento para outro data center na nuvem",
      "Exportar tabelas relacionais para arquivos compactados em CSV",
      "Aplicar alterações versionadas e incrementais de esquema no banco",
      "Converter tabelas relacionais e restrições em coleções NoSQL"
    ],
    "correctIndex": 2,
    "explanation": "Migrações de banco de dados consistem em scripts versionados (em SQL ou DSL) que aplicam alterações incrementais na estrutura das tabelas (como criar campos, remover colunas ou gerar índices). Soluções como Flyway, Liquibase e Prisma mantêm o registro das execuções em tabelas dedicadas, sincronizando com segurança o banco com as novas versões do código.",
    "compiledJS": "-- Exemplo de migração no Flyway: V3__add_deleted_at_to_users.sql\nALTER TABLE users\n  ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL;\n\nCREATE INDEX CONCURRENTLY idx_users_deleted_at\n  ON users(deleted_at)\n  WHERE deleted_at IS NOT NULL;",
    "bestPractice": "Nunca modifique scripts de migração que já tenham sido executados em qualquer ambiente: considere arquivos de migração como histórico imutável. Para deploys com zero downtime, use a estratégia expand-contract: crie novas colunas permitindo valores nulos (expand), atualize a aplicação e só depois popule os dados e aplique restrições adicionais (contract) em um passo seguinte.",
    "source": "Flyway Docs: Versioned Migrations"
  },
  {
    "id": "i01",
    "topic": "Segunda Forma Normal (2FN)",
    "question": "Qual forma normal exige que todo atributo não chave seja totalmente dependente de forma funcional de toda a chave primária (eliminando dependências parciais)?",
    "code": null,
    "options": [
      "Primeira Forma Normal (1FN)",
      "Segunda Forma Normal (2FN)",
      "Terceira Forma Normal (3FN)",
      "Forma Normal de Boyce-Codd (FNBC)"
    ],
    "correctIndex": 1,
    "explanation": "A 2FN se aplica a tabelas com chave primária composta e exige que nenhum atributo não chave dependa apenas de parte dessa chave. Para corrigir dependências parciais, divide-se a tabela: move-se a coluna parcialmente dependente para uma tabela própria, como separar product_name em uma tabela de produtos em vez de mantê-la vinculada à chave composta (order_id, product_id).",
    "compiledJS": "-- Viola a 2FN: product_name depende apenas de product_id e não de (order_id, product_id)\nCREATE TABLE order_items_bad (\n  order_id    BIGINT,\n  product_id  BIGINT,\n  product_name TEXT,   -- dependência parcial!\n  quantity    INT,\n  PRIMARY KEY (order_id, product_id)\n);\n\n-- Divisão compatível com a 2FN:\nCREATE TABLE products (\n  id   BIGINT PRIMARY KEY,\n  name TEXT NOT NULL\n);\nCREATE TABLE order_items (\n  order_id   BIGINT,\n  product_id BIGINT REFERENCES products(id),\n  quantity   INT,\n  PRIMARY KEY (order_id, product_id)\n);",
    "bestPractice": "O uso de chaves substitutas de coluna única (autoincremento ou UUID) satisfaz a 2FN por padrão, dado que dependências parciais são impossíveis na ausência de chaves compostas. Essa característica é uma das principais razões pelas quais desenvolvedores experientes adotam chaves substitutas.",
    "source": "C. J. Date: An Introduction to Database Systems, Capítulo 11"
  },
  {
    "id": "i02",
    "topic": "Primeira Forma Normal (1FN)",
    "question": "O que a Primeira Forma Normal (1FN) exige?",
    "code": null,
    "options": [
      "Ausência de dependências transitivas entre colunas não chave na tabela",
      "Valores de colunas atômicos e cada coluna com um tipo de dado único",
      "Todas as chaves estrangeiras referenciando chaves primárias válidas",
      "Uma chave primária composta definida por duas ou mais colunas da tabela"
    ],
    "correctIndex": 1,
    "explanation": "A 1FN exige valores atômicos e indivisíveis em cada coluna, tipos consistentes de dados e ausência de grupos de repetição (como colunas telefone_1, telefone_2). Guardar listas separadas por vírgulas em uma coluna de texto é uma clássica violação da 1FN, prejudicando índices, integridade e a construção de consultas eficientes.",
    "compiledJS": "-- Viola a 1FN: tags é uma lista separada por vírgula\nCREATE TABLE posts_bad (\n  id   BIGINT PRIMARY KEY,\n  tags TEXT   -- ex: \"typescript,nodejs,backend\"\n);\n\n-- Compatível com a 1FN: move o grupo repetido para uma tabela própria\nCREATE TABLE post_tags (\n  post_id BIGINT REFERENCES posts(id),\n  tag     TEXT NOT NULL,\n  PRIMARY KEY (post_id, tag)\n);",
    "bestPractice": "Colunas ARRAY e JSONB no PostgreSQL armazenam valores não atômicos e podem violar o princípio da 1FN. Utilize esses tipos apenas quando os dados forem de fato sem esquema definido ou quando testes mostrarem que a flexibilidade supera a complexidade nas consultas. Para grupos de repetição estruturados, normalize sempre em uma tabela filha.",
    "source": "E. F. Codd: A Relational Model of Data for Large Shared Data Banks (1970)"
  },
  {
    "id": "i03",
    "topic": "Desnormalização",
    "question": "Qual das seguintes opções é uma razão válida para desnormalizar intencionalmente um banco de dados?",
    "code": null,
    "options": [
      "Para atender a restrições rígidas de exclusão em cascata externa",
      "Para melhorar a taxa de leitura reduzindo junções entre tabelas",
      "Para impor validações de domínio de negócio mais rigorosas no banco",
      "Para garantir que todas as tabelas atendam estritamente à 3NF"
    ],
    "correctIndex": 1,
    "explanation": "A desnormalização introduz redundância de forma intencional para evitar operações custosas de junção em fluxos críticos de leitura. Práticas comuns incluem salvar agregadores calculados (como comment_count) ou duplicar colunas muito lidas. O custo dessa abordagem é que cada gravação precisa sincronizar os dados duplicados, exigindo cuidado para evitar inconsistências.",
    "compiledJS": "-- Desnormalizado: posts armazena comment_count para evitar COUNT(*) com JOIN a cada leitura\nCREATE TABLE posts (\n  id            BIGINT PRIMARY KEY,\n  title         TEXT NOT NULL,\n  comment_count INT  NOT NULL DEFAULT 0  -- redundante, mantido em sincronia por trigger\n);\n\n-- Trigger que mantém comment_count exato:\nCREATE FUNCTION inc_comment_count() RETURNS TRIGGER LANGUAGE plpgsql AS $$\nBEGIN\n  UPDATE posts SET comment_count = comment_count + 1\n  WHERE id = NEW.post_id;\n  RETURN NEW;\nEND $$;\n\nCREATE TRIGGER after_comment_insert\n  AFTER INSERT ON comments\n  FOR EACH ROW EXECUTE FUNCTION inc_comment_count();",
    "bestPractice": "Sempre faça medições antes de desnormalizar, visto que a maior parte do impacto de junções é resolvida com indexação correta sem exigir redundância. Ao desnormalizar, assegure a consistência por meio de triggers ou transações na aplicação e documente a regra claramente para evitar falhas futuras.",
    "source": "DDIA: Capítulo 3: Storage and Retrieval"
  },
  {
    "id": "i04",
    "topic": "Chaves Substitutas",
    "question": "O que é uma chave substituta (surrogate key)?",
    "code": null,
    "options": [
      "Uma chave natural derivada de atributos do negócio como e-mail",
      "Uma chave gerada pelo sistema (UUID ou identity) sem valor de negócio",
      "Uma chave composta que identifica relações em tabelas de junção",
      "Uma chave estrangeira recursiva apontando para a própria tabela"
    ],
    "correctIndex": 1,
    "explanation": "Uma chave substituta (surrogate key) é um identificador artificial gerado pelo sistema (como um BIGINT autoincrementável ou UUID) sem significado no domínio de negócio. Ao contrário de chaves naturais (como e-mail ou documento), chaves substitutas não mudam mesmo se os dados do usuário forem alterados, mantendo as chaves estrangeiras intactas e facilitando a indexação.",
    "compiledJS": "-- Chave substituta (BIGINT IDENTITY)\nCREATE TABLE customers (\n  id    BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,\n  email TEXT NOT NULL UNIQUE  -- chave natural tratada como restrição UNIQUE\n);\n\n-- vs Chave natural (frágil: email pode mudar, quebrando referências de FK)\nCREATE TABLE customers_bad (\n  email TEXT PRIMARY KEY,\n  name  TEXT\n);",
    "bestPractice": "Adote chaves substitutas BIGINT como padrão. Escolha UUID (versão 7 para inserções sequenciais) apenas se precisar de identificadores únicos globais entre sistemas distribuídos ou geração de IDs pelo cliente antes da inserção. Exponha chaves naturais como restrições UNIQUE em vez de chaves primárias, permitindo validações e alterações sem propagar atualizações em cascata.",
    "source": "Database Design for Mere Mortals: Capítulo 9"
  },
  {
    "id": "i05",
    "topic": "Diagramas ER",
    "question": "Em um diagrama entidade-relacionamento (DER), o que indica uma linha dupla (participação total) no lado de uma entidade em um relacionamento?",
    "code": null,
    "options": [
      "A entidade possui uma chave primária composta de várias colunas",
      "Cada instância da entidade deve participar obrigatoriamente da relação",
      "A entidade define uma associação Many-to-Many com tabela de junção",
      "A entidade representa uma entidade fraca com chave identificadora parcial"
    ],
    "correctIndex": 1,
    "explanation": "Na notação clássica de diagramas entidade-relacionamento, linhas duplas representam participação total (toda instância da entidade deve participar obrigatoriamente do relacionamento), enquanto linhas simples indicam participação parcial. No modelo físico relacional, a participação total se traduz diretamente em uma coluna de chave estrangeira com restrição NOT NULL.",
    "compiledJS": "-- Participação total de Employee em \"Works-In\" mapeada como FK NOT NULL:\nCREATE TABLE employees (\n  id          BIGINT PRIMARY KEY,\n  name        TEXT   NOT NULL,\n  department_id BIGINT NOT NULL  -- NOT NULL impõe participação total\n    REFERENCES departments(id)\n);\n\n-- Participação parcial (FK anulável):\nCREATE TABLE employees_optional (\n  id          BIGINT PRIMARY KEY,\n  name        TEXT NOT NULL,\n  department_id BIGINT  -- anulável: participação parcial\n    REFERENCES departments(id)\n);",
    "bestPractice": "Converta participação total diretamente em restrições de chave estrangeira NOT NULL no DDL, sem depender de validações apenas no código da aplicação. Restrições no banco barram inconsistências em qualquer caminho de execução (migrações, scripts ou consultas manuais), enquanto verificações na aplicação cobrem somente o fluxo padrão.",
    "source": "Ramez Elmasri: Fundamentals of Database Systems, Capítulo 7"
  },
  {
    "id": "i06",
    "topic": "Teorema CAP",
    "question": "De acordo com o teorema CAP, um banco de dados distribuído pode garantir no máximo quantas das três propriedades simultaneamente?",
    "code": null,
    "options": [
      "Todas as três: Consistência, Disponibilidade e Tolerância a Partições",
      "Apenas uma",
      "Quaisquer duas",
      "Nenhuma: elas estão sempre em conflito"
    ],
    "correctIndex": 2,
    "explanation": "O teorema CAP estabelece que sistemas distribuídos só podem garantir simultaneamente duas de três propriedades: Consistência (leituras retornam a gravação mais recente), Disponibilidade (requisições recebem resposta sem erro) e Tolerância a Partições (o sistema segue operando mesmo sob falhas de rede). Como falhas de rede são inevitáveis, arquiteturas reais equilibram entre modelos CP ou AP.",
    "compiledJS": null,
    "bestPractice": "O teorema CAP é um modelo mental útil, mas frequentemente simplificado demais. Na prática, utilize o modelo PACELC, que também considera concessões de latência na ausência de partições de rede. A maioria dos projetos deve adotar sistemas CP (como PostgreSQL ou Spanner) por padrão, a não ser que haja demandas rígidas de distribuição geográfica ou disponibilidade contínua que justifiquem abrir mão de consistência imediata.",
    "source": "Eric Brewer: Towards Robust Distributed Systems (2000)"
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
    "explanation": "Cargas OLTP são otimizadas para alto volume de transações rápidas e pontuais (inserir pedidos, buscar cadastros) utilizando armazenamento orientado a linhas. Cargas OLAP concentram-se em análises e agregações complexas sobre grandes volumes históricos, utilizando bancos com armazenamento colunar (ClickHouse, BigQuery) para escanear apenas as colunas necessárias.",
    "compiledJS": null,
    "bestPractice": "Nunca execute consultas analíticas do tipo OLAP diretamente no banco OLTP de produção, pois varreduras demoradas retêm bloqueios e degradam a latência transacional para todos os usuários. Encaminhe o tráfego analítico para réplicas de leitura, views materializadas ou um data warehouse alimentado por CDC ou processos de ETL.",
    "source": "DDIA: Capítulo 3: Storage and Retrieval"
  },
  {
    "id": "i08",
    "topic": "Níveis de Isolamento",
    "question": "Qual nível de isolamento de transação impede leituras sujas (dirty reads), mas ainda permite leituras não repetíveis (non-repeatable reads)?",
    "code": null,
    "options": [
      "Read Uncommitted",
      "Read Committed",
      "Repeatable Read",
      "Serializable"
    ],
    "correctIndex": 1,
    "explanation": "O nível Read Committed lê apenas dados já confirmados por outras transações, prevenindo leituras sujas, mas permite leituras não repetíveis caso outra transação altere a linha entre duas leituras sucessivas. Para evitar leituras não repetíveis utiliza-se Repeatable Read, enquanto o nível Serializable isola completamente transações contra leituras fantasmas ao custo de maior concorrência.",
    "compiledJS": "-- Define o isolamento para a transação atual:\nBEGIN ISOLATION LEVEL READ COMMITTED;\n-- (padrão no PostgreSQL)\n\n-- Anomalias por nível:\n-- Read Uncommitted : leituras sujas permitidas\n-- Read Committed   : evita leituras sujas, permite leituras não repetíveis (padrão)\n-- Repeatable Read  : evita leituras não repetíveis, permite leituras fantasmas\n-- Serializable     : evita todas as anomalias (custo mais elevado)",
    "bestPractice": "Utilize o nível padrão Read Committed para a maioria das aplicações web. Eleve para Serializable somente em operações financeiras ou de controle de estoque em que leituras fantasmas possam causar gastos duplos ou condições de corrida. Lembre-se de que o nível Serializable aumenta a concorrência por bloqueios e pode gerar abortos de transação que sua aplicação precisará tratar com repetições.",
    "source": "PostgreSQL Docs: Transaction Isolation"
  },
  {
    "id": "i09",
    "topic": "Soft Delete vs Hard Delete",
    "question": "Qual é a diferença entre uma exclusão lógica (soft delete) e uma exclusão física (hard delete)?",
    "code": null,
    "options": [
      "Soft delete remove linhas no ato; hard delete define um TTL de expiração",
      "Soft delete marca linhas como inativas; hard delete remove o registro do disco",
      "Soft delete descarta apenas índices; hard delete apaga registros de tabelas",
      "Ambos são nomes sinônimos para a mesma instrução de exclusão em segundo plano"
    ],
    "correctIndex": 1,
    "explanation": "A exclusão lógica (soft delete) utiliza indicadores como deleted_at para ocultar registros de consultas normais preservando o histórico para auditoria. A exclusão física (hard delete) apaga a linha definitivamente do disco. A desvantagem do soft delete é a necessidade de filtros constantes com WHERE deleted_at IS NULL em todas as consultas da aplicação.",
    "compiledJS": "-- Exclusão lógica (soft delete)\nUPDATE users\n  SET deleted_at = NOW()\nWHERE id = 42;\n\n-- Toda consulta deve filtrar:\nSELECT * FROM users WHERE deleted_at IS NULL;\n\n-- Automatizado com uma view:\nCREATE VIEW active_users AS\n  SELECT * FROM users WHERE deleted_at IS NULL;\n\n-- Exclusão física (hard delete)\nDELETE FROM users WHERE id = 42;",
    "bestPractice": "Para conformidade com leis de privacidade (como LGPD e GDPR), prefira um modelo híbrido: aplique primeiro a exclusão lógica (substituindo dados pessoais por marcadores anônimos e definindo deleted_at) e agende a exclusão física definitiva após o período legal de retenção. Crie um índice parcial com filtro deleted_at IS NULL para manter consultas comuns rápidas sem percorrer registros desativados.",
    "source": "PostgreSQL Docs: Partial Indexes; GDPR Article 17"
  },
  {
    "id": "i10",
    "topic": "Schema-on-Read vs Schema-on-Write",
    "question": "O que significa 'schema-on-write' em comparação com 'schema-on-read'?",
    "code": null,
    "options": [
      "Schema-on-write valida na inserção; schema-on-read valida na consulta",
      "Schema-on-write é exclusivo de NoSQL; schema-on-read é exclusivo de bancos SQL",
      "Schema-on-read exige tipos estáticos prévios antes de qualquer gravação",
      "Ambos os modelos validam tipos com rigor idêntico no momento de inserção"
    ],
    "correctIndex": 0,
    "explanation": "O modelo schema-on-write valida os dados no momento da gravação com base em tipos e restrições predefinidas, barrando registros inválidos imediatamente. No modelo schema-on-read (típico de data lakes e bancos documentais flexíveis), qualquer formato pode ser persistido e a estrutura é interpretada apenas na consulta, transferindo a responsabilidade da validação para o momento da leitura.",
    "compiledJS": null,
    "bestPractice": "Prefira schema-on-write para bancos operacionais, pois identificar inconsistências no momento da gravação custa muito menos do que descobrir dados corrompidos semanas depois durante relatórios. Utilize schema-on-read em data lakes e repositórios de eventos nos quais o formato de entrada não esteja sob seu controle direto, validando os dados com ferramentas como dbt antes de utilizá-los em modelos consolidados.",
    "source": "DDIA: Capítulo 4: Encoding and Evolution"
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
    "explanation": "O sharding baseado em hash utiliza uma função hash aplicada à chave de particionamento para espalhar os dados de forma uniforme entre os fragmentos, eliminando concentrações excessivas de escrita. O particionamento por faixa, em contrapartida, é suscetível a pontos quentes quando novos registros possuem chaves sequenciais, embora permita consultas por intervalo com facilidade.",
    "compiledJS": null,
    "bestPractice": "O particionamento por hash é a melhor escolha padrão para sistemas com alta taxa de gravação e distribuição uniforme de chaves (como UUIDs e hashes de identificadores). Utilize particionamento por faixa apenas se suas consultas operarem nativamente por intervalos (séries temporais ou dados geoespaciais) e sua infraestrutura suportar técnicas de mitigação de pontos quentes, como pré-divisão de partições.",
    "source": "DDIA: Capítulo 6: Partitioning"
  },
  {
    "id": "a02",
    "topic": "Replicação",
    "question": "Qual é o principal trade-off da replicação síncrona em comparação com a replicação assíncrona?",
    "code": null,
    "options": [
      "A replicação síncrona tem menor latência mas perde dados em falhas",
      "A replicação síncrona garante perda zero ao custo de maior latência",
      "A replicação assíncrona assegura consistência estrita com zero perda",
      "A replicação síncrona opera apenas em bancos documentais como MongoDB"
    ],
    "correctIndex": 1,
    "explanation": "Na replicação síncrona, a instância primária aguarda a confirmação de gravação em pelo menos uma réplica antes de responder com sucesso ao cliente, assegurando que não haja perda de dados em falhas ao custo de maior latência de escrita. Na replicação assíncrona, a confirmação é imediata e os dados trafegam em segundo plano, oferecendo maior vazão com possibilidade de perda caso a primária caia antes da sincronização.",
    "compiledJS": "-- PostgreSQL: configura standby síncrono\nALTER SYSTEM SET synchronous_standby_names = 'FIRST 1 (replica1)';\n-- Gravações agora aguardam a replica1 confirmar o recebimento do WAL antes do retorno do COMMIT.\n\n-- Verifica o atraso de replicação atual:\nSELECT\n  client_addr,\n  state,\n  sent_lsn - write_lsn AS write_lag_bytes,\n  sent_lsn - flush_lsn AS flush_lag_bytes\nFROM pg_stat_replication;",
    "bestPractice": "Utilize replicação síncrona em dados financeiros nos quais perda de dados seja inaceitável. Para a maioria das aplicações web, configure replicação semissíncrona ou use o parâmetro synchronous_commit = remote_write do PostgreSQL (que garante durabilidade sem esperar pelo fsync na réplica) para equilibrar segurança e latência. Monitore constantemente o atraso de replicação, pois réplicas defasadas representam risco iminente de perda em caso de falha.",
    "source": "DDIA: Capítulo 5: Replication"
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
    "explanation": "Diferente de modelos CRUD onde alterações sobrescrevem o estado anterior, o Event Sourcing armazena cada modificação como um evento imutável em um log de eventos. O estado presente da entidade é obtido pela reprodução sequencial desses eventos históricos, viabilizando rastreabilidade total, reconstituição temporal e reconstrução de modelos analíticos.",
    "compiledJS": "-- Tabela de eventos (append-only, sem atualizações ou exclusões)\nCREATE TABLE account_events (\n  id           BIGSERIAL PRIMARY KEY,\n  aggregate_id UUID       NOT NULL,\n  event_type   TEXT       NOT NULL,  -- \"MoneyDeposited\", \"MoneyWithdrawn\"\n  payload      JSONB      NOT NULL,\n  occurred_at  TIMESTAMPTZ DEFAULT NOW()\n);\n\n-- Saldo atual obtido pela reprodução dos eventos:\nSELECT\n  SUM(CASE event_type\n    WHEN 'MoneyDeposited'  THEN (payload->>'amount')::NUMERIC\n    WHEN 'MoneyWithdrawn'  THEN -(payload->>'amount')::NUMERIC\n  END) AS balance\nFROM account_events\nWHERE aggregate_id = '<uuid>';",
    "bestPractice": "Event Sourcing acrescenta complexidade considerável: a performance de replay cai conforme o log de eventos cresce (exigindo snapshots a cada N eventos) e depurar inconsistências eventuais demanda rastrear fluxos de eventos. Aplique esse padrão apenas em domínios em que auditoria rigorosa e consultas temporais sejam requisitos fundamentais (finanças, saúde e conformidade legal). A maioria das aplicações CRUD convencionais não precisa dessa abordagem.",
    "source": "Martin Fowler: Event Sourcing (martinfowler.com)"
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
    "explanation": "O padrão CQRS separa a estrutura utilizada para operações de escrita (comandos) da estrutura utilizada para leituras (consultas). Isso permite que o lado de escrita seja totalmente normalizado e transacional, enquanto o modelo de leitura pode ser desnormalizado, armazenado em cache ou estruturado especificamente para as consultas exigidas pela interface.",
    "compiledJS": null,
    "bestPractice": "O padrão CQRS demonstra seu maior potencial quando associado a Event Sourcing, permitindo que eventos da camada de escrita reconstruam as projeções de leitura. Sem Event Sourcing, o CQRS pode ser adotado com triggers ou CDC populando tabelas de leitura desnormalizadas. Não aplique CQRS em telas CRUD simples, pois a infraestrutura adicional (bancos distintos, rotinas de sincronização e consistência eventual) gera complexidade desnecessária para recursos rotineiros.",
    "source": "Martin Fowler: CQRS (martinfowler.com)"
  },
  {
    "id": "a05",
    "topic": "Bloqueio Otimista vs Pessimista",
    "question": "Qual é a diferença fundamental entre bloqueio otimista (optimistic locking) e bloqueio pessimista (pessimistic locking)?",
    "code": null,
    "options": [
      "O bloqueio otimista impede qualquer leitura concorrente; o bloqueio pessimista tolera leituras sujas no banco",
      "O bloqueio otimista valida versões no commit assumindo poucos conflitos; o pessimista adquire travas antes",
      "O bloqueio pessimista é o único padrão em bancos SQL; o bloqueio otimista é restrito a motores NoSQL sem ACID",
      "Ambas as abordagens compartilham o mesmo mecanismo de trava no disco, diferenciando-se apenas na sintaxe SQL"
    ],
    "correctIndex": 1,
    "explanation": "O bloqueio pessimista (como SELECT FOR UPDATE) retém travas na linha desde a leitura, impedindo modificações concorrentes até o fim da transação. Já o bloqueio otimista permite leituras livres e valida um número de versão ou timestamp na atualização; se outro processo tiver alterado a linha no intervalo, a transação aborta e é repetida pela aplicação.",
    "compiledJS": "-- Bloqueio pessimista: trava a linha imediatamente\nBEGIN;\nSELECT * FROM inventory WHERE product_id = 5 FOR UPDATE;\n-- ... regra de negócio ...\nUPDATE inventory SET stock = stock - 1 WHERE product_id = 5;\nCOMMIT;\n\n-- Bloqueio otimista: validação de versão no UPDATE\nUPDATE inventory\n  SET stock = stock - 1, version = version + 1\nWHERE product_id = 5 AND version = 7;\n-- Se retornar 0 linhas afetadas: ocorreu conflito, reiniciar operação",
    "bestPractice": "Prefira bloqueio otimista em interfaces interativas nas quais disputas simultâneas sejam raras (como atualização de perfil cadastral) e bloqueio pessimista para estoques críticos ou fluxos de caixa em que transações concorrentes na mesma linha gerem problemas sérios de inconsistência (como sobreposição de reservas). Disponibilize o número da versão como ETag na sua API para detectar conflitos cedo.",
    "source": "DDIA: Capítulo 7: Transactions"
  },
  {
    "id": "a06",
    "topic": "Particionamento",
    "question": "Qual é a diferença entre o particionamento horizontal (sharding) e o particionamento vertical?",
    "code": null,
    "options": [
      "Horizontal divide linhas entre nós; vertical divide colunas em tabelas distintas",
      "Horizontal divide colunas entre tabelas; vertical divide linhas entre vários nós",
      "Particionamento horizontal é para SQL; particionamento vertical é para NoSQL",
      "Ambas as estratégias representam operações físicas idênticas na mesma máquina"
    ],
    "correctIndex": 0,
    "explanation": "O particionamento horizontal (sharding) fragmenta as linhas de uma tabela por múltiplos nós ou arquivos com base em uma chave de partição, mantendo a coleção integral de colunas em cada partição. O particionamento vertical fragmenta tabelas extensas agrupando colunas correlatas em tabelas menores, separando dados pesados pouco consultados (como imagens BLOB ou textos extensos) para manter a rota de busca principal leve e ágil.",
    "compiledJS": "-- Particionamento horizontal declarativo por mês no PostgreSQL:\nCREATE TABLE events (\n  id         BIGINT,\n  created_at TIMESTAMPTZ NOT NULL,\n  payload    JSONB\n) PARTITION BY RANGE (created_at);\n\nCREATE TABLE events_2024_01 PARTITION OF events\n  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');\n\nCREATE TABLE events_2024_02 PARTITION OF events\n  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');",
    "bestPractice": "Utilize o particionamento declarativo nativo do PostgreSQL em dados de séries temporais com uma chave de partição clara, permitindo que a poda de partições ignore meses desnecessários nas consultas. Combine com extensões como pg_partman para criar e purgar partições automaticamente. Para particionamento vertical, isole tabelas muito largas quando diagnósticos revelarem que leituras frequentes carregam colunas pesadas sem necessidade.",
    "source": "PostgreSQL Docs: Table Partitioning; DDIA Capítulo 6"
  },
  {
    "id": "a07",
    "topic": "Two-Phase Commit (2PC)",
    "question": "Qual problema o protocolo Two-Phase Commit (2PC) resolve em bancos de dados distribuídos?",
    "code": null,
    "options": [
      "Acelera consultas de leitura distribuídas entre nós fragmentados do cluster",
      "Garante confirmação atômica para que todos os nós confirmem ou abortem juntos",
      "Replica logs de transação WAL da instância primária para réplicas de leitura",
      "Compacta logs de transação para economizar consumo de espaço em disco nos nós"
    ],
    "correctIndex": 1,
    "explanation": "O protocolo Two-Phase Commit assegura atomicidade em transações que abrangem múltiplos nós ou bancos autônomos. Na Fase 1 (Preparação), o coordenador indaga a todos os participantes se estão prontos para efetivar; na Fase 2 (Efetivação), se todos aprovarem, o coordenador comanda o commit em conjunto, ou aborta caso algum discorde. A fragilidade reside no bloqueio: se o coordenador cair antes da fase conclusiva, os nós retêm travas sem poder deliberar sozinhos.",
    "compiledJS": null,
    "bestPractice": "Evite empregar 2PC em arquiteturas de microsserviços, dado que o acoplamento severo e o risco de retenção de bloqueios inviabilizam a resiliência global, além de não contar com suporte em serviços em nuvem. Prefira implementar o padrão Saga por meio de transações locais encadeadas com passos compensatórios. Guarde o 2PC exclusivamente para situações onde ambos os bancos estejam sob seu controle direto com suporte nativo.",
    "source": "DDIA: Capítulo 9: Consistency and Consensus"
  },
  {
    "id": "a08",
    "topic": "Modelagem de Séries Temporais",
    "question": "Qual técnica de modelagem de dados é mais adequada para dados de séries temporais com alta taxa de escrita e consultas por faixa de tempo?",
    "code": null,
    "options": [
      "Armazenar todos os eventos em uma única linha JSON desnormalizada por entidade",
      "Usar tabelas append-only particionadas por tempo com timestamps na chave primária",
      "Projetar tabelas de junção Many-to-Many com referências de chave estrangeira",
      "Aplicar normalização 3NF estrita para eliminar atributos temporais redundantes"
    ],
    "correctIndex": 1,
    "explanation": "Dados de séries temporais possuem três propriedades: adição contínua (append-only), consultas orientadas a períodos temporais e descarte programado de dados antigos. Tabelas append-only particionadas por data preservam partições recentes enxutas, viabilizam descartes velozes (DROP PARTITION em vez de DELETE) e permitem a poda de partições em filtros temporais.",
    "compiledJS": "-- Tabela de métricas append-only particionada por intervalo de tempo\nCREATE TABLE metrics (\n  metric_name TEXT        NOT NULL,\n  recorded_at TIMESTAMPTZ NOT NULL,\n  value       DOUBLE PRECISION NOT NULL,\n  PRIMARY KEY (metric_name, recorded_at)  -- agrupado por tempo por métrica\n) PARTITION BY RANGE (recorded_at);\n\n-- Consulta: últimas 24 horas (poda de partições elimina as outras partições)\nSELECT AVG(value)\nFROM metrics\nWHERE metric_name = 'cpu_usage'\n  AND recorded_at >= NOW() - INTERVAL '24 hours';",
    "bestPractice": "Para séries temporais volumosas em produção, avalie o TimescaleDB (extensão do PostgreSQL) ou ClickHouse antes de implementar mecanismos próprios de particionamento. O TimescaleDB automatiza hypertables, gestão de blocos e compressão de dados. O ClickHouse entrega armazenamento colunar com taxas de compressão e velocidade analítica superiores para consultas históricas.",
    "source": "TimescaleDB Docs: Time-Series Best Practices"
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
    "explanation": "A estratégia de banco por cliente destina uma instância ou base exclusiva para cada contratante, impedindo que vulnerabilidades de código exponham dados entre organizações, permitindo políticas individuais de backup e restauração e protegendo o ambiente contra o problema de vizinho barulhento (consultas lentas de um cliente prejudicarem os demais). Em contrapartida, acarreta custos e despesas operacionais superiores.",
    "compiledJS": null,
    "bestPractice": "Para projetos SaaS em estágio inicial, dê preferência a esquemas compartilhados com segurança ao nível de linha (Row-Level Security / RLS no PostgreSQL), pois essa arquitetura é mais simples de operar e atende milhares de clientes com baixo custo. Disponibilize instâncias dedicadas como oferta corporativa de maior valor agregado. Adote multiplexadores de conexão (como PgBouncer) para evitar a sobrecarga de conexões.",
    "source": "Citus Data: Multi-Tenant Architecture Patterns"
  },
  {
    "id": "a10",
    "topic": "Padrão Saga",
    "question": "De que maneira o padrão Saga trata a consistência de transações distribuídas sem a necessidade de usar 2PC?",
    "code": null,
    "options": [
      "Bloqueia tabelas de todos os serviços via transações XA até que um coordenador central confirme o commit final",
      "Divide a transação em transações locais, onde eventos coordenam passos e falhas disparam compensações retroativas",
      "Grava todas as operações pendentes em um banco compartilhado que centraliza bloqueios de linha entre serviços",
      "Enfileira mutações em memória temporária aguardando que um worker execute uma única transação ACID unificada"
    ],
    "correctIndex": 1,
    "explanation": "O padrão Saga fragmenta transações distribuídas longas em uma sequência de transações locais confinadas a serviços individuais. Caso ocorra uma falha em qualquer elo da cadeia, o sistema dispara transações de compensação que revertem semanticamente as etapas já concluídas para restaurar um estado estável e consistente. Diferente do 2PC, Sagas dispensam bloqueios distribuídos globais, facilitando a escalabilidade.",
    "compiledJS": null,
    "bestPractice": "Prefira abordagens baseadas em orquestração (utilizando ferramentas dedicadas como Temporal ou AWS Step Functions) para coreografias em fluxos de negócios elaborados, pois a visão unificada do processo agiliza diagnósticos e observabilidade. Projete sempre as transações compensatórias previamente: se um passo não puder ser revertido com segurança, ele não deve ser inserido em uma Saga.",
    "source": "Chris Richardson: Microservices Patterns, Capítulo 4"
  }
]
