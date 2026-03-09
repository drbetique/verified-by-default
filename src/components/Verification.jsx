import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FACTORIES, S, computeScore, scoreColor } from "../data.js";

export default function Verification({ readings, history, selectedFactory }) {
  const compData = FACTORIES.map(f => {
    const s = computeScore(readings[f.id]||{});
    return { name: f.id.split("-")[2], verified: s, claimed: f.claimed, gap: f.claimed - s };
  });

  const avgV = Math.round(FACTORIES.reduce((a,f) => a + computeScore(readings[f.id]||{}), 0) / FACTORIES.length);
  const avgC = Math.round(FACTORIES.reduce((a,f) => a + f.claimed, 0) / FACTORIES.length);

  const selFactory = FACTORIES.find(f => f.id === selectedFactory);
  const selHistory = history[selectedFactory] || [];

  return (
    <div className="fade-in">
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:2 }}>VERIFICATION ANALYTICS  ·  JOYNN INDEX COMPARISON</div>
        <div style={{ fontSize:16, fontFamily:S.fontSans, fontWeight:700, color:S.white }}>The Data Gap</div>
      </div>

      <div style={{ background:S.card, border:`1px solid ${S.red}44`, borderRadius:4, padding:14, marginBottom:14 }}>
        <div style={{ fontSize:10, color:S.red, letterSpacing:2, marginBottom:6 }}>⚠  SYSTEM FINDING</div>
        <div style={{ fontSize:13, color:S.white, fontFamily:S.fontSans, lineHeight:1.6 }}>
          Across {FACTORIES.length} monitored factories, sensor-verified scores average{" "}
          <span style={{ color:S.teal, fontWeight:700 }}>{avgV}</span>{" "}
          against a self-reported average of{" "}
          <span style={{ color:S.amber, fontWeight:700 }}>{avgC}</span>.{" "}
          A gap of <span style={{ color:S.red, fontWeight:700 }}>+{avgC-avgV} points</span> that cannot be detected without sensor verification.
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
        <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:4, padding:10 }}>
          <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:10 }}>SCORE GAP BY FACTORY</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={compData} margin={{ top:4, right:8, left:-24, bottom:0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={S.border} />
              <XAxis dataKey="name" tick={{ fill:S.dim, fontSize:9 }} />
              <YAxis tick={{ fill:S.dim, fontSize:9 }} domain={[40,100]} />
              <Tooltip contentStyle={{ background:S.panel, border:`1px solid ${S.teal}`, color:S.white, fontSize:11 }} />
              <Bar dataKey="verified" name="Verified"  fill={S.teal}  radius={[2,2,0,0]} />
              <Bar dataKey="claimed"  name="Claimed"   fill={S.amber} radius={[2,2,0,0]} opacity={0.65} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:4, padding:10 }}>
          <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:10 }}>SCORE TREND  ·  {selectedFactory}</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={selHistory.map(r => ({ ...r, claimed: selFactory?.claimed }))} margin={{ top:4, right:8, left:-24, bottom:0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={S.border} />
              <XAxis dataKey="t" tick={{ fill:S.dim, fontSize:8 }} interval={5} />
              <YAxis tick={{ fill:S.dim, fontSize:9 }} domain={[40,100]} />
              <Tooltip contentStyle={{ background:S.panel, border:`1px solid ${S.teal}`, color:S.white, fontSize:11 }} />
              <Line type="monotone" dataKey="score"   stroke={S.teal}  strokeWidth={2} dot={false} isAnimationActive={false} name="Verified" />
              <Line type="monotone" dataKey="claimed" stroke={S.amber} strokeWidth={1} strokeDasharray="4 4" dot={false} isAnimationActive={false} name="Claimed" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:4, padding:14 }}>
        <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:12 }}>JOYNN INDEX RECOMMENDATIONS  ·  AUTOMATED</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10 }}>
          {FACTORIES.map(f => {
            const s = computeScore(readings[f.id]||{});
            const g = f.claimed - s;
            const rec = s>=78 ? "MAINTAIN OPERATIONS" : s>=58 ? "REVIEW ENERGY USE" : "IMMEDIATE AUDIT REQUIRED";
            return (
              <div key={f.id} style={{ background:S.bg, border:`1px solid ${S.border}`, padding:10, borderRadius:4 }}>
                <div style={{ fontSize:9, color:S.teal, letterSpacing:1, marginBottom:4 }}>{f.id}</div>
                <div style={{ fontSize:11, color:S.white, marginBottom:6, fontFamily:S.fontSans, fontWeight:600 }}>{f.name}</div>
                <div style={{ fontSize:9, color:scoreColor(s), letterSpacing:1, marginBottom:6 }}>{rec}</div>
                <div style={{ fontSize:9, color:S.dim }}>
                  Gap: <span style={{ color:Math.abs(g)>5?S.red:S.teal }}>{g>0?"+":""}{g} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
