
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load env
const envConfig = dotenv.config({ path: '.env.local' });
if (envConfig.error) {
    console.error('Error loading .env.local:', envConfig.error);
    process.exit(1);
}

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
    console.error('Missing GOOGLE_GEMINI_API_KEY');
    process.exit(1);
}

async function test() {
    console.log('Testing Gemini Embedding with API Key:', apiKey.substring(0, 10) + '...');
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'models/gemini-embedding-001' });

        const text = 'Hello world';
        const result = await model.embedContent(text);
        const embedding = result.embedding;

        console.log('Success! Embedding generated.');
        console.log('Dimensions:', embedding.values.length);
    } catch (e) {
        console.error('Embedding Failed:', e.message);
        if (e.response) {
            console.error('Response:', JSON.stringify(e.response, null, 2));
        }
    }
}

test();
