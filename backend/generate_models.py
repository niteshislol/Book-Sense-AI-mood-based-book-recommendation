import pandas as pd
import numpy as np
import pickle
import os
from sklearn.metrics.pairwise import cosine_similarity

# Paths
base_dir = os.path.dirname(os.path.abspath(__file__))
ml_dir = os.path.join(base_dir, '..', 'ml')
models_dir = os.path.join(base_dir, 'models')
os.makedirs(models_dir, exist_ok=True)

print("Loading data...")
try:
    books = pd.read_csv(os.path.join(ml_dir, 'Books.csv'), low_memory=False)
    users = pd.read_csv(os.path.join(ml_dir, 'Users.csv'), low_memory=False)
    ratings = pd.read_csv(os.path.join(ml_dir, 'Ratings.csv'), low_memory=False)
except FileNotFoundError as e:
    print(f"Error: {e}")
    print(f"Please make sure Books.csv, Users.csv, and Ratings.csv are in {ml_dir}")
    exit(1)

print("Data loaded successfully.")

# --- Popularity Based Recommender System ---
print("Building Popularity Based Recommender...")
ratings_with_name = ratings.merge(books, on='ISBN')
num_rating_df = ratings_with_name.groupby('Book-Title').count()['Book-Rating'].reset_index()
num_rating_df.rename(columns={'Book-Rating': 'num_ratings'}, inplace=True)

avg_rating_df = ratings_with_name.groupby('Book-Title').mean(numeric_only=True)['Book-Rating'].reset_index()
avg_rating_df.rename(columns={'Book-Rating': 'avg_rating'}, inplace=True)

popular_df = num_rating_df.merge(avg_rating_df, on='Book-Title')
popular_df = popular_df[popular_df['num_ratings'] >= 250].sort_values('avg_rating', ascending=False).head(50)
popular_df = popular_df.merge(books, on='Book-Title').drop_duplicates('Book-Title')[['Book-Title', 'Book-Author', 'Image-URL-M', 'num_ratings', 'avg_rating']]

pickle.dump(popular_df, open(os.path.join(models_dir, 'popular.pkl'), 'wb'))
print("popular.pkl saved.")

# --- Collaborative Filtering Based Recommender System ---
print("Building Collaborative Filtering Recommender...")
x = ratings_with_name.groupby('User-ID').count()['Book-Rating'] > 200
padhe_likhe_users = x[x].index

filtered_rating = ratings_with_name[ratings_with_name['User-ID'].isin(padhe_likhe_users)]

y = filtered_rating.groupby('Book-Title').count()['Book-Rating'] >= 50
famous_books = y[y].index

final_ratings = filtered_rating[filtered_rating['Book-Title'].isin(famous_books)]

pt = final_ratings.pivot_table(index='Book-Title', columns='User-ID', values='Book-Rating')
pt.fillna(0, inplace=True)

print("Calculating cosine similarity (this might take a moment)...")
similarity_scores = cosine_similarity(pt)

pickle.dump(pt, open(os.path.join(models_dir, 'pt.pkl'), 'wb'))
pickle.dump(books, open(os.path.join(models_dir, 'books.pkl'), 'wb'))
pickle.dump(similarity_scores, open(os.path.join(models_dir, 'similarity_scores.pkl'), 'wb'))

print("All models generated and saved to 'backend/models/'")
