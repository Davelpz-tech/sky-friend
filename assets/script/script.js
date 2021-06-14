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
var now = moment();

let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

var counter = 0

const cityName = document.querySelector('#cityname')
const weatherIcon = document.querySelector('#weather-icon')
const temp = document.querySelector('#temp')
const humid = document.querySelector('#humid')
const wind = document.querySelector('#wind')
const uv = document.querySelector('#uvindex')
var historyEl = document.querySelector('#history-items')
var historyBtn = document.querySelector('#historyBtn')
const formEl = document.querySelector('#searchForm')

searchButton.addEventListener('click', showMain)

function showMain(event){
    event.preventDefault()
    fetch('http://api.openweathermap.org/data/2.5/weather?q='+inputValue.value+'&units=imperial&appid=81e91fb82b9682435a7015e6eb108987')
    .then(Response => Response.json())
    .then(data => {
        var longitude = data['coord']['lon']
        var latitude = data['coord']['lat']
        var nameValue = data['name']
        var tempValue = data['main']['temp']
        var humidValue = data['main']['humidity']
        var windValue = data['wind']['speed']
        var weatherIconValue = data['weather'][0]['icon']

        console.log(weatherIconValue)


        cityName.innerHTML = nameValue
        dateEl.innerHTML = days[day] + ' ' + months[month] + ' ' + date + ' ' + ' '  + year
        temp.innerHTML = 'Temperature: ' + tempValue + '&#176'
        humid.innerHTML = 'Humidity: ' + humidValue
        wind.innerHTML = windValue + 'mph'
        weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherIconValue}@2x.png" class="weather-icon" alt="">`
        
        console.log(data)
        // get weather from second API
        function getWeather(){
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json().then(data => {
                console.log(data)
                showWeatherData(data);
            }))
        }
        getWeather();
        // create weather divs from API day data
        function showWeatherData(data){
            let {uvi} = data.current
            
            uvValue = `${uvi}`
            
            let fiveDayForecast = ""
            data.daily.forEach((day, index) => {
                if(index < 5){
                    fiveDayForecast += 
                    `<div class="five-day-items">
                        <div class="forecast-item">
                            <h4 class="date">${window.moment(day.dt*1000).format('ddd')}</h4>
                            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                            <div class="card-line"></div>
                            <p class="temp">Temp: ${day.temp.day}&#176</p>
                            <p class="wind">Wind: ${day.wind_speed}mph</p>
                            <p class="humidity">Humidity: ${day.humidity}</p>
                        </div>
                    </div>` 
                    uv.innerHTML = `<div id="uvindex" class="uvindex">UV Index: ${uvi}</div>`

                    if(uvValue = 2){
                        uv.classList.add('favorable')
                    } else if (uvValue >= 5){}
                    uv.classList.add('moderate')
                }
            })
        weatherForecastDiv.innerHTML = fiveDayForecast;
        }
    })

