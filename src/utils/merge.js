import { PDFDocument } from "pdf-lib";
import fs from "fs/promises";

export async function mergePDFs(paths, outputPath) {
  const mergedPdf = await PDFDocument.create();

  for (const p of paths) {
    const pdfBytes = await fs.readFile(p);
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }

  const finalBytes = await mergedPdf.save();
  await fs.writeFile(outputPath, finalBytes);
}
