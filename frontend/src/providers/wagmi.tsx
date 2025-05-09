"use client";

import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { base, mainnet } from "viem/chains";
import {
  cookieStorage,
  cookieToInitialState,
  createConfig,
  createStorage,
  http,
  WagmiProvider,
  type Config,
} from "wagmi";
import { injected } from "wagmi/connectors";

const chains = [mainnet, base] as const;

// Function to clear wagmi cookies
export const clearWagmiCookies = () => {
  // wagmi uses these cookie keys
  const wagmiCookieKeys = [
    "wagmi.connected",
    "wagmi.wallet",
    "wagmi.store",
    "wagmi.network",
  ];

  // Clear each wagmi cookie by setting expiration to past date
  wagmiCookieKeys.forEach((key) => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

export const wagmiConfig = createConfig({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  chains: chains,
  transports: {
    [mainnet.id]: http("https://mainnet.llamarpc.com"),
    [base.id]: http("https://base.llamarpc.com"),
  },
  // Add the injected connector for wallet connections
  connectors: [injected(), farcasterFrame()],
});

// Create query client for React Query
const queryClient = new QueryClient();

// WagmiProvider component
interface CustomWagmiProviderProps {
  children: React.ReactNode;
  cookies: string | null;
}

export const CustomWagmiProvider = ({
  children,
  cookies,
}: CustomWagmiProviderProps) => {
  const initialState = cookieToInitialState(wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
