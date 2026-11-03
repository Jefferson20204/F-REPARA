import { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Point {
  lat: number;
  lng: number;
}

function marker(kind: 'home' | 'tech'): L.DivIcon {
  return L.divIcon({
    className: 'tk-marker',
    html: '<span class="tk-dot tk-dot--' + kind + '"></span>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export function TrackingMap({ home, technician }: { home: Point; technician: Point }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = container.current;
    if (element === null) return;

    const map = L.map(element, { zoomControl: false }).setView([home.lat, home.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([home.lat, home.lng], { icon: marker('home') }).addTo(map);
    L.marker([technician.lat, technician.lng], { icon: marker('tech') }).addTo(map);
    map.fitBounds(
      [
        [home.lat, home.lng],
        [technician.lat, technician.lng],
      ],
      { paddingTopLeft: [48, 72], paddingBottomRight: [48, 48] },
    );

    return () => {
      map.remove();
    };
  }, [home.lat, home.lng, technician.lat, technician.lng]);

  return <div ref={container} className="tk-map" />;
}