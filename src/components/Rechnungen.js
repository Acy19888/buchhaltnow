import { useState } from "react";
import { G, fmt, fmtD, today, addDays } from "../utils/helpers";
import Logo from "./Logo";

const newId = pfx => `${pfx}-${Date.now()}`;

export default function Rechnungen({ rechnungen, setRechnungen, produkte, isKU, setTab }) {
  const [view, setView] = useState("list");
  const [sel,  setSel]  = useState(null);
  const [form, setForm] = useState(null);

  const emptyRe = () => ({ id:newId("RE"), typ:"rechnung",  kunde:"", mwstSatz:isKU?0:19, datum:today, faellig:addDays(today,30), zahlungsziel:30, status:"offen", email:"", pos:[{bez:"",menge:1,ep:0}] });
  const emptyGs = ref  => ({ id:newId("GS"), typ:"gutschrift",kunde:"", mwstSatz:isKU?0:19, datum:today, faellig:addDays(today,30), zahlungsziel:30, status:"offen", email:"", pos:[{bez:"Gutschrift",menge:1,ep:0}], reRef:ref||"" });

  const calcTotals = (pos, mwstSatz) => {
    const netto = pos.reduce((s,p) => s + Number(p.menge)*Number(p.ep), 0);
    const mwst  = netto * (Number(mwstSatz)/100);
    return { netto, mwst, betrag: netto + mwst };
  };

  const BadgeRe = ({s, typ}) => {
    if(typ==="gutschrift") return <span className="bdg bu">Gutschrift</span>;
    const m = {bezahlt:"bv", offen:"bo", mahnung1:"bm", mahnung2:"br"};
    const l = {bezahlt:"Bezahlt", offen:"Offen", mahnung1:"Mahnung 1", mahnung2:"Mahnung 2"};
    return <span className={`bdg ${m[s]||"bdr"}`}>{l[s]||s}</span>;
  };

  const openNew  = () => { setForm(emptyRe());        setView("new"); };
  const openGs   = re  => { setForm(emptyGs(re?.id)); setView("new"); };
  const openEdit = re  => { setForm({...re, pos:[...re.pos.map(p=>({...p}))]}); setView("edit"); };
  const openPrev = re  => { setSel(re); setView("preview"); };

  const saveForm = () => {
    const totals = calcTotals(form.pos, form.mwstSatz);
    const saved  = { ...form, ...totals };
    if(view==="edit") setRechnungen(prev => prev.map(r => r.id===saved.id ? saved : r));
    else setRechnungen(prev => [...prev, saved]);
    setView("list");
  };

  const deleteRe = id => { setRechnungen(prev => prev.filter(r => r.id!==id)); setView("list"); };
  const setPos = (i, field, val) => setForm(f => ({ ...f, pos: f.pos.map((p,j) => j===i ? {...p,[field]:val} : p) }));
  const addPos    = () => setForm(f => ({ ...f, pos:[...f.pos,{bez:"",menge:1,ep:0}] }));
  const removePos = i  => setForm(f => ({ ...f, pos:f.pos.filter((_,j)=>j!==i) }));

  // ── LIST ──
  if(view==="list") return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:2}}>Rechnungen & Gutschriften</div>
          <div style={{color:"#555",fontSize:12}}>Erstellen, bearbeiten, versenden und Mahnungen verwalten</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="bu" style={{padding:"9px 15px",fontSize:12}} onClick={()=>openGs(null)}>+ Gutschrift</button>
          <button className="bp" style={{padding:"9px 15px",fontSize:12}} onClick={openNew}>+ Neue Rechnung</button>
        </div>
      </div>
      <div className="ib" style={{marginBottom:12,display:"flex",alignItems:"center",gap:10,padding:"9px 14px"}}>
        <span style={{fontSize:16}}>✦</span>
        <div style={{flex:1}}><span style={{fontSize:12,color:G,fontWeight:600}}>KI-Assistent: </span><span style={{fontSize:12,color:"#777"}}>Rechnung per Spracheingabe diktieren</span></div>
        <button className="bp" style={{padding:"5px 13px",fontSize:11,flexShrink:0}} onClick={()=>setTab("assistent")}>✦ Rechnung diktieren</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:12}}>
        {[
          {l:"Gesamt",    v:rechnungen.length+" Stk.", c:"#60a5fa"},
          {l:"Offen",     v:fmt(rechnungen.filter(r=>r.status==="offen").reduce((s,r)=>s+r.betrag,0)), c:"#facc15"},
          {l:"Bezahlt",   v:fmt(rechnungen.filter(r=>r.status==="bezahlt").reduce((s,r)=>s+Math.abs(r.betrag),0)), c:G},
          {l:"Mahnungen", v:rechnungen.filter(r=>r.status.includes("mahnung")).length+" Stk.", c:"#f87171"},
        ].map((k,i)=>(
          <div key={i} className="kpi"><div style={{fontSize:10,color:"#555",marginBottom:3}}>{k.l}</div><div className="mn" style={{fontSize:14,fontWeight:700,color:k.c}}>{k.v}</div></div>
        ))}
      </div>
      <div className="panel">
        <div className="tbl-hd" style={{gridTemplateColumns:"80px 1fr 80px 80px 90px 72px 120px"}}>
          <div>Nr.</div><div>Kunde</div><div>Datum</div><div>Fällig</div><div>Brutto</div><div>Status</div><div>Aktionen</div>
        </div>
        {rechnungen.map(re=>(
          <div key={re.id} className="tbl-row" style={{gridTemplateColumns:"80px 1fr 80px 80px 90px 72px 120px"}}>
            <div className="mn" style={{fontSize:10,color:"#6396ff"}}>{re.id}</div>
            <div><div style={{fontSize:12,fontWeight:500,color:"#e0e0f0"}}>{re.kunde||"—"}</div>{re.reRef&&<div style={{fontSize:9,color:"#6396ff"}}>Ref: {re.reRef}</div>}</div>
            <div className="mn" style={{fontSize:10,color:"#666"}}>{fmtD(re.datum)}</div>
            <div className="mn" style={{fontSize:10,color:"#666"}}>{fmtD(re.faellig)}</div>
            <div className="mn" style={{fontSize:11,fontWeight:600,color:re.typ==="gutschrift"?"#f87171":G}}>{re.typ==="gutschrift"?"-":""}{fmt(Math.abs(re.betrag))}</div>
            <BadgeRe s={re.status} typ={re.typ}/>
            <div style={{display:"flex",gap:4}}>
              <button className="bg" style={{padding:"3px 7px",fontSize:10}} onClick={()=>openPrev(re)}>👁</button>
              <button className="bg" style={{padding:"3px 7px",fontSize:10}} onClick={()=>openEdit(re)}>✏️</button>
              {re.typ==="rechnung"&&<button className="bu" style={{padding:"3px 7px",fontSize:10}} onClick={()=>openGs(re)}>GS</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── FORM ──
  if(view==="new"||view==="edit") {
    const totals = calcTotals(form?.pos||[], form?.mwstSatz||0);
    return (
      <div>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
          <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={()=>setView("list")}>← Zurück</button>
          <div style={{fontSize:18,fontWeight:700,color:"#fff"}}>{view==="edit"?"Rechnung bearbeiten":"Neue "+(form?.typ==="gutschrift"?"Gutschrift":"Rechnung")}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:14}}>
          <div className="panel" style={{padding:18}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              <div><label className="inp-lbl">Typ</label>
                <select className="inp-full" value={form.typ} onChange={e=>setForm(f=>({...f,typ:e.target.value}))}>
                  <option value="rechnung">Rechnung</option><option value="gutschrift">Gutschrift</option>
                </select>
              </div>
              <div><label className="inp-lbl">MwSt %</label>
                <select className="inp-full" value={form.mwstSatz} onChange={e=>setForm(f=>({...f,mwstSatz:Number(e.target.value)}))}>
                  {isKU&&<option value="0">0% (§19 UStG)</option>}
                  {!isKU&&<><option value="19">19%</option><option value="7">7%</option><option value="0">0% (EU/Drittland)</option></>}
                </select>
              </div>
              <div><label className="inp-lbl">Kunde</label><input className="inp-full" value={form.kunde} onChange={e=>setForm(f=>({...f,kunde:e.target.value}))} placeholder="Firmenname"/></div>
              <div><label className="inp-lbl">E-Mail</label><input className="inp-full" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="kunde@firma.de"/></div>
              <div><label className="inp-lbl">Datum</label><input className="inp-full" type="date" value={form.datum} onChange={e=>setForm(f=>({...f,datum:e.target.value,faellig:addDays(e.target.value,f.zahlungsziel)}))}/></div>
              <div><label className="inp-lbl">Zahlungsziel (Tage)</label><input className="inp-full" type="number" value={form.zahlungsziel} onChange={e=>setForm(f=>({...f,zahlungsziel:Number(e.target.value),faellig:addDays(f.datum,Number(e.target.value))}))}/></div>
              {form.typ==="gutschrift"&&<div style={{gridColumn:"span 2"}}><label className="inp-lbl">Referenz-Rechnung</label><input className="inp-full" value={form.reRef||""} onChange={e=>setForm(f=>({...f,reRef:e.target.value}))} placeholder="RE-2025-001"/></div>}
            </div>
            <div style={{marginBottom:10,fontSize:11,fontWeight:600,color:"#777",textTransform:"uppercase",letterSpacing:.6}}>Positionen</div>
            {form.pos.map((pos,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 60px 90px 30px",gap:8,marginBottom:8,alignItems:"center"}}>
                <input className="inp-full" value={pos.bez} onChange={e=>setPos(i,"bez",e.target.value)} placeholder="Bezeichnung"/>
                <input className="inp-full" type="number" value={pos.menge} onChange={e=>setPos(i,"menge",e.target.value)} placeholder="Menge"/>
                <input className="inp-full" type="number" value={pos.ep} onChange={e=>setPos(i,"ep",e.target.value)} placeholder="€/Stk."/>
                <button className="br" style={{padding:"4px",fontSize:14,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>removePos(i)}>×</button>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={addPos}>+ Position</button>
              {produkte.filter(p=>p.aktiv).length>0&&<select style={{fontSize:12}} onChange={e=>{const p=produkte.find(x=>x.id===Number(e.target.value));if(p)setForm(f=>({...f,pos:[...f.pos,{bez:p.name,menge:1,ep:p.ep}]}));e.target.value=""}}>
                <option value="">Aus Produkten…</option>
                {produkte.filter(p=>p.aktiv).map(p=><option key={p.id} value={p.id}>{p.name} – {fmt(p.ep)}</option>)}
              </select>}
            </div>
          </div>
          <div className="panel" style={{padding:16,alignSelf:"start"}}>
            <div style={{fontSize:11,fontWeight:600,color:"#777",marginBottom:12,textTransform:"uppercase",letterSpacing:.6}}>Zusammenfassung</div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:"#666"}}>Netto</span><span className="mn" style={{fontSize:12,color:"#e0e0f0"}}>{fmt(totals.netto)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:12,color:"#666"}}>MwSt {form.mwstSatz}%</span><span className="mn" style={{fontSize:12,color:"#facc15"}}>{fmt(totals.mwst)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:8,marginBottom:14}}><span style={{fontSize:13,fontWeight:700,color:"#fff"}}>Brutto</span><span className="mn" style={{fontSize:14,fontWeight:700,color:G}}>{fmt(totals.betrag)}</span></div>
            {isKU&&<div className="ib" style={{padding:"6px 10px",marginBottom:12,fontSize:10,color:G}}>§19 UStG: kein MwSt-Ausweis</div>}
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              <button className="bp" style={{padding:10,fontSize:13}} onClick={saveForm}>💾 Speichern</button>
              <button className="bg" style={{padding:9,fontSize:12}} onClick={()=>{saveForm();setSel(form);setView("preview");}}>👁 Vorschau</button>
              {view==="edit"&&<button className="br" style={{padding:8,fontSize:12}} onClick={()=>deleteRe(form.id)}>🗑 Löschen</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── PREVIEW ──
  if(view==="preview"&&sel) {
    const re = rechnungen.find(r=>r.id===sel.id)||sel;
    return (
      <div>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
          <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={()=>setView("list")}>← Zurück</button>
          <div style={{fontSize:18,fontWeight:700,color:"#fff"}}>Vorschau: {re.id}</div>
          <div style={{flex:1}}/>
          <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={()=>openEdit(re)}>✏️ Bearbeiten</button>
          <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={()=>alert(`PDF Download: ${re.id}.pdf`)}>📥 PDF</button>
          <button className="bp" style={{padding:"7px 12px",fontSize:12}} onClick={()=>alert(`E-Mail an: ${re.email||"(keine)"}`)}>📧 Senden</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:14}}>
          <div className="panel" style={{padding:24}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
              <Logo small/>
              <div style={{textAlign:"right"}}>
                <div className="mn" style={{fontSize:13,color:G,fontWeight:700}}>{re.id}</div>
                <div style={{fontSize:11,color:"#555"}}>{re.typ==="gutschrift"?"Gutschrift":"Rechnung"}</div>
                <div className="mn" style={{fontSize:11,color:"#666",marginTop:4}}>{fmtD(re.datum)}</div>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"#555",marginBottom:4}}>AN</div>
              <div style={{fontSize:14,fontWeight:600,color:"#fff"}}>{re.kunde}</div>
              {re.email&&<div style={{fontSize:12,color:"#666"}}>{re.email}</div>}
            </div>
            <div style={{border:"1px solid rgba(255,255,255,.07)",borderRadius:8,overflow:"hidden",marginBottom:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 60px 90px 90px",padding:"7px 12px",background:"rgba(255,255,255,.04)",fontSize:10,color:"#555",fontWeight:600}}>
                <div>BEZEICHNUNG</div><div>MENGE</div><div>EP (NETTO)</div><div style={{textAlign:"right"}}>GESAMT</div>
              </div>
              {re.pos.map((p,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 60px 90px 90px",padding:"8px 12px",borderTop:"1px solid rgba(255,255,255,.04)"}}>
                  <div style={{fontSize:12,color:"#e0e0f0"}}>{p.bez}</div>
                  <div className="mn" style={{fontSize:12,color:"#666"}}>{p.menge}</div>
                  <div className="mn" style={{fontSize:12,color:"#666"}}>{fmt(p.ep)}</div>
                  <div className="mn" style={{fontSize:12,color:"#fff",textAlign:"right"}}>{fmt(p.menge*p.ep)}</div>
                </div>
              ))}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{display:"flex",justifyContent:"flex-end",gap:16,marginBottom:4}}><span style={{fontSize:11,color:"#666"}}>Nettobetrag</span><span className="mn" style={{fontSize:11,color:"#e0e0f0",minWidth:90,textAlign:"right"}}>{fmt(re.netto)}</span></div>
              <div style={{display:"flex",justifyContent:"flex-end",gap:16,marginBottom:8}}><span style={{fontSize:11,color:"#666"}}>MwSt {re.mwstSatz}%</span><span className="mn" style={{fontSize:11,color:"#facc15",minWidth:90,textAlign:"right"}}>{fmt(re.mwst)}</span></div>
              <div style={{display:"flex",justifyContent:"flex-end",gap:16,borderTop:"1px solid rgba(255,255,255,.1)",paddingTop:8}}><span style={{fontSize:13,fontWeight:700,color:"#fff"}}>Bruttobetrag</span><span className="mn" style={{fontSize:14,fontWeight:700,color:G,minWidth:90,textAlign:"right"}}>{fmt(Math.abs(re.betrag))}</span></div>
            </div>
            {isKU&&<div style={{marginTop:14,fontSize:11,color:"#facc15"}}>Kein MwSt-Ausweis gemäß §19 UStG.</div>}
            <div style={{marginTop:12,fontSize:11,color:"#555"}}>Zahlungsziel: {re.zahlungsziel} Tage bis {fmtD(re.faellig)}</div>
          </div>
          <div className="panel" style={{padding:14,alignSelf:"start"}}>
            <div style={{fontSize:11,fontWeight:600,color:"#777",marginBottom:10,textTransform:"uppercase",letterSpacing:.6}}>Status & Aktionen</div>
            <select className="inp-full" value={re.status} onChange={e=>setRechnungen(prev=>prev.map(r=>r.id===re.id?{...r,status:e.target.value}:r))} style={{marginBottom:10}}>
              <option value="offen">Offen</option><option value="bezahlt">Bezahlt</option>
              <option value="mahnung1">Mahnung 1</option><option value="mahnung2">Mahnung 2</option>
            </select>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              <button className="bp" style={{padding:9,fontSize:12}} onClick={()=>alert(`E-Mail an ${re.email||"(keine)"}`)}>📧 Per E-Mail senden</button>
              <button className="bg" style={{padding:9,fontSize:12}} onClick={()=>alert(`PDF: ${re.id}.pdf`)}>📥 PDF Download</button>
              {re.status==="offen"&&<button className="bg" style={{padding:9,fontSize:12}} onClick={()=>setRechnungen(prev=>prev.map(r=>r.id===re.id?{...r,status:"mahnung1"}:r))}>⚠️ Mahnung 1 senden</button>}
              {re.status==="mahnung1"&&<button className="br" style={{padding:9,fontSize:12}} onClick={()=>setRechnungen(prev=>prev.map(r=>r.id===re.id?{...r,status:"mahnung2"}:r))}>🔴 Mahnung 2 senden</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
