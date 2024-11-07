
'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { avatar, battery, lightning, multiclick } from '@/images';
 import { calculateEnergyLimitUpgradeCost, calculateMultitapUpgradeCost, useGameStore } from '@/utils/game-mechanics';
 import { formatNumber } from '@/utils/ui';
import { useToast } from '@/contexts/ToastContext';
import { useHydration } from '@/utils/useHydration';
import { ENERGY_REFILL_COOLDOWN, MAX_ENERGY_REFILLS_PER_DAY } from '@/utils/consts';
import Time from '@/icons/Time';

interface BoostProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Boost({ currentView, setCurrentView }: BoostProps) {
  const showToast = useToast();
  const isHydrated = useHydration();

  const handleViewChange = (view: string) => {
    console.log('Attempting to change view to:', view);
    if (typeof setCurrentView === 'function') {
      try {
        setCurrentView(view);
        console.log('View change successful');
      } catch (error) {
        console.error('Error occurred while changing view:', error);
      }
    } else {
      console.error('setCurrentView is not a function:', setCurrentView);
    }
  };

  const {
    userTelegramInitData,
    pointsBalance,
    energyRefillsLeft,
    energyLimitLevelIndex,
    multitapLevelIndex,
    lastEnergyRefillTimestamp,
    initializeState,
    refillEnergy,
    upgradeEnergyLimit,
    upgradeMultitap
  } = useGameStore();

  const [isEnergyRefillAvailable, setIsEnergyRefillAvailable] = useState(false);
  const [isMultitapAffordable, setIsMultitapAffordable] = useState(false);
  const [isEnergyLimitAffordable, setIsEnergyLimitAffordable] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const [isLoadingRefill, setIsLoadingRefill] = useState(false);
  const [isLoadingMultitap, setIsLoadingMultitap] = useState(false);
  const [isLoadingEnergyLimit, setIsLoadingEnergyLimit] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getTimeRemaining = useCallback(() => {
    if (!lastEnergyRefillTimestamp || energyRefillsLeft === MAX_ENERGY_REFILLS_PER_DAY) return 0;
    const now = new Date();
    const lastRefill = new Date(lastEnergyRefillTimestamp);
    const elapsedTime = now.getTime() - lastRefill.getTime();
    return Math.max(ENERGY_REFILL_COOLDOWN - elapsedTime, 0);
  }, [lastEnergyRefillTimestamp, energyRefillsLeft]);

