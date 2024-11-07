
'use client'

import { useToast } from '@/contexts/ToastContext';
import Settings from '@/icons/Settings';
import { LEVELS } from '@/utils/consts';
import { useGameStore } from '@/utils/game-mechanics';
import { formatNumber } from '@/utils/ui';
import Image from 'next/image';

export default function TopInfoSection() {
    const showToast = useToast();

    const {
        userTelegramName,
        gameLevelIndex,
        profitPerHour
    } = useGameStore();

    const handleSettingsClick = () => {
        showToast('Settings coming soon!', 'success');
    };

    return (
        <div className="px-4 z-10">
            <div className="flex items-center justify-between space-x-4 mt-4">
                <div className="flex items-center w-1/3">
                    <div className="flex items-center space-x-2">
                        <div className="p-1 rounded-lg bg-[#D62024]">
                            <Image src={LEVELS[gameLevelIndex].smallImage} width={24} height={24} alt="Small Level Icon" />
                        </div>
                        <div>
                            <p className="text-sm text-[#D62024] ">{userTelegramName}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center w-2/3 border-2 border-[#D62024] rounded-full px-4 py-[2px] bg-[#D62024]/[0.6] max-w-64">
                    <div className="flex-1 text-center">
                        <p className="text-xs text-black font-medium">Sync</p>
                        <div className="flex items-center justify-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1"></div>
                        </div>
                    </div>
                    <div className="h-[32px] w-[2px] bg-[#D62024] mx-2"></div>
                    <div className="flex-1 text-center">
                        <p className="text-xs text-black font-medium whitespace-nowrap overflow-hidden text-ellipsis">DINOH per hour</p>
                        <div className="flex items-center justify-center space-x-1">
                            <p className="text-sm text-black">+{formatNumber(profitPerHour)}</p>
                        </div>
                    </div>
                    <div className="h-[32px] w-[2px] bg-[#D62024] mx-2"></div>
                    <button
                        onClick={handleSettingsClick}
                        className="flex-1 flex items-center justify-center text-black focus:outline-none"
                    >
                        <Settings className="w-6 h-6" /> {/* Adjust size as needed */}
                    </button>
                </div>
            </div>
        </div>
    );
}
