let data;
let filteredData;
let currentChart = null;

// Initialize the application
async function init() {
  try {
    const link = "https://data.cityofnewyork.us/resource/rsgh-akpg.json";
    const response = await fetch(link);
    data = await response.json();
    filteredData = [...data];
    updateAnalysis();
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Failed to load data. Please try again later.");
  }
}

// Update analysis based on selected options
function updateAnalysis() {
  const analysisType = get('analysis-type').value;
  const chartType = get('chart-type').value;
  
  // Apply filters
  applyFilters();
  
  // Generate appropriate data and chart
  switch(analysisType) {
    case 'breed':
      generateBreedAnalysis(chartType);
      break;
    case 'borough':
      generateBoroughAnalysis(chartType);
      break;
    case 'gender':
      generateGenderAnalysis(chartType);
      break;
    case 'timeline':
      generateTimelineAnalysis(chartType);
      break;
    case 'spayneuter':
      generateSpayNeuterAnalysis(chartType);
      break;
  }
}

// Apply filters to the data
function applyFilters() {
  const boroughFilter = get('filter-borough').value;
  const genderFilter = get('filter-gender').value;
  const spayNeuterFilter = get('filter-spayneuter').value;
  
  filteredData = data.filter(incident => {
    const boroughMatch = !boroughFilter || incident.borough === boroughFilter;
    const genderMatch = !genderFilter || incident.gender === genderFilter;
    const spayNeuterMatch = !spayNeuterFilter || 
      (spayNeuterFilter === 'true' ? incident.spayneuter : !incident.spayneuter);
    
    return boroughMatch && genderMatch && spayNeuterMatch;
  });
}

