import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { fetchCivicData } from '../lib/api'
import Link from 'next/link'

// Dynamically import the map component to avoid SSR issues
const InteractiveMap = dynamic(() => import('../components/map/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="relative h-96 lg:h-[600px]">
      <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    </div>
  )
})

export default function MapPage() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching real NYC 311 data...')
        
        const data = await fetchCivicData()
        console.log(`✅ Loaded ${data.length} civic issues from NYC 311`)
        
        setIssues(data)
      } catch (err) {
        console.error('❌ Error loading civic data:', err)
        setError(err.message)
        
        // Fallback to mock data
        setIssues([
          { id: 1, lat: 40.7128, lng: -74.0060, title: 'NYC 311 API Error', category: 'Infrastructure', priority: 'High' },
          { id: 2, lat: 40.7589, lng: -73.9851, title: 'Using fallback data', category: 'Public Safety', priority: 'Medium' },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">CI</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">CivInsight AI</h1>
                <p className="text-gray-600">Interactive Map</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/map" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
                Interactive Map
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🗺️ Live NYC 311 Data Visualization
          </h2>
          <p className="text-gray-600">
            {loading 
              ? 'Loading real NYC 311 data...'
              : error 
              ? 'Using fallback data due to API error'
              : `Real-time civic issue mapping with ${issues.length} NYC 311 reports`
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">
            {loading ? 'Loading NYC 311 Data...' : 'NYC 311 Geographic Distribution'}
          </h3>
          {!loading && <InteractiveMap issues={issues} />}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Live Data Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">
                  {loading ? '...' : issues.length}
                </span>
              </div>
              <div className="text-green-800 font-semibold">NYC 311 Issues</div>
              <div className="text-green-600 text-sm mt-1">Active Reports</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">
                  {loading ? '⏳' : error ? '❌' : '✅'}
                </span>
              </div>
              <div className="text-blue-800 font-semibold">
                {loading ? 'Loading' : error ? 'API Error' : 'Live Data'}
              </div>
              <div className="text-blue-600 text-sm mt-1">Connection Status</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">
                  {loading ? '...' : issues.filter(i => i.priority === 'High').length}
                </span>
              </div>
              <div className="text-purple-800 font-semibold">High Priority</div>
              <div className="text-purple-600 text-sm mt-1">Urgent Issues</div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xs">
                  {new Date().getMonth() + 1}/{new Date().getDate()}
                </span>
              </div>
              <div className="text-orange-800 font-semibold">Last Updated</div>
              <div className="text-orange-600 text-sm mt-1">Real-time Sync</div>
            </div>
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
                <div>
                  <p className="text-red-800 font-medium">API Connection Error</p>
                  <p className="text-red-600 text-sm">{error}. Showing fallback data for demonstration.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
