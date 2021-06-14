const dateEl = document.querySelector('#date')
const currentWeatherEl = document.querySelector('#currentWeather')
const currentTemperature = document.querySelector('#temp')
const currentWind = document.querySelector('#wind')
const currentHumidity = document.querySelector('#humidity')
const currentUV = document.querySelector('#uv-index')
const weatherForecastDiv = document.querySelector('#fiveDayForecast')
const inputValue = document.querySelector('#inputCity')
const searchButton = document.querySelector('#searchBtn')

const API_KEY = '81e91fb82b9682435a7015e6eb108987'

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

const time = new Date();
const month = time.getMonth();
const date = time.getDate();
const day = time.getDay();
const year = time.getFullYear();

dateEl.innerHTML = days[day] + ' ' + months[month] + ' ' + date + ' ' + ' '  + year

function getWeather(){
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success)

        let{latitude, longitude} = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json().then(data => {
            console.log(data)
            showWeatherData(data);
        }))
    })
}
getWeather();

function showWeatherData(data){
    let {humidity, wind_speed, uvi, temp} = data.current;

    currentWeatherEl.innerHTML = 
    `
    <div>Temperature: ${temp}&#176</div>
    <div>Humidity: ${humidity}%</div>
    <div>Wind: ${wind_speed}mph</div>
    <div>UV Index: ${uvi}</div>`;

    let fiveDayForecast
    data.daily.forEach((day, index) => {
        if(index < 5 ){
            fiveDayForecast += `
            <div class="five-day-items">
                <div class="forecast-item">
                    <h4 class="date">${window.moment(day.dt*1000).format('ddd')}</h4>
                    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                    <div class="card-line"></div>
                    <p class="temp">Temp: ${day.temp.day}&#176</p>
                    <p class="wind">Wind: ${day.wind_speed}mph</p>
                    <p class="humidity">Humidity: ${day.humidity}</p>
                </div>
            </div>
            `   
        }
    })
    
    weatherForecastDiv.innerHTML = fiveDayForecast;
    
}