// Generate breed analysis
function generateBreedAnalysis(chartType) {
  const breedCounts = {};
  filteredData.forEach(incident => {
    const breed = incident.breed || 'Unknown';
    breedCounts[breed] = (breedCounts[breed] || 0) + 1;
  });
  
  // Sort breeds by count and take top 10
  const sortedBreeds = Object.entries(breedCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  const columns = sortedBreeds.map(([breed, count]) => [breed, count]);
  
  displayChart(columns, 'chart', chartType, {
    title: 'Top 10 Dog Breeds Involved in Bites',
    axis: {
      x: {
        type: 'category',
        tick: { rotate: 45 }
      },
      y: {
        label: 'Number of Incidents'
      }
    },
    tooltip: {
      format: {
        value: value => `${value} incidents`
      }
    }
  });
  
  updateAnalysisText('breed', sortedBreeds);
}

// Generate borough analysis
function generateBoroughAnalysis(chartType) {
  const boroughCounts = {};
  filteredData.forEach(incident => {
    const borough = incident.borough || 'Unknown';
    boroughCounts[borough] = (boroughCounts[borough] || 0) + 1;
  });
  
  const columns = Object.entries(boroughCounts)
    .map(([borough, count]) => [borough, count]);
  
  displayChart(columns, 'chart', chartType, {
    title: 'Dog Bite Incidents by Borough',
    color: {
      pattern: ['#727D73', '#AAB99A', '#D0DDD0', '#F0F0D7', '#2C2C2C']
    }
  });
  
  updateAnalysisText('borough', Object.entries(boroughCounts));
}

// Generate gender analysis
function generateGenderAnalysis(chartType) {
  const genderCounts = {
    'Male': 0,
    'Female': 0,
    'Unknown': 0
  };
  
  filteredData.forEach(incident => {
    switch(incident.gender) {
      case 'M': genderCounts['Male']++; break;
      case 'F': genderCounts['Female']++; break;
      default: genderCounts['Unknown']++;
    }
  });
  
  const columns = Object.entries(genderCounts)
    .map(([gender, count]) => [gender, count]);
  
  displayChart(columns, 'chart', chartType, {
    title: 'Dog Bite Incidents by Gender',
    color: {
      pattern: ['#727D73', '#AAB99A', '#D0DDD0']
    }
  });
  
  updateAnalysisText('gender', Object.entries(genderCounts));
}

// Generate timeline analysis
function generateTimelineAnalysis(chartType) {
  const yearCounts = {};
  filteredData.forEach(incident => {
    const date = new Date(incident.dateofbite);
    const year = date.getFullYear();
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });
  
  const columns = Object.entries(yearCounts)
    .sort(([a], [b]) => a - b)
    .map(([year, count]) => [year, count]);
  
  displayChart(columns, 'chart', chartType, {
    title: 'Dog Bite Incidents Over Time',
    axis: {
      x: {
        type: 'category',
        label: 'Year'
      },
      y: {
        label: 'Number of Incidents'
      }
    }
  });
  
  updateAnalysisText('timeline', Object.entries(yearCounts));
}

// Generate spay/neuter analysis
function generateSpayNeuterAnalysis(chartType) {
  const statusCounts = {
    'Spayed/Neutered': 0,
    'Not Spayed/Neutered': 0,
    'Unknown': 0
  };
  
  filteredData.forEach(incident => {
    if (incident.spayneuter === true) {
      statusCounts['Spayed/Neutered']++;
    } else if (incident.spayneuter === false) {
      statusCounts['Not Spayed/Neutered']++;
    } else {
      statusCounts['Unknown']++;
    }
  });
  
  const columns = Object.entries(statusCounts)
    .map(([status, count]) => [status, count]);
  
  displayChart(columns, 'chart', chartType, {
    title: 'Dog Bite Incidents by Spay/Neuter Status',
    color: {
      pattern: ['#727D73', '#AAB99A', '#D0DDD0']
    }
  });
  
  updateAnalysisText('spayneuter', Object.entries(statusCounts));
}

// Display chart with C3.js
function displayChart(data, id, type, options = {}) {
  if (currentChart) {
    currentChart.destroy();
  }
  
  const defaultOptions = {
    bindto: '#' + id,
    data: {
      columns: data,
      type: type,
      onclick: function(d) {
        // Interactive feature: Show detailed info on click
        const value = d.value;
        const name = d.name;
        alert(`${name}: ${value} incidents`);
}
    },
    transition: {
      duration: 500
    },
    interaction: {
      enabled: true
    },
    legend: {
      position: 'right'
    }
  };
  
  currentChart = c3.generate({...defaultOptions, ...options});
}

// Update analysis text
function updateAnalysisText(type, data) {
  const textContainer = get('analysis-text');
  let analysis = '';
  
  switch(type) {
    case 'breed':
      const totalIncidents = data.reduce((sum, [,count]) => sum + count, 0);
      const topBreed = data[0];
      analysis = `
        <h3>Breed Analysis</h3>
        <p>This analysis shows the distribution of dog breeds involved in bite incidents. 
        The top breed, ${topBreed[0]}, accounts for ${((topBreed[1]/totalIncidents)*100).toFixed(1)}% of all incidents.</p>
        <p>Key findings:</p>
        <ul>
          <li>Top 3 breeds account for ${((data.slice(0,3).reduce((sum, [,count]) => sum + count, 0)/totalIncidents)*100).toFixed(1)}% of incidents</li>
          <li>${data.filter(([,count]) => count === 1).length} breeds had only one incident</li>
          <li>Average incidents per breed: ${(totalIncidents/data.length).toFixed(1)}</li>
        </ul>
      `;
      break;
      
    case 'borough':
      const totalBoroughs = data.reduce((sum, [,count]) => sum + count, 0);
      const highestBorough = data.reduce((a, b) => a[1] > b[1] ? a : b);
      analysis = `
        <h3>Borough Analysis</h3>
        <p>This analysis shows the distribution of dog bite incidents across NYC boroughs. 
        ${highestBorough[0]} has the highest number of incidents with ${highestBorough[1]} cases.</p>
        <p>Key findings:</p>
        <ul>
          <li>${highestBorough[0]} accounts for ${((highestBorough[1]/totalBoroughs)*100).toFixed(1)}% of all incidents</li>
          <li>Average incidents per borough: ${(totalBoroughs/data.length).toFixed(1)}</li>
          <li>Borough with least incidents: ${data.reduce((a, b) => a[1] < b[1] ? a : b)[0]}</li>
        </ul>
      `;
      break;
      
    case 'gender':
      const totalGender = data.reduce((sum, [,count]) => sum + count, 0);
      analysis = `
        <h3>Gender Analysis</h3>
        <p>This analysis shows the distribution of dog bite incidents by dog gender.</p>
        <p>Key findings:</p>
        <ul>
          <li>Male dogs are involved in ${((data.find(([g]) => g === 'Male')[1]/totalGender)*100).toFixed(1)}% of incidents</li>
          <li>Female dogs are involved in ${((data.find(([g]) => g === 'Female')[1]/totalGender)*100).toFixed(1)}% of incidents</li>
          <li>Gender is unknown in ${((data.find(([g]) => g === 'Unknown')[1]/totalGender)*100).toFixed(1)}% of cases</li>
        </ul>
      `;
      break;
      
    case 'timeline':
      const years = data.map(([year]) => year);
      const counts = data.map(([,count]) => count);
      const avgIncidents = counts.reduce((a, b) => a + b, 0) / counts.length;
      analysis = `
        <h3>Timeline Analysis</h3>
        <p>This analysis shows the trend of dog bite incidents over time from ${years[0]} to ${years[years.length-1]}.</p>
        <p>Key findings:</p>
        <ul>
          <li>Average incidents per year: ${avgIncidents.toFixed(1)}</li>
          <li>Highest year: ${years[counts.indexOf(Math.max(...counts))]} with ${Math.max(...counts)} incidents</li>
          <li>Lowest year: ${years[counts.indexOf(Math.min(...counts))]} with ${Math.min(...counts)} incidents</li>
          <li>Overall trend: ${counts[counts.length-1] > counts[0] ? 'Increasing' : 'Decreasing'} number of incidents</li>
        </ul>
      `;
      break;
      
    case 'spayneuter':
      const totalStatus = data.reduce((sum, [,count]) => sum + count, 0);
      analysis = `
        <h3>Spay/Neuter Analysis</h3>
        <p>This analysis shows the distribution of dog bite incidents by spay/neuter status.</p>
        <p>Key findings:</p>
        <ul>
          <li>${((data.find(([s]) => s === 'Spayed/Neutered')[1]/totalStatus)*100).toFixed(1)}% of incidents involve spayed/neutered dogs</li>
          <li>${((data.find(([s]) => s === 'Not Spayed/Neutered')[1]/totalStatus)*100).toFixed(1)}% of incidents involve non-spayed/neutered dogs</li>
          <li>Status is unknown for ${((data.find(([s]) => s === 'Unknown')[1]/totalStatus)*100).toFixed(1)}% of cases</li>
        </ul>
      `;
      break;
  }
  
  textContainer.innerHTML = analysis;
}

// Event handlers
function changeAnalysis() {
  updateAnalysis();
}

// Helper function
function get(id) {
  return document.getElementById(id);
}