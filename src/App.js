import { useState } from "react";
import "./styles/global.css";

// ── Daten & Utilities ──────────────────────────────────────────────────────
import { G } from "./utils/helpers";
import { INIT_RE, INIT_PRODUKTE, INIT_MA } from "./data/staticData";

// ── Komponenten ────────────────────────────────────────────────────────────
import Login          from "./components/Login";
import Logo           from "./components/Logo";
import Dashboard      from "./components/Dashboard";
import Rechnungen     from "./components/Rechnungen";
import Produkte       from "./components/Produkte";
import ScanImport     from "./components/ScanImport";
import BelegArchiv    from "./components/BelegArchiv";
import Banking        from "./components/Banking";
import Steuern        from "./components/Steuern";
import Pruefung       from "./components/Pruefung";
import Personal       from "./components/Personal";
import KiAssistent    from "./components/KiAssistent";
import Einstellungen  from "./components/Einstellungen";

// ── Navigation ─────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard",  label:"Dashboard",         icon:"⊞" },
  { id:"rechnungen", label:"Rechnungen",         icon:"📄" },
  { id:"produkte",   label:"Produkte",           icon:"📦" },
  { id:"scan",       label:"Scan / Import",      icon:"⊙" },
  { id:"belege",     label:"Beleg-Archiv",        icon:"📂" },
  { id:"banking",    label:"Banking",            icon:"⊟" },
  { id:"steuer",     label:"Steuern & Elster",   icon:"↑" },
  { id:"pruefung",   label:"Prüfungsassistent",  icon:"🔍" },
  { id:"personal",   label:"Personal",           icon:"👥", ultimate:true },
  { id:"assistent",  label:"KI-Assistent",       icon:"✦", ki:true },
];

