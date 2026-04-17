import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// тест
app.get("/", (req, res) => {
  res.send("OK");
});

// тест discord route
app.get("/auth/discord", (req, res) => {
  res.redirect("https://discord.com");
});

app.listen(PORT, () => {
  console.log("RUNNING ON", PORT);
});