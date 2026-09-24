import { useEffect, useRef, useState } from 'react';
import { Cross, LocateFixed, Plus, Minus, RotateCw, MapPin, Layers3, Navigation, LoaderCircle } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Coordonnées du centre d'accueil Pillbox : QBCore qb-ambulancejob/config.lua.
// GTA (x, y, z) → Three.js (x - centreX, z, centreY - y).
export const PILLBOX = Object.freeze({ x: 308.36, y: -595.25, z: 43.28 });

function makeTerrain(metadata, buffer) {
  const { columns, rows, minX, maxY, step, heightScale } = metadata;
  const data = new DataView(buffer);
  const positions = new Float32Array(columns * rows * 3);
  const uvs = new Float32Array(columns * rows * 2);
  const indices = new Uint32Array((columns - 1) * (rows - 1) * 6);
  let cursor = 0;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const index = row * columns + column;
      const height = data.getUint16(index * 2, true) * heightScale;
      const x = minX + column * step;
      const y = maxY - row * step;
      positions[index * 3] = x - PILLBOX.x;
      positions[index * 3 + 1] = height;
      positions[index * 3 + 2] = PILLBOX.y - y;
      // Projection des tuiles satellites GTA, zoom 5, origine tuile (12, 20).
      uvs[index * 2] = ((0.02072 * x + 117.3) * 32 - 3072) / 1792;
      uvs[index * 2 + 1] = 1 - ((-0.0205 * y + 172.8) * 32 - 5120) / 1536;
      if (row < rows - 1 && column < columns - 1) {
        indices.set([index, index + columns, index + 1, index + 1, index + columns, index + columns + 1], cursor);
        cursor += 6;
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  return geometry;
}

export default function PillboxMap() {
  const host = useRef(null);
  const label = useRef(null);
  const compass = useRef(null);
  const controlsApi = useRef(null);
  const [status, setStatus] = useState('loading');
  const [planView, setPlanView] = useState(false);

  useEffect(() => {
    const element = host.current;
    const controller = new AbortController();
    let disposed = false;
    let renderer, controls, resizeObserver, visibilityObserver;
    let scene, satellite;
    let frame = 0;
    let viewVisible = true;
    const timeout = setTimeout(() => { controller.abort(); if (!disposed) setStatus('error'); }, 20000);

    async function init() {
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
        renderer.setClearColor('#202927');
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.setAttribute('aria-label', 'Carte 3D de Pillbox Hill : faites glisser pour tourner. Utilisez les boutons pour zoomer ou recentrer.');
        renderer.domElement.setAttribute('role', 'img');
        element.appendChild(renderer.domElement);
        renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); if (!disposed) setStatus('error'); });
        const [metadataResponse, dataResponse] = await Promise.all([
          fetch('/map/terrain.json', { signal: controller.signal }),
          fetch('/map/pillbox-heights.bin', { signal: controller.signal }),
        ]);
        if (!metadataResponse.ok || !dataResponse.ok) throw new Error('Carte indisponible');
        const [metadata, buffer] = await Promise.all([metadataResponse.json(), dataResponse.arrayBuffer()]);
        if (disposed) return;
        if (buffer.byteLength !== metadata.columns * metadata.rows * 2) throw new Error('Données de carte incomplètes');
        satellite = await new THREE.TextureLoader().loadAsync('/map/pillbox-satellite.jpg');
        if (disposed) { satellite.dispose(); return; }
        satellite.colorSpace = THREE.SRGBColorSpace;
        satellite.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        clearTimeout(timeout);

        scene = new THREE.Scene();
        scene.fog = new THREE.Fog('#202927', 1200, 2700);
        const camera = new THREE.PerspectiveCamera(43, 1, 1, 5000);
        const baseTarget = new THREE.Vector3(0, 50, 0);
        const basePosition = new THREE.Vector3(360, 470, 450);
        camera.position.copy(basePosition);
        scene.add(new THREE.HemisphereLight('#ffffff', '#68706a', 1.8));
        const sun = new THREE.DirectionalLight('#fff3df', 1.3);
        sun.position.set(-600, 900, 400);
        scene.add(sun);
        const terrain = new THREE.Mesh(makeTerrain(metadata, buffer), new THREE.MeshStandardMaterial({ map: satellite, roughness: 1, metalness: 0, flatShading: true }));
        scene.add(terrain);
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(7000, 7000), new THREE.MeshBasicMaterial({ color: '#202927' }));
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -3;
        scene.add(ground);

        // Le repère se trouve exactement au-dessus des coordonnées d'accueil.
        const row = Math.round((metadata.maxY - PILLBOX.y) / metadata.step);
        const column = Math.round((PILLBOX.x - metadata.minX) / metadata.step);
        const groundHeight = new DataView(buffer).getUint16((row * metadata.columns + column) * 2, true) * metadata.heightScale;
        const markerTop = groundHeight + 85;
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 85, 10), new THREE.MeshBasicMaterial({ color: '#ff9890' }));
        stem.position.set(0, groundHeight + 42.5, 0);
        scene.add(stem);
        const ring = new THREE.Mesh(new THREE.RingGeometry(10, 14, 48), new THREE.MeshBasicMaterial({ color: '#f97c71', side: THREE.DoubleSide, transparent: true, opacity: 0.95, depthTest: false }));
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(0, groundHeight + 2, 0);
        ring.renderOrder = 5;
        scene.add(ring);
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(5, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffc8c0' }));
        beacon.position.set(0, markerTop, 0);
        scene.add(beacon);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.copy(baseTarget);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.minDistance = 150;
        controls.maxDistance = 1600;
        controls.maxPolarAngle = Math.PI / 2.3;
        controls.minPolarAngle = 0.02;
        controls.enablePan = true;
        controls.screenSpacePanning = false;
        controls.rotateSpeed = 0.65;
        controls.zoomSpeed = 0.7;
        controls.update();

        function recenter(topDown = false) {
          controls.target.copy(baseTarget);
          camera.position.copy(topDown ? new THREE.Vector3(0, 830, 1) : basePosition);
          controls.enableRotate = !topDown;
          controls.update();
          render();
        }
        controlsApi.current = {
          reset: () => recenter(false),
          plan: value => recenter(value),
          zoom: direction => {
            const offset = camera.position.clone().sub(controls.target);
            offset.setLength(THREE.MathUtils.clamp(offset.length() * direction, controls.minDistance, controls.maxDistance));
            camera.position.copy(controls.target).add(offset);
            controls.update(); render();
          },
          rotate: () => { const offset = camera.position.clone().sub(controls.target); offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 6); camera.position.copy(controls.target).add(offset); controls.update(); render(); },
        };

        const projected = new THREE.Vector3();
        const markerPoint = new THREE.Vector3(0, markerTop + 7, 0);
        function render() {
          if (disposed) return;
          // Évite qu'un déplacement ne sorte de la zone de données disponible.
          const previousTarget = controls.target.clone();
          controls.target.x = THREE.MathUtils.clamp(controls.target.x, -650, 650);
          controls.target.z = THREE.MathUtils.clamp(controls.target.z, -650, 650);
          controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0, 150);
          camera.position.add(controls.target.clone().sub(previousTarget));
          renderer.render(scene, camera);
          if (compass.current) {
            const origin = controls.target.clone().project(camera);
            const north = controls.target.clone().add(new THREE.Vector3(0, 0, -150)).project(camera);
            const angle = Math.atan2((north.x - origin.x) * element.clientWidth, (north.y - origin.y) * element.clientHeight) * 180 / Math.PI;
            compass.current.style.transform = `rotate(${angle - 45}deg)`;
          }
          projected.copy(markerPoint).project(camera);
          if (label.current) {
            label.current.style.left = `${(projected.x * 0.5 + 0.5) * element.clientWidth}px`;
            label.current.style.top = `${(-projected.y * 0.5 + 0.5) * element.clientHeight}px`;
            label.current.style.visibility = projected.z > 1 || Math.abs(projected.x) > 0.95 || Math.abs(projected.y) > 0.95 ? 'hidden' : 'visible';
          }
        }
        function animate() { if (disposed) return; frame = requestAnimationFrame(animate); if (viewVisible) { controls.update(); } }
        controls.addEventListener('change', render);
        resizeObserver = new ResizeObserver(() => { if (disposed) return; const { clientWidth: width, clientHeight: height } = element; if (!width || !height) return; renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); render(); });
        resizeObserver.observe(element);
        visibilityObserver = new IntersectionObserver(entries => { viewVisible = entries[0].isIntersecting; });
        visibilityObserver.observe(element);
        setStatus('ready');
        render();
        animate();
      } catch (error) {
        if (!disposed) { setStatus('error'); console.warn('Carte 3D indisponible :', error.message); }
      }
    }
    init();
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller.abort();
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      controls?.dispose();
      controlsApi.current = null;
      scene?.traverse(object => { object.geometry?.dispose(); if (Array.isArray(object.material)) object.material.forEach(material => material.dispose()); else object.material?.dispose(); });
      satellite?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  const ready = status === 'ready';
  function reset() { controlsApi.current?.reset(); setPlanView(false); }
  return <div className="pillbox-map">
    <div className="map-topbar"><span><span className="map-status-dot"/>PILLBOX HILL</span><span className="map-mode"><Layers3 size={13}/>{planView ? 'VUE DU DESSUS' : 'RELIEF 3D'}</span></div>
    <div className="map-viewport">
      <div className="map-canvas" ref={host}/>
      <div className="map-marker" ref={label} hidden={!ready}><span className="map-marker-icon"><Cross size={16}/></span><span>Pillbox Hill<strong>SAMD · L’hôpital</strong></span></div>
      {status === 'loading' && <div className="map-state" role="status"><LoaderCircle className="spin" size={27}/><span>Chargement de Pillbox Hill…</span></div>}
      {status === 'error' && <div className="map-state map-error" role="status"><MapPin size={27}/><strong>Pillbox Hill Medical Center</strong><p>La vue 3D nécessite un navigateur avec WebGL actif. La capture de l’hôpital reste disponible à côté.</p><span>X 308.36 · Y −595.25 · Z 43.28</span></div>}
      <div className="map-navigation"><button title="Recentrer sur Pillbox Hill" aria-label="Recentrer sur Pillbox Hill" onClick={reset} disabled={!ready}><LocateFixed size={18}/></button><button title="Zoomer" aria-label="Zoomer sur la carte" onClick={()=>controlsApi.current?.zoom(0.78)} disabled={!ready}><Plus size={19}/></button><button title="Dézoomer" aria-label="Dézoomer sur la carte" onClick={()=>controlsApi.current?.zoom(1.28)} disabled={!ready}><Minus size={19}/></button><button title="Tourner la carte" aria-label="Tourner la carte" onClick={()=>controlsApi.current?.rotate()} disabled={!ready || planView}><RotateCw size={17}/></button></div>
      <div className="map-orientation" aria-label="Direction du nord"><Navigation ref={compass} size={17}/><span>N</span></div>
      <button className="map-view-switch" aria-pressed={planView} disabled={!ready} onClick={()=>{setPlanView(!planView);controlsApi.current?.plan(!planView);}}>{planView ? 'Vue en perspective' : 'Vue du dessus'}</button>
    </div>
    <div className="map-caption"><span>Glisser pour tourner · Molette pour zoomer</span><button onClick={reset} disabled={!ready}>Pillbox <LocateFixed size={13}/></button></div>
    <div className="map-source">Satellite GTA V · Relief simplifié · <a href="https://github.com/Andreas1331/ragemp-gtav-heightmap" target="_blank" rel="noreferrer">Andreas1331</a> · <a href="https://github.com/Trusted-Studios/mapStyles" target="_blank" rel="noreferrer">Textures</a></div>
  </div>;
}
