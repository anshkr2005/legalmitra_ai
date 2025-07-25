"""
Fallback script using OpenAI API instead of Groq
This can be used if Groq API is not working
"""

from flask import Flask, render_template, request, jsonify
import os
import json
from datetime import datetime
import uuid
import openai

# Initialize Flask app
app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

# Replace with your OpenAI API key
# You can get one from https://platform.openai.com/api-keys
OPENAI_API_KEY = "your-openai-api-key-here"
openai.api_key = OPENAI_API_KEY

# System prompt for Indian legal assistant (same as in app.py)
SYSTEM_PROMPT = """You are LegalMitra, an AI legal assistant specialized in Indian law..."""

# In-memory chat session store
chat_sessions = {}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat')
def chat():
    return render_template('chat.html')

@app.route('/api/chat', methods=['POST'])
def chat_api():
    try:
        data = request.get_json()
        message = data.get('message', '')
        session_id = data.get('session_id', str(uuid.uuid4()))
        
        print(f"📝 Received message: '{message[:50]}...' (session: {session_id})")

        # ❗ Reject non-legal queries
        if not is_legal_query(message):
            print(f"⚠️ Non-legal query rejected: '{message[:50]}...'")
            return jsonify({
                'response': "⚖️ LegalMitra only answers questions about Indian law. Please rephrase your query to include a legal context.",
                'session_id': session_id,
                'timestamp': datetime.now().isoformat()
            })

        if session_id not in chat_sessions:
            chat_sessions[session_id] = []

        chat_sessions[session_id].append({
            "role": "user",
            "content": message
        })

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        messages.extend(chat_sessions[session_id])
        
        print(f"🔄 Calling OpenAI API with {len(messages)} messages...")
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.7,
                max_tokens=1000
            )
            
            ai_response = response.choices[0].message.content
            print(f"✅ Received response from OpenAI API: '{ai_response[:50]}...'")

            chat_sessions[session_id].append({
                "role": "assistant",
                "content": ai_response
            })

            return jsonify({
                'response': ai_response,
                'session_id': session_id,
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as api_error:
            print(f"❌ OpenAI API error: {str(api_error)}")
            return jsonify({
                'response': f"Sorry, I encountered an error while processing your request: {str(api_error)}. Please try again.",
                'session_id': session_id,
                'error': str(api_error),
                'timestamp': datetime.now().isoformat()
            }), 500

    except Exception as e:
        print(f"❌ General error in chat_api: {str(e)}")
        return jsonify({
            'error': str(e),
            'message': "An unexpected error occurred. Please try again."
        }), 500

# Basic keyword filter for legal-related queries (same as in app.py)
LEGAL_KEYWORDS = [
    'ipc', 'crpc', 'cpc', 'constitution', 'section', 'legal notice', 'bail', 'divorce',
    # ... rest of your keywords
]

def is_legal_query(message):
    msg = message.lower()
    return any(keyword in msg for keyword in LEGAL_KEYWORDS)

if __name__ == '__main__':
    print("🚀 Starting LegalMitra AI Server with OpenAI fallback...")
    print(f"📝 System prompt length: {len(SYSTEM_PROMPT)} characters")
    print(f"🔑 OpenAI API key: {'Configured' if OPENAI_API_KEY != 'your-openai-api-key-here' else 'Not configured'}")
    print(f"🔍 Legal keywords count: {len(LEGAL_KEYWORDS)}")
    print("⚖️ LegalMitra is ready to provide legal assistance!")
    app.run(debug=True, host='0.0.0.0', port=5000)
