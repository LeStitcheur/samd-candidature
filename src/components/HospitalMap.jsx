import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createOceanHospital } from './OceanHospitalModel.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Cross, LocateFixed, Plus, Minus, LoaderCircle } from 'lucide-react';

const WIDTH = 160, DEPTH = WIDTH * 675 / 1038;
// Fond géographique plan : aucune déformation des rues de la capture Realmap.
function elevation() { return 0; }
function position(u, v) { return new THREE.Vector3((u - .5) * WIDTH, elevation(u, v), (v - .5) * DEPTH); }
const HOSPITAL = position(530 / 1038, 310 / 675);

export default function HospitalMap() {
  const host = useRef(null), canvas = useRef(null), marker = useRef(null), compass = useRef(null), api = useRef(null);
  const [status, setStatus] = useState('loading');
  const [topView, setTopView] = useState(true);
  useEffect(() => {
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas.current, antialias: true, alpha: true }); }
    catch { setStatus('error'); return; }
    let disposed = false, ready = false;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 1000);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const controls = new OrbitControls(camera, canvas.current);
    controls.enablePan = true;
    controls.screenSpacePanning = false;
    let planView = true;
    controls.minDistance = 42; controls.maxDistance = 200;
    controls.minPolarAngle = .025; controls.maxPolarAngle = Math.PI * .44;
    controls.target.copy(HOSPITAL);
    controls.rotateSpeed = .65;
    const geometry = new THREE.PlaneGeometry(WIDTH, DEPTH, 128, 84);
    geometry.rotateX(-Math.PI / 2);
    const vertices = geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      vertices.setY(i, elevation(vertices.getX(i) / WIDTH + .5, vertices.getZ(i) / DEPTH + .5));
    }
    geometry.computeVertexNormals();
    const material = new THREE.MeshBasicMaterial();
    scene.add(new THREE.Mesh(geometry, material));
    const hospital = createOceanHospital();
    hospital.group.position.copy(HOSPITAL);
    hospital.group.rotation.y = -.35;
    scene.add(hospital.group);
    hospital.group.visible = false;
    scene.add(new THREE.HemisphereLight(0xffffff, 0x657078, 2.5));
    const sunlight = new THREE.DirectionalLight(0xffe5e0, 2.6);
    sunlight.position.set(-40, 90, 55); scene.add(sunlight);
    const anchor = HOSPITAL.clone().add(new THREE.Vector3(0, 26, 0));
    const projected = new THREE.Vector3();
    function render() {
      if (disposed || !ready) return;
      if (planView) {
        const tangent = Math.tan(THREE.MathUtils.degToRad(20));
        const maxHeight = Math.min(DEPTH, WIDTH / camera.aspect) * .98 / (2 * tangent);
        camera.position.y = Math.min(camera.position.y, maxHeight);
        const halfH = camera.position.y * tangent, halfW = halfH * camera.aspect;
        const x = THREE.MathUtils.clamp(controls.target.x, -WIDTH/2+halfW, WIDTH/2-halfW);
        const z = THREE.MathUtils.clamp(controls.target.z, -DEPTH/2+halfH, DEPTH/2-halfH);
        camera.position.x += x - controls.target.x; camera.position.z += z - controls.target.z;
        controls.target.x = x; controls.target.z = z;
      }
      renderer.render(scene, camera);
      projected.copy(planView ? HOSPITAL : anchor).project(camera);
      marker.current.style.left = `${(projected.x + 1) * host.current.clientWidth / 2}px`;
      marker.current.style.top = `${(1 - projected.y) * host.current.clientHeight / 2}px`;
      marker.current.style.visibility = Math.abs(projected.x) <= 1 && Math.abs(projected.y) <= 1 && Math.abs(projected.z) <= 1 ? 'visible' : 'hidden';
      compass.current.style.transform = `rotate(${controls.getAzimuthalAngle()}rad)`;
    }
    function reset(top = true) {
      planView = top;
      setTopView(top);
      hospital.group.visible = !top;
      controls.enableRotate = !top;
      controls.mouseButtons.LEFT = top ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE;
      controls.touches.ONE = top ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE;
      controls.target.copy(HOSPITAL);
      if (top) {
        const aspect = host.current.clientWidth / host.current.clientHeight;
        const distance = Math.min(DEPTH * .94, WIDTH / aspect * .94) / (2 * Math.tan(THREE.MathUtils.degToRad(20)));
        camera.position.copy(HOSPITAL).add(new THREE.Vector3(0, distance, .01));
      } else {
        controls.target.y = 10;
        const distance = host.current.clientWidth < 500 ? 78 : 70;
        camera.position.copy(controls.target).add(new THREE.Vector3(distance * .45, distance * .4, distance * .78));
      }
      controls.update(); render();
    }
    function focusHospital() { reset(false); }
    function zoom(factor) {
      const offset = camera.position.clone().sub(controls.target);
      offset.setLength(THREE.MathUtils.clamp(offset.length() / factor, controls.minDistance, controls.maxDistance));
      camera.position.copy(controls.target).add(offset); controls.update(); render();
    }
    function key(event) {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') { reset(); return; }
      if (['+','=','-'].includes(event.key)) { zoom(event.key === '-' ? .8 : 1.25); return; }
      if (planView) {
        const x = ({ArrowLeft:-4,ArrowRight:4}[event.key] || 0), z = ({ArrowUp:-4,ArrowDown:4}[event.key] || 0);
        camera.position.x += x; controls.target.x += x; camera.position.z += z; controls.target.z += z;
        controls.update(); render(); return;
      }
      const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
      spherical.theta += ({ArrowLeft:.12, ArrowRight:-.12}[event.key] || 0);
      spherical.phi = THREE.MathUtils.clamp(spherical.phi + ({ArrowUp:-.1, ArrowDown:.1}[event.key] || 0), controls.minPolarAngle, controls.maxPolarAngle);
      camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical)); controls.update(); render();
    }
    const observer = new ResizeObserver(() => {
      const {clientWidth:w, clientHeight:h} = host.current;
      if (!w || !h) return;
      renderer.setSize(w,h,false); camera.aspect = w/h; camera.updateProjectionMatrix(); render();
    });
    observer.observe(host.current);
    controls.addEventListener('change', render);
    canvas.current.addEventListener('keydown', key);
    const surface = canvas.current;
    function lost(event) { event.preventDefault(); setStatus('error'); }
    surface.addEventListener('webglcontextlost', lost);
    const texture = new THREE.TextureLoader().load('/map/ocean-satellite.png', loaded => {
      if (disposed) { loaded.dispose(); return; }
      loaded.colorSpace = THREE.SRGBColorSpace;
      loaded.anisotropy = renderer.capabilities.getMaxAnisotropy();
      material.map = loaded; material.needsUpdate = true;
      ready = true; setStatus('ready'); reset();
    }, undefined, () => { if (!disposed) setStatus('error'); });
    api.current = {reset, zoom, focusHospital};
    return () => {
      disposed = true; observer.disconnect(); controls.dispose(); api.current = null;
      surface.removeEventListener('keydown', key); surface.removeEventListener('webglcontextlost', lost);
      hospital.dispose(); geometry.dispose(); material.dispose(); texture.dispose(); renderer.dispose();
    };
  }, []);
  const ready = status === 'ready';
  return <div className="pillbox-map satellite-map realmap-view">
    <div className="map-topbar"><span><span className="map-status-dot"/>OCEAN MEDICAL CENTER</span><span className="map-mode">{topView ? 'SATELLITE' : 'BÂTIMENT 3D'}</span></div>
    <div className="map-viewport" ref={host}>
      <canvas ref={canvas} className="satellite-canvas" tabIndex="0" role="img" aria-label="Carte interactive de l’Ocean Medical Center. Glisser pour déplacer la carte ou tourner en mode 3D. Flèches, plus, moins, Début pour recentrer."/>
      <div className="map-marker satellite-marker" ref={marker} hidden={!ready}><span className="map-marker-icon"><Cross size={16}/></span><span>Ocean Medical Center<strong>SAMD · L’hôpital</strong></span></div>
      {status === 'loading' && <div className="map-state" role="status"><LoaderCircle className="spin"/>Chargement du modèle 3D…</div>}
      {status === 'error' && <div className="map-state" role="status"><p>La vue 3D n’est pas disponible sur ce navigateur.</p><a href="/map/ocean-satellite.png" target="_blank" rel="noreferrer">Ouvrir la carte satellite</a></div>}
      <div className="map-navigation">
        <button aria-label="Recentrer sur Ocean Medical Center" disabled={!ready} onClick={()=>{api.current?.reset();}}><LocateFixed size={18}/></button>
        <button aria-label="Zoomer sur la carte" disabled={!ready} onClick={()=>api.current?.zoom(1.25)}><Plus size={19}/></button>
        <button aria-label="Dézoomer sur la carte" disabled={!ready} onClick={()=>api.current?.zoom(.8)}><Minus size={19}/></button>
      </div>
      <div className="map-orientation"><span ref={compass}>↑</span><span>N</span></div>
      <button className="map-view-switch" disabled={!ready} aria-pressed={topView} onClick={()=>{setTopView(!topView); api.current?.reset(!topView);}}> {topView ? 'Explorer le bâtiment 3D' : 'Revenir à la carte'} </button>
    </div>
    <div className="map-caption"><span>{topView ? 'Glisser pour déplacer · Molette ou ± pour zoomer' : 'Glisser pour tourner · Clic droit pour déplacer'}</span><button disabled={!ready} onClick={()=>api.current?.focusHospital()}>Voir le bâtiment <LocateFixed size={13}/></button></div>
    <div className="map-source">GTA V / Rockstar Games · Capture satellite fournie · <a href="https://forge.plebmasters.de/map?x=-2817.0567056705668&y=-1892.2142214221417&z=1&b=Realmap&o=" target="_blank" rel="noreferrer">Référence : Pleb Masters · Realmap ↗</a></div>
  </div>;
}
