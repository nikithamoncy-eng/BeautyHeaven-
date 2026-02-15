const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const token = process.env.INSTAGRAM_ACCESS_TOKEN;

if (!token) {
    console.error('Error: INSTAGRAM_ACCESS_TOKEN not found in .env.local');
    process.exit(1);
}

const fs = require('fs');

async function diagnose() {
    const results = {
        token_preview: token.substring(0, 10) + '...',
        permissions: [],
        user: null,
        pages: []
    };

    // 1. Check Permissions
    try {
        const response = await fetch(`https://graph.facebook.com/v19.0/me/permissions?access_token=${token}`);
        const data = await response.json();
        if (data.error) {
            results.permissions_error = data.error;
        } else if (data.data) {
            results.permissions = data.data.map(p => ({ permission: p.permission, status: p.status }));
        }
    } catch (e) {
        results.permissions_error = e.message;
    }

    // 2. Check User / Page Context
    try {
        const meParams = new URLSearchParams({
            fields: 'id,name,accounts{name,access_token,instagram_business_account}',
            access_token: token
        });
        const meRes = await fetch(`https://graph.facebook.com/v19.0/me?${meParams}`);
        const meData = await meRes.json();

        if (meData.error) {
            results.user_error = meData.error;
        } else {
            results.user = { id: meData.id, name: meData.name };

            let pages = [];
            if (meData.accounts && meData.accounts.data) {
                pages = meData.accounts.data;
            } else {
                const accRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?fields=name,access_token,instagram_business_account&access_token=${token}`);
                const accData = await accRes.json();
                if (accData.data) {
                    pages = accData.data;
                }
            }

            results.pages = pages.map(page => ({
                name: page.name,
                id: page.id,
                ig_business_account: page.instagram_business_account
            }));
        }

    } catch (e) {
        results.user_error = e.message;
    }

    // 3. Check Specific Page (Nikitha Digital Wave)
    try {
        const pageId = '561329063734175';
        const pageRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=name,access_token,instagram_business_account&access_token=${token}`);
        const pageData = await pageRes.json();

        results.specific_page_check = {
            id: pageId,
            data: pageData,
            error: pageData.error
        };
    } catch (e) {
        results.specific_page_check = { error: e.message };
    }

    fs.writeFileSync('diagnosis_result.json', JSON.stringify(results, null, 2));
    console.log('Diagnosis written to diagnosis_result.json');
}

diagnose();
