const express = require('express');
const path = require('path');
const app = express();

// Import our API functions
const { fetchNYC311Data } = require('./lib/api');

// API endpoint for NYC 311 data
app.get('/api/nyc311', async (req, res) => {
  try {
    console.log('📡 Fetching fresh NYC 311 data...');
    const data = await fetchNYC311Data();
    console.log(`✅ Retrieved ${data.length} civic issues`);
    res.json({
      success: true,
      count: data.length,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching NYC 311 data:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      fallback: true
    });
  }
});

// Serve static files
app.use(express.static('public'));

// Helper function to create pages
function createHTMLPage(title, bodyContent) {
  return `<!DOCTYPE html>
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
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; 
        }
        .glass-effect {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .hover-lift:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect, useRef } = React;
        
        function Header() {
            const currentPath = window.location.pathname;
            const navItems = [
                { href: '/', label: '🏠 Dashboard', active: currentPath === '/' },
                { href: '/map', label: '🗺️ Live Map', active: currentPath === '/map' },
                { href: '/analytics', label: '📊 Analytics', active: currentPath === '/analytics' },
                { href: '/reports', label: '📋 Reports', active: currentPath === '/reports' },
            ];

            return (
                <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <a href="/" className="text-3xl font-bold text-white flex items-center space-x-2">
                                <span>🏙️</span>
                                <span>CivInsight AI</span>
                            </a>
                            <nav className="hidden md:flex space-x-1">
                                {navItems.map((item) => (
                                    <a key={item.href} href={item.href} 
                                       className={\`px-4 py-2 rounded-lg text-sm font-medium transition-all \${item.active 
                                         ? 'bg-white/20 text-white' : 'text-white/80 hover:text-white hover:bg-white/10'\}\`}>
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>
                </header>
            );
        }
        
        ${bodyContent}
        
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>`;
}

// Dashboard
app.get('/', (req, res) => {
  const content = `
    function App() {
        const [stats, setStats] = useState({ total: '...', resolved: '...', pending: '...' });

        useEffect(() => {
            fetch('/api/nyc311')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        const issues = data.data;
                        setStats({
                            total: issues.length.toLocaleString(),
                            resolved: issues.filter(i => i.status === 'Closed').length,
                            pending: issues.filter(i => i.status === 'Open').length,
                        });
                    }
                })
                .catch(console.error);
        }, []);

        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold text-white mb-6">🏙️ CivInsight AI</h1>
                        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                            Real-time civic issue detection and analytics platform powered by NYC 311 data
                        </p>
                        <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-100 px-4 py-2 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span>Live NYC 311 Data Connected</span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <a href="/map" className="block">
                            <div className="glass-effect p-8 rounded-xl hover-lift transition-all duration-300">
                                <div className="text-6xl mb-4 text-center">🗺️</div>
                                <h2 className="text-2xl font-semibold mb-4 text-center text-white">Live Interactive Map</h2>
                                <p className="text-white/80 text-center">
                                    View real-time civic issues with live NYC 311 data and geographic distribution
                                </p>
                            </div>
                        </a>
                        
                        <a href="/analytics" className="block">
                            <div className="glass-effect p-8 rounded-xl hover-lift transition-all duration-300">
                                <div className="text-6xl mb-4 text-center">📊</div>
                                <h2 className="text-2xl font-semibold mb-4 text-center text-white">Analytics Dashboard</h2>
                                <p className="text-white/80 text-center">
                                    Explore trends and insights from real NYC 311 civic issue data
                                </p>
                            </div>
                        </a>
                        
                        <a href="/reports" className="block">
                            <div className="glass-effect p-8 rounded-xl hover-lift transition-all duration-300">
                                <div className="text-6xl mb-4 text-center">📋</div>
                                <h2 className="text-2xl font-semibold mb-4 text-center text-white">Issue Reports</h2>
                                <p className="text-white/80 text-center">
                                    Browse real NYC 311 reports with advanced filtering capabilities
                                </p>
                            </div>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-effect rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-blue-200">{stats.total}</div>
                            <div className="text-sm text-white/70 mt-1">Live NYC 311 Issues</div>
                        </div>
                        <div className="glass-effect rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-green-200">{stats.resolved}</div>
                            <div className="text-sm text-white/70 mt-1">Resolved Issues</div>
                        </div>
                        <div className="glass-effect rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-orange-200">{stats.pending}</div>
                            <div className="text-sm text-white/70 mt-1">Open Issues</div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
  `;
  res.send(createHTMLPage('Dashboard', content));
});

