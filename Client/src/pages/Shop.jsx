import React from "react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, get, set } from "firebase/database";

export default function Shop({ userId }) {
  const [items,setItems]=useState([]);

  useEffect(()=>{
    onValue(ref(db,"shop"),snap=>{
      setItems(Object.values(snap.val()||{}));
    });
  },[]);

  const buy = async (item)=>{
    const userRef = ref(db,`users/${userId}`);
    const snap = await get(userRef);
    const data = snap.val();

    if(data.balance < item.price) return alert("Нет CC");

    await set(userRef,{ balance: data.balance - item.price });

    await fetch("http://localhost:3001/buy",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(item)
    });
  };

  return (
    <div>
      {items.map((i,idx)=>(
        <div key={idx}>
          {i.name} - {i.price}
          <button onClick={()=>buy(i)}>Купить</button>
        </div>
      ))}
    </div>
  );
}