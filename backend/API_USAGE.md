# Backend API Usage

The backend server runs on **Port 5001**.
Base URL: `http://127.0.0.1:5001`

You can start the server by running:
```bash
python app.py
```

## API Endpoints and curl Commands

### 1. Health Check
Check if the API is running.

**Command:**
```bash
curl http://127.0.0.1:5001/
```

**Expected Output:**
```json
{
  "message": "Book Recommender API is running",
  "status": "healthy"
}
```

### 2. Get Popular Books
Retrieve the top 50 popular books.

**Command:**
```bash
curl http://127.0.0.1:5001/popular
```

**Expected Output (Truncated Example):**
```json
[
  {
    "author": "J. K. Rowling",
    "avg_rating": 5.5,
    "image": "http://images.amazon.com/images/P/0439136350.01.MZZZZZZZ.jpg",
    "num_ratings": 300,
    "title": "Harry Potter and the Prisoner of Azkaban (Book 3)"
  },
  ...
]
```

### 3. Recommend Books
Get book recommendations based on a book name.

**Command:**
```bash
curl -X POST http://127.0.0.1:5001/recommend \
     -H "Content-Type: application/json" \
     -d '{"book_name": "1984"}'
```

**Expected Output (Example):**
```json
[
  {
    "author": "George Orwell",
    "image": "http://images.amazon.com/images/P/0451524934.01.MZZZZZZZ.jpg",
    "title": "1984"
  },
  {
    "author": "Aldous Huxley",
    "image": "http://images.amazon.com/images/P/0060850523.01.MZZZZZZZ.jpg",
    "title": "Brave New World"
  },
  ...
]
```

**Error Case (Book not found):**
```bash
curl -X POST http://127.0.0.1:5001/recommend \
     -H "Content-Type: application/json" \
     -d '{"book_name": "Non Existent Book 123"}'
```

**Expected Output:**
```json
{
  "error": "Book not found in database"
}
```
