import {
  generateSingleCpf,
  generateMultipleCpfs,
  validateCpf,
  formatCpf,
  unformatCpf,
} from "@/lib/dev/cpf";
import {
  generateSingleCnpj,
  generateMultipleCnpjs,
  generateCompanyDetails,
  validateCnpj,
  formatCnpj,
  unformatCnpj,
} from "@/lib/dev/cnpj";
import {
  generateSingleAddress,
  generateMultipleAddresses,
  formatAddressLine,
} from "@/lib/dev/address";
import {
  generateSingleUuid,
  generateMultipleUuids,
  validateUuid,
  generateUuidV4,
  generateUuidV7,
  generateUuidV1,
} from "@/lib/dev/uuid";
import {
  formatJson,
  minifyJson,
  validateJson,
  calculateJsonStats,
  tryFixJson,
} from "@/lib/dev/json";

describe("CPF Helper", () => {
  test("generates valid formatted and unformatted CPFs", () => {
    const formatted = generateSingleCpf({ formatted: true });
    expect(formatted).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
    expect(validateCpf(formatted).isValid).toBe(true);

    const unformatted = generateSingleCpf({ formatted: false });
    expect(unformatted).toMatch(/^\d{11}$/);
    expect(validateCpf(unformatted).isValid).toBe(true);
  });

  test("validates known invalid CPFs", () => {
    expect(validateCpf("111.111.111-11").isValid).toBe(false);
    expect(validateCpf("123.456.789-00").isValid).toBe(false);
    expect(validateCpf("12345").isValid).toBe(false);
  });

  test("generates multiple CPFs", () => {
    const list = generateMultipleCpfs(5);
    expect(list.length).toBe(5);
    list.forEach((cpf) => expect(validateCpf(cpf).isValid).toBe(true));
  });

  test("generates CPF filtered by state", () => {
    const spCpf = generateSingleCpf({ stateCode: "SP", formatted: false });
    expect(spCpf[8]).toBe("8");
    expect(validateCpf(spCpf).isValid).toBe(true);
  });
});

describe("CNPJ Helper", () => {
  test("generates valid formatted and unformatted CNPJs", () => {
    const formatted = generateSingleCnpj({ formatted: true });
    expect(formatted).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
    expect(validateCnpj(formatted).isValid).toBe(true);

    const unformatted = generateSingleCnpj({ formatted: false });
    expect(unformatted).toMatch(/^\d{14}$/);
    expect(validateCnpj(unformatted).isValid).toBe(true);
  });

  test("validates known invalid CNPJs", () => {
    expect(validateCnpj("00.000.000/0000-00").isValid).toBe(false);
    expect(validateCnpj("11.222.333/0001-99").isValid).toBe(false);
  });

  test("generates realistic company details", () => {
    const company = generateCompanyDetails();
    expect(validateCnpj(company.cnpj).isValid).toBe(true);
    expect(company.razaoSocial).toBeTruthy();
    expect(company.nomeFantasia).toBeTruthy();
    expect(company.inscricaoEstadual).toBeTruthy();
    expect(company.cnaePrincipal.codigo).toBeTruthy();
    expect(company.endereco.logradouro).toBeTruthy();
    expect(company.endereco.cep).toMatch(/^\d{5}-\d{3}$/);
  });
});

describe("Address Helper", () => {
  test("generates valid Brazilian addresses with real fields", () => {
    const addr = generateSingleAddress();
    expect(addr.cep).toMatch(/^\d{5}-\d{3}$/);
    expect(addr.logradouro).toBeTruthy();
    expect(addr.bairro).toBeTruthy();
    expect(addr.cidade).toBeTruthy();
    expect(addr.uf).toBeTruthy();
    expect(addr.ddd).toBeTruthy();

    const line = formatAddressLine(addr);
    expect(line).toContain(addr.cidade);
    expect(line).toContain(addr.uf);
  });

  test("generates multiple addresses with UF filter", () => {
    const list = generateMultipleAddresses(3, { uf: "SP" });
    expect(list.length).toBe(3);
    list.forEach((a) => expect(a.uf).toBe("SP"));
  });
});

describe("UUID Helper", () => {
  test("generates valid UUID v4, v7, v1", () => {
    const v4 = generateSingleUuid({ version: "v4" });
    expect(validateUuid(v4).isValid).toBe(true);
    expect(validateUuid(v4).version).toBe(4);

    const v7 = generateSingleUuid({ version: "v7" });
    expect(validateUuid(v7).isValid).toBe(true);
    expect(validateUuid(v7).version).toBe(7);

    const v1 = generateSingleUuid({ version: "v1" });
    expect(validateUuid(v1).isValid).toBe(true);
    expect(validateUuid(v1).version).toBe(1);
  });

  test("formats uppercase, no-hyphen, and braces", () => {
    const upper = generateSingleUuid({ uppercase: true });
    expect(upper).toEqual(upper.toUpperCase());

    const noHyphens = generateSingleUuid({ hyphens: false });
    expect(noHyphens).not.toContain("-");
    expect(noHyphens.length).toBe(32);

    const withBraces = generateSingleUuid({ braces: true });
    expect(withBraces.startsWith("{")).toBe(true);
    expect(withBraces.endsWith("}")).toBe(true);
  });
});

