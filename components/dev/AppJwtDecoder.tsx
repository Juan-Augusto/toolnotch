"use client";

import { useState, useMemo } from "react";
import {
  AppCard,
  AppButton,
  AppTextarea,
  AppBadge,
} from "@/components/ui";
import { decodeJwt, SAMPLE_JWTS } from "@/lib/dev/jwt";
import { Copy, Check, ShieldCheck, AlertTriangle, Key, Sparkles, Trash2 } from "lucide-react";

interface Props {
  locale?: string;
}

const INITIAL_TOKEN = SAMPLE_JWTS.standard;

export default function AppJwtDecoder({ locale = "pt" }: Props) {
  const [tokenInput, setTokenInput] = useState(INITIAL_TOKEN);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const decoded = useMemo(() => {
    return decodeJwt(tokenInput, locale);
  }, [tokenInput, locale]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  const isPt = locale === "pt";

  return (
    <div className="w-full space-y-6">
      {/* Input Section Card */}
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary space-y-4">
        <div>
          <label htmlFor="jwt-input" className="text-xs font-semibold uppercase font-mono text-foreground flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-primary" />
            {isPt ? "Token JWT Codificado" : "Encoded JWT Token"}
          </label>
          <p className="text-sm text-label mt-1">
            {isPt
              ? "Decodificação segura e instantânea no cliente - sua chave e payload nunca são enviados ao servidor."
              : "100% client-side decoding - your secret and payload are never sent to any server."}
          </p>
        </div>

        {/* Examples Bar & Clear Action */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/70">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-label uppercase font-semibold mr-1">
              {isPt ? "Exemplos:" : "Samples:"}
            </span>
            <AppButton
              color="tertiary"
              small
              className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3"
              onClick={() => setTokenInput(SAMPLE_JWTS.standard)}
            >
              {isPt ? "Padrão" : "Standard"}
            </AppButton>
            <AppButton
              color="tertiary"
              small
              className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3"
              onClick={() => setTokenInput(SAMPLE_JWTS.admin)}
            >
              Admin
            </AppButton>
            <AppButton
              color="tertiary"
              small
              className="!bg-background text-xs font-mono font-normal !py-1.5 !px-3"
              onClick={() => setTokenInput(SAMPLE_JWTS.expired)}
            >
              {isPt ? "Expirado" : "Expired"}
            </AppButton>
          </div>

          {tokenInput && (
            <AppButton
              color="tertiary"
              small
              className="!bg-background text-xs font-mono font-normal text-destructive hover:text-destructive !py-1.5 !px-3 ml-auto"
              icon={<Trash2 className="w-3.5 h-3.5 text-destructive" />}
              iconPosition="left"
              onClick={() => setTokenInput("")}
            >
              {isPt ? "Limpar" : "Clear"}
            </AppButton>
          )}
        </div>

        <AppTextarea
          id="jwt-input"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          rows={4}
          variant="background"
          className="w-full font-mono text-sm break-all"
        />

        {/* Status / Expiration Banner */}
        {decoded.isValidFormat && decoded.expiration && (
          <div
            className={`p-4 rounded-[2px] border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              decoded.expiration.statusType === "valid"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : decoded.expiration.statusType === "expired"
                  ? "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400"
            }`}
          >
            <div className="flex items-center gap-3">
              {decoded.expiration.statusType === "valid" ? (
                <ShieldCheck className="w-5 h-5 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0" />
              )}
              <div>
                <div className="font-medium text-sm">
                  {decoded.expiration.statusType === "valid"
                    ? isPt
                      ? "Token Válido (Dentro do Prazo de Expiração)"
                      : "Token Valid (Not Expired)"
                    : decoded.expiration.statusType === "expired"
                      ? isPt
                        ? "Token Expirado"
                        : "Token Expired"
                      : isPt
                        ? "Token sem expiração definida (exp)"
                        : "Token has no expiration claim (exp)"}
                </div>
                <div className="text-sm opacity-90">{decoded.expiration.timeStatusLabel}</div>
              </div>
            </div>

            {decoded.expiration.hasExp && (
              <div className="text-sm font-mono bg-background/80 px-3 py-1.5 rounded-[2px] border border-border self-start sm:self-center">
                <span className="opacity-70 mr-1.5 font-normal">exp:</span>
                {decoded.expiration.formattedExpLocal}
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {!decoded.isValidFormat && tokenInput.trim() && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-[2px] text-sm font-mono">
            {decoded.error}
          </div>
        )}
      </AppCard>

      {/* Decoded Output Panels */}
      {decoded.isValidFormat && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Header Panel */}
          <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-red-500 inline-block" />
                <h3 className="text-xs font-semibold uppercase font-mono text-foreground">
                  HEADER: <span className="text-label font-normal">Algorithm & Type</span>
                </h3>
              </div>
              <AppButton
                color="tertiary"
                small
                className="!bg-background text-sm font-mono !py-2 !px-3.5"
                icon={copiedKey === "header" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                iconPosition="left"
                onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), "header")}
              >
                {copiedKey === "header" ? (isPt ? "Copiado!" : "Copied!") : (isPt ? "Copiar Header" : "Copy Header")}
              </AppButton>
            </div>

            <pre className="p-4 bg-background border border-border rounded-[2px] text-sm font-mono text-foreground overflow-x-auto">
              <code>{JSON.stringify(decoded.header, null, 2)}</code>
            </pre>
          </AppCard>

          {/* Signature Panel */}
          <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-blue-500 inline-block" />
                <h3 className="text-xs font-semibold uppercase font-mono text-foreground">
                  SIGNATURE: <span className="text-label font-normal">Crypto Signature</span>
                </h3>
              </div>
              <AppButton
                color="tertiary"
                small
                className="!bg-background text-sm font-mono !py-2 !px-3.5"
                icon={copiedKey === "sig" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                iconPosition="left"
                onClick={() => copyToClipboard(decoded.signature, "sig")}
              >
                {copiedKey === "sig" ? (isPt ? "Copiado!" : "Copied!") : (isPt ? "Copiar Assinatura" : "Copy Signature")}
              </AppButton>
            </div>

            <div className="p-4 bg-background border border-border rounded-[2px] text-sm font-mono text-label break-all">
              {decoded.signature || (isPt ? "(Sem assinatura)" : "(No signature)")}
            </div>

            <p className="text-sm text-label">
              {isPt
                ? "A assinatura garante a integridade criptográfica do token quando validada com a chave secreta."
                : "The signature guarantees cryptographic integrity against tampering when verified with the secret key."}
            </p>
          </AppCard>

          {/* Payload Panel */}
          <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-purple-500 inline-block" />
                <h3 className="text-xs font-semibold uppercase font-mono text-foreground">
                  PAYLOAD: <span className="text-label font-normal">Data & Standard Claims</span>
                </h3>
              </div>
              <AppButton
                color="tertiary"
                small
                className="!bg-background text-sm font-mono !py-2 !px-3.5"
                icon={copiedKey === "payload" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                iconPosition="left"
                onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), "payload")}
              >
                {copiedKey === "payload" ? (isPt ? "Copiado!" : "Copied!") : (isPt ? "Copiar Payload JSON" : "Copy Payload JSON")}
              </AppButton>
            </div>

            <pre className="p-4 bg-background border border-border rounded-[2px] text-sm font-mono text-foreground overflow-x-auto max-h-96">
              <code>{JSON.stringify(decoded.payload, null, 2)}</code>
            </pre>
          </AppCard>
        </div>
      )}
    </div>
  );
}
