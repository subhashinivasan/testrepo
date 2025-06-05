const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const currentThemeKey = 'theme';
const darkThemeClass = 'dark-theme';

// Function to apply the saved theme or default to light
function applyTheme() {
    const savedTheme = localStorage.getItem(currentThemeKey);
    if (savedTheme === 'dark') {
        body.classList.add(darkThemeClass);
    } else {
        body.classList.remove(darkThemeClass); // Default to light
    }
}

// Function to toggle theme and save preference
function toggleTheme() {
    if (body.classList.contains(darkThemeClass)) {
        body.classList.remove(darkThemeClass);
        localStorage.setItem(currentThemeKey, 'light');
    } else {
        body.classList.add(darkThemeClass);
        localStorage.setItem(currentThemeKey, 'dark');
    }
}

// Event listener for the toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Apply theme on initial load
document.addEventListener('DOMContentLoaded', applyTheme);
