function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}

// Theme toggle functionality
function toggleTheme() {
  let body = document.body;
  let themeToggle = document.getElementById('theme-toggle');
  let currentTheme = body.getAttribute('data-theme') || 'light';
  let newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Update theme
  body.setAttribute('data-theme', newTheme);
  
  // Update button text and icon
  let icon = themeToggle.querySelector('i');
  if (newTheme === 'dark') {
    icon.className = 'fas fa-moon';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark';
  } else {
    icon.className = 'fas fa-sun';
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light';
  }
  
  // Save preference to localStorage
  localStorage.setItem('theme', newTheme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  let savedTheme = localStorage.getItem('theme') || 'light';
  let body = document.body;
  let themeToggle = document.getElementById('theme-toggle');
  
  body.setAttribute('data-theme', savedTheme);
  
  // Set initial button state
  if (savedTheme === 'dark') {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark';
  } else {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light';
  }
});