  const formatTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handleEnergyRefill = async () => {
    if (isEnergyRefillAvailable) {
      setIsLoadingRefill(true);
      try {
        const response = await fetch('/api/refill-energy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initData: userTelegramInitData,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to refill energy');
        }

        const result = await response.json();

        console.log("Result from server:", result);

        if (!result.lastEnergyRefillsTimestamp) return;

        // Update local state with the new values
        refillEnergy();
        initializeState({
          lastEnergyRefillTimestamp: result.lastEnergyRefillsTimestamp
        });

        showToast('Energy Refill Successful!', 'success');
      } catch (error) {
        console.error('Error refilling energy:', error);
        showToast('Failed to refill energy. Please try again.', 'error');
      } finally {
        setIsLoadingRefill(false);
      }
    }
  };

  const handleMultitapUpgrade = async () => {
    if (isMultitapAffordable && !isLoadingMultitap) {
      setIsLoadingMultitap(true);
      try {
        const response = await fetch('/api/upgrade/multitap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initData: userTelegramInitData,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to upgrade multitap');
        }

        const result = await response.json();

        console.log("Result from server:", result);

        // Update local state with the new values
        upgradeMultitap();

        showToast('Multitap Upgrade Successful!', 'success');
      } catch (error) {
        console.error('Error upgrading multitap:', error);
        showToast('Failed to upgrade multitap. Please try again.', 'error');
      } finally {
        setIsLoadingMultitap(false);
      }
    }
  };

  const handleEnergyLimitUpgrade = async () => {
    if (isEnergyLimitAffordable && !isLoadingEnergyLimit) {
      setIsLoadingEnergyLimit(true);
      try {
        const response = await fetch('/api/upgrade/energy-limit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initData: userTelegramInitData,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to upgrade energy limit');
        }

        const result = await response.json();

        console.log("Result from server:", result);

        // Update local state with the new values
        upgradeEnergyLimit();

        showToast('Energy Limit Upgrade Successful!', 'success');
      } catch (error) {
        console.error('Error upgrading energy limit:', error);
        showToast('Failed to upgrade energy limit. You dont have coins', 'error');
      } finally {
        setIsLoadingEnergyLimit(false);
      }
    }
  };

  useEffect(() => {
    if (isHydrated && lastEnergyRefillTimestamp && energyRefillsLeft > 0) {
      const updateCountdown = () => {
        const remaining = getTimeRemaining();
        setTimeRemaining(remaining);
        if (remaining === 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      };

      updateCountdown();
      intervalRef.current = setInterval(updateCountdown, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isHydrated, lastEnergyRefillTimestamp, energyRefillsLeft, getTimeRemaining]);

  useEffect(() => {
    const isAvailable = energyRefillsLeft > 0 && (energyRefillsLeft === MAX_ENERGY_REFILLS_PER_DAY || timeRemaining === 0);
    setIsEnergyRefillAvailable(isAvailable);
  }, [energyRefillsLeft, timeRemaining]);

  useEffect(() => {
    const isAffordable = calculateMultitapUpgradeCost(multitapLevelIndex) <= pointsBalance;
    setIsMultitapAffordable(isAffordable);
  }, [pointsBalance, multitapLevelIndex]);

  useEffect(() => {
    const isAffordable = calculateEnergyLimitUpgradeCost(energyLimitLevelIndex) <= pointsBalance;
    setIsEnergyLimitAffordable(isAffordable);
  }, [pointsBalance, energyLimitLevelIndex]);

  return (
    <div className="bg-black flex justify-center min-h-screen">
      <div className="w-full bg-black  font-bold flex flex-col max-w-xl">
      <div className="flex-grow mt-2 bg-[#00000] rounded-t-[48px] relative top-glow z-0">
          <div className="mt-[2px] bg-center rounded-t-[46px] h-full overflow-y-auto no-scrollbar">
            <div className="px-4 pt-1 pb-24">
              <div className="px-4 mt-4 flex justify-center text-[#DE3D1E]">
                <div className="px-4 py-2 flex items-center space-x-2">
                <Image src={avatar} alt="Exchange" width={25} height={25} />
                <p className="text-4xl  " suppressHydrationWarning>{Math.floor(pointsBalance).toLocaleString()}</p>
                </div>
              </div>

              <h2 className="text-base mt-8 text-[#D62024]">Free daily boosters</h2>
              <div className="mt-4">
                <button
                  className="w-full flex justify-between items-center bg-gradient-to-r from-red-900 rounded-lg p-4"
                  onClick={handleEnergyRefill}
                  disabled={!isEnergyRefillAvailable}
                >
                  <div className="flex items-center">
                    <Image src={lightning} alt="Exchange" width={25} height={25} />
                    <div className="flex flex-col ml-2">
                      <span className="text-left text-[#D62024] font-medium">Full energy</span>
                      <span className="font-normal text-[#D62024]">{energyRefillsLeft}/6 available</span>
                    </div>
                  </div>
                  {isLoadingRefill ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : timeRemaining !== null && timeRemaining > 0 ? (
                    <div className="flex items-center">
                      <Time className="w-4 h-4 mr-1 text-[#D62024]" />
                      <span className="text-[#D62024]">
                        {isHydrated ? formatTime(timeRemaining) : 'Loading...'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#7D1D1D]">Refill</span>
                  )}
                </button>
              </div>

              <h2 className="text-base mt-8 text-[#D62024]">Boosters</h2>
              <div className="mt-4">
                <button className="w-full flex justify-between items-center bg-gradient-to-r from-red-900 rounded-lg p-4" onClick={handleMultitapUpgrade}
                  disabled={isLoadingMultitap || !isMultitapAffordable}>
                  <div className="flex items-center">
                    <Image src={multiclick} alt="Exchange" width={40} height={40} />
                    <div className="flex flex-col ml-2">
                      <span className="text-left font-medium text-[#D62024]">Multitap</span>
                      <div className="flex justify-center items-center">
                      <Image src={avatar} alt="Exchange" width={20} height={20} />
                      <span className="ml-1 text-[#D62024]">
                          <span className={`font-bold  ${isMultitapAffordable ? 'text-[#D62024]' : ''}`}>
                            {formatNumber(calculateMultitapUpgradeCost(multitapLevelIndex))}
                          </span> • {multitapLevelIndex + 1} lvl
                        </span>
                      </div>
                    </div>
                  </div>
                  {isLoadingMultitap ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <span className="text-[#7D1D1D]">Upgrade</span>
                  )}
                </button>
                <button className="w-full flex justify-between items-center bg-gradient-to-r from-red-900 rounded-lg p-4 mt-2" onClick={handleEnergyLimitUpgrade} disabled={isLoadingEnergyLimit || !isEnergyLimitAffordable}>
                  <div className="flex items-center">
                    <Image src={battery} alt="Exchange" width={40} height={10} />
                    <div className="flex flex-col ml-2">
                      <span className="text-left text-[#D62024] font-medium">Energy limit</span>
                      <div className="flex justify-center items-center">
                      <Image src={avatar} alt="Exchange" width={20} height={20} />
                      <span className="ml-1 text-[#D62024]">
                          <span className={`font-bold ${isEnergyLimitAffordable ? 'text-[#D62024]' : ''}`}>
                            {formatNumber(calculateEnergyLimitUpgradeCost(energyLimitLevelIndex))}
                          </span> • {energyLimitLevelIndex + 1} lvl
                        </span>
                      </div>
                    </div>
                  </div>
                  {isLoadingEnergyLimit ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <span className="text-[#7D1D1D]">Upgrade</span>
                  )}
                </button>
              </div>

              <button onClick={() => handleViewChange("game")} className="mx-auto block mt-4 text-center text-[#7D1D1D]">
                Back to Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}