import React from "react";
import { ui } from "../styles";

export default function Team() {
  return (
    <div>
      <h1>Команда</h1>
      <div style={{display:"flex",gap:20}}>
        {["Admin","Dev","Designer"].map((u,i)=>(
          <div key={i} style={ui.card}>
            <div style={avatar}></div>
            <h3>{u}</h3>
            <p style={{opacity:0.6}}>Member</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const avatar = {
  width:50,
  height:50,
  borderRadius:"50%",
  background:"linear-gradient(135deg,#6366f1,#a855f7)",
  marginBottom:10
};