import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen, FileCheck, Sparkles, Target, CheckCircle2,
  ArrowRight, Award, Users, Star, ChevronRight, ChevronLeft, ChevronUp,
  Mail, Phone, Code, GraduationCap, Database, Server,
  Cpu, Shield
} from 'lucide-react';

/* ──────────────────── DATA ──────────────────── */
const STATS = [
  { value: 40,   suffix: '+', label: 'Fiches de Cours' },
  { value: 1500, suffix: '+', label: 'QCM & Annales' },
  { value: 30,   suffix: '+', label: 'Examens Blancs' },
  { value: 7,    suffix: '',  label: 'Filières IT & IA' },
];

const CONCOURS = [
  { code: '01', icon: Cpu,          grad: 'linear-gradient(135deg,#03594e,#057a6c)', title: 'Data Scientist & IA',          desc: 'Machine Learning, Deep Learning, PyTorch, Scikit-Learn & NLP.' },
  { code: '02', icon: Database,     grad: 'linear-gradient(135deg,#046a5d,#099282)', title: 'Data Engineer & Big Data',      desc: 'Pipelines ETL, Spark, Hadoop, SQL complexe & flux décisionnels.' },
  { code: '03', icon: Server,       grad: 'linear-gradient(135deg,#02473e,#046a5d)', title: 'Administrateur DBA',            desc: 'PostgreSQL/Oracle, tuning, ACID, réplication & indexation.' },
  { code: '04', icon: Code,         grad: 'linear-gradient(135deg,#03594e,#046a5d)', title: 'Informatique & Génie Logiciel', desc: 'Algorithmique, théorie des graphes & Design Patterns GoF.' },
  { code: '05', icon: Shield,       grad: 'linear-gradient(135deg,#03594e,#023d33)', title: 'Systèmes, Cloud & DevOps',      desc: 'Linux, TCP/IP, Docker, Kubernetes & sécurité SI.' },
  { code: '06', icon: GraduationCap,grad: 'linear-gradient(135deg,#057a6c,#03594e)', title: 'CRMEF Enseignement',            desc: 'Recrutement enseignants informatique secondaire & pédagogie.' },
];

const FEATURES = [
  { icon: BookOpen,  color: '#03594e', bgColor: '#e6f5f3', title: 'Fiches Magistrales',   desc: 'Rédigées au niveau Master & Ingénieur avec formulations, extraits de code et astuces spécifiques aux concours.' },
  { icon: FileCheck, color: '#d97706', bgColor: '#fef3c7', title: 'Annales Corrigées',    desc: 'Simulations complètes chronométrées avec explications pédagogiques pour chaque question.' },
  { icon: Sparkles,  color: '#057a6c', bgColor: '#e0f2f1', title: 'Assistant IA Tuteur',  desc: 'Génération sur-mesure de questionnaires ciblés avec tuteur conversationnel intelligent.' },
  { icon: Target,    color: '#02473e', bgColor: '#e6f5f3', title: 'Suivi de Progression', desc: 'Tableau de bord ajustant vos cours selon la filière choisie (Data, Cloud, DBA ou CRMEF).' },
];

const TESTIMONIALS = [
  { name: 'Fatima Ezzahra', role: 'Admise Data Scientist — 2025', img: 'assets/img/testimonial/thumb-1-1.jpg', text: "Inforéussit m'a permis de cibler exactement les chapitres qui tombent au concours. Les fiches sont d'une précision rare et les exercices sont vraiment au niveau des épreuves nationales.", stars: 5 },
  { name: 'Youssef Amrani',  role: 'Reçu CRMEF Informatique — 2025', img: 'assets/img/testimonial/thumb-1-2.jpg', text: "J'ai utilisé la plateforme pendant 3 mois. L'assistant IA détecte mes lacunes et génère des exercices ciblés. Le meilleur outil pour la préparation.", stars: 5 },
  { name: 'Sara Benali',     role: 'Ingénieure Cloud — 2024',        img: 'assets/img/testimonial/thumb-1-3.jpg', text: "Le contenu est sérieux, structuré et complet. Les annales nationales bien décortiquées valent largement les préparations privées qui coûtent une fortune.", stars: 5 },
];

/* ──────────────────── COUNTER ──────────────────── */
function AnimatedCounter({ target, suffix, inView }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1400, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return <>{count}{suffix}</>;
}

