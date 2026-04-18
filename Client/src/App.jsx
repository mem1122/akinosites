import { useEffect, useState } from "react";
import { ui } from "./styles";

export default function App() {
  const [access, setAccess] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (!id) {
      setAccess(false);
      return;
    }

    fetch(`https://akinosites-production.up.railway.app/check-access/${id}`)
      .then(r => r.json())
      .then(d => setAccess(d.access))
      .catch(() => setAccess(false));
  }, []);

  // ⏳ загрузка
  if (access === null) {
    return <div style={center}>Loading...</div>;
  }

  // 🔐 нет доступа
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

  // ✅ есть доступ
  return (
    <div style={{ ...app, background: ui.bg }}>
      <Sidebar />
      <Content />
    </div>
  );
}

const app = {
  display: "flex",
  height: "100vh",
  color: "white"
};

const center = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#020617",
  color: "white"
};