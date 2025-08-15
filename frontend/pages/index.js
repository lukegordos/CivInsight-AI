import Navigation from '../components/Navigation';

export default function HomePage() {
  const handleExportData = () => {
    const csvData = [
      ['Issue ID', 'Type', 'Status', 'Date Created', 'Location', 'Priority'],
      ['001', 'Pothole', 'Resolved', '2024-01-15', 'Main Street', 'Medium'],
      ['002', 'Streetlight', 'In Progress', '2024-01-14', 'Oak Avenue', 'High'],
      ['003', 'Noise Complaint', 'Pending', '2024-01-13', 'Downtown', 'Low'],
      ['004', 'Traffic Signal', 'Urgent', '2024-01-12', 'Broadway', 'Critical'],
      ['005', 'Graffiti', 'Resolved', '2024-01-11', 'Park Street', 'Low']
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `civic_issues_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            CivInsight AI Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Professional civic intelligence platform for data-driven city management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Total Issues</h3>
              <p className="text-3xl font-bold text-blue-600">156</p>
              <p className="text-sm text-gray-500">+12% from last month</p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Resolved</h3>
              <p className="text-3xl font-bold text-green-600">89</p>
              <p className="text-sm text-gray-500">57% resolution rate</p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">In Progress</h3>
              <p className="text-3xl font-bold text-yellow-600">62</p>
              <p className="text-sm text-gray-500">Average 3.2 days</p>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">Urgent</h3>
              <p className="text-3xl font-bold text-red-600">5</p>
              <p className="text-sm text-gray-500">Requires immediate attention</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              <button
                onClick={handleExportData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
