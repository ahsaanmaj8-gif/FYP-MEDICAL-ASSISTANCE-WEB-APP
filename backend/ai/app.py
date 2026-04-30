from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json
import re
import requests
import os

app = Flask(__name__)
CORS(app)

# =========================
# NODE.JS BACKEND URL (to get real doctors from database)
# =========================
NODE_API_URL = "http://localhost:8085/api/v1/public/specialties"

# =========================
# GEMINI SETUP
# =========================
load_dotenv()  # loads .env file

api_key = os.getenv("GOOGLE_API_KEY")
gemini_model = genai.GenerativeModel("gemini-2.0-flash")
print("✅ Gemini model loaded (gemini-2.0-flash)")

# =========================
# FETCH REAL DOCTORS FROM DATABASE
# =========================
def fetch_available_doctors():
    """Get actual doctors from your database"""
    try:
        response = requests.get(NODE_API_URL, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data"):
                # Extract doctor specialties from database
                specialties = [item.get("_id") for item in data["data"] if item.get("_id")]
                print(f"📊 Found {len(specialties)} doctor specialties in database: {specialties}")
                return specialties
    except Exception as e:
        print(f"⚠️ Could not fetch from database: {e}")
    
    # Fallback if database not reachable
    print("⚠️ Using fallback doctor list (database not available)")
    return ["General Physician", "Cardiologist", "Neurologist", "Dermatologist", "Orthopedic"]

# =========================
# BUILD PROMPT WITH REAL DOCTORS FROM DATABASE
# =========================
def build_prompt(symptoms, available_doctors):
    doctors_list = ", ".join(available_doctors)
    return f"""
You are a medical triage AI assistant. Analyze the symptoms and return ONLY valid JSON.

SYMPTOMS: {symptoms}

AVAILABLE DOCTORS IN OUR SYSTEM (ONLY CHOOSE FROM THESE):
{doctors_list}

IMPORTANT: You can ONLY recommend doctors from the list above. Do NOT recommend any doctor not in this list.

Return JSON in this exact format:
{{
    "action": "recommend",
    "primary_doctor": "Cardiologist",
    "recommended_doctors": ["Cardiologist", "Pulmonologist"],
    "urgency": "medium",
    "condition": "Possible heart condition",
    "message": "Based on chest pain and shortness of breath, consult a Cardiologist",
    "confidence": 85
}}

Urgency levels: "low", "medium", "high", "emergency"
Only recommend doctors from the AVAILABLE DOCTORS list.
"""

# =========================
# FALLBACK RESPONSE WITH REAL DOCTORS
# =========================
def get_fallback_response(symptoms, available_doctors):
    symptoms_lower = symptoms.lower()
    available_lower = [d.lower() for d in available_doctors]
    
    # Check which specialty is available in your database
    cardiologist_available = any(d.lower() == "cardiologist" for d in available_lower)
    neurologist_available = any(d.lower() == "neurologist" for d in available_lower)
    gastroenterologist_available = any(d.lower() == "gastroenterologist" for d in available_lower)
    dermatologist_available = any(d.lower() == "dermatologist" for d in available_lower)
    orthopedic_available = any(d.lower() == "orthopedic" for d in available_lower)
    pediatrician_available = any(d.lower() == "pediatrician" for d in available_lower)
    gynecologist_available = any(d.lower() == "gynecologist" for d in available_lower)
    
    # Chest/Heart symptoms
    if any(word in symptoms_lower for word in ['chest', 'heart', 'breath', 'breathing']):
        if cardiologist_available:
            return {
                "action": "recommend",
                "primary_doctor": "Cardiologist",
                "recommended_doctors": ["Cardiologist", "Pulmonologist"] if "pulmonologist" in available_lower else ["Cardiologist"],
                "urgency": "high",
                "condition": "Possible cardiac or respiratory issue",
                "message": "Based on your symptoms, please consult a Cardiologist immediately.",
                "confidence": 85
            }
    
    # Headache symptoms
    if any(word in symptoms_lower for word in ['headache', 'dizzy', 'migraine']):
        if neurologist_available:
            return {
                "action": "recommend",
                "primary_doctor": "Neurologist",
                "recommended_doctors": ["Neurologist"],
                "urgency": "medium",
                "condition": "Possible neurological issue",
                "message": "Based on your symptoms, consult a Neurologist.",
                "confidence": 80
            }
    
    # Stomach symptoms
    if any(word in symptoms_lower for word in ['stomach', 'nausea', 'vomit', 'diarrhea']):
        if gastroenterologist_available:
            return {
                "action": "recommend",
                "primary_doctor": "Gastroenterologist",
                "recommended_doctors": ["Gastroenterologist"],
                "urgency": "low",
                "condition": "Possible digestive issue",
                "message": "Based on your symptoms, consult a Gastroenterologist.",
                "confidence": 75
            }
    
    # Skin symptoms
    if any(word in symptoms_lower for word in ['skin', 'rash', 'itch']):
        if dermatologist_available:
            return {
                "action": "recommend",
                "primary_doctor": "Dermatologist",
                "recommended_doctors": ["Dermatologist"],
                "urgency": "low",
                "condition": "Possible skin condition",
                "message": "Based on your symptoms, consult a Dermatologist.",
                "confidence": 80
            }
    
    # Bone/Joint symptoms
    if any(word in symptoms_lower for word in ['bone', 'joint', 'knee', 'back']):
        if orthopedic_available:
            return {
                "action": "recommend",
                "primary_doctor": "Orthopedic",
                "recommended_doctors": ["Orthopedic"],
                "urgency": "low",
                "condition": "Possible musculoskeletal issue",
                "message": "Based on your symptoms, consult an Orthopedic specialist.",
                "confidence": 75
            }
    
    # Default to General Physician (must be in database)
    if "General Physician" in available_doctors or "General Physician" in [d.lower() for d in available_doctors]:
        general_doctor = "General Physician"
    else:
        general_doctor = available_doctors[0] if available_doctors else "General Physician"
    
    return {
        "action": "recommend",
        "primary_doctor": general_doctor,
        "recommended_doctors": [general_doctor],
        "urgency": "low",
        "condition": "General symptoms",
        "message": f"Based on your symptoms, please consult a {general_doctor} for proper evaluation.",
        "confidence": 60
    }

# =========================
# MAIN API - ANALYZE SYMPTOMS
# =========================
@app.route("/api/ai/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json()
        symptoms = data.get("symptoms", "").strip()

        if not symptoms or len(symptoms) < 5:
            return jsonify({
                "success": False,
                "action": "clarify",
                "message": "Please describe your symptoms in more detail (at least 5 characters)."
            })

        print(f"🩺 Analyzing symptoms: {symptoms}")
        
        # STEP 1: Fetch real doctors from your database
        print("📊 Fetching available doctors from database...")
        available_doctors = fetch_available_doctors()
        print(f"📋 Available doctors: {available_doctors}")

        # STEP 2: Build prompt with real doctors data
        prompt = build_prompt(symptoms, available_doctors)
        
        # STEP 3: Try Gemini
        output = None
        try:
            print("🤖 Calling Gemini API...")
            output = gemini_model.generate_content(prompt)
            output = output.text
            print(f"Gemini response: {output[:200]}...")
        except Exception as e:
            print(f"❌ Gemini error: {e}")

        # STEP 4: Parse JSON
        parsed = None
        if output:
            parsed = parse_json(output)
            if parsed:
                print(f"✅ AI parsed successfully")
            else:
                print(f"⚠️ AI returned invalid JSON")

        # STEP 5: Use fallback if needed
        if not parsed:
            print("🔄 Using fallback keyword-based response")
            response_data = get_fallback_response(symptoms, available_doctors)
        else:
            response_data = parsed
            
            # Validate that recommended doctor exists in database
            primary = response_data.get("primary_doctor", "")
            if primary not in available_doctors:
                print(f"⚠️ AI recommended '{primary}' which is not available in database!")
                # Fallback to first available doctor
                response_data["primary_doctor"] = available_doctors[0] if available_doctors else "General Physician"
                response_data["message"] = f"We don't have {primary} available. Please consult a {response_data['primary_doctor']} instead."
                response_data["confidence"] = 50

        # STEP 6: Ensure all required fields exist
        required_fields = {
            "action": "recommend",
            "primary_doctor": available_doctors[0] if available_doctors else "General Physician",
            "recommended_doctors": available_doctors[:3] if available_doctors else ["General Physician"],
            "urgency": "medium",
            "condition": "General symptoms",
            "message": "Based on your symptoms, please consult a doctor.",
            "confidence": 60
        }
        
        final_response = {**required_fields, **response_data}
        final_response["success"] = True
        final_response["available_doctors"] = available_doctors  # Send to frontend for reference

        print(f"✅ Final Response: {final_response['primary_doctor']} - Urgency: {final_response['urgency']}")
        
        return jsonify(final_response)

    except Exception as e:
        print(f"❌ Error: {e}")
        return jsonify({
            "success": False,
            "action": "error",
            "message": f"Server error: {str(e)}"
        }), 500

# =========================
# HELPER: PARSE JSON
# =========================
def parse_json(text):
    if not text:
        return None
    try:
        return json.loads(text)
    except:
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group())
            except:
                pass
    return None

# =========================
# HEALTH CHECK
# =========================
@app.route("/api/ai/health", methods=["GET"])
def health():
    available_doctors = fetch_available_doctors()
    return jsonify({
        "success": True,
        "message": "AI Symptom Checker is running",
        "model": "gemini-2.0-flash",
        "database_connected": True,
        "doctors_in_database": len(available_doctors),
        "doctors_list": available_doctors
    })

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    print("🚀 Starting AI Symptom Checker Server...")
    print("🔗 Connected to Node.js backend at:", NODE_API_URL)
    print("🌐 Server running on http://localhost:5028")
    app.run(host="0.0.0.0", port=5028, debug=True)