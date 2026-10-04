"use client";

import { useState, useMemo } from "react";
import {
  AppCard,
  AppButton,
  AppInput,
  AppTextarea,
  AppCheckbox,
  AppBadge,
} from "@/components/ui";
import { parseUrl, rebuildUrlFromParts, SAMPLE_URLS, type QueryParamItem } from "@/lib/dev/url";
import { Copy, Check, Globe, Link2, Plus, Trash2, Filter, Sparkles } from "lucide-react";

interface Props {
  locale?: string;
}

const INITIAL_URL = SAMPLE_URLS.ecommerce;

export default function AppUrlParser({ locale = "pt" }: Props) {
  const [urlInput, setUrlInput] = useState(INITIAL_URL);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const parsed = useMemo(() => {
    return parseUrl(urlInput);
  }, [urlInput]);

  const [params, setParams] = useState<QueryParamItem[]>(() => parsed.params);

  // Sync params when user changes raw URL text directly
  const handleUrlInputChange = (val: string) => {
    setUrlInput(val);
    const newParsed = parseUrl(val);
    setParams(newParsed.params);
  };

  const updateParam = (id: string, field: "key" | "value" | "enabled", val: string | boolean) => {
    const next = params.map((p) => {
      if (p.id === id) {
        return { ...p, [field]: val };
      }
      return p;
    });
    setParams(next);
    const rebuilt = rebuildUrlFromParts(urlInput, next, parsed.hash);
    setUrlInput(rebuilt);
  };

  const removeParam = (id: string) => {
    const next = params.filter((p) => p.id !== id);
    setParams(next);
    const rebuilt = rebuildUrlFromParts(urlInput, next, parsed.hash);
    setUrlInput(rebuilt);
  };

  const addParam = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    const next = [...params, { id: newId, key: "novo_parametro", value: "valor", enabled: true }];
    setParams(next);
    const rebuilt = rebuildUrlFromParts(urlInput, next, parsed.hash);
    setUrlInput(rebuilt);
  };

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
      {/* Main URL Input Card */}
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label htmlFor="url-input" className="text-xs font-semibold uppercase font-mono text-foreground flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              {isPt ? "URL para Análise e Edição" : "URL to Parse and Edit"}
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-label font-mono">
                {isPt ? "Exemplos:" : "Samples:"}
              </span>
              <AppButton
                color="tertiary"
                small
                className="!bg-background text-sm font-mono !py-1.5 !px-3"
                onClick={() => handleUrlInputChange(SAMPLE_URLS.ecommerce)}
              >
                E-commerce
              </AppButton>
              <AppButton
                color="tertiary"
                small
                className="!bg-background text-sm font-mono !py-1.5 !px-3"
                onClick={() => handleUrlInputChange(SAMPLE_URLS.oauth)}
              >
                OAuth 2.0
              </AppButton>
              <AppButton
                color="tertiary"
                small
                className="!bg-background text-sm font-mono !py-1.5 !px-3"
                onClick={() => handleUrlInputChange(SAMPLE_URLS.tracking)}
              >
                UTM / Ads
              </AppButton>
              {urlInput && (
                <AppButton
                  color="tertiary"
                  small
                  className="!bg-background text-sm font-mono text-destructive hover:text-destructive !py-1.5 !px-3"
                  onClick={() => handleUrlInputChange("")}
                >
                  {isPt ? "Limpar" : "Clear"}
                </AppButton>
              )}
            </div>
          </div>

          <AppTextarea
            id="url-input"
            value={urlInput}
            onChange={(e) => handleUrlInputChange(e.target.value)}
            placeholder="https://exemplo.com.br/api/v1/busca?categoria=dev&ordem=asc#secao"
            rows={3}
            variant="background"
            className="w-full font-mono text-sm break-all"
          />

          {parsed.isValid && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <AppButton
                  color="tertiary"
                  small
                  className="!bg-background text-sm font-mono !py-2 !px-3.5"
                  icon={copiedKey === "full" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  iconPosition="left"
                  onClick={() => copyToClipboard(urlInput, "full")}
                >
                  {copiedKey === "full" ? (isPt ? "Copiado!" : "Copied!") : (isPt ? "Copiar URL" : "Copy URL")}
                </AppButton>

                {parsed.cleanUrlWithoutTracking !== urlInput && (
                  <AppButton
                    color="tertiary"
                    small
                    className="!bg-background text-sm font-mono !py-2 !px-3.5"
                    icon={copiedKey === "clean" ? <Check className="w-4 h-4 text-emerald-500" /> : <Filter className="w-4 h-4" />}
                    iconPosition="left"
                    onClick={() => {
                      handleUrlInputChange(parsed.cleanUrlWithoutTracking);
                      copyToClipboard(parsed.cleanUrlWithoutTracking, "clean");
                    }}
                  >
                    {isPt ? "Remover Rastreamento (UTMs)" : "Strip Tracking (UTMs)"}
                  </AppButton>
                )}
              </div>

              <div className="text-sm font-mono text-label">
                {params.length} {isPt ? "parâmetros detectados" : "params detected"}
              </div>
            </div>
          )}
        </div>
      </AppCard>

      {/* Structural Breakdown Cards */}
      {parsed.isValid && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AppCard border cornerAccents className="p-4 bg-tertiary space-y-1">
            <span className="text-xs font-semibold uppercase font-mono text-foreground">Protocol</span>
            <div className="font-mono text-sm text-foreground break-all">{parsed.protocol}</div>
          </AppCard>

          <AppCard border cornerAccents className="p-4 bg-tertiary space-y-1">
            <span className="text-xs font-semibold uppercase font-mono text-foreground">Hostname</span>
            <div className="font-mono text-sm text-foreground break-all">{parsed.hostname}</div>
          </AppCard>

          <AppCard border cornerAccents className="p-4 bg-tertiary space-y-1">
            <span className="text-xs font-semibold uppercase font-mono text-foreground">Port</span>
            <div className="font-mono text-sm text-foreground break-all">{parsed.port || "N/A"}</div>
          </AppCard>

          <AppCard border cornerAccents className="p-4 bg-tertiary space-y-1 lg:col-span-2">
            <span className="text-xs font-semibold uppercase font-mono text-foreground">Pathname</span>
            <div className="font-mono text-sm text-foreground break-all">{parsed.pathname}</div>
          </AppCard>

          <AppCard border cornerAccents className="p-4 bg-tertiary space-y-1">
            <span className="text-xs font-semibold uppercase font-mono text-foreground">Hash / Anchor</span>
            <div className="font-mono text-sm text-foreground break-all">{parsed.hash || "(nenhum)"}</div>
          </AppCard>
        </div>
      )}

      {/* Query Parameters Table */}
      {parsed.isValid && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between pb-3 border-b border-border/70">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-semibold uppercase font-mono text-foreground">
                {isPt ? "Parâmetros de Consulta (Query String)" : "Query Parameters (Search Params)"}
              </h2>
            </div>

            <AppButton
              color="primary"
              small
              onClick={addParam}
              className="gap-1.5 text-sm font-mono"
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
            >
              {isPt ? "Adicionar Parâmetro" : "Add Param"}
            </AppButton>
          </div>

          {params.length > 0 ? (
            <div className="space-y-3">
              {params.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded-[2px] border transition-colors ${
                    item.enabled ? "bg-background border-border" : "bg-tertiary border-border/60 opacity-60"
                  }`}
                >
                  <AppCheckbox
                    checked={item.enabled}
                    onChange={(checked) => updateParam(item.id, "enabled", checked)}
                  />

                  <div className="w-full sm:w-1/3">
                    <AppInput
                      type="text"
                      value={item.key}
                      onChange={(e) => updateParam(item.id, "key", e.target.value)}
                      placeholder="Chave (key)"
                      className="font-mono text-sm"
                    />
                  </div>

                  <span className="text-label font-mono text-sm hidden sm:inline">=</span>

                  <div className="w-full sm:flex-1">
                    <AppInput
                      type="text"
                      value={item.value}
                      onChange={(e) => updateParam(item.id, "value", e.target.value)}
                      placeholder="Valor (value)"
                      className="font-mono text-sm"
                    />
                  </div>

                  <AppButton
                    color="tertiary"
                    small
                    onClick={() => removeParam(item.id)}
                    className="!bg-background text-sm font-mono text-destructive hover:text-destructive !py-2 !px-3"
                    title={isPt ? "Remover parâmetro" : "Remove parameter"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </AppButton>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-label font-mono">
              {isPt ? "Nenhum parâmetro de busca nesta URL." : "No query parameters in this URL."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
