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
      .filter((item: any) => item.latitude && item.longitude) // Must have coordinates
      .map((item: any) => ({
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

// OpenWeatherMap API - Free tier: 1,000 calls/day
export const fetchWeatherData = async (lat: number, lng: number) => {
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  if (!API_KEY) return null;
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

// Reddit API - Free with registration
export const fetchRedditCivicData = async (city: string) => {
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${city}/search.json?q=pothole OR "street light" OR "traffic" OR "noise"&restrict_sr=1&sort=new&limit=10`
    );
    const data = await response.json();
    
    return data.data.children.map((post: any) => ({
      id: post.data.id,
      title: post.data.title,
      description: post.data.selftext,
      score: post.data.score,
      created: post.data.created_utc,
      url: `https://reddit.com${post.data.permalink}`,
    }));
  } catch (error) {
    console.error('Error fetching Reddit data:', error);
    return [];
  }
};

// Helper functions
const mapNYCCategoryToCivInsight = (complaint: string): string => {
  if (!complaint) return 'Other';
  
  const lowerComplaint = complaint.toLowerCase();
  
  // Public Safety
  if (lowerComplaint.includes('noise') || 
      lowerComplaint.includes('safety') || 
      lowerComplaint.includes('drug') ||
      lowerComplaint.includes('drinking') ||
      lowerComplaint.includes('disorderly') ||
      lowerComplaint.includes('illegal parking') ||
      lowerComplaint.includes('animal abuse')) {
    return 'Public Safety';
  }
  
  // Infrastructure
  if (lowerComplaint.includes('water') || 
      lowerComplaint.includes('sewer') || 
      lowerComplaint.includes('street') ||
      lowerComplaint.includes('sidewalk') ||
      lowerComplaint.includes('pothole') ||
      lowerComplaint.includes('broken muni meter') ||
      lowerComplaint.includes('street light') ||
      lowerComplaint.includes('damaged tree') ||
      lowerComplaint.includes('dead tree') ||
      lowerComplaint.includes('root damage')) {
    return 'Infrastructure';
  }
  
  // Environment
  if (lowerComplaint.includes('garbage') || 
      lowerComplaint.includes('sanitation') || 
      lowerComplaint.includes('air quality') ||
      lowerComplaint.includes('recycling') ||
      lowerComplaint.includes('dirty conditions') ||
      lowerComplaint.includes('unsanitary') ||
      lowerComplaint.includes('odor') ||
      lowerComplaint.includes('pest')) {
    return 'Environment';
  }
  
  // Transportation
  if (lowerComplaint.includes('traffic') || 
      lowerComplaint.includes('parking') || 
      lowerComplaint.includes('taxi') ||
      lowerComplaint.includes('bus') ||
      lowerComplaint.includes('bike') ||
      lowerComplaint.includes('vehicle') ||
      lowerComplaint.includes('subway') ||
      lowerComplaint.includes('transportation')) {
    return 'Transportation';
  }
  
  return 'Other';
};

const determinePriority = (complaint: string, status: string): string => {
  const urgent = ['emergency', 'safety', 'water main', 'gas leak'];
  const lowerComplaint = complaint.toLowerCase();
  
  if (urgent.some(keyword => lowerComplaint.includes(keyword))) {
    return 'High';
  }
  if (status === 'Open' || status === 'In Progress') {
    return 'Medium';
  }
  return 'Low';
};

// Combined free data fetcher
export const fetchAllFreeData = async () => {
  const [nycData, redditData] = await Promise.all([
    fetchNYC311Data(),
    fetchRedditCivicData('nyc')
  ]);
  
  return {
    official: nycData,
    community: redditData,
    combined: nycData, // Use official data for map
  };
};
