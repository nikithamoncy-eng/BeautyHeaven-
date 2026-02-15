
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { generateEmbedding } from '../src/lib/gemini';

async function testEmbedding() {
    console.log('Testing generateEmbedding with sample text...');
    try {
        const text = 'This is a sample text for embedding.';
        const vector = await generateEmbedding(text);
        console.log(`Success: Generated vector with ${vector.length} dimensions.`);
    } catch (e) {
        console.error('Embedding Failed:', e);
    }
}

testEmbedding();
