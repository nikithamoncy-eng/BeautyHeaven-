const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTable() {
    console.log('Inserting test conversation items...');
    const userId = 'test_user_' + Date.now();

    const messages = [
        { user_id: userId, role: 'user', content: 'Hello' },
        { user_id: userId, role: 'assistant', content: 'Hi there!' }
    ];

    const { error } = await supabase
        .from('conversation_history')
        .insert(messages);

    if (error) {
        console.error('Error creating table or inserting:', error);
        if (error.code === '42P01') {
            console.error('TABLE DOES NOT EXIST. Please run the SQL migration manually in Supabase Dashboard SQL Editor.');
            console.log('SQL Content:\n', require('fs').readFileSync('migrations/create_conversation_history.sql', 'utf8'));
        }
    } else {
        console.log('Successfully inserted conversation history. Table exists!');
        // Cleanup
        await supabase.from('conversation_history').delete().eq('user_id', userId);
    }
}

verifyTable();
