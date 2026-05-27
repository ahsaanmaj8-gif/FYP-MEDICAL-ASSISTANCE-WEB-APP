import React, { useContext } from 'react';
import Header from './Header';
import Hero from './Hero';
// import SymptomChecker from './SymptomChecker';
import Features from './Features';
import DoctorCategories from './DoctorCategories';
import TopDoctors from './TopDoctors';
import PharmacySection from './PharmacySection'; // NEW
import LabTestsSection from './LabTestsSection'; // NEW
import HowItWorks from './HowItWorks';
import Footer from './Footer';
import { ThemeContext } from './../../context/ThemeContext';
import FAQPreview from './FAQPreview';
import TermsPreview from './TermsPreview';
import AISymptomChecker from './../AI/AISymptomChecker';
import VideoSection from './VideoSection';

const Homepage = () => {
  const { theme } = useContext(ThemeContext);
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      <Hero />
      {/* <SymptomChecker /> */}
      <AISymptomChecker />

      <VideoSection/>
      <Features />
      <DoctorCategories />
      <TopDoctors />
      <PharmacySection />     
      <LabTestsSection />     
      <HowItWorks />
       <FAQPreview />        
      <TermsPreview />
      <Footer />
    </div>
  );
};

export default Homepage;