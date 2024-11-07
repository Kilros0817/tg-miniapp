"use client";

import Image, { StaticImageData } from "next/image";
import {
  avatar,
  earn_nav,
  friends_nav,
  main_button,
  mine_nav,
  rewards_nav,
} from "@/images";

type NavItem = {
  name: string;
  image?: StaticImageData | null;
  view: string;
};

const navItems: NavItem[] = [
  { name: "Home", image: mine_nav, view: "mine" },
  { name: "Friends", image: friends_nav, view: "friends" },
  { name: "Tappy", image: main_button, view: "game" },
  { name: "Tasks", image: earn_nav, view: "earn" },
  { name: "Rewards", image: rewards_nav, view: "airdrop" },
];

interface NavigationProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Navigation({
  currentView,
  setCurrentView,
}: NavigationProps) {
  console.log("Navigation props:", {
    currentView,
    setCurrentView,
    isSetCurrentViewFunction: typeof setCurrentView === "function",
  });

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

  if (typeof setCurrentView !== "function") {
    console.error(
      "setCurrentView is not a function. Navigation cannot be rendered properly."
    );
    return null; // or return some fallback UI
  }

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] w-full max-w-xl  flex justify-around items-center z-40 text-xs  max-h-24">
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => handleViewChange(item.view)}
          className="flex-1 bg-black py-0 px-[1px]"
        >
          <div
            className={`flex flex-col items-center justify-center ${
              currentView === item.view
                ? "bg-[linear-gradient(180deg,_#000000_0%,_#1461C9_24.5%,_#1461C9_49%,_#1461C9_100%)] h-full w-full mt-[-5px]"
                : "text-[#85827d] bg-[#17307B] "
            } h-16 p-2 `}
          >
            <div className="w-8 h-8 relative">
              {item.image && (
                <div className="w-full h-full relative">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={32}
                    height={32}
                  />
                </div>
              )}
            </div>
            <p className="mt-1 zcool-kuaile-regular text-white">{item.name}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
