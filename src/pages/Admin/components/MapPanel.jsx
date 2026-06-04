import { useEffect, useRef, useState } from "react";
import "./MapPanel.css";
import axios from "axios";

const API = "https://api.brandconnect.social";

export default function MapPanel() {
  const mapRef         = useRef(null);
  const leafletRef     = useRef(null);
  const [loading, setLoading]           = useState(true);
  const [count, setCount]               = useState(0);
  const [clientCount, setClientCount]   = useState(0);

  useEffect(() => {
    const loadMap = async () => {
      // ── 1. Cargar Leaflet si no está ────────────────────────────────
      if (!window.L) {
        const link  = document.createElement("link");
        link.rel    = "stylesheet";
        link.href   = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        await new Promise((resolve, reject) => {
          const script   = document.createElement("script");
          script.src     = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.onload  = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      if (leafletRef.current) return;

      const L   = window.L;
      const map = L.map(mapRef.current, {
        center:      [4.6782, -74.1049],
        zoom:        12,
        zoomControl: true,
      });

      leafletRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '© <a href="https://carto.com/">CARTO</a>',
          subdomains:  "abcd",
          maxZoom:     19,
        }
      ).addTo(map);

      // ── 2. Traer influencers y negocios en paralelo ──────────────────
      try {
        const [infRes, clientRes] = await Promise.all([
          axios.get(`${API}/api/profiles/influencers/map`),
          axios.get(`${API}/api/profiles/clients/map`),
        ]);

        const influencers = infRes.data.influencers || [];
        const clients     = clientRes.data.clients  || [];

        setCount(influencers.length);
        setClientCount(clients.length);

        // ── Influencers — círculo naranja ──────────────────────────────
        influencers.forEach((inf) => {
          if (!inf.lat || !inf.lng) return;

          const icon = L.divIcon({
            className: "",
            html: `<div style="
              width:14px;height:14px;
              background:#fb923c;
              border:2px solid rgba(255,255,255,0.7);
              border-radius:50%;
              box-shadow:0 0 10px #fb923c99;
            "></div>`,
            iconSize:   [14, 14],
            iconAnchor: [7, 7],
          });

          L.marker([Number(inf.lat), Number(inf.lng)], { icon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:sans-serif;font-size:13px;line-height:1.6">
                <strong>${inf.full_name}</strong><br/>
                <span style="color:#aaa">${inf.location || ""}</span><br/>
                ${inf.category ? `<span style="color:#fb923c;text-transform:capitalize">${inf.category}</span>` : ""}
                ${inf.tiktok_url ? `<br/><a href="${inf.tiktok_url}" target="_blank" style="color:#fb923c">TikTok ↗</a>` : ""}
              </div>
            `);
        });

        // ── Negocios — cuadro azul ─────────────────────────────────────
        clients.forEach((c) => {
          if (!c.lat || !c.lng) return;

          const icon = L.divIcon({
            className: "",
            html: `<div style="
              width:14px;height:14px;
              background:#38bdf8;
              border:2px solid rgba(255,255,255,0.7);
              border-radius:3px;
              box-shadow:0 0 10px #38bdf899;
            "></div>`,
            iconSize:   [14, 14],
            iconAnchor: [7, 7],
          });

          L.marker([Number(c.lat), Number(c.lng)], { icon })
            .addTo(map)
            .bindPopup(`
              <div style="font-family:sans-serif;font-size:13px;line-height:1.6">
                <strong>${c.business_name}</strong><br/>
                <span style="color:#aaa">${c.location || ""}</span><br/>
                ${c.business_type ? `<span style="color:#38bdf8;text-transform:capitalize">${c.business_type}</span>` : ""}
                <br/><span style="color:#aaa;font-size:11px">👤 ${c.owner_name}</span>
              </div>
            `);
        });

      } catch (err) {
        console.error("MAP DATA ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMap().catch(console.error);

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, []);

  return (
    <div className="map-panel">
      <div className="panel-header">
        <h2 className="panel-title">Mapa de influencers y negocios</h2>
        <div className="map-legend">
          <span>
            <span className="legend-dot" style={{ background: "#fb923c" }} />
            Influencer
          </span>
          <span>
            <span className="legend-dot" style={{ background: "#38bdf8", borderRadius: "3px" }} />
            Negocio
          </span>
          {!loading && (
            <span className="map-count">
              {count} influencers · {clientCount} negocios
            </span>
          )}
        </div>
      </div>

      {loading && (
        <div className="map-notice">
          <i className="ti ti-loader" /> Cargando ubicaciones...
        </div>
      )}

      {!loading && count === 0 && clientCount === 0 && (
        <div className="map-notice">
          <i className="ti ti-info-circle" /> Aún no hay ubicaciones registradas.
        </div>
      )}

      <div ref={mapRef} className="map-container" />
    </div>
  );
}
