import { useState } from "react";

const mockRechnungen = [
  { id: 1, typ: "eingang", firma: "Deutsche Telekom", betrag: 89.99, mwst: 14.37, datum: "2025-02-15", kategorie: "Kommunikation", status: "verarbeitet" },
  { id: 2, typ: "ausgang", firma: "Musterkunde GmbH", betrag: 2400.00, mwst: 384.00, datum: "2025-02-18", kategorie: "Dienstleistung", status: "offen" },
  { id: 3, typ: "eingang", firma: "BP Tankstelle", betrag: 68.40, mwst: 10.93, datum: "2025-02-20", kategorie: "Fahrtkosten", status: "verarbeitet" },
  { id: 4, typ: "ausgang", firma: "Tech Startup AG", betrag: 3800.00, mwst: 608.00, datum: "2025-02-22", kategorie: "Beratung", status: "bezahlt" },
  { id: 5, typ: "eingang", firma: "REWE Markt", betrag: 34.80, mwst: 2.78, datum: "2025-02-23", kategorie: "Büromaterial", status: "verarbeitet" },
  { id: 6, typ: "ausgang", firma: "Kreativ AG", betrag: 1200.00, mwst: 192.00, datum: "2025-03-01", kategorie: "Design", status: "offen" },
];

const UStIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
  </svg>
);

const ScanIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M3 7V5a2 2 0 012-2h2"/><path d="M17 3h2a2 2 0 012 2v2"/><path d="M21 17v2a2 2 0 01-2 2h-2"/><path d="M7 21H5a2 2 0 01-2-2v-2"/>
    <rect x="7" y="7" width="10" height="10" rx="1"/>
  </svg>
);

const BankIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M3 22V12M21 22V12M12 22V12M2 12l10-9 10 9M6 12v5M18 12v5M12 12v5"/>
  </svg>
);

const ElsterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M12 18v-6"/><path d="M9 15l3 3 3-3"/>
  </svg>
);

const DashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

const ArrowUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M12 19V5M5 12l7-7 7 7"/>
  </svg>
);

const ArrowDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M12 5v14M19 12l-7 7-7-7"/>
  </svg>
);

const nav = [
  { id: "dashboard", label: "Dashboard", icon: DashIcon },
  { id: "scan", label: "Scan / Import", icon: ScanIcon },
  { id: "belege", label: "Belege", icon: UStIcon },
  { id: "banking", label: "Banking", icon: BankIcon },
  { id: "steuer", label: "Steuern & Elster", icon: ElsterIcon },
];

