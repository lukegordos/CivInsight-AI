import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { fetchCivicData } from '../lib/api'

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🗺️ Interactive Map - CivInsight AI
          </h1>
          <p className="mt-2 text-gray-600">
            {loading 
              ? 'Loading real NYC 311 data...'
              : error 
              ? 'Using fallback data due to API error'
              : `Real-time civic issue mapping with ${issues.length} NYC 311 reports`
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {loading ? 'Loading NYC 311 Data...' : 'NYC 311 Geographic Distribution'}
          </h2>
          {!loading && <InteractiveMap issues={issues} />}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Live Data Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {loading ? '...' : issues.length}
              </div>
              <div className="text-sm text-green-800">NYC 311 Issues</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {loading ? '⏳' : error ? '❌' : '✅'}
              </div>
              <div className="text-sm text-blue-800">
                {loading ? 'Loading' : error ? 'API Error' : 'Live Data'}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {loading ? '...' : issues.filter(i => i.priority === 'High').length}
              </div>
              <div className="text-sm text-purple-800">High Priority</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {loading ? '...' : new Date().toLocaleDateString()}
              </div>
              <div className="text-sm text-orange-800">Last Updated</div>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <strong>API Error:</strong> {error}. Showing fallback data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🗺️ Interactive Map - CivInsight AI
          </h1>
          <p className="mt-2 text-gray-600">
            {loading 
              ? 'Loading real NYC 311 data...'
              : error 
              ? 'Using fallback data due to API error'
              : `Real-time civic issue mapping with ${issues.length} NYC 311 reports`
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {loading ? 'Loading NYC 311 Data...' : 'NYC 311 Geographic Distribution'}
          </h2>
          {!loading && <InteractiveMap issues={issues} />}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Live Data Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {loading ? '...' : issues.length}
              </div>
              <div className="text-sm text-green-800">NYC 311 Issues</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {loading ? '⏳' : error ? '❌' : '✅'}
              </div>
              <div className="text-sm text-blue-800">
                {loading ? 'Loading' : error ? 'API Error' : 'Live Data'}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {loading ? '...' : issues.filter(i => i.priority === 'High').length}
              </div>
              <div className="text-sm text-purple-800">High Priority</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {loading ? '...' : new Date().toLocaleDateString()}
              </div>
              <div className="text-sm text-orange-800">Last Updated</div>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                <strong>API Error:</strong> {error}. Showing fallback data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
