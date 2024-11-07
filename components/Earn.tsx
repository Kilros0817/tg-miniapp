
'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/utils/game-mechanics';
import { capitalizeFirstLetter, formatNumber } from '@/utils/ui';
import { avatar, imageMap } from '@/images';
import Time from '@/icons/Time';
import TaskPopup from './popups/TaskPopup';
import { Task } from '@/utils/types';

const useFetchTasks = (userTelegramInitData: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks?initData=${encodeURIComponent(userTelegramInitData)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userTelegramInitData]);

  return { tasks, setTasks, isLoading };
};

export default function Earn() {
  const { userTelegramInitData } = useGameStore();
  const { tasks, setTasks, isLoading } = useFetchTasks(userTelegramInitData);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskUpdate = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(t =>
        t.id === updatedTask.id ? updatedTask : t
      )
    );
  }, [setTasks]);

  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks]);

  return (
    <div className="bg-black flex justify-center min-h-screen">
      <div className="w-full bg-black text-gray-400 font-bold flex flex-col max-w-xl">
        <div className="flex-grow mt-4 rounded-t-[48px] relative top-glow z-0">
          <div 
            className="mt-[2px] rounded-t-[46px] h-full overflow-y-auto no-scrollbar"
            style={{ background: 'linear-gradient(to bottom, #575EFF, rgba(14, 203, 255, 0.94))' }}
          >
            <div className="px-4 pt-1 pb-24">
              <div className="relative">
                <div className="flex justify-center mb-4">
                <Image src={avatar} alt="avatar" width={100} height={100} />
                </div>
                <h1 className="text-3xl text-center mb-4 text-[#fffff]">Earn More DINOH</h1>

                {isLoading ? (
                  <div className="text-center text-[#fffff]">Loading tasks...</div>
                ) : (
                  Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                    <div key={category}>
                      <h2 className=" text-lg mt-8 mb-4 font-bold  text-[#7B1C1C] font-bold">{capitalizeFirstLetter(category)}</h2>
                      <div className="space-y-2">
                        {categoryTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex justify-between items-center bg-gradient-to-r from-red-900 rounded-lg p-4 cursor-pointer"
                            onClick={() => !task.isCompleted && setSelectedTask(task)}
                          >
                            <div className="flex items-center">
                              <Image src={imageMap[task.image]} alt={task.title} width={40} height={40} className="rounded-lg mr-2" />
                              <div className="flex flex-col">
                                <span className="font-bold text-[black]">{task.title}</span>
                                <div className="flex items-center">
                                <Image src={avatar} alt="avatar" width={40} height={40} />
                                <span className="font-bold text-black ">+{formatNumber(task.points)}</span>
                                </div>
                              </div>
                            </div>
                            {task.isCompleted ? (
                              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : task.taskStartTimestamp ? (
                              <span className="text-yellow-500"><Time /></span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedTask && (
        <TaskPopup
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}
