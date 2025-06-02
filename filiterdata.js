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
  if (!breed || breed.toLowerCase() === 'unknown') {
    // For unknown breeds, fetch a random dog image
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await response.json();
      return data.status === 'success' ? data.message : getDefaultImage();
    } catch (error) {
      console.error('Error fetching random dog image:', error);
      return getDefaultImage();
    }
  }
  
  // Clean up breed name for API
  const breedName = breed.toLowerCase()
    .replace(/\s+/g, '')  // Remove all spaces
    .replace(/[^a-z]/g, '') // Remove any non-alphabetic characters
    .split(' ')[0]; // Take first word of breed name
    
  // Expanded breed name mappings
  const breedMappings = {
    'pitbull': 'pit',
    'pit bull': 'pit',
    'german shepherd': 'germanshepherd',
    'german shepard': 'germanshepherd',
    'labrador': 'labrador',
    'lab': 'labrador',
    'retriever': 'retriever',
    'golden': 'retriever',
    'golden retriever': 'retriever',
    'bulldog': 'bulldog',
    'french bulldog': 'bulldog',
    'chihuahua': 'chihuahua',
    'beagle': 'beagle',
    'poodle': 'poodle',
    'rottweiler': 'rottweiler',
    'rott': 'rottweiler',
    'husky': 'husky',
    'siberian husky': 'husky',
    'boxer': 'boxer',
    'dachshund': 'dachshund',
    'doxie': 'dachshund',
    'mix': 'mix',
    'mixed': 'mix',
    'mutt': 'mix',
    'terrier': 'terrier',
    'yorkie': 'terrier',
    'yorkshire': 'terrier',
    'shih tzu': 'shihtzu',
    'shihtzu': 'shihtzu',
    'corgi': 'corgi',
    'pembroke': 'corgi',
    'cardigan': 'corgi',
    'collie': 'collie',
    'border collie': 'collie',
    'shepherd': 'germanshepherd',
    'great dane': 'greatdane',
    'greatdane': 'greatdane',
    'doberman': 'doberman',
    'doberman pinscher': 'doberman',
    'schnauzer': 'schnauzer',
    'miniature schnauzer': 'schnauzer',
    'bernese': 'bernese',
    'bernese mountain': 'bernese',
    'bernese mountain dog': 'bernese',
    'maltese': 'maltese',
    'bichon': 'bichon',
    'bichon frise': 'bichon',
    'shiba': 'shiba',
    'shiba inu': 'shiba',
    'akita': 'akita',
    'akita inu': 'akita',
    'samoyed': 'samoyed',
    'chow': 'chow',
    'chow chow': 'chow',
    'dalmatian': 'dalmatian',
    'saint bernard': 'stbernard',
    'st bernard': 'stbernard',
    'stbernard': 'stbernard',
    'newfoundland': 'newfoundland',
    'newfie': 'newfoundland',
    'mastiff': 'mastiff',
    'english mastiff': 'mastiff',
    'bullmastiff': 'mastiff',
    'bull mastiff': 'mastiff'
  };

  // Use mapped breed name if available, otherwise use cleaned breed name
  const apiBreedName = breedMappings[breedName] || breedName;
  
  try {
    // First try with the mapped breed name
    const response = await fetch(`https://dog.ceo/api/breed/${apiBreedName}/images/random`);
    const data = await response.json();
    
    if (data.status === 'success' && data.message) {
      return data.message;
    }
    
    // If first attempt fails, try with original breed name
    if (apiBreedName !== breedName) {
      const fallbackResponse = await fetch(`https://dog.ceo/api/breed/${breedName}/images/random`);
      const fallbackData = await fallbackResponse.json();
      if (fallbackData.status === 'success' && fallbackData.message) {
        return fallbackData.message;
      }
    }
    
    // If both attempts fail, try to get a random dog image
    const randomResponse = await fetch('https://dog.ceo/api/breeds/image/random');
    const randomData = await randomResponse.json();
    return randomData.status === 'success' ? randomData.message : getDefaultImage();
    
  } catch (error) {
    console.error('Error fetching dog image for breed:', breed, error);
    return getDefaultImage();
  }
}

function getDefaultImage() {
  // Return a default image URL for when all attempts fail
  return 'https://images.dog.ceo/breeds/mix/n02111889_1030.jpg';
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
