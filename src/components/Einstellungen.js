import { G } from "../utils/helpers";

export default function Einstellungen({ plan, setPlan, elsterFile, setElsterFile, onLogout }) {
  return (
    <div>
      <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:4}}>Einstellungen</div>
      <div style={{color:"#555",fontSize:12,marginBottom:20}}>Konto, Steuerdaten und Abonnement</div>

      {/* Plan wählen */}
      <div className="panel" style={{padding:18,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:14}}>Plan wählen</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:11}}>
          {[
            {p:"free",     label:"Free",        price:"0 €",  c:"#888",    features:["Dashboard & Übersicht","Belege scannen (5/Mo.)","Banking (1 Konto)","KI (10 Anfragen)"]},
            {p:"pro",      label:"✦ Pro",       price:"19 €", c:G,         features:["Alles aus Free","Unbegrenzte Belege","Alle Banking-Konten","Rechnungen & Produkte","KI unbegrenzt","Prüfungsassistent","ELSTER"]},
            {p:"ultimate", label:"🏆 Ultimate", price:"49 €", c:"#f59e0b", features:["Alles aus Pro","Personal & Lohnzettel","DATEV-Export","Mehrere Firmen","Prioritäts-Support","API-Zugang"]},
          ].map(pl=>(
            <div key={pl.p}
              style={{background:plan===pl.p?`${pl.c}0d`:"rgba(255,255,255,.02)",border:`1px solid ${plan===pl.p?pl.c:"rgba(255,255,255,.07)"}`,borderRadius:10,padding:14,cursor:"pointer"}}
              onClick={()=>setPlan(pl.p)}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:13,fontWeight:700,color:plan===pl.p?pl.c:"#fff"}}>{pl.label}</span>
                {plan===pl.p&&<span className="bdg bv">Aktiv</span>}
              </div>
              <div className="mn" style={{fontSize:17,fontWeight:700,color:pl.c,marginBottom:8}}>
                {pl.price}<span style={{fontSize:10,color:"#555",fontFamily:"Inter",fontWeight:400}}>/Mo.</span>
              </div>
              {pl.features.map((f,i)=>(
                <div key={i} style={{fontSize:10,color:plan===pl.p?pl.c:"#555",padding:"2px 0"}}>✓ {f}</div>
              ))}
              {plan!==pl.p&&(
                <button className="bp" style={{width:"100%",padding:7,fontSize:11,marginTop:10,background:pl.c}}
                  onClick={e=>{e.stopPropagation();setPlan(pl.p);}}>
                  Wechseln
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ELSTER */}
      <div className="panel" style={{padding:18,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:12}}>🔒 ELSTER-Zertifikat</div>
        <label htmlFor="elster-up">
          <div className="uz" style={{maxWidth:360}}>
            {!elsterFile
              ? <><div style={{fontSize:22,marginBottom:4}}>🔑</div><div style={{fontSize:11,color:"#777"}}>ElsterOnline-Zertifikat hochladen (.pfx)</div></>
              : <><div style={{fontSize:22,marginBottom:4}}>✅</div><div style={{fontSize:11,color:G,fontWeight:600}}>{elsterFile.name}</div></>}
          </div>
        </label>
        <input type="file" id="elster-up" accept=".pfx,.p12,.cer" onChange={e=>setElsterFile(e.target.files[0])}/>
      </div>

      {/* Abmelden */}
      <div className="panel" style={{padding:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:12,fontWeight:500,color:"#e0e0f0"}}>Sitzung beenden</div>
            <div style={{fontSize:10,color:"#555"}}>Von BuchhaltNow abmelden</div>
          </div>
          <button className="br" style={{padding:"8px 16px",fontSize:12}} onClick={onLogout}>Abmelden</button>
        </div>
      </div>
    </div>
  );
}
