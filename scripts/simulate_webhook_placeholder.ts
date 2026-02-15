
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function simulateWebhook() {
    console.log('Simulating Instagram Webhook Event...');

    // Mock Payload for a text message "Hello bot"
    // ID reference: https://developers.facebook.com/docs/instagram-basic-display-api/reference/media
    const payload = {
        "object": "instagram",
        "entry": [
            {
                "id": "17841479987922326", // The User's IG Business ID
                "time": 1739000000,
                "messaging": [
                    {
                        "sender": {
                            "id": "1234567890123456" // Fake sender PSID
                        },
                        "recipient": {
                            "id": "17841479987922326"
                        },
                        "timestamp": 1739000000,
                        "message": {
                            "mid": "m_fake_message_id_123",
                            "text": "Hello, do you have appointments?"
                        }
                    }
                ]
            }
        ]
    };

    try {
        // We'll hit the localhost endpoint. Ensure the dev server is NOT running or use a port that IS running if user has it open.
        // Since I can't start the server easily and keep it running while running this script safely without blocking, 
        // I will invoke the handler logic directly OR mock the fetch.
        // Actually, invoking the handler directly is hard because of Next.js Request object.

        // Let's assume the user might not have the server running.
        // I will try to use the `bot-engine.ts` logic directly which the webhook calls.

        const { handleIncomingMessage } = require('../src/lib/bot-engine');

        console.log('Invoking bot engine directly...');
        // We need to mock the extracted message details that the route passes to the engine.
        // Looking at route.ts (I need to read it first to know how it calls bot-engine).

        // Wait, I haven't read route.ts yet in this step (it's in parallel). 
        // I'll write a generic fetch to localhost:3000 for now, hoping user has server running?
        // No, I should verify the code logic first.

        // Better: I will output this to a file and run it AFTER reading route.ts.
    } catch (e) {
        console.error(e);
    }
}
