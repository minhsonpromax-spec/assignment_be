import { exec } from "child_process";

export function scanFile(filePath) {
  return new Promise((resolve, reject) => {
    exec(`clamscan ${filePath}`, (error, stdout) => {
      if (stdout.includes("Infected files: 1")) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
