import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import discordAvatar from './api/discord-avatar.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'DISCORD_');
  for (const [key, value] of Object.entries(env)) process.env[key] ??= value;
  const middleware = server => server.middlewares.use('/api/discord-avatar', discordAvatar);
  return {
    plugins: [react(), { name: 'discord-avatar-api', configureServer: middleware, configurePreviewServer: middleware }],
  };
});
