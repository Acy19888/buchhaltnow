import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────
const BELEGE_DATA = [
  { id:1,  typ:"eingang", firma:"Deutsche Telekom",        betrag:2380,  netto:2000,  mwstSatz:19, mwst:380,   datum:"2025-01-08", kategorie:"Kommunikation",    status:"verarbeitet", datei:"telekom_jan25.pdf" },
  { id:2,  typ:"ausgang", firma:"BMW Group München",       betrag:47600, netto:40000, mwstSatz:19, mwst:7600,  datum:"2025-01-15", kategorie:"Beratung",         status:"bezahlt",     datei:"re_bmw_001.pdf" },
  { id:3,  typ:"eingang", firma:"BP Tankstelle",           betrag:892,   netto:749,   mwstSatz:19, mwst:142,   datum:"2025-01-20", kategorie:"Fahrtkosten",      status:"verarbeitet", datei:"bp_jan25.pdf" },
  { id:4,  typ:"ausgang", firma:"Tech Startup AG",         betrag:38000, netto:38000, mwstSatz:0,  mwst:0,     datum:"2025-02-03", kategorie:"Software",         status:"bezahlt",     eu:true, euLand:"AT", euTyp:"EU", tracking:"", datei:"re_techstartup_at.pdf" },
  { id:5,  typ:"eingang", firma:"Hotel Vier Jahreszeiten", betrag:1428,  netto:1200,  mwstSatz:19, mwst:228,   datum:"2025-02-10", kategorie:"Reisekosten",      status:"verarbeitet", aiFlag:true, datei:"hotel_feb25.pdf" },
  { id:6,  typ:"ausgang", firma:"Siemens AG",              betrag:59500, netto:50000, mwstSatz:19, mwst:9500,  datum:"2025-02-14", kategorie:"Beratung",         status:"offen",       datei:"re_siemens_002.pdf" },
  { id:7,  typ:"eingang", firma:"Amazon Business",         betrag:3570,  netto:3000,  mwstSatz:19, mwst:570,   datum:"2025-02-20", kategorie:"Büroausstattung",  status:"verarbeitet", datei:"amazon_feb25.pdf" },
  { id:8,  typ:"ausgang", firma:"Paris Design SARL",       betrag:28500, netto:28500, mwstSatz:0,  mwst:0,     datum:"2025-03-01", kategorie:"Designleistung",   status:"bezahlt",     eu:true, euLand:"FR", euTyp:"EU", tracking:"DHL-EU-88234", datei:"re_paris_fr.pdf" },
  { id:9,  typ:"ausgang", firma:"Volkswagen Konzern",      betrag:71400, netto:60000, mwstSatz:19, mwst:11400, datum:"2025-03-05", kategorie:"Beratung",         status:"offen",       datei:"re_vw_003.pdf" },
  { id:10, typ:"eingang", firma:"Steuerberater Müller",    betrag:2975,  netto:2500,  mwstSatz:19, mwst:475,   datum:"2025-03-08", kategorie:"Beratungskosten",  status:"offen",       datei:"stb_mar25.pdf" },
  { id:11, typ:"eingang", firma:"Restaurant Maier GmbH",   betrag:840,   netto:785,   mwstSatz:7,  mwst:55,    datum:"2025-03-10", kategorie:"Bewirtungskosten", status:"verarbeitet", aiFlag:true, datei:"restaurant_mar25.pdf" },
  { id:12, typ:"ausgang", firma:"Deutsche Bank AG",        betrag:35700, netto:30000, mwstSatz:19, mwst:5700,  datum:"2025-03-12", kategorie:"IT-Consulting",    status:"bezahlt",     datei:"re_db_004.pdf" },
  { id:13, typ:"eingang", firma:"DHL Express",             betrag:714,   netto:600,   mwstSatz:19, mwst:114,   datum:"2025-03-15", kategorie:"Versandkosten",    status:"verarbeitet", datei:"dhl_mar25.pdf" },
  { id:14, typ:"ausgang", firma:"NovaTech Ltd (UK)",       betrag:15000, netto:15000, mwstSatz:0,  mwst:0,     datum:"2025-03-18", kategorie:"IT-Consulting",    status:"bezahlt",     euTyp:"Drittland", tracking:"UPS-INT-44821", datei:"re_novatech_uk.pdf" },
  { id:15, typ:"eingang", firma:"Bürohaus GmbH (Miete)",   betrag:3808,  netto:3200,  mwstSatz:19, mwst:608,   datum:"2025-03-01", kategorie:"Miete/Pacht",      status:"verarbeitet", datei:"miete_mar25.pdf" },
];

const BANKING_TX = [
  { id:1,  konto:"commerzbank", datum:"2025-03-12", text:"Gutschrift DEUTSCHE BANK AG",           betrag:35700,  zuordnung:"RE-2025-004", ust:"USt 5.700 EUR (19%)" },
  { id:2,  konto:"commerzbank", datum:"2025-03-10", text:"Lastschrift BÜROAREAL GMBH",            betrag:-3808,  zuordnung:"Beleg #15",   ust:"Vorsteuer 608 EUR (19%)" },
  { id:3,  konto:"commerzbank", datum:"2025-03-08", text:"Lastschrift STEUERBERATER MUELLER",     betrag:-2975,  zuordnung:"Beleg #10",   ust:"Vorsteuer 475 EUR (19%)" },
  { id:4,  konto:"commerzbank", datum:"2025-03-05", text:"Auslandsüberweisung NOVATECH UK",       betrag:-150,   zuordnung:"Auslandsgebühr", ust:"Bankgebühr §4 Nr.8 UStG", gebuehr:true, ausland:true },
  { id:5,  konto:"commerzbank", datum:"2025-03-01", text:"Eingang PARIS DESIGN SARL FR",          betrag:28500,  zuordnung:"RE-2025-003", ust:"Steuerfreie EU-Lieferung" },
  { id:6,  konto:"commerzbank", datum:"2025-02-14", text:"Gutschrift BMW GROUP MÜNCHEN",          betrag:47600,  zuordnung:"RE-2025-001", ust:"USt 7.600 EUR (19%)" },
  { id:7,  konto:"commerzbank", datum:"2025-02-10", text:"Lastschrift HOTEL VIER JAHRESZEITEN",   betrag:-1428,  zuordnung:"Beleg #5",    ust:"Vorsteuer 228 EUR – Prüfung!" },
  { id:8,  konto:"commerzbank", datum:"2025-01-15", text:"Lastschrift DEUTSCHE TELEKOM",          betrag:-2380,  zuordnung:"Beleg #1",    ust:"Vorsteuer 380 EUR (19%)" },
  { id:9,  konto:"n26",         datum:"2025-03-18", text:"Eingang NOVATECH LTD UK",               betrag:15000,  zuordnung:"Drittland-RE", ust:"Steuerfrei §4 Nr.1a UStG" },
  { id:10, konto:"n26",         datum:"2025-03-15", text:"Auslandsüberweisung USD Transfer",      betrag:-85,    zuordnung:"Wechselkursgebühr", ust:"Bankgebühr", gebuehr:true, ausland:true },
  { id:11, konto:"n26",         datum:"2025-02-03", text:"Eingang TECH STARTUP AG AT",            betrag:38000,  zuordnung:"Beleg #4",    ust:"Steuerfreie EU-Lieferung" },
  { id:12, konto:"paypal",      datum:"2025-03-20", text:"Zahlung erhalten Kunde XY",             betrag:500,    zuordnung:"Online-Verkauf", ust:"USt 79,83 EUR (19%)" },
  { id:13, konto:"paypal",      datum:"2025-03-20", text:"PayPal Transaktionsgebühr",             betrag:-17.65, zuordnung:"Gebühr",      ust:"PayPal-Gebühr §4 Nr.8 UStG", gebuehr:true },
  { id:14, konto:"paypal",      datum:"2025-03-15", text:"Zahlung erhalten Firma AB",             betrag:1190,   zuordnung:"Software-Lizenz", ust:"USt 190 EUR (19%)" },
  { id:15, konto:"paypal",      datum:"2025-03-15", text:"PayPal Transaktionsgebühr",             betrag:-39.90, zuordnung:"Gebühr",      ust:"PayPal-Gebühr §4 Nr.8 UStG", gebuehr:true },
];

const INIT_RE = [
  { id:"RE-2025-001", typ:"rechnung",  kunde:"BMW Group München",       betrag:47600, netto:40000, mwst:7600,  mwstSatz:19, datum:"2025-01-15", faellig:"2025-02-14", status:"bezahlt",  pos:[{bez:"Strategieberatung Q4",menge:1,ep:40000}],   zahlungsziel:30, email:"einkauf@bmw.de" },
  { id:"RE-2025-002", typ:"rechnung",  kunde:"Siemens AG",              betrag:59500, netto:50000, mwst:9500,  mwstSatz:19, datum:"2025-02-14", faellig:"2025-03-16", status:"mahnung1", pos:[{bez:"IT-Beratung Feb",menge:100,ep:500}],         zahlungsziel:30, email:"ap@siemens.com" },
  { id:"RE-2025-003", typ:"rechnung",  kunde:"Paris Design SARL (FR)",  betrag:28500, netto:28500, mwst:0,     mwstSatz:0,  datum:"2025-03-01", faellig:"2025-03-31", status:"bezahlt",  pos:[{bez:"Designleistung EU",menge:1,ep:28500}],        zahlungsziel:30, email:"factures@parisdesign.fr" },
  { id:"RE-2025-004", typ:"rechnung",  kunde:"Volkswagen Konzern",      betrag:71400, netto:60000, mwst:11400, mwstSatz:19, datum:"2025-03-05", faellig:"2025-04-04", status:"offen",    pos:[{bez:"Beratung März",menge:120,ep:500}],            zahlungsziel:30, email:"rechnungen@vw.de" },
  { id:"GS-2025-001", typ:"gutschrift",kunde:"BMW Group München",       betrag:-2380, netto:-2000, mwst:-380,  mwstSatz:19, datum:"2025-02-01", faellig:"2025-03-03", status:"bezahlt",  pos:[{bez:"Gutschrift: Retoure Software",menge:1,ep:-2000}], zahlungsziel:30, email:"einkauf@bmw.de", reRef:"RE-2025-001" },
];

const INIT_PRODUKTE = [
  { id:1, name:"Strategieberatung",       einheit:"Stunde",   ep:250,  mwstSatz:19, kat:"Dienstleistung", aktiv:true  },
  { id:2, name:"IT-Consulting",           einheit:"Stunde",   ep:180,  mwstSatz:19, kat:"Dienstleistung", aktiv:true  },
  { id:3, name:"Softwarelizenz Standard", einheit:"Stück",    ep:990,  mwstSatz:19, kat:"Software",       aktiv:true  },
  { id:4, name:"Softwarelizenz Pro",      einheit:"Stück",    ep:1990, mwstSatz:19, kat:"Software",       aktiv:true  },
  { id:5, name:"Projektpauschale klein",  einheit:"Pauschal", ep:5000, mwstSatz:19, kat:"Dienstleistung", aktiv:true  },
  { id:6, name:"Schulung (halbtags)",     einheit:"Tag",      ep:800,  mwstSatz:19, kat:"Schulung",       aktiv:true  },
  { id:7, name:"Schulung (ganztags)",     einheit:"Tag",      ep:1500, mwstSatz:19, kat:"Schulung",       aktiv:true  },
  { id:8, name:"Wartungspaket",           einheit:"Monat",    ep:350,  mwstSatz:19, kat:"Support",        aktiv:false },
];

const INIT_MA = [
  { id:1, name:"Anna Schmidt", typ:"vollzeit", stelle:"Senior Entwicklerin", gehalt:4800, sv:21.6, lohnst:780, netto:3270, einDatum:"2024-01-01", email:"anna.schmidt@firma.de", iban:"DE44500105175407324931", urlaub:30, urlaubRest:18 },
  { id:2, name:"Tom Meyer",    typ:"teilzeit", stelle:"Designer (20h/Wo)",   gehalt:2400, sv:10.8, lohnst:200, netto:1850, einDatum:"2024-03-15", email:"tom.meyer@firma.de",    iban:"DE89370400440532013000", urlaub:15, urlaubRest:9  },
  { id:3, name:"Lisa Braun",   typ:"minijob",  stelle:"Bürohilfe",           gehalt:556,  sv:0,    lohnst:0,   netto:556,  einDatum:"2024-06-01", email:"lisa.braun@gmail.com",  iban:"DE02200400600006130000", urlaub:0,  urlaubRest:0  },
];

