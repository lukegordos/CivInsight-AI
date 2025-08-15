import Navigation from '../components/Navigation'
import { useState } from 'react'

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  
  const handleGenerateReport = async () => {
    setIsGenerating(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      alert('Report generated successfully! Check your downloads folder.')
    } catch (error) {
      console.error('Report generation failed:', error)
      alert('Report generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reports Dashboard
          </h1>
          <p className="text-gray-600">
            Generate and download comprehensive reports on civic issues and performance metrics
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Generate Custom Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors cursor-pointer">
              <h4 className="font-semibold text-gray-900 mb-2">Performance Report</h4>
              <p className="text-gray-600 text-sm mb-4">
                Analyze resolution rates, response times, and performance metrics
              </p>
              <button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="text-blue-600 font-medium text-sm hover:text-blue-700 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Report →'}
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors cursor-pointer">
              <h4 className="font-semibold text-gray-900 mb-2">Time-based Analysis</h4>
              <p className="text-gray-600 text-sm mb-4">
                Temporal patterns and trends in issue reporting and resolution
              </p>
              <button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="text-blue-600 font-medium text-sm hover:text-blue-700 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Report →'}
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors cursor-pointer">
              <h4 className="font-semibold text-gray-900 mb-2">Geographic Report</h4>
              <p className="text-gray-600 text-sm mb-4">
                Borough and neighborhood-level analysis and comparisons
              </p>
              <button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="text-blue-600 font-medium text-sm hover:text-blue-700 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Report →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
