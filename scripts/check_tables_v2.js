
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

async function check() {
    const tables = ['conversation_history', 'conversation_states', 'leads', 'processed_messages', 'knowledge_base_vectors'];

    console.log('Checking tables...');

    for (const table of tables) {
        try {
            const { count, error } = await supabase
                .from(table)
                .select('*', { count: 'exact', head: true });

            if (error) {
                console.error(`[FAIL] ${table}:`, error.message);
            } else {
                console.log(`[PASS] ${table} exists. (Rows: ${count})`);
            }
        } catch (e) {
            console.error(`[FAIL] ${table} Exception:`, e.message);
        }
    }
}

check();
