'use client';

import { useEffect, useRef, useState } from 'react';

export function TestMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const initMap = async () => {
      try {
        setStatus('Loading Leaflet...');
        
        if (typeof window === 'undefined' || !mapRef.current) {
          setStatus('Window or container not ready');
          return;
        }

        const L = await import('leaflet');
        setStatus('Leaflet loaded, creating map...');

        // Import Leaflet CSS dynamically
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          link.crossOrigin = '';
          document.head.appendChild(link);
          
          // Wait for CSS to load
          await new Promise(resolve => {
            link.onload = resolve;
            setTimeout(resolve, 1000); // fallback
          });
        }

        setStatus('CSS loaded, initializing map...');

        const map = L.map(mapRef.current, {
          center: [40.7128, -74.0060],
          zoom: 12,
        });

        setStatus('Map created, adding tiles...');

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        setStatus('Map ready!');

        // Add a test marker
        L.marker([40.7128, -74.0060])
          .addTo(map)
          .bindPopup('Test marker in NYC')
          .openPopup();

      } catch (error) {
        setStatus(`Error: ${error.message}`);
        console.error('Map initialization error:', error);
      }
    };

    initMap();
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Test Map</h3>
      <p className="mb-2 text-sm text-gray-600">Status: {status}</p>
      <div 
        ref={mapRef} 
        className="w-full h-96 border-2 border-gray-300 rounded-lg bg-gray-100"
        style={{ minHeight: '384px' }}
      />
    </div>
  );
}
