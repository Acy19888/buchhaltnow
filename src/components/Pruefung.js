import { useState } from "react";
import { G, fmtD } from "../utils/helpers";
import { BELEGE_DATA } from "../data/staticData";

export default function Pruefung() {
  const [pruefFile,setPruefFile]     = useState(null);
  const [pruefResult,setPruefResult] = useState(null);
  const [pruefLoading,setPruefLoading] = useState(false);
  const [pruefChat,setPruefChat]     = useState("");
  const [pruefChatMsgs,setPruefChatMsgs] = useState([]);
  const [pruefChatBusy,setPruefChatBusy] = useState(false);

  const startPruefung = async () => {
    setPruefLoading(true); setPruefResult(null);
    await new Promise(r=>setTimeout(r,2200));
    setPruefResult({
      betreff:"Betriebsprüfung Umsatzsteuer 2024 – Az. BP-2025-4471",
      zeitraum:"01.01.2024–31.12.2024", pruefer:"FA München-Mitte, SB Dr. Bergmann", termin:"15.04.2025",
      hinweis:"EU-Lieferungen: Gelangensbestätigungen und ZM-Meldungen bereithalten.",
      belege:[
        {id:4,  grund:"EU-Lieferung AT – Steuerfreiheit §4 Nr.1b UStG",       prio:"hoch"},
        {id:8,  grund:"EU-Lieferung FR – ZM-Meldung und Gelangensbestätigung", prio:"hoch"},
        {id:14, grund:"Drittland UK – Ausfuhranmeldung/Versandnachweis",       prio:"hoch"},
        {id:5,  grund:"Hotelrechnung – Vorsteuerabzug §15 UStG prüfen",        prio:"mittel"},
        {id:11, grund:"Bewirtungsbeleg – §4 Abs.5 Nr.2 EStG",                  prio:"mittel"},
      ]
    });
    setPruefLoading(false);
  };

  const sendPruefChat = async () => {
    if(!pruefChat.trim()||pruefChatBusy) return;
    const q = pruefChat.trim(); setPruefChat(""); setPruefChatBusy(true);
    setPruefChatMsgs(p=>[...p,{role:"user",text:q}]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,
          system:"Du bist ein Steuerexperte der bei deutschen Betriebsprüfungen hilft. Antworte kurz auf Deutsch.",
          messages:[...pruefChatMsgs.map(m=>({role:m.role,content:m.text})),{role:"user",content:q}]})});
      const data = await res.json();
      setPruefChatMsgs(p=>[...p,{role:"assistant",text:data.content?.map(c=>c.text||"").join("")||"Fehler."}]);
    } catch { setPruefChatMsgs(p=>[...p,{role:"assistant",text:"Verbindungsfehler."}]); }
    setPruefChatBusy(false);
  };

  return (
    <div>
      <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:3}}>Prüfungsassistent</div>
      <div style={{color:"#555",fontSize:12,marginBottom:16}}>KI analysiert deinen Betriebsprüfungsbescheid und bereitet alle Unterlagen vor</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
        {[
          {n:"1",icon:"📬",t:"Brief hochladen",  s:"Lade das Prüfungsschreiben vom Finanzamt hoch.", c:pruefFile?"bv":"bo"},
          {n:"2",icon:"🔍",t:"KI analysiert",    s:"Die KI erkennt Prüfungszeitraum und benötigte Belege.", c:pruefResult?"bv":pruefLoading?"bo":"bdr"},
          {n:"3",icon:"📦",t:"Unterlagen export",s:"Lade alle Belege als ZIP oder sende per E-Mail.", c:pruefResult?"bv":"bdr"},
        ].map((step,i)=>(
          <div key={i} className="panel" style={{padding:14,borderColor:step.c==="bv"?"rgba(34,211,166,.3)":step.c==="bo"?"rgba(250,204,21,.2)":"rgba(255,255,255,.06)"}}>
            <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:step.c==="bv"?"rgba(34,211,166,.2)":step.c==="bo"?"rgba(250,204,21,.15)":"rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:step.c==="bv"?G:step.c==="bo"?"#facc15":"#555",flexShrink:0}}>{step.c==="bv"?"✓":step.n}</div>
              <span style={{fontSize:13}}>{step.icon}</span>
              <div style={{fontSize:12,fontWeight:600,color:step.c==="bv"?G:step.c==="bo"?"#facc15":"#777"}}>{step.t}</div>
            </div>
            <div style={{fontSize:11,color:"#555",lineHeight:1.5}}>{step.s}</div>
            {step.n==="1"&&pruefLoading&&<div style={{marginTop:6,fontSize:10,color:"#facc15"}} className="pu">⟳ KI analysiert Brief…</div>}
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <div>
          <label htmlFor="pruef-upload">
            <div className="uz">
              {!pruefFile
                ?<><div style={{fontSize:28,marginBottom:6}}>📬</div><div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:4}}>Finanzamt-Brief hochladen</div><div style={{fontSize:11,color:"#555",marginBottom:10}}>PDF oder Foto</div><div className="bp" style={{display:"inline-block",padding:"7px 16px",fontSize:12,borderRadius:8}}>Datei wählen</div></>
                :<><div style={{fontSize:28,marginBottom:4}}>✅</div><div style={{fontSize:12,fontWeight:600,color:G}}>{pruefFile.name}</div><button className="bg" style={{marginTop:7,padding:"4px 11px",fontSize:11}} onClick={e=>{e.preventDefault();setPruefFile(null);setPruefResult(null);}}>Andere Datei</button></>}
            </div>
          </label>
          <input type="file" id="pruef-upload" accept="image/*,application/pdf" onChange={e=>{setPruefFile(e.target.files[0]);setPruefResult(null);}}/>
          {pruefFile&&!pruefResult&&<button className="bp" style={{width:"100%",padding:10,fontSize:12,marginTop:8}} disabled={pruefLoading} onClick={startPruefung}>{pruefLoading?"🔍 KI analysiert…":"🔍 Brief analysieren"}</button>}
        </div>
        <div className="panel" style={{display:"flex",flexDirection:"column"}}>
          <div className="panel-hd"><span style={{fontSize:11,fontWeight:600,color:"#fff"}}>Frage an den Assistenten</span></div>
          <div style={{flex:1,padding:10,overflowY:"auto",maxHeight:220,display:"flex",flexDirection:"column",gap:7}}>
            {pruefChatMsgs.length===0&&<div style={{fontSize:11,color:"#555",padding:6}}>z.B. "Welche Belege brauche ich für EU-Lieferungen?"</div>}
            {pruefChatMsgs.map((m,i)=><div key={i} className={m.role==="user"?"cu":"ca"} style={{whiteSpace:"pre-wrap"}}>{m.text}</div>)}
            {pruefChatBusy&&<div className="ca"><span className="pu">…</span></div>}
          </div>
          <div style={{padding:9,borderTop:"1px solid rgba(255,255,255,.06)",display:"flex",gap:7}}>
            <input value={pruefChat} onChange={e=>setPruefChat(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendPruefChat()} placeholder="Frage eingeben…" style={{flex:1,padding:"7px 10px",borderRadius:7}}/>
            <button className="bp" style={{padding:"7px 12px",fontSize:12}} onClick={sendPruefChat} disabled={pruefChatBusy}>→</button>
          </div>
        </div>
      </div>
      {pruefResult&&(
        <div>
          <div className="wb" style={{marginBottom:10,padding:12}}>
            <div style={{fontWeight:600,color:"#facc15",marginBottom:4,fontSize:12}}>📋 {pruefResult.betreff}</div>
            <div style={{fontSize:11,color:"#888",marginBottom:3}}>Zeitraum: {pruefResult.zeitraum} · Prüfer: {pruefResult.pruefer}</div>
            <div style={{fontSize:11,color:"#888",marginBottom:3}}>Termin: <span style={{color:"#facc15",fontWeight:600}}>{pruefResult.termin}</span></div>
            <div style={{fontSize:11,color:"#777"}}>{pruefResult.hinweis}</div>
          </div>
          <div className="panel">
            <div className="panel-hd"><span style={{fontSize:11,fontWeight:600,color:"#fff"}}>Relevante Belege ({pruefResult.belege.length})</span>
              <div style={{display:"flex",gap:7}}>
                <button className="bg" style={{padding:"4px 10px",fontSize:11}} onClick={()=>alert("ZIP wird erstellt…")}>📦 ZIP</button>
                <button className="bp" style={{padding:"4px 10px",fontSize:11}} onClick={()=>alert("E-Mail gesendet.")}>📧 An Prüfer</button>
              </div>
            </div>
            {pruefResult.belege.map((b,i)=>{
              const beleg = BELEGE_DATA.find(x=>x.id===b.id);
              return (
                <div key={i} style={{display:"grid",gridTemplateColumns:"56px 1fr 70px 70px",gap:9,padding:"8px 16px",borderBottom:"1px solid rgba(255,255,255,.04)",alignItems:"center"}}>
                  <span className={`bdg ${b.prio==="hoch"?"bm":b.prio==="mittel"?"bo":"bdr"}`} style={{textAlign:"center"}}>{b.prio}</span>
                  <div><div style={{fontSize:11,color:"#e0e0f0",fontWeight:500}}>{beleg?.firma||"Beleg #"+b.id}</div><div style={{fontSize:10,color:"#555"}}>{b.grund}</div></div>
                  <div className="mn" style={{fontSize:10,color:"#666"}}>{fmtD(beleg?.datum)}</div>
                  <button className="bg" style={{padding:"3px 8px",fontSize:10}} onClick={()=>alert(`Download: ${beleg?.datei}`)}>📥 PDF</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
