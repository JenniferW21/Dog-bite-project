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

async function getDogImage(breed) {
  if (!breed) return null;
  
  // Clean up breed name for API
  const breedName = breed.toLowerCase().split(' ')[0]; // Take first word of breed name
  try {
    const response = await fetch(`https://dog.ceo/api/breed/${breedName}/images/random`);
    const data = await response.json();
    return data.message; // Returns the image URL
  } catch (error) {
    console.error('Error fetching dog image:', error);
    return null;
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
        <div class="dog-image-container" id="dog-image-${incident.unique_key || incident.zipcode}">
          <div class="loading">Loading dog image...</div>
        </div>
      </div>
    </div>
  `;
  
  card.innerHTML = front;
  
  // Load dog image after card is added to DOM
  setTimeout(async () => {
    const imageContainer = card.querySelector(`#dog-image-${incident.unique_key || incident.zipcode}`);
    if (imageContainer) {
      try {
        const imageUrl = await getDogImage(incident.breed);
        if (imageUrl) {
          imageContainer.innerHTML = `
            <img src="${imageUrl}" alt="${incident.breed || 'Unknown breed'} dog" 
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
            <div class="breed-info">${incident.breed || 'Unknown breed'}</div>
          `;
        } else {
          imageContainer.innerHTML = `
            <div class="no-image">
              <i class="fas fa-dog"></i>
              <p>Image not available for ${incident.breed || 'this breed'}</p>
            </div>
          `;
        }
      } catch (error) {
        console.error('Error loading dog image:', error);
        imageContainer.innerHTML = `
          <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>Error loading image</p>
          </div>
        `;
      }
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
