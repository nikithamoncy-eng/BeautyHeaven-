
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { supabase } from '../src/lib/supabase';
import { generateEmbedding } from '../src/lib/gemini';

async function testUploadFlow() {
    console.log('Testing Upload Flow (Embedding -> DB Insert)...');

    // 1. Create a dummy knowledge base item
    const { data: item, error: itemError } = await supabase
        .from('knowledge_base_items')
        .insert({
            filename: 'test_script_file.txt',
            content_type: 'text/plain'
        })
        .select()
        .single();

    if (itemError) {
        console.error('[FAIL] Create Item:', itemError.message);
        return;
    }
    console.log('[PASS] Created dummy item:', item.id);

    try {
        // 2. Generate Embedding
        console.log('Generating embedding...');
        const text = 'This is a test sentence for the vector database.';
        const vector = await generateEmbedding(text);
        console.log(`[PASS] Generated vector. Dimensions: ${vector.length}`);

        // 3. Insert into knowledge_base_vectors
        console.log('Inserting into knowledge_base_vectors...');
        const { error: vectorError } = await supabase
            .from('knowledge_base_vectors')
            .insert({
                item_id: item.id,
                content: text,
                embedding: vector
            });

        if (vectorError) {
            console.error('[FAIL] DB Insert Vector:', vectorError.message, vectorError.details, vectorError.hint);
        } else {
            console.log('[PASS] Successfully inserted vector into DB!');
        }

        // Cleanup
        await supabase.from('knowledge_base_items').delete().eq('id', item.id);
        console.log('Cleanup: Deleted dummy item.');

    } catch (e) {
        console.error('[FAIL] Exception:', e);
    }
}

testUploadFlow();
