"use client";

import { useState, useEffect, useTransition } from "react";
import {
  AppCard,
  AppButton,
  AppInput,
  AppTextarea,
  AppCheckbox,
  AppBadge,
} from "@/components/ui";
import { generateAllHashes, computeHmac, type GeneratedHashes } from "@/lib/dev/hash";
import { Copy, Check, Hash, ShieldCheck, Key, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  locale?: string;
}

const INITIAL_TEXT = "ToolNotch Developer Platform 2026";
const INITIAL_HASHES: GeneratedHashes = {
  md5: "5877f0a7ef2049f506e788eb504780db",
  sha1: "15c60e352ef29b35e61bf5dfd6ef77f11c7849e7",
  sha256: "bf5b8f6c3848b8159b3506ef89569e5d794ee7341ea2221b6c8e31a89c97b830",
  sha384: "57e62a14918e69d7b4b1a8d05b7efb993717dfb11910cf972d3f6631ad77553f40443423b49c716ceab9f0a205d1a580",
  sha512: "e2cbe8ea6d20397fc87cb281fb2b9d214a1b026602377a0bf9199d799059e66ffebad656fba11b85848bb28a07c3905c11054ee5cb1dff2262d08985fb823a3f",
  crc32: "ca38153c",
};

export default function AppHashGenerator({ locale = "pt" }: Props) {
  const [inputText, setInputText] = useState(INITIAL_TEXT);
  const [hashes, setHashes] = useState<GeneratedHashes>(INITIAL_HASHES);
  const [uppercase, setUppercase] = useState(false);
  const [compareHash, setCompareHash] = useState("");
  const [hmacSecret, setHmacSecret] = useState("");
  const [hmacResult, setHmacResult] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const isPt = locale === "pt";

  useEffect(() => {
    let isCancelled = false;
    startTransition(() => {
      if (!inputText) {
        setHashes({
          md5: "",
          sha1: "",
          sha256: "",
          sha384: "",
          sha512: "",
          crc32: "",
        });
        setHmacResult("");
        return;
      }

      generateAllHashes(inputText)
        .then((res) => {
          if (!isCancelled) {
            setHashes(res);
          }
        })
        .catch(() => {});

      if (hmacSecret) {
        computeHmac("SHA-256", hmacSecret, inputText)
          .then((res) => {
            if (!isCancelled) {
              setHmacResult(res);
            }
          })
          .catch(() => {});
      } else {
        setHmacResult("");
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [inputText, hmacSecret]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      const output = uppercase ? text.toUpperCase() : text.toLowerCase();
      await navigator.clipboard.writeText(output);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  const getCleanHash = (h: string) => (uppercase ? h.toUpperCase() : h.toLowerCase());

  // Comparison logic
  const trimmedCompare = compareHash.trim().toLowerCase();
  const matchedAlgorithm = trimmedCompare
    ? Object.entries(hashes).find(([, val]) => val.toLowerCase() === trimmedCompare)?.[0]
    : null;

  const hashList = [
    { key: "sha256", label: "SHA-256", value: hashes.sha256, bits: 256, rec: true },
    { key: "sha512", label: "SHA-512", value: hashes.sha512, bits: 512 },
    { key: "md5", label: "MD5", value: hashes.md5, bits: 128 },
    { key: "sha1", label: "SHA-1", value: hashes.sha1, bits: 160 },
    { key: "sha384", label: "SHA-384", value: hashes.sha384, bits: 384 },
    { key: "crc32", label: "CRC-32 (Checksum)", value: hashes.crc32, bits: 32 },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Input Section Card */}
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label htmlFor="hash-input" className="text-xs font-semibold uppercase font-mono text-foreground flex items-center gap-2">
            <Hash className="w-4 h-4 text-primary" />
            {isPt ? "Texto de Entrada" : "Input String"}
          </label>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-mono text-foreground bg-background px-3.5 py-1.5 rounded-[2px] border border-border">
              <AppCheckbox
                checked={uppercase}
                onChange={(checked) => setUppercase(checked)}
              />
              <span>{isPt ? "Maiúsculas (HEX)" : "Uppercase (HEX)"}</span>
            </label>

            {inputText && (
              <AppButton
                color="tertiary"
                small
                className="!bg-background text-sm font-mono text-destructive hover:text-destructive !py-1.5 !px-3"
                onClick={() => setInputText("")}
              >
                {isPt ? "Limpar" : "Clear"}
              </AppButton>
            )}
          </div>
        </div>

        <AppTextarea
          id="hash-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isPt ? "Digite ou cole qualquer texto para gerar hashes em tempo real..." : "Type or paste string to generate hashes in real-time..."}
          rows={3}
          variant="background"
          className="w-full font-mono text-sm"
        />

        {/* Checksum Verifier & Compare */}
        <div className="p-4 bg-background border border-border rounded-[2px] space-y-3">
          <span className="text-xs font-semibold uppercase font-mono text-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            {isPt ? "Verificador / Comparador de Hash" : "Hash Comparison / Checksum Verifier"}
          </span>

          <div className="relative flex items-center">
            <AppInput
              type="text"
              value={compareHash}
              onChange={(e) => setCompareHash(e.target.value)}
              placeholder={isPt ? "Cole um hash esperado aqui para validar correspondência..." : "Paste expected hash here to verify integrity..."}
              className="w-full font-mono text-sm pr-36"
            />
            {compareHash.trim() && (
              <div className="absolute right-3">
                {matchedAlgorithm ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-normal text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-[2px] border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    {matchedAlgorithm.toUpperCase()} Match!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-normal text-destructive bg-destructive/10 px-2.5 py-1 rounded-[2px] border border-destructive/30">
                    <XCircle className="w-4 h-4" />
                    {isPt ? "Sem correspondência" : "Mismatch"}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </AppCard>

      {/* Generated Hashes List */}
      <div className="space-y-3">
        {hashList.map((item) => {
          const isMatched = trimmedCompare && item.value.toLowerCase() === trimmedCompare;
          return (
            <AppCard
              key={item.key}
              border
              cornerAccents
              className={`p-4 sm:p-5 bg-tertiary transition-colors ${
                isMatched ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/5" : ""
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase font-mono text-foreground">{item.label}</span>
                  <span className="text-xs text-label font-mono">({item.bits} bits)</span>
                  {item.rec && (
                    <span className="text-xs font-mono font-normal bg-primary text-background px-2 py-0.5 rounded-[2px]">
                      {isPt ? "Padrão de Segurança" : "Standard"}
                    </span>
                  )}
                </div>

                <AppButton
                  color="tertiary"
                  small
                  disabled={!item.value}
                  className="!bg-background text-sm font-mono !py-1.5 !px-3 self-start sm:self-auto"
                  icon={copiedKey === item.key ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  iconPosition="left"
                  onClick={() => copyToClipboard(item.value, item.key)}
                >
                  {copiedKey === item.key ? (isPt ? "Copiado!" : "Copied!") : (isPt ? "Copiar Hash" : "Copy Hash")}
                </AppButton>
              </div>

              <div className="p-3 bg-background border border-border rounded-[2px] font-mono text-sm text-foreground break-all select-all">
                {item.value ? getCleanHash(item.value) : <span className="text-label">—</span>}
              </div>
            </AppCard>
          );
        })}
      </div>

      {/* HMAC Section */}
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/70">
          <Key className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-semibold uppercase font-mono text-foreground">
            {isPt ? "Gerar HMAC com Chave Secreta (HMAC-SHA256)" : "Generate HMAC with Secret Key (HMAC-SHA256)"}
          </h2>
        </div>

        <div className="space-y-3">
          <AppInput
            type="text"
            value={hmacSecret}
            onChange={(e) => setHmacSecret(e.target.value)}
            placeholder={isPt ? "Digite a chave secreta compartilhada (Secret Key)..." : "Enter shared secret key..."}
            className="w-full font-mono text-sm"
          />

          {hmacResult && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-background border border-border rounded-[2px]">
              <div className="font-mono text-sm text-foreground break-all select-all">{getCleanHash(hmacResult)}</div>
              <AppButton
                color="tertiary"
                small
                className="!bg-background text-sm font-mono !py-2 !px-3.5 shrink-0"
                icon={copiedKey === "hmac" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                iconPosition="left"
                onClick={() => copyToClipboard(hmacResult, "hmac")}
              >
                {copiedKey === "hmac" ? (isPt ? "Copiado!" : "Copied!") : (isPt ? "Copiar HMAC" : "Copy HMAC")}
              </AppButton>
            </div>
          )}
        </div>
      </AppCard>
    </div>
  );
}
