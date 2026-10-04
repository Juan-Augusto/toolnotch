"use client";

import { useState, useMemo } from "react";
import {
  AppCard,
  AppButton,
  AppTextarea,
  AppCheckbox,
  AppSegmentedControl,
  AppDropfile,
} from "@/components/ui";
import {
  encodeBase64,
  decodeBase64,
  hexToBase64,
  base64ToHex,
  calculateBase64Stats,
} from "@/lib/dev/base64";
import { Copy, Check, Upload, Sparkles } from "lucide-react";

interface Props {
  locale?: string;
}

const INITIAL_TEXT = "ToolNotch - Ferramentas para Desenvolvedores 🚀";

export default function AppBase64Converter({ locale = "pt" }: Props) {
  const [mode, setMode] = useState<"encode" | "decode" | "hex" | "file">("encode");
  const [inputText, setInputText] = useState(INITIAL_TEXT);
  const [urlSafe, setUrlSafe] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fileDataUrl, setFileDataUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileType, setFileType] = useState<string>("");

  const isPt = locale === "pt";

  const { outputText, error } = useMemo(() => {
    if (!inputText) return { outputText: "", error: null };
    try {
      if (mode === "encode") {
        return { outputText: encodeBase64(inputText, urlSafe), error: null };
      } else if (mode === "decode") {
        return { outputText: decodeBase64(inputText), error: null };
      } else if (mode === "hex") {
        if (/^[0-9a-fA-F\s]+$/.test(inputText.trim()) && inputText.trim().length % 2 === 0) {
          return { outputText: hexToBase64(inputText), error: null };
        } else {
          return { outputText: base64ToHex(inputText), error: null };
        }
      }
      return { outputText: "", error: null };
    } catch (err) {
      return { outputText: "", error: (err as Error).message };
    }
  }, [inputText, mode, urlSafe]);

  const stats = useMemo(() => {
    return calculateBase64Stats(inputText, outputText);
  }, [inputText, outputText]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleFileUpload = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFileDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Mode and Converter Card */}
      <AppCard border cornerAccents className="p-5 sm:p-7 bg-tertiary space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
          <AppSegmentedControl
            name="base64-mode"
            size="sm"
            fontWeight="normal"
            value={mode}
            onChange={(val) => {
              const newMode = val as "encode" | "decode" | "hex" | "file";
              setMode(newMode);
              if (newMode === "decode" && mode === "encode" && outputText) {
                setInputText(outputText);
              } else if (newMode === "encode" && mode === "decode" && outputText) {
                setInputText(outputText);
              }
            }}
            options={[
              { value: "encode", label: isPt ? "Texto ➔ Base64" : "Text ➔ Base64" },
              { value: "decode", label: isPt ? "Base64 ➔ Texto" : "Base64 ➔ Text" },
              { value: "hex", label: isPt ? "Hex ⇄ Base64" : "Hex ⇄ Base64" },
              { value: "file", label: isPt ? "Arquivo / Imagem" : "File / Image" },
            ]}
          />

          {mode === "encode" && (
            <label className="flex items-center gap-2 cursor-pointer text-sm font-mono text-foreground bg-background px-3.5 py-2 rounded-[2px] border border-border">
              <AppCheckbox
                checked={urlSafe}
                onChange={(checked) => setUrlSafe(checked)}
              />
              <span>{isPt ? "Modo URL-Safe (-_)" : "URL-Safe Mode (-_)"}</span>
            </label>
          )}
        </div>

        {mode !== "file" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Input Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-mono text-label">
                <span className="font-medium text-foreground">
                  {mode === "encode"
                    ? isPt
                      ? "Texto de Entrada (UTF-8)"
                      : "Input Text (UTF-8)"
                    : mode === "decode"
                      ? isPt
                        ? "String Base64 de Entrada"
                        : "Input Base64 String"
                      : isPt
                        ? "Entrada (Hex ou Base64)"
                        : "Input (Hex or Base64)"}
                </span>
                <span className="text-xs text-muted font-normal">{inputText.length} chars</span>
              </div>
              <AppTextarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  mode === "encode"
                    ? isPt
                      ? "Digite ou cole seu texto aqui..."
                      : "Type or paste your text here..."
                    : "VGVzdGU..."
                }
                rows={7}
                variant="background"
                className="w-full font-mono text-sm sm:text-base"
              />
            </div>

            {/* Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm font-mono text-label">
                <span className="font-medium text-foreground">
                  {mode === "encode"
                    ? isPt
                      ? "Resultado Base64"
                      : "Base64 Result"
                    : mode === "decode"
                      ? isPt
                        ? "Texto Decodificado"
                        : "Decoded Text"
                      : isPt
                        ? "Resultado Convertido"
                        : "Converted Result"}
                </span>
                <span className="text-xs text-muted font-normal">{outputText.length} chars</span>
              </div>
              <AppTextarea
                readOnly
                value={error || outputText}
                rows={7}
                variant="background"
                className={`w-full font-mono text-sm sm:text-base ${
                  error ? "border-destructive text-destructive bg-destructive/5" : ""
                }`}
              />
            </div>
          </div>
        ) : (
          /* File / Image to Base64 */
          <div className="space-y-4">
            <AppDropfile
              onFilesChange={handleFileUpload}
              maxFiles={1}
              label={isPt ? "Arraste e solte uma imagem ou arquivo aqui" : "Drag and drop an image or file here"}
              helperText={
                isPt
                  ? "Suporta imagens (PNG, JPG, SVG, WebP) e arquivos gerais até 10MB - 100% no navegador"
                  : "Supports images (PNG, JPG, SVG, WebP) and files up to 10MB - 100% in-browser"
              }
            />

            {fileDataUrl && (
              <div className="p-5 bg-background border border-border rounded-[2px] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm font-mono">
                  <div>
                    <span className="font-bold text-foreground">{fileName}</span> ({(fileSize / 1024).toFixed(1)} KB, {fileType || "application/octet-stream"})
                  </div>
                  <AppButton
                    color="tertiary"
                    small
                    className="!bg-background text-sm font-mono !py-2 !px-3.5"
                    icon={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    iconPosition="left"
                    onClick={() => copyToClipboard(fileDataUrl)}
                  >
                    {copied ? (isPt ? "Copiado!" : "Copied!") : (isPt ? "Copiar Data URI" : "Copy Data URI")}
                  </AppButton>
                </div>

                {fileType.startsWith("image/") && (
                  <div className="p-3 bg-tertiary rounded-[2px] border border-border flex items-center justify-center max-h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={fileDataUrl} alt="Preview" className="max-h-40 object-contain rounded-[2px]" />
                  </div>
                )}

                <AppTextarea
                  readOnly
                  value={fileDataUrl}
                  rows={4}
                  variant="background"
                  className="w-full font-mono text-sm break-all"
                />
              </div>
            )}
          </div>
        )}

        {/* Action Buttons & Statistics */}
        {mode !== "file" && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70">
            <div className="flex items-center gap-3 text-sm font-mono text-label self-start sm:self-center">
              <span>
                {isPt ? "Entrada:" : "Input:"} <strong className="text-foreground">{stats.inputBytes} B</strong>
              </span>
              <span>•</span>
              <span>
                {isPt ? "Saída:" : "Output:"} <strong className="text-foreground">{stats.outputBytes} B</strong>
              </span>
              <span>•</span>
              <span>
                {isPt ? "Variação:" : "Ratio:"} <strong className="text-foreground">{stats.ratio}%</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <AppButton
                color="tertiary"
                small
                disabled={!outputText}
                className="!bg-background text-sm font-mono !py-2 !px-3.5"
                icon={copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                iconPosition="left"
                onClick={() => copyToClipboard(outputText)}
              >
                {copied ? (isPt ? "Copiado!" : "Copied!") : (isPt ? "Copiar Resultado" : "Copy Result")}
              </AppButton>
            </div>
          </div>
        )}
      </AppCard>
    </div>
  );
}
