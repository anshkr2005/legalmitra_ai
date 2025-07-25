"""
Test script for Groq API connectivity
Run this script to verify your Groq API key and connection
"""

import sys
import os
from groq import Groq

def test_groq_connection(api_key):
    print(f"🔑 Testing Groq API connection with key: {api_key[:5]}...{api_key[-4:]}")
    
    try:
        # Initialize client
        client = Groq(api_key=api_key)
        print("✅ Groq client initialized successfully")
        
        # Test with a simple prompt
        print("🔄 Sending test request to Groq API...")
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Hello, are you working?"}
            ],
            model="llama3-8b-8192",
            temperature=0.7,
            max_tokens=100,
        )
        
        # Get response
        response = chat_completion.choices[0].message.content
        print(f"✅ Received response from Groq API: '{response}'")
        print("🎉 Groq API connection test successful!")
        return True
        
    except Exception as e:
        print(f"❌ Error testing Groq API: {str(e)}")
        print("🔍 Troubleshooting tips:")
        print("  1. Check if your API key is correct")
        print("  2. Verify your internet connection")
        print("  3. Check if the Groq API is currently available")
        print("  4. Ensure you have the latest groq Python package installed")
        return False

if __name__ == "__main__":
    # Use API key from command line if provided, otherwise use the one from environment
    if len(sys.argv) > 1:
        api_key = sys.argv[1]
    else:
        api_key = os.environ.get('GROQ_API_KEY', 'your_groq_api_key_here')
    
    test_groq_connection(api_key)