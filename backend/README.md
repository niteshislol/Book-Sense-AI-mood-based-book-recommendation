# Book Recommender Backend

This is the Flask backend for the Book Recommender System. It serves recommendations using models trained on the Book-Crossing dataset.

## Prerequisites

- Python 3.8+
- `pip`

## Setup & Installation

1.  **Navigate to the backend directory** (if not already there):
    ```bash
    cd backend
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Generate Models**:
    *   **Important**: This step is required before running the server for the first time.
    *   The script reads CSV data from `../ml/` and generates pickle files in `models/`.
    ```bash
    python generate_models.py
    ```

## Running the Server

Start the Flask application:
```bash
python app.py
```
The server will start at `http://localhost:5000`.

## API Endpoints

### 1. Health Check
*   **URL**: `/`
*   **Method**: `GET`
*   **Response**: `{"status": "healthy", ...}`

### 2. Get Popular Books
*   **URL**: `/popular`
*   **Method**: `GET`
*   **Description**: Returns the top 50 books with the highest average rating (minimum 250 ratings).
*   **Response**: JSON array of book objects.

### 3. Get Recommendations
*   **URL**: `/recommend`
*   **Method**: `POST`
*   **Description**: Returns 4 recommended books similar to the provided book name.
*   **Body**:
    ```json
    {
      "book_name": "The Da Vinci Code"
    }
    ```
*   **Response**: JSON array of recommended book objects.

## Directory Structure

*   `app.py`: Main Flask application entry point.
*   `generate_models.py`: Script to process CSVs and save trained models.
*   `models/`: Directory where `.pkl` files are stored after generation.
*   `requirements.txt`: Python dependencies.
