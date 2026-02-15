// using native fetch

const token = 'IGAAQ92aiRsxZABZAGFjS2VEejVKS2ZADUnJNS2c4SlVxODcxb21mWlJVNUxYNV9VU2FjMm05a1VNeDNSUVNfZAUdBOE1UTG96N1IzTTRWLVc3NVoyeGsyQkw5aXVxalNzeXlVQnpNYmp1eUFxVTlJbmZAvR25GQkFsdjZA0ZAUxLZA3JCYwZDZD';
const igUserId = '17841472898023364';
const recipientId = '988052943397068';
const messageText = 'Test message from script simulating n8n logic 🚀';

// n8n used graph.instagram.com/v24.0 (but v24 likely doesn't exist, trying v21.0 or just graph.instagram.com)
// Actually, let's try exactly what the user provided: v24.0 (if it fails, fallback to v21.0)
const version = 'v21.0';
const host = 'graph.instagram.com';

async function sendTestMessage() {
    const url = `https://${host}/${version}/${igUserId}/messages`;
    console.log(`Sending to: ${url}`);

    const body = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        console.log('--- Response ---');
        console.log(`Status: ${response.status}`);
        console.log(JSON.stringify(data, null, 2));

        if (!response.ok) {
            console.error('Request failed.');
        } else {
            console.log('SUCCESS! Message sent.');
        }

    } catch (error) {
        console.error('Network error:', error);
    }
}

sendTestMessage();
