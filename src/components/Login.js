import { useState } from "react";
import Logo from "./Logo";

const G = "#22D3A6";
const ERR_C = "#f87171";
const OK_C  = G;

// ─── Rechtsformen ──────────────────────────────────────────────────────────
const RECHTSFORMEN = [
  { gruppe:"Einzelunternehmen / Freiberufler", formen:[
    { v:"einzelunternehmen", l:"Einzelunternehmen (§15 EStG – Gewerbetreibender)" },
    { v:"freiberufler",      l:"Freiberufler (§18 EStG – Arzt, Anwalt, Designer...)" },
    { v:"kleinunternehmer",  l:"Kleinunternehmer (§19 UStG – Umsatz unter 25.000 €)" },
  ]},
  { gruppe:"Personengesellschaften", formen:[
    { v:"gbr",   l:"GbR – Gesellschaft bürgerlichen Rechts" },
    { v:"ohg",   l:"OHG – Offene Handelsgesellschaft" },
    { v:"kg",    l:"KG – Kommanditgesellschaft" },
    { v:"partg", l:"PartG – Partnerschaftsgesellschaft" },
  ]},
  { gruppe:"Kapitalgesellschaften", formen:[
    { v:"gmbh",       l:"GmbH – Gesellschaft mit beschränkter Haftung" },
    { v:"ug",         l:"UG (haftungsbeschränkt) – Mini-GmbH" },
    { v:"ag",         l:"AG – Aktiengesellschaft" },
    { v:"gmbh_co_kg", l:"GmbH & Co. KG" },
  ]},
  { gruppe:"Sonstiges", formen:[
    { v:"ev",      l:"e.V. – Eingetragener Verein" },
    { v:"eg",      l:"eG – Eingetragene Genossenschaft" },
    { v:"stiftung",l:"Stiftung" },
    { v:"sonstig", l:"Sonstige Rechtsform" },
  ]},
];

const BRANCHEN = [
  "IT & Software","Beratung & Consulting","Marketing & Design","Recht & Steuer",
  "Gesundheit & Medizin","Architektur & Ingenieurwesen","Handel & E-Commerce",
  "Gastronomie & Hotellerie","Handwerk & Bau","Transport & Logistik",
  "Bildung & Coaching","Finanzen & Versicherung","Immobilien","Sonstige",
];

const STEPS = [
  { id:1, titel:"Rechtsform",   icon:"🏢" },
  { id:2, titel:"Unternehmen",  icon:"📋" },
  { id:3, titel:"Steuerdaten",  icon:"🔢" },
  { id:4, titel:"Adresse",      icon:"📍" },
  { id:5, titel:"Zugangsdaten", icon:"🔐" },
];

const isKapital = rf => ["gmbh","ug","ag","gmbh_co_kg"].includes(rf);
const isEinzel  = rf => ["einzelunternehmen","freiberufler","kleinunternehmer"].includes(rf);
const isVerein  = rf => ["ev","eg","stiftung"].includes(rf);

// ─── Suffix-Regeln je Rechtsform ───────────────────────────────────────────
const SUFFIX_RULES = {
  gmbh:       { required: "GmbH", hint: 'Firmenname muss mit "GmbH" enden – z.B. "Muster GmbH"' },
  ug:         { required: "UG (haftungsbeschränkt)", short:"UG", hint: 'Muss mit "UG (haftungsbeschränkt)" enden – z.B. "Muster UG (haftungsbeschränkt)"' },
  ag:         { required: "AG",   hint: 'Firmenname muss mit "AG" enden – z.B. "Muster AG"' },
  gmbh_co_kg: { required: "GmbH & Co. KG", hint: 'Muss mit "GmbH & Co. KG" enden – z.B. "Muster GmbH & Co. KG"' },
  gbr:        { required: "GbR",  hint: 'Empfohlen: Name mit "GbR" – z.B. "Müller & Partner GbR"' },
  ohg:        { required: "OHG",  hint: 'Empfohlen: Name mit "OHG" – z.B. "Mustermann OHG"' },
  kg:         { required: "KG",   hint: 'Empfohlen: Name mit "KG" – z.B. "Muster KG"' },
  ev:         { required: "e.V.", hint: 'Vereinsname muss mit "e.V." enden – z.B. "Sportverein Muster e.V."' },
  eg:         { required: "eG",   hint: 'Name muss mit "eG" enden – z.B. "Muster eG"' },
};

