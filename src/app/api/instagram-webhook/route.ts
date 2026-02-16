import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getInstagramUserProfile } from '@/lib/instagram';
import { processBotResponse } from '@/lib/bot-engine';

// Environment variables
const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN;

// Set max execution time to 60 seconds (Vercel Pro)
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

/**
 * GET - Hub Verification Challenge
 * Instagram sends a GET request to verify the webhook URL.
 */
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            return new NextResponse(challenge, { status: 200 });
        } else {
            return new NextResponse('Forbidden', { status: 403 });
        }
    }

    return new NextResponse('Bad Request', { status: 400 });
}

/**
 * POST - Handle Incoming Events (Messages)
 */
export async function POST(req: Request) {
    try {
        console.log('[Webhook] Received POST request');
        const body = await req.json();
        console.log('[Webhook] POST Body:', JSON.stringify(body, null, 2));

        // Check if this is a page event
        if (body.object === 'instagram' || body.object === 'page') {
            console.log(`[Webhook] Processing object: ${body.object}`);
            for (const entry of body.entry) {
                console.log(`[Webhook] Processing entry: ${JSON.stringify(entry)}`);
                for (const messagingEvent of entry.messaging) {
                    console.log(`[Webhook] Processing messagingEvent: ${JSON.stringify(messagingEvent)}`);

                    // Ignore messages sent by the page itself (echoes)
                    if (messagingEvent.message?.is_echo) {
                        console.log('Ignoring echo message.');
                        continue;
                    }

                    if (messagingEvent.message && messagingEvent.message.text) {
                        const senderId = messagingEvent.sender.id;
                        const messageText = messagingEvent.message.text;
                        const messageId = messagingEvent.message.mid;

                        console.log(`[Webhook] Valid message received. Sender: ${senderId}, Text: "${messageText}"`);

                        // 0. SELF-MESSAGE CHECK
                        // Ignore messages sent by the bot itself to avoid infinite loops
                        const myUserId = process.env.INSTAGRAM_USER_ID;
                        if (senderId === myUserId) {
                            console.log(`[Webhook] Ignoring self-message from ${senderId}`);
                            continue;
                        }

                        // Idempotency: Attempt to insert message_id directly.
                        if (messageId) {
                            const { error: insertError } = await supabase
                                .from('processed_messages')
                                .insert({ message_id: messageId });

                            if (insertError) {
                                // PostgreSQL code 23505 is unique_violation
                                if (insertError.code === '23505') {
                                    console.log(`[Webhook] SKIPPING DUPLICATE message (DB constraint): ${messageId}`);
                                    continue;
                                } else {
                                    console.error('[Webhook] CRITICAL DB ERROR during idempotency check:', insertError);
                                    // STOP PROCESSING. If we can't verify uniqueness, we risk duplicates.
                                    // Better to fail and let Instagram retry (hopefully DB recovers) than to spam replies.
                                    continue;
                                }
                            }
                        }

                        console.log(`[Webhook] ACCEPTED message ${messageId} from ${senderId}: "${messageText.substring(0, 50)}..."`);

                        // 1. Fetch User Profile (Async, don't block too long but we need it for DB)
                        // We do this here to ensure we have the latest info.
                        const userProfile = await getInstagramUserProfile(senderId);
                        console.log(`[Webhook] User Profile fetched: ${JSON.stringify(userProfile)}`);

                        // Upsert Conversation State (Update last_message_at and user details)
                        const upsertData: any = {
                            user_id: senderId,
                            last_message_at: new Date().toISOString()
                        };

                        if (userProfile) {
                            upsertData.user_name = userProfile.name;
                            upsertData.username = userProfile.username;
                            upsertData.profile_pic = userProfile.profile_pic;
                        }

                        const { error: upsertError } = await supabase
                            .from('conversation_states')
                            .upsert(upsertData, { onConflict: 'user_id' });

                        if (upsertError) {
                            console.error('[Webhook] Error upserting conversation state:', upsertError);
                        }

                        // Process the message synchronously to ensure Vercel/Lambda stays alive.
                        // Since we have strict idempotency now, we don't worry about timeouts causing retries (retries will be skipped).
                        try {
                            console.log('[Webhook] Calling processBotResponse...');
                            // Use the new reusable bot engine
                            await processBotResponse(senderId, messageText);
                            console.log('[Webhook] processBotResponse completed.');
                        } catch (err) {
                            console.error('[Process Error]', err);
                        }
                    } else {
                        console.log('[Webhook] Messaging event does not contain text message (maybe attachment/reaction?)');
                    }
                }
            }
            return new NextResponse('EVENT_RECEIVED', { status: 200 });
        } else {
            console.log(`[Webhook] Unknown object type: ${body.object}`);
        }

        return new NextResponse('Not Found', { status: 404 });
    } catch (error: any) {
        console.error('Webhook Error:', error);
        return new NextResponse(error.message, { status: 500 });
    }
}

