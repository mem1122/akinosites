import express from "express";
import axios from "axios";
import cors from "cors";
import supabase from "./supabase.js";

console.log("SERVER FILE STARTED");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// ✅ ОБЯЗАТЕЛЬНО (для Railway)
app.get("/", (req, res) => {
  res.send("OK");
});

// 🔐 login
app.get("/auth/discord", (req, res) => {
  const url = `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=identify`;
  res.redirect(url);
});

// 🔄 callback
app.get("/auth/callback", async (req, res) => {
  try {
    const code = req.query.code;

    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const token = tokenRes.data.access_token;

    const userRes = await axios.get(
      "https://discord.com/api/users/@me",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const user = userRes.data;

    await supabase.from("users").upsert({
      id: user.id,
      username: user.username,
      avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
      role: "user",
      access: false
    });

    res.send(`
      <script>
        localStorage.setItem("id", "${user.id}");
        window.location.href = "https://akinosites-steel.vercel.app/";
      </script>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send("OAuth error");
  }
});

// 🔍 access
app.get("/check-access/:id", async (req, res) => {
  const { data } = await supabase
    .from("users")
    .select("access")
    .eq("id", req.params.id)
    .single();

  res.json({ access: data?.access });
});

// 👤 user
app.get("/user/:id", async (req, res) => {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("id", req.params.id)
    .single();

  res.json(data);
});

// 🏗 tower
app.get("/tower", async (req, res) => {
  const { data } = await supabase.from("tower").select("*");
  res.json(data);
});

app.post("/tower/:id", async (req, res) => {
  const { role, game, info } = req.body;

  await supabase
    .from("tower")
    .update({ role, game, info })
    .eq("id", req.params.id);

  res.send("ok");
});

console.log("BEFORE LISTEN");

app.listen(PORT, "0.0.0.0", () => {
  console.log("RUNNING ON", PORT);
});