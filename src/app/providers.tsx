"use client";

import { SUPPORT_CHAINS } from "@/config";
import { NextUIProvider } from "@nextui-org/react";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "App name",
  projectId: "YOUR_PROJECT_ID",
  chains: SUPPORT_CHAINS as any,
  
  ssr: false, // If your dApp uses server side rendering (SSR)
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider coolMode locale="en">
            {children}</RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </NextUIProvider>
  );
}

export default Providers;
