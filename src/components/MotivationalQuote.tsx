import React, { useState, useEffect } from 'react';

const motivationalQuotes = [
  {
    quote: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    quote: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci"
  },
  {
    quote: "The future belongs to those who learn more skills and combine them in creative ways.",
    author: "Robert Greene"
  },
  {
    quote: "Data is the new oil, but like oil, it's valuable only when refined.",
    author: "Clive Humby"
  },
  {
    quote: "Machine learning is the last invention that humanity will ever need to make.",
    author: "Nick Bostrom"
  },
  {
    quote: "In God we trust. All others must bring data.",
    author: "W. Edwards Deming"
  }
];

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  }, []);

  const getNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-3xl mb-2">💡</div>
          <blockquote className="text-lg italic mb-2">
            "{currentQuote.quote}"
          </blockquote>
          <p className="text-purple-100 text-sm">
            — {currentQuote.author}
          </p>
        </div>
        <button
          onClick={getNewQuote}
          className="ml-4 px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-sm transition-all duration-200"
          title="Get new quote"
        >
          🔄
        </button>
      </div>
    </div>
  );
}
