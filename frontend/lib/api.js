// Free API services for CivInsight AI

// NYC 311 API - Completely Free
export const fetchNYC311Data = async () => {
  try {
    // Get recent 311 requests from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const dateFilter = oneWeekAgo.toISOString().split('T')[0];
    
    const response = await fetch(
      `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=100&$order=created_date DESC&$where=created_date>'${dateFilter}'`
    );
    
    if (!response.ok) {
      throw new Error(`NYC 311 API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('NYC 311 raw data sample:', data[0]); // Debug log
    
    return data
      .filter((item) => item.latitude && item.longitude) // Must have coordinates
      .map((item) => ({
        id: item.unique_key || `nyc-${Math.random()}`,
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
        title: item.complaint_type || 'Unknown Issue',
        category: mapNYCCategoryToCivInsight(item.complaint_type),
        priority: determinePriority(item.complaint_type, item.status),
        description: item.descriptor || 'No description available',
        address: item.incident_address || 'Address not specified',
        createdAt: item.created_date,
        status: item.status || 'Unknown',
        agency: item.agency_name || item.agency,
        borough: item.borough,
        zip: item.incident_zip,
      }))
      .slice(0, 50); // Limit to 50 for performance
  } catch (error) {
    console.error('Error fetching NYC 311 data:', error);
    return [];
  }
};

const mapNYCCategoryToCivInsight = (complaint) => {
  if (!complaint) return 'Other';
  
  const lowerComplaint = complaint.toLowerCase();
  
  if (lowerComplaint.includes('noise') || 
      lowerComplaint.includes('safety') || 
      lowerComplaint.includes('drug') ||
      lowerComplaint.includes('drinking') ||
      lowerComplaint.includes('disorderly')) {
    return 'Public Safety';
  }
  
  if (lowerComplaint.includes('water') || 
      lowerComplaint.includes('sewer') || 
      lowerComplaint.includes('trash') ||
      lowerComplaint.includes('sanitation') ||
      lowerComplaint.includes('recycling') ||
      lowerComplaint.includes('litter') ||
      lowerComplaint.includes('dead animal') ||
      lowerComplaint.includes('air quality') ||
      lowerComplaint.includes('odor')) {
    return 'Environment';
  }
  
  if (lowerComplaint.includes('street') || 
      lowerComplaint.includes('pothole') || 
      lowerComplaint.includes('sidewalk') ||
      lowerComplaint.includes('bridge') ||
      lowerComplaint.includes('building') ||
      lowerComplaint.includes('construction') ||
      lowerComplaint.includes('maintenance') ||
      lowerComplaint.includes('repair')) {
    return 'Infrastructure';
  }
  
  if (lowerComplaint.includes('taxi') || 
      lowerComplaint.includes('bus') || 
      lowerComplaint.includes('traffic') ||
      lowerComplaint.includes('parking') ||
      lowerComplaint.includes('vehicle') ||
      lowerComplaint.includes('bicycle') ||
      lowerComplaint.includes('subway')) {
    return 'Transportation';
  }
  
  return 'Other';
};

const determinePriority = (complaint, status) => {
  if (!complaint) return 'Low';
  
  const lowerComplaint = complaint.toLowerCase();
  
  // High priority issues
  if (lowerComplaint.includes('emergency') ||
      lowerComplaint.includes('urgent') ||
      lowerComplaint.includes('dangerous') ||
      lowerComplaint.includes('fire') ||
      lowerComplaint.includes('gas') ||
      lowerComplaint.includes('water main')) {
    return 'High';
  }
  
  // Medium priority
  if (lowerComplaint.includes('noise') ||
      lowerComplaint.includes('pothole') ||
      lowerComplaint.includes('traffic') ||
      lowerComplaint.includes('street light')) {
    return 'Medium';
  }
  
  return 'Low';
};

export const fetchCivicData = async () => {
  return await fetchNYC311Data();
};
