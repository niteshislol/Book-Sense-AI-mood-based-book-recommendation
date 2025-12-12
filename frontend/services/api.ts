import { Book } from "../types";

const API_URL = "http://localhost:5001";

// Helper to map backend response to Book interface
const mapBackendBook = (item: any, index: number): Book => ({
    id: `book-${index}-${Date.now()}`, // Generate unique ID
    title: item.title,
    author: item.author,
    description: "Description unavailable in local dataset.", // Placeholder
    coverUrl: item.image,
    rating: item.avg_rating || 0,
    genre: "Fiction", // Placeholder as dataset might not have genre
    year: undefined // Not in backend response
});

export const getPopularBooks = async (): Promise<Book[]> => {
    try {
        const response = await fetch(`${API_URL}/popular`);
        if (!response.ok) throw new Error("Failed to fetch popular books");
        const data = await response.json();
        return data.map(mapBackendBook);
    } catch (error) {
        console.error("Error fetching popular books:", error);
        return [];
    }
};

export const getRecommendations = async (bookName: string): Promise<Book[]> => {
    try {
        const response = await fetch(`${API_URL}/recommend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ book_name: bookName }),
        });
        if (!response.ok) throw new Error("Failed to fetch recommendations");
        const data = await response.json();
        return data.map(mapBackendBook);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        return [];
    }
};

export const searchBooks = async (query: string): Promise<Book[]> => {
    try {
        const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to search books");
        const data = await response.json();
        return data.map(mapBackendBook);
    } catch (error) {
        console.error("Error searching books:", error);
        return [];
    }
};
