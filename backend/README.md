1. pip install Flask Flask-Cors Flask-Caching Flask-SQLAlchemy requests Pillow
pip freeze > requirements.txt

flask db init      # Initialize the migration repository
flask db migrate   # Generate migration scripts
flask db upgrade   # Apply the migrations to the database


flask db migrate -m "Added file_url and metadata to ImageUpload, weather_data and cached_at to Destination"

