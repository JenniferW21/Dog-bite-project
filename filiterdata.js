let data;

async function init() {
  let link = "https://data.cityofnewyork.us/resource/rsgh-akpg.json";
  info = await fetch(link);
  data = await info.json();
  displayAllData(data); // Ensure data is displayed on load
}

function displayAllData(data) {
  let searchDiv = document.getElementById('search');
  searchDiv.innerHTML = '';
  
  data.forEach(incident => {
    let card = createCard(incident);
    searchDiv.appendChild(card);
  });
}

function createCard(incident) {
  let card = document.createElement('div');
  card.className = 'flip-card';
  
  let content = `
    <div class="card-content">
      <h3>Dog Bite Incident</h3>
      <p><strong>Date:</strong> ${formatDate(incident.dateofbite)}</p>
      <p><strong>Breed:</strong> ${incident.breed || 'Unknown'}</p>
      <p><strong>Age:</strong> ${incident.age || 'Unknown'}</p>
      <p><strong>Gender:</strong> ${formatGender(incident.gender)}</p>
      <p><strong>Spayed/Neutered:</strong> ${incident.spayneuter ? 'Yes' : 'No'}</p>
      <p><strong>Borough:</strong> ${incident.borough}</p>
      <p><strong>Zipcode:</strong> ${incident.zipcode || 'Unknown'}</p>
      <div class="map-container" style="width:100%;height:200px;margin-top:10px;">
        <div id="map-${incident.zipcode}" class="incident-map" style="width:100%;height:100%;"></div>
      </div>
    </div>
  `;
  
  card.innerHTML = content;
  
  // Initialize map after card is added to DOM
  setTimeout(() => {
    const mapId = `map-${incident.zipcode}`;
    const mapElement = document.getElementById(mapId);
    if (mapElement && !mapElement.dataset.mapInitialized) {
      initializeMap(mapId, incident);
      mapElement.dataset.mapInitialized = 'true';
    }
  }, 0);

  return card;
}

function initializeMap(mapId, incident) {
  // Use a static mapping for demonstration; in production, use a geocoding API
  const coordinates = getCoordinatesForZipcode(incident.zipcode);
  const map = L.map(mapId).setView([coordinates.lat, coordinates.lng], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.marker([coordinates.lat, coordinates.lng])
    .addTo(map)
    .bindPopup(`Dog Bite Incident<br>Date: ${formatDate(incident.dateofbite)}<br>Breed: ${incident.breed || 'Unknown'}`);
}

function getCoordinatesForZipcode(zipcode) {
  // This is a simplified version - you should use a proper geocoding service
  const coordinates = {
    '10001': { lat: 40.7505, lng: -73.9965 },
    '10002': { lat: 40.7174, lng: -73.9861 },
    '10003': { lat: 40.7317, lng: -73.9890 },
    '10004': { lat: 40.6892, lng: -74.0155 },
    '10005': { lat: 40.7064, lng: -74.0086 },
    '11201': { lat: 40.6944, lng: -73.9903 },
    '11211': { lat: 40.7127, lng: -73.9571 },
    '11217': { lat: 40.6782, lng: -73.9801 },
    '11238': { lat: 40.6847, lng: -73.9654 },
    '10451': { lat: 40.8245, lng: -73.9224 },
    '10452': { lat: 40.8373, lng: -73.9190 },
    '10453': { lat: 40.8505, lng: -73.9115 },
    '11101': { lat: 40.7505, lng: -73.9404 },
    '11102': { lat: 40.7720, lng: -73.9307 },
    '11354': { lat: 40.7644, lng: -73.8305 },
    '10301': { lat: 40.6431, lng: -74.0744 },
    '10302': { lat: 40.5884, lng: -74.1389 },
    '10304': { lat: 40.5195, lng: -74.1918 }
  };
  return coordinates[zipcode] || { lat: 40.7128, lng: -74.0060 }; // Default to NYC center
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
  
  let filteredData = data.filter(incident => {
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
  
  displayAllData(filteredData);
}

init();
