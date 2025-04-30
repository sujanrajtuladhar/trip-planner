# server/models.py

from . import db
from datetime import datetime

class ImageUpload(db.Model):
    """
    Model for storing image upload records in the database.

    Attributes:
        id (int): Unique identifier for the image upload.
        filename (str): Original filename of the uploaded image.
        scene_type (str): Detected scene type of the image.
        upload_time (datetime): Timestamp of when the image was uploaded.
        file_url (str): URL of the uploaded image (optional).
        additional_metadata (dict): Additional metadata associated with the image (optional).
    """

    __tablename__ = 'image_uploads'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(120), nullable=False)
    scene_type = db.Column(db.String(50), nullable=False)
    upload_time = db.Column(db.DateTime, default=datetime.utcnow)
    # Optional: Store the file path or URL if needed
    file_url = db.Column(db.String(255), nullable=True)  # URL of the image
    additional_metadata = db.Column(db.JSON, nullable=True)  # Store additional metadata (like scene-related info)
    
    def __repr__(self):
        return f'<ImageUpload {self.filename}>'


class Destination(db.Model):
    """
    Model for storing destination records in the database.

    Attributes:
        id (int): Unique identifier for the destination.
        scene_type (str): Scene type associated with the destination.
        location (str): Location associated with the destination.
        weather_data (dict): Optional weather data associated with the destination.
        cached_at (datetime): Timestamp of when the weather data was last fetched.
    """

    __tablename__ = 'destinations'
    
    id = db.Column(db.Integer, primary_key=True)
    scene_type = db.Column(db.String(50), unique=True, nullable=False)
    location = db.Column(db.String(120), nullable=False)
    # Storing weather data in JSON format (optional, based on your requirements)
    weather_data = db.Column(db.JSON, nullable=True)
    cached_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Destination {self.scene_type} - {self.location}>'


