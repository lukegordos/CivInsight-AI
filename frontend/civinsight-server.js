const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/components', express.static(path.join(__dirname, 'components')));

// Helper function to create the base HTML template
function createPage(title, content) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - CivInsight AI</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/@heroicons/react@2.0.0/24/outline/index.js" type="module"></script>
</head>
<body>
    <div id="root"></div>
    
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;
        
        // Header Component
        function Header() {
            const currentPath = window.location.pathname;
            
            const navItems = [
                { href: '/', label: '🏠 Dashboard', active: currentPath === '/' },
                { href: '/map', label: '🗺️ Map', active: currentPath === '/map' },
                { href: '/analytics', label: '📊 Analytics', active: currentPath === '/analytics' },
                { href: '/reports', label: '📋 Reports', active: currentPath === '/reports' },
            ];

            return (
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-4">
                                <a href="/" className="text-2xl font-bold text-blue-600">
                                    🏙️ CivInsight AI
                                </a>
                            </div>
                            
                            <nav className="hidden md:flex space-x-8">
                                {navItems.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className={\`px-3 py-2 rounded-md text-sm font-medium transition-colors \${
                                            item.active
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }\`}
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>
                </header>
            );
        }
        
        ${content}
        
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>
  `;
}

// Home/Dashboard Page
app.get('/', (req, res) => {
  const content = `
        function App() {
            return (
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                🏙️ CivInsight AI Dashboard
                            </h1>
                            <p className="text-xl text-gray-600">
                                Real-time civic issue detection and analytics platform
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            <a href="/map" className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <div className="text-6xl mb-4 text-center">🗺️</div>
                                <h2 className="text-2xl font-semibold mb-2 text-center">Interactive Map</h2>
                                <p className="text-gray-600 text-center">
                                    View real-time civic issues on an interactive map with NYC 311 data
                                </p>
                            </a>
                            
                            <a href="/analytics" className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <div className="text-6xl mb-4 text-center">📊</div>
                                <h2 className="text-2xl font-semibold mb-2 text-center">Analytics Dashboard</h2>
                                <p className="text-gray-600 text-center">
                                    Explore trends, patterns, and insights from civic issue data
                                </p>
                            </a>
                            
                            <a href="/reports" className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                                <div className="text-6xl mb-4 text-center">📋</div>
                                <h2 className="text-2xl font-semibold mb-2 text-center">Issue Reports</h2>
                                <p className="text-gray-600 text-center">
                                    Submit and manage civic issue reports from the community
                                </p>
                            </a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <div className="text-3xl font-bold text-blue-600">1,247</div>
                                <div className="text-sm text-gray-600">Total Issues</div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <div className="text-3xl font-bold text-green-600">892</div>
                                <div className="text-sm text-gray-600">Resolved</div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <div className="text-3xl font-bold text-orange-600">355</div>
                                <div className="text-sm text-gray-600">Pending</div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6 text-center">
                                <div className="text-3xl font-bold text-purple-600">4.2</div>
                                <div className="text-sm text-gray-600">Avg Resolution (days)</div>
                            </div>
                        </div>
                    </main>
                </div>
            );
        }
  `;
  
  res.send(createPage('Dashboard', content));
});

// Map Page 
app.get('/map', (req, res) => {
  const content = `
        function InteractiveMap({ issues }) {
            const mapContainer = useRef(null);
            const mapInstance = useRef(null);
            const [mapReady, setMapReady] = useState(false);
            
            useEffect(() => {
                if (!mapContainer.current || mapInstance.current) return;
                
                const map = L.map(mapContainer.current, {
                    center: [40.7128, -74.0060],
                    zoom: 11,
                });
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                    maxZoom: 18,
                }).addTo(map);
                
                mapInstance.current = map;
                
                setTimeout(() => {
                    // Big red test marker
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
                    
                    // Issue markers
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
                { id: 1, lat: 40.7128, lng: -74.0060, title: "Pothole on Broadway", category: "Infrastructure", priority: "High" },
                { id: 2, lat: 40.7589, lng: -73.9851, title: "Broken Street Light", category: "Public Safety", priority: "Medium" },
                { id: 3, lat: 40.6892, lng: -74.0445, title: "Illegal Dumping", category: "Environment", priority: "Low" },
                { id: 4, lat: 40.7614, lng: -73.9776, title: "Traffic Problem", category: "Transportation", priority: "Medium" }
            ];
            
            return (
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">🗺️ Interactive Map</h1>
                            <p className="mt-2 text-gray-600">
                                Real-time civic issue mapping with NYC 311 data
                            </p>
                        </div>

                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Geographic Distribution</h2>
                            <InteractiveMap issues={mockIssues} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{mockIssues.length}</div>
                                <div className="text-sm text-green-800">Total Issues</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">✅</div>
                                <div className="text-sm text-blue-800">Map Loaded</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">🔴</div>
                                <div className="text-sm text-purple-800">Test Marker</div>
                            </div>
                        </div>
                    </main>
                </div>
            );
        }
  `;
  
  res.send(createPage('Interactive Map', content));
});

// Analytics Page
app.get('/analytics', (req, res) => {
  const content = `
        function App() {
            return (
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
                            <p className="mt-2 text-gray-600">
                                Comprehensive insights and trends from civic issue data
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 text-blue-600">📊</div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Total Issues</h3>
                                        <p className="text-2xl font-bold text-blue-600">1,247</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 text-green-600">📈</div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Resolved</h3>
                                        <p className="text-2xl font-bold text-green-600">892</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 text-orange-600">📉</div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Pending</h3>
                                        <p className="text-2xl font-bold text-orange-600">355</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="h-8 w-8 text-purple-600">📅</div>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Avg Resolution</h3>
                                        <p className="text-2xl font-bold text-purple-600">4.2 days</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
                                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-500">Chart: Monthly issue trends (Jan-Jun)</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold mb-4">Issues by Category</h2>
                                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <p className="text-gray-500">Chart: Category breakdown</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Geographic Heat Map</h2>
                            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500">Geographic distribution heat map</p>
                            </div>
                        </div>
                    </main>
                </div>
            );
        }
  `;
  
  res.send(createPage('Analytics Dashboard', content));
});

// Reports Page
app.get('/reports', (req, res) => {
  const content = `
        function App() {
            const mockReports = [
                { id: 1, title: "Pothole on Main Street", category: "Infrastructure", priority: "High", status: "Open", dateReported: "2025-08-10", location: "123 Main St, New York, NY", description: "Large pothole causing traffic hazards", reportedBy: "John Doe" },
                { id: 2, title: "Broken Street Light", category: "Public Safety", priority: "Medium", status: "In Progress", dateReported: "2025-08-09", location: "456 Oak Ave, New York, NY", description: "Street light not functioning, area poorly lit at night", reportedBy: "Jane Smith" },
                { id: 3, title: "Illegal Dumping Site", category: "Environment", priority: "Low", status: "Resolved", dateReported: "2025-08-08", location: "789 Pine Rd, New York, NY", description: "Construction debris dumped in vacant lot", reportedBy: "Mike Johnson" }
            ];
            
            return (
                <div className="min-h-screen bg-gray-50">
                    <Header />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">📋 Issue Reports</h1>
                                    <p className="mt-2 text-gray-600">
                                        Track and manage civic issue reports from the community
                                    </p>
                                </div>
                                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                    + New Report
                                </button>
                            </div>
                        </div>

                        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
                            <ul className="divide-y divide-gray-200">
                                {mockReports.map((report) => (
                                    <li key={report.id}>
                                        <div className="px-4 py-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {report.title}
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${
                                                        report.status === 'Open' ? 'bg-red-100 text-red-800' :
                                                        report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                    }\`}>
                                                        {report.status}
                                                    </span>
                                                    <span className={\`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium \${
                                                        report.priority === 'High' ? 'bg-red-100 text-red-800' :
                                                        report.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }\`}>
                                                        {report.priority}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-sm text-gray-500">
                                                📍 {report.location} • {report.category} • {report.dateReported}
                                            </div>
                                            <p className="mt-2 text-sm text-gray-600">{report.description}</p>
                                            <p className="mt-1 text-xs text-gray-500">Reported by: {report.reportedBy}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg shadow p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{mockReports.length}</div>
                                <div className="text-sm text-gray-600">Total Reports</div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4 text-center">
                                <div className="text-2xl font-bold text-red-600">1</div>
                                <div className="text-sm text-gray-600">Open</div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4 text-center">
                                <div className="text-2xl font-bold text-yellow-600">1</div>
                                <div className="text-sm text-gray-600">In Progress</div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">1</div>
                                <div className="text-sm text-gray-600">Resolved</div>
                            </div>
                        </div>
                    </main>
                </div>
            );
        }
  `;
  
  res.send(createPage('Issue Reports', content));
});

const PORT = 3002;
app.listen(PORT, () => {
    console.log('🚀 CivInsight AI Server running at http://localhost:' + PORT);
    console.log('📱 Available pages:');
    console.log('   🏠 Dashboard: http://localhost:' + PORT);
    console.log('   🗺️ Map: http://localhost:' + PORT + '/map');
    console.log('   📊 Analytics: http://localhost:' + PORT + '/analytics');
    console.log('   📋 Reports: http://localhost:' + PORT + '/reports');
});
