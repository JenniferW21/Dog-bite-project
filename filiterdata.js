let data;

async function init() {
  let link = "https://data.cityofnewyork.us/resource/rsgh-akpg.json";
  info = await fetch(link);
  data = await info.json();
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
  
  let front = `
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
  `;
  
  card.innerHTML = front;
  return card;

  let back = 
  
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
            const marker = L.marker([location.lat, location.lng]).addTo(mymap);
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
