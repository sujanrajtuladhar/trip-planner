# Trip Planner Web Application

This is a full-stack web application built with a Flask backend and a React (Vite + TypeScript) frontend.

---

## 🔧 Setup Instructions

👉 See individual setup guides:

- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)

---

## 🏗️ Architecture Overview & Technology Justification

This project is structured as a **modern full-stack web application** with a **Flask backend** and a **Vite + React (TypeScript) frontend**, organized for clarity, scalability, and ease of deployment.

### 🧠 Why This Stack Was Chosen

#### 🔹 1. Frontend – Vite + React + TypeScript

- **Vite** was chosen over Create React App (CRA) due to:
  - ⚡ **Faster development experience** with near-instant dev server start and hot module replacement (HMR).
  - 📦 **Optimized production builds** using Rollup under the hood.
  - 🧰 **Modern toolchain** supporting native ES modules and on-demand transpilation.
- **React** enables a flexible, component-driven UI structure.
- **TypeScript** adds type safety and improves maintainability across the frontend codebase.

#### 🔹 2. Backend – Flask (Python)

- **Flask** provides a lightweight, unopinionated framework ideal for building REST APIs:
  - 🚀 Rapid development with minimal boilerplate.
  - 🔌 Easy integration with tools like SQLAlchemy, Alembic, Google Cloud Vision API, and OpenAI's GPT.
- The backend is logically structured:
  - `server/` contains routes, models, configuration, and utilities.
  - `instance/` holds environment-specific data like SQLite database.
  - `migrations/` uses Alembic for database schema versioning.

#### 🔹 3. Project Structure

- **Monorepo architecture**:
  - `frontend/` and `backend/` are split for clear separation of concerns and independent scalability.
  - Supports future containerization (e.g., Docker) or independent deployment (e.g., frontend on Vercel, backend on Heroku/AWS).
- **Environment configuration**:
  - `.env` and `.env.example` files are used in both frontend and backend for flexible environment setups.
- **Modular code organization**:
  - Backend utilities are in `utils/` for reusability (e.g., `google_cloud_vision.py`, `weather.py`).
  - Frontend uses a **feature-based structure**, encapsulating components, services, and styles under `features/tripPlanner/`.

#### 🔹 4. Scalability & Maintainability

- **Frontend** is optimized for static deployment and can be easily integrated with CI/CD pipelines.
- **Backend** uses SQLite for development and can be upgraded to PostgreSQL or other databases for production.
- **Code modularity** across both ends supports rapid feature development with minimal impact on existing systems.
- **Alembic migrations** enable safe, version-controlled schema evolution in collaborative environments.

---

## 📈 Scaling Considerations

### Frontend

- **Vite + React + TypeScript**: Fast cold starts and hot module replacement (HMR) improve developer experience and productivity at scale.
- **Static Deployment Ready**: The frontend can be deployed to any CDN-backed static host such as Vercel, Netlify, or AWS S3 with CloudFront.
- **Code Splitting & Modular Design**: Components and feature folders are modular, enabling future code splitting and lazy loading for performance optimization.

### Backend

- **Flask Architecture**: Designed with separation of concerns (routes, models, utils), allowing scalability as services grow.
- **Database Flexibility**: Currently uses SQLite for development. Can be switched to PostgreSQL or MySQL in production for performance and concurrency.
- **Horizontal Scaling**: Flask can be deployed behind WSGI servers like Gunicorn or uWSGI and scaled horizontally behind Nginx or a cloud load balancer.
- **Ready for Containerization**: Easily dockerized for scalable deployment on platforms like Docker Compose, ECS, or Kubernetes.

### API

- **RESTful Design**: Stateless API structure makes it easy to introduce additional clients (e.g., mobile apps) or migrate endpoints into microservices.
- **Secure & Environment-Ready**: Uses `.env` files for environment-specific configurations, enabling smooth CI/CD and cloud deployments.

### DevOps & Maintainability

- **Clear Separation of Concerns**: Frontend and backend are decoupled, simplifying updates, debugging, and scaling individually.
- **Modular Codebase**: Feature-based frontend and backend structure allows independent team collaboration and future growth.

---

This structure was chosen to ensure a balance between developer experience, project scalability, and clean, maintainable code — fulfilling the core deliverables of:
- ✅ A deployed full-stack web application
- ✅ A well-documented public repository
- ✅ Clear setup instructions and architecture overview
