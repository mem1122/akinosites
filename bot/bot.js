import { Client, GatewayIntentBits } from "discord.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.on("interactionCreate", async (i) => {
  if (!i.isButton()) return;

  if (i.customId.startsWith("approve_")) {
    const id = i.customId.split("_")[1];

    await supabase.from("users").update({ access: true }).eq("id", id);

    await i.reply({ content: "✅ Approved", ephemeral: true });
  }
});

client.login(process.env.TOKEN);