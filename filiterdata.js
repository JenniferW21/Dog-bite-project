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
    </div>
  `;
  
  card.innerHTML = content;
  return card;
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
