import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("XAI_API_KEY")

print("🔧 Testing Grok API...")

try:
    client = OpenAI(
        api_key=api_key,
        base_url="https://api.x.ai/v1"   # important for Grok
    )

    print("✅ API configured successfully")

    print("\n🤖 Testing Grok model...")

    response = client.chat.completions.create(
        model="grok-1.5",   # or grok-1 if your key supports it
        messages=[
            {"role": "user", "content": "Hello! Can you hear me?"}
        ],
        max_tokens=100
    )

    print("✅ Success! Response:")
    print(response.choices[0].message.content)

except Exception as e:
    print(f"❌ Error: {e}")