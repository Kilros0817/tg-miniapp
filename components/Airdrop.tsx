'use client'

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { avatar, owl_coins, TON } from '@/images';
import { useTonConnectUI } from '@tonconnect/ui-react';
import Angle from '@/icons/Angle';
import Copy from '@/icons/Copy';
import Cross from '@/icons/Cross';
import { useGameStore } from '@/utils/game-mechanics';
import { useToast } from '@/contexts/ToastContext';
import { Address } from "@ton/core";

export default function Airdrop() {
    const [tonConnectUI] = useTonConnectUI();
    const { tonWalletAddress, setTonWalletAddress, userTelegramInitData } = useGameStore();
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const showToast = useToast();

    const handleWalletConnection = useCallback(async (address: string) => {
        setIsLoading(true);
        try {
            const success = await saveWalletAddress(address);
            if (!success) {
                if (tonConnectUI.account?.address) {
                    await tonConnectUI.disconnect();
                }
                showToast("Failed to save wallet address. Please try connecting again.", "error");
            } else {
                showToast("Wallet connected successfully!", "success");
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            showToast("An error occurred while connecting the wallet.", "error");
        } finally {
            setIsLoading(false);
            setIsConnecting(false);
        }
    }, [tonConnectUI, showToast]);

    const handleWalletDisconnection = useCallback(async () => {
        setIsLoading(true);
        try {
            await disconnectWallet();
            setTonWalletAddress(null);
            showToast("Wallet disconnected successfully!", "success");
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
            showToast("An error occurred while disconnecting the wallet.", "error");
        } finally {
            setIsLoading(false);
        }
    }, [setTonWalletAddress, showToast]);

    useEffect(() => {
        const unsubscribe = tonConnectUI.onStatusChange(async (wallet) => {
            if (wallet && isConnecting) {
                await handleWalletConnection(wallet.account.address);
            } else if (!wallet && !isConnecting) {
                await handleWalletDisconnection();
            }
        });

        return () => {
            unsubscribe();
        };
    }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection, isConnecting]);

    const saveWalletAddress = async (address: string): Promise<boolean> => {
        try {
            const response = await fetch('/api/wallet/connect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    initData: userTelegramInitData,
                    walletAddress: address,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save wallet address');
            }

            const data = await response.json();
            setTonWalletAddress(data.walletAddress);
            return true;
        } catch (error) {
            console.error('Error saving wallet address:', error);
            return false;
        }
    };

    const disconnectWallet = async () => {
        try {
            const response = await fetch('/api/wallet/disconnect', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    initData: userTelegramInitData,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to disconnect wallet');
            }
        } catch (error) {
            console.error('Error disconnecting wallet:', error);
            throw error;
        }
    };

    const handleWalletAction = async () => {
        if (tonConnectUI.account?.address) {
            await tonConnectUI.disconnect();
        } else {
            setIsConnecting(true);
            await tonConnectUI.openModal();
        }
    };

    const formatAddress = (address: string) => {
        const tempAddress = Address.parse(address).toString();

        return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
    };

    const copyToClipboard = () => {
        if (tonWalletAddress) {
            const temp = Address.parse(tonWalletAddress).toString();
            navigator.clipboard.writeText(temp);
            setCopied(true);
            showToast("Address copied to clipboard!", "success");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePaidTaskClicked = () => {
        showToast('Onchain tasks coming soon!', 'success');
    };

    return (
        <div className="bg-black flex justify-center min-h-screen">
            <div className="w-full bg-black text-white font-bold flex flex-col max-w-xl">
                {/* Inner Gradient Container */}
                <div className="flex-grow mt-4 rounded-t-[48px] relative top-glow z-0 overflow-hidden">
                    <div className="bg-gradient-to-b from-[#575EFF] to-[#0ECBFF] rounded-t-[46px] h-full">
                        <div className="px-4 pt-1 pb-24">
                            <div className="relative mt-4">
                                <div className="flex justify-center mb-4">
                                    <Image src={avatar} alt="owl Token" width={96} height={96} className="rounded-lg mr-2" />
                                </div>
                                <h1
                                    style={{
                                        fontFamily: "'ZCOOL KuaiLe', sans-serif",
                                        fontSize: '1.5rem',
                                        textAlign: 'center',
                                        marginTop: '1rem',
                                        color: '#ffffff',
                                    }}
                                >
                                    Rewards
                                </h1>
                                <p className="text-white-500 text-center mb-4 font-normal">There is a list of challenges below. Complete them to qualify for the DINOH Airdrop.</p>
                                <h1
                                    style={{
                                        fontFamily: "'ZCOOL KuaiLe', sans-serif",
                                        fontSize: '1.5rem',
                                        textAlign: 'center',
                                        marginTop: '1rem',
                                        color: '#ffffff',
                                    }}
                                >
                                    Wallet
                                </h1>

                                {isLoading ? (
                                    <div className="flex justify-between items-center bg-gradient-to-r from-red-900 rounded-lg p-4 w-full">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 text-[#791B1B] rounded-lg animate-pulse mr-2"></div>
                                            <div className="flex flex-col">
                                                <div className="w-32 h-4 text-[#791B1B] rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="w-20 h-8 text-[#791B1B] rounded animate-pulse"></div>
                                    </div>
                                ) : !tonWalletAddress ? (
                                    <button
                                        onClick={handleWalletAction}
                                        className="flex justify-between border border-[#791B1B] items-center bg-[#000000] rounded-lg p-4 cursor-pointer w-full"
                                        disabled={isLoading}
                                    >
                                        <div className="flex items-center">
                                            <Image src={TON} alt="Ton wallet" width={40} height={40} className="rounded-lg mr-2" />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-lg text-[#fffff]">Connect your TON wallet</span>
                                            </div>
                                        </div>
                                        <Angle size={42} className="text-[#fffff]" />
                                    </button>

                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleWalletAction}
                                            className="w-12 h-12 bg-[#33363b] rounded-lg text-white font-bold flex items-center justify-center"
                                            disabled={isLoading}
                                        >
                                            <Cross className="text-[#8b8e93]" />
                                        </button>
                                        <button
                                            onClick={copyToClipboard}
                                            className="flex-grow justify-between py-3 bg-[#33363b] rounded-lg text-white font-medium"
                                            disabled={isLoading}
                                        >
                                            <div className="w-full flex justify-between px-4 items-center">
                                                <div className="flex items-center gap-2">
                                                    <span>{formatAddress(tonWalletAddress)}</span>
                                                </div>
                                                <div>
                                                    <Copy className="text-[#8b8e93]" />
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                )}
                                <h1
                                    style={{
                                        fontFamily: "'ZCOOL KuaiLe', sans-serif",
                                        fontSize: '1.5rem',
                                        textAlign: 'center',
                                        marginTop: '1rem',
                                        color: '#ffffff',
                                    }}
                                >
                                    Tasks
                                </h1>
                                <div className="space-y-2">
                                    <button
                                        className="w-full flex justify-between items-center rounded-lg p-4 relative overflow-hidden"
                                        onClick={handlePaidTaskClicked}
                                        style={{
                                            backgroundColor: '#FFFFFF', // White button surface for contrast
                                            borderRadius: '19px', // Rounded corners for a softer look
                                            position: 'relative',
                                            padding: '1.5rem',
                                            boxShadow: '0 4px 0 #AC36A0, 0 6px 15px rgba(0, 0, 0, 0.2)', // Thinner magenta base with adjusted shadow
                                        }}
                                    >
                                        {/* Content Layer */}
                                        <div className="relative z-10 flex items-center">
                                            <Image src={owl_coins} alt="Task Image" width={40} height={40} className="rounded-lg mr-2" />
                                            <div className="flex flex-col">
                                                <span className="text-lg font-bold text-[#170515]">Ice Age Advancement</span>
                                                <div className="flex items-center">
                                                    <Image src={avatar} alt="Task Image" width={25} height={25} className="rounded-lg mr-2" />
                                                    <span className="text-lg font-bold text-[#070207]">+500K</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right-side TON value */}
                                        <p className="text-[#000000] font-bold text-1xl relative z-10">0.5 TON</p>
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
