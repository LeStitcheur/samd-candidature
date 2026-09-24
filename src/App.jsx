import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowDown, ArrowRight, ArrowUp, Plus, Minus, X, Menu, HeartPulse, UsersRound, GraduationCap, MapPin, Clock3, ShieldCheck, Sparkles, Cross, Building2, Gamepad2, UserRound, Target, Expand } from 'lucide-react';
import { candidature, hierarchie, engagements, horizons } from './content.js';
import Tabs from './components/Tabs.jsx';

const PillboxMap = lazy(() => import('./components/PillboxMap.jsx'));
const chapters = [
  { id: 'projet', label: 'Le projet' }, { id: 'direction', label: 'La direction' },
  { id: 'organisation', label: 'L’équipe' }, { id: 'hopital', label: 'L’hôpital' },
  { id: 'philosophie', label: 'La philosophie' }, { id: 'changements', label: 'Les engagements' },
  { id: 'avenir', label: 'L’avenir' },
];

function Logo({ compact = false }) {
  return <a className="brand" href="#accueil" aria-label="SAMD, accueil"><img src="/assets/samd-logo.png" alt="" width="52" height="52" /><span>SAMD{!compact && <small>SAN ANDREAS MEDICAL DEPARTMENT</small>}</span></a>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const menuButton = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: '-20% 0px -55% 0px' });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const dismiss = event => { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [menuOpen]);
  return <header className="header"><div className="header-inner"><Logo />
    <nav className="desktop-nav" aria-label="Navigation principale">{chapters.filter(chapter => ['projet', 'direction', 'hopital', 'avenir'].includes(chapter.id)).map(chapter => <a className={active === chapter.id ? 'active' : ''} aria-current={active === chapter.id ? 'location' : undefined} href={`#${chapter.id}`} key={chapter.id}>{chapter.label}</a>)}</nav>
    <a className="button button-small button-red header-cta" href="#dossier">La candidature <ArrowUpRight size={16} /></a>
    <button className="icon-button mobile-menu-button" ref={menuButton} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation">{menuOpen ? <X /> : <Menu />}</button>
    <nav className="mobile-navigation" id="mobile-navigation" hidden={!menuOpen} aria-label="Navigation mobile">{chapters.map((chapter, index) => <a href={`#${chapter.id}`} key={chapter.id} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{chapter.label}<ArrowUpRight size={18} /></a>)}</nav>
  </div></header>;
}

function SectionLabel({ number, children, aside }) {
  return <div className="section-label"><span><span className="section-number">{number}</span>{children}</span>{aside && <small>{aside}</small>}</div>;
}

function Hero() {
  return <section id="accueil" className="hero" aria-labelledby="hero-title"><div className="hero-city" aria-hidden="true" /><div className="hero-inner">
    <div className="hero-copy"><span className="pill"><span className="status-dot" />ALYNIA RP <span className="pill-divider" /> CANDIDATURE SAMD</span><h1 id="hero-title">Un nouveau<br />souffle pour<br />le <span>SAMD.</span></h1><p>Prendre soin. Créer des histoires.<br />Faire grandir une équipe qui compte.</p><div className="hero-actions"><a className="button button-red" href="#projet">Découvrir le projet <ArrowUpRight size={19} /></a><a className="hero-secondary" href="#direction">Rencontrer le candidat <ArrowRight size={16} /></a></div><div className="hero-signature"><span className="signature-line" /><span>Un projet porté par<strong>Aménadiel Belladonna</strong></span></div></div>
    <div className="hero-person"><div className="portrait-glow" /><span className="hero-outline" aria-hidden="true">SAMD</span><img className="hero-portrait" src="/assets/amenadiel.png" alt="Aménadiel Belladonna, candidat à la direction du SAMD, en costume noir et chemise verte" fetchPriority="high" width="969" height="1624" /><div className="portrait-gradient" /><div className="candidate-label"><span className="candidate-icon"><Cross size={22} /></span><span><small>CANDIDAT À LA DIRECTION</small><strong>Aménadiel Belladonna</strong></span><ArrowUpRight size={19} /></div><span className="portrait-side-label">SAN ANDREAS MEDICAL DEPARTMENT</span></div>
  </div><div className="hero-bottom"><span><MapPin size={14} /> Pillbox Hill, Los Santos</span><span>Une vision humaine. Une ambition collective.</span><a href="#dossier" aria-label="Parcourir les chapitres du dossier"><ArrowDown size={18} /></a></div></section>;
}

