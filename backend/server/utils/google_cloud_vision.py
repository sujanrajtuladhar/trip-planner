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



# def generate_tripadvisor_label(image_path, openai_client, top_n=5, min_score=0.7):
#     """
#     Generates a TripAdvisor-style label by combining Google Vision and GPT.

#     Args:
#         image_path (str): Local path to the image.
#         openai_client: An instance of OpenAI client.
#         top_n (int): Number of top labels to send to GPT.
#         min_score (float): Minimum confidence score threshold.

#     Returns:
#         str: TripAdvisor-style scene description.
#     """
#     from google.cloud import vision

#     # Step 1: Vision API - Detect labels
#     vision_client = vision.ImageAnnotatorClient()

#     with open(image_path, "rb") as image_file:
#         content = image_file.read()

#     image = vision.Image(content=content)
#     response = vision_client.label_detection(image=image)
#     labels = response.label_annotations

#     # Step 2: Filter and prepare top labels
#     filtered_labels = [
#         (label.description, label.score)
#         for label in labels if label.score >= min_score
#     ]
#     filtered_labels.sort(key=lambda x: x[1], reverse=True)

#     top_labels = [desc for desc, _ in filtered_labels[:top_n]]
#     label_string = ", ".join(top_labels) if top_labels else "unknown scene"

#     # Step 3: GPT prompt construction
#     prompt = (
#         "You are a travel expert helping categorize images for TripAdvisor listings.\n\n"
#         f"Based on the following scene labels: {label_string}\n\n"
#         "Suggest a short, travel-focused description or category suitable for TripAdvisor, "
#         "such as 'Scenic mountain hiking trail', 'Tropical beach', or 'Historic downtown area'."
#     )

#     # Step 4: Call OpenAI GPT
#     response = openai_client.chat.completions.create(
#         model="gpt-4",
#         messages=[
#             {"role": "system", "content": "You are a helpful travel assistant."},
#             {"role": "user", "content": prompt}
#         ]
#     )

#     suggestion = response.choices[0].message.content.strip()
#     return suggestion
