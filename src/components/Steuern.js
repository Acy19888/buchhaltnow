import { useState } from "react";
import { G, fmt, filterPeriode, gwSt, kStFn, eStFn } from "../utils/helpers";
import { BELEGE_DATA, PERIODEN, STEUER_FRISTEN } from "../data/staticData";

const FRISTEN_PER_PAGE = 6;

export default function Steuern({ periode, uf, isKU, elsterFile }) {
  const [fristPage,setFristPage] = useState(0);
  const r   = filterPeriode(BELEGE_DATA, periode);
  const sl  = (PERIODEN.find(p=>p.val===periode)||{label:""}).label;

  const eN  = r.filter(x=>x.typ==="ausgang").reduce((s,x)=>s+x.netto,0);
  const aN  = r.filter(x=>x.typ==="eingang").reduce((s,x)=>s+x.netto,0);
  const gw2 = eN - aN;
  const u19e = r.filter(x=>x.typ==="ausgang"&&x.mwstSatz===19).reduce((s,x)=>s+x.mwst,0);
  const u7e  = r.filter(x=>x.typ==="ausgang"&&x.mwstSatz===7).reduce((s,x)=>s+x.mwst,0);
  const u19a = r.filter(x=>x.typ==="eingang"&&x.mwstSatz===19).reduce((s,x)=>s+x.mwst,0);
  const u7a  = r.filter(x=>x.typ==="eingang"&&x.mwstSatz===7).reduce((s,x)=>s+x.mwst,0);
  const us   = isKU ? 0 : (u19e+u7e)-(u19a+u7a);
  const euL  = r.filter(x=>x.eu&&x.typ==="ausgang");
  const gs   = gwSt(gw2);
  const st   = uf==="gmbh" ? kStFn(gw2) : eStFn(gw2);

  const fristenFiltered = STEUER_FRISTEN.filter(f=>!isKU||(f.art!=="USt-VA"&&f.art!=="ZM"));
  const fristenPages    = Math.ceil(fristenFiltered.length/FRISTEN_PER_PAGE);
  const fristenSlice    = fristenFiltered.slice(fristPage*FRISTEN_PER_PAGE,(fristPage+1)*FRISTEN_PER_PAGE);

  return (
    <div>
      <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:3}}>Steuern & ELSTER</div>
      <div style={{color:"#555",fontSize:12,marginBottom:14}}>Meldungen, Übermittlung und alle Fristen</div>
      {isKU&&<div className="ib" style={{marginBottom:12,fontSize:12,padding:"8px 13px"}}><span style={{fontWeight:600,color:G}}>§19 UStG aktiv</span> – keine USt-Voranmeldung nötig.</div>}
      {euL.length>0&&!isKU&&(
        <div className="eb" style={{marginBottom:12}}>
          <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
            <span>🇪🇺</span>
            <div style={{flex:1}}>
              <div style={{fontSize:12,fontWeight:600,color:"#a78bfa",marginBottom:3}}>ZM-Meldung (§18a UStG)</div>
              <div style={{fontSize:11,color:"#777",marginBottom:7}}>Innergemeinschaftliche Lieferungen müssen als ZM ans BZSt übermittelt werden.</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                {euL.map((x,i)=>(
                  <div key={i} style={{background:"rgba(167,139,250,.08)",borderRadius:6,padding:"4px 9px"}}>
                    <div style={{fontSize:9,color:"#a78bfa",fontWeight:600}}>EU {x.euLand} · {x.firma}</div>
                    <div className="mn" style={{fontSize:11,fontWeight:700,color:"#e0e0f0"}}>{fmt(x.betrag)}</div>
                  </div>
                ))}
              </div>
            </div>
            <button className="bp" style={{padding:"5px 10px",fontSize:11}}>ZM einreichen →</button>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {[
          {t:"USt-Voranmeldung",  s:sl, st:r.length>0?"Bereit":"Keine Daten", d:"10.04.2025", v:fmt(us),  c:"#facc15",e:"📋",hide:isKU},
          {t:uf==="gmbh"?"Körperschaftsteuer":"Einkommensteuer", s:"Jahreserklärung 2024", st:"In Vorbereitung", d:"31.07.2025", v:fmt(st), c:"#a78bfa",e:"📊"},
          {t:"Gewerbesteuer", s:"§11 GewStG ~400%", st:gw2>24500?"Bereit":"Unter Freibetrag", d:"15.05.2025", v:gw2>24500?fmt(gs):"Freibetrag", c:"#60a5fa",e:"🏢"},
          {t:"EÜR 2024", s:"Einnahmen-Überschuss", st:"Bereit", d:"31.07.2025", v:fmt(gw2), c:G, e:"📈"},
        ].filter(x=>!x.hide).map((it,i)=>(
          <div key={i} className="card panel" style={{padding:14}}>
            <div style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:9}}>
              <span style={{fontSize:16}}>{it.e}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:"#fff",marginBottom:2}}>{it.t}</div>
                <div style={{fontSize:10,color:"#555",marginBottom:4}}>{it.s}</div>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  <span className={`bdg ${it.st==="Bereit"?"bv":it.st.includes("Unter")?"bb":"bo"}`}>{it.st}</span>
                  <span className="mn" style={{fontSize:9,color:"#facc15"}}>Fällig: {it.d}</span>
                </div>
              </div>
              <div className="mn" style={{fontSize:12,fontWeight:700,color:it.c}}>{it.v}</div>
            </div>
            {it.st==="Bereit"&&<button className={!elsterFile?"bg":"bp"} style={{width:"100%",padding:7,fontSize:11}} onClick={()=>!elsterFile&&alert("Bitte ELSTER-Zertifikat in Einstellungen hochladen!")}>{elsterFile?"Via ELSTER übermitteln →":"🔒 Zertifikat in Einstellungen"}</button>}
          </div>
        ))}
      </div>
      <div className="panel">
        <div className="panel-hd">
          <span style={{fontSize:11,fontWeight:600,color:"#777"}}>Alle Steuerfristen 2025</span>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <span style={{fontSize:10,color:"#444"}}>{fristPage+1}/{fristenPages}</span>
            <button className="bg" style={{padding:"2px 7px",fontSize:11}} disabled={fristPage===0} onClick={()=>setFristPage(p=>p-1)}>‹</button>
            <button className="bg" style={{padding:"2px 7px",fontSize:11}} disabled={fristPage>=fristenPages-1} onClick={()=>setFristPage(p=>p+1)}>›</button>
          </div>
        </div>
        {fristenSlice.map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 16px",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
            <div style={{flex:1,fontSize:11,color:f.status==="erledigt"?"#444":"#aaa",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.t}</div>
            <span className={`bdg ${f.art==="USt-VA"?"bv":f.art==="GewSt"?"bb":f.art==="ESt"?"beu":f.art==="ZM"?"bai":"bo"}`} style={{fontSize:9,flexShrink:0}}>{f.art}</span>
            <span className="mn" style={{fontSize:10,color:f.status==="erledigt"?"#444":"#facc15",flexShrink:0,width:68,textAlign:"right"}}>{f.frist}</span>
            <span className={`bdg ${f.status==="erledigt"?"bv":"bo"}`} style={{fontSize:9,flexShrink:0}}>{f.status==="erledigt"?"✓":"Offen"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
