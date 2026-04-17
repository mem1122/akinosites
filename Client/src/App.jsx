import React, { useEffect, useState } from "react";
import { ui } from "./styles";
import Team from "./pages/Team";
import Shop from "./pages/Shop";
import Tower from "./pages/Tower";

export default function App() {
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("team");
  const [access, setAccess] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) checkAccess(id);
  }, []);

  const checkAccess = async (id) => {
  const res = await fetch(`https://akinosites-production.up.railway.app/check-access/${id}`);
  const data = await res.json();

  if (data.access) {
    setAccess(true);

    const userRes = await fetch(`https://akinosites-production.up.railway.app/user/${id}`);
    const userData = await userRes.json();
    setProfile(userData);
  }
};

  if (!access) {
    return (
      <div style={center}>
        <button
          style={ui.button}
          onClick={() =>
            (window.location.href =
              "https://akinosites-production.up.railway.app/auth/discord")
          }
        >
          Войти через Discord
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...app, background: ui.bg }}>
    {profile && (
  <div style={{
    position: "absolute",
    top: 20,
    right: 20,
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(255,255,255,0.05)",
    padding: "8px 12px",
    borderRadius: "12px",
    backdropFilter: "blur(10px)"
  }}>
    <img
      src={profile.avatar}
      width={40}
      height={40}
      style={{
        borderRadius: "50%",
        border: "2px solid #6366f1"
      }}
    />
    <div>
      <div style={{ fontWeight: "bold" }}>
        {profile.username}
      </div>
      <div style={{ fontSize: 12, opacity: 0.6 }}>
        {profile.role}
      </div>
    </div>
  </div>
)}
      <div style={sidebar}>
        <h2>AKINO</h2>
        <button style={ui.navBtn} onClick={()=>setTab("team")}>👥</button>
        <button style={ui.navBtn} onClick={()=>setTab("shop")}>🛒</button>
        <button style={ui.navBtn} onClick={()=>setTab("tower")}>⚙</button>
      </div>

      <div style={content}>
        {tab==="team" && <Team />}
        {tab==="shop" && <Shop />}
        {tab==="tower" && <Tower />}
      </div>
    </div>
  );
}

const app = { display:"flex", height:"100vh", color:"white" };
const sidebar = { width:220, padding:20, display:"flex", flexDirection:"column", gap:10 };
const content = { flex:1, padding:30 };
const center = {
  height:"100vh",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  background:"#020617"
};