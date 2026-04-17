import express from "express";
import admin from "firebase-admin";
import axios from "axios";
import cors from "cors";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
  databaseURL: process.env.FIREBASE_DB
});

const db = admin.database();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const access = {};

// проверка доступа
app.get("/check-access/:id", async (req, res) => {
  const userSnap = await db.ref("users/" + req.params.id).get();
  const configSnap = await db.ref("config").get();

  const user = userSnap.val();
  const config = configSnap.val();

  if (!user) return res.json({ access: false });

  if (config?.closeMode && user.role !== "admin") {
    return res.json({ access: false });
  }

  res.json({ access: user.access });
});

// Discord login
app.get("/auth/discord", (req, res) => {
  const url = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=identify`;
  res.redirect(url);
});

// callback
const user = userRes.data;

await db.ref("users/" + user.id).set({
  access: false,
  role: "user",
  username: user.username,
  avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
});

// отправка в Discord (approve кнопка)
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
});    // 🔥 СОХРАНЯЕМ В FIREBASE
    await db.ref("users/" + user.id).set({
  access: false, // ❗ теперь нужен approve
  role: "user",
  username: user.username,
  avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
});

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

app.listen(PORT, () => console.log("Server running"));