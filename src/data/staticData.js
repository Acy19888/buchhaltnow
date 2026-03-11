export const BELEGE_DATA = [
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

export const BANKING_TX = [
  { id:1,  konto:"commerzbank", datum:"2025-03-12", text:"Gutschrift DEUTSCHE BANK AG",          betrag:35700,  zuordnung:"RE-2025-004", ust:"USt 5.700 EUR (19%)" },
  { id:2,  konto:"commerzbank", datum:"2025-03-10", text:"Lastschrift BÜROAREAL GMBH",           betrag:-3808,  zuordnung:"Beleg #15",   ust:"Vorsteuer 608 EUR (19%)" },
  { id:3,  konto:"commerzbank", datum:"2025-03-08", text:"Lastschrift STEUERBERATER MUELLER",    betrag:-2975,  zuordnung:"Beleg #10",   ust:"Vorsteuer 475 EUR (19%)" },
  { id:4,  konto:"commerzbank", datum:"2025-03-05", text:"Auslandsüberweisung NOVATECH UK",      betrag:-150,   zuordnung:"Auslandsgebühr", ust:"Bankgebühr §4 Nr.8 UStG", gebuehr:true, ausland:true },
  { id:5,  konto:"commerzbank", datum:"2025-03-01", text:"Eingang PARIS DESIGN SARL FR",         betrag:28500,  zuordnung:"RE-2025-003", ust:"Steuerfreie EU-Lieferung" },
  { id:6,  konto:"commerzbank", datum:"2025-02-14", text:"Gutschrift BMW GROUP MÜNCHEN",         betrag:47600,  zuordnung:"RE-2025-001", ust:"USt 7.600 EUR (19%)" },
  { id:7,  konto:"commerzbank", datum:"2025-02-10", text:"Lastschrift HOTEL VIER JAHRESZEITEN",  betrag:-1428,  zuordnung:"Beleg #5",    ust:"Vorsteuer 228 EUR – Prüfung!" },
  { id:8,  konto:"commerzbank", datum:"2025-01-15", text:"Lastschrift DEUTSCHE TELEKOM",         betrag:-2380,  zuordnung:"Beleg #1",    ust:"Vorsteuer 380 EUR (19%)" },
  { id:9,  konto:"n26",         datum:"2025-03-18", text:"Eingang NOVATECH LTD UK",              betrag:15000,  zuordnung:"Drittland-RE", ust:"Steuerfrei §4 Nr.1a UStG" },
  { id:10, konto:"n26",         datum:"2025-03-15", text:"Auslandsüberweisung USD Transfer",     betrag:-85,    zuordnung:"Wechselkursgebühr", ust:"Bankgebühr", gebuehr:true, ausland:true },
  { id:11, konto:"n26",         datum:"2025-02-03", text:"Eingang TECH STARTUP AG AT",           betrag:38000,  zuordnung:"Beleg #4",    ust:"Steuerfreie EU-Lieferung" },
  { id:12, konto:"paypal",      datum:"2025-03-20", text:"Zahlung erhalten Kunde XY",            betrag:500,    zuordnung:"Online-Verkauf", ust:"USt 79,83 EUR (19%)" },
  { id:13, konto:"paypal",      datum:"2025-03-20", text:"PayPal Transaktionsgebühr",            betrag:-17.65, zuordnung:"Gebühr",      ust:"PayPal-Gebühr §4 Nr.8 UStG", gebuehr:true },
  { id:14, konto:"paypal",      datum:"2025-03-15", text:"Zahlung erhalten Firma AB",            betrag:1190,   zuordnung:"Software-Lizenz", ust:"USt 190 EUR (19%)" },
  { id:15, konto:"paypal",      datum:"2025-03-15", text:"PayPal Transaktionsgebühr",            betrag:-39.90, zuordnung:"Gebühr",      ust:"PayPal-Gebühr §4 Nr.8 UStG", gebuehr:true },
];

export const INIT_RE = [
  { id:"RE-2025-001", typ:"rechnung",  kunde:"BMW Group München",      betrag:47600, netto:40000, mwst:7600,  mwstSatz:19, datum:"2025-01-15", faellig:"2025-02-14", status:"bezahlt",  pos:[{bez:"Strategieberatung Q4",menge:1,ep:40000}],        zahlungsziel:30, email:"einkauf@bmw.de" },
  { id:"RE-2025-002", typ:"rechnung",  kunde:"Siemens AG",             betrag:59500, netto:50000, mwst:9500,  mwstSatz:19, datum:"2025-02-14", faellig:"2025-03-16", status:"mahnung1", pos:[{bez:"IT-Beratung Feb",menge:100,ep:500}],             zahlungsziel:30, email:"ap@siemens.com" },
  { id:"RE-2025-003", typ:"rechnung",  kunde:"Paris Design SARL (FR)", betrag:28500, netto:28500, mwst:0,     mwstSatz:0,  datum:"2025-03-01", faellig:"2025-03-31", status:"bezahlt",  pos:[{bez:"Designleistung EU",menge:1,ep:28500}],           zahlungsziel:30, email:"factures@parisdesign.fr" },
  { id:"RE-2025-004", typ:"rechnung",  kunde:"Volkswagen Konzern",     betrag:71400, netto:60000, mwst:11400, mwstSatz:19, datum:"2025-03-05", faellig:"2025-04-04", status:"offen",    pos:[{bez:"Beratung März",menge:120,ep:500}],               zahlungsziel:30, email:"rechnungen@vw.de" },
  { id:"GS-2025-001", typ:"gutschrift",kunde:"BMW Group München",      betrag:-2380, netto:-2000, mwst:-380,  mwstSatz:19, datum:"2025-02-01", faellig:"2025-03-03", status:"bezahlt",  pos:[{bez:"Gutschrift: Retoure Software",menge:1,ep:-2000}], zahlungsziel:30, email:"einkauf@bmw.de", reRef:"RE-2025-001" },
];

export const INIT_PRODUKTE = [
  { id:1, name:"Strategieberatung",       einheit:"Stunde",   ep:250,  mwstSatz:19, kat:"Dienstleistung", aktiv:true  },
  { id:2, name:"IT-Consulting",           einheit:"Stunde",   ep:180,  mwstSatz:19, kat:"Dienstleistung", aktiv:true  },
  { id:3, name:"Softwarelizenz Standard", einheit:"Stück",    ep:990,  mwstSatz:19, kat:"Software",       aktiv:true  },
  { id:4, name:"Softwarelizenz Pro",      einheit:"Stück",    ep:1990, mwstSatz:19, kat:"Software",       aktiv:true  },
  { id:5, name:"Projektpauschale klein",  einheit:"Pauschal", ep:5000, mwstSatz:19, kat:"Dienstleistung", aktiv:true  },
  { id:6, name:"Schulung (halbtags)",     einheit:"Tag",      ep:800,  mwstSatz:19, kat:"Schulung",       aktiv:true  },
  { id:7, name:"Schulung (ganztags)",     einheit:"Tag",      ep:1500, mwstSatz:19, kat:"Schulung",       aktiv:true  },
  { id:8, name:"Wartungspaket",           einheit:"Monat",    ep:350,  mwstSatz:19, kat:"Support",        aktiv:false },
];

export const INIT_MA = [
  { id:1, name:"Anna Schmidt", typ:"vollzeit", stelle:"Senior Entwicklerin", gehalt:4800, sv:21.6, lohnst:780, netto:3270, einDatum:"2024-01-01", email:"anna.schmidt@firma.de", iban:"DE44500105175407324931" },
  { id:2, name:"Tom Meyer",    typ:"teilzeit", stelle:"Designer (20h/Wo)",   gehalt:2400, sv:10.8, lohnst:200, netto:1850, einDatum:"2024-03-15", email:"tom.meyer@firma.de",    iban:"DE89370400440532013000" },
  { id:3, name:"Lisa Braun",   typ:"minijob",  stelle:"Bürohilfe",           gehalt:556,  sv:0,    lohnst:0,   netto:556,  einDatum:"2024-06-01", email:"lisa.braun@gmail.com",  iban:"DE02200400600006130000" },
];

export const PERIODEN = [
  {label:"Januar 2025",       val:"2025-01", typ:"monat"},
  {label:"Februar 2025",      val:"2025-02", typ:"monat"},
  {label:"März 2025",         val:"2025-03", typ:"monat"},
  {label:"Q1 2025 (Jan–Mär)", val:"2025-Q1", typ:"quartal"},
  {label:"Q2 2025 (Apr–Jun)", val:"2025-Q2", typ:"quartal"},
  {label:"Q3 2025 (Jul–Sep)", val:"2025-Q3", typ:"quartal"},
  {label:"Q4 2025 (Okt–Dez)", val:"2025-Q4", typ:"quartal"},
  {label:"Gesamtjahr 2025",   val:"2025",    typ:"jahr"},
];

export const KATEGORIEN = ["Alle","Beratung","IT-Consulting","Software","Kommunikation","Fahrtkosten","Reisekosten","Bewirtungskosten","Büroausstattung","Beratungskosten","Versandkosten","Miete/Pacht","Designleistung","Sonstiges"];

export const STEUER_FRISTEN = [
  {t:"USt-VA Januar",  frist:"10.02.2025", art:"USt-VA", status:"erledigt"},
  {t:"USt-VA Februar", frist:"10.03.2025", art:"USt-VA", status:"erledigt"},
  {t:"GewSt Q1",       frist:"15.03.2025", art:"GewSt",  status:"erledigt"},
  {t:"ESt Q1",         frist:"10.03.2025", art:"ESt",    status:"erledigt"},
  {t:"USt-VA März",    frist:"10.04.2025", art:"USt-VA", status:"offen"},
  {t:"ZM Q1/2025",     frist:"25.04.2025", art:"ZM",     status:"offen"},
  {t:"GewSt Q2",       frist:"15.06.2025", art:"GewSt",  status:"offen"},
  {t:"ESt Q2",         frist:"10.06.2025", art:"ESt",    status:"offen"},
  {t:"EStE 2024",      frist:"31.07.2025", art:"Jahres", status:"offen"},
  {t:"GewStE 2024",    frist:"31.07.2025", art:"Jahres", status:"offen"},
  {t:"UStJE 2024",     frist:"31.07.2025", art:"Jahres", status:"offen"},
  {t:"KStE 2024",      frist:"31.07.2025", art:"Jahres", status:"offen"},
];

export const AI_Q = {
  hotel: {
    titel:"Hotel Vier Jahreszeiten", betrag:"1.428,00", mwst:"228,00",
    fragen:[
      {id:"zweck",    text:"Zweck der Übernachtung?",       opts:["Kundentermin","Messe/Konferenz","Teammeeting","Privat"]},
      {id:"nachweis", text:"Liegt ein Kundennachweis vor?", opts:["Ja, dokumentiert","Ja, Konferenzprogramm","Nein"]},
    ],
    ok:"Reisekosten (§4 Abs.5 EStG) – voll absetzbar, Vorsteuer 100% abzugsfähig",
    nok:"Privatentnahme – nicht absetzbar",
  },
  restaurant: {
    titel:"Restaurant Maier GmbH", betrag:"840,00", mwst:"54,95",
    fragen:[
      {id:"wer",    text:"Teilnehmer der Bewirtung?", opts:["Nur Mitarbeiter","Kunden/Geschäftspartner","Gemischt","Privat"]},
      {id:"anlass", text:"Geschäftlicher Anlass?",   opts:["Kundengespräch","Projektbesprechung","Teamessen","Kein Anlass"]},
    ],
    ok:"Bewirtungskosten (§4 Abs.5 Nr.2 EStG) – 70% absetzbar",
    nok:"Privatentnahme – nicht absetzbar",
  },
};
