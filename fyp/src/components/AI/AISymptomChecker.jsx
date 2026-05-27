import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { API_BASE_URL } from '../../config';
import { Backend_Url } from '../../../utils/utils';
import { ThemeContext } from '../../context/ThemeContext';

const AISymptomChecker = () => {
  const [symptom, setSymptom] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

    const { theme } = useContext(ThemeContext);
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptom.trim()) {
      setError('Please describe your symptoms');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
     const response = await axios.post(`${Backend_Url}/ai/classify-doctor`, {
        symptom: symptom
      });

      if (response.data.success) {
        setResult(response.data);
      } else {
        setError('Unable to analyze symptoms. Please try again.');
      }
    } catch (err) {
      console.error('AI Error:', err);
      setError(err.response?.data?.error || 'Service unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/doctors?specialty=${encodeURIComponent(category)}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>AI Symptom Checker</h2>
        <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Describe your symptoms and our AI will suggest the right specialist</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="Example: I have chest pain and difficulty breathing..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                Analyzing...
              </>
            ) : (
              'Find Doctor →'
            )}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

      {result && (
        <div className="space-y-6">
          {/* Best Match */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">🤖 AI Recommendation</h3>
            <p className="text-3xl font-bold mb-2">{result.best_match.category}</p>
            <p className="text-green-100 mb-4">
              {result.best_match.count} doctor{result.best_match.count !== 1 ? 's' : ''} available
            </p>
            <button
              onClick={() => handleCategoryClick(result.best_match.category)}
              className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
            >
              Book Now →
            </button>
          </div>

          {/* Top Recommendations */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCategoryClick(rec.category)}
                  className="bg-white border rounded-xl p-4 cursor-pointer hover:shadow-lg transition group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-800">{rec.category}</span>
                    {/* <span className="text-sm text-gray-500">{rec.score+20}% match</span> */}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {rec.count} doctor{rec.count !== 1 ? 's' : ''} available
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${rec.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Categories */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">All Medical Specialties</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {result.all_categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryClick(cat.category)}
                  className="text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition flex justify-between items-center"
                >
                  <span className="text-gray-700">{cat.category}</span>
                  <span className="text-sm text-gray-500">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISymptomChecker;