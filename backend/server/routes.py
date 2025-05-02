from flask import jsonify, request
from openai import OpenAI
from server.config.config import Config
from server.services.image.handlers import ImageUploadService
from server.services.weather.openweather import WeatherService


# Initialize OpenAI client once
client = OpenAI(api_key=Config.OPENAI_API_KEY)


def register_routes(app, cache):
    @app.route('/api', methods=['GET'])
    def index():
        return jsonify({"message": "Welcome to the Trip Planner API!"}), 200

    @app.route('/api/upload', methods=['POST'])
    def upload_image():
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'No file provided'}), 400

        image_service = ImageUploadService(openai_client=client)
        result, error = image_service.process_image_upload(file)

        if error:
            return jsonify(error), 400
        return jsonify(result), 200

    @app.route('/api/weather', methods=['GET'])
    @cache.cached(timeout=3600, query_string=True)
    def weather():
        location = request.args.get('location')
        if not location:
            return jsonify({'error': "Missing 'location' query parameter"}), 400

        weather_service = WeatherService(location)
        weather_data = weather_service.get_weather()

        if not weather_data or 'error' in weather_data:
            return jsonify({'error': 'Unable to fetch weather data'}), 404

        return jsonify(weather_data), 200
