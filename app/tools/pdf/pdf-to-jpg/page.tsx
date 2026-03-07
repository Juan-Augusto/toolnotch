import type { Metadata } from "next";
import PdfToJpgTool from "./PdfToJpgTool";

export const metadata: Metadata = {
  title: "PDF to JPG — Convert PDF Pages to Images Free",
  description:
    "Convert each page of a PDF to a high-quality JPEG image for free. No upload required — runs in your browser.",
  keywords: ["pdf to jpg", "pdf to image", "convert pdf to jpeg", "pdf to jpg online free"],
};

export default function PdfToJpgPage() {
  return <PdfToJpgTool />;
}
