export const G = "#22D3A6";

export const fmt = n => Number(n).toLocaleString("de-DE", { style:"currency", currency:"EUR" });

export const fmtD = s => {
  if(!s) return "—";
  const [y,m,d] = s.split("-");
  return `${d}.${m}.${y}`;
};

export const today = new Date().toISOString().slice(0,10);

export const addDays = (d,n) =>
  new Date(new Date(d).getTime() + n*86400000).toISOString().slice(0,10);

// Filtert Belege nach Periode (Monat, Quartal, Jahr)
export function filterPeriode(list, p) {
  if(p === "2025") return list;
  if(p.includes("Q")) {
    const [y,q] = p.split("-");
    const m = {Q1:["01","02","03"], Q2:["04","05","06"], Q3:["07","08","09"], Q4:["10","11","12"]};
    return list.filter(r => {
      const [ry,rm] = r.datum.split("-");
      return ry === y && m[q] && m[q].includes(rm);
    });
  }
  return list.filter(r => r.datum && r.datum.startsWith(p));
}

// Steuerberechnungen
export const gwSt  = g => g > 0 ? Math.max(0, g - 24500) * 0.035 * 4.0 : 0;
export const kStFn = g => g > 0 ? g * 0.15 * 1.055 : 0;
export const eStFn = g => {
  if(g <= 11604) return 0;
  if(g <= 66760) return g * 0.42 - 9267;
  return g * 0.45 - 18307;
};

export const annualize = (val, p) => {
  const m = {"2025-01":1,"2025-02":2,"2025-03":3,"2025-Q1":3,"2025-Q2":6,"2025-Q3":9,"2025":12};
  const mo = m[p] || 12;
  return mo > 0 ? (val / mo) * 12 : val;
};

export const calcRe = (pos, mwstSatz) => {
  const netto = pos.reduce((s,p) => s + Number(p.menge) * Number(p.ep), 0);
  const mwst  = netto * (Number(mwstSatz) / 100);
  return { netto, mwst, betrag: netto + mwst };
};