function ChapterNavigation() {
  return <div className="chapter-navigation" id="dossier"><span className="chapter-caption">À L’INTÉRIEUR<br /><strong>Le dossier.</strong></span><nav aria-label="Chapitres du dossier">{chapters.map((chapter, index) => <a href={`#${chapter.id}`} key={chapter.id}><span>0{index + 1}</span>{chapter.label}</a>)}</nav></div>;
}

function Project() {
  const missions = [{ icon: HeartPulse, title: 'Soigner avec attention.', text: 'Être présent dans les moments qui comptent. Écouter avant d’agir, accompagner au-delà de l’urgence.' }, { icon: GraduationCap, title: 'Transmettre, ensemble.', text: 'Donner à chaque recrue les moyens de progresser, avec une formation concrète et des référents accessibles.' }, { icon: UsersRound, title: 'Faire vivre le roleplay.', text: 'Transformer chaque rencontre en opportunité de jeu. Construire des histoires avec les citoyens de Los Santos.' }];
  return <section className="section" id="projet" aria-labelledby="project-title"><SectionLabel number="01" aside="L’humain au centre du projet">LE PROJET</SectionLabel><div className="section-intro"><h2 id="project-title">Bien plus qu’un hôpital.<br /><span>Un repère pour la ville.</span></h2><div><p>Le San Andreas Medical Department accompagne les citoyens lorsqu’ils ont le plus besoin des autres.</p><p className="muted">Notre ambition : faire du SAMD un service vivant, structuré et accessible. Un lieu où l’on soigne, où l’on apprend et où l’on construit des histoires qui durent.</p></div></div><div className="mission-cards">{missions.map((mission,index)=><article key={mission.title} className="mission-card"><div className="mission-card-top"><span className="icon-tile"><mission.icon size={25} strokeWidth={1.6} /></span><span>0{index+1}</span></div><h3>{mission.title}</h3><p>{mission.text}</p></article>)}</div></section>;
}

function Direction() {
  const [profile, setProfile] = useState('rp');
  const p = candidature.patron;
  return <section className="section direction-section" id="direction" aria-labelledby="direction-title"><SectionLabel number="02" aside="Une personne. Un engagement.">LA DIRECTION</SectionLabel><div className="direction-layout"><div className="profile-visual"><span className="profile-image-label"><Cross size={17} /> SAMD · DIRECTION</span><div className="profile-orbit" aria-hidden="true" /><img src="/assets/amenadiel.png" alt="Portrait d’Aménadiel Belladonna" loading="lazy" width="969" height="1624" /><div className="profile-visual-caption"><small>LE VISAGE DU PROJET</small><h3>Aménadiel<br />Belladonna<span>.</span></h3></div></div><div className="profile-content"><h2 id="direction-title">Sur le terrain.<br /><span>Et à vos côtés.</span></h2><Tabs id="profile" label="Présentation RP ou HRP" items={[{id:'rp',label:'Le personnage',icon:UserRound},{id:'hrp',label:'Le joueur',icon:Gamepad2}]} value={profile} onChange={setProfile} />
      <div role="tabpanel" id="profile-panel-rp" aria-labelledby="profile-tab-rp" hidden={profile !== 'rp'} tabIndex="0"><span className="overline">PRÉSENTATION RP</span><h3>{p.nomRP}</h3><p>{p.parcoursRP}</p><blockquote>{p.motivationRP}</blockquote><div className="profile-meta"><div><Building2 size={18} /><span>Fonction visée<strong>Directeur du SAMD</strong></span></div><div><MapPin size={18} /><span>Établissement<strong>Pillbox Hill</strong></span></div></div></div>
      <div role="tabpanel" id="profile-panel-hrp" aria-labelledby="profile-tab-hrp" hidden={profile !== 'hrp'} tabIndex="0"><span className="overline">PRÉSENTATION HRP</span><h3>Alex, derrière Aménadiel.</h3><p>{p.experienceHRP}</p><blockquote>{p.motivationHRP}</blockquote><div className="profile-meta"><div><Clock3 size={18} /><span>Disponibilités<strong>{p.disponibilitesHRP}</strong></span></div><div><ShieldCheck size={18} /><span>Expérience<strong>Déjà directeur de l’hôpital</strong></span></div></div></div>
    </div></div></section>;
}

