const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const token = process.env.INSTAGRAM_ACCESS_TOKEN;
const userId = process.env.INSTAGRAM_USER_ID;

async function check() {
    console.log(`Verifying access to User ID: ${userId} with provided token...`);

    // Try via graph.instagram.com (Basic Display / Professional)
    const url = `https://graph.instagram.com/${userId}?fields=id,username,account_type&access_token=${token}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
            console.error('Error fetching user details:', JSON.stringify(data.error, null, 2));
        } else {
            console.log('Success! User Details:', JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error('Exception during fetch:', e.message);
    }
}

check();
