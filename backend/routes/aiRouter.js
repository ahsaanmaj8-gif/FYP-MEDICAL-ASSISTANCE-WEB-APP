// const express = require("express");
// const axios = require("axios");
// const router = express.Router();

// // HuggingFace API Configuration
// const HF_TOKEN = process.env.HF_TOKEN;
// const HF_MODEL_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli";

// // Doctor categories with keywords for better matching
// const DOCTOR_CATEGORIES = [
//   "Cardiologist - heart disease, chest pain, heart attack, blood pressure, arrhythmia",
//   "Dermatologist - skin rash, acne, eczema, skin infection, psoriasis, allergy",
//   "Neurologist - headache, migraine, seizure, brain, nerve pain, dizziness",
//   "Orthopedic - bone pain, joint pain, back pain, fracture, spine, arthritis",
//   "Gastroenterologist - stomach pain, digestion, liver, nausea, vomiting, acidity",
//   "Psychiatrist - depression, anxiety, mental health, stress, insomnia, panic",
//   "ENT Specialist - ear pain, throat infection, nose, sinus, tonsil, hearing loss",
//   "Gynecologist - women health, pregnancy, menstrual, ovary, uterus, PCOD",
//   "Urologist - kidney stone, urinary infection, bladder, prostate, urine",
//   "General Physician - fever, cold, flu, fatigue, general illness, body pain",
// ];

// // Clean label name (remove description)
// const cleanLabel = (label) => label.split(" - ")[0];

// // Get doctor counts from database
// const getDoctorCounts = async () => {
//   const Doctor = require('../models/Doctor');
//   const counts = {};
  
//   for (const category of DOCTOR_CATEGORIES) {
//     const cleanName = cleanLabel(category);
//     const count = await Doctor.countDocuments({ 
//       specialization: { $regex: new RegExp(cleanName, 'i') },
//       isVerified: true,
//       isActive: true
//     });
//     counts[cleanName] = count;
//   }
  
//   return counts;
// };

// // AI Classification Route
// router.post("/classify-doctor", async (req, res) => {
//   const { symptom } = req.body;

//   if (!symptom) {
//     return res.status(400).json({ error: "Symptom is required" });
//   }

//   if (!HF_TOKEN || HF_TOKEN === "your_huggingface_token_here") {
//     return res.status(500).json({ error: "HF_TOKEN is missing in .env file" });
//   }

//   try {
//     const medicalPrompt = `Patient medical symptom: ${symptom}. Which medical specialist should this patient visit?`;

//     const response = await axios.post(
//       HF_MODEL_URL,
//       {
//         inputs: medicalPrompt,
//         parameters: { candidate_labels: DOCTOR_CATEGORIES },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${HF_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         timeout: 50000,
//       }
//     );

//     const result = response.data;

//     if (!Array.isArray(result)) {
//       if (result.error && result.error.includes("loading")) {
//         return res.status(503).json({
//           error: "Model is loading. Please wait 20 seconds and try again.",
//         });
//       }
//       return res.status(500).json({ error: "Unexpected response", raw: result });
//     }

//     // Sort by score and get top 3
//     const sorted = result.sort((a, b) => b.score - a.score);
//     const top3 = sorted.slice(0, 3);
    
//     // Get real doctor counts from database
//     const doctorCounts = await getDoctorCounts();

//     // Format response with real counts
//     const formattedTop3 = top3.map((item) => {
//       const category = cleanLabel(item.label);
//       return {
//         category: category,
//         count: doctorCounts[category] || 0,
//         score: Math.round(item.score * 100)
//       };
//     });

//     res.json({
//       success: true,
//       best_match: formattedTop3[0],
//       recommendations: formattedTop3,
//       all_categories: Object.entries(doctorCounts).map(([name, count]) => ({
//         category: name,
//         count: count
//       })).sort((a, b) => b.count - a.count)
//     });

//   } catch (err) {
//     console.error("AI Classification Error:", err.message);
    
