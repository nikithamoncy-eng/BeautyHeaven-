
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

async function listModels() {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('Listing available models...');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Just to get client, actually strictly we need modelManager if it existed in this SDK version
        // The SDK doesn't have a direct listModels method on the client instance usually, 
        // it might be on the class or separate.
        // Let's try to use the raw API if SDK doesn't support it easily or check docs pattern.
        // The error message suggested "Call ListModels".

        // Actually, let's try to fetch via REST for certainty.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log('Available Models:');
            data.models.forEach(m => {
                if (m.name.includes('embed')) {
                    console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods})`);
                }
            });
        } else {
            console.log('No models found or error:', data);
        }

    } catch (e) {
        console.error('Error listing models:', e.message);
    }
}

listModels();
