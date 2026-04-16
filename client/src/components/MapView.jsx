import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const typeIcons = {
  hospital: '🏥',
  police: '🚔',
  ambulance: '🚑',
  towing: '🚗',
  repair: '🔧',
};

const typeColors = {
  hospital: '#4ade80',
  police: '#60a5fa',
  ambulance: '#ef4444',
  towing: '#a855f7',
  repair: '#f97316',
};

export default function MapView({ userLocation, services, filter, selectedService }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const serviceMarkers = useRef({});

  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    // Initialize map
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView(
        [userLocation.lat, userLocation.lng],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current);
    }

    // Update map view
    map.current.setView([userLocation.lat, userLocation.lng], 13);

    // Add user location marker
    if (userMarker.current) {
      userMarker.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      userMarker.current = L.circleMarker(
        [userLocation.lat, userLocation.lng],
        {
          radius: 8,
          fillColor: '#ef4444',
          color: '#fff',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.8,
        }
      ).addTo(map.current);

      userMarker.current.bindPopup('Your Location');
    }

    // Clear old markers
    Object.values(serviceMarkers.current).forEach((marker) => {
      map.current.removeLayer(marker);
    });
    serviceMarkers.current = {};

    // Add service markers
    services.forEach((service) => {
      const isFiltered = filter === 'all' || service.type === filter;
      if (!isFiltered) return;

      const isSelected = selectedService?.id === service.id;
      const color = typeColors[service.type];

      const markerHtml = `
        <div style="
          background: ${color};
          border: ${isSelected ? '3px solid #fbbf24' : '2px solid white'};
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        ">
          ${typeIcons[service.type]}
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        iconSize: [40, 40],
        className: 'service-marker',
      });

      const marker = L.marker([service.lat, service.lng], {
        icon: customIcon,
      });

      marker.bindPopup(
        `<strong>${service.name}</strong><br>${service.distance} km<br>ETA: ${service.eta}`
      );

      marker.addTo(map.current);
      serviceMarkers.current[service.id] = marker;

      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [userLocation, services, filter, selectedService]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        borderRadius: '1rem',
        overflow: 'hidden',
      }}
    />
  );
}
