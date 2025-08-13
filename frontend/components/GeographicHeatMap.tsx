'use client';

import { useEffect, useRef, useState } from 'react';

interface Issue {
  id: number;
  lat: number;
  lng: number;
  title: string;
  category: string;
  priority: string;
}

interface GeographicHeatMapProps {
  issues?: Issue[];
}

export default function GeographicHeatMap({ issues = [] }: GeographicHeatMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  // Mock data if no issues provided
  const mockIssues = [
    { id: 1, lat: 40.7128, lng: -74.0060, title: "Infrastructure Issue", category: "Infrastructure", priority: "High" },
    { id: 2, lat: 40.7589, lng: -73.9851, title: "Safety Concern", category: "Public Safety", priority: "Medium" },
    { id: 3, lat: 40.6892, lng: -74.0445, title: "Environmental Issue", category: "Environment", priority: "Low" },
    { id: 4, lat: 40.7614, lng: -73.9776, title: "Traffic Problem", category: "Transportation", priority: "Medium" },
    { id: 5, lat: 40.7505, lng: -73.9934, title: "Street Light Out", category: "Infrastructure", priority: "Low" },
  ];

  const dataToUse = issues.length > 0 ? issues : mockIssues;

  useEffect(() => {
    let isMounted = true;
    
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainer.current) return;

      try {
        // Dynamic CSS loading
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
          
          await new Promise(resolve => {
            link.onload = resolve;
            setTimeout(resolve, 1000);
          });
        }
        
        // Import Leaflet
        const L = await import('leaflet');
        
        // Fix default markers icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
        
        if (!isMounted || mapInstance.current) return;

        // Create map
        const map = L.map(mapContainer.current, {
          center: [40.7128, -74.0060],
          zoom: 11,
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        mapInstance.current = map;

        // Add markers with heat map effect
        setTimeout(() => {
          if (isMounted && mapInstance.current) {
            dataToUse.forEach((issue) => {
              const getColor = (category: string) => {
                switch (category) {
                  case 'Infrastructure': return '#ef4444';
                  case 'Public Safety': return '#eab308';
                  case 'Environment': return '#22c55e';
                  case 'Transportation': return '#3b82f6';
                  default: return '#6b7280';
                }
              };

              const marker = L.circleMarker([issue.lat, issue.lng], {
                radius: 8,
                fillColor: getColor(issue.category),
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
              });
              
              marker.bindPopup(`
                <div style="padding: 8px; min-width: 200px;">
                  <h3 style="margin: 0 0 8px 0; font-weight: bold;">${issue.title}</h3>
                  <p style="margin: 4px 0; color: #666;"><strong>Category:</strong> ${issue.category}</p>
                  <p style="margin: 4px 0; color: #666;"><strong>Priority:</strong> ${issue.priority}</p>
                </div>
              `);
              
              marker.addTo(map);
            });

            map.invalidateSize();
            setMapReady(true);
          }
        }, 500);

      } catch (error) {
        console.error('Error initializing map:', error);
        if (isMounted) {
          setMapReady(true);
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [dataToUse]);

  return (
    <div className="relative w-full h-96 overflow-hidden rounded-lg">
      <div ref={mapContainer} className="w-full h-full" />
      
      {!mapReady && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading heat map...</p>
          </div>
        </div>
      )}
    </div>
  );
}