function Team() {
  const [selected, setSelected] = useState(0);
  const role = hierarchie[selected];
  return <section className="section" id="organisation" aria-labelledby="team-title"><SectionLabel number="03" aside="Des responsabilités avant des titres">L’ÉQUIPE</SectionLabel><div className="section-intro"><h2 id="team-title">Chacun sa place.<br /><span>Une même mission.</span></h2><p className="muted">Une hiérarchie lisible, une progression accompagnée et une direction accessible. Explorez les rôles de la future équipe.</p></div><div className="team-layout"><div className="team-roles" role="group" aria-label="Hiérarchie du SAMD">{hierarchie.map((item,index)=><button className={`role-button ${selected===index?'selected':''}`} key={item.grade} aria-pressed={selected===index} aria-controls="role-detail" onClick={()=>setSelected(index)}><span className="role-number">{item.niveau}</span><span><strong>{item.grade}</strong><small>{item.nom}</small></span><ArrowUpRight size={18}/></button>)}</div><div className="role-detail" id="role-detail" aria-live="polite" aria-atomic="true"><span className="role-watermark" aria-hidden="true">{role.niveau}</span><span className="icon-tile"><UsersRound size={25}/></span><span className="overline">RESPONSABILITÉS & MISSION</span><h3>{role.grade}</h3><p>{role.mission}</p><ul>{role.responsabilites.map(text=><li key={text}><ArrowUpRight size={15}/>{text}</li>)}</ul><div className="role-footer"><ShieldCheck size={17}/>Une responsabilité, avant un titre.</div></div></div><p className="footnote">Organisation proposée à la reprise, à ajuster avec les effectifs et le fonctionnement d’Alynia RP.</p></section>;
}

function Hospital() {
  const [visible, setVisible] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const mapContainer = useRef(null);
  const dialog = useRef(null);
  const photoButton = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { if(entries.some(entry=>entry.isIntersecting)){setVisible(true);observer.disconnect();} },{rootMargin:'250px'});
    observer.observe(mapContainer.current);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{ if(photoOpen) dialog.current?.showModal(); else dialog.current?.close(); },[photoOpen]);
  return <section className="section hospital-section" id="hopital" aria-labelledby="hospital-title"><SectionLabel number="04" aside="Pillbox aujourd’hui. Océanic demain.">L’HÔPITAL</SectionLabel><div className="section-intro"><h2 id="hospital-title">Notre point d’ancrage.<br /><span>Au cœur de Los Santos.</span></h2><p className="muted">Pillbox Hill : un emplacement central pour accueillir les citoyens et intervenir au plus près de la ville.</p></div><div className="hospital-layout"><div className="map-shell" ref={mapContainer}><Suspense fallback={<div className="map-placeholder"><MapPin/><span>Préparation de la carte…</span></div>}>{visible ? <PillboxMap/> : <div className="map-placeholder"><MapPin/><span>Pillbox Hill · Carte 3D</span></div>}</Suspense></div><div className="hospital-card"><button ref={photoButton} className="hospital-photo" aria-label="Agrandir la capture de Pillbox Hill" onClick={()=>setPhotoOpen(true)}><img src="/assets/hospital.png" alt="Façade du Pillbox Hill Medical Center dans GTA V" loading="lazy" width="960" height="536"/><span><Expand size={17}/></span></button><div className="hospital-card-body"><span className="pill pill-subtle"><MapPin size={12}/>ÉTABLISSEMENT ACTUEL</span><h3>Pillbox Hill<br />Medical Center</h3><p>Elgin Avenue · Los Santos<br />San Andreas</p><a href={candidature.hopital.lien} target="_blank" rel="noopener noreferrer" className="text-link">Découvrir l’hôpital<ArrowUpRight size={19}/></a></div></div></div><p className="footnote">Carte et capture de référence GTA V. L’aménagement propre à Alynia RP peut différer.</p>
    <dialog ref={dialog} className="photo-dialog" aria-labelledby="photo-title" onClose={()=>{setPhotoOpen(false);photoButton.current?.focus();}} onClick={event=>{if(event.target===dialog.current){const bounds=dialog.current.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)setPhotoOpen(false);}}}><button className="icon-button dialog-close" aria-label="Fermer la capture" onClick={()=>setPhotoOpen(false)}><X/></button><img src="/assets/hospital.png" alt="Vue agrandie de Pillbox Hill"/><div><h3 id="photo-title">Pillbox Hill Medical Center</h3><p>GTA V / Rockstar Games · Capture de référence</p></div></dialog>
  </section>;
}

