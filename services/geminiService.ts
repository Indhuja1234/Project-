
import { GoogleGenAI, Type } from "@google/genai";
import type { Movie, Theater } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const movieSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        title: { type: Type.STRING },
        genre: { type: Type.STRING },
        rating: { type: Type.NUMBER },
        duration: { type: Type.INTEGER },
        format: { type: Type.STRING, enum: ['2D', '3D', '4DX'] },
        posterUrl: { type: Type.STRING },
        synopsis: { type: Type.STRING },
    },
};

const theaterSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        distance: { type: Type.NUMBER },
        type: { type: Type.STRING, enum: ['AC', 'Non-AC'] },
        popularity: { type: Type.NUMBER },
        movies: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        showtimes: {
            type: Type.OBJECT,
            properties: {
                firstShow: { type: Type.STRING, description: "e.g., '6:00 PM'" },
                secondShow: { type: Type.STRING, description: "e.g., '9:30 PM'" },
            }
        }
    },
};

export const generateInitialData = async (): Promise<{ movies: Movie[], theaters: Theater[] }> => {
    try {
        const prompt = `
            Generate a dataset for a movie ticket booking application.
            - Create 8 unique, fictional movie entries. Each should have a unique ID like 'M1', 'M2', etc. Include a placeholder image URL from picsum.photos with size 400x600.
            - Create 4 unique, fictional theater entries. Each should have a unique ID like 'T1', 'T2', etc.
            - Distribute the movies among the theaters. A theater can show multiple movies, and a movie can be shown in multiple theaters. Ensure each movie is in at least one theater.
            - The showtimes should be realistic evening times.
            Return the data as a single JSON object with two keys: "movies" and "theaters".
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        movies: {
                            type: Type.ARRAY,
                            items: movieSchema,
                        },
                        theaters: {
                            type: Type.ARRAY,
                            items: theaterSchema,
                        }
                    }
                }
            }
        });

        const jsonString = response.text;
        const data = JSON.parse(jsonString);
        
        // Data validation could be added here
        return data as { movies: Movie[], theaters: Theater[] };

    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to generate initial data from Gemini API.");
    }
};
