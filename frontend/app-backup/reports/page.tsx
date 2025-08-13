'use client'

import { useState } from 'react'
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

// Mock reports data
const mockReports = [
  {
    id: 1,
    title: "Pothole on Main Street",
    category: "Infrastructure",
    priority: "High",
    status: "Open",
    dateReported: "2025-08-10",
    location: "123 Main St, New York, NY",
    description: "Large pothole causing traffic hazards",
    reportedBy: "John Doe"
  },
  {
    id: 2,
    title: "Broken Street Light",
    category: "Public Safety",
    priority: "Medium", 
    status: "In Progress",
    dateReported: "2025-08-09",
    location: "456 Oak Ave, New York, NY",
    description: "Street light not functioning, area poorly lit at night",
    reportedBy: "Jane Smith"
  },
  {
    id: 3,
    title: "Illegal Dumping Site",
    category: "Environment",
    priority: "Low",
    status: "Resolved",
    dateReported: "2025-08-08",
    location: "789 Pine Rd, New York, NY", 
    description: "Construction debris dumped in vacant lot",
    reportedBy: "Mike Johnson"
  },
  {
    id: 4,
    title: "Traffic Signal Malfunction",
    category: "Transportation",
    priority: "High",
    status: "Open",
    dateReported: "2025-08-07",
    location: "Broadway & 42nd St, New York, NY",
    description: "Traffic signal stuck on red, causing major delays",
    reportedBy: "Sarah Wilson"
  }
]

const statusColors = {
  'Open': 'bg-red-100 text-red-800',
  'In Progress': 'bg-yellow-100 text-yellow-800', 
  'Resolved': 'bg-green-100 text-green-800'
}

const priorityColors = {
  'High': 'bg-red-100 text-red-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'Low': 'bg-gray-100 text-gray-800'
}

export default function ReportsPage() {
  const [reports, setReports] = useState(mockReports)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [showNewReportForm, setShowNewReportForm] = useState(false)

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || report.status === statusFilter
    const matchesCategory = categoryFilter === 'All' || report.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📋 Issue Reports</h1>
            <p className="mt-2 text-gray-600">
              Track and manage civic issue reports from the community
            </p>
          </div>
          <button
            onClick={() => setShowNewReportForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Report
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Public Safety">Public Safety</option>
              <option value="Environment">Environment</option>
              <option value="Transportation">Transportation</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <li key={report.id}>
              <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {report.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[report.status as keyof typeof statusColors]}`}>
                        {report.status}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[report.priority as keyof typeof priorityColors]}`}>
                        {report.priority}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="flex-shrink-0">📍 {report.location}</span>
                    <span className="mx-2">•</span>
                    <span>{report.category}</span>
                    <span className="mx-2">•</span>
                    <span>{report.dateReported}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{report.description}</p>
                  <p className="mt-1 text-xs text-gray-500">Reported by: {report.reportedBy}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No reports found matching your criteria.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{reports.length}</div>
          <div className="text-sm text-gray-600">Total Reports</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{reports.filter(r => r.status === 'Open').length}</div>
          <div className="text-sm text-gray-600">Open</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{reports.filter(r => r.status === 'In Progress').length}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{reports.filter(r => r.status === 'Resolved').length}</div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
      </div>
    </div>
  )
}