function Philosophy() {
  return <section className="section philosophy-section" id="philosophie" aria-labelledby="philosophy-title"><SectionLabel number="05" aside="Ce qui nous anime">LA PHILOSOPHIE</SectionLabel><div className="philosophy-heading"><span className="philosophy-icon"><HeartPulse size={36} strokeWidth={1.5}/></span><h2 id="philosophy-title">On ne soigne pas seulement<br />un personnage.<br /><span>On fait vivre une histoire.</span></h2><p>Que chaque passage au SAMD laisse autre chose<br className="desktop-break"/> qu’une barre de vie remplie.</p></div><div className="values"><article><span>01 / L’HUMAIN</span><h3>Écouter avant d’agir.</h3><p>Le patient est un partenaire de jeu. Respecter ses limites, l’impliquer dans la scène et lui donner une vraie place.</p></article><article><span>02 / L’EXIGENCE</span><h3>Progresser ensemble.</h3><p>Former, accompagner et partager les retours. Faire de chaque expérience une occasion de devenir meilleurs.</p></article><article><span>03 / LE PLAISIR</span><h3>Garder l’envie de jouer.</h3><p>Une organisation souple, des scènes qui ont du sens et un collectif qui respecte la vie hors du serveur.</p></article></div></section>;
}

function Changes() {
  const [open, setOpen] = useState(0);
  return <section className="section changes-section" id="changements" aria-labelledby="changes-title"><SectionLabel number="06" aside="Des intentions aux actions">LES ENGAGEMENTS</SectionLabel><div className="changes-layout"><div><h2 id="changes-title">Faire mieux.<br /><span>Concrètement.</span></h2><p className="muted">Cinq engagements pour relancer la dynamique du service, avec celles et ceux qui le font vivre.</p><div className="changes-note"><Sparkles size={20}/><span>Progressivement.<br/>Collectivement. Durable­ment.</span></div></div><div className="commitments">{engagements.map((item,index)=><article className={`commitment ${open===index?'open':''}`} key={item.titre}><h3><button aria-expanded={open===index} aria-controls={`commitment-panel-${index}`} onClick={()=>setOpen(open===index?null:index)}><span className="commitment-number">0{index+1}</span><span>{item.titre}</span>{open===index?<Minus size={20}/>:<Plus size={20}/>}</button></h3><div className="commitment-content" id={`commitment-panel-${index}`} hidden={open!==index}><p>{item.detail}</p><div className="commitment-result"><ArrowUpRight size={17}/>{item.resultat}</div></div></article>)}</div></div></section>;
}

