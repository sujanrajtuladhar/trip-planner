import json
import ast


class TravelGPTService:
    def __init__(self, client):
        self.client = client

    def _call_gpt(self, messages, max_tokens=800, temperature=0.7):
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                max_tokens=max_tokens,
                temperature=temperature,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print("OpenAI API Error:", e)
            return None

    def generate_tripadvisor_label(self, scene_labels, landmark_labels):
        scene_str = ", ".join(scene_labels or ["no scene labels"])
        landmark_str = ", ".join(landmark_labels or ["no landmarks detected"])

        prompt = (
            "You are a travel expert helping categorize photos for TripAdvisor listings.\n\n"
            f"Scene Labels: {scene_str}\n"
            f"Detected Landmarks: {landmark_str}\n\n"
            "Based on this information, suggest a short, travel-oriented category or description suitable for TripAdvisor. "
            "Examples include: 'Tropical beach resort', 'Historic city square', 'Scenic mountain trail', or 'Famous temple site'. "
            "Keep the response concise and relevant for a traveler browsing photos."
        )

        messages = [
            {"role": "system", "content": "You are a helpful travel assistant."},
            {"role": "user", "content": prompt}
        ]
        return self._call_gpt(messages, max_tokens=60)

    def suggest_locations(self, tripadvisor_label, scene_labels=None, landmark_labels=None):
        scene_str = ", ".join(scene_labels or ["none"])
        landmark_str = ", ".join(landmark_labels or ["none"])

        prompt = (
            "You are a travel expert AI assisting with identifying potential travel destinations based on image content.\n\n"
            f"TripAdvisor-style description: {tripadvisor_label}\n"
            f"Detected scene labels: {scene_str}\n"
            f"Detected landmarks (if any): {landmark_str}\n\n"
            "Based on this information, suggest exactly 10 real-world travel destinations that closely match this content. "
            "Each suggestion should be a known landmark, city, or natural site that fits the image. "
            "Respond only with a JSON-formatted Python list of exactly 10 dictionaries. Do not include any explanation or extra text."
            "- 'name': Landmark, site, or location name (e.g., 'Angkor Wat')\n"
            "- 'city': Nearest major city\n"
            "- 'country': Country\n"
            "- 'reason': 1-2 sentence explanation why this location matches the image\n"
            "- 'relevance_score': Float (0.0 to 1.0) — how well it fits the image\n"
            "- 'popularity_rank': Integer (1 = most popular)\n\n"
            "Respond only with a JSON-formatted Python list of dictionaries."
        )

        messages = [
            {"role": "system", "content": "You are an assistant that suggests travel destinations."},
            {"role": "user", "content": prompt}
        ]
        raw = self._call_gpt(messages, max_tokens=800)

        if not raw:
            return self._fallback_location("No response from GPT")

        try:
            try:
                locations = json.loads(raw)
            except json.JSONDecodeError:
                locations = ast.literal_eval(raw)

            if isinstance(locations, list):
                return self._clean_and_sort(locations)
        except Exception as e:
            print("GPT parsing error:", e)

        return self._fallback_location("Parsing failed")

    def _clean_and_sort(self, data):
        cleaned = []
        for loc in data:
            cleaned.append({
                "name": loc.get("name", "Unknown"),
                "city": loc.get("city", "Unknown"),
                "country": loc.get("country", "Unknown"),
                "reason": loc.get("reason", "No reason provided."),
                "relevance_score": float(loc.get("relevance_score", 0)),
                "popularity_rank": int(loc.get("popularity_rank", 99)),
            })
        return sorted(cleaned, key=lambda x: (-x["relevance_score"], x["popularity_rank"]))

    def _fallback_location(self, reason):
        return [{
            "name": "Unknown",
            "city": "Unknown",
            "country": "Unknown",
            "reason": reason,
            "relevance_score": 0,
            "popularity_rank": 99
        }]
