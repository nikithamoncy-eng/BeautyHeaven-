
import { supabase } from '../src/lib/supabase';

async function checkVectorsTable() {
    console.log('Checking for knowledge_base_vectors table...');

    // access knowledge_base_vectors
    const { data, error } = await supabase
        .from('knowledge_base_vectors')
        .select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error accessing knowledge_base_vectors:', error);
    } else {
        console.log('Success: knowledge_base_vectors exists.');
    }
}

checkVectorsTable();
