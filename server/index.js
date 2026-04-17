import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const access = {};

app.get("/check-access/:id",(req,res)=>{
  res.json({ access: access[req.params.id] || false });
});

// 🔐 Discord login
app.get("/auth/discord", (req, res) => {
  const url = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${process.env.REDIRECT_URI}&scope=identify`;
  res.redirect(url);
});

app.post("/buy",async(req,res)=>{
  const item=req.body;
  await axios.post("WEBHOOK_URL",{
    content:`Покупка: ${item.name}`
  });
  res.json({ok:true});
});

app.listen(3001);
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  try {
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

    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = userRes.data;

    access[user.id] = true;

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