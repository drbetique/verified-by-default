import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FACTORIES, S, computeScore, scoreColor, scoreLabel } from "../data.js";
import MiniMap from "./MiniMap.jsx";

export default function Overview({ readings, selectedFactory, setSelectedFactory, setActiveNav }) {
  const compData = FACTORIES.map(f => {
    const s = computeScore(readings[f.id] || {});
    return { name: f.id.split("-")[2], verified: s, claimed: f.claimed };
  });
  const avgV = Math.round(FACTORIES.reduce((a,f) => a + computeScore(readings[f.id]||{}), 0) / FACTORIES.length);
  const avgC = Math.round(FACTORIES.reduce((a,f) => a + f.claimed, 0) / FACTORIES.length);

  return (
    <div className="fade-in">
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:2 }}>SYSTEM OVERVIEW  ·  {FACTORIES.length} FACTORIES MONITORED</div>
        <div style={{ fontSize:16, fontFamily:S.fontSans, fontWeight:700, color:S.white }}>Factory Verification Network</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:14 }}>
        {[
          { label:"FACTORIES ONLINE",   value:FACTORIES.length,        unit:"",     color:S.teal },
          { label:"AVG VERIFIED SCORE", value:avgV,                    unit:"/100", color:scoreColor(avgV) },
          { label:"AVG CLAIMED SCORE",  value:avgC,                    unit:"/100", color:S.amber },
          { label:"AVG DATA GAP",       value:`+${avgC-avgV}`,         unit:"pts",  color:S.red },
        ].map((m,i) => (
          <div key={i} style={{ background:S.card, border:`1px solid ${S.border}`, padding:"10px 14px", borderRadius:4 }}>
            <div style={{ fontSize:9, color:S.dim, letterSpacing:1.5, marginBottom:6 }}>{m.label}</div>
            <div style={{ fontSize:26, fontWeight:700, color:m.color, fontFamily:S.fontSans, lineHeight:1 }}>
              {m.value}<span style={{ fontSize:12, color:S.dim, marginLeft:4 }}>{m.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:14 }}>
        {FACTORIES.map(f => {
          const s = computeScore(readings[f.id]||{});
          const g = f.claimed - s;
          return (
            <div key={f.id} className="hover-row"
              onClick={() => { setSelectedFactory(f.id); setActiveNav("sensors"); }}
              style={{ background:S.card, border:`1px solid ${selectedFactory===f.id?S.teal:S.border}`, padding:10, borderRadius:4 }}>
              <div style={{ fontSize:9, color:S.dim, letterSpacing:1, marginBottom:6 }}>{f.id}</div>
              <div style={{ fontSize:24, fontWeight:700, color:scoreColor(s), fontFamily:S.fontSans }}>{s}</div>
              <div style={{ fontSize:9, color:scoreColor(s), marginTop:2, letterSpacing:1 }}>{scoreLabel(s)}</div>
              <div style={{ marginTop:6, paddingTop:6, borderTop:`1px solid ${S.border}` }}>
                <div style={{ fontSize:9, color:S.dim }}>CLAIMED: <span style={{ color:S.amber }}>{f.claimed}</span></div>
                <div style={{ fontSize:9, color:S.dim }}>GAP: <span style={{ color:g>5?S.red:S.teal }}>{g>0?"+":""}{g}</span></div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"340px 1fr", gap:12, marginBottom:14 }}>
        <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:4, padding:10 }}>
          <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:8 }}>FACTORY NETWORK  ·  NETHERLANDS</div>
          <div style={{ height:220 }}>
            <MiniMap factories={FACTORIES} selected={selectedFactory}
              onSelect={id => { setSelectedFactory(id); setActiveNav("sensors"); }} readings={readings} />
          </div>
          <div style={{ marginTop:8, display:"flex", gap:10, flexWrap:"wrap" }}>
            {[["#00C896","≥78 COMPLIANT"],["#F0A500","58–77 REVIEW"],["#E05252","<58 ALERT"]].map(([c,l]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:c }} />
                <span style={{ fontSize:9, color:S.dimLight }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:4, padding:10 }}>
          <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:8 }}>VERIFIED vs CLAIMED  ·  ALL FACTORIES</div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={compData} margin={{ top:4, right:8, left:-24, bottom:0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={S.border} />
              <XAxis dataKey="name" tick={{ fill:S.dim, fontSize:9 }} />
              <YAxis tick={{ fill:S.dim, fontSize:9 }} domain={[40,100]} />
              <Tooltip contentStyle={{ background:S.panel, border:`1px solid ${S.teal}`, color:S.white, fontSize:11 }} />
              <Bar dataKey="verified" name="Sensor Verified" fill={S.teal}  radius={[2,2,0,0]} />
              <Bar dataKey="claimed"  name="Self Reported"   fill={S.amber} radius={[2,2,0,0]} opacity={0.65} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:4, padding:10 }}>
        <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:10 }}>OPERATIONAL DATA TABLE  ·  ALL STATIONS</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${S.border}` }}>
              {["FACTORY ID","SECTOR","ENERGY kWh","WATER L","UPTIME %","TEMP °C","CO₂ ppm","SCORE","GAP","STATUS"].map(h => (
                <th key={h} style={{ padding:"6px 10px", fontSize:9, color:S.dim, letterSpacing:1, textAlign:"left", fontWeight:500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FACTORIES.map(f => {
              const r = readings[f.id]||{};
              const s = computeScore(r);
              const g = f.claimed - s;
              return (
                <tr key={f.id} className="hover-row"
                  onClick={() => { setSelectedFactory(f.id); setActiveNav("sensors"); }}
                  style={{ borderBottom:`1px solid ${S.border}20` }}>
                  <td style={{ padding:"7px 10px", color:S.teal, fontSize:10 }}>{f.id}</td>
                  <td style={{ padding:"7px 10px", color:S.dimLight, fontSize:10 }}>{f.sector}</td>
                  <td style={{ padding:"7px 10px", color:S.white }}>{r.energy}</td>
                  <td style={{ padding:"7px 10px", color:S.white }}>{r.water}</td>
                  <td style={{ padding:"7px 10px", color:r.uptime>85?S.teal:S.amber }}>{r.uptime}</td>
                  <td style={{ padding:"7px 10px", color:S.white }}>{r.temp}</td>
                  <td style={{ padding:"7px 10px", color:r.co2>650?S.red:S.white }}>{r.co2}</td>
                  <td style={{ padding:"7px 10px", color:scoreColor(s), fontWeight:700 }}>{s}</td>
                  <td style={{ padding:"7px 10px", color:Math.abs(g)>5?S.red:S.teal }}>{g>0?"+":""}{g}</td>
                  <td style={{ padding:"7px 10px" }}>
                    <span style={{ background:scoreColor(s)+"22", color:scoreColor(s), fontSize:9, padding:"2px 6px", letterSpacing:1 }}>{scoreLabel(s)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
