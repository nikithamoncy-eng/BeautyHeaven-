
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabase } from '../src/lib/supabase';

async function testAnalytics() {
    console.log('Testing Analytics Logic...');

    try {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

        // 1. Check conversation_history access
        console.log('1. Checking conversation_history count...');
        const { count, error: countError } = await supabase
            .from('conversation_history')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('[FAIL] conversation_history count:', countError.message);
        } else {
            console.log(`[PASS] conversation_history count: ${count}`);
        }

        // 2. Check conversation_states access
        console.log('2. Checking conversation_states access...');
        const { data: users, error: usersError } = await supabase
            .from('conversation_states')
            .select('user_id'); // Select specific columns to mimic API

        if (usersError) {
            console.error('[FAIL] conversation_states select:', usersError.message);
        } else {
            console.log(`[PASS] conversation_states rows: ${users?.length}`);
        }

        // 3. Check time series query (often a point of failure if date logic is wrong)
        console.log('3. Checking time series query...');
        const { data: timeSeries, error: tsError } = await supabase
            .from('conversation_history')
            .select('created_at')
            .gte('created_at', sevenDaysAgo);

        if (tsError) {
            console.error('[FAIL] Time series query:', tsError.message);
        } else {
            console.log(`[PASS] Time series rows: ${timeSeries?.length}`);
        }

    } catch (e) {
        console.error('[FAIL] Exception:', e);
    }
}

testAnalytics();
