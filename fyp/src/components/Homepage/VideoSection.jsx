import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const VideoSection = () => {
  const { theme } = useContext(ThemeContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = React.useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';

  return (
    <section className={`py-16 ${bgColor} transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className={`text-3xl md:text-4xl font-bold ${textColor} mb-4`}>
            Watch How MediCare Works
          </h2>
          <p className={`text-lg ${subTextColor} max-w-2xl mx-auto`}>
            See how easy it is to book appointments, consult doctors, and get medicines delivered
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Video Player */}
            <video
              ref={videoRef}
              className="w-full h-auto"
              poster="/videos/video-poster.jpg"
              controls
              playsInline
            >
              <source src="/DemoVideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Custom Play Button Overlay (optional) */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-5 shadow-xl transition duration-300"
              >
                <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            )}
          </div>

          {/* Video Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center p-4">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className={`font-semibold ${textColor}`}>Find Doctors</h3>
              <p className={`text-sm ${subTextColor}`}>Search by specialty, city, or symptoms</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">📅</div>
              <h3 className={`font-semibold ${textColor}`}>Book Appointments</h3>
              <p className={`text-sm ${subTextColor}`}>Select time slot and confirm booking</p>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl mb-2">💊</div>
              <h3 className={`font-semibold ${textColor}`}>Get Treatment</h3>
              <p className={`text-sm ${subTextColor}`}>Consult and get medicines delivered</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;