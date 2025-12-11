# Book Recommendation System - Frontend

This is the modern, responsive frontend for the Book Recommendation System, built with React, Tailwind CSS, and Glassmorphism design principles.

## 1. Project Structure

Here is how you should organize this frontend relative to your Python backend:

```text
/my-recommendation-project
├── /backend                 # Your Python backend folder
│   ├── app.py              # Main Flask/FastAPI application
│   └── requirements.txt
│
└── /frontend               # This React project -> Place the files here!
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── /src
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── /components
        │   ├── Hero.jsx
        │   ├── FilterBar.jsx
        │   ├── BookCard.jsx
        │   └── BookModal.jsx
        └── /data
            └── mockBooks.js  <-- You will replace this with API calls
```

## 2. Prerequisites

Before you begin, ensure you have the following installed on your machine:

-   **Node.js** (Version 18 or higher recommended)
-   **npm** (Comes with Node.js)

The project relies on these key libraries (already included in `package.json`):
-   `react` & `react-dom`: UI library.
-   `tailwindcss`: Styling.
-   `framer-motion`: Smooth animations.
-   `lucide-react`: Icons.

## 3. Installation Commands

Open your terminal, navigate to the `/frontend` folder, and run these commands:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
    *This will download all the required packages listed in `package.json`.*

2.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    *This starts the local server. By default, it runs on `http://localhost:5173`, but if that port is busy, it will verify to `5174` or higher. Check your terminal output for the exact link.*

## 4. API Integration Guide

To connect this frontend to your Python backend, you need to replace the `mockBooks` data with a real `fetch()` call.

### Step 1: Locate the File
Open `src/App.jsx`.

### Step 2: Update the Code
Replace the static import of `mockBooks` with a `useEffect` hook that fetches data from your API.

**Before:**
```javascript
import { mockBooks, genres } from './data/mockBooks';

function App() {
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Uses static mock data
  const filteredBooks = selectedGenre === 'All' 
    ? mockBooks 
    : mockBooks.filter(book => book.genre === selectedGenre);
// ...
```

**After (Real Backend Integration):**
```javascript
import React, { useState, useEffect } from 'react'; // Import useEffect
// import { mockBooks } from './data/mockBooks'; // Comment out or delete this
import { genres } from './data/mockBooks'; // Keep genres or fetch them too

function App() {
  const [books, setBooks] = useState([]); // State to store fetched books
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);

  // FETCH DATA FROM PYTHON BACKEND
  useEffect(() => {
    // Replace with your actual Python API URL
    fetch('http://localhost:5000/api/recommendations') 
      .then(response => response.json())
      .then(data => {
        setBooks(data); // Assuming API returns an array of book objects
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
        setLoading(false);
      });
  }, []);

  const filteredBooks = selectedGenre === 'All' 
    ? books 
    : books.filter(book => book.genre === selectedGenre);

  // ... rest of the component
}
```

### Data Format Requirement
Ensure your Python backend returns a JSON array of objects with these exact keys:
```json
[
  {
    "id": 1,
    "title": "Book Title",
    "author": "Author Name",
    "coverUrl": "https://example.com/image.jpg",
    "matchScore": 95,
    "genre": "Sci-Fi",
    "summary": "Brief summary...",
    "explanation": "Why this was recommended..."
  }
]
```

## 5. Running the Project

1.  **Start your Backend:**
    Run your Python app (e.g., `python app.py`) in one terminal window.
    
2.  **Start the Frontend:**
    Open a new terminal window, go to the `/frontend` folder, and run:
    ```bash
    npm run dev
    ```

3.  **Open Browser:**
    Click the link shown in the terminal (e.g., `http://localhost:5173` or `http://localhost:5174`) to see your integrated application!
