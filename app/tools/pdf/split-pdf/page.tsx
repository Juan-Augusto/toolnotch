import type { Metadata } from "next";
import SplitTool from "./SplitTool";

export const metadata: Metadata = {
  title: "Split PDF Online Free — Extract Pages",
  description:
    "Split a PDF into multiple files or extract specific pages for free. No upload — runs entirely in your browser.",
  keywords: ["split pdf", "split pdf online free", "extract pages from pdf", "pdf page extractor"],
};

export default function SplitPDFPage() {
  return <SplitTool />;
}
