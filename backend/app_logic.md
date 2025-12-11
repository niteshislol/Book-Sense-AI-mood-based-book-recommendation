# Backend App Logic & Structure

This document explains the internal working of the backend, the data processing pipeline, and the API structure.

## 1. Project Structure Overview

```
backend/
├── app.py                # Main Flask application entry point
├── generate_models.py    # Script to process data and generate ML models
├── models/               # Directory to store pre-computed models (.pkl files)
└── API_USAGE.md          # Documentation for using the API
```

## 2. Model Generation (`generate_models.py`)

This script is responsible for the **ETL (Extract, Transform, Load)** process and training the recommendation models. We separate this from `app.py` so that heavy data processing happens only once, not on every server restart.

### Why separate `generate_models.py`?
- **Performance**: processing large CSV datasets (Books, Users, Ratings) is computationally expensive and slow.
- **Memory**: The training process requires significant RAM. By saving the result as `pkl` files, the Flask app acts as a lightweight inference engine.

### Logic Flow:
1.  **Loading Data**: Reads `Books.csv`, `Users.csv`, and `Ratings.csv`.
2.  **Popularity Model**:
    -   Merges ratings and books.
    -   Groups by Book-Title to calculate `num_ratings` and `avg_rating`.
    -   Filters books with `num_ratings >= 250` for statistical significance.
    -   Sorts by `avg_rating` to get the top 50 books.
    -   *Result*: Saved as `popular.pkl`.
3.  **Collaborative Filtering Model**:
    -   **User Filtering**: Selects users who have rated > 200 books ("padhe_likhe_users") to ensure user data quality.
    -   **Book Filtering**: Selects books with >= 50 ratings ("famous_books") to ensure sparsity is managed.
    -   **Pivot Table**: Creates a matrix where rows=Books, cols=Users, values=Ratings.
    -   **Similarity Matrix**: Calculates cosine similarity between all books in the pivot table.
    -   *Result*: Saved as `pt.pkl` (Pivot Table), `books.pkl` (Raw Data), and `similarity_scores.pkl` (Cosine Matrix).

## 3. The Flask Application (`app.py`)

This is the API server that the frontend interacts with.

### Key Logic:
-   **Loading Models**: On startup, it loads the pre-computed `.pkl` files from the `models/` directory into memory.
-   **Routes**:
    -   `/`: Health check.
    -   `/popular`: Returns the JSON data from `popular.pkl`. This is fast because no computation is needed, just serving static data.
    -   `/recommend`:
        1.  Takes a `book_name` input.
        2.  Finds the index of that book in the `pt` (pivot table).
        3.  Uses `similarity_scores` to find the indices of the most similar books.
        4.  Retrieves metadata (Title, Author, Image) for those indices from the `books` dataframe.
        5.  Returns the top 4 recommendations.

### Why `models/` directory?
-   To keep the root directory clean.
-   To easily manage `.gitignore` (we usually don't commit large model files to git).

### Design Choices:
-   **Flask**: Lightweight and easy to set up for simple APIs.
-   **Pickle**: Python's native serialization format. Efficient for saving complex objects like Pandas DataFrames and NumPy arrays.
