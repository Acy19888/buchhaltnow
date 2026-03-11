import { useState } from "react";
import { G, fmt, fmtD, filterPeriode } from "../utils/helpers";
import { BELEGE_DATA, PERIODEN, KATEGORIEN } from "../data/staticData";

export default function BelegArchiv({ periode, setPeriode }) {
  const [belegeKat,setBelegeKat] = useState("Alle");
  const [belegeTyp,setBelegeTyp] = useState("Alle");
  const [trackEdit,setTrackEdit] = useState({});

  const belegeGef = filterPeriode(BELEGE_DATA, periode).filter(x=>{
    const tOk = belegeTyp==="Alle"||(belegeTyp==="Eingang"&&x.typ==="eingang")||(belegeTyp==="Ausgang"&&x.typ==="ausgang")||(belegeTyp==="EU"&&x.eu)||(belegeTyp==="Drittland"&&x.euTyp==="Drittland")||(belegeTyp==="KI-Prüfung"&&x.aiFlag);
    return tOk && (belegeKat==="Alle"||x.kategorie===belegeKat);
  });

  return (
    <div>
      <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:3}}>Beleg-Archiv</div>
      <div style={{color:"#555",fontSize:12,marginBottom:14}}>Alle Belege kategorisiert, durchsuchbar und herunterladbar</div>
      <div style={{display:"flex",gap:8,marginBottom:11,flexWrap:"wrap",alignItems:"center"}}>
        <select value={periode} onChange={e=>setPeriode(e.target.value)}>{PERIODEN.map(p=><option key={p.val} value={p.val}>{p.label}</option>)}</select>
        <select value={belegeKat} onChange={e=>setBelegeKat(e.target.value)}>{KATEGORIEN.map(k=><option key={k} value={k}>{k}</option>)}</select>
        {["Alle","Eingang","Ausgang","EU","Drittland","KI-Prüfung"].map(f=><button key={f} className={`fb${belegeTyp===f?" on":""}`} onClick={()=>setBelegeTyp(f)}>{f}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:11}}>
        {[
          {l:"Belege",    v:belegeGef.length+" Stk.", c:"#60a5fa"},
          {l:"Eingang",   v:fmt(belegeGef.filter(x=>x.typ==="eingang").reduce((s,x)=>s+x.betrag,0)), c:"#f87171"},
          {l:"Ausgang",   v:fmt(belegeGef.filter(x=>x.typ==="ausgang").reduce((s,x)=>s+x.betrag,0)), c:G},
          {l:"Vorsteuer", v:fmt(belegeGef.filter(x=>x.typ==="eingang").reduce((s,x)=>s+x.mwst,0)), c:"#60a5fa"},
          {l:"USt",       v:fmt(belegeGef.filter(x=>x.typ==="ausgang").reduce((s,x)=>s+x.mwst,0)), c:"#facc15"},
        ].map((k,i)=>(
          <div key={i} className="kpi"><div style={{fontSize:10,color:"#555",marginBottom:3}}>{k.l}</div><div className="mn" style={{fontSize:12,fontWeight:700,color:k.c}}>{k.v}</div></div>
        ))}
      </div>
      <div className="panel">
        <div className="tbl-hd" style={{gridTemplateColumns:"22px 1fr 74px 100px 48px 82px 80px 60px 68px"}}>
          <div/><div>Firma</div><div>Datum</div><div>Kategorie</div><div>MwSt%</div><div>MwSt €</div><div>Brutto</div><div>Status</div><div>PDF</div>
        </div>
        {belegeGef.map(x=>(
          <div key={x.id} className="tbl-row" style={{gridTemplateColumns:"22px 1fr 74px 100px 48px 82px 80px 60px 68px"}}>
            <div style={{width:18,height:18,borderRadius:4,background:x.typ==="ausgang"?"rgba(99,150,255,.12)":"rgba(34,211,166,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,color:x.typ==="ausgang"?"#6396ff":G,fontWeight:700}}>{x.typ==="ausgang"?"A":"E"}</div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
                <span style={{fontSize:11,fontWeight:500,color:"#e0e0f0"}}>{x.firma}</span>
                {x.eu&&x.euTyp==="EU"&&<span className="bdg beu" style={{fontSize:8}}>EU {x.euLand}</span>}
                {x.euTyp==="Drittland"&&<span className="bdg bdr" style={{fontSize:8}}>Drittland</span>}
                {x.aiFlag&&<span className="bdg bai" style={{fontSize:8}}>⚠️</span>}
              </div>
              <div style={{fontSize:9,color:"#333",fontFamily:"'DM Mono',monospace"}}>{x.datei}</div>
            </div>
            <div className="mn" style={{fontSize:10,color:"#666"}}>{fmtD(x.datum)}</div>
            <div style={{fontSize:10,color:"#666"}}>{x.kategorie}</div>
            <div className="mn" style={{fontSize:10,color:x.mwstSatz===0?"#a78bfa":x.mwstSatz===7?"#facc15":"#ccc"}}>{x.mwstSatz===0?"0%*":`${x.mwstSatz}%`}</div>
            <div className="mn" style={{fontSize:10,color:x.typ==="eingang"?"#60a5fa":"#facc15"}}>{x.mwst>0?fmt(x.mwst):"—"}</div>
            <div className="mn" style={{fontSize:11,fontWeight:600,color:x.typ==="ausgang"?G:"#f87171"}}>{x.typ==="ausgang"?"+":"−"}{fmt(x.betrag)}</div>
            <span className={`bdg ${x.status==="verarbeitet"?"bv":x.status==="bezahlt"?"bb":"bo"}`} style={{fontSize:9}}>{x.status}</span>
            <button className="bg" style={{padding:"2px 7px",fontSize:9}} onClick={()=>alert(`Download: ${x.datei}`)}>📥 PDF</button>
          </div>
        ))}
        <div style={{padding:"7px 16px",fontSize:10,color:"#444"}}>* 0% = Steuerfreie Lieferung</div>
      </div>
      <div className="panel" style={{marginTop:10}}>
        <div className="panel-hd"><span style={{fontSize:11,fontWeight:600,color:"#fff"}}>Versandnachweise – Auslandslieferungen</span></div>
        {BELEGE_DATA.filter(x=>x.eu||x.euTyp==="Drittland").map((x,i)=>(
          <div key={x.id} style={{display:"grid",gridTemplateColumns:"1fr 165px 125px",padding:"8px 16px",borderBottom:"1px solid rgba(255,255,255,.04)",alignItems:"center",gap:9}}>
            <div><div style={{fontSize:11,fontWeight:500,color:"#e0e0f0"}}>{x.firma}</div><div style={{fontSize:9,color:"#555"}}>{x.euTyp==="Drittland"?"Drittland §4 Nr.1a":"EU §17a UStDV"} · {fmtD(x.datum)}</div></div>
            <input placeholder="Tracking-Nr." value={trackEdit[x.id]??x.tracking??""} onChange={e=>setTrackEdit(t=>({...t,[x.id]:e.target.value}))} style={{fontSize:10}}/>
            <button className="bg" style={{padding:"5px 9px",fontSize:10}}>📎 Anhängen</button>
          </div>
        ))}
      </div>
    </div>
  );
}
