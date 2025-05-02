from google.cloud import vision
from typing import List


class GoogleVisionService:
    def __init__(self):
        self.client = vision.ImageAnnotatorClient()

    def get_top_labels(self, image_path: str, top_n: int = 5, min_score: float = 0.7) -> List[str]:
        """
        Returns top scene labels with scores above min_score, sorted by relevance.
        """
        with open(image_path, "rb") as image_file:
            content = image_file.read()

        image = vision.Image(content=content)
        response = self.client.label_detection(image=image)
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
        with open(image_path, "rb") as image_file:
            content = image_file.read()

        image = vision.Image(content=content)
        response = self.client.landmark_detection(image=image)
        landmarks = response.landmark_annotations

        return [landmark.description for landmark in landmarks]
