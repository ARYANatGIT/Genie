let cityToConfirm = '';

function getLocation() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const apiKey = "d1b4a3c19716117d446f6bd65c5690b8";

            const response = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`);
            const data = await response.json();

            const city = data[0]?.name;
            if(city){
                cityToConfirm = city;
                document.getElementById("confirmText").innerText = `Is the city you are currently in ${city}?`;
                document.getElementById("confirmModal").style.display = "block";
            }else{
                fallbackToManual();
            }
        }, () => {
            fallbackToManual();
        });
    } else{
        fallbackToManual();
    }
}

function confirmYes(){
    document.getElementById("confirmModal").style.display="none";
    fetchWeatherData(cityToConfirm);
}

function confirmNo(){
    document.getElementById("confirmModal").style.display="none";
    fallbackToManual();
}

function fallbackToManual(){
    document.getElementById("manualCity").style.display="block";
}

function submitCity(){
    const city = document.getElementById("cityInput").value;
    fetchWeatherData(city);
}

function fetchWeatherData(city){
    fetch ('https://genie-p5pn.onrender.com/api/weather-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById('tempGraph').src = data.temp_url + '?v=' + new Date().getTime();
        document.getElementById('rainGraph').src = data.rain_url + '?v=' + new Date().getTime();
    })
    .catch (err => {
        alert("Failed to load weather data.");
        console.log(err);
    });
}