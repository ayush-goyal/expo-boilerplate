import { getApps, initializeApp } from "firebase-admin/app";

export const app = getApps()[0] || initializeApp({});
