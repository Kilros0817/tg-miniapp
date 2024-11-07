'use client'

// Importing necessary constants and components
import { WALLET_MANIFEST_URL } from '@/utils/consts';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

// Component to wrap the application with TonConnectUIProvider
export default function MyApp({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Providing the manifest URL to TonConnectUIProvider
    return (
        <TonConnectUIProvider manifestUrl={WALLET_MANIFEST_URL}>
            {children}
        </TonConnectUIProvider>
    );
}