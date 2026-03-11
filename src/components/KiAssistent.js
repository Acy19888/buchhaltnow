import { useState, useRef, useEffect } from "react";
import { G, fmt, today, addDays } from "../utils/helpers";

const newId = pfx => `${pfx}-${Date.now()}`;

export default function KiAssistent({ rechnungen, setRechnungen, setTab, uf, isKU, periode }) {
  const [msgs,setMsgs]     = useState([{role:"assistant",text:"Hallo! Ich bin dein BuchhaltNow KI-Assistent.\n\nDiktiere eine Rechnung z.B.: 'Schreib Rechnung an Max GmbH, 10 Stunden Beratung à 250 EUR' – oder frag mich zu Steuern, MwSt und ELSTER!"}]);
  const [chatIn,setChatIn] = useState("");
  const [chatBusy,setChatBusy] = useState(false);
  const chatEnd = useRef(null);
  useEffect(()=>{ chatEnd.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const sendChat = async () => {
    if(!chatIn.trim()||chatBusy) return;
    const q = chatIn.trim(); setChatIn(""); setChatBusy(true);
    setMsgs(p=>[...p,{role:"user",text:q}]);
    try {
      const sys = `Du bist ein deutscher Steuer- und Buchhaltungsassistent (BuchhaltNow). Bei Rechnungsanfragen antworte NUR mit JSON: {"action":"rechnung","kunde":"...","positionen":[{"bezeichnung":"...","menge":N,"einzelpreis":N}],"mwstSatz":19}. Sonst antworte auf Deutsch, kurz und präzise.`;
      const history = msgs.slice(1).map(m=>({role:m.role,content:m.text}));
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[...history,{role:"user",content:q}]})});
      const data = await res.json();
      const text = data.content?.map(c=>c.text||"").join("")||"Fehler.";
      try {
        const parsed = JSON.parse(text.trim());
        if(parsed.action==="rechnung"){
          const netto=parsed.positionen.reduce((s,x)=>s+x.menge*x.einzelpreis,0);
          const mwst=netto*(parsed.mwstSatz/100);
          const id=newId("RE");
          const draft={id,typ:"rechnung",kunde:parsed.kunde,pos:parsed.positionen.map(x=>({bez:x.bezeichnung,menge:x.menge,ep:x.einzelpreis})),mwstSatz:parsed.mwstSatz,netto,mwst,betrag:netto+mwst,datum:today,faellig:addDays(today,30),zahlungsziel:30,status:"offen",email:""};
          setRechnungen(prev=>[...prev,draft]); setTab("rechnungen");
          setMsgs(prev=>[...prev,{role:"assistant",text:`✅ Rechnung für **${parsed.kunde}** erstellt!\nNetto: ${fmt(netto)} | MwSt: ${fmt(mwst)} | Brutto: ${fmt(netto+mwst)}\n\nSiehe Tab "Rechnungen".`}]);
        } else setMsgs(prev=>[...prev,{role:"assistant",text}]);
      } catch { setMsgs(prev=>[...prev,{role:"assistant",text}]); }
    } catch { setMsgs(prev=>[...prev,{role:"assistant",text:"Verbindungsfehler."}]); }
    setChatBusy(false);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 80px)"}}>
      <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:3}}>KI-Assistent</div>
      <div style={{color:"#555",fontSize:12,marginBottom:12}}>Steuerfragen, Rechnungen diktieren, ELSTER erklärt</div>
      <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        {["USt-Satz für Software?","Welche Betriebsausgaben?","Kleinunternehmer Vorteile?","Schreib Rechnung an Muster GmbH über 5 Stunden Beratung à 200 EUR"].map(q=>(
          <button key={q} className="bg" style={{padding:"5px 11px",fontSize:11}} onClick={()=>setChatIn(q)}>{q}</button>
        ))}
      </div>
      <div style={{flex:1,background:"#0b0b18",borderRadius:12,border:"1px solid rgba(255,255,255,.06)",padding:14,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,marginBottom:10}}>
        {msgs.map((m,i)=><div key={i} className={m.role==="user"?"cu":"ca"} style={{whiteSpace:"pre-wrap"}}>{m.text}</div>)}
        {chatBusy&&<div className="ca"><span className="pu">…</span></div>}
        <div ref={chatEnd}/>
      </div>
      <div style={{display:"flex",gap:9}}>
        <textarea rows={2} value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendChat())} placeholder="Frage stellen oder Rechnung diktieren… (Enter = Senden)"/>
        <button className="bp" style={{padding:"10px 18px",fontSize:14,alignSelf:"flex-end"}} onClick={sendChat} disabled={chatBusy}>→</button>
      </div>
    </div>
  );
}
