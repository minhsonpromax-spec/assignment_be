import { v4 as uuidv4 } from "uuid";
import sanitize from "sanitize-filename";

export function generateStoredName({ ownerType, ownerId, originalName, ext }) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "");
  const shortId = uuidv4().split("-")[0];
  const safeName = sanitize(originalName).replace(/\s+/g, "_");

  return `${ownerType}_${ownerId}_${timestamp}_${shortId}.${ext}`;
}
