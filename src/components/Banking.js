import { useState } from "react";
import { G, fmt, fmtD } from "../utils/helpers";
import { BANKING_TX } from "../data/staticData";

export default function Banking() {
  const [bankKonto,setBankKonto]   = useState("alle");
  const [bankSyncing,setBankSyncing] = useState(false);
  const ppGeb   = BANKING_TX.filter(x=>x.konto==="paypal"&&x.gebuehr).reduce((s,x)=>s+Math.abs(x.betrag),0);
  const bankGef = BANKING_TX.filter(x=>bankKonto==="alle"||x.konto===bankKonto);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div><div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:2}}>Banking</div><div style={{color:"#555",fontSize:12}}>PSD2-Konten, Umsätze und Gebühren</div></div>
        <button className={`bp${bankSyncing?" shimmer":""}`} style={{padding:"9px 18px",fontSize:13,display:"flex",alignItems:"center",gap:8}} onClick={()=>{setBankSyncing(true);setTimeout(()=>setBankSyncing(false),2200);}}>
          <span style={{display:"inline-block",animation:bankSyncing?"spin 1s linear infinite":"none",transformOrigin:"center"}}>⟳</span>
          {bankSyncing?"Synchronisiere…":"Alle Konten sync"}
        </button>
      </div>
      {bankSyncing&&<div className="ib" style={{marginBottom:12,fontSize:12,display:"flex",gap:8,alignItems:"center"}}><span className="pu">⟳</span><span>Verbinde mit Commerzbank… N26… PayPal…</span></div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:13}}>
        {[
          {k:"commerzbank",n:"Commerzbank",   l:"🏦", extra:null},
          {k:"n26",        n:"N26 Business",  l:"📱", extra:null},
          {k:"paypal",     n:"PayPal Business",l:"💸",extra:`Transaktionsgeb.: ${fmt(ppGeb)}`},
        ].map((bk,i)=>{
          const sal = BANKING_TX.filter(x=>x.konto===bk.k).reduce((s,x)=>s+x.betrag,0);
          return (
            <div key={i} className="card panel" style={{padding:14,borderColor:"rgba(34,211,166,.16)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:18}}>{bk.l}</span><span className="bdg bv">Verbunden</span></div>
              <div style={{fontSize:12,fontWeight:600,color:"#fff",marginBottom:3}}>{bk.n}</div>
              <div className="mn" style={{fontSize:16,fontWeight:700,color:G,marginBottom:3}}>{fmt(sal)}</div>
              {bk.extra&&<div style={{fontSize:10,color:"#f87171"}}>{bk.extra}</div>}
              <button className="bg" style={{width:"100%",marginTop:8,padding:"5px",fontSize:10}} onClick={()=>{setBankSyncing(true);setTimeout(()=>setBankSyncing(false),1800);}}>⟳ Sync</button>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:7,marginBottom:11}}>
        {["alle","commerzbank","n26","paypal"].map(k=>(
          <button key={k} className={`fb${bankKonto===k?" on":""}`} onClick={()=>setBankKonto(k)}>
            {k==="alle"?"Alle Konten":k==="commerzbank"?"🏦 Commerzbank":k==="n26"?"📱 N26":"💸 PayPal"}
          </button>
        ))}
      </div>
      <div className="panel">
        <div className="tbl-hd" style={{gridTemplateColumns:"78px 22px 1fr 76px 105px 88px"}}>
          <div>Konto</div><div/><div>Transaktion</div><div>Datum</div><div>Zuordnung</div><div>Betrag</div>
        </div>
        {bankGef.map(tx=>(
          <div key={tx.id} className="tbl-row" style={{gridTemplateColumns:"78px 22px 1fr 76px 105px 88px"}}>
            <div style={{fontSize:10,color:"#555",display:"flex",alignItems:"center",gap:3}}>
              <span>{tx.konto==="commerzbank"?"🏦":tx.konto==="n26"?"📱":"💸"}</span>
              <span>{tx.konto==="commerzbank"?"Commerz":tx.konto}</span>
            </div>
            <div style={{width:18,height:18,borderRadius:4,background:tx.betrag>0?"rgba(34,211,166,.1)":tx.gebuehr?"rgba(80,80,80,.2)":"rgba(248,113,113,.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:tx.betrag>0?G:tx.gebuehr?"#666":"#f87171"}}>{tx.betrag>0?"↑":tx.gebuehr?"%":"↓"}</div>
            <div>
              <div style={{fontSize:11,color:"#e0e0f0"}}>{tx.text}</div>
              <div style={{fontSize:9,color:"#555"}}>{tx.ust}</div>
              {tx.ausland&&<span style={{fontSize:9,color:"#facc15"}}>⚠️ Auslandszahlung</span>}
            </div>
            <div className="mn" style={{fontSize:10,color:"#666"}}>{fmtD(tx.datum)}</div>
            <div style={{fontSize:10,color:tx.zuordnung?.startsWith("RE")?"#6396ff":G}}>{tx.zuordnung}</div>
            <div className="mn" style={{fontSize:11,fontWeight:600,color:tx.betrag>0?G:tx.gebuehr?"#94a3b8":"#f87171"}}>{tx.betrag>0?"+":""}{fmt(tx.betrag)}</div>
          </div>
        ))}
      </div>
      {ppGeb>0&&<div className="wb" style={{marginTop:9,fontSize:11,color:"#777"}}><span style={{fontWeight:600,color:"#facc15"}}>💡 PayPal-Gebühren ({fmt(ppGeb)}):</span> Betriebsausgaben §4 EStG, nicht umsatzsteuerpflichtig §4 Nr.8 UStG.</div>}
    </div>
  );
}
