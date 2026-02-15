const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const token = process.env.INSTAGRAM_ACCESS_TOKEN;

async function check() {
    try {
        const res = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type&access_token=${token}`);
        const data = await res.json();
        fs.writeFileSync('ig_token_info.json', JSON.stringify(data, null, 2));
        console.log('Results written to ig_token_info.json');
    } catch (e) {
        fs.writeFileSync('ig_token_info.json', JSON.stringify({ error: e.message }));
    }
}

check();
