import { useState } from "react";
import Logo from "./Logo";

export default function Login({ onLogin }) {
  const [u,setU]     = useState("");
  const [p,setP]     = useState("");
  const [err,setErr] = useState("");
  const [ld,setLd]   = useState(false);

  const go = async () => {
    setErr(""); setLd(true);
    await new Promise(r => setTimeout(r, 600));
    if(u === "admin" && p === "1234") onLogin();
    else { setErr("Benutzername oder Passwort falsch."); setLd(false); }
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#05050e"}}>
      <div style={{background:"#0f0f1e",border:"1px solid rgba(255,255,255,.08)",borderRadius:18,padding:"38px 34px",width:360}}>
        <div style={{textAlign:"center",marginBottom:26}}>
          <Logo/>
          <div style={{fontSize:12,color:"#444",marginTop:7}}>Buchhaltung für Selbstständige & KMU</div>
        </div>

        <label className="inp-lbl">Benutzername</label>
        <div style={{marginBottom:12}}>
          <input className="inp-full" value={u} onChange={e=>setU(e.target.value)} placeholder="admin" autoComplete="username"/>
        </div>

        <label className="inp-lbl">Passwort</label>
        <div style={{marginBottom:14}}>
          <input className="inp-full" type="password" value={p} onChange={e=>setP(e.target.value)}
            placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&go()}/>
        </div>

        {err && (
          <div style={{fontSize:12,color:"#f87171",marginBottom:10,padding:"8px 12px",background:"rgba(248,113,113,.08)",borderRadius:7}}>
            {err}
          </div>
        )}

        <button className="bp" style={{width:"100%",padding:12,fontSize:14,borderRadius:9}} onClick={go} disabled={ld}>
          {ld ? "Anmelden…" : "Anmelden →"}
        </button>

        <div style={{textAlign:"center",marginTop:16,fontSize:11,color:"#333"}}>
          Demo: <span style={{color:"#555"}}>admin / 1234</span>
        </div>
      </div>
    </div>
  );
}
