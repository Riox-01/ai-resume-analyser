import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs";

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 });

    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvas context not found");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png")
    );

    if (!blob) {
      throw new Error("Failed to create image blob");
    }

    const imageFile = new File(
      [blob],
      file.name.replace(/\.pdf$/i, ".png"),
      {
        type: "image/png",
      }
    );

    const imageUrl = URL.createObjectURL(blob);

    return {
      imageUrl,
      file: imageFile,
    };
  } catch (err) {
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err}`,
    };
  }
}