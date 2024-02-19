let yourWeather = document.querySelector("[data-yourWeather]");
let searchWeather = document.querySelector("[data-searchWeather]");

let grantAccess = document.querySelector("[data-grantAccess]");
let weather = document.querySelector("[data-weather]");
let searchForm  = document.querySelector("[data-searchForm");
let searchFormContainer = document.querySelector("[data-searchFormContainer]");
let loading = document.querySelector("[data-loading]");
let accessBtn = document.querySelector(".access_btn");

let currentTab = yourWeather;
currentTab.classList.add("active");
const API_KEY="50bca48ef7813ae4c0176669122d4058";

yourWeather.addEventListener("click" , ()=>{
    let id = yourWeather.getAttribute("id");
switchTab(yourWeather , id);
});

searchWeather.addEventListener("click" , ()=>{
    let id = searchWeather.getAttribute("id");
    switchTab(searchWeather , id);
});


function switchTab(clickedTab , id)
{
    console.log(clickedTab);
    console.log(id);
    if(currentTab != clickedTab)
    {
        currentTab.classList.remove("active");
        currentTab = clickedTab;
        currentTab.classList.add("active");
    }
    if(id=="yourWeather")
    {
        getFromSessionStorage();
        searchFormContainer.classList.remove("active");
        weather.classList.remove("active");


    }
    if(id=="searchWeather")
    {
        searchFormContainer.classList.add("active");
        grantAccess.classList.remove("active");
        weather.classList.remove("active");
    }
}


function getFromSessionStorage()
{
    let lat = sessionStorage.getItem("latitude");
    let long = sessionStorage.getItem("longitude");

    console.log(lat);
    

    if(!lat)
    {
        // there are no coordinates in SessionStorage
        grantAccess.classList.add("active");
    }
    else{
        fetchDataFromCoordinates(lat, long);
    }
}

accessBtn.addEventListener("click" , ()=>{

    grantAccess.classList.remove("active");
    getCoordinates();
});

function getCoordinates()
{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          sessionStorage.setItem("latitude" , `${latitude}`);
          sessionStorage.setItem("longitude" , `${longitude}`);
        });
      } 
      else 
      {
        console.log("Geolocation is not supported by this browser.");
      }
}

async function fetchDataFromCoordinates(lat , long)
{
    loading.classList.add("active");
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}`)
    let data = await response.json();

    loading.classList.remove("active");
    renderData(data);
}

function renderData(data)
{

    console.log("Inside Render Data");

    let locationName = document.querySelector("[data-locationName]");
    let locationFlag = document.querySelector("[data-locationFlag]");
    let weatherDesc = document.querySelector(".weather_desc");
    let weatherIconImg = document.querySelector("[data-weatherIconImg]");
    let weatherTemp = document.querySelector(".weather_temp");
    let windspeed = document.querySelector("[data-windspeed]");
    let humidity = document.querySelector("[data-humidity]");
    let clouds = document.querySelector("[data-clouds]");

    locationName.innerText = data?.name;
    weatherDesc.innerText = data?.weather?.[0]?.description;
    let temp = data?.main?.temp - 273;
    weatherTemp.innerText = `${temp.toFixed(2)} C`;

    humidity.innerText = `${data?.main?.humidity} %`;
    clouds.innerText = `${data?.clouds?.all} %`;
    windspeed.innerText = `${data?.wind?.speed}`;

    locationFlag.src=`https://www.worldometers.info//img/flags/small/tn_${data?.sys?.country?.toLowerCase()}-flag.gif`
weatherIconImg.src= `https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png`;

weather.classList.add("active");
grantAccess.classList.remove("active");
searchFormContainer.classList.remove("active");
}

let searchInput = document.querySelector(".search_input");

searchForm.addEventListener("submit" , (e) =>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName == "")
    return;
    else
    {
        fetchDataFromCity(cityName);
    }
});

async function fetchDataFromCity(cityName)
{

    loading.classList.add("active");
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
    let data = await response.json();
    loading.classList.remove("active");
    renderData(data);
}