/* ──────────────────── COMPONENT ──────────────────── */
export default function Home() {
  const location = useLocation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTesti, setActiveTesti] = useState(0);
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 200);
      }
    }
  }, [location]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsInView(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTesti(p => (p + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  /* ── HERO ── */
  return (
    <div style={{ background: '#fff', color: '#1B1D21', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ══════════════════════════════════════════════════
          HERO — fond dégradé vert pastel (#03594e)
          ══════════════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg,#f0f9f8 0%,#f5fcfb 50%,#e6f5f3 100%)', position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        {/* Décorations shapes du template Educeet */}
        <img src="assets/img/shape/hero-1-2.png" alt="" style={{ position:'absolute', top:0, right:0, width:260, opacity:0.25, pointerEvents:'none' }} />
        <img src="assets/img/shape/hero-1-3.png" alt="" style={{ position:'absolute', bottom:0, left:0, width:160, opacity:0.2, pointerEvents:'none' }} />
        <img src="assets/img/shape/about-6-2.png" alt="" style={{ position:'absolute', top:'12%', right:'8%', width:80, opacity:0.8, pointerEvents:'none', animation:'floatSlow 6s ease-in-out infinite' }} onError={e => e.target.style.display='none'} />
        <img src="assets/img/shape/about-6-3.png" alt="" style={{ position:'absolute', bottom:'15%', left:'4%', width:90, opacity:0.7, pointerEvents:'none', animation:'floatReverse 7s ease-in-out infinite' }} onError={e => e.target.style.display='none'} />

        {/* Blobs couleurs pastel */}
        <div style={{ position:'absolute', top:-80, right:'20%', width:500, height:500, background:'rgba(3,89,78,0.08)', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:'10%', width:350, height:350, background:'rgba(248,198,47,0.10)', borderRadius:'50%', filter:'blur(70px)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'80px 24px', width:'100%', position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center', flexWrap:'wrap' }} className="hero-grid">
            {/* Text */}
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>


              <h1 style={{ fontSize:'clamp(2.2rem,5vw,3.5rem)', fontWeight:900, lineHeight:1.1, color:'#1B1D21', margin:0 }}>
                Réussissez vos{' '}
                <span style={{ background:'linear-gradient(135deg,#03594e,#057a6c)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', position:'relative' }}>
                  concours
                </span>{' '}
                d'informatique & IA.
              </h1>

              <p style={{ fontSize:17, color:'#475569', lineHeight:1.7, margin:0, maxWidth:520 }}>
                Fiches magistrales, annales corrigées étape par étape et tuteur IA pour les concours
                État (Data, Cloud, DBA) & CRMEF Enseignement.
              </p>

              {/* CTA buttons - Style exact de l'image (rounded pill #03594e) */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:14, justifyContent:'inherit' }} className="hero-cta-btns">
                <Link
                  to="/register"
                  style={{
                    display:'inline-flex', alignItems:'center', gap:12,
                    padding:'15px 36px', borderRadius:14, fontWeight:800, fontSize:15,
                    background:'#03594e', color:'#fff', textDecoration:'none',
                    boxShadow:'0 8px 24px rgba(3,89,78,0.30)',
                    transition:'all .3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background='#02473e'; e.currentTarget.style.boxShadow='0 12px 30px rgba(3,89,78,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='#03594e'; e.currentTarget.style.boxShadow='0 8px 24px rgba(3,89,78,0.30)'; }}
                >
                  Commencer gratuitement <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  style={{
                    display:'inline-flex', alignItems:'center', gap:10,
                    padding:'15px 36px', borderRadius:14, fontWeight:700, fontSize:15,
                    background:'#fff', color:'#03594e', textDecoration:'none',
                    border:'2px solid #b3e6df',
                    transition:'all .3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='#03594e'; e.currentTarget.style.background='#e6f5f3'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='#b3e6df'; e.currentTarget.style.background='#fff'; }}
                >
                  Espace Candidat
                </Link>
              </div>

              {/* Trust badges */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:20, paddingTop:4, justifyContent:'inherit' }}>
                {['✅ Accès immédiat', '📚 Programme officiel', '🤖 Tuteur IA inclus'].map(t => (
                  <span key={t} style={{ fontSize:12, fontWeight:600, color:'#64748b' }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Image */}
            <div style={{ position:'relative', display:'flex', justifyContent:'center' }}>
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                <div style={{ width:440, height:440, background:'rgba(3,89,78,0.08)', borderRadius:'50%', filter:'blur(60px)' }} />
              </div>
              <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:520 }}>
                <img
                  src="assets/img/hero/hero-students-removebg.png"
                  alt="Préparation aux concours Inforéussit — Étudiants Informatique & IA"
                  style={{ width:'100%', height:'auto', filter:'drop-shadow(0 20px 40px rgba(3,89,78,0.18))', animation:'floatSlow 5s ease-in-out infinite' }}
                  onError={e => { e.target.src='assets/img/hero/hero-5-1.png'; e.target.onerror=null; }}
                />
                {/* Badge 1 */}
                <div className="hero-badge-1" style={{ position:'absolute', bottom:-16, left:-24, background:'#fff', border:'1px solid #b3e6df', borderRadius:16, padding:'12px 16px', boxShadow:'0 8px 30px rgba(3,89,78,0.12)', display:'flex', alignItems:'center', gap:12, animation:'floatReverse 6s ease-in-out infinite' }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:'#03594e', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Users size={18} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:800, color:'#1B1D21' }}>1500+ Questions</div>
                    <div style={{ fontSize:10, color:'#94a3b8' }}>Annales Corrigées</div>
                  </div>
                </div>
                {/* Badge 2 */}
                <div className="hero-badge-2" style={{ position:'absolute', top:-16, right:-12, background:'#fff', border:'1px solid #fef3c7', borderRadius:16, padding:'12px 16px', boxShadow:'0 8px 30px rgba(248,198,47,0.15)', display:'flex', alignItems:'center', gap:12, animation:'floatSlow 5s ease-in-out infinite' }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#F8C62F,#F5821F)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <BookOpen size={18} color="#1B1D21" />
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:800, color:'#1B1D21' }}>40+ Fiches</div>
                    <div style={{ fontSize:10, color:'#94a3b8' }}>Niveau Master</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media(max-width:768px){
            .hero-grid{ grid-template-columns:1fr !important; text-align:center; gap:40px !important; }
            .hero-cta-btns { justify-content: center !important; }
          }
          @media(max-width:640px){
            .hero-badge-1 { left: 0 !important; bottom: -10px !important; padding: 8px 12px !important; }
            .hero-badge-2 { right: 0 !important; top: -10px !important; padding: 8px 12px !important; }
          }
          @keyframes floatSlow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
          @keyframes floatReverse { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }
        `}</style>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS — fond vert-sapin foncé (#03594e) avec shapes du template
          ══════════════════════════════════════════════════ */}
      <section
        ref={statsRef}
        style={{
          background: 'linear-gradient(135deg,#03594e 0%,#046a5d 50%,#023d33 100%)',
          padding: '72px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative subtle wave background shape */}
        <img src="assets/img/shape/brand-2-3.png" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.15, pointerEvents:'none', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />
        <div style={{ position:'absolute', top:0, right:0, width:350, height:350, background:'rgba(255,255,255,0.04)', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32, textAlign:'center' }} className="stats-grid">
            {STATS.map((s, i) => (
              <div key={s.label}>
                <div style={{ fontSize:'clamp(2.5rem,5vw,3.5rem)', fontWeight:900, color:'#F8C62F', lineHeight:1, marginBottom:8 }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} inView={statsInView} />
                </div>
                <div style={{ width:32, height:3, background:'rgba(248,198,47,0.5)', borderRadius:2, margin:'0 auto 10px' }} />
                <div style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.95)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:640px){.stats-grid{grid-template-columns:1fr 1fr !important;}}`}</style>
      </section>

      {/* ══════════════════════════════════════════════════
          FILIÈRES — fond vert d'eau très doux
          ══════════════════════════════════════════════════ */}
      <section
        id="concours"
        style={{
          background: '#f0f9f8',
          padding: '96px 24px',
          backgroundImage: 'url(assets/img/shape/course-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <span style={{ display:'inline-block', background:'#F8C62F', color:'#1B1D21', fontWeight:800, fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em', padding:'6px 18px', borderRadius:4, marginBottom:14 }}>
              🎓 Filières & Spécialités
            </span>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:900, color:'#1B1D21', margin:'0 0 12px' }}>
              Tous les concours informatiques couverts
            </h2>
            <p style={{ color:'#64748b', fontSize:15, maxWidth:520, margin:'0 auto' }}>
              Choisissez votre spécialité pour adapter vos fiches de révision et examens blancs.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }} className="cards-grid-3">
            {CONCOURS.map((c) => (
              <div
                key={c.code}
                style={{
                  background:'#fff', borderRadius:16, padding:28,
                  border:'1px solid #d4ede9',
                  boxShadow:'0 2px 12px rgba(3,89,78,0.04)',
                  cursor:'default', position:'relative', overflow:'hidden',
                  transition:'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(3,89,78,0.12)'; e.currentTarget.style.borderColor='transparent'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(3,89,78,0.04)'; e.currentTarget.style.borderColor='#d4ede9'; }}
              >
                <div style={{ fontSize:10, fontWeight:900, color:'#94a3b8', letterSpacing:'0.1em', marginBottom:12 }}>#{c.code}</div>
                <div style={{ width:48, height:48, borderRadius:12, background:c.grad, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, boxShadow:'0 4px 14px rgba(0,0,0,0.12)' }}>
                  <c.icon size={22} color="#fff" />
                </div>
                <h3 style={{ fontWeight:800, fontSize:14, color:'#1B1D21', marginBottom:8, lineHeight:1.4 }}>{c.title}</h3>
                <p style={{ fontSize:13, color:'#64748b', lineHeight:1.6, margin:0 }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:900px){.cards-grid-3{grid-template-columns:1fr 1fr !important;}} @media(max-width:560px){.cards-grid-3{grid-template-columns:1fr !important;}}`}</style>
      </section>

      {/* ══════════════════════════════════════════════════
          ABOUT / VISION — fond blanc avec shapes du template
          ══════════════════════════════════════════════════ */}
      <section id="vision" style={{ background:'#fff', padding:'96px 24px', position:'relative', overflow:'hidden' }}>
        {/* Shape decorations */}
        <img src="assets/img/shape/about-6-2.png" alt="" style={{ position:'absolute', top:'10%', left:'3%', width:95, opacity:0.85, pointerEvents:'none', animation:'floatSlow 5s ease-in-out infinite' }} onError={e => e.target.style.display='none'} />
        <img src="assets/img/shape/about-1-1.png" alt="" style={{ position:'absolute', top:'40%', right:'5%', width:70, opacity:0.7, pointerEvents:'none', animation:'floatReverse 6s ease-in-out infinite' }} onError={e => e.target.style.display='none'} />

        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }} className="about-grid">
            {/* Image */}
            <div style={{ position:'relative' }}>
              {/* Floating shape decoration directly over image corner */}
              <img src="assets/img/shape/about-6-1.png" alt="" style={{ position:'absolute', top:-24, left:-24, width:64, zIndex:10, pointerEvents:'none' }} onError={e => e.target.style.display='none'} />
              <img src="assets/img/shape/about-6-2.png" alt="" style={{ position:'absolute', bottom:-30, right:-20, width:85, zIndex:10, pointerEvents:'none', animation:'floatSlow 4s ease-in-out infinite' }} onError={e => e.target.style.display='none'} />

              <div style={{ borderRadius:24, overflow:'hidden', boxShadow:'0 20px 60px rgba(3,89,78,0.12)', position:'relative', zIndex:1 }}>
                <img
                  src="assets/img/about/about-hd-main.png"
                  alt="Notre engagement académique"
                  style={{ width:'100%', height:440, objectFit:'cover', display:'block' }}
                  onError={e => { e.target.src='assets/img/about/about-us-4.jpg'; e.target.onerror=null; }}
                />
              </div>
              {/* Floating badge */}
              <div className="about-overlay-badge" style={{ position:'absolute', bottom:20, left:20, right:80, background:'#fff', borderRadius:14, padding:'14px 16px', boxShadow:'0 8px 30px rgba(3,89,78,0.15)', display:'flex', alignItems:'center', gap:14, zIndex:2 }}>
                <div style={{ width:46, height:46, borderRadius:12, background:'linear-gradient(135deg,#F8C62F,#F5821F)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Award size={22} color="#1B1D21" />
                </div>
                <div>
                  <div style={{ fontWeight:900, fontSize:13, color:'#1B1D21' }}>Contenu 100% officiel</div>
                  <div style={{ fontSize:11, color:'#94a3b8' }}>Validé par des enseignants nationaux</div>
                </div>
              </div>
              {/* Second image overlay */}
              <div className="about-overlay-thumb" style={{ position:'absolute', top:-20, right:-20, width:130, height:130, borderRadius:18, overflow:'hidden', border:'4px solid #fff', boxShadow:'0 12px 30px rgba(3,89,78,0.2)', zIndex:2 }}>
                <img
                  src="assets/img/about/about-hd-thumb.png"
                  alt=""
                  style={{ width:'100%', height:'100%', objectFit:'cover' }}
                  onError={e => { e.target.src='assets/img/hero/hero-14-1.png'; e.target.onerror=null; }}
                />
              </div>
            </div>

            {/* Text */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <span style={{ display:'inline-block', background:'#F8C62F', color:'#1B1D21', fontWeight:800, fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em', padding:'6px 18px', borderRadius:4, width:'fit-content' }}>
                Notre Engagement Académique
              </span>
              <h2 style={{ fontSize:'clamp(1.7rem,3.5vw,2.3rem)', fontWeight:900, color:'#1B1D21', margin:0, lineHeight:1.2 }}>
                Une préparation rigoureuse pour les candidats{' '}
                <span style={{ background:'linear-gradient(135deg,#03594e,#057a6c)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  déterminés.
                </span>
              </h2>
              <p style={{ color:'#475569', lineHeight:1.7, fontSize:15, margin:0 }}>
                Chaque cours et chaque question sont élaborés pour répondre exactement aux exigences
                et aux critères des jurys nationaux.
              </p>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  'Contenu 100% conforme aux programmes des concours officiels',
                  'Annales nationales réelles décortiquées par des enseignants',
                  "Environnement adapté aux sessions intensives de révision",
                ].map(item => (
                  <li key={item} style={{ display:'flex', alignItems:'flex-start', gap:12, fontSize:14, fontWeight:500, color:'#374151' }}>
                    <span style={{ width:22, height:22, borderRadius:'50%', background:'#F8C62F', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                      <CheckCircle2 size={13} color="#1B1D21" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              {/* Button avec le style exact de la capture (#03594e) */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:12, paddingTop:8 }}>
                <Link
                  to="/register"
                  style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'14px 32px', borderRadius:14, fontWeight:800, fontSize:15, background:'#03594e', color:'#fff', textDecoration:'none', boxShadow:'0 6px 20px rgba(3,89,78,0.28)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background='#02473e'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='#03594e'; }}
                >
                  En savoir plus <ArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 30px', borderRadius:14, fontWeight:700, fontSize:15, background:'#fff', color:'#03594e', textDecoration:'none', border:'2px solid #b3e6df' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='#03594e'; e.currentTarget.style.background='#e6f5f3'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='#b3e6df'; e.currentTarget.style.background='#fff'; }}
                >
                  Espace Candidat
                </Link>
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.about-grid{grid-template-columns:1fr !important;}}`}</style>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURES — fond très légèrement vert avec shapes décoratives
          ══════════════════════════════════════════════════ */}
      <section
        id="outils"
        style={{
          background:'linear-gradient(180deg,#f0f9f8 0%,#fff 100%)',
          padding:'96px 24px',
          position:'relative',
          overflow:'hidden',
        }}
      >
        {/* Authentic Educeet Template Shapes */}
        <img src="assets/img/shape/course-1-2.png" alt="" style={{ position:'absolute', top:'8%', right:'5%', width:110, opacity:0.85, pointerEvents:'none', animation:'floatSlow 5s ease-in-out infinite' }} onError={e => e.target.style.display='none'} />
        <img src="assets/img/shape/categori-2-1.png" alt="" style={{ position:'absolute', top:'12%', left:'3%', width:120, opacity:0.6, pointerEvents:'none' }} onError={e => e.target.style.display='none'} />

        <img src="assets/img/shape/feature-5-1.png" alt="" style={{ position:'absolute', bottom:'12%', left:'4%', width:85, opacity:0.5, pointerEvents:'none' }} onError={e => e.target.style.display='none'} />

        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <span style={{ display:'inline-block', background:'#F8C62F', color:'#1B1D21', fontWeight:800, fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em', padding:'6px 18px', borderRadius:4, marginBottom:14 }}>
              🛠 Outillage Pédagogique
            </span>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:900, color:'#1B1D21', margin:'0 0 12px' }}>
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p style={{ color:'#64748b', fontSize:15, maxWidth:520, margin:'0 auto' }}>
              Des fonctionnalités pour maximiser votre mémoire et optimiser chaque minute.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }} className="feat-grid">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{ background:'#fff', borderRadius:16, padding:32, border:'1px solid #d4ede9', display:'flex', gap:24, transition:'all .3s', boxShadow:'0 2px 12px rgba(3,89,78,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(3,89,78,0.10)'; e.currentTarget.style.borderColor='transparent'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 2px 12px rgba(3,89,78,0.04)'; e.currentTarget.style.borderColor='#d4ede9'; }}
              >
                <div style={{ width:60, height:60, borderRadius:16, background:f.bgColor, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <f.icon size={28} color={f.color} />
                </div>
                <div>
                  <h3 style={{ fontWeight:800, fontSize:15, color:'#1B1D21', marginBottom:8, marginTop:0 }}>{f.title}</h3>
                  <p style={{ fontSize:13, color:'#64748b', lineHeight:1.65, margin:0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:640px){.feat-grid{grid-template-columns:1fr !important;}}`}</style>
      </section>

      {/* ══════════════════════════════════════════════════
          POINTS FORTS — Explication, Astuces & Assistant IA
          ══════════════════════════════════════════════════ */}
      <section id="points-forts" style={{ background:'#ffffff', padding:'100px 24px', position:'relative', overflow:'hidden' }}>
        {/* Background Texture */}
        <img src="assets/img/shape/gallary-bg-4-1.png" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.08, pointerEvents:'none' }} onError={e=>e.target.style.display='none'} />
        {/* Floating Shapes */}
        <img src="assets/img/shape/categori-2-1.png" alt="" style={{ position:'absolute', top:40, right:'5%', width:140, opacity:0.8, pointerEvents:'none', animation:'floatSlow 6s ease-in-out infinite' }} onError={e=>e.target.style.display='none'} />
        <img src="assets/img/shape/about-6-2.png" alt="" style={{ position:'absolute', top:50, left:'5%', width:120, opacity:0.75, pointerEvents:'none', animation:'floatSlow 5s ease-in-out infinite' }} onError={e=>e.target.style.display='none'} />
        <img src="assets/img/shape/feature-5-1.png" alt="" style={{ position:'absolute', bottom:60, right:'6%', width:110, opacity:0.8, pointerEvents:'none', animation:'floatReverse 7s ease-in-out infinite' }} onError={e=>e.target.style.display='none'} />


        <div style={{ maxWidth:1240, margin:'0 auto', position:'relative', zIndex:1 }}>

          {/* Section Header */}
          <div style={{ textAlign:'center', marginBottom:72 }}>
            <span style={{ display:'inline-block', background:'#F8C62F', color:'#1B1D21', fontWeight:800, fontSize:11, textTransform:'uppercase', letterSpacing:'0.08em', padding:'7px 20px', borderRadius:6, marginBottom:18 }}>
              🏆 Nos Points Forts
            </span>
            <h2 style={{ fontSize:'clamp(2rem,4.5vw,2.9rem)', fontWeight:900, color:'#0d1b1e', margin:'0 0 16px', lineHeight:1.2 }}>
              Une plateforme qui vous guide à{' '}
              <span style={{ color:'#03594e', borderBottom:'3px solid #F8C62F', paddingBottom:2 }}>chaque étape</span>
            </h2>
            <p style={{ fontSize:16, color:'#64748b', maxWidth:600, margin:'0 auto', lineHeight:1.7 }}>
              Pas d'examen raté sans comprendre pourquoi — notre IA explique, conseille et s'adapte à votre niveau en temps réel.
            </p>
          </div>

          {/* ─── BLOC 1 : Mauvaise réponse → Explication + Astuce ─── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center', marginBottom:100 }} className="pf-grid">
            {/* Left: Interactive QCM Demo */}
            <div style={{ position:'relative' }}>
              {/* Card Glow */}
              <div style={{ position:'absolute', inset:-3, borderRadius:30, background:'linear-gradient(135deg,#03594e30,#F8C62F30)', filter:'blur(16px)', zIndex:0 }} />
              <div style={{ position:'relative', zIndex:1, background:'#fff', borderRadius:24, boxShadow:'0 24px 64px rgba(3,89,78,0.12)', border:'1px solid #d4ede9', overflow:'hidden' }}>
                {/* Card header */}
                <div style={{ background:'linear-gradient(90deg,#03594e,#046a5d)', padding:'14px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background:'#ff5f57' }} />
                    <div style={{ width:10, height:10, borderRadius:'50%', background:'#febc2e' }} />
                    <div style={{ width:10, height:10, borderRadius:'50%', background:'#28c840' }} />
                  </div>
                  <span style={{ color:'rgba(255,255,255,0.85)', fontSize:11, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>Simulation QCM — Algorithmique</span>
                  <span style={{ background:'rgba(255,255,255,0.15)', color:'#fff', fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20 }}>Q14 / 50</span>
                </div>
                {/* Question */}
                <div style={{ padding:'22px 24px 16px' }}>
                  <p style={{ fontSize:13.5, fontWeight:700, color:'#0d1b1e', margin:'0 0 16px', lineHeight:1.5 }}>
                    Quelle est la complexité temporelle de l'algorithme de tri rapide (Quicksort) dans le <em>pire des cas</em> ?
                  </p>
                  {/* Options */}
                  {[
                    { l: 'A) O(n log n)', state: 'neutral' },
                    { l: 'B) O(n²)', state: 'correct' },
                    { l: 'C) O(log n)', state: 'wrong_selected' },
                    { l: 'D) O(n)', state: 'neutral' },
                  ].map(opt => (
                    <div key={opt.l} style={{
                      marginBottom:8, padding:'11px 16px', borderRadius:12, fontSize:13, fontWeight:600,
                      display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all .2s',
                      background: opt.state==='correct' ? '#f0fdf4' : opt.state==='wrong_selected' ? '#fef2f2' : '#f8fafc',
                      border: opt.state==='correct' ? '2px solid #22c55e' : opt.state==='wrong_selected' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                      color: opt.state==='correct' ? '#15803d' : opt.state==='wrong_selected' ? '#b91c1c' : '#475569',
                    }}>
                      <span>{opt.l}</span>
                      {opt.state==='correct' && <span style={{ fontSize:16 }}>✅</span>}
                      {opt.state==='wrong_selected' && <span style={{ fontSize:16 }}>❌</span>}
                    </div>
                  ))}
                </div>
                {/* Explanation box — shown after wrong answer */}
                <div style={{ margin:'0 16px 16px', borderRadius:16, background:'linear-gradient(135deg,#fffbeb,#fef3c7)', border:'2px solid #F8C62F', padding:'16px 18px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <span style={{ fontSize:18 }}>💡</span>
                    <span style={{ fontWeight:800, fontSize:13, color:'#92400e' }}>Explication automatique</span>
                  </div>
                  <p style={{ fontSize:12.5, color:'#78350f', margin:'0 0 10px', lineHeight:1.6 }}>
                    Vous avez sélectionné <strong>C) O(log n)</strong> — ce n'est pas la bonne réponse. Dans le <em>pire cas</em>, si le pivot est toujours le min ou max, Quicksort effectue <strong>n(n-1)/2</strong> comparaisons → <strong>O(n²)</strong>.
                  </p>
                  <div style={{ background:'rgba(3,89,78,0.1)', borderRadius:10, padding:'10px 14px', display:'flex', gap:8, alignItems:'flex-start' }}>
                    <span style={{ fontSize:15 }}>🎯</span>
                    <p style={{ fontSize:12, color:'#01352e', margin:0, lineHeight:1.6 }}>
                      <strong>Astuce Concours :</strong> Retenez le triangle — Meilleur = O(n log n), Moyen = O(n log n), Pire = <strong>O(n²)</strong>. Ce pattern revient dans 80% des épreuves de tri.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Text content */}
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'#e6f5f3', borderRadius:12, padding:'10px 18px', marginBottom:28 }}>
                <span style={{ fontSize:24 }}>🔍</span>
                <span style={{ fontWeight:800, fontSize:13, color:'#03594e', textTransform:'uppercase', letterSpacing:'0.05em' }}>Comprendre, pas mémoriser</span>
              </div>
              <h3 style={{ fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:900, color:'#0d1b1e', margin:'0 0 20px', lineHeight:1.3 }}>
                Chaque mauvaise réponse devient une leçon
              </h3>
              <p style={{ fontSize:15.5, color:'#475569', lineHeight:1.75, margin:'0 0 32px' }}>
                Notre plateforme ne se contente pas d'afficher « Faux » — elle vous explique <strong>pourquoi</strong> votre réponse est incorrecte, avec une explication pédagogique claire et une astuce mémorisable spécialement conçue pour les concours.
              </p>
              {/* Feature bullets */}
              {[
                { icon:'✅', title:'Correction immédiate', desc:'Dès que vous répondez, la bonne réponse apparaît avec l\'explication détaillée.' },
                { icon:'💡', title:'Astuce mémorisable', desc:'Une technique ou un moyen mnémotechnique pour ne plus faire la même erreur.' },
                { icon:'📊', title:'Statistiques par thème', desc:'Vos erreurs sont analysées pour cibler vos zones de faiblesse.' },
              ].map(f => (
                <div key={f.title} style={{ display:'flex', gap:14, marginBottom:18, alignItems:'flex-start' }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:'linear-gradient(135deg,#e6f5f3,#b3e6df)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:14, color:'#0d1b1e', marginBottom:3 }}>{f.title}</div>
                    <div style={{ fontSize:13, color:'#64748b', lineHeight:1.6 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Diviseur centré ─── */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20, margin:'0 auto 100px', maxWidth:700 }}>
            <div style={{ flex:1, height:1, background:'linear-gradient(90deg, transparent, #d4ede9)' }} />
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'#e6f5f3', border:'2px solid #b3e6df', borderRadius:50, padding:'10px 24px', flexShrink:0 }}>
              <span style={{ fontSize:20 }}>🤖</span>
              <span style={{ fontWeight:800, fontSize:13, color:'#03594e', whiteSpace:'nowrap' }}>Rencontrez votre Assistant IA</span>
            </div>
            <div style={{ flex:1, height:1, background:'linear-gradient(90deg, #d4ede9, transparent)' }} />
          </div>

          {/* ─── BLOC 2 : Assistant IA toujours disponible ─── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:56, alignItems:'center' }} className="pf-grid">
            {/* Left: Text content */}
            <div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'linear-gradient(135deg,#03594e,#046a5d)', borderRadius:12, padding:'10px 18px', marginBottom:28 }}>
                <span style={{ fontSize:22 }}>🤖</span>
                <span style={{ fontWeight:800, fontSize:13, color:'#fff', textTransform:'uppercase', letterSpacing:'0.05em' }}>Assistant IA — Toujours disponible</span>
              </div>
              <h3 style={{ fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:900, color:'#0d1b1e', margin:'0 0 20px', lineHeight:1.3 }}>
                Un tuteur intelligent disponible <span style={{ color:'#03594e' }}>24h/24</span>
              </h3>
              <p style={{ fontSize:15.5, color:'#475569', lineHeight:1.75, margin:'0 0 32px' }}>
                Posez n'importe quelle question sur n'importe quel module — l'assistant IA vous répond avec précision, vous génère des exercices ciblés et adapte sa pédagogie à votre niveau.
              </p>
              {/* Module pills */}
              <div style={{ marginBottom:28 }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:14 }}>
                  Exemples de modules couverts :
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                  {[
                    { icon:'🧮', label:'Algorithmique', color:'#03594e', bg:'#e6f5f3', border:'#b3e6df' },
                    { icon:'🗄️', label:'PostgreSQL / SQL', color:'#046a5d', bg:'#e0f2f1', border:'#80cbc4' },
                    { icon:'🤖', label:'Machine Learning', color:'#1e40af', bg:'#eff6ff', border:'#bfdbfe' },
                    { icon:'☁️', label:'Cloud & DevOps', color:'#6d28d9', bg:'#f5f3ff', border:'#ddd6fe' },
                    { icon:'📊', label:'Analyse de données', color:'#d97706', bg:'#fef3c7', border:'#fde68a' },
                    { icon:'🔒', label:'Cybersécurité', color:'#dc2626', bg:'#fef2f2', border:'#fecaca' },
                  ].map(m => (
                    <span key={m.label} style={{ display:'inline-flex', alignItems:'center', gap:6, background:m.bg, color:m.color, border:`1px solid ${m.border}`, borderRadius:20, padding:'7px 14px', fontSize:12, fontWeight:700 }}>
                      {m.icon} {m.label}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }} className="pf-stats-row">
                <div style={{ flex:1, minWidth:120, background:'linear-gradient(135deg,#e6f5f3,#b3e6df)', borderRadius:14, padding:'16px 18px', textAlign:'center' }}>
                  <div style={{ fontSize:24, fontWeight:900, color:'#03594e' }}>+2 500</div>
                  <div style={{ fontSize:12, color:'#475569', fontWeight:600 }}>Questions générées / jour</div>
                </div>
                <div style={{ flex:1, minWidth:120, background:'linear-gradient(135deg,#fffbeb,#fde68a)', borderRadius:14, padding:'16px 18px', textAlign:'center' }}>
                  <div style={{ fontSize:24, fontWeight:900, color:'#d97706' }}>24/7</div>
                  <div style={{ fontSize:12, color:'#475569', fontWeight:600 }}>Disponibilité totale</div>
                </div>
                <div style={{ flex:1, minWidth:120, background:'linear-gradient(135deg,#eff6ff,#bfdbfe)', borderRadius:14, padding:'16px 18px', textAlign:'center' }}>
                  <div style={{ fontSize:24, fontWeight:900, color:'#1e40af' }}>6</div>
                  <div style={{ fontSize:12, color:'#475569', fontWeight:600 }}>Modules spécialisés</div>
                </div>
              </div>
            </div>

            {/* Right: AI Chat Demo */}
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', inset:-3, borderRadius:30, background:'linear-gradient(135deg,#03594e25,#1e40af20)', filter:'blur(18px)', zIndex:0 }} />
              <div style={{ position:'relative', zIndex:1, background:'#0d1b1e', borderRadius:24, boxShadow:'0 24px 64px rgba(0,0,0,0.2)', border:'1px solid #1e3a3a', overflow:'hidden' }}>
                {/* Chat header */}
                <div style={{ background:'linear-gradient(90deg,#03594e,#046a5d)', padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🤖</div>
                  <div>
                    <div style={{ color:'#fff', fontWeight:800, fontSize:13 }}>Assistant IA — Info-Réussit</div>
                    <div style={{ color:'rgba(255,255,255,0.6)', fontSize:11, display:'flex', alignItems:'center', gap:5 }}>
                      <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', display:'inline-block' }} /> En ligne
                    </div>
                  </div>
                </div>
                {/* Chat messages */}
                <div style={{ padding:'20px 18px', display:'flex', flexDirection:'column', gap:14 }}>
                  {/* User message */}
                  <div style={{ display:'flex', justifyContent:'flex-end' }}>
                    <div style={{ background:'#1e3a3a', color:'#e2e8f0', borderRadius:'16px 16px 4px 16px', padding:'11px 16px', maxWidth:'80%', fontSize:13, lineHeight:1.5 }}>
                      Je ne comprends pas la différence entre <strong style={{ color:'#F8C62F' }}>JOIN</strong> et <strong style={{ color:'#F8C62F' }}>LEFT JOIN</strong> en SQL 🤔
                    </div>
                  </div>
                  {/* AI response */}
                  <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                    <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#03594e,#046a5d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>🤖</div>
                    <div style={{ background:'#162424', border:'1px solid #1e3a3a', color:'#e2e8f0', borderRadius:'4px 16px 16px 16px', padding:'12px 16px', maxWidth:'85%', fontSize:12.5, lineHeight:1.65 }}>
                      Excellente question ! Voici la différence :<br/><br/>
                      <span style={{ color:'#4ade80', fontWeight:700 }}>INNER JOIN</span> → retourne uniquement les lignes <em>correspondantes</em> des deux tables.<br/>
                      <span style={{ color:'#60a5fa', fontWeight:700 }}>LEFT JOIN</span> → retourne <em>toutes</em> les lignes de la table gauche, même sans correspondance (NULL à droite).<br/><br/>
                      <span style={{ color:'#F8C62F', fontSize:11, fontWeight:700 }}>💡 ASTUCE CONCOURS :</span><br/>
                      <span style={{ color:'#fbbf24', fontSize:11 }}>Imaginez: INNER = intersection, LEFT = tout + reste NULL</span>
                    </div>
                  </div>
                  {/* User follow-up */}
                  <div style={{ display:'flex', justifyContent:'flex-end' }}>
                    <div style={{ background:'#1e3a3a', color:'#e2e8f0', borderRadius:'16px 16px 4px 16px', padding:'11px 16px', maxWidth:'80%', fontSize:13, lineHeight:1.5 }}>
                      Génère-moi 3 exercices sur ce concept ✨
                    </div>
                  </div>
                  {/* AI generating */}
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#03594e,#046a5d)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>🤖</div>
                    <div style={{ background:'#162424', border:'1px solid #1e3a3a', borderRadius:'4px 16px 16px 16px', padding:'12px 16px', display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block', animation:'floatSlow 1s ease-in-out infinite' }} />
                      <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block', animation:'floatSlow 1s ease-in-out infinite 0.2s' }} />
                      <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block', animation:'floatSlow 1s ease-in-out infinite 0.4s' }} />
                      <span style={{ color:'#94a3b8', fontSize:12, marginLeft:4 }}>Génération en cours...</span>
                    </div>
                  </div>
                </div>
                {/* Input */}
                <div style={{ padding:'12px 16px', borderTop:'1px solid #1e3a3a', display:'flex', gap:10, alignItems:'center' }}>
                  <input readOnly placeholder="Posez votre question à l'IA..." style={{ flex:1, background:'#162424', border:'1px solid #1e3a3a', borderRadius:12, padding:'10px 14px', color:'#94a3b8', fontSize:12.5, outline:'none' }} />
                  <button style={{ background:'linear-gradient(135deg,#03594e,#046a5d)', border:'none', borderRadius:10, width:38, height:38, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16 }}>→</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS — fond vert très clair (#e6f5f3) avec shapes du template
          ══════════════════════════════════════════════════ */}
      <section
        id="temoignages"
        style={{
          background: 'linear-gradient(135deg,#e6f5f3 0%,#f0f9f8 100%)',
          padding: '96px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Authentic Educeet Testimonial Shapes */}
        <img src="assets/img/shape/testimonial-1-1.png" alt="" style={{ position:'absolute', top:'8%', right:'4%', width:140, opacity:0.85, pointerEvents:'none', animation:'floatSlow 5s ease-in-out infinite' }} onError={e=>e.target.style.display='none'} />
        <img src="assets/img/shape/testimonial-1-2.png" alt="" style={{ position:'absolute', top:'10%', left:'3%', width:110, opacity:0.7, pointerEvents:'none' }} onError={e=>e.target.style.display='none'} />
        <img src="assets/img/shape/testimonial-1-3.png" alt="" style={{ position:'absolute', bottom:'8%', right:'3%', width:105, opacity:0.75, pointerEvents:'none', animation:'floatReverse 6s ease-in-out infinite' }} onError={e=>e.target.style.display='none'} />
        <img src="assets/img/shape/testimonial-5-1.png" alt="" style={{ position:'absolute', bottom:'10%', left:'4%', width:95, opacity:0.6, pointerEvents:'none' }} onError={e=>e.target.style.display='none'} />

        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <span style={{ display:'inline-block', background:'#F8C62F', color:'#1B1D21', fontWeight:800, fontSize:11, textTransform:'uppercase', letterSpacing:'0.06em', padding:'6px 18px', borderRadius:4, marginBottom:14 }}>
              ⭐ Témoignages
            </span>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:900, color:'#1B1D21', margin:'0 0 12px' }}>
              Ce que disent nos candidats
            </h2>
            <p style={{ color:'#64748b', fontSize:15, margin:0 }}>
              Des centaines de candidats ont réussi leurs concours grâce à Inforéussit.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }} className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                style={{
                  background:'#fff', borderRadius:20, padding:28,
                  border: i===activeTesti ? '2px solid #03594e' : '1px solid #d4ede9',
                  boxShadow: i===activeTesti ? '0 12px 40px rgba(3,89,78,0.14)' : '0 2px 12px rgba(3,89,78,0.04)',
                  transform: i===activeTesti ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all .4s',
                }}
              >
                <div style={{ display:'flex', gap:3, marginBottom:14 }}>
                  {[...Array(t.stars)].map((_,j) => <Star key={j} size={15} fill="#F8C62F" color="#F8C62F" />)}
                </div>
                <p style={{ fontSize:14, color:'#374151', lineHeight:1.7, marginBottom:20, fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <img
                    src={t.img}
                    alt={t.name}
                    style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', border:'2px solid #b3e6df' }}
                    onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                  />
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'#03594e', display:'none', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ color:'#fff', fontWeight:800, fontSize:16 }}>{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight:800, fontSize:14, color:'#1B1D21' }}>{t.name}</div>
                    <div style={{ fontSize:12, color:'#94a3b8' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:32 }}>
            {TESTIMONIALS.map((_,i) => (
              <button key={i} onClick={()=>setActiveTesti(i)} style={{ borderRadius:10, border:'none', cursor:'pointer', padding:0, transition:'all .2s', width:i===activeTesti?24:10, height:10, background:i===activeTesti?'#03594e':'#b3e6df' }} />
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){.testi-grid{grid-template-columns:1fr !important;}}`}</style>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA — Style Officiel Template Educeet (CtaFive)
          ══════════════════════════════════════════════════ */}
      <section style={{ background:'#fff', padding:'96px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div
            className="cta-box"
            style={{
              borderRadius:28,
              padding:'64px 56px',
              position:'relative',
              overflow:'hidden',
              background:'linear-gradient(135deg,#03594e 0%,#046a5d 60%,#023d33 100%)',
              boxShadow:'0 20px 50px rgba(3,89,78,0.22)',
            }}
          >
            {/* Top golden border accent */}
            <div style={{ position:'absolute', top:0, left:0, width:'100%', height:4, background:'linear-gradient(90deg,#F8C62F,#F5821F)' }} />

            {/* Authentic Educeet CTA Template Shapes */}
            <img src="assets/img/shape/newsletter-5-1.png" alt="" style={{ position:'absolute', top:-10, right:-10, width:260, opacity:0.35, pointerEvents:'none', animation:'floatSlow 6s ease-in-out infinite' }} onError={e => e.target.style.display='none'} />
            <img src="assets/img/shape/cta-6-1.png" alt="" style={{ position:'absolute', top:'20%', left:'30%', width:140, opacity:0.15, pointerEvents:'none' }} onError={e => e.target.style.display='none'} />

            <div style={{ display:'grid', gridTemplateColumns:'1.2fr 0.8fr', gap:40, alignItems:'center', position:'relative', zIndex:1 }} className="cta-grid">
              {/* Content Left */}
              <div style={{ display:'flex', flexDirection:'column', gap:20, alignItems:'flex-start' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 18px', borderRadius:50, background:'rgba(248,198,47,0.20)', border:'1px solid rgba(248,198,47,0.35)', color:'#F8C62F', fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                  <Sparkles size={13} /> Accès Immédiat
                </span>
                <h2 style={{ fontSize:'clamp(2rem,4vw,2.8rem)', fontWeight:900, color:'#fff', margin:0, lineHeight:1.2 }}>
                  Prêt à maximiser vos chances de réussite ?
                </h2>
                <p style={{ color:'rgba(255,255,255,0.9)', fontSize:16, lineHeight:1.65, margin:0, maxWidth:540 }}>
                  Rejoignez la plateforme nationale de préparation aux concours d'informatique. Inscription rapide en moins de 2 minutes.
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:14, paddingTop:8 }}>
                  <Link
                    to="/register"
                    style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'16px 36px', borderRadius:14, fontWeight:800, fontSize:15, background:'#F8C62F', color:'#1B1D21', textDecoration:'none', boxShadow:'0 8px 24px rgba(248,198,47,0.40)', transition:'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background='#fbbf24'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='#F8C62F'; }}
                  >
                    Commencer ma préparation <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/login"
                    style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'16px 34px', borderRadius:14, fontWeight:700, fontSize:15, background:'rgba(255,255,255,0.12)', color:'#fff', textDecoration:'none', border:'2px solid rgba(255,255,255,0.3)', transition:'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.20)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; }}
                  >
                    Espace Candidat <ChevronRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Right Illustration from Educeet CtaFive */}
              <div style={{ display:'flex', justifyContent:'center', position:'relative' }} className="cta-thumb-wrapper">
                <img
                  src="assets/img/cta/cta-5-1.png"
                  alt="Réussite aux concours"
                  style={{ maxHeight:320, width:'auto', objectFit:'contain', filter:'drop-shadow(0 15px 30px rgba(0,0,0,0.25))' }}
                  onError={e => { e.target.src='assets/img/cta/cta-6-1.png'; e.target.onerror=null; }}
                />
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:900px){.cta-grid{grid-template-columns:1fr !important; text-align:center;} .cta-grid > div{align-items:center !important;} .cta-thumb-wrapper{margin-top:20px;}}`}</style>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER — Style Officiel Educeet Identique à la capture
          ══════════════════════════════════════════════════ */}
      <footer style={{ background:'linear-gradient(180deg,#e8f7f5 0%,#e1f4f1 100%)', position:'relative', overflow:'hidden', borderTop:'1px solid #ccece7' }}>
        {/* Background Texture & Decorative Shapes from Educeet */}
        <img src="assets/img/shape/footer-bg-6.png" alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.12, pointerEvents:'none' }} onError={e=>e.target.style.display='none'} />
        {/* Left Side Shape in Red Circle area */}
        <img src="assets/img/shape/course-1-2.png" alt="" style={{ position:'absolute', top:'25%', left:'2.5%', width:130, opacity:0.85, pointerEvents:'none', animation:'floatSlow 6s ease-in-out infinite' }} onError={e=>e.target.style.display='none'} />
        {/* Top Right Shape */}
        <img src="assets/img/shape/brand-2-1.png" alt="" style={{ position:'absolute', top:35, right:'6%', width:130, opacity:0.8, pointerEvents:'none', animation:'floatReverse 6s ease-in-out infinite' }} onError={e=>e.target.style.display='none'} />

        {/* Main Footer Container */}
        <div style={{ maxWidth:1260, margin:'0 auto', padding:'96px 24px 72px', position:'relative', zIndex:1 }}>
          <div
            style={{
              display:'grid',
              gridTemplateColumns:'1.3fr 1fr 1fr 1.1fr',
              gap:0,
              alignItems:'stretch',
            }}
            className="footer-columns-grid"
          >
            {/* Column 1: Brand & Nous Contacter button */}
            <div style={{ paddingRight:40, paddingBottom:24, borderRight:'1px solid rgba(3,89,78,0.14)', display:'flex', flexDirection:'column', gap:22 }} className="footer-col border-col">
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <img src="/logo.png" alt="Inforéussit" style={{ height:160, width:'auto', objectFit:'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }} />
                <div style={{ display:'none', alignItems:'center', gap:10 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:'#03594e', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <GraduationCap size={22} color="#fff" />
                  </div>
                  <span style={{ fontWeight:900, fontSize:24, color:'#1B1D21' }}>Inforéussit</span>
                </div>
              </div>
              <p style={{ color:'#475569', fontSize:15, lineHeight:1.75, margin:0, maxWidth:300 }}>
                Accédez aux cours et annales corrigées rédigés par des enseignants pour réussir votre carrière et vos concours.
              </p>
              <div style={{ paddingTop:4 }}>
                <Link
                  to="/register"
                  style={{
                    display:'inline-flex', alignItems:'center', gap:10,
                    padding:'14px 32px', borderRadius:14, fontWeight:700, fontSize:15,
                    background:'#03594e', color:'#fff', textDecoration:'none',
                    boxShadow:'0 8px 24px rgba(3,89,78,0.25)', transition:'all .25s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background='#02473e'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='#03594e'; }}
                >
                  Nous Contacter <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Column 2: Liens Utiles */}
            <div style={{ paddingLeft:40, paddingRight:40, paddingBottom:24, borderRight:'1px solid rgba(3,89,78,0.14)', display:'flex', flexDirection:'column', gap:22 }} className="footer-col border-col">
              <h4 style={{ fontWeight:800, fontSize:20, color:'#1B1D21', margin:0, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>Liens Utiles</h4>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:14 }}>
                {[
                  { label:'Fiches de cours', to:'/register' },
                  { label:'QCM & Annales', to:'/register' },
                  { label:'Examens Blancs', to:'/register' },
                  { label:'Filières IT & IA', href:'#concours' },
                  { label:'Tuteur IA Intelligent', href:'#outils' }
                ].map(l => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link to={l.to} style={{ fontSize:15, color:'#64748b', textDecoration:'none', transition:'color .2s', fontWeight:500 }} onMouseEnter={e=>e.currentTarget.style.color='#03594e'} onMouseLeave={e=>e.currentTarget.style.color='#64748b'}>{l.label}</Link>
                    ) : (
                      <a href={l.href} style={{ fontSize:15, color:'#64748b', textDecoration:'none', transition:'color .2s', fontWeight:500 }} onMouseEnter={e=>e.currentTarget.style.color='#03594e'} onMouseLeave={e=>e.currentTarget.style.color='#64748b'}>{l.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Nos Concours */}
            <div style={{ paddingLeft:40, paddingRight:40, paddingBottom:24, borderRight:'1px solid rgba(3,89,78,0.14)', display:'flex', flexDirection:'column', gap:22 }} className="footer-col border-col">
              <h4 style={{ fontWeight:800, fontSize:20, color:'#1B1D21', margin:0, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>Nos Concours</h4>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:14 }}>
                {[
                  'CRMEF Enseignement',
                  'Ingénieur d\'État IT',
                  'Technicien Data & IA',
                  'Cloud & DevOps',
                  'Administrateur DBA'
                ].map(item => (
                  <li key={item}>
                    <span style={{ fontSize:15, color:'#64748b', cursor:'pointer', transition:'color .2s', fontWeight:500 }} onMouseEnter={e=>e.currentTarget.style.color='#03594e'} onMouseLeave={e=>e.currentTarget.style.color='#64748b'}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact & Réseaux Sociaux */}
            <div style={{ paddingLeft:40, paddingBottom:24, position:'relative', display:'flex', flexDirection:'column', gap:22, zIndex:1 }} className="footer-col">
              <h4 style={{ fontWeight:800, fontSize:20, color:'#1B1D21', margin:0, fontFamily:"'Plus Jakarta Sans', sans-serif" }}>Contact</h4>
              <div style={{ display:'flex', flexDirection:'column', gap:14, fontSize:15, color:'#64748b' }}>
                <div><span style={{ fontWeight:700, color:'#1B1D21' }}>Téléphone :</span> <a href="tel:+212702555943" style={{ color:'#64748b', textDecoration:'none' }}>+212 702 555 943</a></div>
                <div><span style={{ fontWeight:700, color:'#1B1D21' }}>E-mail :</span> <a href="mailto:contact@inforeussite.online" style={{ color:'#64748b', textDecoration:'none' }}>contact@inforeussite.online</a></div>
                <div><span style={{ fontWeight:700, color:'#1B1D21' }}>Adresse :</span> Casablanca, Maroc</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Scroll to Top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position:'fixed',
            bottom:28,
            right:28,
            width:50,
            height:50,
            borderRadius:'50%',
            background:'#03594e',
            color:'#fff',
            border:'2px solid rgba(255,255,255,0.85)',
            cursor:'pointer',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            boxShadow:'0 8px 25px rgba(3,89,78,0.45)',
            zIndex:999,
            transition:'all .25s ease-in-out'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform='scale(1.12)'; e.currentTarget.style.background='#02473e'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.background='#03594e'; }}
          title="Retour en haut de page"
        >
          <ChevronUp size={24} color="#fff" />
        </button>

        {/* Dual-Color Copyright Bar with centered 50/50 diagonal divider */}
        <div style={{ display:'flex', width:'100%', minHeight:54, background:'#03594e', borderTop:'1px solid rgba(3,89,78,0.2)', margin:0, padding:0, position:'relative', zIndex:2 }} className="footer-copyright-bar">
          {/* Left Yellow Part (#F8C62F) - 50% width */}
          <div
            style={{
              background:'#F8C62F',
              color:'#1B1D21',
              padding:'14px 40px',
              fontWeight:700,
              fontSize:14,
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              flex:'1 1 50%',
              clipPath:'polygon(0 0, 100% 0, 91% 100%, 0 100%)',
              paddingRight:60,
              position:'relative',
              zIndex:2,
            }}
            className="copyright-yellow"
          >
            Copyright © 2026 Inforéussit (inforeussite.online). Tous droits réservés.
          </div>

          {/* Right Dark Green Part (#03594e) - 50% width */}
          <div
            style={{
              background:'#03594e',
              color:'#fff',
              padding:'14px 40px',
              fontSize:14,
              fontWeight:600,
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              gap:20,
              flex:'1 1 50%',
              marginLeft:-40,
              position:'relative',
              zIndex:1,
            }}
            className="copyright-green"
          >
            <a href="#" style={{ color:'#fff', textDecoration:'none', opacity:0.95 }} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.95}>Conditions d'utilisation</a>
            <span style={{ opacity:0.5 }}>-</span>
            <a href="#" style={{ color:'#fff', textDecoration:'none', opacity:0.95 }} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.95}>Politique de confidentialité</a>
            <span style={{ opacity:0.5 }}>-</span>
            <Link to="/login" style={{ color:'#F8C62F', textDecoration:'none', fontWeight:700 }}>Connexion & Inscription</Link>
          </div>
        </div>

        <style>{`
          @media(max-width:960px){
            .pf-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          }
          @media(max-width:900px){
            .footer-columns-grid { grid-template-columns: 1fr 1fr !important; }
            .border-col { border-right: none !important; border-bottom: 1px solid rgba(3,89,78,0.12) !important; padding-left: 0 !important; padding-right: 0 !important; }
            .footer-col { padding-left: 0 !important; padding-right: 0 !important; }
            .footer-copyright-bar { flex-direction: column !important; }
            .copyright-yellow { clip-path: none !important; width: 100% !important; justify-content: center !important; }
            .copyright-green { margin-left: 0 !important; width: 100% !important; justify-content: center !important; flex-wrap: wrap !important; }
          }
          @media(max-width:640px){
            .footer-columns-grid { grid-template-columns: 1fr !important; }
            .cta-box { padding: 32px 18px !important; border-radius: 20px !important; }
            .about-overlay-thumb { display: none !important; }
            .about-overlay-badge { left: 10px !important; right: 10px !important; bottom: 10px !important; padding: 10px 12px !important; }
            .pf-stats-row { flex-direction: column !important; }
          }
        `}</style>
      </footer>

    </div>
  );
}
