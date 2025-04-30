import requests
from server.config import Config
from collections import defaultdict


def get_weather(location):
    """Fetches 5-day daily weather summaries for the provided location."""
    api_key = Config.OPENWEATHERMAP_API_KEY
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={location}&appid={api_key}&units=metric"

    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code != 200:
            print(f"Error fetching weather: {data.get('message', 'Unknown error')}")
            return None

        daily_data = defaultdict(list)

        for entry in data["list"]:
            date_str = entry["dt_txt"].split(" ")[0]  # 'YYYY-MM-DD'
            daily_data[date_str].append(entry)

        forecast = []
        for date, entries in daily_data.items():
            # Pick the entry closest to 12:00
            midday_entry = min(entries, key=lambda x: abs(int(x["dt_txt"].split()[1].split(":")[0]) - 12))

            forecast.append({
                "date": date,
                "temperature": midday_entry["main"]["temp"],
                "weather": midday_entry["weather"][0]["description"],
                "humidity": midday_entry["main"]["humidity"],
                "wind_speed": midday_entry["wind"]["speed"]
            })

        return forecast

    except Exception as e:
        print("Weather API Error:", e)
        return None
