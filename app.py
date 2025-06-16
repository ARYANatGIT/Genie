from flask import Flask,render_template,request,jsonify
import requests
import matplotlib.pyplot as plt
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://genie-p5pn.onrender.com"])
os.makedirs('static/images',exist_ok=True)

OPENWEATHER_API_KEY = 'd1b4a3c19716117d446f6bd65c5690b8';


@app.route("/cart")
def cart():
    return render_template('cart.html')

@app.route("/delete-account")
def delete():
    return render_template('delete.html')

@app.route("/home-care")
def homecare():
    return render_template('homecare.html')

@app.route("/pet-care")
def petcare():
    return render_template('petcare.html')

@app.route("/salon-at-home")
def salonathome():
    return render_template('salonathome.html')

@app.route("/party-planners")
def partyplanners():
    return render_template('partyplanners.html')

@app.route("/house-repairs")
def houserepairs():
    return render_template('houserepairs.html')

@app.route("/complete-event-care")
def completeeventcare():
    return render_template('completeeventcare.html')
    
@app.route("/coming-soon")
def comingsoon():
    return render_template('coming_soon.html')

@app.route("/website-team")
def website_team():
    return render_template('website_team.html')

@app.route("/contact")
def contact():
    return render_template('contact.html')

@app.route('/signin-signup')
def login():
    return render_template('login.html')

@app.route("/")
def home():
    return render_template('index.html')

@app.route('/weather-info')
def weather():
    return render_template('weather.html')

@app.route('/api/weather-data',methods = ['POST'])
def get_weather_data():
    city = request.json.get('city')
    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&units=metric&appid={OPENWEATHER_API_KEY}"

    response = requests.get(url)
    if response.status_code != 200:
        return jsonify({ 'error': 'City not found' }), 404
    
    data = response.json()

    temps = {}
    rainfall = {}
    for entry in data['list']:
        date = entry['dt_txt'].split()[0]
        temps.setdefault(date, []).append(entry['main']['temp'])
        rain = entry.get('rain', {}).get('3h',0)
        rainfall[date] = rainfall.get(date, 0) + rain


    days = list(temps.keys())[:5]
    avg_temps = [sum(temps[day])/len(temps[day]) for day in days]
    rain_vals = [rainfall.get(day, 0) for day in days]

    temp_path = "static/images/temp.png"
    plt.figure()
    plt.plot(days, avg_temps,marker='o',color='orange')
    plt.title(f'Temperature in {city}')
    plt.xlabel('Day')
    plt.ylabel('Temperature (degrees Celcius)')
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(temp_path)
    plt.close()

    rain_path = "static/images/rain.png"
    plt.figure()
    plt.bar(days, rain_vals,color='skyblue')
    plt.title(f'Rainfall in {city}')
    plt.xlabel('Day')
    plt.ylabel('Rainfall (mm)')
    plt.grid(True)
    plt.tight_layout()
    plt.savefig(rain_path)
    plt.close()

    return jsonify ({
        'temp_url' : '/' + temp_path,
        'rain_url' : '/' + rain_path
    })

if __name__ == '__main__':
    app.run(debug=True)

