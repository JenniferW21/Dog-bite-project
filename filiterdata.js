let data;
let currentPage = 1;
const itemsPerPage = 50;
let filteredData = [];

async function init() {
  let link = "https://data.cityofnewyork.us/resource/rsgh-akpg.json";
  info = await fetch(link);
  data = await info.json();
  filteredData = [...data];
  displayData();
}

function displayData() {
  let searchDiv = document.getElementById('search');
  
  // If it's the first page, clear the container
  if (currentPage === 1) {
    searchDiv.innerHTML = '';
  }
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);
  
  currentItems.forEach(incident => {
    let card = createCard(incident);
    searchDiv.appendChild(card);
  });
  
  updateLoadMoreButton();
}

function updateLoadMoreButton() {
  let loadMoreDiv = document.getElementById('load-more');
  if (!loadMoreDiv) {
    loadMoreDiv = document.createElement('div');
    loadMoreDiv.id = 'load-more';
    loadMoreDiv.style.textAlign = 'center';
    loadMoreDiv.style.padding = '20px';
    document.body.appendChild(loadMoreDiv);
  }
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const hasMorePages = currentPage < totalPages;
  
  loadMoreDiv.innerHTML = '';
  
  if (hasMorePages) {
    const loadMoreButton = document.createElement('button');
    loadMoreButton.className = 'load-more-button';
    loadMoreButton.textContent = `Load More (${currentPage * itemsPerPage} of ${filteredData.length} items)`;
    loadMoreButton.onclick = () => {
      currentPage++;
      displayData();
    };
    loadMoreDiv.appendChild(loadMoreButton);
  } else {
    const endMessage = document.createElement('p');
    endMessage.className = 'end-message';
    endMessage.textContent = `Showing all ${filteredData.length} items`;
    loadMoreDiv.appendChild(endMessage);
  }
}

