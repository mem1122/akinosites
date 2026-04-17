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