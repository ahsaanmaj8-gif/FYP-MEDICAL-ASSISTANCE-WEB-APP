# test_gemini.py - Test Gemini API connectivity
import google.generativeai as genai

# Your API key
API_KEY = "AIzaSyAXjRhlDd-jhnYng1QOB54CIQqaZAZbBNo"

print("🔧 Testing Gemini API...")

try:
    # Configure the API
    genai.configure(api_key=API_KEY)
    print("✅ API configured successfully")

    # List available models
    print("\n📋 Available models:")
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"  - {model.name}")

    # Test with gemini-1.5-flash
    print("\n🤖 Testing gemini-1.5-flash...")
    # model = genai.GenerativeModel("gemini-1.5-flash")
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content("Hello! Can you hear me?")
    
    print(f"✅ Success! Response: {response.text}")

except Exception as e:
    print(f"❌ Error: {e}")