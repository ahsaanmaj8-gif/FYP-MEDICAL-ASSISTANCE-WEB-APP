import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating';

const ReviewsList = ({ targetType, targetId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [targetType, targetId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8085/api/v1/reviews/${targetType}/${targetId}`
      );

      if (response.data.success) {
        setReviews(response.data.data.reviews);
        setStats({
          average: response.data.data.average,
          total: response.data.data.total,
          distribution: response.data.data.distribution
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-yellow-600">{stats.average}</div>
            <StarRating initialRating={parseFloat(stats.average)} readOnly size="sm" />
            <div className="text-sm text-gray-600 mt-2">{stats.total} reviews</div>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm w-8">{star} ★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{
                      width: stats.total > 0
                        ? `${(stats.distribution[star] / stats.total) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">
                  {stats.distribution[star]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">⭐</div>
          <p className="text-gray-600">No reviews yet. Be the first to rate!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                    {review.patient?.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <p className="font-semibold">{review.patient?.name || 'Patient'}</p>
                    <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <StarRating initialRating={review.rating} readOnly size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;