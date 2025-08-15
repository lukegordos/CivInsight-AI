import Link from 'next/link'

export default function AnalyticsPage() {
  // Mock data for demonstration
  const analyticsData = {
    totalIssues: 1247,
    resolvedIssues: 892,
    pendingIssues: 355,
    averageResponseTime: '2.3 days',
    topCategories: [
      { category: 'Infrastructure', count: 425, percentage: 34 },
      { category: 'Public Safety', count: 298, percentage: 24 },
      { category: 'Environment', count: 256, percentage: 21 },
      { category: 'Transportation', count: 189, percentage: 15 },
      { category: 'Other', count: 79, percentage: 6 }
    ],
    boroughData: [
      { borough: 'Manhattan', issues: 342, resolved: 78 },
      { borough: 'Brooklyn', issues: 298, resolved: 72 },
      { borough: 'Queens', issues: 267, resolved: 68 },
      { borough: 'Bronx', issues: 223, resolved: 71 },
      { borough: 'Staten Island', issues: 117, resolved: 74 }
    ],
    monthlyTrends: [
      { month: 'Jan', issues: 98, resolved: 87 },
      { month: 'Feb', issues: 112, resolved: 95 },
      { month: 'Mar', issues: 124, resolved: 102 },
      { month: 'Apr', issues: 135, resolved: 118 },
      { month: 'May', issues: 142, resolved: 125 },
      { month: 'Jun', issues: 158, resolved: 134 }
    ]
  }

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
                <p className="text-gray-600">Analytics Dashboard</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/map" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Interactive Map
              </Link>
              <Link href="/analytics" className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">
                Analytics
              </Link>
              <Link href="/reports" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
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
            📊 Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Comprehensive insights and trends from NYC 311 civic data
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Issues</p>
                <p className="text-3xl font-bold text-blue-600">{analyticsData.totalIssues.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 text-xl">📈</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Resolved</p>
                <p className="text-3xl font-bold text-green-600">{analyticsData.resolvedIssues.toLocaleString()}</p>
                <p className="text-green-600 text-sm">{Math.round((analyticsData.resolvedIssues / analyticsData.totalIssues) * 100)}% completion</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-orange-600">{analyticsData.pendingIssues.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <span className="text-orange-600 text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Response</p>
                <p className="text-3xl font-bold text-purple-600">{analyticsData.averageResponseTime}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-purple-600 text-xl">⚡</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Issues by Category</h3>
            <div className="space-y-4">
              {analyticsData.topCategories.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-yellow-500' :
                      index === 2 ? 'bg-green-500' :
                      index === 3 ? 'bg-blue-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-gray-700 font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{item.count}</span>
                    <span className="text-gray-400">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Borough Performance */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Borough Performance</h3>
            <div className="space-y-4">
              {analyticsData.boroughData.map((borough, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{borough.borough}</span>
                    <span className="text-gray-600">{borough.resolved}% resolved</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${borough.resolved}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>{borough.issues} total issues</span>
                    <span>{Math.round(borough.issues * borough.resolved / 100)} resolved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Trends</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {analyticsData.monthlyTrends.map((month, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg p-4 mb-2 relative">
                  <div className="text-white font-bold text-lg">{month.issues}</div>
                  <div className="text-blue-100 text-xs">Issues</div>
                  <div className="absolute top-1 right-1 text-green-300 text-xs">
                    {month.resolved}✓
                  </div>
                </div>
                <div className="text-gray-600 font-medium">{month.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/reports" className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition-all">
              <div className="text-lg font-semibold mb-2">📝 Generate Report</div>
              <div className="text-blue-100 text-sm">Create detailed analytics reports</div>
            </Link>
            <Link href="/map" className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition-all">
              <div className="text-lg font-semibold mb-2">🗺️ View Map</div>
              <div className="text-blue-100 text-sm">Explore geographic distribution</div>
            </Link>
            <button className="bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition-all text-left">
              <div className="text-lg font-semibold mb-2">📊 Export Data</div>
              <div className="text-blue-100 text-sm">Download analytics data</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
