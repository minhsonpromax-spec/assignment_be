import { fileTypeFromFile } from "file-type";
import fs from "fs/promises";

export async function validateFile(filePath) {
  const type = await fileTypeFromFile(filePath);

  if (!type) throw new Error("Unknown file type");

  const allowed = [
    "pdf", "png", "jpg", "jpeg", "webp",
    "doc", "docx"
  ];

  if (!allowed.includes(type.ext)) {
    await fs.unlink(filePath);
    throw new Error("File type not allowed");
  }

  return type;
}
