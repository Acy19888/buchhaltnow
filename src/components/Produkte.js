import { useState } from "react";
import { G, fmt } from "../utils/helpers";

const KATS     = ["Dienstleistung","Software","Hardware","Schulung","Support","Sonstiges"];
const EINHEITEN = ["Stück","Stunde","Tag","Monat","Pauschal","kg","m","m²","Liter"];

export default function Produkte({ produkte, setProdukte }) {
  const [view,setView]         = useState("list");
  const [form,setForm]         = useState(null);
  const [importText,setImportText] = useState("");
  const [showImport,setShowImport] = useState(false);

  const emptyProd = () => ({id:Date.now(),name:"",einheit:"Stück",ep:0,mwstSatz:19,kat:"Dienstleistung",aktiv:true});

  const save = () => {
    if(view==="edit") setProdukte(prev=>prev.map(p=>p.id===form.id?form:p));
    else setProdukte(prev=>[...prev,form]);
    setView("list");
  };

  const doImport = () => {
    const lines = importText.split("\n").filter(l=>l.trim());
    const imported = lines.map((l,i)=>{
      const parts = l.split(";").map(s=>s.trim());
      return {id:Date.now()+i,name:parts[0]||"Produkt",einheit:parts[1]||"Stück",ep:Number(parts[2])||0,mwstSatz:Number(parts[3])||19,kat:parts[4]||"Sonstiges",aktiv:true};
    });
    setProdukte(prev=>[...prev,...imported]);
    setImportText(""); setShowImport(false);
  };

  if(view==="list") return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:2}}>Produkte & Leistungen</div><div style={{color:"#555",fontSize:12}}>Stammdaten für schnelle Rechnungsstellung</div></div>
        <div style={{display:"flex",gap:8}}>
          <button className="bg" style={{padding:"9px 14px",fontSize:12}} onClick={()=>setShowImport(v=>!v)}>📥 CSV-Import</button>
          <button className="bp" style={{padding:"9px 14px",fontSize:12}} onClick={()=>{setForm(emptyProd());setView("new")}}>+ Neues Produkt</button>
        </div>
      </div>
      {showImport&&(
        <div className="panel" style={{padding:14,marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,color:"#fff",marginBottom:6}}>CSV importieren</div>
          <div style={{fontSize:10,color:"#555",marginBottom:8}}>Format: Name;Einheit;Preis;MwSt%;Kategorie</div>
          <textarea rows={4} value={importText} onChange={e=>setImportText(e.target.value)} placeholder={"Strategieberatung;Stunde;250;19;Dienstleistung"}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <button className="bp" style={{padding:"7px 14px",fontSize:12}} onClick={doImport}>Importieren</button>
            <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={()=>setShowImport(false)}>Abbrechen</button>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:12}}>
        {[
          {l:"Produkte gesamt",v:produkte.length+" Stk.",c:"#60a5fa"},
          {l:"Aktiv",          v:produkte.filter(p=>p.aktiv).length+" Stk.",c:G},
          {l:"Ø Preis",       v:fmt(produkte.filter(p=>p.aktiv).reduce((s,p)=>s+p.ep,0)/(produkte.filter(p=>p.aktiv).length||1)),c:"#a78bfa"},
        ].map((k,i)=>(
          <div key={i} className="kpi"><div style={{fontSize:10,color:"#555",marginBottom:3}}>{k.l}</div><div className="mn" style={{fontSize:14,fontWeight:700,color:k.c}}>{k.v}</div></div>
        ))}
      </div>
      <div className="panel">
        <div className="tbl-hd" style={{gridTemplateColumns:"1fr 70px 100px 55px 100px 60px 90px"}}>
          <div>Name</div><div>Einheit</div><div>Preis (netto)</div><div>MwSt</div><div>Kategorie</div><div>Status</div><div>Aktionen</div>
        </div>
        {produkte.map(p=>(
          <div key={p.id} className="tbl-row" style={{gridTemplateColumns:"1fr 70px 100px 55px 100px 60px 90px",opacity:p.aktiv?1:.5}}>
            <div style={{fontSize:12,fontWeight:500,color:"#e0e0f0"}}>{p.name}</div>
            <div style={{fontSize:11,color:"#777"}}>{p.einheit}</div>
            <div className="mn" style={{fontSize:11,fontWeight:600,color:G}}>{fmt(p.ep)}</div>
            <div className="mn" style={{fontSize:11,color:"#facc15"}}>{p.mwstSatz}%</div>
            <div style={{fontSize:11,color:"#777"}}>{p.kat}</div>
            <span className={`bdg ${p.aktiv?"bv":"bdr"}`} style={{fontSize:9}}>{p.aktiv?"Aktiv":"Inaktiv"}</span>
            <div style={{display:"flex",gap:4}}>
              <button className="bg" style={{padding:"3px 8px",fontSize:10}} onClick={()=>{setForm({...p});setView("edit")}}>✏️</button>
              <button className="bg" style={{padding:"3px 8px",fontSize:10}} onClick={()=>setProdukte(prev=>prev.map(x=>x.id===p.id?{...x,aktiv:!x.aktiv}:x))}>{p.aktiv?"⏸":"▶"}</button>
              <button className="br" style={{padding:"3px 8px",fontSize:10}} onClick={()=>setProdukte(prev=>prev.filter(x=>x.id!==p.id))}>🗑</button>
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
        <div style={{fontSize:18,fontWeight:700,color:"#fff"}}>{view==="edit"?"Produkt bearbeiten":"Neues Produkt"}</div>
      </div>
      <div className="panel" style={{padding:18,maxWidth:540}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{gridColumn:"span 2"}}><label className="inp-lbl">Name</label><input className="inp-full" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="z.B. Strategieberatung"/></div>
          <div><label className="inp-lbl">Einheit</label><select className="inp-full" value={form.einheit} onChange={e=>setForm(f=>({...f,einheit:e.target.value}))}>{EINHEITEN.map(e=><option key={e} value={e}>{e}</option>)}</select></div>
          <div><label className="inp-lbl">Preis (netto)</label><input className="inp-full" type="number" value={form.ep} onChange={e=>setForm(f=>({...f,ep:Number(e.target.value)}))}/></div>
          <div><label className="inp-lbl">MwSt %</label><select className="inp-full" value={form.mwstSatz} onChange={e=>setForm(f=>({...f,mwstSatz:Number(e.target.value)}))}>
            <option value="19">19%</option><option value="7">7%</option><option value="0">0%</option>
          </select></div>
          <div><label className="inp-lbl">Kategorie</label><select className="inp-full" value={form.kat} onChange={e=>setForm(f=>({...f,kat:e.target.value}))}>{KATS.map(k=><option key={k} value={k}>{k}</option>)}</select></div>
          <div style={{gridColumn:"span 2",display:"flex",alignItems:"center",gap:8}}>
            <input type="checkbox" id="aktiv-chk" checked={form.aktiv} onChange={e=>setForm(f=>({...f,aktiv:e.target.checked}))} style={{width:16,height:16}}/>
            <label htmlFor="aktiv-chk" style={{fontSize:12,color:"#e0e0f0",cursor:"pointer"}}>Produkt aktiv</label>
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,.07)",marginTop:14,paddingTop:14,display:"flex",gap:8}}>
          <button className="bp" style={{padding:"9px 18px",fontSize:13}} onClick={save}>💾 Speichern</button>
          <button className="bg" style={{padding:"9px 14px",fontSize:12}} onClick={()=>setView("list")}>Abbrechen</button>
        </div>
      </div>
    </div>
  );
}
