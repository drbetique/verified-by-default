export const FACTORIES = [
  { id: "FAC-NL-01", name: "TextileCo Haarlem",    lat: 52.38, lng: 4.64, sector: "Textiles",   claimed: 84 },
  { id: "FAC-NL-02", name: "PlastiForm Utrecht",   lat: 52.09, lng: 5.12, sector: "Plastics",   claimed: 79 },
  { id: "FAC-NL-03", name: "MetalWorks Eindhoven", lat: 51.44, lng: 5.48, sector: "Metal",      claimed: 91 },
  { id: "FAC-NL-04", name: "EcoFab Rotterdam",     lat: 51.92, lng: 4.47, sector: "Composites", claimed: 88 },
  { id: "FAC-NL-05", name: "GreenPack Groningen",  lat: 53.22, lng: 6.56, sector: "Packaging",  claimed: 76 },
];

// UPDATE these with real teammate names once you know them
export const TEAM = [
  { name: "Victor Betiku",  role: "IoT / Firmware" },
  { name: "Team Member 2",  role: "Frontend / UX" },
  { name: "Team Member 3",  role: "Backend / API" },
  { name: "Team Member 4",  role: "Business Model" },
  { name: "Team Member 5",  role: "Sustainability" },
];

export const S = {
  bg:       "#080B10",
  panel:    "#0D1117",
  card:     "#111620",
  border:   "#1C2333",
  teal:     "#00C896",
  amber:    "#F0A500",
  red:      "#E05252",
  white:    "#E2E8F0",
  dim:      "#4A5568",
  dimLight: "#718096",
  font:     "'IBM Plex Mono', monospace",
  fontSans: "'DM Sans', sans-serif",
};

export function generateSensorReading(prev = {}) {
  return {
    energy: +Math.max(1.1, Math.min(3.9, (prev.energy || 2.2) + (Math.random() - 0.48) * 0.25)).toFixed(2),
    water:  +Math.max(0.6, Math.min(2.8, (prev.water  || 1.5) + (Math.random() - 0.50) * 0.18)).toFixed(2),
    uptime: +Math.max(58,  Math.min(99,  (prev.uptime || 87)  + (Math.random() - 0.45) * 2.5)).toFixed(1),
    temp:   +Math.max(18,  Math.min(42,  (prev.temp   || 26)  + (Math.random() - 0.50) * 1.2)).toFixed(1),
    co2:    +Math.max(380, Math.min(820, (prev.co2    || 510) + (Math.random() - 0.50) * 20)).toFixed(0),
  };
}

export function computeScore(r) {
  if (!r || !r.energy) return 70;
  const e = Math.max(0, 100 - (r.energy - 1.1) * 38);
  const w = Math.max(0, 100 - (r.water  - 0.6) * 28);
  return Math.round(e * 0.45 + w * 0.25 + (r.uptime || 85) * 0.30);
}

export function scoreColor(s) {
  if (s >= 78) return "#00C896";
  if (s >= 58) return "#F0A500";
  return "#E05252";
}

export function scoreLabel(s) {
  if (s >= 78) return "VERIFIED COMPLIANT";
  if (s >= 58) return "NEEDS IMPROVEMENT";
  return "NON-COMPLIANT";
}

export function getGapStatus(gap) {
  if (Math.abs(gap) <= 3) return { color: "#00C896", label: "ACCURATE" };
  if (Math.abs(gap) <= 8) return { color: "#F0A500", label: "INFLATED" };
  return { color: "#E05252", label: "MISREPORTED" };
}
