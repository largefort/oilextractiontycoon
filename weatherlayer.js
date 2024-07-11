  // Function to handle weather updates
            function updateWeatherImpact(weatherCondition) {
                weatherImpact = weatherConditions[weatherCondition] || 1.0;
                updateResourceCounters();
            }

            // Fetch current weather for a given location (latitude and longitude)
            function fetchWeather(lat, lon) {
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                    .then(response => response.json())
                    .then(data => {
                        var condition = data.weather[0].main.toLowerCase();
                        weather = condition.charAt(0).toUpperCase() + condition.slice(1);
                        updateWeatherImpact(condition);
                        updateWeather();
                    })
                    .catch(error => {
                        console.error('Error fetching weather data:', error);
                    });
            }