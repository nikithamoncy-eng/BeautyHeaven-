import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const PAGE_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
// Note: INSTAGRAM_USER_ID in env is the Instagram Business Account ID.
// We need the *Facebook Page ID* to check subscribed_apps.
// Often the token can be used to find the Page ID if we call /me.

async function checkSubscriptions() {
    if (!PAGE_ACCESS_TOKEN) {
        console.error('Missing INSTAGRAM_ACCESS_TOKEN');
        return;
    }

    console.log('Checking Facebook Page ID via Token...');
    try {
        // 1. Get the Page ID associated with this token
        const meRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,subscribed_apps`, {
            headers: { 'Authorization': `Bearer ${PAGE_ACCESS_TOKEN}` }
        });

        const meData = await meRes.json();
        console.log('Token Identity:', JSON.stringify(meData, null, 2));

        if (meData.error) {
            console.error('Error fetching identity:', meData.error);
            return;
        }

        const pageId = meData.id;
        console.log(`Page ID: ${pageId} (${meData.name})`);

        // 2. Check Subscribed Apps
        // The 'subscribed_apps' field in /me might already show it, but let's be explicit
        const subsRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}/subscribed_apps`, {
            headers: { 'Authorization': `Bearer ${PAGE_ACCESS_TOKEN}` }
        });
        const subsData = await subsRes.json();

        console.log('Subscribed Apps:', JSON.stringify(subsData, null, 2));

        // 3. If not subscribed, try to subscribe!
        const appName = 'BeautyHeaven'; // Just valid string/logic check
        const isSubscribed = subsData.data && subsData.data.length > 0;

        if (!isSubscribed) {
            console.log('App is NOT subscribed. Attempting to subscribe now...');
            const subRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}/subscribed_apps`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${PAGE_ACCESS_TOKEN}` },
                body: new URLSearchParams({
                    subscribed_fields: 'messages, messaging_postbacks, messaging_optins'
                    // Note: 'messages' field for Page is usually what we want for IG Connect too?
                    // Actually for Instagram Professional, we subscribe via the PAGE to 'messages' field?
                    // Wait, for IG Graph API, we subscribe to the *Page* but we need 'instagram_manage_messages' permission.
                })
            });
            const subData = await subRes.json();
            console.log('Subscription Attempt Result:', JSON.stringify(subData, null, 2));
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

checkSubscriptions();
