const express = require("express");
const axios = require("axios");
const router = express.Router();

// HuggingFace API Configuration
const HF_TOKEN = process.env.HF_TOKEN;
const HF_MODEL_URL = "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli";

// Doctor categories with keywords for better matching
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

// Clean label name (remove description)
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

// AI Classification Route
router.post("/classify-doctor", async (req, res) => {
  const { symptom } = req.body;

  if (!symptom) {
    return res.status(400).json({ error: "Symptom is required" });
  }

  if (!HF_TOKEN || HF_TOKEN === "your_huggingface_token_here") {
    return res.status(500).json({ error: "HF_TOKEN is missing in .env file" });
  }

  try {
    const medicalPrompt = `Patient medical symptom: ${symptom}. Which medical specialist should this patient visit?`;

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
        timeout: 50000,
      }
    );

    const result = response.data;

    if (!Array.isArray(result)) {
      if (result.error && result.error.includes("loading")) {
        return res.status(503).json({
          error: "Model is loading. Please wait 20 seconds and try again.",
        });
      }
      return res.status(500).json({ error: "Unexpected response", raw: result });
    }

    // Sort by score and get top 3
    const sorted = result.sort((a, b) => b.score - a.score);
    const top3 = sorted.slice(0, 3);
    
    // Get real doctor counts from database
    const doctorCounts = await getDoctorCounts();

    // Format response with real counts
    const formattedTop3 = top3.map((item) => {
      const category = cleanLabel(item.label);
      return {
        category: category,
        count: doctorCounts[category] || 0,
        score: Math.round(item.score * 100)
      };
    });

    res.json({
      success: true,
      best_match: formattedTop3[0],
      recommendations: formattedTop3,
      all_categories: Object.entries(doctorCounts).map(([name, count]) => ({
        category: name,
        count: count
      })).sort((a, b) => b.count - a.count)
    });

  } catch (err) {
    console.error("AI Classification Error:", err.message);
    
    // Fallback: Return all categories with real counts
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
      fallback: true
    });
  }
});

// Get all categories with doctor counts
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

module.exports = router;