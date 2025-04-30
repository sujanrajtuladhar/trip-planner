# 📸 Trip Planner - Backend

This is the **backend API** service for the Snapshot Trip Planner assignment. Built with **Flask**, this service allows users to upload scenic photos, detects the scene type using AI (Google Cloud Vision API), maps it to a real-world travel destination using **GPT-4**, and returns a **5 to 7 - day weather forecast** for the suggested location (Using free api has limited access so the weather result may vary on days).

---

## 🌐 Live Demo

🔗 **Backend URL**: [https://trip-planner-gtcr.onrender.com/api](https://trip-planner-gtcr.onrender.com/api)

🔗 **Frontend URL**: [https://trip-planner-1-uihe.onrender.com](https://trip-planner-1-uihe.onrender.com)

---

## 🧰 Tech Stack

- **Python + Flask** – REST API
- **Google Cloud Vision API** – Scene detection
- **GPT-4 (via OpenAI)** – Location suggestion
- **OpenWeatherMap API** – 7-day weather forecast
- **SQLite + SQLAlchemy** – Database
- **Alembic** – Database migrations
- **Flask-Caching** – 1-hour caching of weather responses

---

## 📁 Project Structure

```plain
├── .env
├── .env.example
├── README.md
├── app.py
├── docs/
├── google-creds.json
├── instance/
│   └── tripplanner.db
├── migrations/
│   ├── README
│   ├── alembic.ini
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       ├── 7fa53b839df4_.py
│       ├── 8c9f746c27e6_.py
│       └── ab709cb63bf1_added_file_url_and_metadata_to_.py
├── requirements.txt
├── server/
│   ├── __init__.py
│   ├── config.py
│   ├── models.py
│   ├── routes.py
│   └── utils/
│       ├── __init__.py
│       ├── google_cloud_vision.py
│       ├── gpt.py
│       ├── image_handlers.py
│       └── weather.py
└── static/
```

---

## 🚀 Features

- ✅ Upload JPG/PNG images under 10MB with progress preview
- ✅ Detect scene type (e.g., mountain, beach, city) using Cloud Vision and process using gpt improve result
- ✅ Use GPT-4 to suggest real-world travel destinations
- ✅ Fetch 7-day weather forecast for the destination
- ✅ Store metadata (filename, scene, destination) in database
- ✅ Cache weather data for each destination (1 hour minimum)
- ✅ Clean REST API interface for frontend integration

---

## 🧪 API Reference

### `POST /api/upload`

Upload an image and get a scene-based destination suggestion.

**Request**:
- Content-Type: `multipart/form-data`
- Form Field: `file` (JPG/PNG under 10MB)

**Response** (`application/json`):

```json
{
  "filename": "waterfall_view.jpg",
  "scene_type": "waterfall",
  "file_url": "https://your-domain.com/static/uploads/waterfall_view.jpg",
  "suggested_locations": [
    "Iguazu Falls, Argentina",
    "Victoria Falls, Zambia",
    "Plitvice Lakes, Croatia"
  ],
  "message": "Uploaded and scene detected ✅"
}
```

**Status Code**

- `200 OK` - Upload successful
- `400 Bad Request` - Validation or upload error

### `GET /api/weather`

**Query Parameter**:
- `location` (string) — Name of the city or location (e.g., `Paris`)

**Response** (`application/json`):

```json
{
  "location": "Paris",
  "temperature": "15°C",
  "description": "Partly cloudy",
  "humidity": 60,
  "wind_speed": "10 km/h"
}
```

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/sujanrajtuladhar/trip-planner
cd trip-planner/backend
```

### 2. Create virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment COnfiguration

Create a .env file based on .env.example:

```bash
cp .env.example .env
```

Update with appropriate keys:

```
BASE_URL="http://127.0.0.1:5000"
GOOGLE_APPLICATION_CREDENTIALS="google-creds.json"
OPENAI_API_KEY=""
OPENWEATHERMAP_API_KEY=""
GOOGLE_CREDS_JSON=''
```

### 5. Database Migration

```bash
flask db upgrade
```

### 6. Run the Flask app

```bash
flask run
```

App will be running on: `http://localhost:5000`