import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import axios from 'axios';

const SymptomChecker = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!symptoms.trim() || symptoms.length < 5) {
      setError('Please describe your symptoms in more detail (at least 5 characters)');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5028/api/ai/analyze', {
        symptoms: symptoms
      });

      if (response.data.success) {
        setResult({
          primaryDoctor: response.data.primary_doctor,
          recommendedDoctors: response.data.recommended_doctors,
          urgency: response.data.urgency,
          condition: response.data.condition,
          message: response.data.message,
          confidence: response.data.confidence
        });
      } else {
        setError(response.data.message || 'Unable to analyze symptoms. Please try again.');
      }
    } catch (err) {
      console.error('Error analyzing symptoms:', err);
      setError('AI service is currently unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookDoctor = (doctorName) => {
    navigate(`/doctors?specialty=${encodeURIComponent(doctorName)}`);
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'emergency': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const inputBg = theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900';

  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
              <span className="text-3xl">🤖</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold ${textColor} mb-4`}>
              AI Symptom Checker
            </h2>
            <p className={`text-lg ${subTextColor}`}>
              Describe your symptoms and our AI will suggest the right doctor specialty
            </p>
            <p className={`text-sm ${subTextColor} mt-2`}>
              ⚠️ This is not a medical diagnosis. Always consult a doctor.
            </p>
          </div>

          {/* Input Area */}
          <div className={`p-6 rounded-2xl shadow-lg ${bgColor} border`}>
            <label className={`block text-sm font-medium ${textColor} mb-2`}>
              Describe your symptoms
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Example: I have chest pain, difficulty breathing, and feel dizzy..."
              rows="4"
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 ${inputBg}`}
            />
            
            <div className="flex justify-between items-center mt-4">
              <p className={`text-xs ${subTextColor}`}>
                {symptoms.length}/500 characters
              </p>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    Analyzing...
                  </>
                ) : (
                  'Analyze Symptoms 🔍'
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Result Area */}
          {result && (
            <div className="mt-8 space-y-4">
              {/* Urgency Badge */}
              <div className={`p-4 rounded-lg ${getUrgencyColor(result.urgency)}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {result.urgency === 'emergency' ? '🚨' : 
                     result.urgency === 'high' ? '⚠️' : 
                     result.urgency === 'medium' ? '📋' : 'ℹ️'}
                  </span>
                  <div>
                    <p className="font-semibold">Urgency: {result.urgency.toUpperCase()}</p>
                    {result.urgency === 'emergency' && (
                      <p className="text-sm">Please seek immediate medical attention!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendation Card */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="font-bold text-xl mb-3">🎯 AI Recommendation</h3>
                <p className="text-blue-100 mb-4">{result.message}</p>
                
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => handleBookDoctor(result.primaryDoctor)}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Book {result.primaryDoctor} →
                  </button>
                  
                  {result.recommendedDoctors?.map((doctor, idx) => (
                    doctor !== result.primaryDoctor && (
                      <button
                        key={idx}
                        onClick={() => handleBookDoctor(doctor)}
                        className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                      >
                        {doctor}
                      </button>
                    )
                  ))}
                </div>
              </div>

              {/* Condition Info */}
              {result.condition && (
                <div className={`p-4 rounded-lg border ${bgColor}`}>
                  <p className={`text-sm ${subTextColor}`}>
                    <span className="font-semibold">Possible Condition:</span> {result.condition}
                  </p>
                  {result.confidence && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>AI Confidence</span>
                        <span>{result.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${result.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SymptomChecker;