from google.cloud import vision


def get_top_labels(image_path, top_n=5, min_score=0.7):
    """
    Uses Google Vision to get top scene labels from an image.

    Args:
        image_path (str): Path to the image file.
        top_n (int): Number of top labels to return.
        min_score (float): Minimum confidence score threshold.

    Returns:
        List[str]: Top scene labels.
    """
    client = vision.ImageAnnotatorClient()

    with open(image_path, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)
    response = client.label_detection(image=image)
    labels = response.label_annotations

    filtered = [
        (label.description, label.score)
        for label in labels if label.score >= min_score
    ]
    filtered.sort(key=lambda x: x[1], reverse=True)

    return [desc for desc, _ in filtered[:top_n]]