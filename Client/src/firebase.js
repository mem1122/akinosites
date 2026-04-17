import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const app = initializeApp({
  apiKey: "ТВОЙ_API_KEY",
  databaseURL: "ТВОЙ_DB_URL"
});

export const db = getDatabase(app);