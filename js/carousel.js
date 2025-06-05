// Carousel functionality
let currentImageIndex = 0;
let imageCache = [];
const CACHE_SIZE = 5;

async function fetchRandomDogImage() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json();
    if (data.status === 'success') {
      return data.message;
    }
    throw new Error('Failed to fetch dog image');
  } catch (error) {
    console.error('Error fetching dog image:', error);
    return null;
  }
}

async function preloadImages() {
  while (imageCache.length < CACHE_SIZE) {
    const imageUrl = await fetchRandomDogImage();
    if (imageUrl) {
      imageCache.push(imageUrl);
    }
  }
}

async function updateCarouselImage() {
  const carouselImage = document.getElementById('carousel-image');
  if (!carouselImage) return;

  if (imageCache.length === 0) {
    await preloadImages();
  }

  if (imageCache.length > 0) {
    carouselImage.src = imageCache[currentImageIndex];
    // Preload next image
    if (imageCache.length < CACHE_SIZE) {
      preloadImages();
    }
  }
}

async function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % imageCache.length;
  await updateCarouselImage();
}

async function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + imageCache.length) % imageCache.length;
  await updateCarouselImage();
}

// Initialize carousel when the page loads
async function initCarousel() {
  await preloadImages();
  await updateCarouselImage();
  
  // Set up automatic image rotation
  setInterval(async () => {
    await nextImage();
  }, 5000); // Change image every 5 seconds
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initCarousel); 