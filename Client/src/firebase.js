import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const app = initializeApp({
  apiKey: "AIzaSyBgmbhOr5G2M9dHjt8fklpy6OeWLSXhMmw",
  databaseURL: "https://akinostaff-default-rtdb.firebaseio.com"
});

export const db = getDatabase(app);