const PERIODEN = [
  {label:"Januar 2025",        val:"2025-01", typ:"monat"},
  {label:"Februar 2025",       val:"2025-02", typ:"monat"},
  {label:"März 2025",          val:"2025-03", typ:"monat"},
  {label:"Q1 2025 (Jan–Mär)",  val:"2025-Q1", typ:"quartal"},
  {label:"Q2 2025 (Apr–Jun)",  val:"2025-Q2", typ:"quartal"},
  {label:"Q3 2025 (Jul–Sep)",  val:"2025-Q3", typ:"quartal"},
  {label:"Q4 2025 (Okt–Dez)",  val:"2025-Q4", typ:"quartal"},
  {label:"Gesamtjahr 2025",    val:"2025",     typ:"jahr"},
];

const KATEGORIEN = ["Alle","Beratung","IT-Consulting","Software","Kommunikation","Fahrtkosten","Reisekosten","Bewirtungskosten","Büroausstattung","Beratungskosten","Versandkosten","Miete/Pacht","Designleistung","Sonstiges"];

const STEUER_FRISTEN = [
  {t:"USt-VA Januar",    sub:"Umsatzsteuervoranmeldung 01/2025", frist:"10.02.2025", art:"USt-VA", status:"erledigt"},
  {t:"USt-VA Februar",   sub:"Umsatzsteuervoranmeldung 02/2025", frist:"10.03.2025", art:"USt-VA", status:"erledigt"},
  {t:"GewSt Q1",         sub:"Gewerbesteuer-Vorauszahlung Q1",   frist:"15.03.2025", art:"GewSt",  status:"erledigt"},
  {t:"ESt Q1",           sub:"Einkommensteuer-Vorauszahlung Q1", frist:"10.03.2025", art:"ESt",    status:"erledigt"},
  {t:"USt-VA März",      sub:"Umsatzsteuervoranmeldung 03/2025", frist:"10.04.2025", art:"USt-VA", status:"offen"},
  {t:"ZM Q1/2025",       sub:"Zusammenfassende Meldung §18a",    frist:"25.04.2025", art:"ZM",     status:"offen"},
  {t:"GewSt Q2",         sub:"Gewerbesteuer-Vorauszahlung Q2",   frist:"15.06.2025", art:"GewSt",  status:"offen"},
  {t:"ESt Q2",           sub:"Einkommensteuer-Vorauszahlung Q2", frist:"10.06.2025", art:"ESt",    status:"offen"},
  {t:"EStE 2024",        sub:"Einkommensteuererklärung §149 AO", frist:"31.07.2025", art:"Jahres", status:"offen"},
  {t:"GewStE 2024",      sub:"Gewerbesteuererklärung §14a",      frist:"31.07.2025", art:"Jahres", status:"offen"},
  {t:"UStJE 2024",       sub:"Umsatzsteuerjahreserklärung §18",  frist:"31.07.2025", art:"Jahres", status:"offen"},
  {t:"KStE 2024",        sub:"Körperschaftsteuer GmbH §31 KStG", frist:"31.07.2025", art:"Jahres", status:"offen"},
];

