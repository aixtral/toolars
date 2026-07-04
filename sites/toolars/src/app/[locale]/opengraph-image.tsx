import { ImageResponse } from "next/og";
import en from "../../../messages/en.json";
import es from "../../../messages/es.json";
import zhHans from "../../../messages/zh-hans.json";
import zhHant from "../../../messages/zh-hant.json";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type OpenGraphHeadlineText = {
  readonly primary: string;
  readonly secondary: string;
};

export type OpenGraphImageText = {
  readonly alt: string;
  readonly tagline: string;
  readonly headline: OpenGraphHeadlineText;
  readonly subtitle: string;
};

type OpenGraphImageMessageBundle = {
  readonly openGraph: {
    readonly image: OpenGraphImageText;
  };
};

type OpenGraphImageMessageBundleMap = {
  readonly [locale: string]: OpenGraphImageMessageBundle;
};

type OpenGraphImageParams = {
  readonly locale?: string;
};

interface OpenGraphImageParamsThenable {
  then(resolve: (value: OpenGraphImageParams) => unknown): unknown;
}

type OpenGraphImageProps = {
  readonly params?: OpenGraphImageParams | OpenGraphImageParamsThenable;
};

const openGraphMessageBundles = {
  en,
  es,
  "zh-hans": zhHans,
  "zh-hant": zhHant
} satisfies OpenGraphImageMessageBundleMap;

type OpenGraphImageLocale = keyof typeof openGraphMessageBundles;

const fallbackOpenGraphImageLocale: OpenGraphImageLocale = "en";

function hasOpenGraphImageBundle(locale: string): locale is OpenGraphImageLocale {
  return locale in openGraphMessageBundles;
}

function isOpenGraphImageParamsThenable(value: unknown): value is OpenGraphImageParamsThenable {
  return Boolean(value && typeof value === "object" && "then" in value);
}

async function resolveOpenGraphImageParams(params: OpenGraphImageProps["params"]) {
  if (isOpenGraphImageParamsThenable(params)) return await params;
  return params;
}

export function resolveOpenGraphImageText(locale: string | null | undefined): OpenGraphImageText {
  const resolvedLocale = locale && hasOpenGraphImageBundle(locale) ? locale : fallbackOpenGraphImageLocale;
  return openGraphMessageBundles[resolvedLocale].openGraph.image;
}

export const alt = resolveOpenGraphImageText(fallbackOpenGraphImageLocale).alt;

export default async function OGImage({ params }: OpenGraphImageProps = {}) {
  const resolvedParams = await resolveOpenGraphImageParams(params);
  const imageText = resolveOpenGraphImageText(resolvedParams?.locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #134e4a 50%, #059669 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800
            }}
          >
            T
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em" }}>Toolars</span>
            <span style={{ fontSize: 18, color: "#bbf7d0", fontWeight: 700 }}>{imageText.tagline}</span>
          </div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", maxWidth: 900 }}>
          {imageText.headline.primary}
          <br />
          {imageText.headline.secondary}
        </div>
        <div style={{ fontSize: 28, color: "#94a3b8", marginTop: 24, maxWidth: 800, lineHeight: 1.4 }}>
          {imageText.subtitle}
        </div>
      </div>
    ),
    { ...size }
  );
}
