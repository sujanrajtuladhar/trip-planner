import requests
from collections import defaultdict
from typing import List, Dict, Optional
from server.config.config import Config

OPENWEATHER_API_URL = "http://api.openweathermap.org/data/2.5/forecast"


class WeatherService:
    def __init__(self, location: str):
        """Initialize the WeatherService with a specific location."""
        self.location = location

    def fetch_weather_data(self) -> Optional[Dict]:
        """
        Fetch raw forecast data from OpenWeatherMap.
        
        :return: Raw weather data as a dictionary if successful, otherwise None.
        """
        params = {
            "q": self.location,
            "appid": Config.OPENWEATHERMAP_API_KEY,
            "units": "metric"
        }

        try:
            response = requests.get(OPENWEATHER_API_URL, params=params)
            data = response.json()

            if response.status_code != 200:
                print(f"[Weather API] Error: {data.get('message', 'Unknown error')}")
                return None

            return data

        except Exception as e:
            print("[Weather API] Request failed:", e)
            return None

    def parse_daily_forecast(self, data: Dict) -> List[Dict]:
        """
        Parse and simplify forecast data to one entry per day, closest to 12:00 PM.
        
        :param data: Raw weather data from the API.
        :return: List of daily forecasts with temperature, weather description, humidity, and wind speed.
        """
        daily_data = defaultdict(list)

        for entry in data.get("list", []):
            date = entry["dt_txt"].split(" ")[0]
            daily_data[date].append(entry)

        forecast = []
        for date, entries in daily_data.items():
            # Select the forecast entry closest to midday (12:00 PM)
            midday_entry = min(entries, key=lambda x: abs(int(x["dt_txt"].split()[1].split(":")[0]) - 12))
            forecast.append({
                "date": date,
                "temperature": midday_entry["main"]["temp"],
                "weather": midday_entry["weather"][0]["description"],
                "humidity": midday_entry["main"]["humidity"],
                "wind_speed": midday_entry["wind"]["speed"]
            })

        return forecast

    def get_weather(self) -> Optional[List[Dict]]:
        """
        Public method to retrieve a simplified 5-day weather forecast for the specified location.
        
        :return: Simplified list of daily forecasts or None if fetch fails.
        """
        raw_data = self.fetch_weather_data()
        if not raw_data:
            return None

        return self.parse_daily_forecast(raw_data)
