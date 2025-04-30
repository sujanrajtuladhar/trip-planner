# 🗺️ Trip Planner Frontend

This is the **frontend** for the Trip Planner application. It is built using **React + TypeScript** and powered by **Vite** for fast development and optimized builds. Users can upload images, analyze scenes, and receive location-based weather forecasts and travel recommendations.

---

## 🚀 Live Demo

- 🌐 **Frontend**: [https://trip-planner-1-uihe.onrender.com](https://trip-planner-1-uihe.onrender.com)
- 🔗 **Backend API**: [https://trip-planner-gtcr.onrender.com/api](https://trip-planner-gtcr.onrender.com/api)

---

## 📁 Project Structure

```plaintext
/Users/sujanrajtuladhar/Personal/levo/trip-planner-flask/frontend/
├── .env
├── .env.example
├── .gitignore
├── README.md
├─] dist/ (ignored)
├── eslint.config.js
├── index.html
├─] node_modules/ (ignored)
├── package-lock.json
├── package.json
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.tsx
│   ├── assets/
│   │   └── react.svg
│   ├── features/
│   │   └── tripPlanner/
│   │       ├── Home.css
│   │       ├── Home.tsx
│   │       ├── components/
│   │       │   ├── Header.tsx
│   │       │   ├── ImageUploader.tsx
│   │       │   ├── LocationList.tsx
│   │       │   ├── SceneAnalysis.tsx
│   │       │   └── WeatherForecast.tsx
│   │       ├── services/
│   │       │   └── tripPlannerService.ts
│   │       ├── styles/
│   │       │   ├── Header.module.css
│   │       │   ├── Home.module.css
│   │       │   ├── ImageUploader.module.css
│   │       │   ├── LocationList.module.css
│   │       │   ├── SceneAnalysis.module.css
│   │       │   └── WeatherForecast.module.css
│   │       └── types.ts
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 🛠️ Tech Stack

- ⚛️ **React** with **TypeScript** for building the user interface
- ⚡ **Vite** for fast development and optimized production builds
- 💅 **CSS Modules** for scoped and maintainable styling
- 🌐 **RESTful API** integration with Flask backend
- 📦 **npm** for package management

---

## 📦 Installation

To get the project up and running locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/sujanrajtuladhar/trip-planner
    cd trip-planner/frontend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

---

## ▶️ Running the App

To run the app locally, use the following command:

```bash
npm run dev
```