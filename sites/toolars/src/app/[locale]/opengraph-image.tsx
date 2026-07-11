import { ImageResponse } from "next/og";

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

type OpenGraphImageParams = {
  readonly locale?: string;
};

interface OpenGraphImageParamsThenable {
  then(resolve: (value: OpenGraphImageParams) => unknown): unknown;
}

type OpenGraphImageProps = {
  readonly params?: OpenGraphImageParams | OpenGraphImageParamsThenable;
};

const openGraphImageTextByLocale = {
  en: {
    alt: "Toolars - All tools. One workspace.",
    tagline: "All tools. One workspace.",
    headline: {
      primary: "All tools.",
      secondary: "One workspace."
    },
    subtitle: "Calculators, AI tools, PDF utilities, and workflows - local-first, free to start."
  },
  es: {
    alt: "Toolars - Todas las herramientas. Un solo espacio de trabajo.",
    tagline: "Todas las herramientas. Un solo espacio de trabajo.",
    headline: {
      primary: "Todas las herramientas.",
      secondary: "Un solo espacio de trabajo."
    },
    subtitle: "Calculadoras, herramientas de IA, utilidades PDF y flujos de trabajo - locales primero y gratis para empezar."
  },
  "zh-hans": {
    alt: "Toolars - 全部工具，一个工作台。",
    tagline: "全部工具，一个工作台。",
    headline: {
      primary: "全部工具。",
      secondary: "一个工作台。"
    },
    subtitle: "计算器、AI 工具、PDF 实用工具和工作流 - 本地优先，免费开始。"
  },
  "zh-hant": {
    alt: "Toolars - 全部工具，一個工作台。",
    tagline: "全部工具，一個工作台。",
    headline: {
      primary: "全部工具。",
      secondary: "一個工作台。"
    },
    subtitle: "計算器、AI 工具、PDF 實用工具和工作流 - 本地優先，免費開始。"
  }
} satisfies Record<string, OpenGraphImageText>;

type OpenGraphImageLocale = keyof typeof openGraphImageTextByLocale;

const fallbackOpenGraphImageLocale: OpenGraphImageLocale = "en";

function hasOpenGraphImageBundle(locale: string): locale is OpenGraphImageLocale {
  return locale in openGraphImageTextByLocale;
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
  return openGraphImageTextByLocale[resolvedLocale];
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
