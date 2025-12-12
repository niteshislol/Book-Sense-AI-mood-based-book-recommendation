from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for frontend integration

# Load Models
base_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(base_dir, 'models')

print("Loading models...")
try:
    popular_df = pickle.load(open(os.path.join(models_dir, 'popular.pkl'), 'rb'))
    pt = pickle.load(open(os.path.join(models_dir, 'pt.pkl'), 'rb'))
    books = pickle.load(open(os.path.join(models_dir, 'books.pkl'), 'rb'))
    similarity_scores = pickle.load(open(os.path.join(models_dir, 'similarity_scores.pkl'), 'rb'))
    print("Models loaded successfully.")
except FileNotFoundError:
    print("Error: Models not found. Please run generate_models.py first.")
    popular_df = None
    pt = None
    books = None
    similarity_scores = None

@app.route('/')
def index():
    return jsonify({"status": "healthy", "message": "Book Recommender API is running"})

@app.route('/popular')
def get_popular_books():
    if popular_df is None:
        return jsonify({"error": "Models not loaded"}), 500
    
    data = []
    # popular_df columns: Book-Title, Book-Author, Image-URL-M, num_ratings, avg_rating
    for i in range(popular_df.shape[0]):
        item = {
            "title": popular_df.iloc[i]['Book-Title'],
            "author": popular_df.iloc[i]['Book-Author'],
            "image": popular_df.iloc[i]['Image-URL-M'],
            "num_ratings": int(popular_df.iloc[i]['num_ratings']),
            "avg_rating": float(popular_df.iloc[i]['avg_rating'])
        }
        data.append(item)
        
    return jsonify(data)

@app.route('/recommend', methods=['POST'])
def recommend_book():
    if pt is None or similarity_scores is None or books is None:
        return jsonify({"error": "Models not loaded"}), 500

    user_input = request.json.get('book_name')
    if not user_input:
        return jsonify({"error": "Please provide a book_name"}), 400

    # Find the book index
    try:
        # Initial exact match attempt
        index = np.where(pt.index == user_input)[0][0]
    except IndexError:
        # If exact match fails, try case-insensitive partial match
        # This is a basic improvement over the notebook
        matches = [book for book in pt.index if user_input.lower() in book.lower()]
        if not matches:
             return jsonify({"error": "Book not found in database"}), 404
        # Use the first match
        index = np.where(pt.index == matches[0])[0][0]
        # logic could be improved to return suggestions, but sticking to basics for now

    similar_items = sorted(list(enumerate(similarity_scores[index])), key=lambda x: x[1], reverse=True)[1:5]

    data = []
    for i in similar_items:
        temp_df = books[books['Book-Title'] == pt.index[i[0]]]
        item = {
            "title": temp_df.drop_duplicates('Book-Title')['Book-Title'].values[0],
            "author": temp_df.drop_duplicates('Book-Title')['Book-Author'].values[0],
            "image": temp_df.drop_duplicates('Book-Title')['Image-URL-M'].values[0]
        }
        data.append(item)

    return jsonify(data)

@app.route('/search')
def search_books():
    if books is None:
         return jsonify({"error": "Models not loaded"}), 500
    
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify([])

    # Filter books by title or author
    # books dataframe likely has 'Book-Title', 'Book-Author', 'Image-URL-M'
    mask = books['Book-Title'].str.lower().str.contains(query) | books['Book-Author'].str.lower().str.contains(query)
    results = books[mask].head(8) # Limit to 8 results

    data = []
    for i in range(results.shape[0]):
        item = {
            "title": results.iloc[i]['Book-Title'],
            "author": results.iloc[i]['Book-Author'],
            "image": results.iloc[i]['Image-URL-M'],
            # Add these if available, otherwise default or skip
            "avg_rating": 0, 
            "num_ratings": 0
        }
        data.append(item)
    
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)
