import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CivInsight AI
          </h1>
          <p className="text-xl text-gray-600">
            Real-time Civic Issue Detection Platform
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Live NYC 311 Data
          </h2>
          <p className="text-gray-600 mb-6">
            Interactive mapping and analysis of civic issues
          </p>
          <Link 
            href="/map" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            View Interactive Map
          </Link>
        </div>
      </div>
    </div>
  )
}
