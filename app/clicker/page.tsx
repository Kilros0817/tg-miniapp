'use client'

import React, { useState, useCallback, ReactNode, useEffect } from 'react';
import Game from '@/components/Game';
import Mine from '@/components/Mine';
import Friends from '@/components/Friends';
import Earn from '@/components/Earn';
import Airdrop from '@/components/Airdrop';
import Navigation from '@/components/Navigation';
import LoadingScreen from '@/components/Loading';
import Boost from '@/components/Boost';
import { AutoIncrement } from '@/components/AutoIncrement';
import { PointSynchronizer } from '@/components/PointSynchronizer';

import {
    useLaunchParams,
} from '@telegram-apps/sdk-react';

import { useTelegramMock } from '@/hooks/useTelegramMock';
import { useDidMount } from '@/hooks/useDidMount';
import { useGameStore } from '@/utils/game-mechanics';

function ClickerPage() {

    const {
        setUserTelegramName,
        setUserTelegramInitData
    } = useGameStore();

    const [currentView, setCurrentViewState] = useState<string>('loading');
    const [isInitialized, setIsInitialized] = useState(false);

    const setCurrentView = (newView: string) => {
        console.log('Changing view to:', newView);
        setCurrentViewState(newView);
    };

    const renderCurrentView = useCallback(() => {
        if (!isInitialized) {
            return <LoadingScreen
                setIsInitialized={setIsInitialized}
                setCurrentView={setCurrentView}
            />;
        }

        switch (currentView) {
            case 'game':
                return <Game
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />;
            case 'boost':
                return <Boost
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />
            case 'mine':
                return <Mine />;
            case 'friends':
                return <Friends />;
            case 'earn':
                return <Earn />;
            case 'airdrop':
                return <Airdrop />;
            default:
                return <Game
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />;
        }
    }, [currentView, isInitialized]);

    const isDev = process.env.NODE_ENV === 'development';

    // Mock Telegram environment in development mode if needed.
    if (isDev) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useTelegramMock();
    }
    

    const registerUser = async (tgData: any) => {
        try {
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    telegramInitData: tgData,
                    referrerTelegramId: null
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save user');
            }

            const data = await response.json();
            return true;
        } catch (error) {
            console.error('Error saving user:', error);
            return false;
        }
    }

    const lp = useLaunchParams();
    useEffect(() => {
        if (lp) {
            setUserTelegramInitData(lp.initDataRaw || '');
            setUserTelegramName(`${lp.initData?.user?.firstName} ${lp.initData?.user?.lastName}`.trim())
            registerUser(lp.initDataRaw);
        }
    }, [lp])

    return (
        <div className="bg-black min-h-screen text-white">
            {
                isInitialized &&
                <>
                    <AutoIncrement />
                    <PointSynchronizer />
                </>
            }
            {renderCurrentView()}
            {isInitialized && currentView !== 'loading' && (
                <Navigation
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                />
            )}
        </div>
    );
}

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

export default function ClickerPageWithErrorBoundary() {
    const didMount = useDidMount();

    return didMount && (
        <ErrorBoundary>
            <ClickerPage />
        </ErrorBoundary>
    );
}