import os
from werkzeug.utils import secure_filename

from server.models import ImageUpload, db
from server.config.config import Config
from server.config.constants import ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB, UPLOAD_DIR

from server.services.image.vision import GoogleVisionService
from server.services.ai.openai import TravelGPTService


class ImageUploadService:
    """
    Handles image upload and generates a scene-based destination suggestion using
    Google Cloud Vision API and GPT-4.
    """

    def __init__(self, openai_client, base_url=None):
        """
        Initialize the service with an OpenAI client and a base URL.

        Args:
            openai_client (OpenAI): An instance of the OpenAI client.
            base_url (str): The base URL for generating the file URL. Defaults to
                the BASE_URL environment variable.
        """
        self.vision_service = GoogleVisionService()
        self.gpt_service = TravelGPTService(openai_client)
        self.base_url = base_url or Config.BASE_URL

    def allowed_file(self, filename):
        """
        Check if the file extension is allowed.

        Args:
            filename (str): The uploaded file name.

        Returns:
            bool: Whether the file type is allowed.
        """
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def handle_upload(self, file):
        """
        Handle the file upload and perform basic validation.

        Args:
            file (werkzeug.datastructures.FileMultiDict): The uploaded file.

        Returns:
            dict: The uploaded file information or an error message.
        """
        if not file or file.filename == '':
            return None, 'No file uploaded or empty filename.'

        if not self.allowed_file(file.filename):
            return None, 'File type not allowed. Only JPG and PNG are accepted.'

        file.seek(0, os.SEEK_END)
        file_length = file.tell()
        file.seek(0)

        if file_length > MAX_FILE_SIZE_MB * 1024 * 1024:
            return None, 'File size exceeds 10MB limit.'

        filename = secure_filename(file.filename)
        save_path = os.path.join(os.getcwd(), UPLOAD_DIR)
        os.makedirs(save_path, exist_ok=True)

        filepath = os.path.join(save_path, filename)
        file.save(filepath)

        return {'filename': filename, 'filepath': filepath}, None

    def generate_file_url(self, filename):
        """
        Generate the file URL using the base URL.

        Args:
            filename (str): The uploaded file name.

        Returns:
            str: The file URL.
        """
        return f"{self.base_url}/{UPLOAD_DIR}/{filename}"

    def create_db_record(self, filename, scene_type, file_url):
        """
        Create a new ImageUpload record in the database.

        Args:
            filename (str): The uploaded file name.
            scene_type (str): The scene type.
            file_url (str): The file URL.

        Returns:
            ImageUpload: The newly created record.
        """
        record = ImageUpload(
            filename=filename,
            scene_type=scene_type,
            file_url=file_url,
            additional_metadata={
                "uploaded_by": "user",
                "description": "Uploaded image"
            }
        )
        db.session.add(record)
        db.session.commit()
        return record

    def process_image_upload(self, file):
        """
        Process the image upload and generate a scene-based destination suggestion.

        Args:
            file (werkzeug.datastructures.FileMultiDict): The uploaded file.

        Returns:
            dict: The generated suggestion or an error message.
        """
        # Step 1: Upload file
        upload_result, error = self.handle_upload(file)
        if error:
            return None, {'error': error}

        filepath = upload_result['filepath']
        filename = upload_result['filename']

        # Step 2: Extract labels
        scene_labels = self.vision_service.get_top_labels(filepath)
        landmark_labels = self.vision_service.get_landmark_labels(filepath)

        # Step 3: Generate TripAdvisor label
        tripadvisor_label = self.gpt_service.generate_tripadvisor_label(scene_labels, landmark_labels)

        # Step 4: Suggest locations
        suggested_locations = self.gpt_service.suggest_locations(
            tripadvisor_label,
            scene_labels,
            landmark_labels
        )

        # Step 5: File URL and DB save
        file_url = self.generate_file_url(filename)
        self.create_db_record(filename, tripadvisor_label, file_url)

        return {
            'filename': filename,
            'scene_type': tripadvisor_label,
            'file_url': file_url,
            'suggested_locations': suggested_locations,
            'message': 'Uploaded and scene detected ✅'
        }, None
