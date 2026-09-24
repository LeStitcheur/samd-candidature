import { useEffect, useRef, useState } from 'react';
import { Cross, LocateFixed, Plus, Minus, MapPin, Navigation, LoaderCircle } from 'lucide-react';

// Projection des tuiles GTA, zoom 5, origine (12, 20).
const PILLBOX = { x: (0.02072 * 308.36 + 117.3) * 32 - 3072, y: (-0.0205 * -595.25 + 172.8) * 32 - 5120 };

export default function PillboxMap() {
  const host = useRef(null), canvas = useRef(null), marker = useRef(null), api = useRef(null);
  const [status, setStatus] = useState('loading');
  const [limits, setLimits] = useState({ min: false, max: false });
  useEffect(() => {
    const element = host.current, surface = canvas.current;
    const context = surface.getContext('2d');
    const picture = new Image();
    let disposed = false, width = 0, height = 0, ratio = 1, scale = 0.5;
    let center = { ...PILLBOX }, ready = false, initialized = false;
    const pointers = new Map();
    let gesture = null;
    if (!context) { setStatus('error'); return; }
    function bounds() {
      // Pas de suragrandissement : un pixel source au maximum par pixel écran.
      const min = Math.max(width / picture.width, height / picture.height);
      return { min, max: Math.max(min, 1 / ratio) };
    }
    function render() {
      if (!ready || disposed || !width || !height) return;
      const { min, max } = bounds();
      scale = Math.min(max, Math.max(min, scale));
      center.x = Math.max(width / (2 * scale), Math.min(picture.width - width / (2 * scale), center.x));
      center.y = Math.max(height / (2 * scale), Math.min(picture.height - height / (2 * scale), center.y));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(picture, width / 2 - center.x * scale, height / 2 - center.y * scale, picture.width * scale, picture.height * scale);
      const x = width / 2 + (PILLBOX.x - center.x) * scale, y = height / 2 + (PILLBOX.y - center.y) * scale;
      marker.current.style.left = `${x}px`; marker.current.style.top = `${y}px`;
      marker.current.style.visibility = x < 0 || x > width || y < 0 || y > height ? 'hidden' : 'visible';
      setLimits(previous => { const next = { min: scale <= min + .001, max: scale >= max - .001 }; return previous.min === next.min && previous.max === next.max ? previous : next; });
    }
    function reset() { if (!ready) return; center = { ...PILLBOX }; scale = bounds().max * .78; render(); }
    function zoom(factor, x = width / 2, y = height / 2) {
      if (!ready) return;
      const before = scale, { min, max } = bounds(); scale = Math.min(max, Math.max(min, scale * factor));
      center.x += (x - width / 2) * (1 / before - 1 / scale);
      center.y += (y - height / 2) * (1 / before - 1 / scale); render();
    }
    function wheel(event) { event.preventDefault(); const r = surface.getBoundingClientRect(); zoom(Math.exp(-event.deltaY * .002), event.clientX - r.left, event.clientY - r.top); }
    function startGesture() {
      const points = [...pointers.values()];
      if (!points.length) { gesture = null; return; }
      gesture = { x: points.reduce((n,p)=>n+p.x,0)/points.length, y: points.reduce((n,p)=>n+p.y,0)/points.length, distance: points.length > 1 ? Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y) : 0 };
    }
    function down(event) { if (event.button !== 0) return; surface.focus({ preventScroll: true }); surface.setPointerCapture(event.pointerId); pointers.set(event.pointerId,{x:event.clientX,y:event.clientY}); startGesture(); }
    function move(event) {
      if (!pointers.has(event.pointerId) || !ready) return;
      const previous = gesture; pointers.set(event.pointerId,{x:event.clientX,y:event.clientY}); startGesture();
      center.x -= (gesture.x-previous.x)/scale; center.y -= (gesture.y-previous.y)/scale;
      if (gesture.distance && previous.distance) { const r=surface.getBoundingClientRect(); zoom(gesture.distance/previous.distance,gesture.x-r.left,gesture.y-r.top); } else render();
    }
    function up(event) { pointers.delete(event.pointerId); startGesture(); }
    function key(event) {
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(event.key)) event.preventDefault(); else return;
      if (event.key === 'Home') return reset();
      if (event.key === '+' || event.key === '=') return zoom(1.25);
      if (event.key === '-') return zoom(.8);
      center.x += ({ArrowLeft:-60,ArrowRight:60}[event.key] || 0)/scale;
      center.y += ({ArrowUp:-60,ArrowDown:60}[event.key] || 0)/scale; render();
    }
    const observer = new ResizeObserver(() => {
      width = element.clientWidth; height = element.clientHeight; ratio = window.devicePixelRatio || 1;
      surface.width = Math.round(width * ratio); surface.height = Math.round(height * ratio);
      if (ready && !initialized) { initialized = true; reset(); } else render();
    });
    observer.observe(element);
    const listeners = { pointerdown:down, pointermove:move, pointerup:up, pointercancel:up, lostpointercapture:up, keydown:key };
    Object.entries(listeners).forEach(([name,fn])=>surface.addEventListener(name,fn));
    surface.addEventListener('wheel',wheel,{passive:false});
    picture.onload = () => { if (disposed) return; ready = true; setStatus('ready'); if (width) { initialized = true; reset(); } };
    picture.onerror = () => { if (!disposed) setStatus('error'); };
    picture.src = '/map/pillbox-satellite.png';
    api.current = { reset, zoom };
    return () => { disposed = true; observer.disconnect(); picture.onload = null; picture.onerror = null; api.current = null; Object.entries(listeners).forEach(([name,fn])=>surface.removeEventListener(name,fn)); surface.removeEventListener('wheel',wheel); };
  }, []);
  const ready = status === 'ready';
  return <div className="pillbox-map satellite-map">
    <div className="map-topbar"><span><span className="map-status-dot"/>PILLBOX HILL</span><span className="map-mode">VUE SATELLITE</span></div>
    <div className="map-viewport" ref={host}>
      <canvas ref={canvas} className="satellite-canvas" tabIndex="0" role="img" aria-label="Carte satellite GTA de Pillbox Hill. Glisser pour déplacer, pincer ou utiliser les boutons pour zoomer. Au clavier : flèches, plus, moins et touche Début pour recentrer."/>
      <div className="map-marker satellite-marker" ref={marker} hidden={!ready}><span className="map-marker-icon"><Cross size={16}/></span><span>Pillbox Hill<strong>SAMD · L’hôpital</strong></span></div>
      {status === 'loading' && <div className="map-state" role="status"><LoaderCircle className="spin" size={27}/>Chargement de la carte…</div>}
      {status === 'error' && <div className="map-state" role="status"><MapPin/><strong>Carte indisponible</strong><p>La capture de Pillbox reste disponible à côté.</p></div>}
      <div className="map-navigation"><button aria-label="Recentrer sur Pillbox Hill" title="Recentrer sur Pillbox Hill" disabled={!ready} onClick={()=>api.current?.reset()}><LocateFixed size={18}/></button><button aria-label="Zoomer sur la carte" title={limits.max ? 'Résolution maximale atteinte' : 'Zoomer'} disabled={!ready || limits.max} onClick={()=>api.current?.zoom(1.25)}><Plus size={19}/></button><button aria-label="Dézoomer sur la carte" title="Dézoomer" disabled={!ready || limits.min} onClick={()=>api.current?.zoom(.8)}><Minus size={19}/></button></div>
      <div className="map-orientation"><Navigation size={17} style={{transform:'rotate(-45deg)'}}/><span>N</span></div>
      <span className="satellite-quality">{limits.max ? 'Netteté maximale' : 'Satellite GTA V'}</span>
    </div>
    <div className="map-caption"><span>Glisser pour déplacer · Pincer ou ± pour zoomer</span><button onClick={()=>api.current?.reset()} disabled={!ready}>Pillbox <LocateFixed size={13}/></button></div>
    <div className="map-source">GTA V / Rockstar Games · <a href="https://github.com/Trusted-Studios/mapStyles" target="_blank" rel="noreferrer">Fond satellite</a></div>
  </div>;
}
