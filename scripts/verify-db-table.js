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

async function checkTable() {
    console.log('Checking processed_messages table...');
    const testId = 'test_check_' + Date.now();

    // Attempt insert
    const { error } = await supabase
        .from('processed_messages')
        .insert({ message_id: testId });

    if (error) {
        console.error('Error inserting test row:', error);
        if (error.code === '42P01') {
            console.error('TABLE DOES NOT EXIST! (Code 42P01)');
        }
    } else {
        console.log('Successfully inserted test row. Table exists.');
        // Cleanup
        await supabase.from('processed_messages').delete().eq('message_id', testId);
    }
}

checkTable();