// Map Page with NYC 311 Integration
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
                issues.forEach((issue) => {
                    if (!issue.lat || !issue.lng) return;
                    
                    const getColor = (category) => {
                        switch (category) {
                            case 'Infrastructure': return '#ef4444';
                            case 'Public Safety': return '#f59e0b';
                            case 'Environment': return '#10b981';
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
                    
                    marker.bindPopup(\`
                        <div style="padding: 12px; min-width: 250px;">
                            <h3 style="margin: 0 0 8px 0; font-weight: bold;">\${issue.title}</h3>
                            <p style="margin: 4px 0; font-size: 14px;"><strong>Category:</strong> \${issue.category}</p>
                            <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> \${issue.status}</p>
                            <p style="margin: 4px 0; font-size: 14px;"><strong>Address:</strong> \${issue.address || issue.borough || 'NYC'}</p>
                            \${issue.description ? \`<p style="margin: 8px 0; font-size: 13px; font-style: italic;">\${issue.description}</p>\` : ''}
                            <p style="margin: 8px 0 0 0; font-size: 12px; color: #666;">NYC 311 ID: \${issue.id}</p>
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
            <div className="relative w-full h-96 lg:h-[600px] overflow-hidden rounded-xl">
                <div ref={mapContainer} className="w-full h-full rounded-xl" />
                {!mapReady && (
                    <div className="absolute inset-0 glass-effect rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p className="text-white/80">Loading live NYC 311 data...</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    function App() {
        const [issues, setIssues] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [lastUpdate, setLastUpdate] = useState('');
        
        useEffect(() => {
            const loadData = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    
                    const response = await fetch('/api/nyc311');
                    const result = await response.json();
                    
                    if (result.success) {
                        console.log(\`✅ Loaded \${result.data.length} live NYC 311 issues\`);
                        setIssues(result.data);
                        setLastUpdate(new Date(result.timestamp).toLocaleString());
                    } else {
                        throw new Error(result.error || 'Failed to fetch data');
                    }
                } catch (err) {
                    console.error('❌ Error loading NYC 311 data:', err);
                    setError(err.message);
                    
                    // Fallback data
                    setIssues([
                        { id: 'fallback-1', lat: 40.7128, lng: -74.0060, title: 'API Connection Error', 
                          category: 'Infrastructure', priority: 'High', status: 'Open', address: 'NYC' }
                    ]);
                } finally {
                    setLoading(false);
                }
            };

            loadData();
            
            // Auto-refresh every 5 minutes
            const interval = setInterval(loadData, 300000);
            return () => clearInterval(interval);
        }, []);
        
        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">🗺️ Live Interactive Map</h1>
                        <p className="text-white/80 text-lg">
                            {loading 
                                ? 'Loading real-time NYC 311 data...'
                                : error 
                                ? 'Connection error - showing fallback data'
                                : \`Real-time civic issue mapping with \${issues.length} live NYC 311 reports\`
                            }
                        </p>
                        {lastUpdate && !error && (
                            <p className="text-white/60 text-sm mt-2">
                                Last updated: {lastUpdate} • Auto-refreshes every 5 minutes
                            </p>
                        )}
                    </div>

                    <div className="glass-effect rounded-xl p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-6 text-white">
                            {loading ? 'Loading NYC 311 Data...' : 'Live NYC 311 Geographic Distribution'}
                        </h2>
                        {!loading && <InteractiveMap issues={issues} />}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="glass-effect rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-blue-200">{loading ? '...' : issues.length}</div>
                            <div className="text-sm text-white/70 mt-1">NYC 311 Issues</div>
                        </div>
                        <div className="glass-effect rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-green-200">
                                {error ? '❌' : '✅'}
                            </div>
                            <div className="text-sm text-white/70 mt-1">
                                {error ? 'API Error' : 'Live Data'}
                            </div>
                        </div>
                        <div className="glass-effect rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-red-200">
                                {loading ? '...' : issues.filter(i => i.priority === 'High').length}
                            </div>
                            <div className="text-sm text-white/70 mt-1">High Priority</div>
                        </div>
                        <div className="glass-effect rounded-xl p-4 text-center">
                            <div className="text-2xl font-bold text-purple-200">
                                {loading ? '...' : issues.filter(i => i.status === 'Open').length}
                            </div>
                            <div className="text-sm text-white/70 mt-1">Open Issues</div>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="mt-6 glass-effect border border-red-400/20 rounded-xl p-4">
                            <p className="text-red-200 text-sm">
                                <strong>NYC 311 API Error:</strong> {error}. Showing fallback data. System will retry automatically.
                            </p>
                        </div>
                    )}
                </main>
            </div>
        );
    }
  `;
  res.send(createHTMLPage('Live Interactive Map', content));
});

// Simple Analytics Page
app.get('/analytics', (req, res) => {
  const content = `
    function App() {
        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(true);
        
        useEffect(() => {
            fetch('/api/nyc311')
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        setData(result.data);
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }, []);
        
        const stats = data ? {
            total: data.length,
            resolved: data.filter(i => i.status === 'Closed').length,
            pending: data.filter(i => i.status === 'Open').length,
            categories: data.reduce((acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + 1;
                return acc;
            }, {})
        } : { total: 0, resolved: 0, pending: 0, categories: {} };

        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">📊 Analytics Dashboard</h1>
                        <p className="text-white/80 text-lg">
                            {loading ? 'Loading analytics...' : \`Insights from \${stats.total} live NYC 311 reports\`}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="glass-effect rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-blue-200 mb-2">
                                {loading ? '...' : stats.total.toLocaleString()}
                            </div>
                            <div className="text-white/70">Total Issues</div>
                        </div>
                        <div className="glass-effect rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-green-200 mb-2">
                                {loading ? '...' : stats.resolved}
                            </div>
                            <div className="text-white/70">Resolved</div>
                        </div>
                        <div className="glass-effect rounded-xl p-6 text-center">
                            <div className="text-3xl font-bold text-orange-200 mb-2">
                                {loading ? '...' : stats.pending}
                            </div>
                            <div className="text-white/70">Open Issues</div>
                        </div>
                    </div>

                    <div className="glass-effect rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-6 text-white">Issue Categories</h2>
                        <div className="space-y-4">
                            {Object.entries(stats.categories).map(([category, count]) => {
                                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                                return (
                                    <div key={category}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-white/80">{category}</span>
                                            <span className="text-white">{count}</span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2">
                                            <div 
                                                className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full"
                                                style={{ width: \`\${percentage}%\` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
        );
    }
  `;
  res.send(createHTMLPage('Analytics Dashboard', content));
});

// Simple Reports Page
app.get('/reports', (req, res) => {
  const content = `
    function App() {
        const [reports, setReports] = useState([]);
        const [loading, setLoading] = useState(true);
        
        useEffect(() => {
            fetch('/api/nyc311')
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        setReports(result.data);
                    }
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }, []);

        return (
            <div className="min-h-screen">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-4">📋 NYC 311 Issue Reports</h1>
                        <p className="text-white/80 text-lg">
                            {loading ? 'Loading reports...' : \`Browse \${reports.length} live NYC 311 reports\`}
                        </p>
                    </div>

                    <div className="glass-effect rounded-xl overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                                <p className="text-white/70">Loading NYC 311 reports...</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/10 max-h-96 overflow-y-auto">
                                {reports.slice(0, 20).map((report) => (
                                    <div key={report.id} className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-white mb-2">
                                                    {report.title}
                                                </h3>
                                                <div className="text-sm text-white/70 space-y-1">
                                                    <div>📍 {report.address || report.borough || 'NYC'}</div>
                                                    <div>🏢 {report.category}</div>
                                                    <div>🆔 {report.id}</div>
                                                </div>
                                                {report.description && (
                                                    <p className="text-white/80 text-sm mt-2">{report.description}</p>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <span className={\`inline-block px-3 py-1 rounded-full text-xs font-medium \${
                                                    report.status === 'Open' ? 'bg-red-500/20 text-red-200' :
                                                    report.status === 'Closed' ? 'bg-green-500/20 text-green-200' :
                                                    'bg-yellow-500/20 text-yellow-200'
                                                }\`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        );
    }
  `;
  res.send(createHTMLPage('NYC 311 Issue Reports', content));
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log('🚀 CivInsight AI with Live NYC 311 Integration');
    console.log(`📱 Server running at: http://localhost:${PORT}`);
    console.log('');
    console.log('Available Pages:');
    console.log(`   🏠 Dashboard: http://localhost:${PORT}/`);
    console.log(`   🗺️ Live Map: http://localhost:${PORT}/map`);
    console.log(`   📊 Analytics: http://localhost:${PORT}/analytics`);
    console.log(`   📋 Reports: http://localhost:${PORT}/reports`);
    console.log(`   🔧 API: http://localhost:${PORT}/api/nyc311`);
    console.log('');
    console.log('✅ Features:');
    console.log('   • Live NYC 311 API Integration');
    console.log('   • Real-time data refresh every 5 minutes');
    console.log('   • Interactive map with live markers');
    console.log('   • Modern glass-morphism design');
    console.log('   • Responsive layout for all devices');
});
