import React, { useState, useEffect } from 'react';
import { Car, Wrench, Settings, Cog } from 'lucide-react';

interface LoadingSpinnerProps {
  onComplete?: () => void;
  children?: React.ReactNode;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ onComplete, children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('Engine Start');
  const [timeRemaining, setTimeRemaining] = useState(30);

  useEffect(() => {
    const duration = 5000; // 30 seconds total
    const interval = 100; // Update every 100ms for smoother animation
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = (currentStep / steps) * 100;
      setProgress(Math.min(newProgress, 100));
      
      // Update remaining time
      const remaining = Math.ceil((duration - (currentStep * interval)) / 1000);
      setTimeRemaining(Math.max(remaining, 0));
      
      // Update stage based on progress with more detailed stages
      if (newProgress < 10) {
        setCurrentStage('Engine Start');
      } else if (newProgress < 20) {
        setCurrentStage('System Check');
      } else if (newProgress < 35) {
        setCurrentStage('Loading Tools');
      } else if (newProgress < 50) {
        setCurrentStage('Preparing Garage');
      } else if (newProgress < 65) {
        setCurrentStage('Loading Vehicles');
      } else if (newProgress < 80) {
        setCurrentStage('Initializing Systems');
      } else if (newProgress < 95) {
        setCurrentStage('Final Checks');
      } else {
        setCurrentStage('Ready to Go');
      }
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setProgress(100);
        setTimeRemaining(0);
        setIsLoading(false);
        if (onComplete) onComplete();
      }
    }, interval);

    // Cleanup on unmount
    return () => {
      clearInterval(timer);
    };
  }, [onComplete]);

  // If loading, show the spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">

          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🏁 Starting Engines...</h2>
          <p className="text-gray-600 mb-4">Preparing your high-performance auto repair dashboard</p>
          
          {/* Enhanced Timer Display */}
          <div className="mb-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 inline-block">
              <div className="flex items-center gap-3 text-red-700">
                <div className="relative">
                  <div className="w-12 h-12 border-3 border-red-300 rounded-full relative">
                    <div 
                      className="absolute inset-0 border-3 border-red-600 rounded-full transition-all duration-100"
                      style={{
                        background: `conic-gradient(#dc2626 ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`
                      }}
                    />
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-red-600">{timeRemaining}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-bold text-lg">{currentStage}...</div>
                  <div className="text-sm">{Math.round(progress)}% Complete</div>
                  <div className="text-xs mt-1">🏎️ Engine RPM: {Math.round(1000 + (progress * 50))}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Racing Progress Bar */}
          <div className="mt-4 w-96 mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span className={`flex items-center gap-1 transition-colors ${currentStage.includes('Engine') || currentStage.includes('System Check') ? 'text-red-600 font-bold' : ''}`}>
                🔧 Start
              </span>
              <span className={`flex items-center gap-1 transition-colors ${currentStage.includes('Tools') || currentStage.includes('Garage') ? 'text-red-600 font-bold' : ''}`}>
                🏗️ Setup
              </span>
              <span className={`flex items-center gap-1 transition-colors ${currentStage.includes('Vehicles') ? 'text-red-600 font-bold' : ''}`}>
                <Car className="w-4 h-4" />
                Vehicles
              </span>
              <span className={`flex items-center gap-1 transition-colors ${currentStage.includes('Systems') || currentStage.includes('Final') ? 'text-red-600 font-bold' : ''}`}>
                <Settings className="w-4 h-4" />
                Systems
              </span>
              <span className={`flex items-center gap-1 transition-colors ${currentStage.includes('Ready') ? 'text-green-600 font-bold' : ''}`}>
                🏁 Ready
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
              <div 
                className="bg-gradient-to-r from-red-500 via-orange-500 to-green-500 h-4 rounded-full transition-all duration-100 relative"
                style={{ width: `${progress}%` }}
              >
                {/* Racing car moving along progress */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                  <Car className="w-5 h-5 text-white drop-shadow-sm" />
                </div>
              </div>
            </div>
            
            {/* Stage completion indicators */}
            <div className="flex justify-between mt-3">
              {[20, 40, 60, 80, 100].map((threshold, i) => (
                <div 
                  key={i}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    progress >= threshold ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Performance Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="font-medium text-gray-900">Time Remaining</div>
              <div className="text-red-600 font-bold">{timeRemaining}s</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="font-medium text-gray-900">Progress</div>
              <div className="text-blue-600 font-bold">{Math.round(progress)}%</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="font-medium text-gray-900">Current Stage</div>
              <div className="text-green-600 font-bold text-xs">{currentStage}</div>
            </div>
          </div>
        </div>
        
        <style>{`
          @keyframes reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          
          @keyframes pit-crew {
            0% { transform: translateX(-60px); }
            25% { transform: translateX(120px); }
            50% { transform: translateX(280px); }
            75% { transform: translateX(120px); }
            100% { transform: translateX(-60px); }
          }
          
          @keyframes speed-line {
            0% { transform: translateX(-100px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(400px); opacity: 0; }
          }
          
          .animate-reverse {
            animation: reverse 2s linear infinite;
          }
          
          .animate-pit-crew {
            animation: pit-crew 6s ease-in-out infinite;
          }
          
          .animate-speed-line {
            animation: speed-line 2s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  // When loading is complete, render the children
  return <>{children}</>;
};