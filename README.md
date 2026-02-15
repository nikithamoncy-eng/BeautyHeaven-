# 💇‍♀️ BeautyHeaven - Salon AI Auto-Responder

An advanced AI-powered Instagram automation tool that handles customer inquiries, qualified leads, and manages conversations 24/7.

## 🌟 Key Features

### 1. **Intelligent Auto-Response (RAG)**
- **Knowledge Base**: Upload your business documents (PDF, TXT, MD) to train the bot.
- **Context-Aware**: Uses Google Gemini AI to generate accurate, human-like responses based *only* on your provided knowledge.
- **Smart Formatting**: Responses are formatted nicely for Instagram Direct Messages.

### 2. **Live Chat & Human Takeover**
- **Real-Time Dashboard**: View all Instagram conversations in a chat-like interface.
- **Seamless Handoff**: Pause the AI for specific users to take over manually.
- **Status Indicators**: See at a glance which chats are handled by AI and which are paused.

### 3. **Lead Generation (Mini-CRM)**
- **Auto-Extraction**: Automatically detects and extracts emails and phone numbers from conversations.
- **Lead Management**: View, track, and export leads (CSV).
- **Status Workflow**: Mark leads as 'New', 'Contacted', 'Qualified', or 'Closed'.

### 4. **Analytics Dashboard**
- **Usage Metrics**: Track total messages, active users, and daily activity.
- **User Insights**: See who is interacting with your bot most frequently.
- **Visual Charts**: Interactive graphs to monitor engagement trends.

### 5. **Bot Playground**
- **Simulation Mode**: Test your bot's responses and persona settings without sending real messages on Instagram.
- **Debug Info**: View the exact context retrieved from your knowledge base for each query.

### 6. **Persona & Customization**
- **Custom Personality**: Define the bot's name, tone, and specific instructions.
- **Business Hours**: (Coming Soon) Set specific times for the bot to be active.

---

## 🛠️ Tech Stack & External Services

### Core Application
- **Frontend**: [Next.js](https://nextjs.org/) (React framework) - For the dashboard and API routes.
- **Styling**: Tailwind CSS - For a modern, responsive UI.
- **Charts**: Recharts - For data visualization.

### Backend & Database
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL) - Stores conversations, leads, and knowledge base vectors.
- **Vector Search**: `pgvector` extension on Supabase - Powers the RAG (Retrieval-Augmented Generation) system.

### AI & Intelligence
- **LLM**: [Google Gemini 1.5 Flash](https://deepmind.google/technologies/gemini/flash/) - The brain behind the responses.
- **Embeddings**: Google Gemini Embedding model - Converts text into vectors for search.

### Integrations
- **Instagram Graph API**: Connects to your Instagram Professional/Business account to send/receive messages.
- **Webhooks**: Real-time event notifications from Meta.

---

## 🔄 How It Works (Workflow)

1.  **User Sends Message**: A user DMs your Instagram account.
2.  **Webhook Trigger**: Instagram sends the message to your `/api/instagram-webhook` endpoint.
3.  **Bot Check**: The system checks if the bot is "Paused" for this user.
    -   **If Paused**: The system does nothing (allows human to reply).
    -   **If Active**: Proceed to step 4.
4.  **Context Retrieval (RAG)**:
    -   The user's message is converted to a vector.
    -   The system searches your Knowledge Base for relevant chunks.
5.  **AI Generation**:
    -   The retrieved context + user message + bot persona are sent to Gemini.
    -   Gemini generates a helpful response.
6.  **Response Delivery**: The generated reply is sent back to the user via Instagram API.
7.  **Lead Extraction**:
    -   In parallel, the system scans the message for contact info (Email/Phone).
    -   If found, it's saved to the CRM (Leads tab).

---

## 🚀 Deployment

The application is optimized for deployment on **Vercel**.
-   **Environment Variables**: Securely stores API keys for Supabase, Google, and Instagram.
-   **Serverless Functions**: API routes run as serverless functions for scalability.
