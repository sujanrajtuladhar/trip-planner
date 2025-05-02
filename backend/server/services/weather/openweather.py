import requests
from collections import defaultdict
from typing import List, Dict, Optional
from server.config.config import Config

OPENWEATHER_API_URL = "http://api.openweathermap.org/data/2.5/forecast"


class WeatherService:
    def __init__(self, location: str):
        self.location = location

    def fetch_weather_data(self) -> Optional[Dict]:
        """Fetch raw 5-day / 3-hour interval forecast data from OpenWeatherMap."""
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
        """Parse and simplify forecast to 1 entry per day (closest to 12:00)."""
        daily_data = defaultdict(list)

        for entry in data.get("list", []):
            date = entry["dt_txt"].split(" ")[0]
            daily_data[date].append(entry)

        forecast = []
        for date, entries in daily_data.items():
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
        """Public method to get simplified 5-day forecast for a location."""
        raw_data = self.fetch_weather_data()
        if not raw_data:
            return None

        return self.parse_daily_forecast(raw_data)
