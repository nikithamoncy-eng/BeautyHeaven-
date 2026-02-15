
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
    console.error('Missing API Key');
    process.exit(1);
}

async function tryModel(modelName) {
    console.log(`Testing model: ${modelName}...`);
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.embedContent('Hello world');
        console.log(`[SUCCESS] ${modelName} works. Dimensions: ${result.embedding.values.length}`);
        return true;
    } catch (e) {
        console.error(`[FAIL] ${modelName}: ${e.message}`);
        // console.error(JSON.stringify(e, null, 2));
        return false;
    }
}

async function run() {
    // Try text-embedding-004 first
    if (await tryModel('text-embedding-004')) return;

    // Fallback to embedding-001
    if (await tryModel('embedding-001')) return;

    // Fallback to models/text-embedding-004 (explicit resource name)
    if (await tryModel('models/text-embedding-004')) return;

    // Fallback to models/embedding-001
    if (await tryModel('models/embedding-001')) return;

    console.error('[FATAL] No embedding models worked.');
}

run();