//     // Fallback: Return all categories with real counts
//     const doctorCounts = await getDoctorCounts();
//     const allCategories = Object.entries(doctorCounts).map(([name, count]) => ({
//       category: name,
//       count: count
//     })).sort((a, b) => b.count - a.count);

//     res.status(200).json({
//       success: true,
//       best_match: allCategories[0] || { category: "General Physician", count: 0 },
//       recommendations: allCategories.slice(0, 3),
//       all_categories: allCategories,
//       fallback: true
//     });
//   }
// });

// // Get all categories with doctor counts
// router.get("/categories", async (req, res) => {
//   try {
//     const doctorCounts = await getDoctorCounts();
//     const categories = Object.entries(doctorCounts).map(([name, count]) => ({
//       category: name,
//       count: count
//     })).sort((a, b) => b.count - a.count);
    
//     res.json({ success: true, categories });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;







const express = require("express");
const axios = require("axios");
const router = express.Router();

// HuggingFace API Configuration
const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli";

// Claude API Configuration
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

// Timeout settings
const HF_TIMEOUT = 5000; // 5 seconds timeout for HuggingFace

// Doctor categories
const DOCTOR_CATEGORIES = [
  "Cardiologist - heart disease, chest pain, heart attack, blood pressure, arrhythmia",
  "Dermatologist - skin rash, acne, eczema, skin infection, psoriasis, allergy",
  "Neurologist - headache, migraine, seizure, brain, nerve pain, dizziness",
  "Orthopedic - bone pain, joint pain, back pain, fracture, spine, arthritis",
  "Gastroenterologist - stomach pain, digestion, liver, nausea, vomiting, acidity",
  "Psychiatrist - depression, anxiety, mental health, stress, insomnia, panic",
  "ENT Specialist - ear pain, throat infection, nose, sinus, tonsil, hearing loss",
  "Gynecologist - women health, pregnancy, menstrual, ovary, uterus, PCOD",
  "Urologist - kidney stone, urinary infection, bladder, prostate, urine",
  "General Physician - fever, cold, flu, fatigue, general illness, body pain",
];

const SPECIALIST_NAMES = [
  "Cardiologist", "Dermatologist", "Neurologist", "Orthopedic",
  "Gastroenterologist", "Psychiatrist", "ENT Specialist", "Gynecologist",
  "Urologist", "General Physician"
];

// Clean label name
const cleanLabel = (label) => label.split(" - ")[0];

// Get doctor counts from database
const getDoctorCounts = async () => {
  const Doctor = require('../models/Doctor');
  const counts = {};
  
  for (const category of DOCTOR_CATEGORIES) {
    const cleanName = cleanLabel(category);
    const count = await Doctor.countDocuments({ 
      specialization: { $regex: new RegExp(cleanName, 'i') },
      isVerified: true,
      isActive: true
    });
    counts[cleanName] = count;
  }
  
  return counts;
};

// Call HuggingFace API with timeout
const callHuggingFace = async (symptom) => {
  const medicalPrompt = `Patient medical symptom: ${symptom}. Which medical specialist should this patient visit?`;
  
  try {
    const response = await axios.post(
      HF_MODEL_URL,
      {
        inputs: medicalPrompt,
        parameters: { candidate_labels: DOCTOR_CATEGORIES },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: HF_TIMEOUT,
      }
    );
    
    return { success: true, data: response.data };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return { success: false, error: 'TIMEOUT', message: 'HuggingFace API timeout' };
    }
    return { success: false, error: error.message };
  }
};


