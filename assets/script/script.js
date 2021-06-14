const dateEl = document.querySelector('#date')
const currentTemperature = document.querySelector('#temp')
const weatherForecastDiv = document.querySelector('#fiveDayForecast')
const inputValue = document.querySelector('#inputCity')
const searchButton = document.querySelector('#searchBtn')

// API key for One Call API
const API_KEY = '81e91fb82b9682435a7015e6eb108987'
// Array of days
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
// Array of Month
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
// Moment JS get time constants
const time = new Date();
const month = time.getMonth();
const date = time.getDate();
const day = time.getDay();
const year = time.getFullYear();
var now = moment();

let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];


// const & var for html elements
const cityName = document.querySelector('#cityname')
const weatherIcon = document.querySelector('#weather-icon')
const temp = document.querySelector('#temp')
const humid = document.querySelector('#humid')
const wind = document.querySelector('#wind')
const uv = document.querySelector('#uvindex')
var historyEl = document.querySelector('#history-items')
var historyBtn = document.querySelector('#historyBtn')
const formEl = document.querySelector('#searchForm')
// counter used to index over newly created history buttons
var counter = 0

// click on search button executes showMain function which shows current weather for the city you searched
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
        // fill in HTML elements with retrieved data from API
        cityName.innerHTML = nameValue
        dateEl.innerHTML = days[day] + ' ' + months[month] + ' ' + date + ' ' + ' '  + year
        temp.innerHTML = 'Temperature: ' + tempValue + '&#176'
        humid.innerHTML = 'Humidity: ' + humidValue
        wind.innerHTML = windValue + 'mph'
        weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherIconValue}@2x.png" class="weather-icon" alt="">`        
        // get weather from second API 'Current Weather Data'
        function getWeather(){
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json().then(data => {
                showWeatherData(data);
            }))
        }
        getWeather();
        // create weather divs from API day data
        function showWeatherData(data){
            // getting UV index from One call sending back up to main content area
            let {uvi} = data.current    
            uvValue = `${uvi}`
            // conditional statement that prints out 5 cards with the API data for the next 5 days weather forecast
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
                    // conditional statements for uv number to determine wether a day is favorable conditions or not
                    if(uvValue <= 2){
                        uv.classList.add('favorable')
                    } else if (uvValue >= 5){}
                    uv.classList.add('moderate')
                }
            })
        weatherForecastDiv.innerHTML = fiveDayForecast;
        }
    })
    // creates buttons and saves data to local storage based on user input
    function createHistoryBtn(){
        if(inputValue.value){
            events.push({
                time: now,
                city: inputValue.value
            });
        }
    
        localStorage.setItem('events', JSON.stringify(events));
        historyBtnEl = document.createElement('button')
        historyBtnEl.setAttribute('id', 'historyBtn')
        historyBtnEl.classList.add('historyBtn')
        historyBtnEl.innerText = events[counter].city
        counter ++
        historyBtnEl.addEventListener('click', showMainBtn)
        historyEl.appendChild(historyBtnEl)

        console.log(events.length)
        
    }

    createHistoryBtn()
    formEl.reset();
    // deletes local storage and allows to clear history
    const deleteBtn = document.querySelector('#deleteBtn')
    deleteBtn.addEventListener('click', deleteLocalStorage)
    
    function deleteLocalStorage() {
        localStorage.removeItem('events');
        location.reload();
    }
    
}


// direct copy of the first function but this one allows you to load content based on the innerText of the history button that was created
function showMainBtn(event){
    const extract = event.target
    console.log(historyBtnEl.innerText)
    event.preventDefault()
    fetch('http://api.openweathermap.org/data/2.5/weather?q='+extract.innerText+'&units=imperial&appid=81e91fb82b9682435a7015e6eb108987')
    .then(Response => Response.json())
    .then(data => {
        var longitude = data['coord']['lon']
        var latitude = data['coord']['lat']
        var nameValue = data['name']
        var tempValue = data['main']['temp']
        var humidValue = data['main']['humidity']
        var windValue = data['wind']['speed']
        var weatherIconValue = data['weather'][0]['icon']

        cityName.innerHTML = nameValue
        dateEl.innerHTML = days[day] + ' ' + months[month] + ' ' + date + ' ' + ' '  + year
        temp.innerHTML = 'Temperature: ' + tempValue + '&#176'
        humid.innerHTML = 'Humidity: ' + humidValue
        wind.innerHTML = 'Wind Speed: ' + windValue + 'mph'
        weatherIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherIconValue}@2x.png" class="weather-icon" alt="">`

        console.log(data)
        function getWeather(){
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json().then(data => {
                console.log(data)
                showWeatherData(data);
            }))
        }
        getWeather();
        // create weather divs from API day data
        function showWeatherData(data){
            let fiveDayForecast = ""
            data.daily.forEach((day, index) => {
                if(index < 5){
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
    })
}