const http = require('http');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CivInsight AI - Map Test</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;
        
        function InteractiveMap({ issues }) {
            const mapContainer = useRef(null);
            const mapInstance = useRef(null);
            const [mapReady, setMapReady] = useState(false);
            
            useEffect(() => {
                if (!mapContainer.current || mapInstance.current) return;
                
                console.log('Initializing map...');
                
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
                
                setTimeout(() => {
                    // Add big red test marker
                    const testMarker = L.circleMarker([40.7128, -74.0060], {
                        radius: 30,
                        fillColor: '#ff0000',
                        color: '#ffffff',
                        weight: 4,
                        opacity: 1,
                        fillOpacity: 1,
                    });
                    testMarker.addTo(map);
                    testMarker.bindPopup('🔴 BIG TEST MARKER - MAP IS WORKING!');
                    testMarker.openPopup();
                    
                    // Add issue markers
                    issues.forEach((issue) => {
                        const getColor = (category) => {
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
                        
                        marker.bindPopup(\`
                            <div style="padding: 8px; min-width: 200px;">
                                <h3 style="margin: 0 0 8px 0; font-weight: bold;">\${issue.title}</h3>
                                <p style="margin: 4px 0; color: #666;"><strong>Category:</strong> \${issue.category}</p>
                                <p style="margin: 4px 0; color: #666;"><strong>Priority:</strong> \${issue.priority}</p>
                            </div>
                        \`);
                        
                        marker.addTo(map);
                    });
                    
                    map.invalidateSize();
                    setMapReady(true);
                    console.log('✅ Map fully ready!');
                }, 500);
                
                return () => {
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
        
        function App() {
            const mockIssues = [
                {
                    id: 1,
                    lat: 40.7128,
                    lng: -74.0060,
                    title: "Pothole on Broadway",
                    category: "Infrastructure",
                    priority: "High"
                },
                {
                    id: 2,
                    lat: 40.7589,
                    lng: -73.9851,
                    title: "Broken Street Light",
                    category: "Public Safety", 
                    priority: "Medium"
                },
                {
                    id: 3,
                    lat: 40.6892,
                    lng: -74.0445,
                    title: "Illegal Dumping",
                    category: "Environment",
                    priority: "Low"
                }
            ];
            
            return (
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">
                                🗺️ CivInsight AI - Map Test
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Testing the interactive map with a simple Express server
                            </p>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Geographic Distribution</h2>
                            <InteractiveMap issues={mockIssues} />
                        </div>
                        
                        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Server Status</h3>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">✅</div>
                                <div className="text-sm text-green-800">Express Server Running on Port 3002</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>
  `);
});

const PORT = 3002;
server.listen(PORT, () => {
    console.log('🚀 Server running at http://localhost:' + PORT);
    console.log('📍 Map test available at: http://localhost:' + PORT);
});