export default function App() {
  // ── Auth ──
  const [loggedIn, setLoggedIn] = useState(false);

  // ── Navigation ──
  const [tab, setTab] = useState("dashboard");

  // ── Globale Daten ──
  const [periode,   setPeriode]   = useState("2025-Q1");
  const [uf,        setUf]        = useState("einzelunternehmen"); // einzelunternehmen | gmbh | kleinunternehmer
  const [plan,      setPlan]      = useState("free");              // free | pro | ultimate
  const [rechnungen, setRechnungen] = useState(INIT_RE);
  const [produkte,   setProdukte]   = useState(INIT_PRODUKTE);
  const [mitarbeiter,setMitarbeiter]= useState(INIT_MA);
  const [elsterFile, setElsterFile] = useState(null);

  // ── Berechnete Flags ──
  const isKU  = uf === "kleinunternehmer";
  const isPro = plan === "pro" || plan === "ultimate";
  const isUlt = plan === "ultimate";

  // ── Login-Screen ──
  if(!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <div style={{fontFamily:"'Inter',sans-serif",background:"#08080f",minHeight:"100vh",display:"flex",color:"#e0e0f0"}}>

      {/* ════════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════════ */}
      <div style={{width:222,background:"#0b0b18",borderRight:"1px solid rgba(255,255,255,.05)",display:"flex",flexDirection:"column",padding:"18px 0 0",flexShrink:0}}>

        {/* Logo */}
        <div style={{padding:"0 16px 18px"}}>
          <Logo/>
          <div style={{fontSize:9,color:G,fontFamily:"'DM Mono',monospace",marginTop:3,letterSpacing:1}}>BETA</div>
        </div>

        {/* Navigation */}
        <nav style={{flex:1,padding:"0 9px",display:"flex",flexDirection:"column",gap:1,overflowY:"auto"}}>
          {NAV.map(it => {
            const locked = it.ultimate && !isUlt;
            const active = tab === it.id;
            return (
              <button key={it.id}
                className={`nb${active?" on":""}`}
                onClick={() => locked
                  ? alert("Personal ist nur im Ultimate-Plan verfügbar. In Einstellungen upgraden!")
                  : setTab(it.id)
                }
                style={{
                  display:"flex", alignItems:"center", gap:8,
                  padding:"7px 10px", borderRadius:7,
                  color: active ? G : locked ? "#3a3a4a" : "#777",
                  fontSize:12, fontWeight: active ? 600 : 400,
                  textAlign:"left",
                  borderLeft: active ? `2px solid ${G}` : "2px solid transparent",
                  width:"100%", cursor: locked ? "not-allowed" : "pointer",
                }}>
                <span style={{fontSize:12}}>{it.icon}</span>
                <span style={{flex:1}}>{it.label}</span>
                {it.ki && <span style={{fontSize:9,background:"rgba(34,211,166,.15)",color:G,padding:"2px 5px",borderRadius:4,fontWeight:700}}>KI</span>}
                {locked && <span className="ultbadge">ULT</span>}
              </button>
            );
          })}
        </nav>

        {/* Unternehmensform-Umschalter */}
        <div style={{padding:"10px 13px 0",borderTop:"1px solid rgba(255,255,255,.05)"}}>
          <div style={{fontSize:9,color:"#444",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Unternehmensform</div>
          <div style={{display:"flex",flexDirection:"column",gap:2,background:"#0f0f1e",borderRadius:7,padding:3}}>
            {[
              {v:"einzelunternehmen", l:"§18/§15 Einzel."},
              {v:"gmbh",             l:"GmbH / UG"},
              {v:"kleinunternehmer", l:"§19 Kleinuntern."},
            ].map(u=>(
              <button key={u.v} className={`sb${uf===u.v?" on":""}`}
                onClick={()=>setUf(u.v)}
                style={{textAlign:"left",padding:"4px 8px"}}>
                {u.l}
              </button>
            ))}
          </div>
          {isKU && <div style={{marginTop:4,fontSize:9,color:"#facc15"}}>§19: keine MwSt auf Rechnungen</div>}
        </div>

        {/* Plan-Badge + Einstellungen */}
        <div style={{padding:"10px 13px 14px",borderTop:"1px solid rgba(255,255,255,.05)",marginTop:8}}>
          <div style={{
            display:"flex",alignItems:"center",justifyContent:"space-between",
            marginBottom:7,padding:"6px 9px",borderRadius:8,
            background: isUlt?"rgba(245,158,11,.08)":isPro?"rgba(34,211,166,.07)":"rgba(255,255,255,.03)",
            border:`1px solid ${isUlt?"rgba(245,158,11,.25)":isPro?"rgba(34,211,166,.2)":"rgba(255,255,255,.07)"}`
          }}>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:isUlt?"#f59e0b":isPro?G:"#aaa"}}>
                {isUlt?"🏆 Ultimate":isPro?"✦ Pro Plan":"Free Plan"}
              </div>
              <div style={{fontSize:9,color:"#555"}}>{isUlt?"Alle Features":isPro?"Pro aktiv":"Upgrade verfügbar"}</div>
            </div>
            {!isUlt && <button className="bp" style={{padding:"3px 8px",fontSize:9}} onClick={()=>setTab("einstellungen")}>↑</button>}
          </div>
          <button
            className={`nb${tab==="einstellungen"?" on":""}`}
            onClick={()=>setTab("einstellungen")}
            style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:7,color:tab==="einstellungen"?G:"#666",fontSize:12,width:"100%",textAlign:"left",borderLeft:tab==="einstellungen"?`2px solid ${G}`:"2px solid transparent"}}>
            <span>⚙</span><span>Einstellungen</span>
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          MAIN CONTENT
          Hier wird je nach Tab die richtige Komponente geladen
      ════════════════════════════════════════════ */}
      <div style={{flex:1,overflow:"auto",padding:22}}>

        {tab==="dashboard"  && <Dashboard    rechnungen={rechnungen} periode={periode} setPeriode={setPeriode} uf={uf} isKU={isKU} setTab={setTab} />}
        {tab==="rechnungen" && <Rechnungen   rechnungen={rechnungen} setRechnungen={setRechnungen} produkte={produkte} isKU={isKU} setTab={setTab} />}
        {tab==="produkte"   && <Produkte     produkte={produkte} setProdukte={setProdukte} />}
        {tab==="scan"       && <ScanImport   />}
        {tab==="belege"     && <BelegArchiv  periode={periode} setPeriode={setPeriode} />}
        {tab==="banking"    && <Banking      />}
        {tab==="steuer"     && <Steuern      periode={periode} uf={uf} isKU={isKU} elsterFile={elsterFile} />}
        {tab==="pruefung"   && <Pruefung     />}
        {tab==="personal"   && isUlt && <Personal mitarbeiter={mitarbeiter} setMitarbeiter={setMitarbeiter} />}
        {tab==="assistent"  && <KiAssistent  rechnungen={rechnungen} setRechnungen={setRechnungen} setTab={setTab} uf={uf} isKU={isKU} periode={periode} />}
        {tab==="einstellungen" && <Einstellungen plan={plan} setPlan={setPlan} elsterFile={elsterFile} setElsterFile={setElsterFile} onLogout={()=>setLoggedIn(false)} />}

      </div>
    </div>
  );
}
