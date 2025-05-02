from google.cloud import vision
from typing import List


class GoogleVisionService:
    """
    Provides image analysis functionality using Google Cloud Vision API.
    """

    def __init__(self):
        """
        Initializes the Google Cloud Vision client.
        """
        self.client = vision.ImageAnnotatorClient()

    def get_top_labels(self, image_path: str, top_n: int = 5, min_score: float = 0.7) -> List[str]:
        """
        Returns top scene labels with scores above min_score, sorted by relevance.
        """
        # Open the file in binary mode and read its contents.
        with open(image_path, "rb") as image_file:
            content = image_file.read()

        # Create a Vision Image object from the file contents.
        image = vision.Image(content=content)

        # Run the label detection request.
        response = self.client.label_detection(image=image)

        # Filter out labels with scores below the minimum score.
        # Sort the remaining labels by relevance (score) in descending order.
        # Return the top N labels.
        labels = response.label_annotations
        filtered = [
            (label.description, label.score)
            for label in labels if label.score >= min_score
        ]
        filtered.sort(key=lambda x: x[1], reverse=True)

        return [desc for desc, _ in filtered[:top_n]]

    def get_landmark_labels(self, image_path: str) -> List[str]:
        """
        Returns a list of landmark descriptions (if detected).
        """
        # Open the file in binary mode and read its contents.
        with open(image_path, "rb") as image_file:
            content = image_file.read()

        # Create a Vision Image object from the file contents.
        image = vision.Image(content=content)

        # Run the landmark detection request.
        response = self.client.landmark_detection(image=image)

        # Return the list of landmark descriptions.
        landmarks = response.landmark_annotations
        return [landmark.description for landmark in landmarks]
