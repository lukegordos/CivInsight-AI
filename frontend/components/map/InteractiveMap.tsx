'use client';

import { useEffect, useRef, useState } from 'react';

interface MapProps {
  issues: Array<{
    id: number;
    lat: number;
    lng: number;
    title: string;
    category: string;
    priority: string;
  }>;
}

export default function InteractiveMap({ issues }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  console.log('InteractiveMap: Received issues:', issues);

  useEffect(() => {
    let isMounted = true;
    
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainer.current) return;

      try {
        console.log('Starting map initialization...');
        
        // Dynamic CSS loading
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
            setTimeout(resolve, 1000);
          });
        }
        
        // Import Leaflet
        const L = await import('leaflet');
        console.log('Leaflet imported successfully');
        
        // Fix default markers icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });
        
        if (!isMounted || mapInstance.current) return;

        console.log('Creating map...');
        
        // Create map
        const map = L.map(mapContainer.current, {
          center: [40.7128, -74.0060],
          zoom: 11,
        });

        console.log('Map created');

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        console.log('Tiles added');
        mapInstance.current = map;

        // Wait for tiles to load, then add markers
        setTimeout(() => {
          if (isMounted && mapInstance.current) {
            console.log('Adding issue markers...');

            // Add issue markers
            if (issues && issues.length > 0) {
              console.log(`Adding ${issues.length} issue markers...`);
              
              issues.forEach((issue, index) => {
                if (issue.lat && issue.lng && !isNaN(issue.lat) && !isNaN(issue.lng)) {
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
                    radius: 12,
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
                }
              });
              
              console.log(`✅ Added ${issues.length} issue markers`);
            }

            // Mark ready
            map.invalidateSize();
            setMapReady(true);
            console.log('✅ Map fully ready!');
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
  }, [issues]);

  return (
    <div className="relative w-full h-96 lg:h-[600px] overflow-hidden rounded-lg">
      <div ref={mapContainer} className="w-full h-full" />
      
      {!mapReady && (
        <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
}
