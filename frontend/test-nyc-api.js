// Simple test of NYC 311 API
async function testNYC311API() {
  console.log('Testing NYC 311 API...');
  
  try {
    // Get recent 311 requests from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const dateFilter = oneWeekAgo.toISOString().split('T')[0];
    
    const response = await fetch(
      `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=10&$order=created_date DESC&$where=created_date>'${dateFilter}'`
    );
    
    if (!response.ok) {
      throw new Error(`NYC 311 API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ NYC 311 API is working!');
    console.log(`📊 Found ${data.length} recent 311 requests`);
    
    if (data.length > 0) {
      const sample = data[0];
      console.log('\n📋 Sample request:');
      console.log(`  - ID: ${sample.unique_key}`);
      console.log(`  - Type: ${sample.complaint_type}`);
      console.log(`  - Description: ${sample.descriptor}`);
      console.log(`  - Location: ${sample.incident_address}`);
      console.log(`  - Borough: ${sample.borough}`);
      console.log(`  - Status: ${sample.status}`);
      console.log(`  - Created: ${sample.created_date}`);
      console.log(`  - Coordinates: ${sample.latitude}, ${sample.longitude}`);
    }
    
    // Test our data transformation
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
          lowerComplaint.includes('street') ||
          lowerComplaint.includes('sidewalk') ||
          lowerComplaint.includes('pothole') ||
          lowerComplaint.includes('tree')) {
        return 'Infrastructure';
      }
      
      if (lowerComplaint.includes('garbage') || 
          lowerComplaint.includes('sanitation') || 
          lowerComplaint.includes('air quality') ||
          lowerComplaint.includes('dirty') ||
          lowerComplaint.includes('pest')) {
        return 'Environment';
      }
      
      if (lowerComplaint.includes('traffic') || 
          lowerComplaint.includes('parking') || 
          lowerComplaint.includes('taxi') ||
          lowerComplaint.includes('vehicle')) {
        return 'Transportation';
      }
      
      return 'Other';
    };
    
    const transformedData = data
      .filter(item => item.latitude && item.longitude)
      .slice(0, 5)
      .map(item => ({
        id: item.unique_key,
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longitude),
        title: item.complaint_type,
        category: mapNYCCategoryToCivInsight(item.complaint_type),
        description: item.descriptor,
        address: item.incident_address,
        borough: item.borough,
        status: item.status
      }));
    
    console.log('\n🔄 Transformed data sample:');
    transformedData.forEach((item, index) => {
      console.log(`  ${index + 1}. [${item.category}] ${item.title}`);
      console.log(`     📍 ${item.address}, ${item.borough}`);
      console.log(`     📊 Status: ${item.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing NYC 311 API:', error);
  }
}

// Run the test
testNYC311API();
