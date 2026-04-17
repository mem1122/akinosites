import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const app = initializeApp({
  apiKey: "AIzaSyBgmbhOr5G2M9dHjt8fklpy6OeWLSXhMmw",
  databaseURL: "https://console.firebase.google.com/u/0/project/akinostaff/database/akinostaff-default-rtdb/data/~2F"
});

export const db = getDatabase(app);