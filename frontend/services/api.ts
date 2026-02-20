import { Book } from "../types";

// Dynamically determine backend URL based on where frontend is loaded
const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return `http://${window.location.hostname}:5001`;
    }
    return "http://localhost:5001";
};

const API_URL = getBaseUrl();

// Helper to generate a stable random price based on string hash
const getPrice = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Map hash to price between $10 and $50
    const price = 10 + Math.abs(hash % 41);
    return price;
};

// Helper to generate a stable random rating based on string hash
const getRating = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Map hash to rating between 3.5 and 5.0
    const rating = 3.5 + (Math.abs(hash) % 16) / 10;
    return Math.min(5, Math.max(0, rating));
};

// Helper to map backend response to Book interface
const mapBackendBook = (item: any, index: number): Book => ({
    id: `book-${index}-${Date.now()}`, // Generate unique ID
    title: item.title,
    author: item.author,
    description: "Description unavailable in local dataset.", // Placeholder
    coverUrl: item.image,
    rating: item.avg_rating || getRating(item.title),
    genre: "Fiction", // Placeholder as dataset might not have genre
    year: undefined, // Not in backend response
    price: getPrice(item.title)
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
