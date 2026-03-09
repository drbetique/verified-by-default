import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FACTORIES, S, computeScore, scoreColor, scoreLabel, getGapStatus } from "../data.js";

export default function SensorFeeds({ readings, history, selectedFactory, setSelectedFactory }) {
  const [activeTab, setActiveTab] = useState("energy");

  const selFactory = FACTORIES.find(f => f.id === selectedFactory);
  const selReading = readings[selectedFactory] || {};
  const selHistory = history[selectedFactory] || [];
  const selScore   = computeScore(selReading);
  const gap        = selFactory ? selFactory.claimed - selScore : 0;
  const gapStatus  = getGapStatus(gap);

  return (
    <div className="fade-in">
      <div style={{ marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:2 }}>SENSOR MONITORING  ·  {selectedFactory}</div>
          <div style={{ fontSize:16, fontFamily:S.fontSans, fontWeight:700, color:S.white }}>{selFactory?.name}</div>
        </div>
        <select onChange={e => setSelectedFactory(e.target.value)} value={selectedFactory}
          style={{ background:S.card, border:`1px solid ${S.border}`, color:S.dimLight, padding:"6px 10px", fontSize:10, fontFamily:S.font }}>
          {FACTORIES.map(f => <option key={f.id} value={f.id}>{f.id} — {f.name}</option>)}
        </select>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:14 }}>
        {[
          { label:"ENERGY / UNIT", value:selReading.energy, unit:"kWh", warn:selReading.energy>3.0 },
          { label:"WATER / UNIT",  value:selReading.water,  unit:"L",   warn:selReading.water>2.2  },
          { label:"MACHINE UPTIME",value:selReading.uptime, unit:"%",   warn:selReading.uptime<70  },
          { label:"PROCESS TEMP",  value:selReading.temp,   unit:"°C",  warn:selReading.temp>38    },
          { label:"CO₂ LEVEL",     value:selReading.co2,    unit:"ppm", warn:selReading.co2>650    },
        ].map((m,i) => (
          <div key={i} style={{ background:S.card, border:`1px solid ${m.warn?S.amber:S.border}`, padding:10, borderRadius:4 }}>
            <div style={{ fontSize:9, color:S.dim, letterSpacing:1, marginBottom:6 }}>{m.label}</div>
            <div style={{ fontSize:22, fontWeight:700, color:m.warn?S.amber:S.teal, fontFamily:S.fontSans }}>{m.value}</div>
            <div style={{ fontSize:9, color:S.dim, marginTop:2 }}>{m.unit}</div>
            {m.warn && <div style={{ fontSize:9, color:S.amber, marginTop:4, letterSpacing:1 }}>⚠ ELEVATED</div>}
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:12, marginBottom:14 }}>
        <div style={{ background:S.card, border:`1px solid ${scoreColor(selScore)}`, borderRadius:4, padding:16, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:8 }}>CIRCULARITY SCORE</div>
          <div style={{ fontSize:52, fontWeight:700, color:scoreColor(selScore), fontFamily:S.fontSans, lineHeight:1 }}>{selScore}</div>
          <div style={{ fontSize:9, color:scoreColor(selScore), letterSpacing:2, marginTop:6 }}>{scoreLabel(selScore)}</div>
          <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${S.border}`, width:"100%" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:9, color:S.dim }}>JOYNN CLAIMED</span>
              <span style={{ fontSize:10, color:S.amber }}>{selFactory?.claimed}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:9, color:S.dim }}>GAP</span>
              <span style={{ fontSize:10, color:gapStatus.color }}>{gap>0?"+":""}{gap} · {gapStatus.label}</span>
            </div>
          </div>
        </div>

        <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:4, padding:10 }}>
          <div style={{ display:"flex", gap:0, marginBottom:10, borderBottom:`1px solid ${S.border}` }}>
            {[["energy","ENERGY"],["water","WATER"],["uptime","UPTIME"],["score","SCORE"]].map(([id,label]) => (
              <button key={id} className="tab-btn" onClick={() => setActiveTab(id)}
                style={{ padding:"6px 14px", fontSize:9, letterSpacing:1.5, color:activeTab===id?S.teal:S.dim, borderBottom:activeTab===id?`2px solid ${S.teal}`:"2px solid transparent" }}>
                {label}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={selHistory} margin={{ top:4, right:8, left:-24, bottom:0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke={S.border} />
              <XAxis dataKey="t" tick={{ fill:S.dim, fontSize:8 }} interval={5} />
              <YAxis tick={{ fill:S.dim, fontSize:9 }} />
              <Tooltip contentStyle={{ background:S.panel, border:`1px solid ${S.teal}`, color:S.white, fontSize:11 }} />
              <Line type="monotone" dataKey={activeTab} stroke={S.teal} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background:S.card, border:`1px solid ${S.border}`, borderRadius:4, padding:10 }}>
        <div style={{ fontSize:9, color:S.dim, letterSpacing:2, marginBottom:10 }}>IMMUTABLE AUDIT TRAIL  ·  LAST 10 READINGS  ·  TLS ENCRYPTED</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${S.border}` }}>
              {["TIMESTAMP","ENERGY","WATER","UPTIME","TEMP","CO₂","SCORE","STATUS"].map(h => (
                <th key={h} style={{ padding:"5px 10px", fontSize:9, color:S.dim, letterSpacing:1, textAlign:"left", fontWeight:500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...selHistory].reverse().slice(0,10).map((r,i) => (
              <tr key={i} style={{ borderBottom:`1px solid ${S.border}20` }}>
                <td style={{ padding:"7px 10px", color:S.dim, fontSize:10 }}>{r.t}</td>
                <td style={{ padding:"7px 10px", color:S.white, fontSize:10 }}>{r.energy}</td>
                <td style={{ padding:"7px 10px", color:S.white, fontSize:10 }}>{r.water}</td>
                <td style={{ padding:"7px 10px", color:r.uptime>85?S.teal:S.amber, fontSize:10 }}>{r.uptime}</td>
                <td style={{ padding:"7px 10px", color:S.white, fontSize:10 }}>{r.temp}</td>
                <td style={{ padding:"7px 10px", color:r.co2>650?S.red:S.white, fontSize:10 }}>{r.co2}</td>
                <td style={{ padding:"7px 10px", color:scoreColor(r.score), fontWeight:700, fontSize:10 }}>{r.score}</td>
                <td style={{ padding:"7px 10px" }}>
                  <span style={{ background:S.teal+"22", color:S.teal, fontSize:9, padding:"2px 6px", letterSpacing:1 }}>VERIFIED</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
