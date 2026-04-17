import React from "react";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";

export default function Tower({ role }) {
  const [members,setMembers]=useState([]);

  useEffect(()=>{
    onValue(ref(db,"team"),snap=>{
      const data=snap.val()||{};
      setMembers(Object.values(data).filter(
        m=>m.role==="admin"||m.role==="closemod_manager"
      ));
    });
  },[]);

  const isAdmin = role==="admin";

  const updateInfo=(id,val)=>{
    set(ref(db,`team/${id}/info`),val);
  };

  return (
    <div>
      {members.map(m=>{
        const avatar=`https://cdn.discordapp.com/avatars/${m.id}/${m.avatar}.png`;

        return (
          <div key={m.id}>
            <img src={avatar} width={40}/>
            {m.name}

            {isAdmin ? (
              <textarea
                value={m.info||""}
                onChange={e=>updateInfo(m.id,e.target.value)}
              />
            ):<div>{m.info}</div>}
          </div>
        );
      })}
    </div>
  );
}