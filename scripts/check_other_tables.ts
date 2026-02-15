
import { supabase } from '../src/lib/supabase';

async function checkTables() {
    const tables = ['leads', 'conversation_states', 'processed_messages'];

    for (const table of tables) {
        console.log(`Checking for ${table}...`);
        const { error } = await supabase
            .from(table)
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.error(`Error accessing ${table}:`, error.code, error.message);
        } else {
            console.log(`Success: ${table} exists.`);
        }
    }
}

checkTables();
