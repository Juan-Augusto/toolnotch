import type { Metadata } from "next";
import CompressTool from "./CompressTool";

export const metadata: Metadata = {
  title: "Compress PDF Online Free — Reduce File Size",
  description:
    "Compress PDF files and reduce their size for free. No quality loss. Your files are processed in your browser — never uploaded.",
  keywords: ["compress pdf", "reduce pdf size", "compress pdf online free", "pdf compressor"],
};

export default function CompressPDFPage() {
  return <CompressTool />;
}
