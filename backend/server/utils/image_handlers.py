from flask import request, jsonify
import os
from werkzeug.utils import secure_filename

from server.config import Config
from server.models import ImageUpload, db
# Helper functions

def handle_image_upload():
    """
    Handles the uploading of an image and saves it to the server.
    Returns:
        file (dict): containing filename and filepath.
        error (str): error message if upload fails, otherwise None.
    """
    if 'file' not in request.files:
        return None, 'No file uploaded'

    file = request.files['file']
    if file.filename == '':
        return None, 'Empty filename'

    filename = secure_filename(file.filename)
    upload_folder = os.path.join(os.getcwd(), 'static')
    os.makedirs(upload_folder, exist_ok=True)
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)

    return {'filename': filename, 'filepath': filepath}, None

def generate_file_url(filename):
    """
    Generates the URL for accessing the uploaded file.
    """
    return f"{Config.BASE_URL}/static/{filename}"

def create_image_upload_record(filename, scene_type, file_url):
    """
    Creates an ImageUpload record and stores it in the database.
    """
    image_upload = ImageUpload(
        filename=filename,
        scene_type=scene_type,
        file_url=file_url,
        additional_metadata={"uploaded_by": "user", "description": "Uploaded image"}
    )
    db.session.add(image_upload)
    db.session.commit()
    return image_upload
