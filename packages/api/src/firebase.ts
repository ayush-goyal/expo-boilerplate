import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";

export const app =
  getApps()[0] ||
  initializeApp({
    credential:
      process.env.NODE_ENV === "development"
        ? applicationDefault()
        : cert({
            projectId: process.env.GOOGLE_CLOUD_PROJECT,
            privateKey: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            clientEmail: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
          }),
  });
