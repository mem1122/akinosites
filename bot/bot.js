import { Client, GatewayIntentBits } from "discord.js";
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_KEY)),
  databaseURL: process.env.FIREBASE_DB
});

const db = admin.database();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId.startsWith("approve_")) {
    const userId = interaction.customId.split("_")[1];

    await db.ref("users/" + userId).update({
      access: true
    });

    await interaction.reply({
      content: "✅ Пользователь одобрен",
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);