const AI_Q = {
  hotel:{
    titel:"Hotel Vier Jahreszeiten", betrag:"1.428,00", mwst:"228,00",
    fragen:[
      {id:"zweck",   text:"Zweck der Übernachtung?",         opts:["Kundentermin","Messe/Konferenz","Teammeeting","Privat"]},
      {id:"nachweis",text:"Liegt ein Kundennachweis vor?",   opts:["Ja, dokumentiert","Ja, Konferenzprogramm","Nein"]},
    ],
    ok:"Reisekosten (§4 Abs.5 EStG) – voll absetzbar, Vorsteuer 100% abzugsfähig",
    nok:"Privatentnahme – nicht absetzbar",
  },
  restaurant:{
    titel:"Restaurant Maier GmbH", betrag:"840,00", mwst:"54,95",
    fragen:[
      {id:"wer",    text:"Teilnehmer der Bewirtung?",   opts:["Nur Mitarbeiter","Kunden/Geschäftspartner","Gemischt","Privat"]},
      {id:"anlass", text:"Geschäftlicher Anlass?",      opts:["Kundengespräch","Projektbesprechung","Teamessen","Kein Anlass"]},
    ],
    ok:"Bewirtungskosten (§4 Abs.5 Nr.2 EStG) – 70% absetzbar",
    nok:"Privatentnahme – nicht absetzbar",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmt   = n => Number(n).toLocaleString("de-DE",{style:"currency",currency:"EUR"});
const fmtD  = s => { if(!s) return "—"; const [y,m,d]=s.split("-"); return `${d}.${m}.${y}`; };
const G     = "#22D3A6";
const today = new Date().toISOString().slice(0,10);
const addDays = (d,n) => new Date(new Date(d).getTime()+n*86400000).toISOString().slice(0,10);
const newId   = pfx => `${pfx}-${Date.now()}`;

function fp(list, p) {
  if(p==="2025") return list;
  if(p.includes("Q")) {
    const [y,q] = p.split("-");
    const m = {Q1:["01","02","03"],Q2:["04","05","06"],Q3:["07","08","09"],Q4:["10","11","12"]};
    return list.filter(r=>{ const [ry,rm]=r.datum.split("-"); return ry===y && m[q] && m[q].includes(rm); });
  }
  return list.filter(r => r.datum && r.datum.startsWith(p));
}

const gwSt  = g => g > 0 ? Math.max(0, g - 24500) * 0.035 * 4.0 : 0;
const kStFn = g => g > 0 ? g * 0.15 * 1.055 : 0;
const eStFn = g => { if(g<=11604) return 0; if(g<=66760) return g*0.42-9267; return g*0.45-18307; };

function annualize(val, periode) {
  const m = {Q1:3,Q2:6,Q3:9,"2025-01":1,"2025-02":2,"2025-03":3,"2025-04":4,"2025-05":5,"2025-06":6,"2025":12};
  const months = m[periode] || 12;
  return months > 0 ? (val / months) * 12 : val;
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d0d17}::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:2px}
.nb{transition:all .18s;background:transparent;border:none;cursor:pointer;font-family:'Inter',sans-serif}
.nb:hover{background:rgba(255,255,255,.05)!important}
.nb.on{background:rgba(34,211,166,.1)!important;border-left:2px solid #22D3A6!important;color:#22D3A6!important}
.card{transition:transform .18s,box-shadow .18s}.card:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(0,0,0,.4)!important}
.bp{background:#22D3A6;color:#0a0a0f;border:none;border-radius:8px;font-family:'Inter',sans-serif;font-weight:600;cursor:pointer;transition:all .18s}
.bp:hover{background:#4de8c4}.bp:disabled{opacity:.45;cursor:not-allowed}
.bg{background:rgba(255,255,255,.06);color:#e0e0f0;border:1px solid rgba(255,255,255,.1);border-radius:8px;font-family:'Inter',sans-serif;font-weight:500;cursor:pointer;transition:all .18s}
.bg:hover{background:rgba(255,255,255,.11)}
.br{background:rgba(248,113,113,.1);color:#f87171;border:1px solid rgba(248,113,113,.22);border-radius:8px;font-family:'Inter',sans-serif;font-weight:500;cursor:pointer;transition:all .18s}
.br:hover{background:rgba(248,113,113,.18)}
.bu{background:rgba(99,150,255,.1);color:#6396ff;border:1px solid rgba(99,150,255,.22);border-radius:8px;font-family:'Inter',sans-serif;font-weight:500;cursor:pointer;transition:all .18s}
.bu:hover{background:rgba(99,150,255,.18)}
.by{background:rgba(245,158,11,.1);color:#f59e0b;border:1px solid rgba(245,158,11,.22);border-radius:8px;font-family:'Inter',sans-serif;font-weight:500;cursor:pointer;transition:all .18s}
.by:hover{background:rgba(245,158,11,.18)}
.bdg{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600}
.bv{background:rgba(34,211,166,.15);color:#22D3A6}.bo{background:rgba(250,204,21,.15);color:#facc15}
.bb{background:rgba(99,150,255,.15);color:#6396ff}.beu{background:rgba(167,139,250,.15);color:#a78bfa}
.bai{background:rgba(251,146,60,.15);color:#fb923c}.bm{background:rgba(248,113,113,.15);color:#f87171}
.bdr{background:rgba(51,65,85,.5);color:#94a3b8}.bgold{background:rgba(245,158,11,.15);color:#f59e0b}
.sb{background:transparent;border:none;font-family:'Inter',sans-serif;font-size:11px;padding:4px 10px;border-radius:5px;cursor:pointer;transition:all .18s}
.sb.on{background:rgba(34,211,166,.15);color:#22D3A6;font-weight:600}.sb:not(.on){color:#666}.sb:hover:not(.on){color:#aaa}
.cu{background:rgba(34,211,166,.14);border-radius:13px 13px 4px 13px;padding:10px 14px;font-size:13px;color:#e0e0f0;max-width:80%;margin-left:auto}
.ca{background:#14142a;border-radius:13px 13px 13px 4px;padding:10px 14px;font-size:13px;color:#b8b8d0;max-width:86%}
.ob{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:#e0e0f0;font-family:'Inter',sans-serif;font-size:13px;padding:9px 14px;border-radius:7px;cursor:pointer;transition:all .18s;text-align:left;width:100%}
.ob:hover,.ob.on{background:rgba(34,211,166,.09);border-color:#22D3A6;color:#22D3A6}
.pu{animation:pu 1.4s infinite}@keyframes pu{0%,100%{opacity:1}50%{opacity:.25}}
.uz{border:2px dashed rgba(34,211,166,.28);border-radius:14px;padding:24px;text-align:center;cursor:pointer;transition:all .18s}
.uz:hover{border-color:#22D3A6;background:rgba(34,211,166,.04)}
input[type=file]{display:none}
.wb{background:rgba(250,204,21,.07);border:1px solid rgba(250,204,21,.22);border-radius:9px;padding:10px 14px}
.ib{background:rgba(34,211,166,.06);border:1px solid rgba(34,211,166,.18);border-radius:9px;padding:10px 14px}
.eb{background:rgba(167,139,250,.06);border:1px solid rgba(167,139,250,.18);border-radius:9px;padding:12px 14px}
.rb{background:rgba(248,113,113,.06);border:1px solid rgba(248,113,113,.2);border-radius:9px;padding:10px 14px}
.panel{background:#0f0f1e;border-radius:12px;border:1px solid rgba(255,255,255,.06)}
.panel-hd{padding:10px 16px;border-bottom:1px solid rgba(255,255,255,.05);display:flex;justify-content:space-between;align-items:center}
.kpi{background:#0f0f1e;border-radius:11px;padding:12px 13px;border:1px solid rgba(255,255,255,.06)}
.tbl-hd{display:grid;padding:7px 14px;border-bottom:1px solid rgba(255,255,255,.07);font-size:10px;color:#444;font-weight:600;text-transform:uppercase;letter-spacing:.8px;gap:8px}
.tbl-row{display:grid;padding:8px 14px;gap:8px;align-items:center;border-bottom:1px solid rgba(255,255,255,.04);transition:background .12s}
.tbl-row:last-child{border-bottom:none}.tbl-row:hover{background:rgba(255,255,255,.02)}
.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:999}
.modal{background:#0f0f1e;border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:28px;min-width:520px;max-width:680px;max-height:90vh;overflow-y:auto}
.inp-lbl{display:block;font-size:10px;color:#555;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px}
.inp-full{width:100%;padding:10px 13px;background:#14142a;color:#e0e0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;outline:none}
.inp-full:focus{border-color:#22D3A6}
select,input{background:#14142a;color:#e0e0f0;border:1px solid rgba(255,255,255,.12);border-radius:8px;font-family:'Inter',sans-serif;font-size:13px;outline:none}
select{padding:8px 12px;cursor:pointer}input{padding:8px 12px}
select:focus,input:focus{border-color:#22D3A6}
.fb{background:transparent;border:1px solid rgba(255,255,255,.1);color:#777;font-family:'Inter',sans-serif;font-size:12px;padding:4px 11px;border-radius:99px;cursor:pointer;transition:all .18s;white-space:nowrap}
.fb:hover,.fb.on{border-color:#22D3A6;color:#22D3A6}.fb.on{background:rgba(34,211,166,.08);font-weight:600}
textarea{background:#14142a;color:#e0e0f0;border:1px solid rgba(255,255,255,.12);border-radius:9px;padding:10px;font-family:'Inter',sans-serif;font-size:13px;outline:none;resize:none;width:100%}
textarea:focus{border-color:#22D3A6}
.mn{font-family:'DM Mono',monospace}
.sync-btn{position:relative;overflow:hidden}
.sync-btn.syncing::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);animation:shimmer .8s infinite}
@keyframes shimmer{100%{left:100%}}
.ultimate-badge{background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;font-size:9px;font-weight:700;padding:2px 5px;border-radius:4px;letter-spacing:.3px}
@keyframes spin{100%{transform:rotate(360deg)}}
.lohn-card{background:#0f0f1e;border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:13px}
`;

// ─────────────────────────────────────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────────────────────────────────────
const Logo = ({small}) => (
  <svg width={small?120:158} height={small?26:34} viewBox="0 0 280 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 12V48C15 48 27 48 33 48C39 48 43 44 43 38C43 32 39 28 33 28C27 28 15 28 15 28M15 28C15 28 27 28 33 28C39 28 43 24 43 18C43 12 39 8 33 8C27 8 15 8 15 8V12"
      stroke="#22D3A6" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M43 28L57 48V12" stroke="#22D3A6" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
    <text x="75" y="38" fill="#FFF" fontFamily="Inter,-apple-system,sans-serif" fontSize="26" fontWeight="500">Buchhalt</text>
    <text x="192" y="38" fill="#FFF" fontFamily="Inter,-apple-system,sans-serif" fontSize="26" fontWeight="700">Now</text>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [u,setU] = useState(""); const [p,setP] = useState(""); const [err,setErr] = useState(""); const [ld,setLd] = useState(false);
  const go = async () => {
    setErr(""); setLd(true); await new Promise(r=>setTimeout(r,600));
    if(u==="admin" && p==="1234") onLogin();
    else { setErr("Benutzername oder Passwort falsch."); setLd(false); }
  };
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#05050e"}}>
      <style>{CSS}</style>
      <div style={{background:"#0f0f1e",border:"1px solid rgba(255,255,255,.08)",borderRadius:18,padding:"38px 34px",width:360}}>
        <div style={{textAlign:"center",marginBottom:26}}><Logo/><div style={{fontSize:12,color:"#444",marginTop:7}}>Buchhaltung für Selbstständige & Teams</div></div>
        <label className="inp-lbl">Benutzername</label>
        <div style={{marginBottom:12}}><input className="inp-full" value={u} onChange={e=>setU(e.target.value)} placeholder="admin" autoComplete="username"/></div>
        <label className="inp-lbl">Passwort</label>
        <div style={{marginBottom:14}}><input className="inp-full" type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&go()}/></div>
        {err && <div style={{fontSize:12,color:"#f87171",marginBottom:10,padding:"8px 12px",background:"rgba(248,113,113,.08)",borderRadius:7}}>{err}</div>}
        <button className="bp" style={{width:"100%",padding:12,fontSize:14,borderRadius:9}} onClick={go} disabled={ld}>{ld?"Anmelden…":"Anmelden →"}</button>
        <div style={{textAlign:"center",marginTop:16,fontSize:11,color:"#333"}}>Demo: <span style={{color:"#555"}}>admin / 1234</span></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RECHNUNGEN TAB
// ─────────────────────────────────────────────────────────────────────────────
function ReTab({ rechnungen, setRechnungen, produkte, isKU, setTab }) {
  const [view, setView] = useState("list"); // list | new | edit | preview
  const [sel,  setSel]  = useState(null);
  const [form, setForm] = useState(null);

  const emptyRe = () => ({ id:newId("RE"), typ:"rechnung",  kunde:"", mwstSatz:isKU?0:19, datum:today, faellig:addDays(today,30), zahlungsziel:30, status:"offen",  email:"", pos:[{bez:"",menge:1,ep:0}] });
  const emptyGs = ref  => ({ id:newId("GS"), typ:"gutschrift",kunde:"", mwstSatz:isKU?0:19, datum:today, faellig:addDays(today,30), zahlungsziel:30, status:"offen",  email:"", pos:[{bez:"Gutschrift",menge:1,ep:0}], reRef:ref||"" });

  const calcTotals = (pos, mwstSatz) => {
    const netto = pos.reduce((s,p) => s + Number(p.menge)*Number(p.ep), 0);
    const mwst  = netto * (Number(mwstSatz)/100);
    return { netto, mwst, betrag: netto + mwst };
  };

  const BadgeRe = ({s,typ}) => {
    if(typ==="gutschrift") return <span className="bdg bu">Gutschrift</span>;
    const m = {bezahlt:"bv",offen:"bo",mahnung1:"bm",mahnung2:"br"};
    const l = {bezahlt:"Bezahlt",offen:"Offen",mahnung1:"Mahnung 1",mahnung2:"Mahnung 2"};
    return <span className={`bdg ${m[s]||"bdr"}`}>{l[s]||s}</span>;
  };

  const openNew  = () => { setForm(emptyRe());  setView("new"); };
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

  // LIST VIEW
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
      {/* KI-Assistent Banner */}
      <div className="ib" style={{marginBottom:12,display:"flex",alignItems:"center",gap:10,padding:"9px 14px"}}>
        <span style={{fontSize:16}}>✦</span>
        <div style={{flex:1}}>
          <span style={{fontSize:12,color:G,fontWeight:600}}>KI-Assistent: </span>
          <span style={{fontSize:12,color:"#777"}}>Rechnung per Spracheingabe diktieren: z.B. "Schreib Rechnung an BMW über 10h Beratung à 250€"</span>
        </div>
        <button className="bp" style={{padding:"5px 13px",fontSize:11,flexShrink:0}} onClick={()=>setTab("assistent")}>✦ Rechnung diktieren</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:12}}>
        {[
          {l:"Gesamt",      v:rechnungen.length+" Stk.",   c:"#60a5fa"},
          {l:"Offen",       v:fmt(rechnungen.filter(r=>r.status==="offen").reduce((s,r)=>s+r.betrag,0)), c:"#facc15"},
          {l:"Bezahlt",     v:fmt(rechnungen.filter(r=>r.status==="bezahlt").reduce((s,r)=>s+Math.abs(r.betrag),0)), c:G},
          {l:"Mahnungen",   v:rechnungen.filter(r=>r.status.includes("mahnung")).length+" Stk.", c:"#f87171"},
        ].map((k,i)=>(
          <div key={i} className="kpi"><div style={{fontSize:10,color:"#555",marginBottom:3}}>{k.l}</div><div className="mn" style={{fontSize:14,fontWeight:700,color:k.c}}>{k.v}</div></div>
        ))}
      </div>
      <div className="panel">
        <div className="tbl-hd" style={{gridTemplateColumns:"80px 1fr 80px 80px 90px 72px 120px"}}>
          <div>Nr.</div><div>Kunde</div><div>Datum</div><div>Fällig</div><div>Brutto</div><div>Status</div><div>Aktionen</div>
        </div>
        {rechnungen.map(re => (
          <div key={re.id} className="tbl-row" style={{gridTemplateColumns:"80px 1fr 80px 80px 90px 72px 120px"}}>
            <div className="mn" style={{fontSize:10,color:"#6396ff"}}>{re.id}</div>
            <div>
              <div style={{fontSize:12,fontWeight:500,color:"#e0e0f0"}}>{re.kunde||"—"}</div>
              {re.reRef&&<div style={{fontSize:9,color:"#6396ff"}}>Ref: {re.reRef}</div>}
            </div>
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

  // FORM VIEW (new/edit)
  if(view==="new"||view==="edit") {
    const totals = calcTotals(form?.pos||[], form?.mwstSatz||0);
    return (
      <div>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
          <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={()=>setView("list")}>← Zurück</button>
          <div style={{fontSize:18,fontWeight:700,color:"#fff"}}>{view==="edit"?"Rechnung bearbeiten":"Neue "+( form?.typ==="gutschrift"?"Gutschrift":"Rechnung")}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:14}}>
          <div className="panel" style={{padding:18}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              <div>
                <label className="inp-lbl">Typ</label>
                <select className="inp-full" value={form.typ} onChange={e=>setForm(f=>({...f,typ:e.target.value}))}>
                  <option value="rechnung">Rechnung</option>
                  <option value="gutschrift">Gutschrift</option>
                </select>
              </div>
              <div>
                <label className="inp-lbl">MwSt %</label>
                <select className="inp-full" value={form.mwstSatz} onChange={e=>setForm(f=>({...f,mwstSatz:Number(e.target.value)}))}>
                  {isKU&&<option value="0">0% (§19 UStG)</option>}
                  {!isKU&&<><option value="19">19%</option><option value="7">7%</option><option value="0">0% (EU/Drittland)</option></>}
                </select>
              </div>
              <div>
                <label className="inp-lbl">Kunde</label>
                <input className="inp-full" value={form.kunde} onChange={e=>setForm(f=>({...f,kunde:e.target.value}))} placeholder="Firmenname oder Person"/>
              </div>
              <div>
                <label className="inp-lbl">E-Mail Kunde</label>
                <input className="inp-full" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="kunde@firma.de"/>
              </div>
              <div>
                <label className="inp-lbl">Rechnungsdatum</label>
                <input className="inp-full" type="date" value={form.datum} onChange={e=>setForm(f=>({...f,datum:e.target.value,faellig:addDays(e.target.value,f.zahlungsziel)}))}/>
              </div>
              <div>
                <label className="inp-lbl">Zahlungsziel (Tage)</label>
                <input className="inp-full" type="number" value={form.zahlungsziel} onChange={e=>setForm(f=>({...f,zahlungsziel:Number(e.target.value),faellig:addDays(f.datum,Number(e.target.value))}))}/>
              </div>
              {form.typ==="gutschrift"&&<div style={{gridColumn:"span 2"}}>
                <label className="inp-lbl">Referenz-Rechnung</label>
                <input className="inp-full" value={form.reRef||""} onChange={e=>setForm(f=>({...f,reRef:e.target.value}))} placeholder="RE-2025-001"/>
              </div>}
            </div>
            <div style={{marginBottom:10,fontSize:11,fontWeight:600,color:"#777",textTransform:"uppercase",letterSpacing:.6}}>Positionen</div>
            {form.pos.map((pos,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 60px 90px 30px",gap:8,marginBottom:8,alignItems:"center"}}>
                <div>
                  <input className="inp-full" value={pos.bez} onChange={e=>setPos(i,"bez",e.target.value)} placeholder="Bezeichnung / Leistung"/>
                </div>
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
          <div>
            <div className="panel" style={{padding:16,marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:600,color:"#777",marginBottom:12,textTransform:"uppercase",letterSpacing:.6}}>Zusammenfassung</div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:"#666"}}>Netto</span>
                <span className="mn" style={{fontSize:12,color:"#e0e0f0"}}>{fmt(totals.netto)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:"#666"}}>MwSt {form.mwstSatz}%</span>
                <span className="mn" style={{fontSize:12,color:"#facc15"}}>{fmt(totals.mwst)}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:8,marginBottom:14}}>
                <span style={{fontSize:13,fontWeight:700,color:"#fff"}}>Brutto</span>
                <span className="mn" style={{fontSize:14,fontWeight:700,color:G}}>{fmt(totals.betrag)}</span>
              </div>
              {isKU&&<div className="ib" style={{padding:"6px 10px",marginBottom:12,fontSize:10,color:G}}>§19 UStG: kein MwSt-Ausweis</div>}
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                <button className="bp" style={{padding:10,fontSize:13}} onClick={saveForm}>💾 Speichern</button>
                <button className="bg" style={{padding:9,fontSize:12}} onClick={()=>{ saveForm(); setSel(form); setView("preview"); }}>👁 Vorschau & Versand</button>
                {view==="edit"&&<button className="br" style={{padding:8,fontSize:12}} onClick={()=>deleteRe(form.id)}>🗑 Löschen</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PREVIEW VIEW
  if(view==="preview" && sel) {
    const re = rechnungen.find(r=>r.id===sel.id)||sel;
    return (
      <div>
        <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
          <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={()=>setView("list")}>← Zurück</button>
          <div style={{fontSize:18,fontWeight:700,color:"#fff"}}>Vorschau: {re.id}</div>
          <div style={{flex:1}}/>
          <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={()=>openEdit(re)}>✏️ Bearbeiten</button>
          <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={()=>alert(`PDF Download: ${re.id}.pdf`)}>📥 PDF</button>
          <button className="bp" style={{padding:"7px 12px",fontSize:12}} onClick={()=>alert(`E-Mail gesendet an: ${re.email||"(keine E-Mail)"}`)}>📧 Senden</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:14}}>
          {/* Rechnungsvorschau */}
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
            {isKU&&<div style={{marginTop:14,fontSize:11,color:"#facc15"}}>Kein MwSt-Ausweis gemäß §19 UStG (Kleinunternehmerregelung).</div>}
            {re.reRef&&<div style={{marginTop:8,fontSize:11,color:"#6396ff"}}>Bezieht sich auf Rechnung: {re.reRef}</div>}
            <div style={{marginTop:12,fontSize:11,color:"#555"}}>Zahlungsziel: {re.zahlungsziel} Tage bis {fmtD(re.faellig)}</div>
          </div>
          {/* Actions Panel */}
          <div>
            <div className="panel" style={{padding:14,marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:600,color:"#777",marginBottom:10,textTransform:"uppercase",letterSpacing:.6}}>Status & Aktionen</div>
              <select className="inp-full" value={re.status} onChange={e=>setRechnungen(prev=>prev.map(r=>r.id===re.id?{...r,status:e.target.value}:r))} style={{marginBottom:10}}>
                <option value="offen">Offen</option>
                <option value="bezahlt">Bezahlt</option>
                <option value="mahnung1">Mahnung 1</option>
                <option value="mahnung2">Mahnung 2</option>
              </select>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                <button className="bp" style={{padding:9,fontSize:12}} onClick={()=>alert(`E-Mail an ${re.email||"(keine)"}`)}>📧 Per E-Mail senden</button>
                <button className="bg" style={{padding:9,fontSize:12}} onClick={()=>alert(`PDF: ${re.id}.pdf`)}>📥 PDF Download</button>
                {re.status==="offen"&&<button className="by" style={{padding:9,fontSize:12}} onClick={()=>setRechnungen(prev=>prev.map(r=>r.id===re.id?{...r,status:"mahnung1"}:r))}>⚠️ Mahnung 1 senden</button>}
                {re.status==="mahnung1"&&<button className="br" style={{padding:9,fontSize:12}} onClick={()=>setRechnungen(prev=>prev.map(r=>r.id===re.id?{...r,status:"mahnung2"}:r))}>🔴 Mahnung 2 senden</button>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUKTE TAB
// ─────────────────────────────────────────────────────────────────────────────
function ProdTab({ produkte, setProdukte }) {
  const [view,setView] = useState("list");
  const [form,setForm] = useState(null);
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
      return { id:Date.now()+i, name:parts[0]||"Produkt", einheit:parts[1]||"Stück", ep:Number(parts[2])||0, mwstSatz:Number(parts[3])||19, kat:parts[4]||"Sonstiges", aktiv:true };
    });
    setProdukte(prev=>[...prev,...imported]);
    setImportText(""); setShowImport(false);
  };

  const KATS = ["Dienstleistung","Software","Hardware","Schulung","Support","Sonstiges"];
  const EINHEITEN = ["Stück","Stunde","Tag","Monat","Pauschal","kg","m","m²","Liter"];

  if(view==="list") return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:2}}>Produkte & Leistungen</div>
          <div style={{color:"#555",fontSize:12}}>Stammdaten für schnelle Rechnungsstellung</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="bg" style={{padding:"9px 14px",fontSize:12}} onClick={()=>setShowImport(v=>!v)}>📥 CSV-Import</button>
          <button className="bp" style={{padding:"9px 14px",fontSize:12}} onClick={()=>{setForm(emptyProd());setView("new")}}>+ Neues Produkt</button>
        </div>
      </div>
      {showImport&&(
        <div className="panel" style={{padding:14,marginBottom:14}}>
          <div style={{fontSize:12,fontWeight:600,color:"#fff",marginBottom:6}}>CSV / Zeilenweise importieren</div>
          <div style={{fontSize:10,color:"#555",marginBottom:8}}>Format: Name;Einheit;Preis;MwSt%;Kategorie (eine Zeile pro Produkt)</div>
          <textarea rows={5} value={importText} onChange={e=>setImportText(e.target.value)} placeholder={"Strategieberatung;Stunde;250;19;Dienstleistung\nSoftwarelizenz;Stück;990;19;Software"}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <button className="bp" style={{padding:"7px 14px",fontSize:12}} onClick={doImport}>Importieren</button>
            <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={()=>setShowImport(false)}>Abbrechen</button>
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
        {[
          {l:"Produkte gesamt", v:produkte.length+" Stk.", c:"#60a5fa"},
          {l:"Aktiv",           v:produkte.filter(p=>p.aktiv).length+" Stk.", c:G},
          {l:"Ø Preis",        v:fmt(produkte.filter(p=>p.aktiv).reduce((s,p)=>s+p.ep,0)/(produkte.filter(p=>p.aktiv).length||1)), c:"#a78bfa"},
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
          <div style={{gridColumn:"span 2"}}>
            <label className="inp-lbl">Produktname / Bezeichnung</label>
            <input className="inp-full" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="z.B. Strategieberatung"/>
          </div>
          <div>
            <label className="inp-lbl">Einheit</label>
            <select className="inp-full" value={form.einheit} onChange={e=>setForm(f=>({...f,einheit:e.target.value}))}>
              {EINHEITEN.map(e=><option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="inp-lbl">Preis (netto)</label>
            <input className="inp-full" type="number" value={form.ep} onChange={e=>setForm(f=>({...f,ep:Number(e.target.value)}))} placeholder="0.00"/>
          </div>
          <div>
            <label className="inp-lbl">MwSt %</label>
            <select className="inp-full" value={form.mwstSatz} onChange={e=>setForm(f=>({...f,mwstSatz:Number(e.target.value)}))}>
              <option value="19">19%</option><option value="7">7%</option><option value="0">0%</option>
            </select>
          </div>
          <div>
            <label className="inp-lbl">Kategorie</label>
            <select className="inp-full" value={form.kat} onChange={e=>setForm(f=>({...f,kat:e.target.value}))}>
              {KATS.map(k=><option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div style={{gridColumn:"span 2",display:"flex",alignItems:"center",gap:8}}>
            <input type="checkbox" id="aktiv-chk" checked={form.aktiv} onChange={e=>setForm(f=>({...f,aktiv:e.target.checked}))} style={{width:16,height:16}}/>
            <label htmlFor="aktiv-chk" style={{fontSize:12,color:"#e0e0f0",cursor:"pointer"}}>Produkt aktiv (erscheint in Rechnungsauswahl)</label>
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

// ─────────────────────────────────────────────────────────────────────────────
// PERSONAL TAB (Ultimate only)
// ─────────────────────────────────────────────────────────────────────────────
function PersonalTab({ mitarbeiter, setMitarbeiter }) {
  const [view,setView]   = useState("list");
  const [form,setForm]   = useState(null);
  const [lohnMa,setLohnMa] = useState(null);
  const [lohnMonat,setLohnMonat] = useState("2025-03");
  const [sentLohn,setSentLohn] = useState({});

  const emptyMa = () => ({id:Date.now(),name:"",typ:"vollzeit",stelle:"",gehalt:0,sv:21.6,lohnst:0,netto:0,einDatum:today,email:"",iban:"",urlaub:30,urlaubRest:30});

  const calcNetto = (gehalt, typ, sv, lohnst) => {
    if(typ==="minijob") return gehalt;
    const svAg = gehalt * (sv/100);
    return Math.max(0, gehalt - svAg - lohnst);
  };

  const save = () => {
    const netto = calcNetto(form.gehalt,form.typ,form.sv,form.lohnst);
    const saved = {...form, netto};
    if(view==="edit") setMitarbeiter(prev=>prev.map(m=>m.id===saved.id?saved:m));
    else setMitarbeiter(prev=>[...prev,saved]);
    setView("list");
  };

  const TYPEN = [{v:"vollzeit",l:"Vollzeit"},{v:"teilzeit",l:"Teilzeit"},{v:"minijob",l:"Minijobber"}];
  const typeColor = t => t==="vollzeit"?G:t==="teilzeit"?"#6396ff":"#f59e0b";
  const typeBadge = t => t==="vollzeit"?"bv":t==="teilzeit"?"bb":"bgold";

  const LohnzettelModal = ({ma, monat, onClose}) => {
    const [m,y] = monat.split("-").reverse();
    const monatStr = new Date(monat+"-01").toLocaleString("de-DE",{month:"long",year:"numeric"});
    const svAg = ma.typ==="minijob" ? 0 : ma.gehalt*(ma.sv/100);
    const svAn = ma.typ==="minijob" ? 0 : ma.gehalt*(ma.sv/100);
    const netto = ma.typ==="minijob" ? ma.gehalt : Math.max(0, ma.gehalt - svAn - ma.lohnst);
    const key = `${ma.id}-${monat}`;
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e=>e.stopPropagation()} style={{minWidth:460,maxWidth:520}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div><div style={{fontSize:16,fontWeight:700,color:"#fff"}}>Lohnzettel – {monatStr}</div><div style={{fontSize:11,color:"#555"}}>{ma.name} · {ma.stelle}</div></div>
            <button className="bg" style={{padding:"4px 10px",fontSize:12}} onClick={onClose}>×</button>
          </div>
          <div style={{background:"#080818",borderRadius:10,padding:16,border:"1px solid rgba(255,255,255,.07)",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
              <Logo small/><div style={{textAlign:"right",fontSize:10,color:"#555"}}>Lohnzettel<br/>{monatStr}</div>
            </div>
            <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:4}}>{ma.name}</div>
            <div style={{fontSize:11,color:"#777",marginBottom:12}}>{ma.stelle} · {TYPEN.find(t=>t.v===ma.typ)?.l}</div>
            {[
              {l:"Bruttogehalt",      v:fmt(ma.gehalt),      c:"#e0e0f0"},
              ...(ma.typ!=="minijob"?[
                {l:`SV-Beitrag AN (${ma.sv}%)`,v:"-"+fmt(svAn),c:"#f87171"},
                {l:"Lohnsteuer",       v:"-"+fmt(ma.lohnst),  c:"#f87171"},
              ]:[]),
              {l:"─────────────",    v:"",                   c:"#333"},
              {l:"Nettoauszahlung",   v:fmt(netto),           c:G, bold:true},
            ].map((row,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:i===( ma.typ==="minijob"?1:3)?"1px solid rgba(255,255,255,.08)":"none"}}>
                <span style={{fontSize:11,color:"#777"}}>{row.l}</span>
                <span className="mn" style={{fontSize:12,fontWeight:row.bold?700:400,color:row.c}}>{row.v}</span>
              </div>
            ))}
            {ma.typ!=="minijob"&&<>
              <div style={{marginTop:10,paddingTop:10,borderTop:"1px solid rgba(255,255,255,.06)"}}>
                <div style={{fontSize:10,color:"#555",marginBottom:6}}>ARBEITGEBERKOSTEN</div>
                {[
                  {l:`SV-Beitrag AG (${ma.sv}%)`,v:fmt(svAg)},
                  {l:"Gesamtkosten AG",           v:fmt(ma.gehalt+svAg),bold:true,c:"#facc15"},
                ].map((row,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}>
                    <span style={{fontSize:11,color:"#777"}}>{row.l}</span>
                    <span className="mn" style={{fontSize:12,color:row.c||"#e0e0f0",fontWeight:row.bold?700:400}}>{row.v}</span>
                  </div>
                ))}
              </div>
            </>}
            {ma.iban&&<div style={{marginTop:10,fontSize:10,color:"#555"}}>Überweisung auf: <span className="mn" style={{color:"#777"}}>{ma.iban}</span></div>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="bp" style={{flex:1,padding:10,fontSize:12}} onClick={()=>{ setSentLohn(s=>({...s,[key]:true})); alert(`Lohnzettel per E-Mail gesendet an: ${ma.email||"(keine E-Mail)"}`); }}>
              {sentLohn[key]?"✅ Erneut senden":"📧 Per E-Mail senden"}
            </button>
            <button className="bg" style={{flex:1,padding:10,fontSize:12}} onClick={()=>alert(`PDF Download: Lohnzettel_${ma.name.replace(" ","_")}_${monat}.pdf`)}>📥 PDF Download</button>
          </div>
        </div>
      </div>
    );
  };

  const gesamtBrutto = mitarbeiter.reduce((s,m)=>s+m.gehalt,0);
  const gesamtNetto  = mitarbeiter.reduce((s,m)=>s+m.netto,0);
  const gesamtSV     = mitarbeiter.filter(m=>m.typ!=="minijob").reduce((s,m)=>s+m.gehalt*(m.sv/100),0);

  if(view==="list") return (
    <div>
      {lohnMa&&<LohnzettelModal ma={lohnMa} monat={lohnMonat} onClose={()=>setLohnMa(null)}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div>
          <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:2}}>Personal</div>
          <div style={{color:"#555",fontSize:12}}>Mitarbeiter verwalten, Lohnzettel erstellen und versenden</div>
        </div>
        <button className="bp" style={{padding:"9px 15px",fontSize:12}} onClick={()=>{setForm(emptyMa());setView("new")}}>+ Mitarbeiter</button>
      </div>
      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:12}}>
        {[
          {l:"Mitarbeiter", v:mitarbeiter.length+" Pers.", c:"#60a5fa"},
          {l:"Bruttolohn",  v:fmt(gesamtBrutto),          c:"#facc15"},
          {l:"Nettolohn",   v:fmt(gesamtNetto),            c:G},
          {l:"SV-Kosten AG",v:fmt(gesamtSV),               c:"#f87171"},
        ].map((k,i)=>(
          <div key={i} className="kpi"><div style={{fontSize:10,color:"#555",marginBottom:3}}>{k.l}</div><div className="mn" style={{fontSize:14,fontWeight:700,color:k.c}}>{k.v}</div></div>
        ))}
      </div>
      {/* Lohnzettel-Monat */}
      <div className="panel" style={{padding:12,marginBottom:10,display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:12,color:"#777",fontWeight:500}}>Lohnzettel-Monat:</span>
        <select value={lohnMonat} onChange={e=>setLohnMonat(e.target.value)}>
          {["2025-01","2025-02","2025-03","2025-04","2025-05","2025-06"].map(m=>{
            const d=new Date(m+"-01"); return <option key={m} value={m}>{d.toLocaleString("de-DE",{month:"long",year:"numeric"})}</option>;
          })}
        </select>
        <button className="bp" style={{padding:"7px 14px",fontSize:12}} onClick={()=>alert(`Alle ${mitarbeiter.length} Lohnzettel für ${new Date(lohnMonat+"-01").toLocaleString("de-DE",{month:"long",year:"numeric"})} per E-Mail versendet.`)}>📧 Alle Lohnzettel senden</button>
      </div>
      {/* Mitarbeiter-Tabelle */}
      <div className="panel">
        <div className="tbl-hd" style={{gridTemplateColumns:"1fr 80px 120px 85px 85px 85px 70px 110px"}}>
          <div>Mitarbeiter</div><div>Typ</div><div>Stelle</div><div>Brutto</div><div>Netto</div><div>Urlaub</div><div>Seit</div><div>Aktionen</div>
        </div>
        {mitarbeiter.map(ma=>(
          <div key={ma.id} className="tbl-row" style={{gridTemplateColumns:"1fr 80px 120px 85px 85px 85px 70px 110px"}}>
            <div>
              <div style={{fontSize:12,fontWeight:500,color:"#e0e0f0"}}>{ma.name}</div>
              <div style={{fontSize:10,color:"#555"}}>{ma.email}</div>
            </div>
            <span className={`bdg ${typeBadge(ma.typ)}`} style={{fontSize:9}}>{TYPEN.find(t=>t.v===ma.typ)?.l}</span>
            <div style={{fontSize:11,color:"#777"}}>{ma.stelle}</div>
            <div className="mn" style={{fontSize:11,fontWeight:600,color:"#facc15"}}>{fmt(ma.gehalt)}</div>
            <div className="mn" style={{fontSize:11,fontWeight:600,color:G}}>{fmt(ma.netto)}</div>
            <div style={{fontSize:11,color:"#777"}}>{ma.urlaubRest}/{ma.urlaub}d</div>
            <div className="mn" style={{fontSize:10,color:"#555"}}>{fmtD(ma.einDatum)}</div>
            <div style={{display:"flex",gap:4}}>
              <button className="bp" style={{padding:"3px 7px",fontSize:10}} onClick={()=>setLohnMa(ma)}>📄</button>
              <button className="bg" style={{padding:"3px 7px",fontSize:10}} onClick={()=>{setForm({...ma});setView("edit")}}>✏️</button>
              <button className="br" style={{padding:"3px 7px",fontSize:10}} onClick={()=>setMitarbeiter(prev=>prev.filter(m=>m.id!==ma.id))}>🗑</button>
            </div>
          </div>
        ))}
      </div>
      {/* Lohnübersicht */}
      <div className="panel" style={{marginTop:10,padding:14}}>
        <div style={{fontSize:11,fontWeight:600,color:"#777",marginBottom:10,textTransform:"uppercase",letterSpacing:.6}}>Gesamtübersicht Lohnkosten</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9}}>
          {[
            {l:"Vollzeit",  v:mitarbeiter.filter(m=>m.typ==="vollzeit"),  c:G},
            {l:"Teilzeit",  v:mitarbeiter.filter(m=>m.typ==="teilzeit"),  c:"#6396ff"},
            {l:"Minijob",   v:mitarbeiter.filter(m=>m.typ==="minijob"),   c:"#f59e0b"},
          ].map((g,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.03)",borderRadius:8,padding:10}}>
              <div style={{fontSize:10,color:"#555",marginBottom:4}}>{g.l} ({g.v.length} Pers.)</div>
              <div className="mn" style={{fontSize:13,fontWeight:700,color:g.c}}>{fmt(g.v.reduce((s,m)=>s+m.gehalt,0))}</div>
              <div style={{fontSize:9,color:"#444"}}>Brutto gesamt/Monat</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // FORM
  return (
    <div>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
        <button className="bg" style={{padding:"7px 12px",fontSize:12}} onClick={()=>setView("list")}>← Zurück</button>
        <div style={{fontSize:18,fontWeight:700,color:"#fff"}}>{view==="edit"?"Mitarbeiter bearbeiten":"Neuer Mitarbeiter"}</div>
      </div>
      <div className="panel" style={{padding:18,maxWidth:600}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{gridColumn:"span 2"}}>
            <label className="inp-lbl">Vollständiger Name</label>
            <input className="inp-full" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Max Mustermann"/>
          </div>
          <div>
            <label className="inp-lbl">Beschäftigungsart</label>
            <select className="inp-full" value={form.typ} onChange={e=>setForm(f=>({...f,typ:e.target.value,sv:e.target.value==="minijob"?0:21.6}))}>
              {TYPEN.map(t=><option key={t.v} value={t.v}>{t.l}</option>)}
            </select>
          </div>
          <div>
            <label className="inp-lbl">Stelle / Position</label>
            <input className="inp-full" value={form.stelle} onChange={e=>setForm(f=>({...f,stelle:e.target.value}))} placeholder="z.B. Entwickler"/>
          </div>
          <div>
            <label className="inp-lbl">Bruttogehalt (€/Monat)</label>
            <input className="inp-full" type="number" value={form.gehalt} onChange={e=>setForm(f=>({...f,gehalt:Number(e.target.value)}))}/>
          </div>
          <div>
            <label className="inp-lbl">Eintrittsdatum</label>
            <input className="inp-full" type="date" value={form.einDatum} onChange={e=>setForm(f=>({...f,einDatum:e.target.value}))}/>
          </div>
          <div>
            <label className="inp-lbl">E-Mail</label>
            <input className="inp-full" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="max@firma.de"/>
          </div>
          <div>
            <label className="inp-lbl">IBAN (Lohnüberweisung)</label>
            <input className="inp-full" value={form.iban} onChange={e=>setForm(f=>({...f,iban:e.target.value}))} placeholder="DE12 3456 7890 ..."/>
          </div>
          {form.typ!=="minijob"&&<>
            <div>
              <label className="inp-lbl">SV-Beitrag AN (%)</label>
              <input className="inp-full" type="number" step="0.1" value={form.sv} onChange={e=>setForm(f=>({...f,sv:Number(e.target.value)}))}/>
            </div>
            <div>
              <label className="inp-lbl">Lohnsteuer (€/Monat)</label>
              <input className="inp-full" type="number" value={form.lohnst} onChange={e=>setForm(f=>({...f,lohnst:Number(e.target.value)}))}/>
            </div>
          </>}
          <div>
            <label className="inp-lbl">Urlaubstage/Jahr</label>
            <input className="inp-full" type="number" value={form.urlaub} onChange={e=>setForm(f=>({...f,urlaub:Number(e.target.value),urlaubRest:Number(e.target.value)}))}/>
          </div>
          <div>
            <label className="inp-lbl">Resturlaub (Tage)</label>
            <input className="inp-full" type="number" value={form.urlaubRest} onChange={e=>setForm(f=>({...f,urlaubRest:Number(e.target.value)}))}/>
          </div>
        </div>
        {/* Netto-Vorschau */}
        {form.gehalt > 0 && (
          <div className="ib" style={{marginTop:14,padding:12}}>
            <div style={{fontSize:11,fontWeight:600,color:G,marginBottom:6}}>Netto-Vorschau</div>
            <div style={{display:"flex",gap:16,fontSize:12}}>
              <span style={{color:"#777"}}>Brutto: <span className="mn" style={{color:"#facc15"}}>{fmt(form.gehalt)}</span></span>
              {form.typ!=="minijob"&&<span style={{color:"#777"}}>− SV+LSt: <span className="mn" style={{color:"#f87171"}}>{fmt(form.gehalt*(form.sv/100)+form.lohnst)}</span></span>}
              <span style={{color:"#777"}}>Netto: <span className="mn" style={{color:G,fontWeight:700}}>{fmt(calcNetto(form.gehalt,form.typ,form.sv,form.lohnst))}</span></span>
            </div>
          </div>
        )}
        <div style={{borderTop:"1px solid rgba(255,255,255,.07)",marginTop:14,paddingTop:14,display:"flex",gap:8}}>
          <button className="bp" style={{padding:"9px 18px",fontSize:13}} onClick={save}>💾 Speichern</button>
          <button className="bg" style={{padding:"9px 14px",fontSize:12}} onClick={()=>setView("list")}>Abbrechen</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCAN TAB
// ─────────────────────────────────────────────────────────────────────────────
function ScanTab() {
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
      <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:3}}>Beleg scannen &amp; importieren</div>
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
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:"#fb923c"}}>KI-Steuerprüfung</div>
                  <div style={{fontSize:10,color:"#555"}}>{AI_Q[aiKey].titel} · {AI_Q[aiKey].betrag} EUR</div>
                </div>
              </div>
              {!aiDone ? AI_Q[aiKey].fragen.map((f,fi)=>{
                const ans=aiAns[f.id];
                const prev=fi===0||aiAns[AI_Q[aiKey].fragen[fi-1].id];
                if(!prev) return null;
                return (
                  <div key={f.id} style={{marginBottom:14}}>
                    <div style={{fontSize:12,color:"#e0e0f0",marginBottom:9,lineHeight:1.5}}>
                      <span style={{color:"#fb923c",fontWeight:600}}>Frage {fi+1}: </span>{f.text}
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      {f.opts.map(o=>(
                        <button key={o} className={`ob${ans===o?" on":""}`} onClick={()=>ansAi(f.id,o)} disabled={!!ans}>
                          {ans===o?"✓ ":""}{o}
                        </button>
                      ))}
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

        {/* RECHTS: Erkannte Felder – dynamisch je nach Status */}
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

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn,setLoggedIn]   = useState(false);
  const [tab,setTab]             = useState("dashboard");
  const [periode,setPeriode]     = useState("2025-Q1");
  const [uf,setUf]               = useState("einzelunternehmen");
  const [plan,setPlan]           = useState("free");
  const [belegeKat,setBelegeKat] = useState("Alle");
  const [belegeTyp,setBelegeTyp] = useState("Alle");
  const [bankKonto,setBankKonto] = useState("alle");
  const [bankSyncing,setBankSyncing] = useState(false);
  const [rechnungen,setRechnungen]   = useState(INIT_RE);
  const [produkte,setProdukte]       = useState(INIT_PRODUKTE);
  const [mitarbeiter,setMitarbeiter] = useState(INIT_MA);
  const [elsterFile,setElsterFile]   = useState(null);
  const [pruefFile,setPruefFile]     = useState(null);
  const [pruefResult,setPruefResult] = useState(null);
  const [pruefLoading,setPruefLoading] = useState(false);
  const [pruefChat,setPruefChat]     = useState("");
  const [pruefChatMsgs,setPruefChatMsgs] = useState([]);
  const [pruefChatBusy,setPruefChatBusy] = useState(false);
  const [trackEdit,setTrackEdit]     = useState({});
  const [fristPage,setFristPage]     = useState(0);
  const [taxYear,setTaxYear]         = useState("2025");
  const [taxMode,setTaxMode]         = useState("real");
  const [msgs,setMsgs]   = useState([{role:"assistant",text:"Hallo! Ich bin dein BuchhaltNow KI-Assistent.\n\nDiktiere eine Rechnung z.B.: 'Schreib Rechnung an Max GmbH, 10 Stück Beratung à 250 EUR' – oder frag mich zu Steuern, MwSt und ELSTER!"}]);
  const [chatIn,setChatIn]   = useState("");
  const [chatBusy,setChatBusy] = useState(false);
  const chatEnd = useRef(null);

  useEffect(()=>{ chatEnd.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  const isKU  = uf === "kleinunternehmer";
  const isPro = plan === "pro" || plan === "ultimate";
  const isUlt = plan === "ultimate";

  // ── computed ─────────────────────────────────────────────────────────────
  const r    = fp(BELEGE_DATA, periode);
  const sl   = (PERIODEN.find(p=>p.val===periode)||{label:""}).label;
  const eN   = r.filter(x=>x.typ==="ausgang").reduce((s,x)=>s+x.netto,0);
  const aN   = r.filter(x=>x.typ==="eingang").reduce((s,x)=>s+x.netto,0);
  const eB   = r.filter(x=>x.typ==="ausgang").reduce((s,x)=>s+x.betrag,0);
  const aB   = r.filter(x=>x.typ==="eingang").reduce((s,x)=>s+x.betrag,0);
  const gw2  = eN - aN;
  const u19e = r.filter(x=>x.typ==="ausgang"&&x.mwstSatz===19).reduce((s,x)=>s+x.mwst,0);
  const u7e  = r.filter(x=>x.typ==="ausgang"&&x.mwstSatz===7).reduce((s,x)=>s+x.mwst,0);
  const u19a = r.filter(x=>x.typ==="eingang"&&x.mwstSatz===19).reduce((s,x)=>s+x.mwst,0);
  const u7a  = r.filter(x=>x.typ==="eingang"&&x.mwstSatz===7).reduce((s,x)=>s+x.mwst,0);
  const us   = isKU ? 0 : (u19e+u7e)-(u19a+u7a);
  const euL  = r.filter(x=>x.eu&&x.typ==="ausgang");
  const ppGeb    = BANKING_TX.filter(x=>x.konto==="paypal"&&x.gebuehr).reduce((s,x)=>s+Math.abs(x.betrag),0);
  const bankGef  = BANKING_TX.filter(x=>bankKonto==="alle"||x.konto===bankKonto);
  const belegeGef = BELEGE_DATA.filter(x=>{
    const tOk = belegeTyp==="Alle"||(belegeTyp==="Eingang"&&x.typ==="eingang")||(belegeTyp==="Ausgang"&&x.typ==="ausgang")||(belegeTyp==="EU"&&x.eu)||(belegeTyp==="Drittland"&&x.euTyp==="Drittland")||(belegeTyp==="KI-Prüfung"&&x.aiFlag);
    return tOk && (belegeKat==="Alle"||x.kategorie===belegeKat);
  });

  const taxGewinn = taxMode==="estimated" ? annualize(gw2, periode) : gw2;
  const gs = gwSt(taxGewinn);
  const st = uf==="gmbh" ? kStFn(taxGewinn) : eStFn(taxGewinn);

  const FRISTEN_PER_PAGE = 6;
  const fristenFiltered = STEUER_FRISTEN.filter(f=>!isKU||(f.art!=="USt-VA"&&f.art!=="ZM"));
  const fristenPages    = Math.ceil(fristenFiltered.length/FRISTEN_PER_PAGE);
  const fristenSlice    = fristenFiltered.slice(fristPage*FRISTEN_PER_PAGE,(fristPage+1)*FRISTEN_PER_PAGE);

  const startPruefung = async () => {
    setPruefLoading(true); setPruefResult(null);
    await new Promise(r=>setTimeout(r,2200));
    setPruefResult({
      betreff:"Betriebsprüfung Umsatzsteuer 2024 – Az. BP-2025-4471",
      zeitraum:"01.01.2024–31.12.2024", pruefer:"FA München-Mitte, SB Dr. Bergmann", termin:"15.04.2025",
      hinweis:"EU-Lieferungen: Gelangensbestätigungen und ZM-Meldungen bereithalten. Drittland: Ausfuhranmeldung aus ATLAS exportieren.",
      belege:[
        {id:4,  grund:"EU-Lieferung AT – Steuerfreiheit §4 Nr.1b UStG",       prio:"hoch"},
        {id:8,  grund:"EU-Lieferung FR – ZM-Meldung und Gelangensbestätigung", prio:"hoch"},
        {id:14, grund:"Drittland UK – Ausfuhranmeldung/Versandnachweis",       prio:"hoch"},
        {id:5,  grund:"Hotelrechnung – Vorsteuerabzug §15 UStG prüfen",        prio:"mittel"},
        {id:11, grund:"Bewirtungsbeleg – §4 Abs.5 Nr.2 EStG, Teilnehmerliste?",prio:"mittel"},
        {id:10, grund:"Steuerberater-Honorar – Vorsteuer korrekt?",            prio:"niedrig"},
      ]
    });
    setPruefLoading(false);
  };

  const sendPruefChat = async () => {
    if(!pruefChat.trim()||pruefChatBusy) return;
    const q = pruefChat.trim(); setPruefChat(""); setPruefChatBusy(true);
    setPruefChatMsgs(p=>[...p,{role:"user",text:q}]);
    try {
      const sys = "Du bist ein Steuerexperte der bei deutschen Betriebsprüfungen hilft. Beantworte Fragen zu Betriebsprüfungen, benötigten Dokumenten und Fristen auf Deutsch, kurz und präzise.";
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:sys,
          messages:[...pruefChatMsgs.map(m=>({role:m.role,content:m.text})),{role:"user",content:q}]})});
      const data = await res.json();
      const text = data.content?.map(c=>c.text||"").join("")||"Fehler.";
      setPruefChatMsgs(p=>[...p,{role:"assistant",text}]);
    } catch { setPruefChatMsgs(p=>[...p,{role:"assistant",text:"Verbindungsfehler."}]); }
    setPruefChatBusy(false);
  };

  const sendChat = async () => {
    if(!chatIn.trim()||chatBusy) return;
    const q = chatIn.trim(); setChatIn(""); setChatBusy(true);
    setMsgs(p=>[...p,{role:"user",text:q}]);
    try {
      const sys = `Du bist ein deutscher Steuer- und Buchhaltungsassistent für Selbstständige (BuchhaltNow). Bei Rechnungsanfragen antworte NUR mit JSON: {"action":"rechnung","kunde":"...","positionen":[{"bezeichnung":"...","menge":N,"einzelpreis":N}],"mwstSatz":19}. Sonst antworte auf Deutsch, kurz und präzise. Kontext: ${uf}, ${sl}, Gewinn ${fmt(gw2)}, USt ${fmt(us)}.`;
      const history = msgs.slice(1).map(m=>({role:m.role,content:m.text}));
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[...history,{role:"user",content:q}]})});
      const data = await res.json();
      const text = data.content?.map(c=>c.text||"").join("")||"Fehler.";
      try {
        const parsed = JSON.parse(text.trim());
        if(parsed.action==="rechnung"){
          const netto=parsed.positionen.reduce((s,x)=>s+x.menge*x.einzelpreis,0);
          const mwst =netto*(parsed.mwstSatz/100);
          const id   = newId("RE");
          const draft = {id,typ:"rechnung",kunde:parsed.kunde,pos:parsed.positionen.map(x=>({bez:x.bezeichnung,menge:x.menge,ep:x.einzelpreis})),mwstSatz:parsed.mwstSatz,netto,mwst,betrag:netto+mwst,datum:today,faellig:addDays(today,30),zahlungsziel:30,status:"offen",email:""};
          setRechnungen(prev=>[...prev,draft]); setTab("rechnungen");
          setMsgs(prev=>[...prev,{role:"assistant",text:`✅ Rechnung für **${parsed.kunde}** erstellt!\nNetto: ${fmt(netto)} | MwSt ${parsed.mwstSatz}%: ${fmt(mwst)} | Brutto: ${fmt(netto+mwst)}\n\nSiehe Tab "Rechnungen".`}]);
        } else setMsgs(prev=>[...prev,{role:"assistant",text}]);
      } catch { setMsgs(prev=>[...prev,{role:"assistant",text}]); }
    } catch { setMsgs(prev=>[...prev,{role:"assistant",text:"Verbindungsfehler."}]); }
    setChatBusy(false);
  };

  const nav = [
    {id:"dashboard",   l:"Dashboard",         e:"⊞"},
    {id:"rechnungen",  l:"Rechnungen",        e:"📄"},
    {id:"produkte",    l:"Produkte",          e:"📦"},
    {id:"scan",        l:"Scan / Import",     e:"⊙"},
    {id:"belege",      l:"Beleg-Archiv",      e:"📂"},
    {id:"banking",     l:"Banking",           e:"⊟"},
    {id:"steuer",      l:"Steuern & Elster",  e:"↑"},
    {id:"pruefung",    l:"Prüfungsassistent", e:"🔍"},
    {id:"personal",    l:"Personal",          e:"👥", ultimate:true},
    {id:"assistent",   l:"KI-Assistent",      e:"✦", ki:true},
  ];

  if(!loggedIn) return <LoginPage onLogin={()=>setLoggedIn(true)}/>;

  return (
    <div style={{fontFamily:"'Inter',sans-serif",background:"#08080f",minHeight:"100vh",display:"flex",color:"#e0e0f0"}}>
      <style>{CSS}</style>

      {/* ── SIDEBAR ── */}
      <div style={{width:222,background:"#0b0b18",borderRight:"1px solid rgba(255,255,255,.05)",display:"flex",flexDirection:"column",padding:"18px 0 0",flexShrink:0}}>
        <div style={{padding:"0 16px 18px"}}><Logo/><div style={{fontSize:9,color:G,fontFamily:"'DM Mono',monospace",marginTop:3,letterSpacing:1}}>BETA</div></div>
        <nav style={{flex:1,padding:"0 9px",display:"flex",flexDirection:"column",gap:1,overflowY:"auto"}}>
          {nav.map(it=>{
            const locked = it.ultimate && !isUlt;
            return (
              <button key={it.id} className={`nb${tab===it.id?" on":""}`}
                onClick={()=>locked ? alert("Personal ist nur im Ultimate-Plan verfügbar. In Einstellungen upgraden!") : setTab(it.id)}
                style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:7,color:tab===it.id?G:locked?"#3a3a4a":"#777",fontSize:12,fontWeight:tab===it.id?600:400,textAlign:"left",borderLeft:tab===it.id?`2px solid ${G}`:"2px solid transparent",width:"100%",cursor:locked?"not-allowed":"pointer"}}>
                <span style={{fontSize:12}}>{it.e}</span>
                <span style={{flex:1}}>{it.l}</span>
                {it.ki&&<span style={{fontSize:9,background:"rgba(34,211,166,.15)",color:G,padding:"2px 5px",borderRadius:4,fontWeight:700}}>KI</span>}
                {locked&&<span className="ultimate-badge">ULT</span>}
              </button>
            );
          })}
        </nav>
        {/* Unternehmensform */}
        <div style={{padding:"10px 13px 0",borderTop:"1px solid rgba(255,255,255,.05)"}}>
          <div style={{fontSize:9,color:"#444",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Unternehmensform</div>
          <div style={{display:"flex",flexDirection:"column",gap:2,background:"#0f0f1e",borderRadius:7,padding:3}}>
            {[{v:"einzelunternehmen",l:"§18/§15 Einzel."},{v:"gmbh",l:"GmbH / UG"},{v:"kleinunternehmer",l:"§19 Kleinuntern."}].map(u=>(
              <button key={u.v} className={`sb${uf===u.v?" on":""}`} onClick={()=>setUf(u.v)} style={{textAlign:"left",padding:"4px 8px"}}>{u.l}</button>
            ))}
          </div>
          {isKU&&<div style={{marginTop:4,fontSize:9,color:"#facc15"}}>§19: keine MwSt auf Rechnungen</div>}
        </div>
        {/* Plan + Settings */}
        <div style={{padding:"10px 13px 14px",borderTop:"1px solid rgba(255,255,255,.05)",marginTop:8}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7,padding:"6px 9px",background:isUlt?"rgba(245,158,11,.08)":isPro?"rgba(34,211,166,.07)":"rgba(255,255,255,.03)",borderRadius:8,border:`1px solid ${isUlt?"rgba(245,158,11,.25)":isPro?"rgba(34,211,166,.2)":"rgba(255,255,255,.07)"}`}}>
            <div>
              <div style={{fontSize:10,fontWeight:700,color:isUlt?"#f59e0b":isPro?G:"#aaa"}}>{isUlt?"🏆 Ultimate":isPro?"✦ Pro Plan":"Free Plan"}</div>
              <div style={{fontSize:9,color:"#555"}}>{isUlt?"Alle Features":isPro?"Pro aktiv":"Upgrade verfügbar"}</div>
            </div>
            {!isUlt&&<button className="bp" style={{padding:"3px 8px",fontSize:9}} onClick={()=>setTab("einstellungen")}>↑</button>}
          </div>
          <button className={`nb${tab==="einstellungen"?" on":""}`} onClick={()=>setTab("einstellungen")}
            style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:7,color:tab==="einstellungen"?G:"#666",fontSize:12,width:"100%",textAlign:"left",borderLeft:tab==="einstellungen"?`2px solid ${G}`:"2px solid transparent"}}>
            <span>⚙</span><span>Einstellungen</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{flex:1,overflow:"auto",padding:22}}>

        {/* ═══ EINSTELLUNGEN ═══ */}
        {tab==="einstellungen"&&(
          <div>
            <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:4}}>Einstellungen</div>
            <div style={{color:"#555",fontSize:12,marginBottom:20}}>Konto, Steuerdaten und Abonnement</div>
            <div className="panel" style={{padding:18,marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:14}}>Plan wählen</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:11}}>
                {[
                  {p:"free",      label:"Free",        price:"0 €",  c:"#888",    features:["Dashboard & Übersicht","Belege scannen (5/Mo.)","Banking (1 Konto)","KI (10 Anfragen)"]},
                  {p:"pro",       label:"✦ Pro",       price:"19 €", c:G,         features:["Alles aus Free","Unbegrenzte Belege","Alle Banking-Konten","Rechnungen & Produkte","KI unbegrenzt","Prüfungsassistent","ELSTER-Übermittlung"]},
                  {p:"ultimate",  label:"🏆 Ultimate", price:"49 €", c:"#f59e0b", features:["Alles aus Pro","Personal & Lohnzettel","DATEV-Export","Mehrere Firmen","Prioritäts-Support","API-Zugang"]},
                ].map(pl=>(
                  <div key={pl.p} style={{background:plan===pl.p?`${pl.c}0d`:"rgba(255,255,255,.02)",border:`1px solid ${plan===pl.p?pl.c:"rgba(255,255,255,.07)"}`,borderRadius:10,padding:14,cursor:"pointer"}} onClick={()=>setPlan(pl.p)}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <span style={{fontSize:13,fontWeight:700,color:plan===pl.p?pl.c:"#fff"}}>{pl.label}</span>
                      {plan===pl.p&&<span className="bdg bv">Aktiv</span>}
                    </div>
                    <div className="mn" style={{fontSize:17,fontWeight:700,color:pl.c,marginBottom:8}}>{pl.price}<span style={{fontSize:10,color:"#555",fontFamily:"Inter",fontWeight:400}}>/Mo.</span></div>
                    {pl.features.map((f,i)=><div key={i} style={{fontSize:10,color:plan===pl.p?pl.c:"#555",padding:"2px 0"}}>✓ {f}</div>)}
                    {plan!==pl.p&&<button className="bp" style={{width:"100%",padding:7,fontSize:11,marginTop:10,background:pl.c}} onClick={e=>{e.stopPropagation();setPlan(pl.p);}}>Wechseln</button>}
                  </div>
                ))}
              </div>
            </div>
            <div className="panel" style={{padding:18,marginBottom:14}}>
              <div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:12}}>🔒 ELSTER-Zertifikat</div>
              <label htmlFor="elster-up">
                <div className="uz" style={{maxWidth:360}}>
                  {!elsterFile
                    ?<><div style={{fontSize:22,marginBottom:4}}>🔑</div><div style={{fontSize:11,color:"#777"}}>ElsterOnline-Zertifikat hochladen (.pfx)</div></>
                    :<><div style={{fontSize:22,marginBottom:4}}>✅</div><div style={{fontSize:11,color:G,fontWeight:600}}>{elsterFile.name}</div></>}
                </div>
              </label>
              <input type="file" id="elster-up" accept=".pfx,.p12,.cer" onChange={e=>setElsterFile(e.target.files[0])}/>
            </div>
            <div className="panel" style={{padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontSize:12,fontWeight:500,color:"#e0e0f0"}}>Sitzung beenden</div><div style={{fontSize:10,color:"#555"}}>Von BuchhaltNow abmelden</div></div>
                <button className="br" style={{padding:"8px 16px",fontSize:12}} onClick={()=>setLoggedIn(false)}>Abmelden</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ DASHBOARD ═══ */}
        {tab==="dashboard"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div>
                <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:2}}>Übersicht</div>
                <div style={{color:"#555",fontSize:12}}>{uf==="gmbh"?"GmbH · Körperschaftsteuer":isKU?"Kleinunternehmer · §19 UStG":"Einzelunternehmen · Einkommensteuer"} · {sl}</div>
              </div>
              <select value={periode} onChange={e=>setPeriode(e.target.value)}>
                <optgroup label="Monate">{PERIODEN.filter(p=>p.typ==="monat").map(p=><option key={p.val} value={p.val}>{p.label}</option>)}</optgroup>
                <optgroup label="Quartale">{PERIODEN.filter(p=>p.typ==="quartal").map(p=><option key={p.val} value={p.val}>{p.label}</option>)}</optgroup>
                <optgroup label="Gesamtjahr">{PERIODEN.filter(p=>p.typ==="jahr").map(p=><option key={p.val} value={p.val}>{p.label}</option>)}</optgroup>
              </select>
            </div>
            {isKU&&<div className="ib" style={{marginBottom:10,fontSize:12,display:"flex",gap:8,alignItems:"center"}}><span>ℹ️</span><span style={{color:G,fontWeight:500}}>§19 UStG</span><span style={{color:"#555"}}>– keine MwSt auf Rechnungen</span></div>}
            {euL.length>0&&!isKU&&<div className="eb" style={{marginBottom:10,display:"flex",gap:9,alignItems:"center",padding:"8px 13px"}}><span>🇪🇺</span><div style={{flex:1,fontSize:12}}><span style={{fontWeight:600,color:"#a78bfa"}}>ZM-Meldung erforderlich</span><span style={{color:"#666"}}> · {euL.length} EU-Lieferung(en)</span></div><button className="bg" style={{padding:"4px 9px",fontSize:11}} onClick={()=>setTab("steuer")}>→</button></div>}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9,marginBottom:9}}>
              {[{l:"Einnahmen brutto",v:fmt(eB),s:"inkl. MwSt",c:G,i:"+"},{l:"Ausgaben brutto",v:fmt(aB),s:"inkl. MwSt",c:"#f87171",i:"−"},{l:"Gewinn netto",v:fmt(gw2),s:"vor Steuer",c:"#60a5fa",i:"="},{l:isKU?"Keine USt":"USt-Schuld",v:isKU?"—":fmt(us),s:isKU?"§19 UStG":"ans Finanzamt",c:"#facc15",i:"!"}].map((k,i)=>(
                <div key={i} className="card kpi">
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:10,color:"#555"}}>{k.l}</div><div style={{width:20,height:20,borderRadius:5,background:k.c+"18",display:"flex",alignItems:"center",justifyContent:"center",color:k.c,fontSize:9,fontWeight:700}}>{k.i}</div></div>
                  <div className="mn" style={{fontSize:15,fontWeight:700,color:k.c,marginBottom:1}}>{k.v}</div>
                  <div style={{fontSize:10,color:"#444"}}>{k.s}</div>
                </div>
              ))}
            </div>
            {/* Tax cards with year/mode toggle */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:9}}>
              {[
                {l:"GEWERBESTEUER (§11 GewStG)",v:fmt(gs),c:"#60a5fa",sub:"Freibetrag 24.500 €"},
                {l:uf==="gmbh"?"KÖRPERSCHAFTSTEUER":"EINKOMMENSTEUER",v:fmt(st),c:"#a78bfa",sub:uf==="gmbh"?"15% KSt + 5,5% SolZ":"§32a EStG"},
                {l:"GESAMTSTEUER",v:fmt(us+gs+st),c:"#f87171",sub:`Verfügbar: ${fmt(Math.max(0,gw2-gs-st))}`},
              ].map((k,i)=>(
                <div key={i} className="card kpi" style={{borderColor:k.c+"30"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div style={{fontSize:9,color:"#555"}}>{k.l}</div>
                    {i<2&&<div style={{display:"flex",gap:3,alignItems:"center"}}>
                      <select value={taxYear} onChange={e=>setTaxYear(e.target.value)} style={{fontSize:9,padding:"2px 4px",borderRadius:4,border:"1px solid rgba(255,255,255,.1)",background:"#1a1a2e",color:"#ccc"}}>
                        {["2023","2024","2025","2026"].map(y=><option key={y} value={y}>{y}</option>)}
                      </select>
                      <button title={taxMode==="real"?"→ Jahreshochrech.":"→ Ist-Daten"} style={{fontSize:9,padding:"2px 6px",borderRadius:4,background:taxMode==="estimated"?"rgba(34,211,166,.15)":"rgba(255,255,255,.08)",border:"none",color:taxMode==="estimated"?G:"#666",cursor:"pointer"}} onClick={()=>setTaxMode(m=>m==="real"?"estimated":"real")}>
                        {taxMode==="estimated"?"~Jahr":"Ist"}
                      </button>
                    </div>}
                  </div>
                  <div className="mn" style={{fontSize:16,fontWeight:700,color:k.c,marginBottom:1}}>{k.v}</div>
                  <div style={{fontSize:10,color:"#444"}}>{k.sub}{taxMode==="estimated"&&i<2?" (hochgerechnet)":""}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
              <div className="panel">
                <div className="panel-hd"><span style={{fontSize:11,fontWeight:600,color:"#fff"}}>Offene Rechnungen</span><button className="bg" style={{padding:"3px 9px",fontSize:11}} onClick={()=>setTab("rechnungen")}>Alle →</button></div>
                {rechnungen.filter(x=>x.status==="offen"||x.status.includes("mahnung")).slice(0,4).map((re,i)=>(
                  <div key={re.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 14px",borderBottom:"1px solid rgba(255,255,255,.04)"}}>
                    <div><div style={{fontSize:12,fontWeight:500,color:"#e0e0f0"}}>{re.kunde}</div><div style={{fontSize:10,color:"#555"}}>Fällig: <span style={{color:"#facc15"}}>{fmtD(re.faellig)}</span></div></div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span className={`bdg ${re.status==="offen"?"bo":"bm"}`}>{re.status==="offen"?"Offen":"Mahnung"}</span>
                      <span className="mn" style={{fontSize:11,fontWeight:700,color:G}}>{fmt(re.betrag)}</span>
                    </div>
                  </div>
                ))}
                {rechnungen.filter(x=>x.status==="offen"||x.status.includes("mahnung")).length===0&&<div style={{padding:"12px 14px",fontSize:12,color:"#444"}}>Keine offenen Rechnungen ✓</div>}
              </div>
              <div className="panel">
                <div className="panel-hd"><span style={{fontSize:11,fontWeight:600,color:"#fff"}}>Nächste Fristen</span><button className="bg" style={{padding:"3px 9px",fontSize:11}} onClick={()=>setTab("steuer")}>Alle →</button></div>
                {STEUER_FRISTEN.filter(f=>f.status==="offen").slice(0,5).map((f,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 14px",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
                    <span style={{flex:1,fontSize:11,color:"#999",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.t}</span>
                    <span className={`bdg ${f.art==="USt-VA"?"bv":f.art==="GewSt"?"bb":f.art==="ESt"?"beu":f.art==="ZM"?"bai":"bo"}`} style={{fontSize:9,flexShrink:0}}>{f.art}</span>
                    <span className="mn" style={{fontSize:10,color:"#facc15",flexShrink:0}}>{f.frist}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ RECHNUNGEN ═══ */}
        {tab==="rechnungen"&&<ReTab rechnungen={rechnungen} setRechnungen={setRechnungen} produkte={produkte} isKU={isKU} setTab={setTab}/>}

        {/* ═══ PRODUKTE ═══ */}
        {tab==="produkte"&&<ProdTab produkte={produkte} setProdukte={setProdukte}/>}

        {/* ═══ PERSONAL (Ultimate) ═══ */}
        {tab==="personal"&&isUlt&&<PersonalTab mitarbeiter={mitarbeiter} setMitarbeiter={setMitarbeiter}/>}

        {/* ═══ SCAN ═══ */}
        {tab==="scan"&&<ScanTab/>}

        {/* ═══ BELEGE ═══ */}
        {tab==="belege"&&(
          <div>
            <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:3}}>Beleg-Archiv</div>
            <div style={{color:"#555",fontSize:12,marginBottom:14}}>Alle Belege kategorisiert, durchsuchbar und herunterladbar</div>
            <div style={{display:"flex",gap:8,marginBottom:11,flexWrap:"wrap",alignItems:"center"}}>
              <select value={periode} onChange={e=>setPeriode(e.target.value)}>{PERIODEN.map(p=><option key={p.val} value={p.val}>{p.label}</option>)}</select>
              <select value={belegeKat} onChange={e=>setBelegeKat(e.target.value)}>{KATEGORIEN.map(k=><option key={k} value={k}>{k}</option>)}</select>
              {["Alle","Eingang","Ausgang","EU","Drittland","KI-Prüfung"].map(f=><button key={f} className={`fb${belegeTyp===f?" on":""}`} onClick={()=>setBelegeTyp(f)}>{f}</button>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:11}}>
              {[{l:"Belege",v:belegeGef.length+" Stk.",c:"#60a5fa"},{l:"Eingang",v:fmt(belegeGef.filter(x=>x.typ==="eingang").reduce((s,x)=>s+x.betrag,0)),c:"#f87171"},{l:"Ausgang",v:fmt(belegeGef.filter(x=>x.typ==="ausgang").reduce((s,x)=>s+x.betrag,0)),c:G},{l:"Vorsteuer",v:fmt(belegeGef.filter(x=>x.typ==="eingang").reduce((s,x)=>s+x.mwst,0)),c:"#60a5fa"},{l:"USt",v:fmt(belegeGef.filter(x=>x.typ==="ausgang").reduce((s,x)=>s+x.mwst,0)),c:"#facc15"}].map((k,i)=>(
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
        )}

        {/* ═══ BANKING ═══ */}
        {tab==="banking"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
              <div><div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:2}}>Banking</div><div style={{color:"#555",fontSize:12}}>PSD2-Konten, Umsätze und Gebühren</div></div>
              <button className={`bp sync-btn${bankSyncing?" syncing":""}`} style={{padding:"9px 18px",fontSize:13,display:"flex",alignItems:"center",gap:8}} onClick={()=>{setBankSyncing(true);setTimeout(()=>setBankSyncing(false),2200);}}>
                <span style={{display:"inline-block",animation:bankSyncing?"spin 1s linear infinite":"none",transformOrigin:"center"}}>⟳</span>
                {bankSyncing?"Synchronisiere…":"Alle Konten sync"}
              </button>
            </div>
            {bankSyncing&&<div className="ib" style={{marginBottom:12,fontSize:12,display:"flex",gap:8,alignItems:"center"}}><span className="pu">⟳</span><span>Verbinde mit Commerzbank… N26… PayPal…</span></div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:13}}>
              {[
                {k:"commerzbank",n:"Commerzbank",  l:"🏦"},
                {k:"n26",        n:"N26 Business", l:"📱"},
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
            {ppGeb>0&&<div className="wb" style={{marginTop:9,fontSize:11,color:"#777"}}><span style={{fontWeight:600,color:"#facc15"}}>💡 PayPal-Gebühren ({fmt(ppGeb)}):</span> Betriebsausgaben (§4 EStG), nicht umsatzsteuerpflichtig (§4 Nr.8 UStG).</div>}
          </div>
        )}

        {/* ═══ STEUERN ═══ */}
        {tab==="steuer"&&(
          <div>
            <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:3}}>Steuern & ELSTER</div>
            <div style={{color:"#555",fontSize:12,marginBottom:14}}>Meldungen, Übermittlung und alle Fristen</div>
            {isKU&&<div className="ib" style={{marginBottom:12,fontSize:12,padding:"8px 13px"}}><span style={{fontWeight:600,color:G}}>§19 UStG aktiv</span> – keine USt-Voranmeldung nötig.</div>}
            {euL.length>0&&!isKU&&<div className="eb" style={{marginBottom:12}}>
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
            </div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
              {[
                {t:"USt-Voranmeldung",  s:sl,                   st:r.length>0?"Bereit":"Keine Daten",d:"10.04.2025",v:fmt(us),    c:"#facc15",e:"📋",hide:isKU},
                {t:uf==="gmbh"?"Körperschaftsteuer":"Einkommensteuer",s:"Jahreserklärung 2024",st:"In Vorbereitung",d:"31.07.2025",v:fmt(st),c:"#a78bfa",e:"📊"},
                {t:"Gewerbesteuer",     s:"§11 GewStG ~400%",    st:gw2>24500?"Bereit":"Unter Freibetrag",d:"15.05.2025",v:gw2>24500?fmt(gs):"Freibetrag",c:"#60a5fa",e:"🏢"},
                {t:"EÜR 2024",         s:"Einnahmen-Überschuss", st:"Bereit",d:"31.07.2025",v:fmt(gw2),c:G,e:"📈"},
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
                  {it.st==="Bereit"&&<button className={!elsterFile?"bg":"bp"} style={{width:"100%",padding:7,fontSize:11}} onClick={()=>!elsterFile&&alert("Bitte ELSTER-Zertifikat in Einstellungen hochladen!")}>
                    {elsterFile?"Via ELSTER übermitteln →":"🔒 Zertifikat in Einstellungen"}
                  </button>}
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
        )}

        {/* ═══ PRÜFUNGSASSISTENT ═══ */}
        {tab==="pruefung"&&(
          <div>
            <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:3}}>Prüfungsassistent</div>
            <div style={{color:"#555",fontSize:12,marginBottom:16}}>KI analysiert deinen Betriebsprüfungsbescheid und bereitet alle Unterlagen vor</div>

            {/* Schritt-Anleitung */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
              {[
                {n:"1",icon:"📬",t:"Brief hochladen",s:"Lade das Prüfungsschreiben vom Finanzamt hoch (PDF oder Foto).",c:pruefFile?"bv":"bo"},
                {n:"2",icon:"🔍",t:"KI analysiert",s:"Die KI erkennt Prüfungszeitraum, Steuerart und benötigte Belege.",c:pruefResult?"bv":pruefLoading?"bo":"bdr"},
                {n:"3",icon:"📦",t:"Unterlagen exportieren",s:"Lade alle relevanten Belege als ZIP-Paket herunter oder sende per E-Mail.",c:pruefResult?"bv":"bdr"},
              ].map((step,i)=>(
                <div key={i} className="panel" style={{padding:14,borderColor:step.c==="bv"?"rgba(34,211,166,.3)":step.c==="bo"?"rgba(250,204,21,.2)":"rgba(255,255,255,.06)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:step.c==="bv"?"rgba(34,211,166,.2)":step.c==="bo"?"rgba(250,204,21,.15)":"rgba(255,255,255,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:step.c==="bv"?G:step.c==="bo"?"#facc15":"#555",flexShrink:0}}>
                      {step.c==="bv"?"✓":step.n}
                    </div>
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
                      ?<><div style={{fontSize:28,marginBottom:6}}>📬</div><div style={{fontSize:13,fontWeight:600,color:"#fff",marginBottom:4}}>Finanzamt-Brief hochladen</div><div style={{fontSize:11,color:"#555",marginBottom:10}}>PDF oder Foto des Prüfungsschreibens</div><div className="bp" style={{display:"inline-block",padding:"7px 16px",fontSize:12,borderRadius:8}}>Datei wählen</div></>
                      :<><div style={{fontSize:28,marginBottom:4}}>✅</div><div style={{fontSize:12,fontWeight:600,color:G}}>{pruefFile.name}</div><button className="bg" style={{marginTop:7,padding:"4px 11px",fontSize:11}} onClick={e=>{e.preventDefault();setPruefFile(null);setPruefResult(null);}}>Andere Datei</button></>}
                  </div>
                </label>
                <input type="file" id="pruef-upload" accept="image/*,application/pdf" onChange={e=>{setPruefFile(e.target.files[0]);setPruefResult(null);}}/>
                {pruefFile&&!pruefResult&&<button className="bp" style={{width:"100%",padding:10,fontSize:12,marginTop:8}} disabled={pruefLoading} onClick={startPruefung}>
                  {pruefLoading?"🔍 KI analysiert…":"🔍 Brief analysieren"}
                </button>}
              </div>
              {/* Chat */}
              <div className="panel" style={{display:"flex",flexDirection:"column"}}>
                <div className="panel-hd"><span style={{fontSize:11,fontWeight:600,color:"#fff"}}>Frage an den Prüfungsassistenten</span></div>
                <div style={{flex:1,padding:10,overflowY:"auto",maxHeight:220,display:"flex",flexDirection:"column",gap:7}}>
                  {pruefChatMsgs.length===0&&<div style={{fontSize:11,color:"#555",padding:6}}>Stellen Sie Fragen wie: "Welche Belege brauche ich für EU-Lieferungen?" oder "Wie lang müssen Belege aufbewahrt werden?"</div>}
                  {pruefChatMsgs.map((m,i)=>(
                    <div key={i} className={m.role==="user"?"cu":"ca"} style={{whiteSpace:"pre-wrap"}}>{m.text}</div>
                  ))}
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
                      <button className="bg" style={{padding:"4px 10px",fontSize:11}} onClick={()=>alert("ZIP-Archiv wird erstellt…")}>📦 ZIP</button>
                      <button className="bp" style={{padding:"4px 10px",fontSize:11}} onClick={()=>alert("E-Mail an Prüfer gesendet.")}>📧 An Prüfer</button>
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
        )}

        {/* ═══ KI-ASSISTENT ═══ */}
        {tab==="assistent"&&(
          <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 80px)"}}>
            <div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:3}}>KI-Assistent</div>
            <div style={{color:"#555",fontSize:12,marginBottom:12}}>Steuerfragen, Rechnungen diktieren, ELSTER erklärt</div>
            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              {["USt-Satz für Software?","Welche Betriebsausgaben?","Kleinunternehmer Vorteile?","Schreib Rechnung an Muster GmbH über 5 Stunden Beratung à 200 EUR"].map(q=>(
                <button key={q} className="bg" style={{padding:"5px 11px",fontSize:11}} onClick={()=>{setChatIn(q);}}>{q}</button>
              ))}
            </div>
            <div style={{flex:1,background:"#0b0b18",borderRadius:12,border:"1px solid rgba(255,255,255,.06)",padding:14,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,marginBottom:10}}>
              {msgs.map((m,i)=>(
                <div key={i} className={m.role==="user"?"cu":"ca"} style={{whiteSpace:"pre-wrap"}}>{m.text}</div>
              ))}
              {chatBusy&&<div className="ca"><span className="pu">…</span></div>}
              <div ref={chatEnd}/>
            </div>
            <div style={{display:"flex",gap:9}}>
              <textarea rows={2} value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendChat())} placeholder="Frage stellen oder Rechnung diktieren… (Enter = Senden)"/>
              <button className="bp" style={{padding:"10px 18px",fontSize:14,alignSelf:"flex-end"}} onClick={sendChat} disabled={chatBusy}>→</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
