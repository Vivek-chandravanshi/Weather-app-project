const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
/*
// const API_KEY = '134d507e22e44dac96d70819242106';
async function fetchWeatherDetails(){
    try{
        let city = 'goa';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        console.log('weather data : ', data);
    }catch(err){
        console.log('err found', err);
    }
}
// fetchWeatherDetails();

async function fetchWeather(){
    try{
        let latitude = 17.33;
        let longitude = 12.33;
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);

        const data = await response.json();
        console.log('data ', data);
    }catch(err){
        console.log('error found', err);
    }
}
// fetchWeather();*/

const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
// const userContainer = document.querySelector('[data-weather-container]');
const formContainer = document.querySelector('[data-searchForm]');
const loadingScreen  = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-info-container');
const grantAccessContainer = document.querySelector('.grant-loc-container');

let currentTab = userTab;
currentTab.classList.add('current-tab');

userTab.addEventListener('click', ()=>{
    switchTab(userTab);
});
searchTab.addEventListener('click', ()=>{
    switchTab(searchTab);
});

getFromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove('current-tab');
        currentTab=clickedTab;
        currentTab.classList.add('current-tab');
        if(!formContainer.classList.contains('active')){
            userInfoContainer.classList.remove('active');
            grantAccessContainer.classList.remove("active");
            formContainer.classList.add('active');
        }else{
            formContainer.classList.remove('active');
            // userInfoContainer.classList.add('active');
            getFromSessionStorage();
        }
    }
}

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if(!localCoordinates){
        grantAccessContainer.classList.add('active');
    }else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove('active');
    loadingScreen.classList.add('active');

    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove('active');
        /////
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector('[data-cityName]');
    const countryIcon = document.querySelector('[data-countryIcon]');
    const weatherDesc = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temperature]');
    const windspeed = document.querySelector('[data-windSpeed]');
    const humidity = document.querySelector('[data-Humidity]');
    const clouds = document.querySelector('[data-Clouds]');

    cityName.innerText =  weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.main;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerText = `${weatherInfo?.clouds?.all}%`;
}

const grantAccessBtn = document.querySelector('.btn');
grantAccessBtn.addEventListener('click', getLocation);
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        ///alert
    }
}
function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude,
    }

    sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const searchForm = document.querySelector('[data-searchForm]');
const searchInput = document.querySelector('[data-searchInput]');
searchForm.addEventListener('click', (e)=>{
    e.preventDefault();
    if(searchInput.value ==="") return;
    fetchSearchWeatherInfo(searchInput.value);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');

    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await res.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }catch{
        console.log(err);
    }
}