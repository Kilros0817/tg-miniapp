
'use client'

import React, { useState, useCallback, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
 import { useGameStore } from '@/utils/game-mechanics';
import { avatar, baseGift, bigGift } from '@/images';
import { formatNumber } from '@/utils/ui';
import { REFERRAL_BONUS_BASE, REFERRAL_BONUS_PREMIUM, LEVELS } from '@/utils/consts';
import { getUserTelegramId } from '@/utils/user';
import Copy from '@/icons/Copy';
import { useToast } from '@/contexts/ToastContext';
import { initUtils } from '@telegram-apps/sdk';

interface Referral {
  id: string;
  telegramId: string;
  name: string | null;
  points: number;
  referralPointsEarned: number;
  levelName: string;
  levelImage: StaticImageData;
}

export default function Friends() {
  const showToast = useToast();

  const { userTelegramInitData } = useGameStore();
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Invite a friend");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCount, setReferralCount] = useState(0);
  const [isLoadingReferrals, setIsLoadingReferrals] = useState(true);
  const [showBonusesList, setShowBonusesList] = useState(false);

  const fetchReferrals = useCallback(async () => {
    setIsLoadingReferrals(true);
    try {
      const response = await fetch(`/api/user/referrals?initData=${encodeURIComponent(userTelegramInitData)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch referrals');
      }
      const data = await response.json();
      setReferrals(data.referrals);
      setReferralCount(data.referralCount);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      showToast('Failed to fetch referrals. Please try again later.', 'error');
    } finally {
      setIsLoadingReferrals(false);
    }
  }, [userTelegramInitData, showToast]);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  const handleCopyInviteLink = useCallback(() => {
    navigator.clipboard
      .writeText(process.env.NEXT_PUBLIC_BOT_USERNAME ? `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}/${process.env.NEXT_PUBLIC_APP_URL_SHORT_NAME}?startapp=kentId${getUserTelegramId(userTelegramInitData) || ""}` : "https://t.me/dinohorizonbot")
      .then(() => {
        setCopyButtonText("Copied!");
        showToast("Invite link copied to clipboard!", 'success');

        setTimeout(() => {
          setCopyButtonText("Copy");
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        showToast("Failed to copy link. Please try again.", 'error');
      });
  }, [userTelegramInitData, showToast]);

  const handleInviteFriend = useCallback(() => {
    const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME;
    const userTelegramId = getUserTelegramId(userTelegramInitData);

    const inviteLink = botUsername
      ? `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}/${process.env.NEXT_PUBLIC_APP_URL_SHORT_NAME}?startapp=kentId${userTelegramId || ""}`
      : "https://t.me/clicker_game_news";

    const shareText = ` Join me in Dino Horizon!: Tap, Earn, and Win! 🏆\n🚀 Let's play and earn together!`;

    try {
      const utils = initUtils();
      const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`;
      utils.openTelegramLink(fullUrl);
    } catch (error) {
      console.error('Error opening Telegram link:', error);
      showToast("Failed to open sharing dialog. Please try again.", 'error');

      // Fallback: copy the invite link to clipboard
      navigator.clipboard.writeText(inviteLink)
        .then(() => showToast("Invite link copied to clipboard instead", 'success'))
        .catch(() => showToast("Failed to share or copy invite link", 'error'));
    }
  }, [userTelegramInitData, showToast]);

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
              <h1
         style={{
         fontFamily: "'ZCOOL KuaiLe', sans-serif",
         fontSize: '1.5rem',
         textAlign: 'center',
         marginTop: '1rem',
         color: '#ffffff',
         }}
         >
         Upgrade
         </h1>
         <p
         style={{
         fontFamily: "'ZCOOL KuaiLe', sans-serif",
         fontSize: '1.0rem',
         textAlign: 'center',
         marginTop: '1rem',
         color: '#ffffff',
         }}
         >
         You and your friend will receive DINOH coins!!!
         </p>
                <p className="text-center text-gray-400 mb-8">...</p>

                <div className="space-y-2">
                <div 
    className="flex justify-between items-center rounded-lg p-4 relative overflow-hidden"
    style={{
        backgroundColor: '#FFFFFF', // White card surface
        borderRadius: '19px',
        padding: '1.5rem',
        boxShadow: '0 6px 0 #AC36A0, 0 8px 15px rgba(0, 0, 0, 0.2)', // Magenta base with shadow for 3D effect
        position: 'relative',
    }}
>
    {/* Content of the card */}
    <div className="flex items-center relative z-10">
        <Image src={baseGift} alt="Gift" width={40} height={40} className="rounded-lg mr-2" />
        <div className="flex flex-col ml-2">
            <span className="font-medium text-lg text-[#AC36A0]">Invite a friend</span>
            <div className="flex items-center mt-1">
                <Image src={avatar} alt="avatar" width={30} height={30} className="rounded-full mr-1" />
                <span className="ml-1 text-gray-400">
                    <span className="text-[#AC36A0] font-bold">+{formatNumber(REFERRAL_BONUS_BASE)}</span> for you and your friend
                </span>
            </div>
        </div>
    </div>
</div>

<div 
    className="flex justify-between items-center rounded-lg p-4 relative overflow-hidden"
    style={{
        backgroundColor: '#FFFFFF', // White card surface
        borderRadius: '19px',
        padding: '1.5rem',
        boxShadow: '0 6px 0 #AC36A0, 0 8px 15px rgba(0, 0, 0, 0.2)', // Magenta base with shadow for 3D effect
        position: 'relative',
    }}
>
    {/* Left content section */}
    <div className="flex items-center relative z-10">
        <Image src={bigGift} alt="Premium Gift" width={40} height={40} className="rounded-lg mr-2" />
        <div className="flex flex-col ml-2">
            <span className="font-medium text-lg text-[#AC36A0]">Invite a friend with Telegram Premium</span>
            <div className="flex items-center mt-1">
                <Image src={avatar} alt="avatar" width={30} height={30} className="rounded-full mr-1" />
                <span className="ml-1 text-gray-400">
                    <span className="text-[#AC36A0] font-bold">+{formatNumber(REFERRAL_BONUS_PREMIUM)}</span> for you and your friend
                </span>
            </div>
        </div>
    </div>
</div>
</div>

                <button
                  onClick={() => setShowBonusesList(!showBonusesList)}
                  className="block w-full mt-4 text-center text-red-900"
                >
                  {showBonusesList ? "Hide" : "More bonuses"}
                </button>

                {showBonusesList && (
                  <div className="mt-4 space-y-2">
                    <h3 className="text-2xl text-[#ffffff] text-left font-bold mb-4">Bonus for levelling up</h3>
                    <div className="flex justify-between text-[#ffffff] px-4 mb-2">
                      <div className="flex items-center flex-1">
                        <span>Level</span>
                      </div>
                      <div className="flex items-center justify-between flex-1">
                        <span>For friend</span>
                        <span>Premium</span>
                      </div>
                    </div>
                    {LEVELS.slice(1).map((level, index) => (
                      <div
                      key={index}
                      className="flex items-center bg-gradient-to-r from-white to-gray-100 rounded-lg p-4"
                    >                    
                        <div className="flex items-center flex-1">
                          <Image src={level.smallImage} alt={level.name} width={40} height={40} className="rounded-lg mr-2" />
                          <span className="font-medium text-gray-400">{level.name}</span>
                        </div>
                        <div className="flex items-center justify-between flex-1">
                          <div className="flex items-center mr-4">
                          <Image src={avatar} alt="avatar" width={20} height={20} />
                          <span className="ml-2 text-[#D62024]">+{formatNumber(level.friendBonus)}</span>
                          </div>
                          <div className="flex items-center">
                          <Image src={avatar} alt="avatar" width={20} height={20} />
                          <span className="ml-2 text-[#D62024]">+{formatNumber(level.friendBonusPremium)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8">
                  <div className="flex justify-between items-center">
                  <h1
         style={{
         fontFamily: "'ZCOOL KuaiLe', sans-serif",
         fontSize: '1.5rem',
         textAlign: 'center',
         marginTop: '1rem',
         color: '#ffffff',
         }}
         >Invited Friends ({referralCount})
         </h1>
                    
                    <svg
                      className="w-6 h-6 text-[#ffffff] cursor-pointer"
                      onClick={fetchReferrals}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div className="mt-4 space-y-2">
                    {isLoadingReferrals ? (
                      // Skeleton loading animation
                      <div className="space-y-2 animate-pulse">
                        {[...Array(3)].map((_, index) => (
                          <div
                          key={index}
                          className="flex items-center bg-gradient-to-r from-white to-gray-100 rounded-lg p-4"
                        >                        
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                              <div className="space-y-2">
                                <div className="h-4 bg-gray-700 rounded w-24"></div>
                                <div className="h-3 bg-gray-700 rounded w-20"></div>
                              </div>
                            </div>
                            <div className="h-4 bg-gray-700 rounded w-16"></div>
                          </div>
                        ))}
                      </div>
                    ) : referrals.length > 0 ? (
                      <ul className="space-y-2">
                        {referrals.map((referral: Referral) => (
                          <li key={referral.id} className="flex justify-between items-center bg-gradient-to-r from-red-900 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                              <Image src={referral.levelImage} alt={referral.levelName} width={48} height={48} className="rounded-full" />
                              <div>
                                <span className="font-medium">{referral.name || `User ${referral.telegramId}`}</span>
                                <p className="text-sm text-gray-400">{referral.levelName} • {formatNumber(referral.points)} points</p>
                              </div>
                            </div>
                            <span className="text-[#f3ba2f]">+{formatNumber(referral.referralPointsEarned)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center text-gray-400 bg-gradient-to-r from-red-900 rounded-lg p-4">
                        You haven&apos;t invited anyone yet
                      </div>
                    )}
                  </div>
                </div>

                <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-xl z-40 flex gap-4 px-4">
                  <button
                    className="flex-grow py-3 bg-[#ffffff] rounded-lg text-[#0c0a0a] font-bold pulse-animation"
                    onClick={handleInviteFriend}
                  >
                    Invite friend
                  </button>
                  <button
                    className="w-12 h-12 bg-[#ffffff] rounded-lg text-[#AC36A0] font-bold flex items-center justify-center"
                    onClick={handleCopyInviteLink}
                  >
                    {copyButtonText === "Copied!" ? "✓" : <Copy />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
