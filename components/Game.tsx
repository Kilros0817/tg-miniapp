"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/contexts/ToastContext";
import Link from "next/link";

import {
  avatar,
  boost,
  lightning,
  main_button,
  avatar_bg,
  avatar_pic,
  clock_pic,
  coin_stack,
  score_panel,
  coin_box,
  speed,
  shop_pic,
  setting_pic,
  time_pic,
  rank_pic,
  alert_pic,
  boost_btn,
  progress_white,
  progress_blue,
  mark_pic,
} from "@/images";
import Rocket from "@/icons/Rocket";
import { useGameStore } from "@/utils/game-mechanics";
import TopInfoSection from "@/components/TopInfoSection";
import { LEVELS } from "@/utils/consts";
import { formatNumber } from "@/utils/ui";
interface GameProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Game({ currentView, setCurrentView }: GameProps) {
  const showToast = useToast();

  const handleViewChange = (view: string) => {
    console.log("Attempting to change view to:", view);
    if (typeof setCurrentView === "function") {
      try {
        setCurrentView(view);
        console.log("View change successful");
      } catch (error) {
        console.error("Error occurred while changing view:", error);
      }
    } else {
      console.error("setCurrentView is not a function:", setCurrentView);
    }
  };
  const handleSettingsClick = () => {
    showToast("Settings coming soon!", "success");
  };
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );

  const {
    userTelegramName,
    gameLevelIndex,
    profitPerHour,
    points,
    pointsBalance,
    pointsPerClick,
    energy,
    maxEnergy,
    clickTriggered,
    updateLastClickTimestamp,
  } = useGameStore();

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}`;
  };

  const handleInteraction = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.preventDefault(); // Prevent default behavior

    const processInteraction = (
      clientX: number,
      clientY: number,
      pageX: number,
      pageY: number
    ) => {
      if (energy - pointsPerClick < 0) return;

      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;

      // Apply tilt effect
      card.style.transform = `perspective(1000px) rotateX(${
        -y / 10
      }deg) rotateY(${x / 10}deg)`;
      setTimeout(() => {
        card.style.transform = "";
      }, 100);

      updateLastClickTimestamp();
      clickTriggered();
      setClicks((prevClicks) => [
        ...prevClicks,
        {
          id: Date.now(),
          x: pageX,
          y: pageY,
        },
      ]);
    };

    if (e.type === "touchend") {
      const touchEvent = e as React.TouchEvent<HTMLDivElement>;
      Array.from(touchEvent.changedTouches).forEach((touch) => {
        processInteraction(
          touch.clientX,
          touch.clientY,
          touch.pageX,
          touch.pageY
        );
      });
    } else {
      const mouseEvent = e as React.MouseEvent<HTMLDivElement>;
      processInteraction(
        mouseEvent.clientX,
        mouseEvent.clientY,
        mouseEvent.pageX,
        mouseEvent.pageY
      );
    }
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  const calculateProgress = () => {
    if (gameLevelIndex >= LEVELS.length - 1) {
      return 100;
    }
    const currentLevelMin = LEVELS[gameLevelIndex].minPoints;
    const nextLevelMin = LEVELS[gameLevelIndex + 1].minPoints;
    const progress =
      ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className="bg-black flex justify-center">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl ">
        <div className="flex-grow  relative top-glow z-0">
          <div
            className="mt-[2px] bg-[url('../images/background_one.png')] bg-center overflow-y-auto no-scrollbar bg-cover"
            style={{ height: "calc(100vh - 24px)" }}
          >
            <div className="mt-5 flex justify-between">
              <div className="ml-[24px] flex">
                <div className="bg-[url('../images/UI-ProfileAvatar-Frame.png')] p-2 bg-cover">
                  <Image
                    src={avatar_pic}
                    alt="avatar"
                    className="w-[32px] !h-[32px]"
                  />
                </div>
                <div className="py-[5px]">
                  <div className="text-sm bg-[#003343] border-black py-[1px] px-[8px] gap-0 rounded-tl-none rounded-tr-[8px] rounded-br-[8px] rounded-bl-none border-t border-b border-l-0 border-r border-t-[1px] border-b-[1px]">
                    {userTelegramName}
                  </div>
                  <div className="flex w-fit bg-[#003343] border-black py-[1px] px-[8px] gap-0 rounded-tl-none rounded-tr-[8px] rounded-br-[8px] rounded-bl-none border-t border-b border-l-0 border-r border-t-[1px] border-b-[1px]">
                    <p className="text-[8px] text-white mr-2">Sync </p>
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex mr-[24px]">
                <div className="mr-[8px]">
                  <Image
                    src={clock_pic}
                    alt="clock"
                    className="w-[40px] !h-[48px]"
                  />
                </div>
                <div className="w-fit px-2 flex justify-center h-10 bg-[#D744C9] select-none transition-all duration-150 [box-shadow:0_3px_0_0_#ac36a0] rounded-2xl  border-[2px] border-[#df69d4]">
                  <Image
                    src={coin_stack}
                    alt="coinstack"
                    className="w-[32px] items-center flex flex-col"
                  />
                  <div className="lilita-one-regular big-outline !italic flex flex-col justify-center items-center text-[28px] font-normal leading-[32px] tracking-[-0.02em] text-center">
                    {formatNumber(profitPerHour)}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 pt-1 pb-24">
              <div className="w-fit m-auto mt-16 px-2 flex justify-center h-12 bg-[#D744C9] select-none transition-all duration-150 [box-shadow:0_3px_0_0_#ac36a0] rounded-2xl  border-[2px] border-[#df69d4]">
                <Image
                  src={boost}
                  alt="coinstack"
                  className="flex flex-col w-[40px] items-center mr-2"
                />
                <span className="lilita-one-regular !italic big-outline flex flex-col justify-center items-center h-full text-white font-bold text-3xl mr-2">
                  {Math.floor(pointsBalance).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-center"></div>
              <div className="px-4 mt-20 flex justify-center  bg-center bg-no-repeat bg-cover ">
                <div
                  className="  p-4"
                  onClick={handleInteraction}
                  onTouchEnd={handleInteraction}
                >
                  <div className="w-full h-full relative ">
                    <Image
                      src={LEVELS[gameLevelIndex].bigImage}
                      alt="Main Character"
                      className="h-[30vh] w-auto object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-8 mt-[20%]">
                <div className="col-span-6 flex items-center relative">
                  <Image
                    className="w-[95%] !h-6 absolute right-0"
                    src={progress_white}
                    alt="background_progress"
                  />
                  <div
                    className="w-[95%] absolute right-0"
                    style={{ paddingRight: `${100 - calculateProgress()}%` }}
                  >
                    <Image
                      className="w-full !h-6"
                      src={progress_blue}
                      alt="progressbar"
                    />
                  </div>

                  <p className="absolute text-sm lilita-one-regular italic big-outline absolute inset-0 flex items-center justify-center text-center">
                    {energy}/{maxEnergy}
                  </p>
                  <Image
                    className="w-12 !h-14 absolute left-[4%]"
                    src={mark_pic}
                    alt="background_progress"
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={() => handleViewChange("boost")}
                    className="flex justify-center items-center gap-1 cursor-pointer active:scale-95 transition transform duration-150"
                  >
                    <Image src={boost_btn} alt="Exchange" />{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-[30%] left-3 p-2 rounded-xl bg-black bg-opacity-20">
            <div>
              <Image
                src={coin_box}
                alt="coin_box"
                className="w-[48px] !h-[48px] m-auto"
              />
              <p className="text-white small-outline poppins-thin text-xs !font-extrabold m-auto mt-1 mb-2 text-center tracking-tighter">
                {LEVELS[gameLevelIndex].name}&#8226;
                {gameLevelIndex + 1}/{LEVELS.length}
              </p>
            </div>
            <div>
              <Link href="#">
                <Image
                  src={speed}
                  alt="coin_box"
                  className="w-[48px] !h-[48px] m-auto  cursor-pointer active:scale-95 transition transform duration-150"
                />
                <p className="text-white small-outline poppins-thin text-xs !font-extrabold m-auto mt-1 mb-1 text-center tracking-tighter ">
                  Speed
                </p>
              </Link>
            </div>
          </div>
          <div className="absolute top-[30%] right-3 p-2 rounded-xl bg-black bg-opacity-20">
            <div>
              <div
                className="relative cursor-pointer active:scale-95 transition transform duration-150"
                onClick={handleSettingsClick}
              >
                <Image
                  src={setting_pic}
                  alt="coin_box"
                  className="w-[48px] !h-[48px] m-auto "
                />
                <Image
                  src={alert_pic}
                  alt="coin_box"
                  className="w-[18px] !h-[18px] m-auto absolute top-[0px] -right-[9px]"
                />
              </div>

              <p className="text-white small-outline poppins-thin text-xs !font-extrabold m-auto mt-1 mb-2 text-center tracking-tighter">
                Settings
              </p>
            </div>
            <div>
              <Link href="#">
                <Image
                  src={rank_pic}
                  alt="coin_box"
                  className="w-[48px] !h-[48px] m-auto  cursor-pointer active:scale-95 transition transform duration-150"
                />
                <p className="text-white small-outline poppins-thin text-xs !font-extrabold m-auto mt-1 mb-2 text-center tracking-tighter">
                  Rank
                </p>
              </Link>
            </div>
            <div>
              <Link href="#">
                <Image
                  src={shop_pic}
                  alt="coin_box"
                  className="w-[48px] !h-[48px] m-auto  cursor-pointer active:scale-95 transition transform duration-150"
                />
                <p className="text-white small-outline poppins-thin text-xs !font-extrabold m-auto mt-1 mb-2 text-center tracking-tighter">
                  Shop
                </p>
              </Link>
            </div>
            <div>
              <Image
                src={time_pic}
                alt="coin_box"
                className="w-[48px] !h-[48px] m-auto"
              />
              <p className="text-white small-outline  poppins-thin text-xs !font-extrabold m-auto mt-1 mb-1 text-center tracking-tighter">
                2d 06h
              </p>
            </div>
          </div>
        </div>
      </div>

      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute text-5xl font-bold opacity-0 text-[#D62024] pointer-events-none flex justify-center text-white"
          style={{
            top: `${click.y - 42}px`,
            left: `${click.x - 28}px`,
            animation: `float 1s ease-out`,
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          +{pointsPerClick}
        </div>
      ))}
    </div>
  );
}
