import { useEffect, useState } from "react";
import { ui } from "../styles";

export default function Tower() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://YOUR-BACKEND/tower")
      .then(r => r.json())
      .then(setData);
  }, []);

  return (
    <div>
      {data.map(x => (
        <div style={ui.card} key={x.id}>
          <div>{x.role}</div>
          <div>{x.game}</div>
          <div>{x.info}</div>
        </div>
      ))}
    </div>
  );
}