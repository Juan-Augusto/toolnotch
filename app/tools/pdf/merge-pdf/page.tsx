import type { Metadata } from "next";
import MergeTool from "./MergeTool";

export const metadata: Metadata = {
  title: "Merge PDF Files Free — No Upload Required",
  description:
    "Merge multiple PDF files into one for free. Drag to reorder pages. Your files are processed in your browser — never uploaded to any server.",
  keywords: ["merge pdf", "combine pdf", "merge pdf files free no upload", "join pdf online"],
};

export default function MergePDFPage() {
  return <MergeTool />;
}