const callClaudeAPI = async (symptom) => {
  if (!CLAUDE_API_KEY || CLAUDE_API_KEY === "your_claude_api_key_here") {
    console.log("Claude API key not configured");
    return { success: false, error: 'Claude API key not configured' };
  }
  
  try {
   
    const prompt = `Given the medical symptoms: "${symptom}", select the TOP 3 most appropriate doctor specialties from this list: ${SPECIALIST_NAMES.join(', ')}. 
    
Return ONLY a JSON object in this exact format, no other text:
{
  "primary_doctor": "Cardiologist",
  "secondary_doctor": "Pulmonologist", 
  "tertiary_doctor": "General Physician",
  "confidence": 85
}

Choose ONLY from the available specialties. Rank them by relevance.`;
    
    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: "claude-haiku-4-5-20251001",
        max_tokens: 150,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        timeout: 15000,
      }
    );
    
    let resultText = response.data.content[0].text.trim();
    // console.log("Claude response:", resultText);
    
    // ✅ Parse JSON to get top 3
    let parsedData = null;
    try {
      // Extract JSON from response
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error("JSON parse error:", e);
    }
    
    if (parsedData) {
      const recommendations = [
        parsedData.primary_doctor,
        parsedData.secondary_doctor,
        parsedData.tertiary_doctor
      ].filter(Boolean); // Remove any undefined/null
      
      // Validate recommendations are in our list
      const validRecommendations = recommendations.filter(r => 
        SPECIALIST_NAMES.some(s => s.toLowerCase() === r?.toLowerCase())
      );
      
      if (validRecommendations.length > 0) {
        return {
          success: true,
          data: {
            primary_doctor: validRecommendations[0],
            recommended_doctors: validRecommendations.slice(1),
            confidence: parsedData.confidence || 85
          }
        };
      }
    }
    
    // Fallback: keyword matching for top 3
    const matchedSpecialties = [];
    const symptomLower = symptom.toLowerCase();
    
    // Simple keyword matching for top 3 if claude fail
    const keywordMap = {
     'cardiologist': ['chest', 'heart', 'blood pressure', 'cardiac'],
  'dermatologist': ['skin', 'rash', 'acne', 'eczema', 'allergy'],
  'neurologist': ['headache', 'migraine', 'brain', 'dizzy', 'seizure'],
  'orthopedic': ['bone', 'joint', 'back pain', 'fracture', 'knee'],
  'gastroenterologist': ['stomach', 'nausea', 'vomit', 'digestion'],
  'psychiatrist': ['depression', 'anxiety', 'stress', 'mental', 'insomnia'],
  'ent specialist': ['ear', 'throat', 'nose', 'sinus', 'hearing'],
  'gynecologist': ['pregnancy', 'menstrual', 'women', 'ovary', 'period'],
  'urologist': ['kidney stone', 'urine', 'bladder', 'prostate'],
  'general physician': ['fever', 'cold', 'flu', 'fatigue', 'body pain'],
  'pediatrician': ['child', 'baby', 'kid', 'infant', 'vaccination'],
  'ophthalmologist': ['eye', 'vision', 'blurry', 'red eye', 'glasses'],
  'dentist': ['tooth', 'gum', 'teeth', 'cavity', 'dental'],
  'endocrinologist': ['diabetes', 'thyroid', 'hormone', 'sugar', 'insulin'],
  'rheumatologist': ['arthritis', 'joint swelling', 'autoimmune', 'lupus'],
  'nephrologist': ['kidney', 'renal', 'dialysis', 'creatinine'],
  'hematologist': ['blood', 'anemia', 'clotting', 'hemoglobin', 'platelets']
    };
    
    for (const [specialty, keywords] of Object.entries(keywordMap)) {
      if (keywords.some(k => symptomLower.includes(k))) {
        const matched = SPECIALIST_NAMES.find(s => s.toLowerCase() === specialty);
        if (matched) matchedSpecialties.push(matched);
      }
    }
    
    if (matchedSpecialties.length >= 3) {
      return {
        success: true,
        data: {
          primary_doctor: matchedSpecialties[0],
          recommended_doctors: matchedSpecialties.slice(1, 3),
          confidence: 75
        }
      };
    }
    
    return { success: false, error: 'Could not parse Claude response' };
    
  } catch (error) {
    console.error("Claude API Error:", error.response?.data || error.message);
    return { success: false, error: error.message };
  }
};