// ─── Validierungsfunktionen ────────────────────────────────────────────────
const V = {
  // Schritt 2
  firmenname: (v, rf) => {
    if(!v || v.trim().length < 2) return "Firmenname ist zu kurz (mind. 2 Zeichen)";
    const rule = SUFFIX_RULES[rf];
    if(rule) {
      const name = v.trim();
      // Prüfe ob Name mit dem Suffix endet (Groß-/Kleinschreibung berücksichtigt)
      const suffixes = rule.required.split("|");
      const ok = suffixes.some(s => name.toUpperCase().endsWith(s.toUpperCase()));
      if(!ok) return rule.hint;
    }
    if(v.trim().length > 80) return "Firmenname zu lang (max. 80 Zeichen)";
    return null;
  },
  vorname: v => {
    if(!v || v.trim().length < 2) return "Vorname zu kurz (mind. 2 Zeichen)";
    if(!/^[a-zA-ZäöüÄÖÜß\s\-']+$/.test(v.trim())) return "Nur Buchstaben erlaubt";
    return null;
  },
  nachname: v => {
    if(!v || v.trim().length < 2) return "Nachname zu kurz (mind. 2 Zeichen)";
    if(!/^[a-zA-ZäöüÄÖÜß\s\-']+$/.test(v.trim())) return "Nur Buchstaben erlaubt";
    return null;
  },
  branche: v => !v ? "Bitte eine Branche auswählen" : null,
  gruendungsjahr: v => {
    if(!v) return null; // optional
    const y = Number(v);
    if(isNaN(y) || y < 1800 || y > new Date().getFullYear()) return `Muss zwischen 1800 und ${new Date().getFullYear()} liegen`;
    return null;
  },
  handelsregister: v => {
    if(!v) return null; // optional
    if(!/^(HRA|HRB|PR|VR|GnR)\s?\d{1,6}$/i.test(v.trim())) return "Format: HRB 12345, HRA 9876, VR 4567 usw.";
    return null;
  },

  // Schritt 3
  steuernummer: v => {
    if(!v || v.trim().length < 8) return "Steuernummer zu kurz – Format: 21/815/08150 oder 2181508150";
    if(!/^[\d/\s]{8,14}$/.test(v.trim())) return "Nur Ziffern, Schrägstriche und Leerzeichen erlaubt";
    return null;
  },
  finanzamt: v => {
    if(!v || v.trim().length < 4) return "Bitte vollständigen Finanzamt-Namen eingeben";
    return null;
  },
  ustIdNr: v => {
    if(!v) return null; // optional
    const clean = v.replace(/\s/g,"").toUpperCase();
    if(!/^DE[0-9]{9}$/.test(clean)) return "Format: DE gefolgt von 9 Ziffern – z.B. DE123456789";
    return null;
  },
  steuerIdNr: v => {
    if(!v) return null; // optional
    const clean = v.replace(/\s/g,"");
    if(!/^[0-9]{11}$/.test(clean)) return "Exakt 11 Ziffern erforderlich – z.B. 12345678901";
    return null;
  },
  eoriNummer: v => {
    if(!v) return null; // optional
    const clean = v.replace(/\s/g,"").toUpperCase();
    if(!/^DE[0-9]{6,15}$/.test(clean)) return "Format: DE gefolgt von 6–15 Ziffern – z.B. DE1234567891234567";
    return null;
  },
  wIdNr: v => {
    if(!v) return null; // optional
    const clean = v.replace(/\s/g,"").toUpperCase();
    if(!/^DE[0-9]{5,12}$/.test(clean)) return "Format: DE gefolgt von Ziffern – z.B. DE00000000";
    return null;
  },

  // Schritt 4
  strasse: v => {
    if(!v || v.trim().length < 3) return "Straße zu kurz";
    if(/\d/.test(v)) return "Hausnummer bitte im nächsten Feld eintragen";
    return null;
  },
  hausnummer: v => {
    if(!v || v.trim().length < 1) return "Hausnummer fehlt";
    if(!/^[0-9]{1,4}[a-zA-Z]?(-[0-9]{1,4}[a-zA-Z]?)?$/.test(v.trim())) return "Gültige Nummern: 1, 12a, 1-3, 15b";
    return null;
  },
  plz: v => {
    if(!v) return "PLZ fehlt";
    if(!/^[0-9]{5}$/.test(v.trim())) return "PLZ muss genau 5 Ziffern haben – z.B. 80331";
    return null;
  },
  ort: v => {
    if(!v || v.trim().length < 2) return "Ort zu kurz";
    if(!/^[a-zA-ZäöüÄÖÜß\s\-\.]+$/.test(v.trim())) return "Nur Buchstaben und Bindestriche erlaubt";
    return null;
  },
  telefon: v => {
    if(!v) return null; // optional
    const clean = v.replace(/[\s\-\(\)\/]/g,"");
    if(!/^\+?[0-9]{6,15}$/.test(clean)) return "Ungültige Telefonnummer – z.B. +49 89 12345678";
    return null;
  },
  email: v => {
    if(!v) return "E-Mail ist Pflichtfeld";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "Ungültige E-Mail-Adresse – z.B. info@firma.de";
    return null;
  },
  website: v => {
    if(!v) return null; // optional
    if(!/^(https?:\/\/)?([\w\-]+\.)+[a-z]{2,}(\/.*)?$/i.test(v.trim())) return "Ungültige Website – z.B. www.firma.de oder https://firma.de";
    return null;
  },

  // Schritt 5
  benutzername: v => {
    if(!v || v.trim().length < 3) return "Mind. 3 Zeichen";
    if(!/^[a-zA-Z0-9._\-]+$/.test(v.trim())) return "Nur Buchstaben, Zahlen, Punkte und Bindestriche";
    return null;
  },
  passwort: v => {
    if(!v || v.length < 8) return "Mind. 8 Zeichen";
    if(!/[A-Z]/.test(v)) return "Mind. ein Großbuchstabe erforderlich";
    if(!/[0-9]/.test(v)) return "Mind. eine Zahl erforderlich";
    return null;
  },
  passwort2: (v, p) => {
    if(!v) return "Bitte Passwort wiederholen";
    if(v !== p) return "Passwörter stimmen nicht überein";
    return null;
  },
};

// ─── Feldstärke-Anzeige ────────────────────────────────────────────────────
function FieldHint({ error, value, okText }) {
  if(!value) return null;
  if(error) return <div style={{fontSize:10,color:ERR_C,marginTop:3}}>⚠ {error}</div>;
  return <div style={{fontSize:10,color:OK_C,marginTop:3}}>✓ {okText||"Gültig"}</div>;
}

// ─── Passwort-Stärke ───────────────────────────────────────────────────────
function PassStaerke({ pw }) {
  if(!pw) return null;
  let score = 0;
  if(pw.length >= 8)  score++;
  if(pw.length >= 12) score++;
  if(/[A-Z]/.test(pw)) score++;
  if(/[0-9]/.test(pw)) score++;
  if(/[^a-zA-Z0-9]/.test(pw)) score++;
  const labels = ["Sehr schwach","Schwach","Mittel","Stark","Sehr stark"];
  const colors = ["#ef4444","#f87171","#facc15","#4ade80",G];
  return (
    <div style={{marginTop:5}}>
      <div style={{display:"flex",gap:3,marginBottom:3}}>
        {[1,2,3,4,5].map(i=>(
          <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=score?colors[score-1]:"rgba(255,255,255,.07)",transition:"all .2s"}}/>
        ))}
      </div>
      <div style={{fontSize:10,color:colors[score-1]||"#555"}}>{labels[score-1]||"Kein Passwort"}</div>
    </div>
  );
}

export default function Login({ onLogin }) {
  const [screen, setScreen] = useState("login");
  const [step,   setStep]   = useState(1);
  const [err,    setErr]    = useState("");
  const [ld,     setLd]     = useState(false);
  const [touched, setTouched] = useState({}); // Felder die schon angetippt wurden

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [reg, setReg] = useState({
    rechtsform:"", firmenname:"", vorname:"", nachname:"", branche:"",
    gruendungsjahr:"", handelsregister:"",
    steuernummer:"", finanzamt:"", ustIdNr:"", steuerIdNr:"",
    eoriNummer:"", wIdNr:"",
    strasse:"", hausnummer:"", plz:"", ort:"", land:"Deutschland",
    telefon:"", email:"", website:"",
    benutzername:"", passwort:"", passwort2:"", agb:false, datenschutz:false,
  });

  const set = (f,v) => { setReg(r=>({...r,[f]:v})); setTouched(t=>({...t,[f]:true})); };
  const touch = f   => setTouched(t=>({...t,[f]:true}));

  // Zeige Fehler nur wenn Feld berührt wurde
  const fieldErr = (field, ...args) => {
    if(!touched[field]) return null;
    return V[field] ? V[field](reg[field], ...args) : null;
  };

  const doLogin = async () => {
    setErr(""); setLd(true);
    await new Promise(r=>setTimeout(r,600));
    if(loginUser==="admin"&&loginPass==="1234") onLogin();
    else { setErr("Benutzername oder Passwort falsch."); setLd(false); }
  };

  // Prüfe ob aktueller Schritt komplett gültig
  const stepValid = () => {
    if(step===1) return reg.rechtsform!=="";
    if(step===2) {
      if(isEinzel(reg.rechtsform)) {
        return !V.vorname(reg.vorname)&&!V.nachname(reg.nachname)&&!V.branche(reg.branche);
      }
      return !V.firmenname(reg.firmenname,reg.rechtsform)&&!V.branche(reg.branche);
    }
    if(step===3) return !V.steuernummer(reg.steuernummer)&&!V.finanzamt(reg.finanzamt)
      &&!V.ustIdNr(reg.ustIdNr)&&!V.steuerIdNr(reg.steuerIdNr)
      &&!V.eoriNummer(reg.eoriNummer)&&!V.wIdNr(reg.wIdNr);
    if(step===4) return !V.strasse(reg.strasse)&&!V.hausnummer(reg.hausnummer)
      &&!V.plz(reg.plz)&&!V.ort(reg.ort)&&!V.email(reg.email)
      &&!V.telefon(reg.telefon)&&!V.website(reg.website);
    if(step===5) return !V.benutzername(reg.benutzername)&&!V.passwort(reg.passwort)
      &&!V.passwort2(reg.passwort2,reg.passwort)&&reg.agb&&reg.datenschutz;
    return true;
  };

  // Alle Felder des Schritts als berührt markieren → Fehler zeigen
  const touchStep = () => {
    const fields = {
      2: isEinzel(reg.rechtsform)
        ? ["vorname","nachname","branche","gruendungsjahr"]
        : ["firmenname","branche","gruendungsjahr","handelsregister"],
      3: ["steuernummer","finanzamt","ustIdNr","steuerIdNr","eoriNummer","wIdNr"],
      4: ["strasse","hausnummer","plz","ort","email","telefon","website"],
      5: ["benutzername","passwort","passwort2"],
    };
    const t = {};
    (fields[step]||[]).forEach(f=>t[f]=true);
    setTouched(prev=>({...prev,...t}));
  };

  const tryNext = () => {
    touchStep();
    if(!stepValid()) { setErr("Bitte alle markierten Felder korrekt ausfüllen."); return; }
    setErr(""); setStep(s=>s+1);
  };

  const doRegister = async () => {
    touchStep();
    if(!stepValid()) { setErr("Bitte alle Felder prüfen."); return; }
    setErr(""); setLd(true);
    await new Promise(r=>setTimeout(r,1200));
    setScreen("done"); setLd(false);
  };

  // ── DONE ──
  if(screen==="done") return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#05050e",padding:20}}>
      <div style={{background:"#0f0f1e",border:"1px solid rgba(34,211,166,.25)",borderRadius:18,padding:"40px 36px",maxWidth:460,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>✅</div>
        <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:8}}>Registrierung erfolgreich!</div>
        <div style={{fontSize:14,color:G,marginBottom:4,fontWeight:600}}>
          {isEinzel(reg.rechtsform)?`${reg.vorname} ${reg.nachname}`:reg.firmenname}
        </div>
        <div style={{fontSize:12,color:"#444",marginBottom:24}}>
          {RECHTSFORMEN.flatMap(g=>g.formen).find(f=>f.v===reg.rechtsform)?.l}
        </div>
        <div style={{background:"rgba(34,211,166,.05)",border:"1px solid rgba(34,211,166,.15)",borderRadius:10,padding:14,marginBottom:20,textAlign:"left"}}>
          <div style={{fontSize:11,color:G,fontWeight:600,marginBottom:8}}>Ihre Zugangsdaten</div>
          <div style={{fontSize:12,color:"#777"}}>Benutzername: <span style={{color:"#e0e0f0",fontWeight:600}}>{reg.benutzername}</span></div>
          <div style={{fontSize:12,color:"#777",marginTop:3}}>E-Mail: <span style={{color:"#e0e0f0"}}>{reg.email}</span></div>
        </div>
        <button className="bp" style={{width:"100%",padding:13,fontSize:14,borderRadius:10}} onClick={onLogin}>
          Jetzt einloggen →
        </button>
        <div style={{fontSize:11,color:"#333",marginTop:12}}>Eine Bestätigungs-E-Mail wurde an {reg.email} gesendet.</div>
      </div>
    </div>
  );

  // ── REGISTER ──
  if(screen==="register") return (
    <div style={{minHeight:"100vh",background:"#05050e",display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 20px 50px",overflowY:"auto"}}>

      <div style={{textAlign:"center",marginBottom:24}}>
        <Logo/><div style={{fontSize:12,color:"#444",marginTop:6}}>Unternehmensregistrierung</div>
      </div>

      {/* Fortschritts-Leiste */}
      <div style={{display:"flex",alignItems:"flex-start",marginBottom:28,maxWidth:580,width:"100%"}}>
        {STEPS.map((s,i)=>(
          <div key={s.id} style={{display:"flex",alignItems:"center",flex:1}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",flex:1}}>
              <div style={{
                width:34,height:34,borderRadius:"50%",
                background:step>s.id?"rgba(34,211,166,.2)":step===s.id?"rgba(34,211,166,.12)":"rgba(255,255,255,.04)",
                border:`2px solid ${step>=s.id?G:"rgba(255,255,255,.1)"}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:step>s.id?13:14,color:step>=s.id?G:"#444",fontWeight:700,
              }}>
                {step>s.id?"✓":s.icon}
              </div>
              <div style={{fontSize:9,color:step===s.id?G:"#444",marginTop:4,textAlign:"center",fontWeight:step===s.id?600:400,whiteSpace:"nowrap"}}>{s.titel}</div>
            </div>
            {i<STEPS.length-1&&<div style={{height:2,flex:1,background:step>s.id?G:"rgba(255,255,255,.07)",marginBottom:16,transition:"background .3s"}}/>}
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={{background:"#0f0f1e",border:"1px solid rgba(255,255,255,.08)",borderRadius:16,padding:"28px",maxWidth:580,width:"100%"}}>

        {/* ══ SCHRITT 1: Rechtsform ══ */}
        {step===1&&(
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:4}}>Welche Rechtsform hat Ihr Unternehmen?</div>
            <div style={{fontSize:12,color:"#555",marginBottom:18}}>Je nach Rechtsform gelten andere Pflichtangaben auf Rechnungen.</div>
            {RECHTSFORMEN.map(gruppe=>(
              <div key={gruppe.gruppe} style={{marginBottom:14}}>
                <div style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:1,marginBottom:6,fontWeight:600}}>{gruppe.gruppe}</div>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  {gruppe.formen.map(f=>(
                    <button key={f.v} onClick={()=>set("rechtsform",f.v)}
                      style={{padding:"10px 14px",borderRadius:9,textAlign:"left",cursor:"pointer",
                        background:reg.rechtsform===f.v?"rgba(34,211,166,.1)":"rgba(255,255,255,.03)",
                        border:`1px solid ${reg.rechtsform===f.v?G:"rgba(255,255,255,.07)"}`,
                        color:reg.rechtsform===f.v?G:"#888",fontSize:12,fontWeight:reg.rechtsform===f.v?600:400,transition:"all .15s"}}>
                      {reg.rechtsform===f.v&&<span style={{marginRight:6}}>✓</span>}{f.l}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ SCHRITT 2: Unternehmensdaten ══ */}
        {step===2&&(
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:4}}>Unternehmensdaten</div>
            <div style={{fontSize:12,color:"#555",marginBottom:18}}>Diese Daten erscheinen im Briefkopf Ihrer Rechnungen.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>

              {/* Firmenname (nur Nicht-Einzelunternehmen) */}
              {!isEinzel(reg.rechtsform)&&(
                <div style={{gridColumn:"span 2"}}>
                  <label className="inp-lbl">Firmenname *</label>
                  <input className="inp-full"
                    value={reg.firmenname}
                    onChange={e=>set("firmenname",e.target.value)}
                    onBlur={()=>touch("firmenname")}
                    placeholder={
                      reg.rechtsform==="gmbh"?"z.B. Muster GmbH":
                      reg.rechtsform==="ug"?"z.B. Muster UG (haftungsbeschränkt)":
                      reg.rechtsform==="ag"?"z.B. Muster AG":
                      reg.rechtsform==="gmbh_co_kg"?"z.B. Muster GmbH & Co. KG":
                      reg.rechtsform==="gbr"?"z.B. Müller & Partner GbR":
                      reg.rechtsform==="ev"?"z.B. Sportverein Muster e.V.":
                      "Firmenname"
                    }
                    style={{borderColor:touched.firmenname?(V.firmenname(reg.firmenname,reg.rechtsform)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}
                  />
                  <FieldHint error={fieldErr("firmenname",reg.rechtsform)} value={reg.firmenname}
                    okText={`"${reg.firmenname.trim()}" ✓ Korrekte Schreibweise`}/>
                  {/* Hinweis-Box je Rechtsform */}
                  {SUFFIX_RULES[reg.rechtsform]&&!V.firmenname(reg.firmenname,reg.rechtsform)&&reg.firmenname&&(
                    <div style={{fontSize:10,color:"#555",marginTop:3}}>
                      ℹ Gesetzlich vorgeschrieben gemäß {reg.rechtsform==="gmbh"?"§4 GmbHG":reg.rechtsform==="ag"?"§4 AktG":reg.rechtsform==="ug"?"§5a GmbHG":"Handelsrecht"}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="inp-lbl">Vorname {isEinzel(reg.rechtsform)?"*":""}</label>
                <input className="inp-full" value={reg.vorname} onChange={e=>set("vorname",e.target.value)} onBlur={()=>touch("vorname")} placeholder="Max"
                  style={{borderColor:touched.vorname?(V.vorname(reg.vorname)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("vorname")} value={reg.vorname} okText="✓"/>
              </div>

              <div>
                <label className="inp-lbl">Nachname {isEinzel(reg.rechtsform)?"*":""}</label>
                <input className="inp-full" value={reg.nachname} onChange={e=>set("nachname",e.target.value)} onBlur={()=>touch("nachname")} placeholder="Mustermann"
                  style={{borderColor:touched.nachname?(V.nachname(reg.nachname)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("nachname")} value={reg.nachname} okText="✓"/>
              </div>

              <div style={{gridColumn:"span 2"}}>
                <label className="inp-lbl">Branche *</label>
                <select className="inp-full" value={reg.branche} onChange={e=>set("branche",e.target.value)} onBlur={()=>touch("branche")}
                  style={{borderColor:touched.branche?(V.branche(reg.branche)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}>
                  <option value="">Bitte wählen…</option>
                  {BRANCHEN.map(b=><option key={b}>{b}</option>)}
                </select>
                <FieldHint error={fieldErr("branche")} value={reg.branche} okText={`Branche: ${reg.branche}`}/>
              </div>

              <div>
                <label className="inp-lbl">Gründungsjahr <span style={{color:"#444",fontWeight:400,fontSize:9,textTransform:"none"}}>optional</span></label>
                <input className="inp-full" value={reg.gruendungsjahr} onChange={e=>set("gruendungsjahr",e.target.value)} onBlur={()=>touch("gruendungsjahr")} placeholder={`z.B. ${new Date().getFullYear()-2}`}
                  style={{borderColor:touched.gruendungsjahr&&reg.gruendungsjahr?(V.gruendungsjahr(reg.gruendungsjahr)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("gruendungsjahr")} value={reg.gruendungsjahr} okText="✓ Gültig"/>
              </div>

              {(isKapital(reg.rechtsform)||reg.rechtsform==="ohg"||reg.rechtsform==="kg")&&(
                <div>
                  <label className="inp-lbl">Handelsregister-Nr. <span style={{color:"#444",fontWeight:400,fontSize:9,textTransform:"none"}}>optional</span></label>
                  <input className="inp-full" value={reg.handelsregister} onChange={e=>set("handelsregister",e.target.value)} onBlur={()=>touch("handelsregister")} placeholder="HRB 12345"
                    style={{borderColor:touched.handelsregister&&reg.handelsregister?(V.handelsregister(reg.handelsregister)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                  <FieldHint error={fieldErr("handelsregister")} value={reg.handelsregister} okText="✓ Gültiges Format"/>
                </div>
              )}
            </div>
            {reg.rechtsform==="kleinunternehmer"&&(
              <div className="ib" style={{marginTop:14,padding:12,fontSize:12}}>
                <span style={{fontWeight:600,color:G}}>§19 UStG: </span>
                <span style={{color:"#777"}}>Keine Umsatzsteuer auf Rechnungen. Jahresumsatz muss unter 25.000 € liegen.</span>
              </div>
            )}
          </div>
        )}

        {/* ══ SCHRITT 3: Steuerdaten ══ */}
        {step===3&&(
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:4}}>Steuerdaten & Identifikationsnummern</div>
            <div style={{fontSize:12,color:"#555",marginBottom:18}}>Pflichtfelder für korrekte Rechnungen und ELSTER.</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>

              <div>
                <label className="inp-lbl">Steuernummer * <span style={{color:"#555",fontWeight:400,fontSize:9,textTransform:"none",letterSpacing:0}}>Pflichtangabe auf Rechnungen</span></label>
                <input className="inp-full" value={reg.steuernummer} onChange={e=>set("steuernummer",e.target.value)} onBlur={()=>touch("steuernummer")} placeholder="z.B. 21/815/08150"
                  style={{borderColor:touched.steuernummer?(V.steuernummer(reg.steuernummer)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("steuernummer")} value={reg.steuernummer} okText="✓ Format gültig"/>
                <div style={{fontSize:10,color:"#444",marginTop:3}}>Format je Bundesland unterschiedlich: 21/815/08150 oder 2181508150</div>
              </div>

              <div>
                <label className="inp-lbl">Zuständiges Finanzamt *</label>
                <input className="inp-full" value={reg.finanzamt} onChange={e=>set("finanzamt",e.target.value)} onBlur={()=>touch("finanzamt")} placeholder="z.B. Finanzamt München"
                  style={{borderColor:touched.finanzamt?(V.finanzamt(reg.finanzamt)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("finanzamt")} value={reg.finanzamt} okText={`✓ ${reg.finanzamt}`}/>
              </div>

              <div>
                <label className="inp-lbl">USt-IdNr. <span style={{color:"#555",fontWeight:400,fontSize:9,textTransform:"none",letterSpacing:0}}>optional – Pflicht für EU-Auslandsgeschäfte</span></label>
                <input className="inp-full" value={reg.ustIdNr} onChange={e=>set("ustIdNr",e.target.value.toUpperCase().replace(/\s/g,""))} onBlur={()=>touch("ustIdNr")} placeholder="DE123456789"
                  style={{borderColor:touched.ustIdNr&&reg.ustIdNr?(V.ustIdNr(reg.ustIdNr)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("ustIdNr")} value={reg.ustIdNr} okText={`✓ ${reg.ustIdNr} – gültige USt-IdNr.`}/>
                <div style={{fontSize:10,color:"#444",marginTop:3}}>DE + genau 9 Ziffern · Beantragung: bzst.de (kostenlos)</div>
              </div>

              {isEinzel(reg.rechtsform)&&(
                <div>
                  <label className="inp-lbl">Steueridentifikationsnummer <span style={{color:"#555",fontWeight:400,fontSize:9,textTransform:"none",letterSpacing:0}}>optional – persönliche Nummer</span></label>
                  <input className="inp-full" value={reg.steuerIdNr} onChange={e=>set("steuerIdNr",e.target.value.replace(/\s/g,""))} onBlur={()=>touch("steuerIdNr")} placeholder="12345678901"
                    style={{borderColor:touched.steuerIdNr&&reg.steuerIdNr?(V.steuerIdNr(reg.steuerIdNr)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                  <FieldHint error={fieldErr("steuerIdNr")} value={reg.steuerIdNr} okText="✓ Exakt 11 Ziffern – gültig"/>
                  <div style={{fontSize:10,color:"#444",marginTop:3}}>11 Stellen · Steht auf Ihrem Steuerbescheid · Lebenslang gültig</div>
                </div>
              )}

              <div>
                <label className="inp-lbl">EORI-Nummer <span style={{color:"#555",fontWeight:400,fontSize:9,textTransform:"none",letterSpacing:0}}>optional – nur bei Im-/Export außerhalb EU</span></label>
                <input className="inp-full" value={reg.eoriNummer} onChange={e=>set("eoriNummer",e.target.value.toUpperCase().replace(/\s/g,""))} onBlur={()=>touch("eoriNummer")} placeholder="DE1234567891234567"
                  style={{borderColor:touched.eoriNummer&&reg.eoriNummer?(V.eoriNummer(reg.eoriNummer)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("eoriNummer")} value={reg.eoriNummer} okText="✓ EORI-Format gültig"/>
                <div style={{fontSize:10,color:"#444",marginTop:3}}>DE + 6–15 Ziffern · Kostenlos bei Zoll (zoll.de) beantragen</div>
              </div>

              <div>
                <label className="inp-lbl">Wirtschafts-Identifikationsnummer <span style={{color:"#facc15",fontWeight:400,fontSize:9,textTransform:"none",letterSpacing:0}}>optional – neu ab Nov. 2024</span></label>
                <input className="inp-full" value={reg.wIdNr} onChange={e=>set("wIdNr",e.target.value.toUpperCase().replace(/\s/g,""))} onBlur={()=>touch("wIdNr")} placeholder="DE00000000"
                  style={{borderColor:touched.wIdNr&&reg.wIdNr?(V.wIdNr(reg.wIdNr)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("wIdNr")} value={reg.wIdNr} okText="✓ W-IdNr. Format gültig"/>
                <div style={{fontSize:10,color:"#444",marginTop:3}}>Wird automatisch vom BZSt zugewiesen · Kein Antrag nötig</div>
              </div>

              <div className="wb" style={{padding:"10px 13px",fontSize:11}}>
                <span style={{fontWeight:600,color:"#facc15"}}>💡 </span>
                <span style={{color:"#777"}}>Nur Steuernummer und Finanzamt sind Pflicht. Alle anderen Nummern können Sie später in den Einstellungen ergänzen.</span>
              </div>
            </div>
          </div>
        )}

        {/* ══ SCHRITT 4: Adresse ══ */}
        {step===4&&(
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:4}}>Adresse & Kontakt</div>
            <div style={{fontSize:12,color:"#555",marginBottom:18}}>Erscheint im Briefkopf Ihrer Rechnungen.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 90px",gap:12,marginBottom:0}}>
              <div>
                <label className="inp-lbl">Straße * <span style={{color:"#555",fontWeight:400,fontSize:9,textTransform:"none"}}>ohne Hausnummer</span></label>
                <input className="inp-full" value={reg.strasse} onChange={e=>set("strasse",e.target.value)} onBlur={()=>touch("strasse")} placeholder="Musterstraße"
                  style={{borderColor:touched.strasse?(V.strasse(reg.strasse)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("strasse")} value={reg.strasse} okText="✓"/>
              </div>
              <div>
                <label className="inp-lbl">Nr. *</label>
                <input className="inp-full" value={reg.hausnummer} onChange={e=>set("hausnummer",e.target.value)} onBlur={()=>touch("hausnummer")} placeholder="12a"
                  style={{borderColor:touched.hausnummer?(V.hausnummer(reg.hausnummer)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("hausnummer")} value={reg.hausnummer} okText="✓"/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"110px 1fr",gap:12,marginTop:12,marginBottom:12}}>
              <div>
                <label className="inp-lbl">PLZ *</label>
                <input className="inp-full" value={reg.plz} onChange={e=>set("plz",e.target.value.replace(/\D/g,"").slice(0,5))} onBlur={()=>touch("plz")} placeholder="80331" maxLength={5}
                  style={{borderColor:touched.plz?(V.plz(reg.plz)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("plz")} value={reg.plz} okText={`✓ PLZ ${reg.plz}`}/>
              </div>
              <div>
                <label className="inp-lbl">Ort *</label>
                <input className="inp-full" value={reg.ort} onChange={e=>set("ort",e.target.value)} onBlur={()=>touch("ort")} placeholder="München"
                  style={{borderColor:touched.ort?(V.ort(reg.ort)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("ort")} value={reg.ort} okText={`✓ ${reg.ort}`}/>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <label className="inp-lbl">Land</label>
              <select className="inp-full" value={reg.land} onChange={e=>set("land",e.target.value)}>
                {["Deutschland","Österreich","Schweiz","Liechtenstein"].map(l=><option key={l}>{l}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div>
                <label className="inp-lbl">E-Mail *</label>
                <input className="inp-full" type="email" value={reg.email} onChange={e=>set("email",e.target.value)} onBlur={()=>touch("email")} placeholder="info@firma.de"
                  style={{borderColor:touched.email?(V.email(reg.email)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("email")} value={reg.email} okText={`✓ ${reg.email}`}/>
              </div>
              <div>
                <label className="inp-lbl">Telefon <span style={{color:"#444",fontWeight:400,fontSize:9,textTransform:"none"}}>optional</span></label>
                <input className="inp-full" value={reg.telefon} onChange={e=>set("telefon",e.target.value)} onBlur={()=>touch("telefon")} placeholder="+49 89 12345678"
                  style={{borderColor:touched.telefon&&reg.telefon?(V.telefon(reg.telefon)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("telefon")} value={reg.telefon} okText="✓ Gültige Telefonnummer"/>
              </div>
              <div style={{gridColumn:"span 2"}}>
                <label className="inp-lbl">Website <span style={{color:"#444",fontWeight:400,fontSize:9,textTransform:"none"}}>optional</span></label>
                <input className="inp-full" value={reg.website} onChange={e=>set("website",e.target.value)} onBlur={()=>touch("website")} placeholder="www.firma.de"
                  style={{borderColor:touched.website&&reg.website?(V.website(reg.website)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("website")} value={reg.website} okText="✓ Gültige Adresse"/>
              </div>
            </div>
          </div>
        )}

        {/* ══ SCHRITT 5: Zugangsdaten ══ */}
        {step===5&&(
          <div>
            <div style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:4}}>Zugangsdaten erstellen</div>
            <div style={{fontSize:12,color:"#555",marginBottom:18}}>Mit diesen Daten melden Sie sich an.</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <label className="inp-lbl">Benutzername *</label>
                <input className="inp-full" value={reg.benutzername} onChange={e=>set("benutzername",e.target.value)} onBlur={()=>touch("benutzername")} placeholder="max.mustermann"
                  style={{borderColor:touched.benutzername?(V.benutzername(reg.benutzername)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("benutzername")} value={reg.benutzername} okText={`✓ Benutzername "${reg.benutzername}" verfügbar`}/>
              </div>
              <div>
                <label className="inp-lbl">Passwort * <span style={{color:"#555",fontWeight:400,fontSize:9,textTransform:"none"}}>mind. 8 Zeichen, 1 Großbuchstabe, 1 Zahl</span></label>
                <input className="inp-full" type="password" value={reg.passwort} onChange={e=>set("passwort",e.target.value)} onBlur={()=>touch("passwort")} placeholder="••••••••"
                  style={{borderColor:touched.passwort?(V.passwort(reg.passwort)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                {touched.passwort&&V.passwort(reg.passwort)&&<div style={{fontSize:10,color:ERR_C,marginTop:3}}>⚠ {V.passwort(reg.passwort)}</div>}
                <PassStaerke pw={reg.passwort}/>
              </div>
              <div>
                <label className="inp-lbl">Passwort wiederholen *</label>
                <input className="inp-full" type="password" value={reg.passwort2} onChange={e=>set("passwort2",e.target.value)} onBlur={()=>touch("passwort2")} placeholder="••••••••"
                  style={{borderColor:touched.passwort2?(V.passwort2(reg.passwort2,reg.passwort)?"rgba(248,113,113,.5)":"rgba(34,211,166,.4)"):"rgba(255,255,255,.1)"}}/>
                <FieldHint error={fieldErr("passwort2",reg.passwort)} value={reg.passwort2} okText="✓ Passwörter stimmen überein"/>
              </div>

              {/* Zusammenfassung */}
              <div style={{background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.07)",borderRadius:10,padding:14}}>
                <div style={{fontSize:11,fontWeight:600,color:"#777",marginBottom:10,textTransform:"uppercase",letterSpacing:.6}}>Zusammenfassung</div>
                {[
                  {l:"Rechtsform", v:RECHTSFORMEN.flatMap(g=>g.formen).find(f=>f.v===reg.rechtsform)?.l?.split("–")[0]},
                  {l:"Name/Firma", v:isEinzel(reg.rechtsform)?`${reg.vorname} ${reg.nachname}`:reg.firmenname},
                  {l:"Steuernr.",  v:reg.steuernummer},
                  {l:"Finanzamt",  v:reg.finanzamt},
                  {l:"USt-IdNr.", v:reg.ustIdNr||"—"},
                  {l:"EORI",      v:reg.eoriNummer||"—"},
                  {l:"Adresse",   v:`${reg.strasse} ${reg.hausnummer}, ${reg.plz} ${reg.ort}`},
                  {l:"E-Mail",    v:reg.email},
                ].map((row,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                    <span style={{fontSize:11,color:"#555",flexShrink:0,marginRight:8}}>{row.l}</span>
                    <span style={{fontSize:11,color:"#e0e0f0",textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"65%"}}>{row.v}</span>
                  </div>
                ))}
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                <label style={{display:"flex",alignItems:"flex-start",gap:9,cursor:"pointer"}}>
                  <input type="checkbox" checked={reg.agb} onChange={e=>set("agb",e.target.checked)} style={{marginTop:2,width:15,height:15,flexShrink:0}}/>
                  <span style={{fontSize:11,color:reg.agb?"#aaa":"#666",lineHeight:1.5}}>
                    Ich akzeptiere die <span style={{color:G}}>Allgemeinen Geschäftsbedingungen</span> von BuchhaltNow. *
                    {!reg.agb&&touched.agb&&<span style={{color:ERR_C,display:"block",fontSize:10}}>⚠ Pflichtfeld</span>}
                  </span>
                </label>
                <label style={{display:"flex",alignItems:"flex-start",gap:9,cursor:"pointer"}}>
                  <input type="checkbox" checked={reg.datenschutz} onChange={e=>set("datenschutz",e.target.checked)} style={{marginTop:2,width:15,height:15,flexShrink:0}}/>
                  <span style={{fontSize:11,color:reg.datenschutz?"#aaa":"#666",lineHeight:1.5}}>
                    Ich habe die <span style={{color:G}}>Datenschutzerklärung</span> gelesen und stimme zu. *
                    {!reg.datenschutz&&touched.datenschutz&&<span style={{color:ERR_C,display:"block",fontSize:10}}>⚠ Pflichtfeld</span>}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {err&&<div style={{marginTop:14,fontSize:12,color:ERR_C,padding:"8px 12px",background:"rgba(248,113,113,.08)",borderRadius:7,border:"1px solid rgba(248,113,113,.2)"}}>⚠ {err}</div>}

        {/* Navigation */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:22}}>
          <button className="bg" style={{padding:"9px 16px",fontSize:12,visibility:step===1?"hidden":"visible"}} onClick={()=>{setStep(s=>s-1);setErr("");}}>← Zurück</button>
          <div style={{fontSize:11,color:"#444"}}>Schritt {step} von {STEPS.length}</div>
          {step<STEPS.length
            ? <button className="bp" style={{padding:"9px 20px",fontSize:13,opacity:stepValid()?1:.6}} onClick={tryNext}>Weiter →</button>
            : <button className="bp" style={{padding:"9px 20px",fontSize:13,opacity:stepValid()?1:.6}} onClick={doRegister} disabled={ld}>
                {ld?"Wird registriert…":"✓ Jetzt registrieren"}
              </button>
          }
        </div>
      </div>

      <div style={{marginTop:16,fontSize:12,color:"#333"}}>
        Bereits registriert?{" "}
        <button style={{background:"none",border:"none",color:G,fontSize:12,cursor:"pointer",padding:0}} onClick={()=>{setScreen("login");setErr("");}}>
          Einloggen →
        </button>
      </div>
    </div>
  );

  // ── LOGIN ──
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#05050e",padding:20}}>
      <div style={{background:"#0f0f1e",border:"1px solid rgba(255,255,255,.08)",borderRadius:18,padding:"38px 34px",width:360}}>
        <div style={{textAlign:"center",marginBottom:26}}>
          <Logo/>
          <div style={{fontSize:12,color:"#444",marginTop:7}}>Buchhaltung für Selbstständige & KMU</div>
        </div>
        <label className="inp-lbl">Benutzername</label>
        <div style={{marginBottom:12}}>
          <input className="inp-full" value={loginUser} onChange={e=>setLoginUser(e.target.value)} placeholder="admin" autoComplete="username"/>
        </div>
        <label className="inp-lbl">Passwort</label>
        <div style={{marginBottom:14}}>
          <input className="inp-full" type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)}
            placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&doLogin()}/>
        </div>
        {err&&<div style={{fontSize:12,color:ERR_C,marginBottom:10,padding:"8px 12px",background:"rgba(248,113,113,.08)",borderRadius:7}}>{err}</div>}
        <button className="bp" style={{width:"100%",padding:12,fontSize:14,borderRadius:9}} onClick={doLogin} disabled={ld}>
          {ld?"Anmelden…":"Anmelden →"}
        </button>
        <div style={{borderTop:"1px solid rgba(255,255,255,.05)",marginTop:18,paddingTop:16,textAlign:"center"}}>
          <div style={{fontSize:12,color:"#444",marginBottom:10}}>Noch kein Konto?</div>
          <button className="bg" style={{width:"100%",padding:11,fontSize:13}} onClick={()=>{setScreen("register");setStep(1);setErr("");setTouched({});}}>
            🏢 Jetzt registrieren →
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:14,fontSize:11,color:"#333"}}>
          Demo: <span style={{color:"#555"}}>admin / 1234</span>
        </div>
      </div>
    </div>
  );
}
