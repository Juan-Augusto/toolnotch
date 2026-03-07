import type { Metadata } from "next";
import JpgToPdfTool from "./JpgToPdfTool";

export const metadata: Metadata = {
  title: "JPG to PDF — Convert Images to PDF Free",
  description:
    "Convert JPEG or PNG images to a PDF document for free. Reorder images by dragging. Runs entirely in your browser — no upload.",
  keywords: ["jpg to pdf", "image to pdf", "convert jpg to pdf online free", "png to pdf"],
};

export default function JpgToPdfPage() {
  return <JpgToPdfTool />;
}
