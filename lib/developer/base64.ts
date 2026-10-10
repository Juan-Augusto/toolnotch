export interface Base64Result {
  text: string;
  valid: boolean;
  errorMessage?: string;
  bytesCount?: number;
}

function getByteLength(str: string): number {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(str).length;
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.byteLength(str, "utf8");
  }
  return encodeURIComponent(str).replace(/%[A-F\d]{2}/g, "U").length;
}

/**
 * Encodes text to Base64 with full UTF-8 and optional URL-safe mode.
 */
export function encodeBase64(text: string, urlSafe = false): Base64Result {
  try {
    let base64 = "";
    if (typeof Buffer !== "undefined") {
      base64 = Buffer.from(text, "utf8").toString("base64");
    } else if (typeof btoa !== "undefined") {
      base64 = btoa(
        encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
    } else {
      return { text: "", valid: false, errorMessage: "Ambiente não suporta codificação Base64." };
    }

    if (urlSafe) {
      base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }

    return {
      text: base64,
      valid: true,
      bytesCount: getByteLength(text),
    };
  } catch (err) {
    return {
      text: "",
      valid: false,
      errorMessage: "Erro ao codificar o texto em Base64.",
    };
  }
}

/**
 * Decodes Base64 to text with full UTF-8 support and URL-safe handling.
 */
export function decodeBase64(input: string, urlSafe = false): Base64Result {
  try {
    let clean = input.trim();
    if (!clean) {
      return { text: "", valid: true, bytesCount: 0 };
    }

    // Convert URL-safe characters back to standard Base64
    if (urlSafe || clean.includes("-") || clean.includes("_")) {
      clean = clean.replace(/-/g, "+").replace(/_/g, "/");
      const pad = clean.length % 4;
      if (pad === 2) clean += "==";
      else if (pad === 3) clean += "=";
    }

    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(clean)) {
      return {
        text: "",
        valid: false,
        errorMessage: "Entrada Base64 inválida ou caracteres não permitidos.",
      };
    }

    let decodedText = "";
    if (typeof Buffer !== "undefined") {
      decodedText = Buffer.from(clean, "base64").toString("utf8");
    } else if (typeof atob !== "undefined") {
      const binary = atob(clean);
      decodedText = decodeURIComponent(
        Array.prototype.map
          .call(binary, (ch: string) => "%" + ("00" + ch.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    }

    return {
      text: decodedText,
      valid: true,
      bytesCount: getByteLength(decodedText),
    };
  } catch (err) {
    return {
      text: "",
      valid: false,
      errorMessage: "Entrada Base64 inválida ou caracteres malformados.",
    };
  }
}
