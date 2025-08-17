import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {
  addToUserHistory,
  db,
  generateQRCodeImage,
  saveQRCodeMetadata,
  saveQRImage,
} from "./qrService";

admin.initializeApp();

// Generate QR Code (standard and social media)
export const generateQRCode = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context || !context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be signed in."
      );
    }
    const {qrData, color = "#000", type = "text", logo, options} = data;
    const userId = context.auth.uid;
    const qrId = db.collection("qrCodes").doc().id;
    try {
      const qrImage = await generateQRCodeImage(qrData, color, options);
      const imageUrl = await saveQRImage(qrImage, userId, qrId);
      await saveQRCodeMetadata(qrId, {
        userId,
        qrId,
        qrData,
        color,
        type,
        logo,
        options,
        imageUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        scanCount: 0,
      });
      await addToUserHistory(userId, qrId, imageUrl);
      return {qrImage, imageUrl, qrId};
    } catch (error) {
      throw new functions.https.HttpsError(
        "internal",
        "QR code generation failed."
      );
    }
  }
);

// Bulk QR Code Generation
export const bulkGenerateQRCode = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context || !context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be signed in."
      );
    }
    const {items, color = "#000", options} = data;
    const userId = context.auth.uid;
    try {
      const results = await Promise.all(
        items.map(async (item: string) => {
          const qrId = db.collection("qrCodes").doc().id;
          const qrImage = await generateQRCodeImage(item, color, options);
          const imageUrl = await saveQRImage(qrImage, userId, qrId);
          await saveQRCodeMetadata(qrId, {
            userId,
            qrId,
            qrData: item,
            color,
            options,
            imageUrl,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            scanCount: 0,
          });
          await addToUserHistory(userId, qrId, imageUrl);
          return {qrImage, imageUrl, qrId};
        })
      );
      return {results};
    } catch (error) {
      throw new functions.https.HttpsError(
        "internal",
        "Bulk QR code generation failed."
      );
    }
  }
);

// Dynamic QR Code (editable destination)
export const createDynamicQRCode = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context || !context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be signed in."
      );
    }
    const {destination, color = "#000", options} = data;
    const userId = context.auth.uid;
    const qrId = db.collection("dynamicQRCodes").doc().id;
    // Save destination to Firestore
    await db.collection("dynamicQRCodes").doc(qrId).set({
      userId,
      qrId,
      destination,
      color,
      options,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      scanCount: 0,
    });
    // Generate QR code pointing to a redirect endpoint
    const redirectUrl = `https://yourdomain.com/redirect/${qrId}`;
    const qrImage = await generateQRCodeImage(redirectUrl, color, options);
    const imageUrl = await saveQRImage(qrImage, userId, qrId);
    await db.collection("dynamicQRCodes").doc(qrId).update({imageUrl});
    return {qrImage, imageUrl, qrId, redirectUrl};
  }
);

// Analytics (track scans)
export const trackQRCodeScan = functions.https.onCall(async (data: any) => {
  const {qrId} = data;
  // Update scan count in Firestore
  const qrRef = db.collection("qrCodes").doc(qrId);
  await qrRef.update({scanCount: admin.firestore.FieldValue.increment(1)});
  return {message: "Scan tracked."};
});

// User History
export const getUserHistory = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context || !context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be signed in."
      );
    }
    const userId = context.auth.uid;
    const historySnap = await db
      .collection("users")
      .doc(userId)
      .collection("history")
      .orderBy("createdAt", "desc")
      .get();
    const history = historySnap.docs.map((doc) => doc.data());
    return {history};
  }
);

// Social Media QR Templates
export const getSocialMediaTemplate = functions.https.onCall(
  async (data: any) => {
    const {platform, username} = data;
    // Return pre-filled link for social media
    const templates: Record<string, string> = {
      instagram: `https://instagram.com/${username}`,
      facebook: `https://facebook.com/${username}`,
      linkedin: `https://linkedin.com/in/${username}`,
      github: `https://github.com/${username}`,
      // Add more as needed
    };
    return {url: templates[platform] || ""};
  }
);

// Event Check-in (stub)
export const eventCheckIn = functions.https.onCall(async (data: any) => {
  const {eventId, userId} = data;
  await db
    .collection("events")
    .doc(eventId)
    .collection("attendees")
    .doc(userId)
    .set({
      checkedIn: true,
      checkedInAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  return {message: "Checked in!"};
});

// Secure QR (stub)
export const secureQRCode = functions.https.onCall(async (data: any) => {
  const {qrData, password} = data;
  // Save password-protected QR code
  const qrId = db.collection("secureQRCodes").doc().id;
  await db.collection("secureQRCodes").doc(qrId).set({qrData, password});
  return {qrId};
});

// Location-based QR (stub)
export const locationBasedQRCode = functions.https.onCall(async (data: any) => {
  const {qrData, location} = data;
  const qrId = db.collection("locationQRCodes").doc().id;
  await db.collection("locationQRCodes").doc(qrId).set({qrData, location});
  return {qrId};
});

// ...existing code...
