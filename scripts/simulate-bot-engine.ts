
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { processBotResponse } from '../src/lib/bot-engine';

// Mock the processBotResponse function execution because we can't easily mock the Next.js Request object for the full route test without a server.
// But testing the engine is better because that's where the logic fails if DB/Gemini is broken.

async function simulateEngine() {
    console.log('Simulating Bot Engine Logic directly...');

    // Use a fake sender ID (must be different from INSTAGRAM_USER_ID to avoid self-loop check)
    const senderId = '1234567890123456';
    const messageText = 'Hello, I want to book an appointment.';

    try {
        console.log(`Sending message from ${senderId}: "${messageText}"`);
        await processBotResponse(senderId, messageText);
        console.log('Bot Engine finished execution.');
    } catch (e) {
        console.error('Bot Engine Failed:', e);
    }
}

simulateEngine();
