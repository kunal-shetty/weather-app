document.addEventListener('DOMContentLoaded', () => {
    const app = document.querySelector('.weather-app');
    setTimeout(() => {
        app.classList.remove('app-loading');
        app.classList.add('app-loaded');
        createParticles();
        fetchWeatherData('Mumbai');
    }, 300);
});

// DOM Elements
const weatherResult = document.getElementById('weather-result');
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const loading = document.querySelector('.loading');
const errorMessage = document.getElementById('error-message');

// Event Listeners
searchBtn.addEventListener('click', fetchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchWeather();
});

// Weather Functions
function fetchWeather() {
    const cityName = cityInput.value.trim();
    if (cityName === '') {
        showError('Please enter a city name!');
        return;
    }
    
    // UI States
    loading.style.display = 'block';
    weatherResult.classList.remove('active');
    errorMessage.classList.remove('active');
    errorMessage.style.display = 'none'; // Hide error message on new search
    
    fetchWeatherData(cityName);
}

async function fetchWeatherData(city) {
    const url = `/.netlify/functions/getWeather?city=${city}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('City not found');
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        showError(error.message);  // Use showError instead of alert
    } finally {
        loading.style.display = 'none'; // Always hide loading after fetch
    }
}

function displayWeatherData(data) {
    // Update weather data
    document.getElementById('city-name').innerText = data.name;
    document.getElementById('temperature').innerText = Math.round(data.main.temp);
    document.getElementById('weather-condition').innerText = 
        data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    document.getElementById('feels-like').innerText = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('humidity').innerText = `${data.main.humidity}%`;
    document.getElementById('wind-speed').innerText = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    document.getElementById('pressure').innerText = `${data.main.pressure} hPa`;
    
    // Update weather icon
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    document.getElementById('weather-icon').src = iconUrl;
    
    // Change background based on weather
    updateBackground(data.weather[0].main, data.main.temp);
    
    // Show weather display with animation
    setTimeout(() => {
        weatherResult.style.display = 'block';
        weatherResult.classList.add('active');
    }, 50);
}

function showError(message) {
    loading.style.display = 'none';           // Hide loading when showing error
    weatherResult.style.display = 'none';     // Hide weather result on error
    document.getElementById('error-text').innerText = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.classList.add('active');
    }, 50);
}

function updateBackground(weatherCondition, temp) {
    const body = document.body;
    let gradient;
    
    // Base gradient on weather condition
    switch(weatherCondition.toLowerCase()) {
        case 'clear':
            gradient = 'linear-gradient(45deg, #1e3c72 0%, #2a5298 100%)';
            break;
        case 'clouds':
            gradient = 'linear-gradient(45deg, #4b6cb7 0%, #182848 100%)';
            break;
        case 'rain':
            gradient = 'linear-gradient(45deg, #0f2027 0%, #203a43 50%, #2c5364 100%)';
            break;
        case 'thunderstorm':
            gradient = 'linear-gradient(45deg, #000000 0%, #434343 100%)';
            break;
        case 'snow':
            gradient = 'linear-gradient(45deg, #e6dada 0%, #274046 100%)';
            break;
        case 'mist':
        case 'fog':
        case 'haze':
            gradient = 'linear-gradient(45deg, #606c88 0%, #3f4c6b 100%)';
            break;
        default:
            // Fallback based on temperature
            if (temp > 30) {
                gradient = 'linear-gradient(45deg, #ff4e50 0%, #f9d423 100%)';
            } else if (temp > 20) {
                gradient = 'linear-gradient(45deg, #56ccf2 0%, #2f80ed 100%)';
            } else if (temp > 10) {
                gradient = 'linear-gradient(45deg, #a8e063 0%, #56ab2f 100%)';
            } else {
                gradient = 'linear-gradient(45deg, #2193b0 0%, #6dd5ed 100%)';
            }
    }
    
    body.style.background = gradient;
}

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        hour: '2-digit', 
        minute: '2-digit' 
    };
    document.getElementById('time-date').textContent = 
        now.toLocaleDateString('en-US', options);
}

// Particle background effect
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const opacity = Math.random() * 0.5 + 0.1;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Apply styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = opacity;
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        
        particlesContainer.appendChild(particle);
    }
}
