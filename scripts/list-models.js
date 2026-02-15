const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function listModels() {
    console.log("Checking API Key:", process.env.GOOGLE_GEMINI_API_KEY ? "Present" : "Missing");

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
        console.error("Please set GOOGLE_GEMINI_API_KEY in .env.local");
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

    // We need to access the model manager directly if possible, or try a known model to see available ones in error?
    // Actually, the SDK doesn't expose listModels easily on the main client instance in all versions.
    // Let's try to infer or just test specific model names.

    // However, the error message suggested "Call ListModels".
    // Let's try a direct fetch to the API if the SDK method isn't obvious, 
    // or use the model manager if available.
    // The GoogleGenerativeAI class doesn't have listModels. The GoogleAIFileManager might, or we just use fetch.

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("\n--- Available Models ---");
            data.models.forEach(model => {
                console.log(`Name: ${model.name}`);
                console.log(`Description: ${model.description}`);
                console.log(`Supported Generation Methods: ${model.supportedGenerationMethods}`);
                console.log("------------------------");
            });
        } else {
            console.log("No models found or error:", data);
        }
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

listModels();
