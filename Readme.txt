Project Overview

This project is a web-based meal planning application that allows users to upload recipe PDFs, extract structured data (recipe name, ingredients, protein source, and an image preview), and organize meal plans. The system will feature a Flask-based backend API for data processing and a React-based frontend for user interaction.

Core Functionalities:

✔ PDF Upload & Extraction
✔ Recipe Organization & Sorting
✔ Meal Planning for 2 or 4 People
✔ Shopping List Generation
✔ Interactive UI for Browsing & Filtering Recipes

Project Breakdown: Components & Features
1️⃣ Backend (Flask API)

The backend is responsible for handling file uploads, processing PDFs, extracting structured data, storing images, and serving API endpoints.

✅ 1.1 File Upload & Processing

Users upload a recipe PDF via the frontend or an API request.

Flask validates the file (ensuring it's a PDF) before processing.

✅ 1.2 Text Extraction

Uses pdfplumber to extract text from the PDF.

Filters out non-relevant content (e.g., instructions, phone numbers, promo texts).

Uses regex-based heuristics and NLP techniques for:

Extracting the recipe name.

Cleaning ingredient lists (removing units like "¼ oz", unnecessary words).

Detecting the protein source intelligently.

✅ 1.3 Image Extraction

Uses pdf2image to extract the first page of the PDF as a recipe image.

Ensures image validation (correct size & format).

Stores images in a dedicated folder.

✅ 1.4 API Endpoints
Endpoint	Method	Purpose
/upload	POST	Accepts a PDF, extracts text & images, and returns structured JSON data.
/recipes	GET	Returns a list of available recipes (parsed from uploaded PDFs).
/images/<filename>	GET	Serves extracted recipe images.
/meal-plan	POST	Allows users to save a meal plan for the week.
/shopping-list	GET	Returns consolidated ingredients for the meal plan.
2️⃣ Frontend (React App)

The React UI allows users to upload recipes, browse extracted recipes, sort/filter them, plan meals, and generate a shopping list.

✅ 2.1 Home Page

Displays an upload button for PDF recipes.

Shows a list of all uploaded recipes.

✅ 2.2 Recipe Display

Each recipe is displayed as a card with:

Recipe name & image (from extracted PDF).

Protein category (Beef, Fish, Vegetarian, etc.).

Ingredient list (cleaned & formatted).

Buttons to:

View full details.

Add to Meal Plan.

Toggle between 2-person or 4-person serving.

✅ 2.3 Meal Planning

Users can add recipes to a weekly meal plan.

Allows toggling between 2-person and 4-person meals.

Provides shopping list generation based on planned meals.

✅ 2.4 Shopping List

Aggregates ingredients from all selected recipes.

Groups items by category (Produce, Dairy, Meats, etc.).

Formats the shopping list for export or printing.

✅ 2.5 Filtering & Sorting

Sort recipes by protein type (Beef, Chicken, Vegetarian, etc.).

Search recipes by name or ingredients.

Filter based on serving size (2-person or 4-person).

3️⃣ Technical Stack
Backend

Flask (Python API)

pdfplumber (Text extraction)

pdf2image (Image extraction)

Werkzeug (File handling)

SQLite/PostgreSQL (Database for recipe storage)

Flask-CORS (Cross-origin support for frontend requests)

Frontend

React (Vite-based setup)

Axios (API requests)

Tailwind CSS (UI styling)

shadcn/ui (Component library)

React Context API (Global state for meal planning)

4️⃣ Development Roadmap
Phase 1: Backend API

✔ Setup Flask API & file upload handling.
✔ Implement text & image extraction from PDFs.
✔ Develop API endpoints for recipes, images, and meal planning.
✔ Ensure CORS support for frontend communication.

Phase 2: Frontend UI

✔ Create React app structure.
✔ Implement Recipe Cards with images & details.
✔ Add sorting & filtering functionality.
✔ Implement Meal Planning UI (drag & drop or checklist-style).
✔ Generate shopping list from selected meals.

Phase 3: Optimization & Testing

✔ Improve ingredient parsing with better heuristics.
✔ Enhance protein detection using NLP.
✔ Implement persistent storage (database integration).
✔ Optimize frontend performance (lazy loading, caching).
✔ Thorough testing & bug fixes.

5️⃣ Expected JSON Output (Recipe Data)
{
  "name": "TILAPIA WITH ALMOND-PARSLEY GREMOLATA",
  "image": "/images/tilapia_recipe.jpg",
  "protein": "Tilapia",
  "ingredients": [
    "Tilapia",
    "Green Beans",
    "Garlic Herb Butter",
    "Chili Flakes",
    "Sliced Almonds",
    "Israeli Couscous"
  ]
}

6️⃣ Expected JSON Output (Shopping List)
{
  "shopping_list": {
    "Produce": ["Green Beans", "Garlic"],
    "Dairy": ["Butter"],
    "Protein": ["Tilapia"],
    "Pantry": ["Israeli Couscous", "Chili Flakes", "Sliced Almonds"]
  }
}

7️⃣ Future Features

🔹 User Accounts: Allow users to save meal plans & shopping lists.
🔹 Recipe Editing: Users can adjust ingredients, add notes, or customize servings.
🔹 AI-powered Ingredient Suggestions: Recommend alternative ingredients based on dietary preferences.
🔹 Mobile-Friendly UI: Ensure seamless experience on phones & tablets.
🔹 Export Shopping List: Download shopping lists as PDF, CSV, or send to Walmart Grocery.

Final Thoughts

This application will allow users to digitize and organize their meal planning efficiently by extracting structured data from PDFs, filtering recipes, planning meals, and generating shopping lists.

This plan provides detailed development steps and technical implementation to ensure smooth execution.