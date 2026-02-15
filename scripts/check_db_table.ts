
import { supabase } from '../src/lib/supabase';

async function checkTables() {
    console.log('Checking for tables in public schema...');

    // We can't easily list tables with supabase-js directly unless we have rpc or use postgrest reflection if enabled.
    // Instead, let's try to select from the specific table that is missing.

    const { data, error } = await supabase
        .from('knowledge_base_items')
        .select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error accessing knowledge_base_items:', error);
        if (error.code === '42P01') { // undefined_table
            console.error('CONFIRMED: Table knowledge_base_items does not exist.');
        }
    } else {
        console.log('Success: knowledge_base_items exists. Count result:', data);
    }
}

checkTables();
