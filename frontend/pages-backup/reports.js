import Link from 'next/link'
import { useState } from 'react'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('monthly')
  
  // Mock reports data
  const reports = [
    {
      id: 1,
      title: 'Monthly Civic Issues Report - June 2025',
      type: 'monthly',
      date: '2025-06-30',
      status: 'completed',
      description: 'Comprehensive analysis of civic issues reported through NYC 311 in June 2025',
      metrics: {
        totalIssues: 158,
        resolved: 134,
        categories: ['Infrastructure', 'Public Safety', 'Environment'],
        avgResponseTime: '2.1 days'
      }
    },
    {
      id: 2,
      title: 'Borough Performance Analysis - Q2 2025',
      type: 'quarterly',
      date: '2025-06-30',
      status: 'completed',
      description: 'Quarterly comparison of issue resolution rates across NYC boroughs',
      metrics: {
        totalIssues: 445,
        resolved: 367,
        categories: ['All Categories'],
        avgResponseTime: '2.4 days'
      }
    },
    {
      id: 3,
      title: 'Infrastructure Issues Deep Dive',
      type: 'categorical',
      date: '2025-06-25',
      status: 'completed',
      description: 'Detailed analysis of infrastructure-related civic issues and resolution patterns',
      metrics: {
        totalIssues: 425,
        resolved: 298,
        categories: ['Infrastructure'],
        avgResponseTime: '3.2 days'
      }
    },
    {
      id: 4,
      title: 'Real-time Daily Report - August 13',
      type: 'daily',
      date: '2025-08-13',
      status: 'generating',
      description: 'Daily snapshot of civic issues and AI-powered insights',
      metrics: {
        totalIssues: 23,
        resolved: 8,
        categories: ['Multiple'],
        avgResponseTime: 'N/A'
      }
    }
  ]

  const reportTypes = [
    { id: 'all', name: 'All Reports', icon: '📊' },
    { id: 'monthly', name: 'Monthly', icon: '📅' },
    { id: 'quarterly', name: 'Quarterly', icon: '📈' },
    { id: 'categorical', name: 'By Category', icon: '🏷️' },
    { id: 'daily', name: 'Daily', icon: '⏰' }
  ]

  const filteredReports = selectedReport === 'all' 
    ? reports 
    : reports.filter(report => report.type === selectedReport)

  return (
    <div className="min-h-screen bg-gray-50">
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
                <p className="text-gray-600">Reports</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/map" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Interactive Map
              </Link>
              <Link href="/analytics" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Analytics
              </Link>
              <Link href="/reports" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
                Reports
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            📝 Reports & Analytics
          </h2>
          <p className="text-gray-600">
            Generated reports and insights from NYC 311 civic data analysis
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedReport === type.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {type.icon} {type.name}
              </button>
            ))}
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
            ➕ Generate New Report
          </button>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      report.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status === 'completed' ? '✅ Completed' : '⏳ Generating'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Report Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Total Issues</div>
                  <div className="text-xl font-bold text-gray-900">{report.metrics.totalIssues}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Resolved</div>
                  <div className="text-xl font-bold text-green-600">{report.metrics.resolved}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Categories</div>
                  <div className="text-sm font-medium text-gray-900">
                    {report.metrics.categories.slice(0, 2).join(', ')}
                    {report.metrics.categories.length > 2 && '...'}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Avg Response</div>
                  <div className="text-sm font-medium text-gray-900">{report.metrics.avgResponseTime}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">
                  Generated: {new Date(report.date).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      report.status === 'completed'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={report.status !== 'completed'}
                  >
                    📄 View Report
                  </button>
                  <button 
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      report.status === 'completed'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={report.status !== 'completed'}
                  >
                    📥 Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Report Generation Options */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Generate Custom Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-blue-600 text-2xl">📊</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Performance Report</h4>
              <p className="text-gray-600 text-sm mb-4">
                Analyze resolution rates, response times, and performance metrics
              </p>
              <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
                Generate Report →
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-green-600 text-2xl">🏷️</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Category Analysis</h4>
              <p className="text-gray-600 text-sm mb-4">
                Deep dive into specific issue categories and trends
              </p>
              <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
                Generate Report →
              </button>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-purple-600 text-2xl">🗺️</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Geographic Report</h4>
              <p className="text-gray-600 text-sm mb-4">
                Borough and neighborhood-level analysis and comparisons
              </p>
              <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
                Generate Report →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