function Future() {
  const [period,setPeriod]=useState('court');
  return <section className="section future-section" id="avenir" aria-labelledby="future-title"><SectionLabel number="07" aside="Construire dans la durée">L’AVENIR</SectionLabel><div className="section-intro"><h2 id="future-title">Une ambition.<br/><span>Plusieurs horizons.</span></h2><p className="muted">Des étapes concrètes pour avancer avec cohérence. Des échéances à adapter au rythme de l’équipe et du serveur.</p></div><Tabs id="future" label="Objectifs dans le temps" className="future-tabs" items={horizons.map(horizon=>({id:horizon.id,label:horizon.label,description:horizon.periode}))} value={period} onChange={setPeriod}/>{horizons.map(horizon=><div className="horizon-panel" id={`future-panel-${horizon.id}`} role="tabpanel" aria-labelledby={`future-tab-${horizon.id}`} tabIndex="0" hidden={period!==horizon.id} key={horizon.id}><div><span className="overline">{horizon.periode}</span><h3>{horizon.titre}</h3><p>{horizon.texte}</p><div className="success-marker"><Target size={19}/><span><small>NOTRE REPÈRE DE RÉUSSITE</small>{horizon.repere}</span></div></div><ol>{horizon.objectifs.map((objective,index)=><li key={objective}><span>0{index+1}</span>{objective}</li>)}</ol></div>)}
    <div className="oceanic"><div className="oceanic-photo" aria-hidden="true"/><div className="oceanic-inner"><span className="pill"><span className="status-dot"/>L’ÉVOLUTION POSSIBLE</span><div className="oceanic-layout"><div><span className="overline">LOS SANTOS · CÔTÉ OCÉAN</span><h3>Prochain arrêt.<br/><span>Océanic.</span><ArrowUpRight aria-hidden="true"/></h3></div><div><p>Un nouvel hôpital proche de la plage. De nouvelles possibilités de scènes. Un projet qui grandit avec son équipe.</p><p>Cette évolution sera préparée après stabilisation du service, selon les moyens et le mapping disponibles, et avec l’accord du staff d’Alynia RP.</p><div className="oceanic-steps"><span>Consolider</span><ArrowRight size={14}/><span>Valider</span><ArrowRight size={14}/><span>Évoluer</span></div></div></div></div></div><div className="closing"><Cross size={25}/><p>Le prochain chapitre du SAMD s’écrit <strong>ensemble.</strong></p></div></section>;
}

function Footer(){return <footer className="footer"><div className="footer-main"><Logo/><span>Un nouveau souffle.<br/><strong>La même raison d’être.</strong></span><a className="icon-button" href="#accueil" aria-label="Retour en haut"><ArrowUp size={19}/></a></div><div className="footer-bottom"><span>Aménadiel Belladonna · Alynia RP</span><span>Dossier de candidature à la reprise du SAMD</span><details className="credits"><summary>Crédits & sources</summary><div><p>Projet de roleplay fictif, sans affiliation à Rockstar Games. Les orientations présentées constituent des propositions.</p><p>Portrait et logo fournis par le porteur du projet. Visuels GTA V © Rockstar Games : <a href="https://hdqwalls.com/los-santos-gta-v-city-view-wallpaper" target="_blank" rel="noreferrer">HDQWalls</a>, <a href="https://gta.fandom.com/wiki/Pillbox_Hill_Medical_Center" target="_blank" rel="noreferrer">GTA Wiki</a> (capture via <a href="https://lastlandrp.wixsite.com/lastland/lsmc" target="_blank" rel="noreferrer">miroir</a>).</p><p>Relief GTA V : <a href="https://github.com/Andreas1331/ragemp-gtav-heightmap" target="_blank" rel="noreferrer">Andreas1331 (MIT)</a>. Localisation de Pillbox : <a href="https://github.com/qbcore-framework/qb-ambulancejob/blob/main/config.lua" target="_blank" rel="noreferrer">QBCore</a>.</p></div></details></div></footer>;}

export default function App(){
  useEffect(()=>{
    if(location.hash){const id=decodeURIComponent(location.hash.slice(1));requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'instant'}));}
  },[]);
  return <><a className="skip-link" href="#projet">Aller au dossier</a><Header/><main><Hero/><ChapterNavigation/><Project/><Direction/><Team/><Hospital/><Philosophy/><Changes/><Future/></main><Footer/></>;
}

