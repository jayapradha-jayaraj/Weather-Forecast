// Wait for the DOM to be ready
$(document).ready(function () {
    debugger;
    $("#search-form").on("submit", function (event) {
      event.preventDefault();
      var apiURL = "https://api.openweathermap.org/data/2.5/forecast?";
      var key = "245118ae7b6f36d46815fc40037a8563";
      var city ="";
      if(city!==""){
        city=$('#search-input').val();
      }else if(city!==""){
        city="London";
      } 
      var queryURL = apiURL + "q=" + city + "&appid=" + key;
  
      // Fetch weather data
      fetchWeatherData(queryURL);
    });
  
    // Function to fetch weather data
    function fetchWeatherData(queryURL) {
      fetch(queryURL)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(function (data) {
          // Display current weather
          displayCurrentWeather(data);
  
          // Display 5-day forecast
          displayForecast(data);
  
          // Add city to search history
          addToSearchHistory(data.city.name);
        })
        .catch(function (error) {
          console.log("Error:", error);
        });
    }
  
    // Function to display current weather
    function displayCurrentWeather(data) {
      var currentDate = dayjs().format('DD-MM-YYYY');
      var weatherDetails = data.list[0].main;
      var weatherIcon = data.list[0].weather[0].icon;
  
      // Display current weather details
      $("#today").html(`
        <h2>${data.city.name}</h2>
        <h3>${currentDate}</h3>
        <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
        <p>Temperature: ${weatherDetails.temp} °C</p>
        <p>Humidity: ${weatherDetails.humidity}%</p>
        <p>Wind Speed: ${data.list[0].wind.speed} m/s</p>
      `);
    }
  
    // Function to display 5-day forecast
    function displayForecast(data) {
      var forecastSection = $("#forecast");
      forecastSection.empty();
  
      for (var i = 1; i < data.list.length; i += 8) {
        var forecastDate = dayjs(data.list[i].dt_txt).format('DD-MM-YYYY');
        var forecastDetails = data.list[i].main;
        var forecastIcon = data.list[i].weather[0].icon;
  
        // Display forecast details for each day
        forecastSection.append(`
          <div class="col-md-2">
            <h3>${forecastDate}</h3>
            <img src="https://openweathermap.org/img/w/${forecastIcon}.png" alt="Weather Icon">
            <p>Temperature: ${forecastDetails.temp} °C</p>
            <p>Humidity: ${forecastDetails.humidity}%</p>
          </div>
        `);
      }
    }
  
    // Function to add city to search history
    function addToSearchHistory(city) {
      var historyList = $("#history");
  
      // Check if the city is already in the search history
      if (!historyList.find(`[data-city="${city}"]`).length) {
        historyList.prepend(`
          <button class="list-group-item" data-city="${city}">${city}</button>
        `);
      }
    }
  
    // Event handler for clicking on a city in the search history
    $("#history").on("click", "button", function () {
      var selectedCity = $(this).data("city");
      var queryURL = apiURL + "q=" + selectedCity + "&appid=" + key;
  
      // Fetch weather data for the selected city
      fetchWeatherData(queryURL);
    });
  });
  