import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_caching import Cache
from server.config import Config
from server.routes import register_routes
from server import db
# Import models to ensure they're registered with SQLAlchemy
from flask_migrate import Migrate
from server.models import ImageUpload, Destination  # Import models

from dotenv import load_dotenv
load_dotenv()


# Create instances
cache = Cache()  # Initialize without config for now


migrate = Migrate()

def create_app():
    """
    Create and configure the Flask application.
    Returns:
        Flask app instance.
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Initialize extensions
    db.init_app(app)

    # Cache should be initialized after app is created
    cache.init_app(app)

    CORS(app)

    # Set up Flask-Migrate
    migrate.init_app(app, db)

    # Register routes
    register_routes(app, cache)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
