import { useState, useEffect, useRef } from "react";
import { FACTORIES, S, generateSensorReading, computeScore } from "./data.js";
import Overview     from "./components/Overview.jsx";
import SensorFeeds  from "./components/SensorFeeds.jsx";
import Verification from "./components/Verification.jsx";
import Alerts       from "./components/Alerts.jsx";
import Team         from "./components/Team.jsx";

export default function App() {
  const [activeNav,       setActiveNav]       = useState("overview");
  const [selectedFactory, setSelectedFactory] = useState("FAC-NL-01");
  const [readings,        setReadings]        = useState({});
  const [history,         setHistory]         = useState({});
  const [alerts,          setAlerts]          = useState([]);
  const [tick,            setTick]            = useState(0);
  const prevRef = useRef({});

  // Initialise with 20 historical readings per factory
  useEffect(() => {
    const initR = {}, initH = {};
    FACTORIES.forEach(f => {
      let prev = generateSensorReading();
      initR[f.id] = prev;
      prevRef.current[f.id] = prev;
      const hist = [];
      for (let i = 20; i >= 1; i--) {
        const r = generateSensorReading(prev);
        hist.push({ ...r, score: computeScore(r), t: new Date(Date.now() - i * 4000).toLocaleTimeString("en", { hour:"2-digit", minute:"2-digit", second:"2-digit" }) });
        prev = r;
      }
      initH[f.id] = hist;
    });
    setReadings(initR);
    setHistory(initH);
  }, []);

  // Live simulation tick every 4s
  useEffect(() => {
    const id = setInterval(() => {
      const newR = {};
      const newAlerts = [];
      FACTORIES.forEach(f => {
        const r = generateSensorReading(prevRef.current[f.id]);
        newR[f.id] = r;
        prevRef.current[f.id] = r;
        const score = computeScore(r);
        if (score < 55)    newAlerts.push({ id:f.id, name:f.name, score, type:"NON_COMPLIANT", ts:new Date().toLocaleTimeString() });
        if (r.energy > 3.2) newAlerts.push({ id:f.id, name:f.name, score, type:"HIGH_ENERGY",   ts:new Date().toLocaleTimeString() });
      });
      setReadings({ ...newR });
      if (newAlerts.length) setAlerts(prev => [...newAlerts, ...prev].slice(0, 15));
      setHistory(prev => {
        const next = { ...prev };
        FACTORIES.forEach(f => {
          const r = newR[f.id];
          next[f.id] = [...(prev[f.id]||[]).slice(-29), { ...r, score:computeScore(r), t:new Date().toLocaleTimeString("en",{hour:"2-digit",minute:"2-digit",second:"2-digit"}) }];
        });
        return next;
      });
      setTick(t => t + 1);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const navItems = [
    { id:"overview",     label:"OVERVIEW" },
    { id:"sensors",      label:"SENSOR FEEDS" },
    { id:"verification", label:"VERIFICATION" },
    { id:"alerts",       label:`ALERTS${alerts.length ? ` (${alerts.length})` : ""}` },
    { id:"team",         label:"TEAM" },
  ];

  return (
    <div style={{ background:S.bg, height:"100vh", color:S.white, fontFamily:S.font, fontSize:12, display:"flex", flexDirection:"column", overflow:"hidden" }}>

      {/* TOP BAR */}
      <div style={{ background:S.panel, borderBottom:`1px solid ${S.border}`, padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", height:44, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:3, height:24, background:S.teal }} />
          <span style={{ fontSize:13, fontWeight:600, letterSpacing:2, color:S.white }}>VERIFIED BY DEFAULT</span>
          <span style={{ color:S.dim }}>·</span>
          <span style={{ color:S.dimLight, letterSpacing:1, fontSize:10 }}>JOYNN FACTORY INTELLIGENCE</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <select style={{ background:S.card, border:`1px solid ${S.border}`, color:S.dimLight, padding:"4px 8px", fontSize:10, fontFamily:S.font }}>
            <option>REGION: NL-NORTH</option>
            <option>REGION: NL-SOUTH</option>
            <option>REGION: EU-ALL</option>
          </select>
          {alerts.length > 0 && (
            <div style={{ background:S.red+"22", border:`1px solid ${S.red}`, color:S.red, padding:"2px 8px", fontSize:10, letterSpacing:1, cursor:"pointer" }}
              onClick={() => setActiveNav("alerts")}>
              ⚠ {alerts.length} ALERT{alerts.length>1?"S":""}
            </div>
          )}
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div className="live-dot" style={{ width:7, height:7, borderRadius:"50%", background:S.teal, boxShadow:`0 0 8px ${S.teal}` }} />
            <span style={{ color:S.teal, fontSize:10, letterSpacing:2 }}>LIVE</span>
          </div>
          <span style={{ color:S.dim, fontSize:10 }}>#{tick}</span>
        </div>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {/* SIDEBAR */}
        <div style={{ width:160, background:S.panel, borderRight:`1px solid ${S.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
          <div style={{ padding:"10px 0" }}>
            {navItems.map(n => (
              <div key={n.id} className="nav-item" onClick={() => setActiveNav(n.id)}
                style={{ padding:"9px 16px", fontSize:10, letterSpacing:1.5, color:activeNav===n.id?S.teal:S.dim, background:activeNav===n.id?S.card:"transparent", borderLeft:activeNav===n.id?`2px solid ${S.teal}`:"2px solid transparent" }}>
                {n.label}
              </div>
            ))}
          </div>
          {/* Factory status list */}
          <div style={{ marginTop:"auto", padding:10, borderTop:`1px solid ${S.border}` }}>
            <div style={{ fontSize:9, color:S.dim, letterSpacing:1, marginBottom:6 }}>NETWORK STATUS</div>
            {FACTORIES.map(f => {
              const s = computeScore(readings[f.id]||{});
              return (
                <div key={f.id} className="hover-row"
                  onClick={() => { setSelectedFactory(f.id); setActiveNav("sensors"); }}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 4px", background:selectedFactory===f.id?S.card:"transparent", marginBottom:2, borderRadius:2 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:s>=78?"#00C896":s>=58?"#F0A500":"#E05252", flexShrink:0 }} />
                  <span style={{ fontSize:9, color:S.dimLight, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{f.id}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex:1, overflow:"auto", padding:14 }}>
          {activeNav === "overview"     && <Overview     readings={readings} selectedFactory={selectedFactory} setSelectedFactory={setSelectedFactory} setActiveNav={setActiveNav} />}
          {activeNav === "sensors"      && <SensorFeeds  readings={readings} history={history} selectedFactory={selectedFactory} setSelectedFactory={setSelectedFactory} />}
          {activeNav === "verification" && <Verification readings={readings} history={history} selectedFactory={selectedFactory} />}
          {activeNav === "alerts"       && <Alerts       alerts={alerts} />}
          {activeNav === "team"         && <Team />}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background:S.panel, borderTop:`1px solid ${S.border}`, padding:"5px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <span style={{ fontSize:9, color:S.dim, letterSpacing:1 }}>VERIFIED BY DEFAULT  ·  RUN-EU ENTREPRENEURSHIP FESTIVAL 2026  ·  NHL STENDEN LEEUWARDEN</span>
        <span style={{ fontSize:9, color:S.dim }}>UPDATES EVERY 4s  ·  TLS ENCRYPTED  ·  {new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}
