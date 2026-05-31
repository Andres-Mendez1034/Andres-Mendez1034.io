import { useEffect, useRef } from "react";
import "./MapPanel.css";

const SAMPLE_LOCATIONS = [
  { id: 1,  name: "Brand Connect HQ",         lat: 4.7110,  lng: -74.0721, type: "oficina",    city: "Chapinero, Bogotá" },
  { id: 2,  name: "Aliado Engativá Norte",     lat: 4.7073,  lng: -74.1134, type: "aliado",     city: "Engativá, Bogotá" },
  { id: 3,  name: "Creador Engativá Centro",   lat: 4.6981,  lng: -74.1201, type: "influencer", city: "Engativá, Bogotá" },
  { id: 4,  name: "Negocio Kennedy Central",   lat: 4.6273,  lng: -74.1462, type: "aliado",     city: "Kennedy, Bogotá" },
  { id: 5,  name: "Influencer Kennedy Sur",    lat: 4.6089,  lng: -74.1598, type: "influencer", city: "Kennedy, Bogotá" },
  { id: 6,  name: "Aliado Kennedy Américas",   lat: 4.6401,  lng: -74.1337, type: "aliado",     city: "Kennedy, Bogotá" },
  { id: 7,  name: "Creador Suba Centro",       lat: 4.7412,  lng: -74.0938, type: "influencer", city: "Suba, Bogotá" },
  { id: 8,  name: "Negocio Suba Rincón",       lat: 4.7631,  lng: -74.0851, type: "aliado",     city: "Suba, Bogotá" },
  { id: 9,  name: "Influencer Suba Niza",      lat: 4.7289,  lng: -74.0564, type: "influencer", city: "Suba, Bogotá" },
  { id: 10, name: "Aliado Fontibón",           lat: 4.6726,  lng: -74.1469, type: "aliado",     city: "Fontibón, Bogotá" },
  { id: 11, name: "Creador Bosa Central",      lat: 4.5986,  lng: -74.1872, type: "influencer", city: "Bosa, Bogotá" },
  { id: 12, name: "Negocio Usaquén",           lat: 4.7056,  lng: -74.0317, type: "aliado",     city: "Usaquén, Bogotá" },
];

const COLORS = {
  oficina:    "#a78bfa",
  aliado:     "#34d399",
  influencer: "#fb923c",
};

export default function MapPanel() {
  const mapRef     = useRef(null);
  const leafletRef = useRef(null);

  useEffect(() => {
    const loadLeaflet = async () => {
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

      SAMPLE_LOCATIONS.forEach((loc) => {
        const color = COLORS[loc.type] || "#60a5fa";

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:14px;height:14px;
            background:${color};
            border:2px solid rgba(255,255,255,0.7);
            border-radius:50%;
            box-shadow:0 0 10px ${color}99;
          "></div>`,
          iconSize:   [14, 14],
          iconAnchor: [7, 7],
        });

        L.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;font-size:13px;line-height:1.6">
              <strong>${loc.name}</strong><br/>
              <span style="color:#aaa">${loc.city}</span><br/>
              <span style="color:${color};text-transform:capitalize">${loc.type}</span>
            </div>
          `);
      });
    };

    loadLeaflet().catch(console.error);

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
        <h2 className="panel-title">Mapa de negocios aliados</h2>
        <div className="map-legend">
          <span><span className="legend-dot" style={{ background: "#a78bfa" }} /> Oficina</span>
          <span><span className="legend-dot" style={{ background: "#34d399" }} /> Aliado</span>
          <span><span className="legend-dot" style={{ background: "#fb923c" }} /> Influencer</span>
        </div>
      </div>

      <div className="map-notice">
        <i className="ti ti-info-circle" /> Datos de ejemplo — Engativá, Kennedy, Suba y zonas aledañas de Bogotá.
      </div>

      <div ref={mapRef} className="map-container" />
    </div>
  );
}