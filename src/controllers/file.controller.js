import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import prisma from "../prismaClient.js";
import { validateFile } from "../utils/validateFile.js";
import { scanFile } from "../utils/virusScan.js";
import { generateStoredName } from "../utils/rename.js";
import { convertToPDF, convertImageToPDF } from "../utils/convert.js";
import { mergePDFs } from "../utils/merge.js";

export const uploadFiles = async (req, res) => {
  const { ownerType, ownerId } = req.body;
  const files = req.files;

  if (!files || files.length === 0)
    return res.status(400).json({ error: "No files uploaded" });

  const baseDir = path.join("uploads", ownerType, ownerId);
  const originalDir = path.join(baseDir, "original");
  const convertedDir = path.join(baseDir, "converted");

  await fs.mkdir(originalDir, { recursive: true });
  await fs.mkdir(convertedDir, { recursive: true });

  const convertedPaths = [];

  for (const file of files) {
    const type = await validateFile(file.path);

    const infected = await scanFile(file.path);
    if (infected) {
      await fs.unlink(file.path);
      return res.status(422).json({ error: "Virus detected" });
    }

    const storedName = generateStoredName({
      ownerType,
      ownerId,
      originalName: file.originalname,
      ext: type.ext
    });

    const finalPath = path.join(originalDir, storedName);
    await fs.rename(file.path, finalPath);

    // checksum
    const buffer = await fs.readFile(finalPath);
    const checksum = crypto.createHash("sha256").update(buffer).digest("hex");

    let pdfPath = path.join(convertedDir, storedName.replace(/\.[^.]+$/, ".pdf"));

    if (type.ext === "pdf") {
      await fs.copyFile(finalPath, pdfPath);
    } else if (["png","jpg","jpeg","webp"].includes(type.ext)) {
      await convertImageToPDF(finalPath, pdfPath);
    } else {
      await convertToPDF(finalPath, convertedDir);
    }

    convertedPaths.push(pdfPath);

    await prisma.file.create({
      data: {
        ownerType,
        ownerId,
        originalName: file.originalname,
        storedName,
        mimeType: type.mime,
        extension: type.ext,
        size: file.size,
        checksum,
        originalPath: finalPath,
        pdfPath,
        status: "READY"
      }
    });
  }

  if (ownerType === "SUBMISSION" && convertedPaths.length > 1) {
    const finalPDF = path.join(baseDir, "final.pdf");
    await mergePDFs(convertedPaths, finalPDF);
  }

  res.json({ success: true });
};
