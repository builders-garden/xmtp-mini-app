"use client";

import dynamic from "next/dynamic";
import { FrameProvider } from "@/context/frame-context";
import { XMTPProvider } from "@/context/xmtp-context";
import { CustomWagmiProvider } from "@/providers/wagmi";

const ErudaProvider = dynamic(
  () => import("@/providers/eruda").then((c) => c.ErudaProvider),
  {
    ssr: false,
  },
);

export const Providers = ({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) => {
  return (
    <ErudaProvider>
      <CustomWagmiProvider cookies={cookies}>
        <FrameProvider>
          <XMTPProvider>{children}</XMTPProvider>
        </FrameProvider>
      </CustomWagmiProvider>
    </ErudaProvider>
  );
};
