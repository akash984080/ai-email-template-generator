
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load your Gemini API key from environment variables
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

// Initialize the model
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp", // Make sure this model exists
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType:  "application/json"
};



export const GenerateTemplateAImodel = model.startChat({
  generationConfig ,
  history: [], // Optional: Preload some chat history
})