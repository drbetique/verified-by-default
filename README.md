# Verified by Default

Sensor-verified factory data layer for the Joynn circularity index.

Built at the RUN-EU Entrepreneurship Festival 2026, NHL Stenden Leeuwarden.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Project Structure

```
src/
  App.jsx              # Root — state, simulation loop, layout
  data.js              # Factories, team, scoring logic, mock sensor generator
  index.css            # Global styles
  components/
    Overview.jsx       # Network map + all-factory table
    SensorFeeds.jsx    # Per-factory live sensor monitoring
    Verification.jsx   # Verified vs claimed gap analysis
    Alerts.jsx         # Real-time alert feed
    MiniMap.jsx        # Canvas-based factory network map
    Team.jsx           # Team roster
```

## Update Team Names

Open `src/data.js` and edit the `TEAM` array with real names and roles.

## Sensor Simulation

The simulator in `data.js` mimics an ESP32 kit posting readings every 4 seconds:
- Energy consumption per unit (kWh)
- Water usage per unit (L)
- Machine uptime (%)
- Process temperature (°C)
- CO₂ level (ppm)

In production, replace `generateSensorReading()` calls with real WebSocket or MQTT feeds.

## Tech Stack

React + Vite + Recharts

## Team

- Victor Betiku — IoT / Firmware (Häme University of Applied Sciences)
- Team Member 2 — Frontend / UX
- Team Member 3 — Backend / API
- Team Member 4 — Business Model
- Team Member 5 — Sustainability
