
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import React from 'react';

function LandingPage() {
  
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}

export default LandingPage;