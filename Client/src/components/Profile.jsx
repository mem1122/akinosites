import { useEffect, useState } from "react";
import { ui } from "../styles";

export default function Profile() {
  const [u, setU] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("id");
    fetch(`https://YOUR-BACKEND/user/${id}`)
      .then(r => r.json())
      .then(setU);
  }, []);

  if (!u) return null;

  return (
    <div style={ui.card}>
      <img src={u.avatar} width={50} />
      <div>{u.username}</div>
    </div>
  );
}