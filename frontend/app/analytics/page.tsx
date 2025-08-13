'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline'

// Dynamic import for Chart.js components to avoid SSR issues
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false })
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false })

// Dynamic import for the geographic map
const GeographicHeatMap = dynamic(() => import('../../components/GeographicHeatMap'), { 
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
})

// Register Chart.js components (will be loaded dynamically)
if (typeof window !== 'undefined') {
  import('chart.js').then((ChartJS) => {
    const {
      Chart,
      CategoryScale,
      LinearScale,
      BarElement,
      LineElement,
      PointElement,
      Title,
      Tooltip,
      Legend,
    } = ChartJS
    
    Chart.register(
      CategoryScale,
      LinearScale,
      BarElement,
      LineElement,
      PointElement,
      Title,
      Tooltip,
      Legend
    )
  })
}

// Mock analytics data
const mockAnalytics = {
  totalIssues: 1247,
  resolvedIssues: 892,
  pendingIssues: 355,
  avgResolutionTime: 4.2,
  monthlyTrends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Issues Reported',
      data: [65, 78, 90, 81, 76, 85],
      backgroundColor: 'rgba(59, 130, 246, 0.6)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 2
    }]
  },
  categoryBreakdown: {
    labels: ['Infrastructure', 'Public Safety', 'Environment', 'Transportation', 'Other'],
    datasets: [{
      label: 'Issues by Category',
      data: [320, 280, 190, 150, 100],
      backgroundColor: [
        'rgba(239, 68, 68, 0.6)',
        'rgba(245, 158, 11, 0.6)', 
        'rgba(34, 197, 94, 0.6)',
        'rgba(59, 130, 246, 0.6)',
        'rgba(107, 114, 128, 0.6)'
      ],
      borderColor: [
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(34, 197, 94, 1)', 
        'rgba(59, 130, 246, 1)',
        'rgba(107, 114, 128, 1)'
      ],
      borderWidth: 2
    }]
  }
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(mockAnalytics)
  const [timeRange, setTimeRange] = useState('6m')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">📊 Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Comprehensive insights and trends from civic issue data
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Issues</h3>
              <p className="text-2xl font-bold text-blue-600">{analytics.totalIssues.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Resolved</h3>
              <p className="text-2xl font-bold text-green-600">{analytics.resolvedIssues.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowTrendingDownIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Pending</h3>
              <p className="text-2xl font-bold text-orange-600">{analytics.pendingIssues.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Avg Resolution</h3>
              <p className="text-2xl font-bold text-purple-600">{analytics.avgResolutionTime} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
          <div className="h-64">
            <Line data={analytics.monthlyTrends} options={chartOptions} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Issues by Category</h2>
          <div className="h-64">
            <Bar data={analytics.categoryBreakdown} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Geographic Heat Map */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Geographic Distribution</h2>
        <GeographicHeatMap />
      </div>
    </div>
  )
}
