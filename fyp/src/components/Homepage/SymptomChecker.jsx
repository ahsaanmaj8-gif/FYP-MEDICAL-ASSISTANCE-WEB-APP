import React, { useState, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from './../../context/ThemeContext';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const { theme } = useContext(ThemeContext); // <-- get theme

  const handleSymptomCheck = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/api/ai/symptom-check', { symptoms });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error checking symptoms:', error);
      // Mock response
      setRecommendations({
        possibleConditions: ['Common Cold', 'Seasonal Allergy'],
        recommendedSpecializations: ['General Physician', 'ENT Specialist'],
        emergency: false,
        doctors: []
      });
    }
    setIsLoading(false);
  };

  return (
    <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              AI Symptom Checker
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
              Describe your symptoms in your own words and get instant doctor recommendations
            </p>
          </div>

          <div className={`rounded-2xl p-8 shadow-lg ${theme === 'dark' ? 'bg-gray-800 shadow-gray-700' : 'bg-gray-50 shadow-gray-200'}`}>
            <form onSubmit={handleSymptomCheck} className="mb-8">
              <div className="mb-6">
                <label htmlFor="symptoms" className="block font-medium mb-3">
                  What symptoms are you experiencing?
                </label>
                <textarea
                  id="symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Example: I have fever, headache, and body pain since yesterday morning..."
                  className={`w-full h-32 px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent resize-none ${
                    theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500'
                  }`}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition duration-300 ${
                  theme === 'dark'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                }`}
              >
                {isLoading ? 'Analyzing Symptoms...' : 'Check Symptoms & Find Doctors'}
              </button>
            </form>

            {recommendations && (
              <div className={`rounded-lg p-6 border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-200 text-gray-800'}`}>
                <h3 className="text-xl font-semibold mb-4">AI Analysis Results</h3>

                {recommendations.emergency && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <span className="text-red-500 font-semibold">⚠️ Emergency Warning:</span>
                      <span className="ml-2 text-red-600">Please seek immediate medical attention</span>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Possible Conditions</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {recommendations.possibleConditions?.map((condition, index) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Recommended Specialists</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {recommendations.recommendedSpecializations?.map((spec, index) => (
                        <li key={index}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300">
                    View Recommended Doctors
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={`mt-8 text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <p>Note: This AI tool provides preliminary information only. Always consult a doctor for accurate diagnosis.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymptomChecker;
