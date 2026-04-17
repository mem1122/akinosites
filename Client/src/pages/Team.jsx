import { useEffect, useState } from "react";
import Shop from "./Shop";
import Team from "./Team"
import Tower from "./Tower";

export default function App() {
  const [tab, setTab] = useState("team");
  const [access, setAccess] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id) {
      setUserId(id);
      checkAccess(id);
    }
  }, []);

  const checkAccess = async (id) => {
    const res = await fetch(`http://localhost:3001/check-access/${id}`);
    const data = await res.json();
    if (data.access) setAccess(true);
  };

  if (!access) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        <button onClick={()=>window.location.href="http://localhost:3001/auth/discord"}>
          Войти через Discord
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={()=>setTab("team")}>Состав</button>
      <button onClick={()=>setTab("shop")}>Shop</button>
      <button onClick={()=>setTab("tower")}>Вышка</button>

      {tab==="team" && <Team />}
      {tab==="shop" && <Shop userId={userId} />}
      {tab==="tower" && <Tower role="admin" />}
    </div>
  );
}