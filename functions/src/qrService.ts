import * as admin from "firebase-admin";
import * as QRCode from "qrcode";

const db = admin.firestore();
const storage = admin.storage().bucket();

/**
 * Generates a QR code image as base64 data URL
 * @param {string} qrData - The data to encode in the QR code
 * @param {string} color - The color of the QR code
 * @param {object} options - Additional QR code options
 * @return {Promise<string>} Base64 data URL of the QR code image
 */
export async function generateQRCodeImage(
  qrData: string,
  color = "#000",
  options: object = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(
      qrData,
      {
        color: {dark: color, light: "#fff"},
        ...options,
      },
      (err: Error | null | undefined, url: string) => {
        if (err) reject(err);
        else resolve(url);
      }
    );
  });
}

/**
 * Saves QR code image to Firebase Storage and returns public URL
 * @param {string} base64 - Base64 encoded image data
 * @param {string} userId - User ID for file organization
 * @param {string} qrId - QR code ID for file naming
 * @return {Promise<string>} Public URL of the saved image
 */
export async function saveQRImage(
  base64: string,
  userId: string,
  qrId: string
): Promise<string> {
  const buffer = Buffer.from(base64.split(",")[1], "base64");
  const file = storage.file(`qr-codes/${userId}/${qrId}.png`);
  await file.save(buffer, {contentType: "image/png"});
  await file.makePublic();
  return file.publicUrl();
}

/**
 * Saves QR code metadata to Firestore
 * @param {string} qrId - QR code ID
 * @param {object} data - Metadata to save
 * @return {Promise<void>} Promise that resolves when data is saved
 */
export async function saveQRCodeMetadata(qrId: string, data: object) {
  await db.collection("qrCodes").doc(qrId).set(data);
}

/**
 * Adds QR code to user's history
 * @param {string} userId - User ID
 * @param {string} qrId - QR code ID
 * @param {string} imageUrl - URL of the QR code image
 * @return {Promise<void>} Promise that resolves when history is updated
 */
export async function addToUserHistory(
  userId: string,
  qrId: string,
  imageUrl: string
) {
  await db.collection("users").doc(userId).collection("history").doc(qrId).set({
    qrId,
    imageUrl,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

export {db, storage};
