import os

from dotenv import load_dotenv
from flask import Flask
from flask_caching import Cache
from flask_cors import CORS
from flask_migrate import Migrate

from server import db
from server.config import Config
from server.routes import register_routes


load_dotenv()

# Create instances
cache = Cache()  # Initialize without config for now

migrate = Migrate()

google_creds_raw = os.environ.get("GOOGLE_CREDS_JSON")
if google_creds_raw:
    with open("google-creds.json", "w") as f:
        f.write(google_creds_raw)

def create_app():
    """
    Create and configure the Flask application.
    
    Returns:
        Flask app instance.
    """
    # Initialize the Flask application
    app = Flask(__name__)

    # Load configuration from the Config class
    app.config.from_object(Config)

    # Ensure the upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize SQLAlchemy with the app
    db.init_app(app)

    # Initialize the cache with the app
    cache.init_app(app)

    # Enable Cross-Origin Resource Sharing (CORS)
    CORS(app)

    # Set up Flask-Migrate for database migrations
    migrate.init_app(app, db)

    # Register all routes with the app
    register_routes(app, cache)

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get("PORT", 10000))  # 10000 is just a fallback
    app.run(host='0.0.0.0', port=port, debug=True)
