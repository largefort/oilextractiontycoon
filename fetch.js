 // Fetch weather every 60 seconds
            setInterval(() => {
                fetchWeather();
            }, 60000);

            // Initial fetch weather
            fetchWeather();
