type TokenType = "kw" | "ty" | "str" | "cmt" | "num" | "txt";

const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "switch",
  "case",
  "default",
  "for",
  "while",
  "typeof",
  "instanceof",
  "new",
  "class",
  "export",
  "import",
  "from",
  "as",
  "keyof",
  "infer",
  "satisfies",
  "declare",
  "namespace",
  "enum",
  "readonly",
  "abstract",
  "override",
  "async",
  "await",
  "of",
  "in",
  "throw",
  "try",
  "catch",
  "finally",
  "break",
  "continue",
  "do",
  "type",
  "interface",
  "extends",
  "implements",
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "INNER",
  "LEFT",
  "RIGHT",
  "CREATE",
  "TABLE",
  "ALTER",
  "INDEX",
  "PRIMARY",
  "KEY",
  "FOREIGN",
  "REFERENCES",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
]);

const TYPES = new Set([
  "string",
  "number",
  "boolean",
  "object",
  "symbol",
  "bigint",
  "any",
  "unknown",
  "never",
  "void",
  "null",
  "undefined",
  "true",
  "false",
  "TEXT",
  "VARCHAR",
  "INTEGER",
  "BIGINT",
  "SERIAL",
  "BOOLEAN",
  "TIMESTAMP",
  "UUID",
  "JSONB",
]);

function tokenizeCode(code: string): { type: TokenType; value: string }[] {
  const tokens: { type: TokenType; value: string }[] = [];
  let i = 0;
  while (i < code.length) {
    if (
      (code[i] === "/" && code[i + 1] === "/") ||
      (code[i] === "-" && code[i + 1] === "-")
    ) {
      let j = i;
      while (j < code.length && code[j] !== "\n") j++;
      tokens.push({ type: "cmt", value: code.slice(i, j) });
      i = j;
      continue;
    }
    if (code[i] === "/" && code[i + 1] === "*") {
      let j = i + 2;
      while (j < code.length - 1 && !(code[j] === "*" && code[j + 1] === "/"))
        j++;
      tokens.push({ type: "cmt", value: code.slice(i, j + 2) });
      i = j + 2;
      continue;
    }
    const q = code[i];
    if (q === '"' || q === "'" || q === "`") {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\") {
          j += 2;
          continue;
        }
        if (code[j] === q) {
          j++;
          break;
        }
        j++;
      }
      tokens.push({ type: "str", value: code.slice(i, j) });
      i = j;
      continue;
    }
    if (/\d/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\d.eExX_a-fA-F]/.test(code[j])) j++;
      tokens.push({ type: "num", value: code.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      const tokenType = KEYWORDS.has(word)
        ? "kw"
        : TYPES.has(word)
          ? "ty"
          : "txt";
      tokens.push({ type: tokenType, value: word });
      i = j;
      continue;
    }
    tokens.push({ type: "txt", value: code[i] });
    i++;
  }
  return tokens;
}

const TOKEN_COLORS: Record<TokenType, string> = {
  kw: "text-purple-400",
  ty: "text-blue-400",
  str: "text-emerald-400",
  cmt: "text-slate-500 italic",
  num: "text-amber-400",
  txt: "text-slate-200",
};

export interface AppInterviewCodeSnippetProps {
  code: string;
  className?: string;
}

export function AppInterviewCodeSnippet({
  code,
  className = "",
}: AppInterviewCodeSnippetProps) {
  const tokens = tokenizeCode(code);
  return (
    <pre
      className={`bg-[#0f172a] text-slate-200 rounded-[2px] p-4 overflow-x-auto font-mono leading-relaxed border border-slate-800 ${className}`}
    >
      <code>
        {tokens.map((tok, index) => (
          <span key={index} className={TOKEN_COLORS[tok.type]}>
            {tok.value}
          </span>
        ))}
      </code>
    </pre>
  );
}

export default AppInterviewCodeSnippet;
