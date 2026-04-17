import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

// ❗ ВАЖНО: только так для Railway
const PORT = process.env.PORT;

// тест главной
app.get("/", (req, res) => {
  res.send("Server работает 🚀");
});

// тест discord (пока без env — чтобы убедиться что всё ок)
app.get("/auth/discord", (req, res) => {
  res.redirect("https://discord.com");
});

// запуск (ОДИН раз!)
app.listen(PORT, "0.0.0.0", () => {
  console.log("RUNNING ON", PORT);
});