export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏙️ CivInsight AI
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Real-time civic issue detection and analytics platform
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <a
            href="/map"
            className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-semibold mb-2">Interactive Map</h2>
            <p className="text-gray-600">
              View real-time civic issues on an interactive map
            </p>
          </a>
          
          <a
            href="/analytics"
            className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold mb-2">Analytics</h2>
            <p className="text-gray-600">
              Explore trends and insights from civic data
            </p>
          </a>
          
          <a
            href="/reports"
            className="block p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold mb-2">Reports</h2>
            <p className="text-gray-600">
              Submit and manage civic issue reports
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}
