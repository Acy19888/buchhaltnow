import { G, fmt, fmtD, filterPeriode, gwSt, kStFn, eStFn, annualize } from "../utils/helpers";
import { BELEGE_DATA, PERIODEN, STEUER_FRISTEN } from "../data/staticData";

export default function Dashboard({ rechnungen, periode, setPeriode, uf, isKU, setTab }) {
  const r   = filterPeriode(BELEGE_DATA, periode);
  const sl  = (PERIODEN.find(p => p.val === periode) || {label:""}).label;

  const eN  = r.filter(x=>x.typ==="ausgang").reduce((s,x)=>s+x.netto,0);
  const aN  = r.filter(x=>x.typ==="eingang").reduce((s,x)=>s+x.netto,0);
  const eB  = r.filter(x=>x.typ==="ausgang").reduce((s,x)=>s+x.betrag,0);
  const aB  = r.filter(x=>x.typ==="eingang").reduce((s,x)=>s+x.betrag,0);
  const gw2 = eN - aN;

  const u19e = r.filter(x=>x.typ==="ausgang"&&x.mwstSatz===19).reduce((s,x)=>s+x.mwst,0);
  const u7e  = r.filter(x=>x.typ==="ausgang"&&x.mwstSatz===7).reduce((s,x)=>s+x.mwst,0);
  const u19a = r.filter(x=>x.typ==="eingang"&&x.mwstSatz===19).reduce((s,x)=>s+x.mwst,0);
  const u7a  = r.filter(x=>x.typ==="eingang"&&x.mwstSatz===7).reduce((s,x)=>s+x.mwst,0);
  const us   = isKU ? 0 : (u19e+u7e)-(u19a+u7a);
  const euL  = r.filter(x=>x.eu&&x.typ==="ausgang");

  const gs = gwSt(gw2);
  const st = uf==="gmbh" ? kStFn(gw2) : eStFn(gw2);

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:2}}>Übersicht</div>
          <div style={{color:"#555",fontSize:12}}>
            {uf==="gmbh"?"GmbH · Körperschaftsteuer":isKU?"Kleinunternehmer · §19 UStG":"Einzelunternehmen · Einkommensteuer"} · {sl}
          </div>
        </div>
        <select value={periode} onChange={e=>setPeriode(e.target.value)}>
          <optgroup label="Monate">{PERIODEN.filter(p=>p.typ==="monat").map(p=><option key={p.val} value={p.val}>{p.label}</option>)}</optgroup>
          <optgroup label="Quartale">{PERIODEN.filter(p=>p.typ==="quartal").map(p=><option key={p.val} value={p.val}>{p.label}</option>)}</optgroup>
          <optgroup label="Gesamtjahr">{PERIODEN.filter(p=>p.typ==="jahr").map(p=><option key={p.val} value={p.val}>{p.label}</option>)}</optgroup>
        </select>
      </div>

      {isKU && <div className="ib" style={{marginBottom:10,fontSize:12,display:"flex",gap:8,alignItems:"center"}}><span>ℹ️</span><span style={{color:G,fontWeight:500}}>§19 UStG</span><span style={{color:"#555"}}>– keine MwSt auf Rechnungen</span></div>}
      {euL.length>0&&!isKU&&<div className="eb" style={{marginBottom:10,display:"flex",gap:9,alignItems:"center",padding:"8px 13px"}}><span>🇪🇺</span><div style={{flex:1,fontSize:12}}><span style={{fontWeight:600,color:"#a78bfa"}}>ZM-Meldung erforderlich</span><span style={{color:"#666"}}> · {euL.length} EU-Lieferung(en)</span></div><button className="bg" style={{padding:"4px 9px",fontSize:11}} onClick={()=>setTab("steuer")}>→</button></div>}

      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:9}}>
        {[
          {l:"Einnahmen brutto", v:fmt(eB), s:"inkl. MwSt",    c:G,        i:"+"},
          {l:"Ausgaben brutto",  v:fmt(aB), s:"inkl. MwSt",    c:"#f87171",i:"−"},
          {l:"Gewinn netto",     v:fmt(gw2),s:"vor Steuer",     c:"#60a5fa",i:"="},
          {l:isKU?"Keine USt":"USt-Schuld", v:isKU?"—":fmt(us), s:isKU?"§19 UStG":"ans Finanzamt", c:"#facc15",i:"!"},
        ].map((k,i)=>(
          <div key={i} className="card kpi">
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <div style={{fontSize:10,color:"#555"}}>{k.l}</div>
              <div style={{width:20,height:20,borderRadius:5,background:k.c+"18",display:"flex",alignItems:"center",justifyContent:"center",color:k.c,fontSize:9,fontWeight:700}}>{k.i}</div>
            </div>
            <div className="mn" style={{fontSize:15,fontWeight:700,color:k.c,marginBottom:1}}>{k.v}</div>
            <div style={{fontSize:10,color:"#444"}}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* Tax Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:9}}>
        {[
          {l:"GEWERBESTEUER (§11 GewStG)",         v:fmt(gs),      c:"#60a5fa", sub:"Freibetrag 24.500 €"},
          {l:uf==="gmbh"?"KÖRPERSCHAFTSTEUER":"EINKOMMENSTEUER", v:fmt(st), c:"#a78bfa", sub:uf==="gmbh"?"15% KSt + 5,5% SolZ":"§32a EStG"},
          {l:"GESAMTSTEUER",                        v:fmt(us+gs+st),c:"#f87171", sub:`Verfügbar: ${fmt(Math.max(0,gw2-gs-st))}`},
        ].map((k,i)=>(
          <div key={i} className="card kpi" style={{borderColor:k.c+"30"}}>
            <div style={{fontSize:9,color:"#555",marginBottom:4}}>{k.l}</div>
            <div className="mn" style={{fontSize:16,fontWeight:700,color:k.c,marginBottom:1}}>{k.v}</div>
            <div style={{fontSize:10,color:"#444"}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Bottom panels */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
        <div className="panel">
          <div className="panel-hd">
            <span style={{fontSize:11,fontWeight:600,color:"#fff"}}>Offene Rechnungen</span>
            <button className="bg" style={{padding:"3px 9px",fontSize:11}} onClick={()=>setTab("rechnungen")}>Alle →</button>
          </div>
          {rechnungen.filter(x=>x.status==="offen"||x.status.includes("mahnung")).slice(0,4).map((re,i)=>(
            <div key={re.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
              <div>
                <div style={{fontSize:12,fontWeight:500,color:"#e0e0f0"}}>{re.kunde}</div>
                <div style={{fontSize:10,color:"#555"}}>Fällig: <span style={{color:"#facc15"}}>{fmtD(re.faellig)}</span></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span className={`bdg ${re.status==="offen"?"bo":"bm"}`}>{re.status==="offen"?"Offen":"Mahnung"}</span>
                <span className="mn" style={{fontSize:11,fontWeight:700,color:G}}>{fmt(re.betrag)}</span>
              </div>
            </div>
          ))}
          {rechnungen.filter(x=>x.status==="offen"||x.status.includes("mahnung")).length===0&&
            <div style={{padding:"12px 14px",fontSize:12,color:"#444"}}>Keine offenen Rechnungen ✓</div>}
        </div>
        <div className="panel">
          <div className="panel-hd">
            <span style={{fontSize:11,fontWeight:600,color:"#fff"}}>Nächste Fristen</span>
            <button className="bg" style={{padding:"3px 9px",fontSize:11}} onClick={()=>setTab("steuer")}>Alle →</button>
          </div>
          {STEUER_FRISTEN.filter(f=>f.status==="offen").slice(0,5).map((f,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 14px",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
              <span style={{flex:1,fontSize:11,color:"#999",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.t}</span>
              <span className={`bdg ${f.art==="USt-VA"?"bv":f.art==="GewSt"?"bb":f.art==="ESt"?"beu":f.art==="ZM"?"bai":"bo"}`} style={{fontSize:9,flexShrink:0}}>{f.art}</span>
              <span className="mn" style={{fontSize:10,color:"#facc15",flexShrink:0}}>{f.frist}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