// AI Classification Route
router.post("/classify-doctor", async (req, res) => {
  const { symptom } = req.body;
  const startTime = Date.now();

  if (!symptom) {
    return res.status(400).json({ error: "Symptom is required" });
  }

  console.log(`🩺 Analyzing symptoms: "${symptom}"`);

  try {
    // Try HuggingFace first
    const hfResult = await callHuggingFace(symptom);
    const elapsedTime = Date.now() - startTime;
    
    // console.log(`⏱️ HuggingFace response time: ${elapsedTime}ms`);
    
    if (hfResult.success && Array.isArray(hfResult.data) && hfResult.data.length > 0) {
      const sorted = hfResult.data.sort((a, b) => b.score - a.score);
      const top3 = sorted.slice(0, 3);
      const doctorCounts = await getDoctorCounts();
      
      const formattedTop3 = top3.map((item) => {
        const category = cleanLabel(item.label);
        return {
          category: category,
          count: doctorCounts[category] || 0,
          score: Math.round(item.score * 100)
        };
      });
      
      return res.json({
        success: true,
        best_match: formattedTop3[0],
        recommendations: formattedTop3,
        all_categories: Object.entries(doctorCounts).map(([name, count]) => ({
          category: name,
          count: count
        })).sort((a, b) => b.count - a.count),
        provider: "huggingface",
        response_time: elapsedTime
      });
    }
    
    // If HuggingFace failed, try Claude
    // console.log("🔄 HuggingFace failed, falling back to Claude API...");
    
    const claudeResult = await callClaudeAPI(symptom);
    const claudeTime = Date.now() - startTime;
    
    if (claudeResult.success && claudeResult.data) {
      const claudeData = claudeResult.data;
      const doctorCounts = await getDoctorCounts();
      
      const recommendations = [
        {
          category: claudeData.primary_doctor,
          count: doctorCounts[claudeData.primary_doctor] || 0,
          score: 85
        },
        ...(claudeData.recommended_doctors || []).slice(1, 3).map((cat, idx) => ({
          category: cat,
          count: doctorCounts[cat] || 0,
          score: 70 - (idx * 10)
        }))
      ];
      
      return res.json({
        success: true,
        best_match: recommendations[0],
        recommendations: recommendations.slice(0, 3),
        all_categories: Object.entries(doctorCounts).map(([name, count]) => ({
          category: name,
          count: count
        })).sort((a, b) => b.count - a.count),
        provider: "claude",
        response_time: claudeTime
      });
    }
    
    // Both APIs failed, use database fallback
    // console.log("⚠️ Both APIs failed, using database fallback");
    const doctorCounts = await getDoctorCounts();
    const allCategories = Object.entries(doctorCounts).map(([name, count]) => ({
      category: name,
      count: count
    })).sort((a, b) => b.count - a.count);
    
    res.json({
      success: true,
      best_match: allCategories[0] || { category: "General Physician", count: 0 },
      recommendations: allCategories.slice(0, 3),
      all_categories: allCategories,
      fallback: true,
      provider: "fallback",
      response_time: Date.now() - startTime
    });
    
  } catch (error) {
    console.error("AI Classification Error:", error.message);
    
    // Ultimate fallback
    const doctorCounts = await getDoctorCounts();
    const allCategories = Object.entries(doctorCounts).map(([name, count]) => ({
      category: name,
      count: count
    })).sort((a, b) => b.count - a.count);
    
    res.status(200).json({
      success: true,
      best_match: allCategories[0] || { category: "General Physician", count: 0 },
      recommendations: allCategories.slice(0, 3),
      all_categories: allCategories,
      fallback: true,
      error: error.message
    });
  }
});

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const doctorCounts = await getDoctorCounts();
    const categories = Object.entries(doctorCounts).map(([name, count]) => ({
      category: name,
      count: count
    })).sort((a, b) => b.count - a.count);
    
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
router.get("/health", async (req, res) => {
  res.json({
    success: true,
    huggingface_configured: !!(HF_TOKEN && HF_TOKEN !== "your_huggingface_token_here"),
    claude_configured: !!(CLAUDE_API_KEY && CLAUDE_API_KEY !== "your_claude_api_key_here"),
    timeout_settings: `${HF_TIMEOUT}ms`
  });
});

module.exports = router;