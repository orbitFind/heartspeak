"use client"
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  const handleStartJourney = () => {
    router.push('/chat');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center py-16 px-4">
      <header className="mb-16">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Welcome to HeartSpeak
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your compassionate AI assistant for mental well-being. HeartSpeak provides supportive, empathetic conversations and personalized care to help you navigate life's challenges.
        </p>
        <button
          onClick={handleStartJourney}
          className="bg-blue-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300"
        >
          Start Your Journey
        </button>
      </header>
      {/* Rest of the code */}
    </div>
  );
};

export default HomePage;