import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Maquette interprétée d’après les deux vues fournies, pas un export du mapping GTA.
export function createOceanHospital() {
  const group = new THREE.Group();
  const palette = { concrete: '#bbbcb5', blue: '#21618a', glass: '#263c48', frame: '#798b94', dark: '#343c40', roof: '#d4d3c5', white: '#eeeeea' };
  const batches = Object.fromEntries(Object.keys(palette).map(key => [key, []]));
  function box(x,y,z,w,h,d,color) {
    const geometry = new THREE.BoxGeometry(w,h,d); geometry.translate(x,y,z); batches[color].push(geometry);
  }
  function rod(x,y,z,r,h,color) {
    const geometry = new THREE.CylinderGeometry(r,r,h,8); geometry.translate(x,y,z); batches[color].push(geometry);
  }
  // Socle commun, terrasses et ailes d’accueil.
  box(0,1.35,0,28,2.7,18,'concrete');
  box(0,2.75,0,28.4,.24,18.4,'roof');
  box(0,2.52,9.15,28.5,.42,.3,'blue');
  box(0,.48,9.02,28,.2,.2,'blue');
  box(0,1.48,9.04,26,1.45,.15,'glass');
  for(let x=-13;x<=13;x+=1.6) box(x,1.5,9.2,.13,1.8,.2,'frame');
  for(const x of [-14,14]) { box(x,1.5,0,.15,1.5,17,'glass'); box(x,2.5,0,.22,.4,18.4,'blue'); }
  // Deux tours, dix niveaux, façades vitrées et noyaux d’ascenseurs.
  for(const x of [-8,8]) {
    box(x,12,-1,8,18,8,'concrete');
    box(x,12,3.08,5.7,16.9,.16,'glass');
    box(x,12,-5.08,5,16.7,.16,'glass');
    box(x-3.8,12,3.18,.48,18.4,.6,'dark');
    box(x+3.8,12,3.18,.48,18.4,.6,'dark');
    for(let floor=0;floor<10;floor++) {
      const y=3.5+floor*1.75;
      box(x,y,3.28,6.3,.13,.65,'frame');
      box(x,y,-5.22,5.5,.12,.35,'frame');
      box(x+4.04,y,0,.12,.3,6,'blue');
      box(x+4.08,y+.7,-1,.15,.85,2.3,'glass');
      box(x-4.08,y+.7,-1,.15,.8,1.2,'glass');
    }
    for(let col=-2;col<=2;col++) { box(x+col*1.05,12,3.21,.075,16.8,.12,'frame'); box(x+col,12,-5.2,.08,16.8,.12,'frame'); }
    box(x,20.9,3.4,8.7,.95,.7,'blue');
    box(x,21.18,-1,8.4,.25,8.4,'roof');
    box(x,21.8,-2,3.4,1.1,2.7,'dark');
    for(let v=0;v<6;v++) box(x-1.4+v*.55,21.8,-.62,.12,.9,.12,'frame');
    rod(x+2.4,23.5,-3,.09,4.8,'frame');
    for(let n=0;n<4;n++) box(x+2.4,22+n*.8,-3,1,.06,.1,'white');
    const dish = new THREE.SphereGeometry(.65,12,8,0,Math.PI*2,0,Math.PI*.45);
    dish.rotateX(-.8); dish.translate(x-2.3,22,-2.4); batches.frame.push(dish);
    rod(x-2.3,21.65,-2.4,.08,.9,'frame');
  }
  // Passerelle haute vitrée et bandeaux bleus.
  box(0,17,-1,8,1.35,2.1,'glass');
  box(0,17.75,-1,8.4,.25,2.45,'blue');
  box(0,16.25,-1,8.4,.2,2.45,'blue');
  for(let x=-3.6;x<=3.6;x+=.8) box(x,17,.1,.065,1.35,.1,'frame');
  // Verrière de l’entrée, poteaux, marches et jardin.
  box(0,3.25,10,12,.15,6,'glass');
  for(let x=-6;x<=6;x+=1.5) box(x,3.36,10,.08,.08,6.2,'frame');
  for(let z=7;z<=13;z+=1) box(0,3.36,z,12,.08,.08,'frame');
  for(const x of [-5.7,5.7]) rod(x,1.6,12.7,.12,3.2,'frame');
  box(0,.2,11.5,10,.4,5,'roof');
  box(0,.1,14,11,.2,1,'concrete');
  for (const x of [-12,12]) { box(x,.2,11,3,.4,3,'concrete'); rod(x,2,11,.12,3.8,'dark'); for(let i=0;i<6;i++) { const leaf=new THREE.ConeGeometry(.8,3,4); leaf.rotateZ(1.15); leaf.rotateY(i*Math.PI/3); leaf.translate(x,3.7,11); batches.dark.push(leaf); } }
  // Textures de signalétique nettes, dessinées à leur résolution d’affichage.
  const textures=[];
  function label(text,w,h,x,y,z,ground=false) {
    const canvas=document.createElement('canvas'); canvas.width=1024; canvas.height=256;
    const ctx=canvas.getContext('2d'); ctx.fillStyle='#155478'; ctx.fillRect(0,0,1024,256);
    ctx.fillStyle='#d7f2ff'; ctx.font='bold 140px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(text,512,138,970);
    const texture=new THREE.CanvasTexture(canvas); texture.colorSpace=THREE.SRGBColorSpace; textures.push(texture);
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture}));
    mesh.position.set(x,y,z); if(ground) mesh.rotation.x=-Math.PI/2; group.add(mesh);
  }
  label('OCEAN',7.5,1.7,8,20.1,3.81);
  label('MEDICAL CENTER',12,.9,0,2.45,9.34);
  const padCanvas=document.createElement('canvas'); padCanvas.width=512; padCanvas.height=512;
  const ctx=padCanvas.getContext('2d'); ctx.fillStyle='#c8cbc2'; ctx.fillRect(0,0,512,512); ctx.strokeStyle='#a04737'; ctx.lineWidth=9; ctx.beginPath(); ctx.arc(256,256,212,0,Math.PI*2); ctx.stroke(); ctx.fillStyle='#a04737'; ctx.font='bold 260px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('H',256,273);
  const padTexture=new THREE.CanvasTexture(padCanvas); padTexture.colorSpace=THREE.SRGBColorSpace; textures.push(padTexture);
  const pad=new THREE.Mesh(new THREE.PlaneGeometry(5,5),new THREE.MeshBasicMaterial({map:padTexture})); pad.rotation.x=-Math.PI/2; pad.position.set(-9,2.9,6); group.add(pad);
  for(const [key,geometries] of Object.entries(batches)) {
    if(!geometries.length) continue;
    const merged=mergeGeometries(geometries.map(g=>g.index ? g.toNonIndexed() : g));
    const material=new THREE.MeshStandardMaterial({color:palette[key],roughness:key==='glass'?.3:.85,metalness:key==='glass'?.25:0});
    group.add(new THREE.Mesh(merged,material)); geometries.forEach(g=>g.dispose());
  }
  return { group, dispose() { group.traverse(item=>{ if(item.isMesh) {item.geometry.dispose(); item.material.dispose();} }); textures.forEach(t=>t.dispose()); } };
}
