import ast


def generate_tripadvisor_label(openai_client, label_list):
    """
    Uses GPT to generate a TripAdvisor-style description from labels.

    Args:
        openai_client: OpenAI API client instance.
        label_list (List[str]): List of scene labels.

    Returns:
        str: TripAdvisor-style description.
    """
    label_string = ", ".join(label_list) if label_list else "unknown scene"

    prompt = (
        "You are a travel expert helping categorize images for TripAdvisor listings.\n\n"
        f"Based on the following scene labels: {label_string}\n\n"
        "Suggest a short, travel-focused description or category suitable for TripAdvisor, "
        "such as 'Scenic mountain hiking trail', 'Tropical beach', or 'Historic downtown area'."
    )

    response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful travel assistant."},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content.strip()



def suggest_location_with_gpt(client, labels):
    """Uses GPT-4 to suggest at least 5 possible real-world travel locations based on image labels."""
    prompt = (
        "Given the following image labels, suggest at least 5 possible real-world travel locations "
        "(such as cities, landmarks, or natural sites) where this image might have been taken. "
        "For each location, provide the name of the landmark, the city, and the country in the format "
        "like this: [{'name': 'Angkor Wat', 'city': 'Siem Reap', 'country': 'Cambodia'}, ...]\n"
        f"Labels: {', '.join(labels)}"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an assistant that guesses travel locations based on image content."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.8
        )
        raw_response = response.choices[0].message.content.strip()
        print(raw_response, 'gpt response')

        # Safely convert the string representation of list to an actual Python list
        locations = ast.literal_eval(raw_response)

        if isinstance(locations, list):
            # Ensure the list contains dictionaries with 'name', 'city', and 'country' keys
            return [
                {
                    "name": loc.get("name", "Unknown"),
                    "city": loc.get("city", "Unknown"),
                    "country": loc.get("country", "Unknown")
                }
                for loc in locations
            ]
        else:
            return [{"name": "Unknown", "city": "Unknown", "country": "Unknown"}]
    except Exception as e:
        print("OpenAI API Error:", e)
        return ["unknown location"]