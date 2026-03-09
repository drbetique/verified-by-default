import { S } from "../data.js";

export default function Alerts({ alerts }) {
  return (
    <div className="fade-in">
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:2 }}>SYSTEM ALERTS  ·  REAL-TIME</div>
        <div style={{ fontSize:16, fontFamily:S.fontSans, fontWeight:700, color:S.white }}>Alert Feed</div>
      </div>
      {alerts.length === 0 ? (
        <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:4, padding:32, textAlign:"center", color:S.dim, fontSize:11, letterSpacing:1 }}>
          ALL SYSTEMS NOMINAL  ·  NO ACTIVE ALERTS
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {alerts.map((a,i) => (
            <div key={i} className="fade-in"
              style={{ background:S.card, border:`1px solid ${a.type==="NON_COMPLIANT"?S.red:S.amber}44`, borderRadius:4, padding:12, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:a.type==="NON_COMPLIANT"?S.red:S.amber, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:11, color:S.white, fontFamily:S.fontSans, marginBottom:2 }}>
                    {a.type==="NON_COMPLIANT" ? "Non-Compliant Score Detected" : "High Energy Consumption Detected"}
                  </div>
                  <div style={{ fontSize:9, color:S.dim }}>Factory: {a.id}  ·  Score: {a.score}  ·  {a.name}</div>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:9, color:S.dim, marginBottom:4 }}>{a.ts}</div>
                <span style={{ background:a.type==="NON_COMPLIANT"?S.red+"22":S.amber+"22", color:a.type==="NON_COMPLIANT"?S.red:S.amber, fontSize:9, padding:"2px 8px", letterSpacing:1 }}>
                  {a.type==="NON_COMPLIANT" ? "HIGH RISK" : "ELEVATED"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
