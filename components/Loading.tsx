'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { calculateEnergyLimit, InitialGameState, useGameStore } from '@/utils/game-mechanics';
import UAParser from 'ua-parser-js';
import { ALLOW_ALL_DEVICES } from '@/utils/consts';

interface LoadingProps {
  setIsInitialized: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentView: (view: string) => void;
}

export default function Loading({ setIsInitialized, setCurrentView }: LoadingProps) {
  const initializeState = useGameStore((state) => state.initializeState);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isAppropriateDevice, setIsAppropriateDevice] = useState(true);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  const fetchOrCreateUser = useCallback(async () => {
    try {
      const initialState: InitialGameState = {
        userTelegramInitData: '',
        userTelegramName: 'Unknown User',
        lastClickTimestamp: Date.now(),
        gameLevelIndex: 0,
        points: 0,
        pointsBalance: 0,
        unsynchronizedPoints: 0,
        multitapLevelIndex: 0,
        pointsPerClick: 0,
        energy: 0,
        maxEnergy: calculateEnergyLimit(0),
        energyRefillsLeft: 0,
        energyLimitLevelIndex: 0,
        lastEnergyRefillTimestamp: Date.now(),
        mineLevelIndex: 0,
        profitPerHour: 0,
        tonWalletAddress: '',
      };

      initializeState(initialState);
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [initializeState]);

  useEffect(() => {
    const parser = new UAParser();
    const device = parser.getDevice();
    setIsAppropriateDevice(ALLOW_ALL_DEVICES || device.type === 'mobile' || device.type === 'tablet');

    if (isAppropriateDevice) fetchOrCreateUser();
  }, [fetchOrCreateUser, isAppropriateDevice]);

  useEffect(() => {
    // Set the interval to reach 100% in 3000ms (3 seconds)
    const loadingInterval = setInterval(() => {
      setLoadingPercentage((prev) => (prev < 100 ? prev + (100 / 30) : 100)); // Increment by approx. 3.33% every 100ms
    }, 100);

    if (loadingPercentage >= 100) {
      clearInterval(loadingInterval);
      const timer = setTimeout(() => {
        setCurrentView('game');
        setIsInitialized(true);
      }, 100); // Delay before transitioning to the game

      return () => clearTimeout(timer);
    }

    return () => clearInterval(loadingInterval);
  }, [loadingPercentage, setCurrentView, setIsInitialized]);

  if (!isAppropriateDevice) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#20ff45] to-[#0ECBFF]">
        <div className="w-full max-w-xl text-white flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-4">Play on your mobile</h1>
          <p className="mt-4">@{process.env.NEXT_PUBLIC_BOT_USERNAME}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col justify-center items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://raw.githubusercontent.com/RollupRadar/project23/main/images/tappo2.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Loading Bar */}
      <div className="relative w-4/5 h-6 bg-gray-600 rounded-full overflow-hidden shadow-lg mb-10" style={{ marginTop: 'auto' }}>
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-blue-600 transition-all ease-linear"
          style={{
            width: `${loadingPercentage}%`,
          }}
        />
        {/* Loading Percentage */}
        <div
          className="absolute top-0 left-0 h-full flex items-center justify-center text-white font-bold"
          style={{
            width: '100%',
          }}
        >
          {Math.round(loadingPercentage)}%  {/* Round to avoid decimal percentage */}
        </div>
      </div>

      {/* Styling for retro text (not used anymore but left for future reference) */}
      <style jsx>{`
        .retro-text {
          font-family: 'Press Start 2P', cursive;
          color: #ffeb3b;
          text-shadow: 2px 2px 0px #f57f17;
        }
      `}</style>
    </div>
  );
}
