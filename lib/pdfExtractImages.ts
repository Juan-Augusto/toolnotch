export interface ExtractedPdfImage {
  id: string;
  name: string;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
  size: number;
  page: number;
  format: "jpeg" | "png";
}

export async function extractImagesFromPdf(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<ExtractedPdfImage[]> {
  const { getDocument, GlobalWorkerOptions, OPS } = await import("pdfjs-dist");
  GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const bytes = await file.arrayBuffer();
  let pdf: Awaited<ReturnType<typeof getDocument>["promise"]>;
  try {
    pdf = await getDocument({ data: bytes }).promise;
  } catch {
    throw new Error("Could not load PDF. It may be password-protected or corrupted.");
  }

  const results: ExtractedPdfImage[] = [];
  const baseName = file.name.replace(/\.pdf$/i, "");
  const total = pdf.numPages;

  for (let pageNum = 1; pageNum <= total; pageNum++) {
    onProgress?.(pageNum, total);
    const page = await pdf.getPage(pageNum);
    const ops = await page.getOperatorList();
    const imageNames: string[] = [];

    for (let i = 0; i < ops.fnArray.length; i++) {
      const fn = ops.fnArray[i];
      if (fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject) {
        const name = ops.argsArray[i][0];
        if (typeof name === "string" && !imageNames.includes(name)) {
          imageNames.push(name);
        }
      }
    }

    let imgIndexOnPage = 1;
    for (const name of imageNames) {
      const imgObj = await new Promise<any>((resolve) => {
        page.objs.get(name, (obj: any) => {
          resolve(obj);
        });
      });

      if (!imgObj) continue;

      const width = imgObj.width || 0;
      const height = imgObj.height || 0;
      if (width <= 0 || height <= 0) continue;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      if (imgObj.bitmap) {
        ctx.drawImage(imgObj.bitmap, 0, 0);
      } else if (imgObj.data) {
        const pixelCount = width * height;
        const rgba = new Uint8ClampedArray(pixelCount * 4);
        if (imgObj.data.length === pixelCount * 4) {
          rgba.set(imgObj.data);
        } else if (imgObj.data.length === pixelCount * 3) {
          for (let s = 0, d = 0; s < imgObj.data.length; s += 3, d += 4) {
            rgba[d] = imgObj.data[s];
            rgba[d + 1] = imgObj.data[s + 1];
            rgba[d + 2] = imgObj.data[s + 2];
            rgba[d + 3] = 255;
          }
        } else if (imgObj.data.length === pixelCount) {
          for (let s = 0, d = 0; s < imgObj.data.length; s++, d += 4) {
            rgba[d] = imgObj.data[s];
            rgba[d + 1] = imgObj.data[s];
            rgba[d + 2] = imgObj.data[s];
            rgba[d + 3] = 255;
          }
        } else {
          continue;
        }
        const imgData = new ImageData(rgba, width, height);
        ctx.putImageData(imgData, 0, 0);
      } else {
        continue;
      }

      const format: "jpeg" | "png" = "png";
      const dataUrl = canvas.toDataURL("image/png");
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b || new Blob()), "image/png");
      });

      results.push({
        id: `${pageNum}_${imgIndexOnPage}`,
        name: `${baseName}_p${pageNum}_img${imgIndexOnPage}.png`,
        dataUrl,
        blob,
        width,
        height,
        size: blob.size,
        page: pageNum,
        format,
      });

      imgIndexOnPage++;
    }
  }

  return results;
}