function createCard(incident) {
  let card = document.createElement('div');
  card.className = 'flip-card';
  
  let front = `
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <div class="card-content">
          <h3>Dog Bite Incident</h3>
          <p><strong>Date:</strong> ${formatDate(incident.dateofbite)}</p>
          <p><strong>Breed:</strong> ${incident.breed || 'Unknown'}</p>
          <p><strong>Age:</strong> ${incident.age || 'Unknown'}</p>
          <p><strong>Gender:</strong> ${formatGender(incident.gender)}</p>
          <p><strong>Spayed/Neutered:</strong> ${incident.spayneuter ? 'Yes' : 'No'}</p>
          <p><strong>Borough:</strong> ${incident.borough}</p>
          <p><strong>Zipcode:</strong> ${incident.zipcode || 'Unknown'}</p>
        </div>
      </div>
      <div class="flip-card-back">
        <div class="map-container" id="map-${incident.zipcode}"></div>
      </div>
    </div>
  `;
  
  card.innerHTML = front;
  
  // Initialize map for this card after it's added to the DOM
  setTimeout(() => {
    const mapContainer = card.querySelector(`#map-${incident.zipcode}`);
    if (mapContainer) {
      const map = L.map(mapContainer).setView([40.7128, -74.0060], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Add a marker for the incident location (using zipcode center as approximation)
      // Note: In a real application, you'd want to geocode the zipcode to get exact coordinates
      L.marker([40.7128, -74.0060]).addTo(map)
        .bindPopup(`Dog Bite Incident in ${incident.borough}<br>Zipcode: ${incident.zipcode}`);
    }
  }, 100);
  
  return card;
}

function map(){
  const mymap = L.map('mapid').setView([40.7128, -74.0060], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);

        // Define locations as an array of objects
        const locations = [
            {
                name: "DOHMH #1",
                lat: 40.7542913,
                lng: -73.8720661,
                description: "-35 Junction 34Blvd, Flushing, NY 11372"
            },
            // {
            //     name: "DOHMH #2",
            //     lat: 40.7038236,
            //     lng: -73.8007284,
            //     description: "90-38, 90-44 Parsons Blvd, Jamaica, NY 11432"
            // },
            // {
            //     name: "DOHMH #3",
            //     lat: 40.749511,
            //     lng: -73.9390798,
            //     description: "42-09 28th St, Long Island City, NY 11101"
            // },
            // {
            //     name: "DOHMH #4",
            //     lat: 40.7156716,
            //     lng: -74.0026046,
            //     description: "125 Worth St, New York, NY 10013"
            // }
        ];

        // Loop through the locations and add a marker with a popup for each
        locations.forEach(location => {
            c// Global variables
let data;
let currentPage = 1;
const itemsPerPage = 50;
let filteredData = [];
const geocodeCache = {};
let lastGeocodeTime = 0;
const geocodeDelay = 1000; // 1 second delay between geocode requests

// Initialize the application
async function init() {
  try {
    let link = "https://data.cityofnewyork.us/resource/rsgh-akpg.json";
    const response = await fetch(link);
    data = await response.json();
    filteredData = [...data];
    displayData();
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Failed to load data. Please try again later.");
  }
}

// Display data with pagination
function displayData() {
  let searchDiv = document.getElementById('search');
  
  // Clear container for first page
  if (currentPage === 1) {
    searchDiv.innerHTML = '';
  }
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredData.slice(startIndex, endIndex);
  
  // Create cards for current items
  currentItems.forEach(incident => {
    let card = createCard(incident);
    searchDiv.appendChild(card);
  });
  
  updateLoadMoreButton();
}

// Update the load more button
function updateLoadMoreButton() {
  let loadMoreDiv = document.getElementById('load-more');
  if (!loadMoreDiv) {
    loadMoreDiv = document.createElement('div');
    loadMoreDiv.id = 'load-more';
    loadMoreDiv.style.textAlign = 'center';
    loadMoreDiv.style.padding = '20px';
    document.body.appendChild(loadMoreDiv);
  }
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const hasMorePages = currentPage < totalPages;
  
  loadMoreDiv.innerHTML = '';
  
  if (hasMorePages) {
    const loadMoreButton = document.createElement('button');
    loadMoreButton.className = 'load-more-button';
    loadMoreButton.textContent = `Load More (${currentPage * itemsPerPage} of ${filteredData.length} items)`;
    loadMoreButton.onclick = () => {
      currentPage++;
      displayData();
    };
    loadMoreDiv.appendChild(loadMoreButton);
  } else {
    const endMessage = document.createElement('p');
    endMessage.className = 'end-message';
    endMessage.textContent = `Showing all ${filteredData.length} items`;
    loadMoreDiv.appendChild(endMessage);
  }
}

// Create a card for each incident
function createCard(incident) {
  let card = document.createElement('div');
  card.className = 'flip-card';
  
  let front = `
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <div class="card-content">
          <h3>Dog Bite Incident</h3>
          <p><strong>Date:</strong> ${formatDate(incident.dateofbite)}</p>
          <p><strong>Breed:</strong> ${incident.breed || 'Unknown'}</p>
          <p><strong>Age:</strong> ${incident.age || 'Unknown'}</p>
          <p><strong>Gender:</strong> ${formatGender(incident.gender)}</p>
          <p><strong>Spayed/Neutered:</strong> ${incident.spayneuter ? 'Yes' : 'No'}</p>
          <p><strong>Borough:</strong> ${incident.borough}</p>
          <p><strong>Zipcode:</strong> ${incident.zipcode || 'Unknown'}</p>
        </div>
      </div>
      <div class="flip-card-back">
        <div class="map-container" id="map-${incident.unique_key || incident.zipcode}"></div>
      </div>
    </div>
  `;
  
  card.innerHTML = front;
  
  // Initialize map for this card if it has a zipcode
  if (incident.zipcode) {
    setTimeout(async () => {
      const mapContainer = card.querySelector(`#map-${incident.unique_key || incident.zipcode}`);
      if (mapContainer) {
        try {
          const coords = await geocodeZipCode(incident.zipcode);
          if (coords) {
            const map = L.map(mapContainer).setView(coords, 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            L.marker(coords).addTo(map)
              .bindPopup(`Dog Bite Incident in ${incident.borough}<br>Zipcode: ${incident.zipcode}`);
              
            // Add a circle to approximate zip code area
            L.circle(coords, {
              color: 'red',
              fillColor: '#f03',
              fillOpacity: 0.4,
              radius: 400
            }).addTo(map);
          } else {
            mapContainer.innerHTML = '<div class="map-error">Location data not available for this zip code</div>';
          }
        } catch (error) {
          console.error('Error creating map:', error);
          mapContainer.innerHTML = '<div class="map-error">Error loading map</div>';
        }
      }
    }, 100);
  } else {
    const mapContainer = card.querySelector(`#map-${incident.unique_key || incident.zipcode}`);
    if (mapContainer) {
      mapContainer.innerHTML = '<div class="map-error">No zip code available for this incident</div>';
    }
  }
  
  return card;
}

// Geocode a zip code to get coordinates
async function geocodeZipCode(zipcode) {
  if (geocodeCache[zipcode]) {
    return geocodeCache[zipcode];
  }
  
  // Implement rate limiting
  const now = Date.now();
  const timeSinceLast = now - lastGeocodeTime;
  
  if (timeSinceLast < geocodeDelay) {
    await new Promise(resolve => setTimeout(resolve, geocodeDelay - timeSinceLast));
  }
  
  try {
    lastGeocodeTime = Date.now();
    const response = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${zipcode}&format=json&countrycodes=us&limit=1`);
    const data = await response.json();
    
    if (data.length > 0) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      geocodeCache[zipcode] = coords;
      return coords;
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  let date = new Date(dateString);
  return date.toLocaleDateString();
}

// Format gender for display
function formatGender(gender) {
  switch(gender) {
    case 'M': return 'Male';
    case 'F': return 'Female';
    case 'U': return 'Unknown';
    default: return 'Unknown';
  }
}

// Filter data based on search criteria
function search() {
  let breedFilter = document.getElementById('breed').value.toLowerCase();
  let ageFilter = document.getElementById('age').value;
  let boroughFilter = document.getElementById('borough-filter').value;
  let genderFilter = document.getElementById('gender-filter').value;
  
  filteredData = data.filter(incident => {
    let breedMatch = !breedFilter || 
      (incident.breed && incident.breed.toLowerCase().includes(breedFilter));
    let ageMatch = !ageFilter || 
      (incident.age && incident.age.toString().includes(ageFilter));
    let boroughMatch = !boroughFilter || 
      incident.borough === boroughFilter;
    let genderMatch = !genderFilter || 
      incident.gender === genderFilter;
    
    return breedMatch && ageMatch && boroughMatch && genderMatch;
  });
  
  currentPage = 1; // Reset to first page when searching
  displayData();
}

// Initialize the main map view
function initMainMap() {
  const mymap = L.map('mapid').setView([40.7128, -74.0060], 10);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mymap);

  // Process all incidents with zip codes
  const incidentsWithZip = data.filter(incident => incident.zipcode);
  const markers = [];

  // Process in batches to avoid rate limiting
  const batchSize = 10;
  const processBatch = async (batch) => {
    for (const incident of batch) {
      try {
        const coords = await geocodeZipCode(incident.zipcode);
        if (coords) {
          const marker = L.marker(coords).addTo(mymap)
            .bindPopup(`<b>${incident.breed || 'Unknown breed'}</b><br>
                       Date: ${formatDate(incident.dateofbite)}<br>
                       Zip: ${incident.zipcode}`);
          markers.push(marker);
        }
      } catch (error) {
        console.error(`Error processing incident ${incident.unique_key}:`, error);
      }
    }
  };

  // Process all incidents in batches
  (async () => {
    for (let i = 0; i < incidentsWithZip.length; i += batchSize) {
      const batch = incidentsWithZip.slice(i, i + batchSize);
      await processBatch(batch);
    }
    
    // Fit map to all markers when done
    if (markers.length > 0) {
      const group = new L.featureGroup(markers);
      mymap.fitBounds(group.getBounds());
    }
  })();
}

// Call init when page loads
window.onload = function() {
  init();
  // If you have a main map element with id 'mapid', uncomment this:
  // initMainMap();
};const marker = L.marker([location.lat, location.lng]).addTo(mymap);
            marker.bindPopup(`<b>${location.name}</b><br>${location.description}`);
        });

        // Optional: Fit the map bounds to include all markers
        // This is useful if you don't know the exact center/zoom beforehand
        const group = new L.featureGroup(locations.map(location => L.marker([location.lat, location.lng])));
        mymap.fitBounds(group.getBounds());

}

function formatDate(dateString) {
  if (!dateString) return 'Unknown';
  let date = new Date(dateString);
  return date.toLocaleDateString();
}

function formatGender(gender) {
  switch(gender) {
    case 'M': return 'Male';
    case 'F': return 'Female';
    case 'U': return 'Unknown';
    default: return 'Unknown';
  }
}

function search() {
  let breedFilter = document.getElementById('breed').value.toLowerCase();
  let ageFilter = document.getElementById('age').value;
  let boroughFilter = document.getElementById('borough-filter').value;
  let genderFilter = document.getElementById('gender-filter').value;
  
  filteredData = data.filter(incident => {
    let breedMatch = !breedFilter || 
      (incident.breed && incident.breed.toLowerCase().includes(breedFilter));
    let ageMatch = !ageFilter || 
      (incident.age && incident.age.toString().includes(ageFilter));
    let boroughMatch = !boroughFilter || 
      incident.borough === boroughFilter;
    let genderMatch = !genderFilter || 
      incident.gender === genderFilter;
    
    return breedMatch && ageMatch && boroughMatch && genderMatch;
  });
  
  currentPage = 1; // Reset to first page when searching
  displayData();
}