const formatEuro = (n) => n.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [scanAnim, setScanAnim] = useState(false);
  const [scanDone, setScanDone] = useState(false);

  const einnahmen = mockRechnungen.filter(r => r.typ === "ausgang").reduce((s, r) => s + r.betrag, 0);
  const ausgaben = mockRechnungen.filter(r => r.typ === "eingang").reduce((s, r) => s + r.betrag, 0);
  const gewinn = einnahmen - ausgaben;
  const ustEinnahmen = mockRechnungen.filter(r => r.typ === "ausgang").reduce((s, r) => s + r.mwst, 0);
  const ustAusgaben = mockRechnungen.filter(r => r.typ === "eingang").reduce((s, r) => s + r.mwst, 0);
  const ustSchuld = ustEinnahmen - ustAusgaben;

  const handleScan = () => {
    setScanAnim(true);
    setTimeout(() => { setScanAnim(false); setScanDone(true); }, 2200);
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#0a0a0f",
      minHeight: "100vh",
      display: "flex",
      color: "#e8e8f0"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .nav-btn { transition: all 0.2s ease; }
        .nav-btn:hover { background: rgba(255,255,255,0.06) !important; }
        .nav-btn.active { background: rgba(52,211,153,0.12) !important; border-left: 2px solid #34d399 !important; }
        .card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important; }
        .scan-line { animation: scanMove 2s linear; }
        @keyframes scanMove { 0% { top: 10%; } 100% { top: 90%; } }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 600; }
        .tag-eingang { background: rgba(99,211,150,0.15); color: #63d396; }
        .tag-ausgang { background: rgba(99,150,255,0.15); color: #6396ff; }
        .tag-verarbeitet { background: rgba(52,211,153,0.15); color: #34d399; }
        .tag-offen { background: rgba(250,204,21,0.15); color: #facc15; }
        .tag-bezahlt { background: rgba(99,150,255,0.15); color: #6396ff; }
        .btn-primary { background: #34d399; color: #0a0a0f; border: none; padding: 10px 20px; border-radius: 8px; font-family: inherit; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: #6ee7b7; transform: translateY(-1px); }
        .btn-ghost { background: rgba(255,255,255,0.06); color: #e8e8f0; border: 1px solid rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 8px; font-family: inherit; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); }
        .progress-bar { background: #1e1e2e; border-radius: 99px; height: 6px; overflow: hidden; }
        .progress-fill { height: 100%; border-radius: 99px; transition: width 1s ease; }
        .ring { border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        input[type=file] { display: none; }
        .upload-zone { border: 2px dashed rgba(52,211,153,0.3); border-radius: 16px; padding: 40px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .upload-zone:hover { border-color: #34d399; background: rgba(52,211,153,0.05); }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 220, background: "#0d0d17", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", padding: "24px 0" }}>
        <div style={{ padding: "0 20px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #34d399, #059669)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16 }}>€</span>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>FinanzBot DE</div>
              <div style={{ fontSize: 10, color: "#34d399", fontFamily: "'DM Mono', monospace" }}>BETA</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {nav.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-btn${active === id ? " active" : ""}`}
              onClick={() => setActive(id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "2px solid transparent", background: "transparent", color: active === id ? "#34d399" : "#888", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: active === id ? 600 : 400, textAlign: "left", borderLeft: active === id ? "2px solid #34d399" : "2px solid transparent" }}>
              <Icon />
              {label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 11, color: "#555", marginBottom: 6 }}>Steuernummer</div>
          <div style={{ fontSize: 12, color: "#34d399", fontFamily: "'DM Mono', monospace" }}>123/456/78901</div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 8 }}>Q1 2025 aktiv</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", padding: 32 }}>

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Übersicht</h1>
                <p style={{ color: "#666", fontSize: 14 }}>Februar – März 2025 · Selbstständig (§ 18 EStG)</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={() => setActive("scan")}>+ Beleg hinzufügen</button>
                <button className="btn-primary" onClick={() => setActive("steuer")}>Zur Elster →</button>
              </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Einnahmen", val: formatEuro(einnahmen), sub: "brutto inkl. MwSt", color: "#34d399", icon: "↑" },
                { label: "Ausgaben", val: formatEuro(ausgaben), sub: "brutto inkl. MwSt", color: "#f87171", icon: "↓" },
                { label: "Gewinn (netto)", val: formatEuro(gewinn), sub: "vor Steuer", color: "#60a5fa", icon: "=" },
                { label: "USt-Schuld", val: formatEuro(ustSchuld), sub: "ans Finanzamt", color: "#facc15", icon: "!" },
              ].map((k, i) => (
                <div key={i} className="card" style={{ background: "#111120", borderRadius: 14, padding: 20, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: "#666", fontWeight: 500 }}>{k.label}</div>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${k.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: k.color, fontSize: 14, fontWeight: 700 }}>{k.icon}</div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: k.color, fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>{k.val}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>{k.sub}</div>
                </div>
              ))}
            </div>

            {/* USt Voranmeldung */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={{ background: "#111120", borderRadius: 14, padding: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Umsatzsteuer-Voranmeldung</div>
                {[
                  { label: "USt aus Ausgangsrechnungen", val: formatEuro(ustEinnahmen), color: "#34d399" },
                  { label: "Vorsteuer (Eingangsrechnungen)", val: `- ${formatEuro(ustAusgaben)}`, color: "#f87171" },
                  { label: "Zahllast ans Finanzamt", val: formatEuro(ustSchuld), color: "#facc15", bold: true },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <span style={{ fontSize: 13, color: "#888" }}>{r.label}</span>
                    <span style={{ fontSize: 14, fontWeight: r.bold ? 700 : 500, color: r.color, fontFamily: "'DM Mono', monospace" }}>{r.val}</span>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(250,204,21,0.08)", borderRadius: 8, border: "1px solid rgba(250,204,21,0.2)" }}>
                  <div style={{ fontSize: 12, color: "#facc15" }}>⚠️ Fällig am 10. April 2025</div>
                </div>
              </div>

              <div style={{ background: "#111120", borderRadius: 14, padding: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 20 }}>Gewinn & Verlust (EÜR)</div>
                {[
                  { label: "Betriebseinnahmen", pct: 100, val: formatEuro(einnahmen / 1.19), color: "#34d399" },
                  { label: "Betriebsausgaben", pct: Math.round((ausgaben / 1.19 / (einnahmen / 1.19)) * 100), val: `- ${formatEuro(ausgaben / 1.19)}`, color: "#f87171" },
                ].map((r, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: "#888" }}>{r.label}</span>
                      <span style={{ fontSize: 12, color: r.color, fontFamily: "'DM Mono', monospace" }}>{r.val}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 14, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>Jahresüberschuss</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#60a5fa", fontFamily: "'DM Mono', monospace" }}>{formatEuro((einnahmen - ausgaben) / 1.19)}</span>
                </div>
              </div>
            </div>

            {/* Recent */}
            <div style={{ background: "#111120", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Letzte Belege</span>
                <button onClick={() => setActive("belege")} style={{ fontSize: 12, color: "#34d399", background: "none", border: "none", cursor: "pointer" }}>Alle anzeigen →</button>
              </div>
              {mockRechnungen.slice(0, 4).map(r => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", gap: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: r.typ === "ausgang" ? "rgba(99,150,255,0.15)" : "rgba(52,211,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {r.typ === "ausgang" ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#e0e0f0" }}>{r.firma}</div>
                    <div style={{ fontSize: 11, color: "#666" }}>{r.datum} · {r.kategorie}</div>
                  </div>
                  <span className={`badge tag-${r.status}`}>{r.status}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: r.typ === "ausgang" ? "#34d399" : "#f87171", fontFamily: "'DM Mono', monospace" }}>
                      {r.typ === "ausgang" ? "+" : "-"}{formatEuro(r.betrag)}
                    </div>
                    <div style={{ fontSize: 11, color: "#555" }}>MwSt: {formatEuro(r.mwst)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCAN */}
        {active === "scan" && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Beleg scannen & importieren</h1>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>Foto aufnehmen, hochladen oder PDF importieren – KI erkennt alle Felder automatisch</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <label htmlFor="fileup">
                  <div className="upload-zone">
                    {!scanAnim && !scanDone && (
                      <>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>📷</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 8 }}>Beleg hochladen oder fotografieren</div>
                        <div style={{ fontSize: 13, color: "#666", marginBottom: 20 }}>JPG, PNG, PDF – bis 20 MB</div>
                        <button className="btn-primary" onClick={handleScan}>Jetzt scannen</button>
                      </>
                    )}
                    {scanAnim && (
                      <div style={{ position: "relative", height: 160 }}>
                        <div style={{ position: "absolute", width: "100%", height: 2, background: "#34d399", boxShadow: "0 0 16px #34d399" }} className="scan-line" />
                        <div style={{ fontSize: 13, color: "#34d399", paddingTop: 70 }} className="pulse">KI analysiert Beleg...</div>
                      </div>
                    )}
                    {scanDone && (
                      <>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#34d399", marginBottom: 8 }}>Beleg erkannt!</div>
                        <button className="btn-ghost" onClick={() => setScanDone(false)} style={{ marginTop: 8 }}>Neuer Scan</button>
                      </>
                    )}
                  </div>
                </label>
                <input type="file" id="fileup" accept="image/*,application/pdf" />

                <div style={{ marginTop: 20, background: "#111120", borderRadius: 12, padding: 20, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Import-Quellen</div>
                  {[
                    { label: "E-Mail (IMAP)", icon: "📧", sub: "Automatisch aus Postfach importieren", color: "#60a5fa" },
                    { label: "Google Drive", icon: "📁", sub: "PDF-Rechnungen synchronisieren", color: "#facc15" },
                    { label: "Datev-Export", icon: "📊", sub: ".csv / .xml importieren", color: "#a78bfa" },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none", cursor: "pointer" }}>
                      <span style={{ fontSize: 20 }}>{s.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#e0e0f0" }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: "#666" }}>{s.sub}</div>
                      </div>
                      <ChevronRight />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: "#111120", borderRadius: 14, padding: 24, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 20 }}>
                  {scanDone ? "🤖 KI-Erkennung – Bitte prüfen" : "Erkannte Felder"}
                </div>
                {[
                  { label: "Aussteller", val: scanDone ? "BP Tankstelle GmbH" : "–" },
                  { label: "Rechnungsdatum", val: scanDone ? "10.03.2025" : "–" },
                  { label: "Rechnungsnummer", val: scanDone ? "R-2025-0341" : "–" },
                  { label: "Nettobetrag", val: scanDone ? "57,48 €" : "–" },
                  { label: "MwSt (19%)", val: scanDone ? "10,92 €" : "–" },
                  { label: "Bruttobetrag", val: scanDone ? "68,40 €" : "–" },
                  { label: "Kategorie", val: scanDone ? "Fahrtkosten (§ 4 EStG)" : "–" },
                  { label: "Vorsteuerabzug", val: scanDone ? "Ja (100%)" : "–" },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 12, color: "#666" }}>{f.label}</span>
                    <span style={{ fontSize: 13, color: scanDone && f.val !== "–" ? "#e0e0f0" : "#444", fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>{f.val}</span>
                  </div>
                ))}
                {scanDone && (
                  <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
                    <button className="btn-primary" style={{ flex: 1 }}>Speichern ✓</button>
                    <button className="btn-ghost">Korrigieren</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BELEGE */}
        {active === "belege" && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Belege & Rechnungen</h1>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>Alle Ein- und Ausgangsrechnungen auf einen Blick</p>

            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              {["Alle", "Eingang", "Ausgang", "Offen", "Verarbeitet"].map(f => (
                <button key={f} className="btn-ghost" style={{ padding: "7px 14px", fontSize: 12 }}>{f}</button>
              ))}
            </div>

            <div style={{ background: "#111120", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 100px 120px 80px", padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                <div></div><div>Firma / Beschreibung</div><div>Datum</div><div>Kategorie</div><div>Betrag</div><div>Status</div>
              </div>
              {mockRechnungen.map((r, i) => (
                <div key={r.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr 120px 100px 120px 80px", padding: "14px 24px", borderBottom: i < mockRechnungen.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center", cursor: "pointer" }} className="card">
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: r.typ === "ausgang" ? "rgba(99,150,255,0.15)" : "rgba(52,211,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: r.typ === "ausgang" ? "#6396ff" : "#34d399" }}>
                    {r.typ === "ausgang" ? <ArrowUpIcon /> : <ArrowDownIcon />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#e0e0f0" }}>{r.firma}</div>
                    <div style={{ fontSize: 11, color: "#666" }}>MwSt: {formatEuro(r.mwst)}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", fontFamily: "'DM Mono', monospace" }}>{r.datum}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{r.kategorie}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: r.typ === "ausgang" ? "#34d399" : "#f87171", fontFamily: "'DM Mono', monospace" }}>
                    {r.typ === "ausgang" ? "+" : "-"}{formatEuro(r.betrag)}
                  </div>
                  <span className={`badge tag-${r.status}`}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BANKING */}
        {active === "banking" && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Banking verbinden</h1>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>Kontoumsätze automatisch abrufen und Belegen zuordnen (PSD2)</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
              {[
                { name: "Commerzbank", logo: "🏦", status: "Verbunden", balance: "8.420,00 €", color: "#34d399" },
                { name: "N26", logo: "📱", status: "Verbunden", balance: "1.250,50 €", color: "#34d399" },
                { name: "PayPal Business", logo: "💸", status: "Nicht verbunden", balance: "–", color: "#facc15" },
              ].map((b, i) => (
                <div key={i} className="card" style={{ background: "#111120", borderRadius: 14, padding: 22, border: `1px solid ${b.status === "Verbunden" ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.06)"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: 26 }}>{b.logo}</span>
                    <span className={`badge ${b.status === "Verbunden" ? "tag-verarbeitet" : "tag-offen"}`}>{b.status}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{b.name}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: b.color, fontFamily: "'DM Mono', monospace" }}>{b.balance}</div>
                  {b.status !== "Verbunden" && <button className="btn-ghost" style={{ marginTop: 14, width: "100%", padding: "8px", fontSize: 12 }}>Verbinden (PSD2)</button>}
                </div>
              ))}
            </div>

            <div style={{ background: "#111120", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Letzte Kontobewegungen – automatisch zugeordnet</div>
              </div>
              {[
                { text: "REWE SAGT DANKE", val: "-34,80 €", kat: "Büromaterial", match: "Rechnung #5", date: "23.02." },
                { text: "Incoming: TECH STARTUP AG", val: "+3.800,00 €", kat: "Beratung", match: "Rechnung #4", date: "22.02." },
                { text: "BP AUTOBAHN", val: "-68,40 €", kat: "Fahrtkosten", match: "Beleg #3", date: "20.02." },
                { text: "TELEKOM RECHNUNG", val: "-89,99 €", kat: "Kommunikation", match: "Rechnung #1", date: "15.02." },
              ].map((tx, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 24px", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none", gap: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: tx.val.startsWith("+") ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: tx.val.startsWith("+") ? "#34d399" : "#f87171", fontSize: 18 }}>
                    {tx.val.startsWith("+") ? "↑" : "↓"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#e0e0f0" }}>{tx.text}</div>
                    <div style={{ fontSize: 11, color: "#666" }}>{tx.date} · {tx.kat}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#34d399", background: "rgba(52,211,153,0.1)", padding: "2px 8px", borderRadius: 99 }}><CheckIcon /> {tx.match}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: tx.val.startsWith("+") ? "#34d399" : "#f87171", fontFamily: "'DM Mono', monospace" }}>{tx.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEUER / ELSTER */}
        {active === "steuer" && (
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Steuern & Elster-Übermittlung</h1>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>Vorbereitete Meldungen direkt ans Finanzamt übermitteln</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
              {[
                { title: "USt-Voranmeldung Q1/2025", status: "Bereit", fällig: "10.04.2025", betrag: formatEuro(ustSchuld), color: "#facc15", icon: "📋" },
                { title: "Einkommensteuer 2024", status: "In Vorbereitung", fällig: "31.07.2025", betrag: "~4.200 €", color: "#a78bfa", icon: "📊" },
                { title: "Gewerbesteuer 2024", status: "Ausstehend", fällig: "15.05.2025", betrag: "–", color: "#60a5fa", icon: "🏢" },
                { title: "EÜR 2024", status: "Bereit", fällig: "31.07.2025", betrag: formatEuro((einnahmen - ausgaben) / 1.19), color: "#34d399", icon: "📈" },
              ].map((t, i) => (
                <div key={i} className="card" style={{ background: "#111120", borderRadius: 14, padding: 22, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 16 }}>
                    <span style={{ fontSize: 24 }}>{t.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{t.title}</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className={`badge ${t.status === "Bereit" ? "tag-verarbeitet" : "tag-offen"}`}>{t.status}</span>
                        <span style={{ fontSize: 11, color: "#555" }}>Fällig: {t.fällig}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: t.color, fontFamily: "'DM Mono', monospace" }}>{t.betrag}</div>
                  </div>
                  {t.status === "Bereit" && (
                    <button className="btn-primary" style={{ width: "100%", padding: 10, fontSize: 13 }}>
                      Via Elster übermitteln →
                    </button>
                  )}
                  {t.status !== "Bereit" && (
                    <div style={{ fontSize: 12, color: "#555", padding: "8px 0" }}>Noch {t.status === "In Vorbereitung" ? "fehlende Daten ergänzen" : "Daten ausstehend"}</div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: 12, padding: 20, display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ fontSize: 28 }}>🔒</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#34d399", marginBottom: 4 }}>ELSTER-Zertifikat hinterlegt</div>
                <div style={{ fontSize: 13, color: "#888" }}>Alle Übermittlungen erfolgen verschlüsselt direkt an das Bundeszentralamt für Steuern. Keine Weitergabe an Dritte.</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
