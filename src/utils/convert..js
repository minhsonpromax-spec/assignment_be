import { exec } from "child_process";
import path from "path";

export function convertToPDF(inputPath, outputDir) {
  return new Promise((resolve, reject) => {
    exec(
      `libreoffice --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function convertImageToPDF(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    exec(`convert "${inputPath}" "${outputPath}"`, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
