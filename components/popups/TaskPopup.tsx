'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/utils/game-mechanics';
import { formatNumber } from '@/utils/ui';
import { avatar, imageMap } from '@/images';
import { useHydration } from '@/utils/useHydration';
import { TASK_WAIT_TIME } from '@/utils/consts';
import { useToast } from '@/contexts/ToastContext';
import { TaskPopupProps } from '@/utils/types';

const TaskPopup: React.FC<TaskPopupProps> = React.memo(({ task, onClose, onUpdate }) => {
  // State to manage the closing animation
  const [isClosing, setIsClosing] = useState(false);
  // Function to show toast messages
  const showToast = useToast();
  // State to manage loading state
  const [isLoading, setIsLoading] = useState(false);
  // Accessing game store functions and data
  const { userTelegramInitData, incrementPoints } = useGameStore();
  // Hook to check if the component is hydrated
  const isHydrated = useHydration();
  // Local state to manage task data
  const [localTask, setLocalTask] = useState(task);
  // State to manage the remaining time for the task
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  // Reference to store the interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // State to check if the timer has finished
  const [isTimerFinished, setIsTimerFinished] = useState(false);

  // Function to handle starting the task
  const handleStart = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks/update/visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initData: userTelegramInitData,
          taskId: localTask.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start task');
      }

      const data = await response.json();
      const updatedTask = {
        ...localTask,
        taskStartTimestamp: new Date(data.taskStartTimestamp),
      };
      setLocalTask(updatedTask);
      onUpdate(updatedTask);
      showToast('Task started successfully!', 'success');

      // Open the link in a new window if it's a VISIT task and has a link
      if (localTask.type === 'VISIT' && localTask.taskData.link) {
        window.open(localTask.taskData.link, '_blank');
      }
    } catch (error) {
      console.error('Error starting task:', error);
      showToast('Failed to start task. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [localTask, userTelegramInitData, onUpdate, showToast]);

  // Function to handle checking the task completion
  const handleCheck = async () => {
    setIsLoading(true);
    try {
      let response;
      if (localTask.type === 'VISIT') {
        response = await fetch('/api/tasks/check/visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initData: userTelegramInitData,
            taskId: localTask.id,
          }),
        });
      } else if (localTask.type === 'REFERRAL') {
        response = await fetch('/api/tasks/check/referral', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initData: userTelegramInitData,
            taskId: localTask.id,
          }),
        });
      } else if (localTask.type === 'TELEGRAM') {
        response = await fetch('/api/tasks/check/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            initData: userTelegramInitData,
            taskId: localTask.id,
          }),
        });
      } else {
        throw new Error(`Unsupported task type: ${localTask.type}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to check ${localTask.type} task`);
      }

      const data = await response.json();

      if (data.success) {
        const updatedTask = { ...localTask, isCompleted: data.isCompleted };
        setLocalTask(updatedTask);
        onUpdate(updatedTask);
        incrementPoints(updatedTask.points);
        showToast(data.message || 'Task completed successfully!', 'success');
      } else {
        if (localTask.type === 'REFERRAL' && data.currentReferrals !== undefined && data.requiredReferrals !== undefined) {
          const remainingReferrals = data.requiredReferrals - data.currentReferrals;
          showToast(`You need ${remainingReferrals} more referral${remainingReferrals > 1 ? 's' : ''} to complete this task. (${data.currentReferrals}/${data.requiredReferrals})`, 'error');
        } else {
          showToast(data.message || `Failed to complete ${localTask.type} task. Please try again.`, 'error');
        }
      }
    } catch (error) {
      console.error('Error checking task:', error);
      showToast(error instanceof Error ? error.message : `Failed to check ${localTask.type} task. Please try again.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get the remaining time for the task
  const getTimeRemaining = useCallback(() => {
    if (!localTask.taskStartTimestamp) return null;
    const now = new Date();
    const startTime = new Date(localTask.taskStartTimestamp);
    const elapsedTime = now.getTime() - startTime.getTime();
    const remainingTime = Math.max(TASK_WAIT_TIME - elapsedTime, 0);
    return remainingTime;
  }, [localTask.taskStartTimestamp]);

  // Function to format time in MM:SS format
  const formatTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Effect to manage the timer for the task
  useEffect(() => {
    if (isHydrated && localTask.taskStartTimestamp && !localTask.isCompleted) {
      const updateTimer = () => {
        const remaining = getTimeRemaining();
        setTimeRemaining(remaining);
        if (remaining === 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setLocalTask({ ...localTask }); // Trigger re-render when timer reaches 0
          setIsTimerFinished(true);
        } else {
          setIsTimerFinished(false);
        }
      };

      updateTimer(); // Call immediately to set initial time
      intervalRef.current = setInterval(updateTimer, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isHydrated, localTask, getTimeRemaining]);

  // Function to handle closing the popup
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 280); // Match this to the animation duration
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className={`bg-[#000000] rounded-3xl p-6 w-full max-w-xl ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>
        <div className="flex justify-between items-center mb-4">
          <div className="w-8"></div>
          <h2 className="text-3xl text-white text-center font-bold">{localTask.title}</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <Image src={imageMap[localTask.image]} alt={localTask.title} width={80} height={80} className="mx-auto mb-4" />
        <p className="text-gray-300 text-center mb-4">{localTask.description}</p>
        {localTask.taskData.link && (
          <div className="flex justify-center mb-4">
            <button
              className="w-fit px-6 py-3 text-xl font-bold bg-blue-500 text-white rounded-2xl"
              onClick={() => {
                window.open(localTask.taskData.link, '_blank');
              }}
            >
              {localTask.callToAction}
            </button>
          </div>
        )}
        <div className="flex justify-center items-center mb-4">
        <Image src={avatar} alt={localTask.title} width={25} height={25}  />
          <span className="text-white font-bold text-2xl ml-1">+{formatNumber(localTask.points)}</span>
        </div>
        {localTask.type === 'VISIT' ? (
          <button
            className={`w-full py-6 text-xl font-bold text-white rounded-2xl flex items-center justify-center ${isLoading || localTask.isCompleted || (localTask.taskStartTimestamp && !isTimerFinished)
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-[#760203]'
              }`}
            onClick={localTask.taskStartTimestamp ? (isTimerFinished ? handleCheck : undefined) : handleStart}
            disabled={Boolean(isLoading || localTask.isCompleted || (localTask.taskStartTimestamp && !isTimerFinished))}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-t-2 border-white border-solid rounded-full animate-spin"></div>
            ) : localTask.isCompleted ? (
              'Completed'
            ) : localTask.taskStartTimestamp ? (
              isHydrated ? (timeRemaining === 0 ? 'Check' : formatTime(timeRemaining || 0)) : 'Loading...'
            ) : (
              'Start'
            )}
          </button>
        ) : (
          <button
            className="w-full py-6 text-xl font-bold bg-[#760203] text-white rounded-2xl flex items-center justify-center"
            onClick={handleCheck}
            disabled={isLoading || localTask.isCompleted}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-t-2 border-white border-solid rounded-full animate-spin"></div>
            ) : localTask.isCompleted ? (
              'Completed'
            ) : (
              'Check'
            )}
          </button>
        )}
      </div>
    </div>
  );
});

TaskPopup.displayName = 'TaskPopup';

export default TaskPopup;