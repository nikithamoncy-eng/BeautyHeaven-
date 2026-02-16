import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Using service role key to bypass RLS issues for verification

async function checkTableHTTP() {
    console.log('Checking processed_messages table via HTTP...');

    // Construct the URL directly for the table
    // Endpoint: /rest/v1/processed_messages
    const url = `${supabaseUrl}/rest/v1/processed_messages?select=*&limit=1`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('SUCCESS: Table exists and is readable.');
            console.log('Data sample:', data);
        } else {
            console.error('ERROR: HTTP Request failed.');
            console.error('Status:', response.status, response.statusText);
            const text = await response.text();
            console.error('Body:', text);
        }
    } catch (error) {
        console.error('Network Error:', error);
    }
}

checkTableHTTP();
