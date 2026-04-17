import React from "react";
import { ui } from "../styles";

export default function Shop() {
  return (
    <div>
      <h1>Магазин</h1>
      <div style={{display:"flex",gap:20}}>
        <Card name="VIP" price="$10"/>
        <Card name="PRO" price="$5"/>
      </div>
    </div>
  );
}

function Card({name,price}) {
  return (
    <div style={ui.card}>
      <h3>{name}</h3>
      <p>{price}</p>
      <button style={ui.button}>Купить</button>
    </div>
  );
}