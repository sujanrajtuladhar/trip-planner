import os

from flask import jsonify, request
from flask_caching import Cache
from openai import OpenAI

from server.utils.image_handlers import handle_image_upload, generate_file_url, create_image_upload_record
from server.config import Config
from server.utils.gpt import generate_tripadvisor_label, suggest_location_with_gpt
from server.utils.weather import get_weather
from server.utils.google_cloud_vision import get_top_labels


client = OpenAI(api_key=Config.OPENAI_API_KEY)


def register_routes(app, cache):
    """
    Register all routes with the Flask app.

    Args:
        app: Flask app instance.
        cache: Flask-Caching instance for caching routes.

    Routes:
        /api [GET]:
            Returns a welcome message for the Trip Planner API.

        /api/upload [POST]:
            Handles image upload and scene detection.
            Returns:
                JSON response with the result of the upload, scene detection, 
                suggested locations, and any errors encountered.

        /api/weather [GET]:
            Fetches weather data for a given location.
            Returns:
                JSON response with the weather data or error if location is missing
                or if there is an issue fetching the weather data.
    """
    
    @app.route('/api', methods=['GET'])
    def index():
        return jsonify({"message": "Welcome to the Trip Planner API!"}), 200
    
    @app.route('/api/upload', methods=['POST'])
    def upload_image():
        """
        Handle image upload and scene detection.
        
        Returns:
            JSON response with the result of the upload, including the filename, 
            scene type, file URL, suggested locations, and a success message. 
            Returns an error message if the upload or scene detection fails.
        """
        # Step 1: Handle image upload
        file, error = handle_image_upload()
        if error:
            return jsonify({'error': error}), 400

        # Step 2: Detect scene type
        labels = get_top_labels(file['filepath'])
        tripadvisor_label = generate_tripadvisor_label(client, labels)

        # Step 3: Suggest a possible location using GPT-4
        suggested_location = suggest_location_with_gpt(client, tripadvisor_label)

        # Step 4: Generate the file URL
        file_url = generate_file_url(file['filename'])

        # Step 5: Create ImageUpload record in the database
        create_image_upload_record(file['filename'], tripadvisor_label, file_url)

        return jsonify({
            'filename': file['filename'],
            'scene_type': tripadvisor_label,
            'file_url': file_url,
            'suggested_locations': suggested_location,
            'message': 'Uploaded and scene detected ✅'
        })
    
    @app.route('/api/weather', methods=['GET'])
    @cache.cached(timeout=3600, query_string=True)  # Cache based on the query string (location)
    def weather():
        """
        Fetch weather data for a given location.
        
        Returns:
            JSON response with the weather data if the location is valid and 
            weather data is successfully fetched. Returns an error message if 
            the location query parameter is missing or if fetching weather data fails.
        """
        location = request.args.get('location')
        if not location:
            return jsonify({'error': "Missing 'location' query parameter"}), 400
        
        weather_data = get_weather(location)
        if 'error' in weather_data:
            return jsonify(weather_data), 404
        return jsonify(weather_data)
