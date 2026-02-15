import { createClient } from '@supabase/supabase-js';

// Ensure env vars are loaded (fallback for scripts/custom builds)
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase Service Role Key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
