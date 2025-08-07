'use client';

import React, { useState, useEffect } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';

interface GameStats {
  totalAttempts: number;
  completedCharacters: number;
  currentStreak: number;
  bestStreak: number;
  startTime: number;
}

const Home: React.FC = () => {
  const [currentStroke, setCurrentStroke] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalAttempts: 0,
    completedCharacters: 0,
    currentStreak: 0,
    bestStreak: 0,
    startTime: Date.now()
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const totalStrokes = 5;

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem('zheng-stats');
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    // Save stats to localStorage whenever they change
    localStorage.setItem('zheng-stats', JSON.stringify(gameStats));
  }, [gameStats]);

  const handleStrokeComplete = (strokeIndex: number) => {
    if (strokeIndex === currentStroke) {
      const nextStroke = currentStroke + 1;
      setCurrentStroke(nextStroke);
      
      if (nextStroke >= totalStrokes) {
        // Character completed!
        setIsCompleted(true);
        setShowCelebration(true);
        
        const timeSpent = Date.now() - gameStats.startTime;
        const newStreak = gameStats.currentStreak + 1;
        
        setGameStats(prev => ({
          ...prev,
          completedCharacters: prev.completedCharacters + 1,
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
        }));

        // Hide celebration after 3 seconds
        setTimeout(() => {
          setShowCelebration(false);
        }, 3000);
      }
    }
  };

  const handleReset = () => {
    setCurrentStroke(0);
    setIsCompleted(false);
    setShowCelebration(false);
    
    if (isCompleted) {
      // Only count as new attempt if previous was completed
      setGameStats(prev => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        startTime: Date.now()
      }));
    } else {
      // Reset streak if didn't complete
      setGameStats(prev => ({
        ...prev,
        currentStreak: 0,
        totalAttempts: prev.totalAttempts + 1,
        startTime: Date.now()
      }));
    }
  };

  const handleAutoReset = () => {
    // Simple reset for auto-clear after completion
    setCurrentStroke(0);
    setIsCompleted(false);
    setShowCelebration(false);
    setGameStats(prev => ({
      ...prev,
      totalAttempts: prev.totalAttempts + 1,
      startTime: Date.now()
    }));
  };

  const handleNewCharacter = () => {
    setCurrentStroke(0);
    setIsCompleted(false);
    setShowCelebration(false);
    setGameStats(prev => ({
      ...prev,
      totalAttempts: prev.totalAttempts + 1,
      startTime: Date.now()
    }));
  };

  const getCompletionPercentage = () => {
    return Math.round((currentStroke / totalStrokes) * 100);
  };

  const getSuccessRate = () => {
    if (gameStats.totalAttempts === 0) return 0;
    return Math.round((gameStats.completedCharacters / gameStats.totalAttempts) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            正 Counting App
          </h1>
          <p className="text-lg text-gray-600">
            Traditional Chinese tally counting using "正" - each stroke adds 1, complete character = 5
          </p>
          <div className="mt-4 text-6xl font-bold text-blue-600">
            正
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Traditional tally mark for counting by fives
          </p>
        </div>



        {/* Main Content */}
        <div className="flex flex-col items-center space-y-8">
          {/* Drawing Canvas with Counter */}
          <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <DrawingCanvas
                onStrokeComplete={handleStrokeComplete}
                currentStroke={currentStroke}
                totalStrokes={totalStrokes}
                onReset={handleReset}
                onAutoReset={handleAutoReset}
              />
            </div>
            
            {/* Completed 正 Counter */}
            <div className="bg-white rounded-xl p-6 shadow-lg min-w-[200px]">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Completed 正
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-4">
                  {gameStats.completedCharacters}
                </div>
                
                {/* Visual representation of completed 正 characters */}
                <div className="max-h-32 overflow-y-auto">
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: gameStats.completedCharacters }, (_, i) => (
                      <div key={i} className="text-lg text-blue-600">正</div>
                    ))}
                  </div>
                </div>
                
                {gameStats.completedCharacters === 0 && (
                  <div className="text-gray-400 italic text-sm">
                    No completed 正 yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              How to Count with 正
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>• Each stroke you draw adds 1 to your count</p>
              <p>• Complete the character "正" to count to 5</p>
              <p>• This is the traditional Chinese tally mark system</p>
              <p>• The orange line shows the current stroke to draw</p>
              <p>• Green lines show completed strokes (counts already made)</p>
            </div>
            
            <div className="mt-6 text-center">
              <h4 className="font-semibold mb-4 text-gray-800">Reference Character:</h4>
              <div className="text-8xl font-bold text-blue-600 mb-4">正</div>
              <div className="text-sm text-gray-500">
                <p><strong>正</strong> = Traditional Chinese tally mark = 5 counts</p>
                <p>Used in Asia like ||||  tally marks in the West</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {isCompleted ? (
              <button
                onClick={handleNewCharacter}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                Count Another 5
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                Reset Count
              </button>
            )}
          </div>
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 text-center shadow-2xl max-w-sm mx-4">
              <div className="text-6xl mb-4">🎊</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Count Complete!
              </h2>
              <p className="text-gray-600 mb-4">
                You've counted to 5 using "正"!
              </p>
              <div className="text-4xl mb-2">正</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
