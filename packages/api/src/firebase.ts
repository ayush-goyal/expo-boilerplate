import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";

export const app = getApps()[0] || initializeApp({
  // Initialized via process.env.GOOGLE_APPLICATION_CREDENTIALS
  credential: applicationDefault()
});
