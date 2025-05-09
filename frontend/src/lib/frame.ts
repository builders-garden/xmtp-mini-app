import { env } from "@/lib/env";

/**
 * Get the fonts for the frame from the public folder
 * @returns The fonts for the frame
 */
export async function getFonts(): Promise<
  {
    name: string;
    data: ArrayBuffer;
    weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
    style: "normal" | "italic";
  }[]
> {
  // Use Google Fonts directly
  const [font, fontBold] = await Promise.all([
    fetch(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_0ew.woff",
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_0ew.woff",
    ).then((res) => res.arrayBuffer()),
  ]);

  return [
    {
      name: "Inter",
      data: font,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: fontBold,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

/**
 * Get the farcaster manifest for the frame, generate yours from Warpcast Mobile
 *  On your phone go to Settings > Developer > Domains > insert website hostname > Generate domain manifest
 *  Or on your browser go to https://warpcast.com/~/developers/mini-apps/manifest and insert your domain
 * @returns The farcaster manifest for the frame
 */
export async function getFarcasterManifest() {
  return {
    accountAssociation: {
      header: env.NEXT_PUBLIC_FARCASTER_HEADER,
      payload: env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
      signature: env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
    },
    frame: {
      version: "1",
      name: "XMTP MiniApp",
      iconUrl: `${env.NEXT_PUBLIC_URL}/images/icon.png`,
      homeUrl: env.NEXT_PUBLIC_URL,
      imageUrl: `${env.NEXT_PUBLIC_URL}/images/frame-default-image.png`,
      buttonTitle: "Launch XMTP MiniApp",
      splashImageUrl: `${env.NEXT_PUBLIC_URL}/images/splash.png`,
      splashBackgroundColor: "#0d0d0d",
      webhookUrl: `${env.NEXT_PUBLIC_URL}/api/webhook/farcaster`,
    },
  };
}

// Mock implementation of the SDK
export const frameSdk = {
  context: Promise.resolve(null),
  actions: {
    setPrimaryButton: async () => {},
    ready: async (options?: { disableNativeGestures?: boolean }) => {},
    close: async () => {},
    viewProfile: async () => {},
    viewToken: async () => {},
    swap: async () => {},
    signIn: async () => ({}),
    openUrl: async () => {},
    addFrame: async () => ({}),
    composeCast: async () => {},
  },
};

/**
 * Get the frame metadata for the page
 * @param _params The parameters for the page
 * @returns The frame metadata for the page
 */
export const getFrameMetadata = (_params: {
  [key: string]: string | string[] | undefined;
}) => {
  const searchParamsString = Object.entries(_params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  const { conversationId } = _params;
  const buttonTitle = conversationId
    ? "Open Conversation in XMTP"
    : "Launch XMTP MiniApp";

  return {
    version: "next",
    imageUrl: `${env.NEXT_PUBLIC_URL}/images/frame-default-image.png`,
    button: {
      title: buttonTitle,
      action: {
        type: "launch_frame",
        name: "XMTP MiniApp",
        url: `${env.NEXT_PUBLIC_URL}/${searchParamsString ? `?${searchParamsString}` : ""}`,
        splashImageUrl: `${env.NEXT_PUBLIC_URL}/images/splash.png`,
        splashBackgroundColor: "#0d0d0d",
      },
    },
  };
};

export { frameSdk as sdk };