describe("JSON Helper", () => {
  test("formats, minifies, and calculates stats correctly", () => {
    const raw = '{"a":1,"b":[2,3],"c":{"d":"hello"}}';
    const formatted = formatJson(raw, 2).formatted;
    expect(formatted).toContain('\n  "a": 1');

    const minified = minifyJson(formatted).minified;
    expect(minified).toBe(raw);

    const stats = calculateJsonStats(raw);
    expect(stats).not.toBeNull();
    expect(stats?.keysCount).toBe(4);
    expect(stats?.depth).toBe(3);
    expect(stats?.rootType).toBe("object");
  });

  test("validates invalid JSON and reports error location", () => {
    const invalid = '{\n  "a": 1,\n  "b": \n}';
    const result = validateJson(invalid);
    expect(result.isValid).toBe(false);
    expect(result.error?.message).toBeTruthy();
  });

  test("auto-fixes single quotes and trailing commas", () => {
    const messy = "{ 'name': 'ToolNotch', 'active': true, }";
    const fixed = tryFixJson(messy);
    const parsed = JSON.parse(fixed);
    expect(parsed.name).toBe("ToolNotch");
    expect(parsed.active).toBe(true);
  });
});

import { decodeJwt, formatTimeDifference, SAMPLE_JWTS } from "@/lib/dev/jwt";
import { encodeBase64, decodeBase64, hexToBase64, base64ToHex } from "@/lib/dev/base64";
import { md5, crc32, generateAllHashes, computeHmac } from "@/lib/dev/hash";
import { parseUrl, rebuildUrlFromParts } from "@/lib/dev/url";
import { testRegex } from "@/lib/dev/regex";

describe("JWT Helper", () => {
  test("decodes valid standard JWT", () => {
    const res = decodeJwt(SAMPLE_JWTS.standard);
    expect(res.isValidFormat).toBe(true);
    expect(res.header?.alg).toBe("HS256");
    expect(res.payload?.name).toBe("João Silva");
    expect(res.payload?.email).toBe("joao.silva@example.com");
    expect(res.expiration).not.toBeNull();
  });

  test("flags expired tokens accurately", () => {
    const res = decodeJwt(SAMPLE_JWTS.expired);
    expect(res.isValidFormat).toBe(true);
    expect(res.expiration?.isExpired).toBe(true);
    expect(res.expiration?.statusType).toBe("expired");
  });

  test("rejects invalid JWT format", () => {
    const res = decodeJwt("invalid.jwt.format.extra");
    expect(res.isValidFormat).toBe(false);
  });
});

describe("Base64 Helper", () => {
  test("encodes and decodes UTF-8 strings accurately", () => {
    const original = "Olá Mundo 🚀 ToolNotch - Ferramentas de Devs!";
    const encoded = encodeBase64(original);
    const decoded = decodeBase64(encoded);
    expect(decoded).toBe(original);
  });

  test("supports URL-safe Base64 encoding", () => {
    const sample = "subjects?test=1&alpha=beta+gamma/delta==";
    const urlSafe = encodeBase64(sample, true);
    expect(urlSafe).not.toContain("+");
    expect(urlSafe).not.toContain("/");
    expect(urlSafe).not.toContain("=");
  });

  test("converts Hex to Base64 and vice-versa", () => {
    const hex = "48656c6c6f20576f726c64"; // "Hello World"
    const b64 = hexToBase64(hex);
    expect(b64).toBe("SGVsbG8gV29ybGQ=");
    expect(base64ToHex(b64)).toBe(hex);
  });
});

describe("Hash & Checksum Helper", () => {
  test("generates accurate MD5 and CRC32", () => {
    expect(md5("hello world")).toBe("5eb63bbbe01eeed093cb22bb8f5acdc3");
    expect(crc32("hello world")).toBe("0d4a1185");
  });

  test("generates all SHA hashes and HMAC", async () => {
    const hashes = await generateAllHashes("ToolNotch");
    expect(hashes.sha256).toBe("a431cef367f3afa76685ea04011d37852e11a440db2da7f4e997f6fa6103fbc0");
    expect(hashes.md5).toBe("b323e9539f343053f3682e240fe5af0c");

    const hmac = await computeHmac("SHA-256", "secret-key", "ToolNotch");
    expect(hmac).toBeTruthy();
  });
});

describe("URL Parser Helper", () => {
  test("parses structured URL elements", () => {
    const url = "https://app.toolnotch.com:8080/api/v1/search?category=dev&sort=asc&utm_source=news#results";
    const parsed = parseUrl(url);
    expect(parsed.isValid).toBe(true);
    expect(parsed.protocol).toBe("https:");
    expect(parsed.hostname).toBe("app.toolnotch.com");
    expect(parsed.port).toBe("8080");
    expect(parsed.pathname).toBe("/api/v1/search");
    expect(parsed.params.length).toBe(3);
    expect(parsed.cleanUrlWithoutTracking).not.toContain("utm_source");
  });

  test("rebuilds URL with modified query parameters", () => {
    const base = "https://toolnotch.com/search";
    const params = [
      { id: "1", key: "q", value: "nextjs", enabled: true },
      { id: "2", key: "draft", value: "true", enabled: false },
    ];
    const rebuilt = rebuildUrlFromParts(base, params, "section");
    expect(rebuilt).toBe("https://toolnotch.com/search?q=nextjs#section");
  });
});

describe("Regex Tester Helper", () => {
  test("matches patterns and extracts capture groups", () => {
    const pattern = "(\\d{3})\\.(\\d{3})\\.(\\d{3})-(\\d{2})";
    const text = "CPFs: 123.456.789-01 e 987.654.321-99";
    const res = testRegex(pattern, "g", text);
    expect(res.isValidPattern).toBe(true);
    expect(res.totalMatches).toBe(2);
    expect(res.matches[0].groups.length).toBe(4);
    expect(res.matches[0].groups[0].value).toBe("123");
  });

  test("performs pattern substitution", () => {
    const res = testRegex("apple", "gi", "I have an apple and Apple pie", "orange");
    expect(res.replacedText).toBe("I have an orange and orange pie");
  });
});
