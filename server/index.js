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

app.post("/buy",async(req,res)=>{
  const item=req.body;

  await axios.post("WEBHOOK_URL",{
    content:`Покупка: ${item.name}`
  });

  res.json({ok:true});
});

app.listen(3001);