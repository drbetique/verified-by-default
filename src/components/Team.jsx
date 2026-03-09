import { TEAM, S } from "../data.js";

const TECH_TAGS = ["ESP32 / STM32","MQTT + TLS","FastAPI","PostgreSQL","React","WebSocket","Circular Economy","Joynn Index"];

export default function Team() {
  return (
    <div className="fade-in">
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:2 }}>BUILD TEAM - RUN-EU ENTREPRENEURSHIP FESTIVAL 2026</div>
        <div style={{ fontSize:16, fontFamily:S.fontSans, fontWeight:700, color:S.white }}>NHL Stenden - Leeuwarden</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:20 }}>
        {TEAM.map((m,i) => (
          <div key={i} style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:4, padding:16, textAlign:"center" }}>
            <div style={{ width:40, height:40, borderRadius:"50%", background:S.teal+"22", border:`1px solid ${S.teal}`, margin:"0 auto 10px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:S.teal, fontWeight:700, fontFamily:S.fontSans }}>
              {m.name.charAt(0)}
            </div>
            <div style={{ fontSize:11, color:S.white, fontFamily:S.fontSans, fontWeight:600, marginBottom:4 }}>{m.name}</div>
            <div style={{ fontSize:9, color:S.dim, letterSpacing:1 }}>{m.role}</div>
          </div>
        ))}
      </div>

      <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:4, padding:16, marginBottom:12 }}>
        <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:10 }}>PROJECT - VERIFIED BY DEFAULT</div>
        <div style={{ fontSize:13, color:S.white, fontFamily:S.fontSans, lineHeight:1.7, maxWidth:640, marginBottom:14 }}>
          A sensor-verified factory data layer for the Joynn circularity index. We replace self-reporting with real hardware measurements. No trust required. The sensors report for the factory.
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {TECH_TAGS.map(t => (
            <span key={t} style={{ background:S.teal+"18", border:`1px solid ${S.teal}44`, color:S.teal, fontSize:9, padding:"3px 8px", letterSpacing:1 }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
