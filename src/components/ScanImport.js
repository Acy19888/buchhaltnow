import { useState } from "react";
import { G } from "../utils/helpers";
import { AI_Q } from "../data/staticData";

export default function ScanImport() {
  const [scanAnim,setScanAnim] = useState(false);
  const [scanDone,setScanDone] = useState(false);
  const [aiKey,setAiKey]       = useState(null);
  const [aiAns,setAiAns]       = useState({});
  const [aiDone,setAiDone]     = useState(false);

  const startAi = k => { setAiKey(k); setAiAns({}); setAiDone(false); };
  const ansAi   = (id,v) => {
    const n = {...aiAns,[id]:v};
    setAiAns(n);
    if(Object.keys(n).length >= AI_Q[aiKey].fragen.length) setTimeout(()=>setAiDone(true),300);
  };
  const priv = aiDone && aiKey && (aiAns["zweck"]==="Privat"||aiAns["wer"]==="Privat"||aiAns["anlass"]==="Kein Anlass");

  return (
    <div>
      <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:3}}>Beleg scannen & importieren</div>
      <div style={{color:"#555",fontSize:12,marginBottom:20}}>KI erkennt alle Felder und stellt Rückfragen bei steuerlich relevanten Belegen</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          {!aiKey?(
            <div>
              <label htmlFor="scan-upload">
                <div className="uz">
                  {!scanAnim&&!scanDone&&<div>
                    <div style={{fontSize:34,marginBottom:10}}>📷</div>
                    <div style={{fontSize:14,fontWeight:600,color:"#fff",marginBottom:7}}>Beleg hochladen oder fotografieren</div>
                    <div style={{fontSize:12,color:"#555",marginBottom:14}}>JPG, PNG, PDF – bis 20 MB</div>
                    <button className="bp" style={{padding:"9px 20px",fontSize:13}} onClick={e=>{e.preventDefault();setScanAnim(true);setTimeout(()=>{setScanAnim(false);setScanDone(true);},2200);}}>Jetzt scannen</button>
                  </div>}
                  {scanAnim&&<div style={{position:"relative",height:130}}>
                    <div style={{position:"absolute",width:"100%",height:2,background:G,boxShadow:`0 0 14px ${G}`}} className="pu"/>
                    <div style={{fontSize:12,color:G,paddingTop:55}} className="pu">KI analysiert Beleg...</div>
                  </div>}
                  {scanDone&&<div>
                    <div style={{fontSize:34,marginBottom:9}}>✅</div>
                    <div style={{fontSize:13,fontWeight:600,color:G,marginBottom:7}}>Beleg erkannt!</div>
                    <button className="bg" style={{padding:"7px 14px",fontSize:12}} onClick={e=>{e.preventDefault();setScanDone(false);}}>Neuer Scan</button>
                  </div>}
                </div>
              </label>
              <input type="file" id="scan-upload" accept="image/*,application/pdf" onChange={()=>{setScanAnim(true);setScanDone(false);setAiKey(null);setAiAns({});setAiDone(false);setTimeout(()=>{setScanAnim(false);setScanDone(true);},2200);}}/>
              <div style={{marginTop:12}}>
                <div style={{fontSize:11,color:"#555",marginBottom:7}}>KI-Rückfragen testen:</div>
                <div style={{display:"flex",gap:8}}>
                  <button className="bg" style={{padding:"7px 14px",fontSize:12}} onClick={()=>startAi("hotel")}>🏨 Hotelrechnung</button>
                  <button className="bg" style={{padding:"7px 14px",fontSize:12}} onClick={()=>startAi("restaurant")}>🍽️ Restaurantbeleg</button>
                </div>
              </div>
            </div>
          ):(
            <div className="panel" style={{padding:18,borderColor:"rgba(251,146,60,.25)"}}>
              <div style={{display:"flex",gap:9,alignItems:"center",marginBottom:14}}>
                <span style={{fontSize:16}}>🤖</span>
                <div><div style={{fontSize:12,fontWeight:600,color:"#fb923c"}}>KI-Steuerprüfung</div>
                <div style={{fontSize:10,color:"#555"}}>{AI_Q[aiKey].titel} · {AI_Q[aiKey].betrag} EUR</div></div>
              </div>
              {!aiDone ? AI_Q[aiKey].fragen.map((f,fi)=>{
                const ans=aiAns[f.id]; const prev=fi===0||aiAns[AI_Q[aiKey].fragen[fi-1].id];
                if(!prev) return null;
                return (
                  <div key={f.id} style={{marginBottom:14}}>
                    <div style={{fontSize:12,color:"#e0e0f0",marginBottom:9,lineHeight:1.5}}>
                      <span style={{color:"#fb923c",fontWeight:600}}>Frage {fi+1}: </span>{f.text}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      {f.opts.map(o=><button key={o} className={`ob${ans===o?" on":""}`} onClick={()=>ansAi(f.id,o)} disabled={!!ans}>{ans===o?"✓ ":""}{o}</button>)}
                    </div>
                  </div>
                );
              }) : (
                <div>
                  <div className={priv?"wb":"ib"} style={{marginBottom:12}}>
                    <div style={{fontSize:12,fontWeight:600,color:priv?"#facc15":G,marginBottom:4}}>{priv?"⚠️ Privatnutzung erkannt":"✅ Gewerblich – absetzbar"}</div>
                    <div style={{fontSize:11,color:"#777"}}>{priv?AI_Q[aiKey].nok:AI_Q[aiKey].ok}</div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button className="bp" style={{flex:1,padding:9,fontSize:12}} onClick={()=>alert("Beleg gespeichert ✅")}>✓ Speichern</button>
                    <button className="bg" style={{padding:9,fontSize:12}} onClick={()=>setAiKey(null)}>Abbrechen</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="panel" style={{padding:18}}>
          <div style={{fontSize:12,fontWeight:600,color:"#fff",marginBottom:13}}>Erkannte Felder</div>
          {[
            {l:"Aussteller",   v:scanDone?"BP Tankstelle GmbH":aiKey?AI_Q[aiKey].titel:"—"},
            {l:"Datum",        v:scanDone||aiKey?"10.03.2025":"—"},
            {l:"Nettobetrag",  v:scanDone?"749,58 EUR":aiKey==="hotel"?"1.200,00 EUR":aiKey?"785,05 EUR":"—"},
            {l:"MwSt-Satz",    v:scanDone?"19%":aiKey==="hotel"?"19%":aiKey==="restaurant"?"7%":"—"},
            {l:"MwSt-Betrag",  v:scanDone?"142,42 EUR":aiKey?AI_Q[aiKey].mwst+" EUR":"—"},
            {l:"Bruttobetrag", v:scanDone?"892,00 EUR":aiKey?AI_Q[aiKey].betrag+" EUR":"—"},
            {l:"KI-Kategorie", v:scanDone?"Fahrtkosten §4 EStG":aiKey==="hotel"?"Reisekosten (prüfen)":aiKey?"Bewirtung §4 (prüfen)":"—"},
            {l:"EU-Lieferung", v:scanDone||aiKey?"Nein":"—"},
            {l:"Vorsteuer",    v:scanDone?"100% abzugsfähig":aiKey&&aiDone?(priv?"Nicht abzugsfähig":"Abzugsfähig"):aiKey?"Wird geprüft…":"—"},
          ].map((f,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
              <span style={{fontSize:11,color:"#666"}}>{f.l}</span>
              <span className="mn" style={{fontSize:11,color:f.v!=="—"?"#e0e0f0":"#333"}}>{f.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
