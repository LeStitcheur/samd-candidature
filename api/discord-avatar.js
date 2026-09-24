export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  const send = (status, body) => { res.statusCode = status; res.end(JSON.stringify(body)); };
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return send(405, { error: 'Méthode non autorisée.' }); }
  const id = process.env.DISCORD_USER_ID;
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!/^\d{17,20}$/.test(id || '') || !token) return send(503, { error: 'Avatar Discord non configuré.' });
  try {
    const response = await fetch(`https://discord.com/api/v10/users/${id}`, {
      headers: { Authorization: `Bot ${token}` }, signal: AbortSignal.timeout(7000),
    });
    if (!response.ok) return send(response.status === 429 ? 429 : 502, { error: 'Avatar Discord temporairement indisponible.' });
    const user = await response.json();
    if (user.id !== id || (user.avatar && !/^(a_)?[a-f0-9]+$/.test(user.avatar))) throw new Error('Invalid user');
    const index = user.discriminator && user.discriminator !== '0' ? Number(user.discriminator) % 5 : Number((BigInt(id) >> 22n) % 6n);
    const url = user.avatar
      ? `https://cdn.discordapp.com/avatars/${id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=512`
      : `https://cdn.discordapp.com/embed/avatars/${index}.png`;
    return send(200, { url });
  } catch { return send(502, { error: 'Avatar Discord temporairement indisponible.' }); }
}
