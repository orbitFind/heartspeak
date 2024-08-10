"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const HomePage = () => {
  const router = useRouter();

  const handleStartJourney = () => {
    router.push('/chat');
  };

  useEffect(() => {
    document.body.classList.add('bg-gray-100');
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center py-16 px-4">
      <motion.header
        className="mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-wide">
          Welcome to <span className="text-blue-500">HeartSpeak</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Your compassionate AI assistant for mental well-being. HeartSpeak provides supportive, empathetic conversations and personalized care to help you navigate life&apos;s challenges.
        </p>
        <motion.button
          onClick={handleStartJourney}
          className="bg-blue-500 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:scale-105 transition duration-300 ease-in-out"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Your Journey
        </motion.button>
      </motion.header>

      {/* Rest of the content, if any, goes here */}
    </div>
  );
};

export default HomePage;
