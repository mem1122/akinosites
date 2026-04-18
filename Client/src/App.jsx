import { useEffect, useState } from "react";
import { ui } from "./styles";

export default function App() {
  const [access, setAccess] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (!id) return;

    fetch(`https://YOUR-BACKEND/check-access/${id}`)
      .then(r => r.json())
      .then(d => setAccess(d.access));
  }, []);

  if (!access) {
    return (
      <div style={center}>
        <button
          style={ui.button}
          onClick={() =>
            (window.location.href =
              "https://YOUR-BACKEND/auth/discord")
          }
        >
          Войти через Discord
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...app, background: ui.bg }}>
      <Sidebar />
      <Content />
    </div>
  );
}

const app = { display: "flex", height: "100vh", color: "white" };
const center = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#020617"
};