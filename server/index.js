app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const token = tokenRes.data.access_token;

    const userRes = await axios.get(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const user = userRes.data;

    await db.ref("users/" + user.id).set({
      access: false,
      role: "user",
      username: user.username,
      avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
    });

    await axios.post(process.env.WEBHOOK_URL, {
      content: `Новый пользователь: ${user.username}`,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "Approve",
              style: 3,
              custom_id: `approve_${user.id}`
            }
          ]
        }
      ]
    });

    res.send(`
      <script>
        localStorage.setItem("id", "${user.id}");
        window.location.href = "/";
      </script>
    `);

  } catch (err) {
    console.error(err.response?.data || err);
    res.send("Ошибка авторизации");
  }
});