import { useEffect, useState } from 'react';
import { UserRound, LoaderCircle } from 'lucide-react';

export default function DiscordPortrait({ refresh }) {
  const [avatar, setAvatar] = useState(null);
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    let active = true;
    setAvatar(null); setStatus('loading');
    (async () => {
      try {
        const response = await fetch('/api/discord-avatar', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Unavailable');
        const data = await response.json();
        const url = new URL(data.url);
        if (url.protocol !== 'https:' || url.hostname !== 'cdn.discordapp.com') throw new Error('Invalid avatar');
        if (active) setAvatar(url.href);
      } catch { if (active) setStatus('error'); }
      finally { clearTimeout(timer); }
    })();
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [refresh]);
  return <div className="discord-portrait" aria-busy={status === 'loading'}>
    {avatar && <img src={avatar} alt="Photo de profil Discord d’Alex" onLoad={() => setStatus('ready')} onError={() => { setAvatar(null); setStatus('error'); }} />}
    {status !== 'ready' && <div className="discord-avatar-state" role="status">{status === 'loading' ? <LoaderCircle className="spin" size={32}/> : <UserRound size={64}/>}<span>{status === 'loading' ? 'Chargement du profil Discord…' : 'Photo Discord indisponible pour le moment'}</span></div>}
  </div>;
}
