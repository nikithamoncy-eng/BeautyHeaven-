
import { supabase } from '../src/lib/supabase';

async function checkAnalyticsTables() {
    console.log('Checking for conversation_history table...');

    // access conversation_history
    const { data, error } = await supabase
        .from('conversation_history')
        .select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error accessing conversation_history:', error);
        if (error.code === '42P01') {
            console.error('CONFIRMED: Table conversation_history does not exist.');
        }
    } else {
        console.log('Success: conversation_history exists.');
    }
}

checkAnalyticsTables();
