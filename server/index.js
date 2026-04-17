import express from "express";
import axios from "axios";
import cors from "cors";
import admin from "firebase-admin";

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 ПОРТ (железно работает на Railway)
const PORT = process.env.PORT || 8080;

// 🔥 FIREBASE (с защитой)
let db;
try {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
    databaseURL: process.env.FIREBASE_DB
  });
  db = admin.database();
  console.log("Firebase OK");
} catch (e) {
  console.error("Firebase error:", e);
}

// 🧪 тест
app.get("/", (req, res) => {
  res.send("Server работает 🚀");
});

// 🔐 Discord login
app.get("/auth/discord", (req, res) => {
  try {
    const url = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=identify`;
    res.redirect(url);
  } catch (e) {
    console.error(e);
    res.send("Ошибка discord route");
  }
});

// 🔄 CALLBACK
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  try {
    // 🎟 получаем токен
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const token = tokenRes.data.access_token;

    // 👤 получаем пользователя
    const userRes = await axios.get(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const user = userRes.data;

    // 💾 сохраняем в Firebase
    if (db) {
      await db.ref("users/" + user.id).set({
        access: false,
        role: "user",
        username: user.username,
        avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      });
    }

    // 🤖 отправка approve кнопки
    if (process.env.WEBHOOK_URL) {
      await axios.post(process.env.WEBHOOK_URL, {
        content: `Новый пользователь: ${user.username}`,
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                label: "Approve",
                style: 3,
                custom_id: `approve_${user.id}`
              }
            ]
          }
        ]
      });
    }

    // 🔄 редирект обратно
    res.send(`
      <script>
        localStorage.setItem("id", "${user.id}");
        window.location.href = "/";
      </script>
    `);

  } catch (err) {
    console.error(err.response?.data || err);
    res.send("Ошибка авторизации");
  }
});

// 🔍 проверка доступа
app.get("/check-access/:id", async (req, res) => {
  if (!db) return res.json({ access: false });

  const snap = await db.ref("users/" + req.params.id).get();
  res.json({ access: snap.exists() && snap.val().access });
});

// 👤 профиль
app.get("/user/:id", async (req, res) => {
  if (!db) return res.json(null);

  const snap = await db.ref("users/" + req.params.id).get();
  res.json(snap.val());
});

// 🚀 запуск (ОДИН РАЗ!)
app.listen(PORT, "0.0.0.0", () => {
  console.log("RUNNING ON", PORT);
});