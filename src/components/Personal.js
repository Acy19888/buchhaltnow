import { useState } from "react";
import { G, fmt, fmtD, today } from "../utils/helpers";
import Logo from "./Logo";

const TYPEN = [{v:"vollzeit",l:"Vollzeit"},{v:"teilzeit",l:"Teilzeit"},{v:"minijob",l:"Minijobber"}];
const typeBadge = t => t==="vollzeit"?"bv":t==="teilzeit"?"bb":"bo";

export default function Personal({ mitarbeiter, setMitarbeiter }) {
  const [view,setView]       = useState("list");
  const [form,setForm]       = useState(null);
  const [lohnMa,setLohnMa]   = useState(null);
  const [lohnMonat,setLohnMonat] = useState("2025-03");
  const [sentLohn,setSentLohn]   = useState({});

  const emptyMa = () => ({id:Date.now(),name:"",typ:"vollzeit",stelle:"",gehalt:0,sv:21.6,lohnst:0,netto:0,einDatum:today,email:"",iban:"",urlaub:30,urlaubRest:30});
  const calcNetto = (gehalt,typ,sv,lohnst) => { if(typ==="minijob") return gehalt; return Math.max(0,gehalt-gehalt*(sv/100)-lohnst); };
  const save = () => { const netto=calcNetto(form.gehalt,form.typ,form.sv,form.lohnst); const saved={...form,netto}; if(view==="edit") setMitarbeiter(prev=>prev.map(m=>m.id===saved.id?saved:m)); else setMitarbeiter(prev=>[...prev,saved]); setView("list"); };

  const gesamtBrutto = mitarbeiter.reduce((s,m)=>s+m.gehalt,0);
  const gesamtNetto  = mitarbeiter.reduce((s,m)=>s+m.netto,0);
  const gesamtSV     = mitarbeiter.filter(m=>m.typ!=="minijob").reduce((s,m)=>s+m.gehalt*(m.sv/100),0);

  const LohnzettelModal = ({ma,monat,onClose}) => {
    const monatStr = new Date(monat+"-01").toLocaleString("de-DE",{month:"long",year:"numeric"});
    const svAn = ma.typ==="minijob"?0:ma.gehalt*(ma.sv/100);
    const svAg = svAn;
    const netto = calcNetto(ma.gehalt,ma.typ,ma.sv,ma.lohnst);
    const key = `${ma.id}-${monat}`;
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e=>e.stopPropagation()} style={{minWidth:460,maxWidth:520}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div><div style={{fontSize:16,fontWeight:700,color:"#fff"}}>Lohnzettel – {monatStr}</div><div style={{fontSize:11,color:"#555"}}>{ma.name} · {ma.stelle}</div></div>
            <button className="bg" style={{padding:"4px 10px",fontSize:12}} onClick={onClose}>×</button>
          </div>
          <div style={{background:"#080818",borderRadius:10,padding:16,border:"1px solid rgba(255,255,255,.07)",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><Logo small/><div style={{textAlign:"right",fontSize:10,color:"#555"}}>Lohnzettel<br/>{monatStr}</div></div>
            <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:4}}>{ma.name}</div>
            <div style={{fontSize:11,color:"#777",marginBottom:12}}>{ma.stelle} · {TYPEN.find(t=>t.v===ma.typ)?.l}</div>
            {[
              {l:"Bruttogehalt", v:fmt(ma.gehalt), c:"#e0e0f0"},
              ...(ma.typ!=="minijob"?[{l:`SV AN (${ma.sv}%)`,v:"-"+fmt(svAn),c:"#f87171"},{l:"Lohnsteuer",v:"-"+fmt(ma.lohnst),c:"#f87171"}]:[]),
              {l:"─────────",v:"",c:"#333"},
              {l:"Nettoauszahlung",v:fmt(netto),c:G,bold:true},
            ].map((row,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:i===(ma.typ==="minijob"?1:3)?"1px solid rgba(255,255,255,.08)":"none"}}>
                <span style={{fontSize:11,color:"#777"}}>{row.l}</span>
                <span className="mn" style={{fontSize:12,fontWeight:row.bold?700:400,color:row.c}}>{row.v}</span>
              </div>
            ))}
            {ma.typ!=="minijob"&&<div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,.06)"}}>
              <div style={{fontSize:10,color:"#555",marginBottom:6}}>ARBEITGEBERKOSTEN</div>
              {[{l:`SV AG (${ma.sv}%)`,v:fmt(svAg)},{l:"Gesamtkosten AG",v:fmt(ma.gehalt+svAg),bold:true,c:"#facc15"}].map((row,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}><span style={{fontSize:11,color:"#777"}}>{row.l}</span><span className="mn" style={{fontSize:12,color:row.c||"#e0e0f0",fontWeight:row.bold?700:400}}>{row.v}</span></div>
              ))}
            </div>}
            {ma.iban&&<div style={{marginTop:10,fontSize:10,color:"#555"}}>Überweisung: <span className="mn" style={{color:"#777"}}>{ma.iban}</span></div>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="bp" style={{flex:1,padding:10,fontSize:12}} onClick={()=>{setSentLohn(s=>({...s,[key]:true}));alert(`Lohnzettel gesendet an: ${ma.email||"(keine E-Mail)"}`);}}>
              {sentLohn[key]?"✅ Erneut senden":"📧 Per E-Mail senden"}
            </button>
            <button className="bg" style={{flex:1,padding:10,fontSize:12}} onClick={()=>alert(`PDF: Lohnzettel_${ma.name.replace(" ","_")}_${monat}.pdf`)}>📥 PDF Download</button>
          </div>
        </div>
      </div>
    );
  };

  if(view==="list") return (
    <div>
      {lohnMa&&<LohnzettelModal ma={lohnMa} monat={lohnMonat} onClose={()=>setLohnMa(null)}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:2}}>Personal</div><div style={{color:"#555",fontSize:12}}>Mitarbeiter verwalten, Lohnzettel erstellen</div></div>
        <button className="bp" style={{padding:"9px 15px",fontSize:12}} onClick={()=>{setForm(emptyMa());setView("new")}}>+ Mitarbeiter</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:12}}>
        {[{l:"Mitarbeiter",v:mitarbeiter.length+" Pers.",c:"#60a5fa"},{l:"Bruttolohn",v:fmt(gesamtBrutto),c:"#facc15"},{l:"Nettolohn",v:fmt(gesamtNetto),c:G},{l:"SV-Kosten AG",v:fmt(gesamtSV),c:"#f87171"}].map((k,i)=>(
          <div key={i} className="kpi"><div style={{fontSize:10,color:"#555",marginBottom:3}}>{k.l}</div><div className="mn" style={{fontSize:14,fontWeight:700,color:k.c}}>{k.v}</div></div>
        ))}
      </div>
      <div className="panel" style={{padding:12,marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:12,color:"#777",fontWeight:500}}>Lohnzettel-Monat:</span>
        <select value={lohnMonat} onChange={e=>setLohnMonat(e.target.value)}>
          {["2025-01","2025-02","2025-03","2025-04","2025-05","2025-06"].map(m=>{const d=new Date(m+"-01");return <option key={m} value={m}>{d.toLocaleString("de-DE",{month:"long",year:"numeric"})}</option>;})}
        </select>
        <button className="bp" style={{padding:"7px 14px",fontSize:12}} onClick={()=>alert(`Alle ${mitarbeiter.length} Lohnzettel versendet.`)}>📧 Alle Lohnzettel senden</button>
      </div>
      <div className="panel">
        <div className="tbl-hd" style={{gridTemplateColumns:"1fr 80px 120px 85px 85px 70px 110px"}}>
          <div>Mitarbeiter</div><div>Typ</div><div>Stelle</div><div>Brutto</div><div>Netto</div><div>Seit</div><div>Aktionen</div>
        </div>
        {mitarbeiter.map(ma=>(
          <div key={ma.id} className="tbl-row" style={{gridTemplateColumns:"1fr 80px 120px 85px 85px 70px 110px"}}>
            <div><div style={{fontSize:12,fontWeight:500,color:"#e0e0f0"}}>{ma.name}</div><div style={{fontSize:10,color:"#555"}}>{ma.email}</div></div>
            <span className={`bdg ${typeBadge(ma.typ)}`} style={{fontSize:9}}>{TYPEN.find(t=>t.v===ma.typ)?.l}</span>
            <div style={{fontSize:11,color:"#777"}}>{ma.stelle}</div>
            <div className="mn" style={{fontSize:11,fontWeight:600,color:"#facc15"}}>{fmt(ma.gehalt)}</div>
            <div className="mn" style={{fontSize:11,fontWeight:600,color:G}}>{fmt(ma.netto)}</div>
            <div className="mn" style={{fontSize:10,color:"#555"}}>{fmtD(ma.einDatum)}</div>
            <div style={{display:"flex",gap:4}}>
              <button className="bp" style={{padding:"3px 7px",fontSize:10}} onClick={()=>setLohnMa(ma)}>📄</button>
              <button className="bg" style={{padding:"3px 7px",fontSize:10}} onClick={()=>{setForm({...ma});setView("edit")}}>✏️</button>
              <button className="br" style={{padding:"3px 7px",fontSize:10}} onClick={()=>setMitarbeiter(prev=>prev.filter(m=>m.id!==ma.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
        <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={()=>setView("list")}>← Zurück</button>
        <div style={{fontSize:18,fontWeight:700,color:"#fff"}}>{view==="edit"?"Mitarbeiter bearbeiten":"Neuer Mitarbeiter"}</div>
      </div>
      <div className="panel" style={{padding:18,maxWidth:600}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{gridColumn:"span 2"}}><label className="inp-lbl">Name</label><input className="inp-full" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Max Mustermann"/></div>
          <div><label className="inp-lbl">Beschäftigungsart</label><select className="inp-full" value={form.typ} onChange={e=>setForm(f=>({...f,typ:e.target.value,sv:e.target.value==="minijob"?0:21.6}))}>{TYPEN.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}</select></div>
          <div><label className="inp-lbl">Stelle</label><input className="inp-full" value={form.stelle} onChange={e=>setForm(f=>({...f,stelle:e.target.value}))} placeholder="z.B. Entwickler"/></div>
          <div><label className="inp-lbl">Bruttogehalt (€/Mo)</label><input className="inp-full" type="number" value={form.gehalt} onChange={e=>setForm(f=>({...f,gehalt:Number(e.target.value)}))}/></div>
          <div><label className="inp-lbl">Eintrittsdatum</label><input className="inp-full" type="date" value={form.einDatum} onChange={e=>setForm(f=>({...f,einDatum:e.target.value}))}/></div>
          <div><label className="inp-lbl">E-Mail</label><input className="inp-full" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="max@firma.de"/></div>
          <div><label className="inp-lbl">IBAN</label><input className="inp-full" value={form.iban} onChange={e=>setForm(f=>({...f,iban:e.target.value}))} placeholder="DE12 3456..."/></div>
          {form.typ!=="minijob"&&<>
            <div><label className="inp-lbl">SV AN (%)</label><input className="inp-full" type="number" step="0.1" value={form.sv} onChange={e=>setForm(f=>({...f,sv:Number(e.target.value)}))}/></div>
            <div><label className="inp-lbl">Lohnsteuer (€/Mo)</label><input className="inp-full" type="number" value={form.lohnst} onChange={e=>setForm(f=>({...f,lohnst:Number(e.target.value)}))}/></div>
          </>}
          <div><label className="inp-lbl">Urlaubstage/Jahr</label><input className="inp-full" type="number" value={form.urlaub} onChange={e=>setForm(f=>({...f,urlaub:Number(e.target.value),urlaubRest:Number(e.target.value)}))}/></div>
        </div>
        {form.gehalt>0&&<div className="ib" style={{marginTop:14,padding:12}}>
          <div style={{fontSize:11,fontWeight:600,color:G,marginBottom:6}}>Netto-Vorschau</div>
          <div style={{display:"flex",gap:16,fontSize:12}}>
            <span style={{color:"#777"}}>Brutto: <span className="mn" style={{color:"#facc15"}}>{fmt(form.gehalt)}</span></span>
            {form.typ!=="minijob"&&<span style={{color:"#777"}}>− Abzüge: <span className="mn" style={{color:"#f87171"}}>{fmt(form.gehalt*(form.sv/100)+form.lohnst)}</span></span>}
            <span style={{color:"#777"}}>Netto: <span className="mn" style={{color:G,fontWeight:700}}>{fmt(calcNetto(form.gehalt,form.typ,form.sv,form.lohnst))}</span></span>
          </div>
        </div>}
        <div style={{borderTop:"1px solid rgba(255,255,255,.07)",marginTop:14,paddingTop:14,display:"flex",gap:8}}>
          <button className="bp" style={{padding:"9px 18px",fontSize:13}} onClick={save}>💾 Speichern</button>
          <button className="bg" style={{padding:"9px 14px",fontSize:12}} onClick={()=>setView("list")}>Abbrechen</button>
        </div>
      </div>
    </div>
  );
}
