import { useRef, useEffect } from "react";
import { computeScore, scoreColor } from "../data.js";

export default function MiniMap({ factories, selected, onSelect, readings }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#080B10"; ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#1C2333"; ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 28) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 28) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    const latMin=51.2, latMax=53.6, lngMin=3.8, lngMax=7.2;
    const proj = (lat,lng) => ({
      x: ((lng-lngMin)/(lngMax-lngMin))*(W-48)+24,
      y: ((latMax-lat)/(latMax-latMin))*(H-48)+24,
    });

    factories.forEach((f,i) => {
      factories.forEach((f2,j) => {
        if (j>i) {
          const p1=proj(f.lat,f.lng), p2=proj(f2.lat,f2.lng);
          ctx.strokeStyle="#1C2333"; ctx.lineWidth=0.5;
          ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke();
        }
      });
    });

    factories.forEach(f => {
      const r = readings[f.id];
      const score = r ? computeScore(r) : 70;
      const color = scoreColor(score);
      const p = proj(f.lat, f.lng);
      const isSel = selected === f.id;

      ctx.beginPath(); ctx.arc(p.x,p.y,isSel?18:11,0,Math.PI*2);
      ctx.fillStyle=color+"1A"; ctx.fill();
      ctx.strokeStyle=color+"55"; ctx.lineWidth=1; ctx.stroke();

      ctx.beginPath(); ctx.arc(p.x,p.y,isSel?7:5,0,Math.PI*2);
      ctx.fillStyle=color; ctx.fill();
      if (isSel) { ctx.strokeStyle="#E2E8F0"; ctx.lineWidth=1.5; ctx.stroke(); }

      ctx.fillStyle="#E2E8F0"; ctx.font="9px IBM Plex Mono";
      ctx.fillText(f.id, p.x+11, p.y-5);
      ctx.fillStyle=color; ctx.font="8px IBM Plex Mono";
      ctx.fillText(`${score}`, p.x+11, p.y+6);
    });
  }, [factories, selected, readings]);

  const handleClick = (e) => {
    const c = canvasRef.current; if (!c) return;
    const rect = c.getBoundingClientRect();
    const mx = (e.clientX-rect.left)*(c.width/rect.width);
    const my = (e.clientY-rect.top)*(c.height/rect.height);
    const latMin=51.2, latMax=53.6, lngMin=3.8, lngMax=7.2;
    const proj = (lat,lng) => ({
      x: ((lng-lngMin)/(lngMax-lngMin))*(c.width-48)+24,
      y: ((latMax-lat)/(latMax-latMin))*(c.height-48)+24,
    });
    for (const f of factories) {
      const p = proj(f.lat,f.lng);
      if (Math.hypot(mx-p.x,my-p.y)<18) { onSelect(f.id); return; }
    }
  };

  return (
    <canvas ref={canvasRef} width={340} height={220} onClick={handleClick}
      style={{ width:"100%", height:"100%", cursor:"crosshair", borderRadius:4, display:"block" }} />
  );
}
