# Recipe Planner

Recipe Planner is a full-stack meal-planning assistant that digitises PDF recipes, organises them into a searchable catalogue, and builds weekly shopping lists. The application pairs a Flask API for PDF ingestion with a Vite + React frontend inspired by the provided baseline design.

## Features

- **PDF upload & parsing** – Extract recipe titles, ingredients, and hero images from PDF files using pdfplumber and pdf2image.
- **Recipe catalogue** – Browse extracted recipes in an interactive grid with searching, sorting, and filtering controls.
- **Meal planning** – Stage recipes for 2- or 4-person servings and persist the plan on the backend.
- **Shopping list builder** – Auto-group consolidated ingredients by grocery category once a plan is saved.
- **Dark UI** – Tailwind-powered styling influenced by the sample screenshot.

## Project Structure

```
backend/   Flask application, database models, and PDF processing utilities.
frontend/  React SPA built with Vite, Tailwind CSS, and lightweight shadcn-inspired components.
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Poppler (required for pdf2image when extracting images)

### Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask --app app:create_app db upgrade  # create database tables
flask --app app:create_app run

# Run automated checks
pytest backend/tests
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend proxies API requests to `http://localhost:5000`. Update `vite.config.ts` if your backend runs elsewhere.

## API Overview

| Endpoint          | Method | Description                                     |
| ----------------- | ------ | ----------------------------------------------- |
| `/api/upload`     | POST   | Upload a PDF or JSON payload to save a recipe.  |
| `/api/recipes`    | GET    | List stored recipes.                            |
| `/api/images/<id>`| GET    | Serve extracted recipe images.                  |
| `/api/meal-plan`  | POST   | Persist the active weekly meal plan.            |
| `/api/shopping-list` | GET | Retrieve the categorised shopping list.         |

## Versioning

- Backend version: `0.1.1`
- Frontend version: `0.1.0`

Increment the relevant version before publishing future changes.

## Future Enhancements

- User authentication for saving multiple meal plans.
- Drag-and-drop scheduling for individual weekdays.
- CSV/PDF exports of generated shopping lists.
