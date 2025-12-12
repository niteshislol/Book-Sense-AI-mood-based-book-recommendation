# Project Structure: BookSense AI

This document outlines the organization of the codebase for BookSense AI.

## Root Directory (`book-reccomendation/`)

This is the main project folder containing all components.

### 1. Backend (`backend/`)
The Python Flask API that powers the recommendation engine.
- **`app.py`**: The main entry point. Handles API requests.
    - **Endpoint `/popular`**: Returns top 50 books based on average rating.
    - **Endpoint `/recommend`**: Returns books similar to a given input book title.
    - **Endpoint `/search`**: Searches the local dataset for books by title or author.
- **`models/`**: Contains pre-trained ML models (`.pkl` files) loaded by `app.py` at startup.
    - `popular.pkl`, `pt.pkl`, `books.pkl`, `similarity_scores.pkl`.

### 2. Frontend (`frontend/`)
The modern React application (built with Vite) for the user interface.
- **`src/App.tsx`**: The core component handling state, routing (single-page logic), and layout.
- **`src/components/`**: Reusable UI components.
    - **`Hero.tsx`**: The landing section with the infinite book marquee and search bar.
    - **`BookGrid.tsx`**: Displays a responsive grid of book cards.
    - **`BookCard.tsx`**: Individual book component with hover effects.
    - **`MoodDetector.tsx`**: Interface for the "Mood AI" feature (Camera/File/Manual).
    - **`Navbar.tsx`**: Responsive navigation bar.
    - **`TopBooks.tsx`**: wrapper to display the popular books section.
- **`src/services/`**: API integration layers.
    - **`api.ts`**: Interacts with your local Python backend (`localhost:5001`).
        - `getPopularBooks()`
        - `searchBooks()`
    - **`geminiService.ts`**: Interacts with Google Gemini API (`generativelanguage.googleapis.com`).
        - `analyzeMoodAndRecommend()`: Sends image/text to Gemini to detect mood.
- **`constants.ts`**: Stores static data (mappings, config) and fallback mock data.
- **`vite.config.ts`**: Configuration for the build tool and dev server.

### 3. ML (`ml/`)
Contains the original Machine Learning experiments.
- Includes Jupyter notebooks (`.ipynb`) used to clean data, train models, and generate the `.pkl` files found in `backend/models`.

## Usage
1. **Backend**: Run `python app.py` in `backend/` (Port 5001).
2. **Frontend**: Run `npm run dev` in `frontend/` (Port 3000/5173).
