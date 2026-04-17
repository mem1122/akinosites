import {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";

const client = new Client({
  intents:[GatewayIntentBits.Guilds]
});

client.once("ready",()=>console.log("bot ready"));

client.on("interactionCreate", async interaction=>{
  if(!interaction.isButton()) return;

  const [action,id]=interaction.customId.split("_");

  if(action==="approve"){
    await interaction.reply({content:`✅ ${id}`,ephemeral:true});
  }

  if(action==="deny"){
    await interaction.reply({content:`❌ ${id}`,ephemeral:true});
  }
});

client.login("TOKEN");