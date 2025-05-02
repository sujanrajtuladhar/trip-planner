# server/config.py

import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
    SQLALCHEMY_DATABASE_URI = 'sqlite:///tripplanner.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CACHE_TYPE = "SimpleCache"
    CACHE_DEFAULT_TIMEOUT = 3600
    UPLOAD_FOLDER = os.path.join(os.getcwd(), "static")

    # Add BASE_URL to the config
    BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:5000")  # Default to local dev URL
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    OPENWEATHERMAP_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY", "")
