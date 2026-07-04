import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultSiteRoot = path.resolve(scriptDir, "..");
const launchLocales = ["en", "es", "zh-hans", "zh-hant"];
const cjkLocales = new Set(["zh-hans", "zh-hant"]);

const technicalWordAllowlist = new Set([
  "Aixtral",
  "API",
  "APY",
  "ARIA",
  "Alice",
  "ASRS-v",
  "Base",
  "Base64",
  "Beta",
  "BMI",
  "BMR",
  "Bengen",
  "Bob",
  "CCPA",
  "Coast",
  "Compose",
  "Cooper",
  "Cron",
  "CSS",
  "CSV",
  "DTI",
  "Devine",
  "Developer",
  "Docker",
  "Drive",
  "FAQ",
  "FIRE",
  "Flex",
  "Flexbox",
  "GAD",
  "GB",
  "GDPR",
  "Gemini",
  "GitHub",
  "GLP",
  "Google",
  "Graph",
  "Grid",
  "HEX",
  "HIPAA",
  "HOMA",
  "HOMA-IR",
  "HTML",
  "HTTP",
  "HTTPS",
  "HSL",
  "IP",
  "IPv",
  "IRA",
  "IR",
  "ISO",
  "Jeor",
  "JavaScript",
  "JSON",
  "JSONPath",
  "JWT",
  "KB",
  "Karvonen",
  "Lab",
  "Lorem",
  "Markdown",
  "MacBook",
  "Max",
  "Meta",
  "LLM",
  "MB",
  "MCP",
  "Mifflin-St",
  "mmHg",
  "Notion",
  "NanoID",
  "OAuth",
  "Open",
  "OpenAI",
  "PDF",
  "PNG",
  "PnL",
  "Pro",
  "PSS",
  "Q2",
  "RAG",
  "Regex",
  "RGB",
  "ROI",
  "Rows",
  "Riegel",
  "SEO",
  "SIP",
  "SLA",
  "SOC",
  "SQL",
  "SSO",
  "SVG",
  "TDEE",
  "Tailwind",
  "Team",
  "TLS",
  "Toolars",
  "Toolkit",
  "Twitter",
  "UA",
  "URI",
  "URL",
  "UTC",
  "UTF",
  "Unicode",
  "Unix",
  "User-Agent",
  "VitalCalc",
  "Visa",
  "Vision",
  "WHO",
  "UUID",
  "VO2",
  "WCAG",
  "Web",
  "WebP",
  "William",
  "XML",
  "ZIP",
  "auth",
  "beta",
  "border-radius",
  "box-shadow",
  "camelCase",
  "chmod",
  "eAG",
  "Epley",
  "feed",
  "glyph",
  "Ipsum",
  "kebab-case",
  "keyframes",
  "kcal",
  "KiB",
  "mmol",
  "nmol",
  "padding",
  "PascalCase",
  "red-team",
  "Slack",
  "snake",
  "tokenizer",
  "URL-safe",
  "viewport",
  "Webhook",
  "Word",
  "Alex",
  "Call",
  "Case",
  "Center",
  "Chmod",
  "Chrome",
  "Command",
  "Compressor",
  "Cookie",
  "Cost",
  "Counter",
  "Dropbox",
  "Escape",
  "Guard",
  "IDs",
  "Image",
  "Enhancer",
  "Injection",
  "Kim",
  "Kit",
  "Launch",
  "Linear",
  "Linux",
  "Marketplace",
  "Mina",
  "MiB",
  "Ops",
  "Ravi",
  "Red-team",
  "Repair",
  "SaaS",
  "Scanner",
  "Spring",
  "Summary",
  "Tester",
  "Text",
  "Widmark",
  "Window",
  "Workflow",
  "bpm",
  "case",
  "coast",
  "cookie",
  "cron",
  "docker",
  "docker-compose",
  "failure-mode",
  "flex",
  "front",
  "iPhone",
  "invoice-batch",
  "ipsum",
  "llm-cost",
  "matter",
  "meta",
  "metadata",
  "min",
  "mockup",
  "rate-limit",
  "reduced-motion",
  "rem",
  "rwx",
  "sleepmaxxing",
  "toolars",
  "yml",
  "allowlist",
  "app",
  "backed",
  "contract",
  "dialect",
  "embeddings",
  "evals",
  "groundedness",
  "Hallucination",
  "launch",
  "marketplace",
  "migrations",
  "Minify",
  "Option-aware",
  "pipe",
  "Podcast",
  "pull",
  "Segment",
  "unit",
  "vision",
  "i18n"
]);
const highConfidenceEnglishPhrases = [
  "Also check out",
  "Body Mass Index",
  "Calculate your",
  "For example",
  "Free online tool",
  "Health Guide",
  "Learn how",
  "Next Steps",
  "Simple estimate",
  "Table of Contents",
  "The minimum",
  "Use our",
  "min read",
  "to get your"
];
const englishSentenceSignalWords = new Set([
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "can",
  "for",
  "from",
  "has",
  "have",
  "how",
  "if",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "our",
  "that",
  "the",
  "this",
  "to",
  "use",
  "we",
  "when",
  "with",
  "without",
  "you",
  "your"
]);
const strongEnglishSentenceSignalWords = new Set([
  "but",
  "is",
  "its",
  "our",
  "that",
  "the",
  "this",
  "to",
  "use",
  "we",
  "when",
  "with",
  "without",
  "you",
  "your"
]);

const simplifiedToTraditional = {
  业: "業",
  个: "個",
  为: "為",
  义: "義",
  习: "習",
  书: "書",
  买: "買",
  于: "於",
  亏: "虧",
  产: "產",
  仅: "僅",
  内: "內",
  从: "從",
  们: "們",
  优: "優",
  会: "會",
  伤: "傷",
  体: "體",
  余: "餘",
  债: "債",
  值: "值",
  偿: "償",
  储: "儲",
  关: "關",
  兴: "興",
  写: "寫",
  冲: "衝",
  决: "決",
  况: "況",
  准: "準",
  减: "減",
  几: "幾",
  函: "函",
  击: "擊",
  则: "則",
  创: "創",
  划: "劃",
  删: "刪",
  剂: "劑",
  剧: "劇",
  务: "務",
  动: "動",
  助: "助",
  势: "勢",
  区: "區",
  协: "協",
  单: "單",
  卖: "賣",
  历: "歷",
  压: "壓",
  县: "縣",
  参: "參",
  双: "雙",
  发: "發",
  变: "變",
  号: "號",
  后: "後",
  向: "向",
  吗: "嗎",
  启: "啟",
  员: "員",
  咨: "諮",
  响: "響",
  团: "團",
  园: "園",
  图: "圖",
  场: "場",
  坏: "壞",
  块: "塊",
  坚: "堅",
  坛: "壇",
  备: "備",
  复: "復",
  处: "處",
  头: "頭",
  奖: "獎",
  妆: "妝",
  始: "始",
  存: "存",
  宁: "寧",
  实: "實",
  审: "審",
  导: "導",
  将: "將",
  专: "專",
  对: "對",
  寻: "尋",
  导: "導",
  尝: "嘗",
  层: "層",
  岁: "歲",
  岂: "豈",
  岛: "島",
  币: "幣",
  师: "師",
  帐: "帳",
  带: "帶",
  帮: "幫",
  干: "幹",
  并: "並",
  广: "廣",
  庆: "慶",
  库: "庫",
  应: "應",
  底: "底",
  废: "廢",
  开: "開",
  异: "異",
  弃: "棄",
  张: "張",
  强: "強",
  归: "歸",
  当: "當",
  录: "錄",
  径: "徑",
  徕: "徠",
  态: "態",
  总: "總",
  恢: "恢",
  恶: "惡",
  您: "您",
  情: "情",
  惯: "慣",
  烦: "煩",
  惩: "懲",
  愿: "願",
  户: "戶",
  执: "執",
  扩: "擴",
  扫: "掃",
  扰: "擾",
  护: "護",
  报: "報",
  拟: "擬",
  拥: "擁",
  择: "擇",
  挥: "揮",
  损: "損",
  换: "換",
  据: "據",
  授: "授",
  掉: "掉",
  探: "探",
  控: "控",
  推: "推",
  描: "描",
  提: "提",
  揭: "揭",
  搜: "搜",
  摆: "擺",
  摊: "攤",
  撑: "撐",
  摄: "攝",
  擎: "擎",
  改: "改",
  攻: "攻",
  数: "數",
  断: "斷",
  无: "無",
  旧: "舊",
  时: "時",
  显: "顯",
  晋: "晉",
  智: "智",
  暂: "暫",
  术: "術",
  机: "機",
  权: "權",
  条: "條",
  来: "來",
  极: "極",
  标: "標",
  栈: "棧",
  树: "樹",
  样: "樣",
  核: "核",
  档: "檔",
  检: "檢",
  楼: "樓",
  模: "模",
  横: "橫",
  欢: "歡",
  步: "步",
  残: "殘",
  每: "每",
  气: "氣",
  汉: "漢",
  汇: "匯",
  沟: "溝",
  没: "沒",
  泄: "洩",
  注: "註",
  测: "測",
  浏: "瀏",
  海: "海",
  涨: "漲",
  涉: "涉",
  润: "潤",
  清: "清",
  渐: "漸",
  渠: "渠",
  温: "溫",
  游: "遊",
  湾: "灣",
  滤: "濾",
  满: "滿",
  演: "演",
  点: "點",
  烧: "燒",
  热: "熱",
  焦: "焦",
  照: "照",
  爱: "愛",
  片: "片",
  牵: "牽",
  状: "狀",
  独: "獨",
  环: "環",
  现: "現",
  玑: "璣",
  码: "碼",
  确: "確",
  碍: "礙",
  礼: "禮",
  离: "離",
  种: "種",
  称: "稱",
  积: "積",
  程: "程",
  稳: "穩",
  穷: "窮",
  窗: "窗",
  笔: "筆",
  筛: "篩",
  简: "簡",
  算: "算",
  管: "管",
  类: "類",
  粘: "粘",
  精: "精",
  系: "系",
  级: "級",
  纪: "紀",
  纯: "純",
  纳: "納",
  线: "線",
  结: "結",
  练: "練",
  组: "組",
  细: "細",
  终: "終",
  经: "經",
  绑: "綁",
  绘: "繪",
  给: "給",
  统: "統",
  维: "維",
  绪: "緒",
  续: "續",
  绿: "綠",
  缓: "緩",
  编: "編",
  缩: "縮",
  缴: "繳",
  缺: "缺",
  网: "網",
  罗: "羅",
  罚: "罰",
  者: "者",
  联: "聯",
  职: "職",
  肤: "膚",
  胀: "脹",
  胜: "勝",
  胶: "膠",
  脏: "髒",
  脑: "腦",
  脱: "脫",
  腻: "膩",
  舰: "艦",
  艺: "藝",
  节: "節",
  药: "藥",
  获: "獲",
  营: "營",
  萤: "螢",
  藏: "藏",
  虑: "慮",
  虚: "虛",
  虽: "雖",
  虾: "蝦",
  蚀: "蝕",
  蛋: "蛋",
  行: "行",
  补: "補",
  表: "表",
  装: "裝",
  览: "覽",
  观: "觀",
  规: "規",
  视: "視",
  觉: "覺",
  触: "觸",
  议: "議",
  记: "記",
  许: "許",
  设: "設",
  访: "訪",
  证: "證",
  评: "評",
  识: "識",
  诉: "訴",
  试: "試",
  词: "詞",
  该: "該",
  详: "詳",
  语: "語",
  话: "話",
  误: "誤",
  请: "請",
  调: "調",
  谋: "謀",
  谓: "謂",
  谢: "謝",
  谷: "谷",
  负: "負",
  账: "帳",
  质: "質",
  费: "費",
  资: "資",
  赃: "贓",
  赞: "讚",
  赠: "贈",
  趋: "趨",
  跃: "躍",
  践: "踐",
  车: "車",
  轨: "軌",
  转: "轉",
  轮: "輪",
  软: "軟",
  载: "載",
  轻: "輕",
  较: "較",
  辅: "輔",
  辑: "輯",
  输: "輸",
  边: "邊",
  达: "達",
  迁: "遷",
  过: "過",
  运: "運",
  还: "還",
  进: "進",
  远: "遠",
  违: "違",
  连: "連",
  迟: "遲",
  适: "適",
  选: "選",
  这: "這",
  递: "遞",
  逻: "邏",
  遗: "遺",
  邻: "鄰",
  邮: "郵",
  释: "釋",
  里: "裡",
  鉴: "鑑",
  针: "針",
  钱: "錢",
  链: "鏈",
  销: "銷",
  错: "錯",
  键: "鍵",
  镜: "鏡",
  长: "長",
  门: "門",
  闭: "閉",
  问: "問",
  间: "間",
  阈: "閾",
  队: "隊",
  阶: "階",
  阳: "陽",
  阴: "陰",
  际: "際",
  险: "險",
  随: "隨",
  隐: "隱",
  难: "難",
  雏: "雛",
  零: "零",
  需: "需",
  预: "預",
  领: "領",
  题: "題",
  颜: "顏",
  风: "風",
  飞: "飛",
  饮: "飲",
  驱: "驅",
  验: "驗",
  骤: "驟",
  髅: "髏",
  鱼: "魚",
  鲜: "鮮",
  黄: "黃",
  黑: "黑",
  龄: "齡",
  链: "鏈",
  项: "項",
  预: "預",
  够: "夠",
  严: "嚴",
  凑: "湊",
  恼: "惱",
  税: "稅",
  声: "聲",
  荐: "薦",
  脚: "腳",
  绍: "紹",
  计: "計",
  订: "訂",
  败: "敗",
  签: "籤",
  紧: "緊",
  说: "說",
  额: "額",
  琐: "瑣",
  静: "靜"
};
const ambiguousTraditionalGlyphs = new Set(["干", "游", "里", "注", "泄"]);
const simplifiedGlyphMap = Object.fromEntries(
  Object.entries(simplifiedToTraditional).filter(
    ([simplified, traditional]) => simplified !== traditional && !ambiguousTraditionalGlyphs.has(simplified)
  )
);

const ignoredEnglishCandidateKeyParts = [
  ".files.",
  ".href",
  ".id",
  ".path",
  ".slug",
  ".url",
  "inputPlaceholder",
  "outputPlaceholder"
];

export async function createI18nQualityAudit(options = {}) {
  const siteRoot = path.resolve(options.siteRoot ?? defaultSiteRoot);
  const messages = await readMessages(path.join(siteRoot, "messages"));
  const blogCoverage = await createBlogCoverageAuditFromSite(siteRoot, launchLocales);
  const blogContentQuality = await createBlogContentQualityAuditFromSite(siteRoot);
  const blog = { ...blogCoverage, contentQuality: blogContentQuality };
  const byLocale = {};
  const blockers = [
    ...blogCoverage.blockers.map((blocker) => ({ type: "blog-localization-coverage", severity: "P0", ...blocker })),
    ...blogContentQuality.blockers
  ];
  const reviewItems = [...blogContentQuality.reviewItems];

  for (const locale of launchLocales) {
    const localeMessages = messages[locale] ?? {};
    const cjkEnglishCandidates = cjkLocales.has(locale) ? findCjkEnglishCandidates(localeMessages, locale) : [];
    const simplifiedGlyphCandidates = locale === "zh-hant" ? findZhHantSimplifiedGlyphCandidates(localeMessages) : [];

    if (simplifiedGlyphCandidates.length > 0) {
      blockers.push({
        type: "zh-hant-simplified-glyphs",
        severity: "P1",
        locale,
        count: simplifiedGlyphCandidates.length,
        sampleKeys: simplifiedGlyphCandidates.slice(0, 10).map((item) => item.key)
      });
    }

    if (cjkEnglishCandidates.length > 0) {
      reviewItems.push({
        type: "cjk-english-candidates",
        severity: "P1",
        locale,
        count: cjkEnglishCandidates.length,
        sampleKeys: cjkEnglishCandidates.slice(0, 10).map((item) => item.key)
      });
    }

    byLocale[locale] = {
      cjkEnglishCandidates: {
        count: cjkEnglishCandidates.length,
        items: cjkEnglishCandidates,
        samples: cjkEnglishCandidates.slice(0, 25)
      },
      simplifiedGlyphCandidates: {
        count: simplifiedGlyphCandidates.length,
        items: simplifiedGlyphCandidates,
        samples: simplifiedGlyphCandidates.slice(0, 25)
      }
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    status: blockers.length === 0 && reviewItems.length === 0 ? "pass" : "needs-work",
    roots: { siteRoot },
    summary: {
      launchLocales,
      blockers: blockers.length,
      reviewItems: reviewItems.length
    },
    blog,
    messages: { byLocale },
    blockers,
    reviewItems
  };
}

export function createBlogCoverageAudit({ launchLocales, englishSlugs, localizedSlugsByLocale }) {
  const allEnglishSlugs = uniquePreserveOrder(englishSlugs);
  const locales = {};
  const blockers = [];

  for (const locale of launchLocales) {
    if (locale === "en") {
      locales[locale] = {
        translated: allEnglishSlugs.length,
        missing: 0,
        missingSlugs: [],
        status: "source"
      };
      continue;
    }

    const localized = new Set(localizedSlugsByLocale[locale] ?? []);
    const missingSlugs = allEnglishSlugs.filter((slug) => !localized.has(slug));
    const translated = allEnglishSlugs.length - missingSlugs.length;

    locales[locale] = {
      translated,
      missing: missingSlugs.length,
      missingSlugs,
      status: missingSlugs.length === 0 ? "pass" : "needs-work"
    };

    if (missingSlugs.length > 0) {
      blockers.push({
        locale,
        missing: missingSlugs.length,
        total: allEnglishSlugs.length,
        sampleSlugs: missingSlugs.slice(0, 10)
      });
    }
  }

  return {
    totalArticles: allEnglishSlugs.length,
    locales,
    blockers
  };
}

export function createBlogContentQualityAudit({ localizedArticlesByLocale }) {
  const byLocale = {};
  const blockers = [];
  const reviewItems = [];

  for (const [locale, articles] of Object.entries(localizedArticlesByLocale)) {
    const englishCandidates = findBlogEnglishCandidates(articles, locale);
    const simplifiedGlyphCandidates = locale === "zh-hant" ? findZhHantSimplifiedGlyphCandidates(createBlogScanObject(articles)) : [];

    if (englishCandidates.length > 0) {
      reviewItems.push({
        type: "blog-english-candidates",
        severity: "P1",
        locale,
        count: englishCandidates.length,
        sampleKeys: englishCandidates.slice(0, 10).map((item) => item.key)
      });
    }

    if (simplifiedGlyphCandidates.length > 0) {
      blockers.push({
        type: "blog-zh-hant-simplified-glyphs",
        severity: "P1",
        locale,
        count: simplifiedGlyphCandidates.length,
        sampleKeys: simplifiedGlyphCandidates.slice(0, 10).map((item) => item.key)
      });
    }

    byLocale[locale] = {
      englishCandidates: {
        count: englishCandidates.length,
        items: englishCandidates,
        samples: englishCandidates.slice(0, 25)
      },
      simplifiedGlyphCandidates: {
        count: simplifiedGlyphCandidates.length,
        items: simplifiedGlyphCandidates,
        samples: simplifiedGlyphCandidates.slice(0, 25)
      }
    };
  }

  return { byLocale, blockers, reviewItems };
}

export function findBlogEnglishCandidates(articles, locale) {
  const scanObject = createBlogScanObject(articles);
  const flattened = flattenMessages(scanObject);
  const candidatesByKey = new Map();

  for (const [key, value] of Object.entries(flattened)) {
    const words = extractLocalizedBlogEnglishCandidates(value, locale);
    if (words.length > 0) {
      candidatesByKey.set(key, { key, words, value });
    }
  }

  if (cjkLocales.has(locale)) {
    for (const candidate of findCjkEnglishCandidates(scanObject, locale)) {
      const existing = candidatesByKey.get(candidate.key);
      candidatesByKey.set(candidate.key, {
        key: candidate.key,
        words: uniquePreserveOrder([...(existing?.words ?? []), ...candidate.words]),
        value: candidate.value
      });
    }
  }

  return [...candidatesByKey.values()].sort((a, b) => a.key.localeCompare(b.key));
}

export function findZhHantSimplifiedGlyphCandidates(messages) {
  const flattened = flattenMessages(messages);

  return Object.entries(flattened)
    .map(([key, value]) => {
      const glyphs = uniquePreserveOrder([...value].filter((glyph) => simplifiedGlyphMap[glyph]));
      return glyphs.length > 0 ? { key, glyphs, value } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.key.localeCompare(b.key));
}

export function findCjkEnglishCandidates(messages, locale) {
  if (!cjkLocales.has(locale)) return [];

  const flattened = flattenMessages(messages);

  return Object.entries(flattened)
    .filter(([key]) => !isIgnoredEnglishCandidateKey(key))
    .map(([key, value]) => {
      const words = extractSuspiciousEnglishWords(value);
      return words.length > 0 ? { key, words, value } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.key.localeCompare(b.key));
}

export function formatI18nQualitySummary(audit) {
  const lines = [
    `Toolars i18n quality audit: ${audit.status}`,
    `Launch locales: ${audit.summary.launchLocales.join(", ")}`,
    `Blockers: ${audit.summary.blockers}`,
    `Review items: ${audit.summary.reviewItems}`,
    `Blog localized coverage: ${formatBlogCoverage(audit.blog)}`
  ];

  if (audit.blog.contentQuality) {
    lines.push(`Blog content English candidates: ${formatBlogContentQualityCounts(audit.blog.contentQuality, "englishCandidates")}`);
    lines.push(`Blog zh-hant simplified glyph candidates: ${audit.blog.contentQuality.byLocale["zh-hant"]?.simplifiedGlyphCandidates.count ?? 0}`);
  }

  for (const locale of audit.summary.launchLocales) {
    const localeMessages = audit.messages.byLocale[locale];
    if (!localeMessages) continue;
    lines.push(`${locale} English candidates: ${localeMessages.cjkEnglishCandidates.count}`);
    lines.push(`${locale} simplified glyph candidates: ${localeMessages.simplifiedGlyphCandidates.count}`);
  }

  return `${lines.join("\n")}\n`;
}

async function createBlogCoverageAuditFromSite(siteRoot, launchLocales) {
  const blogSourcePath = path.join(siteRoot, "src/data/blog.ts");
  const blogSource = await fs.readFile(blogSourcePath, "utf8");
  const vitalcalcSource = await readJsonIfExists(path.join(siteRoot, "src/data/vitalcalc-blog-source.json"), []);
  const englishSlugs = [
    ...parseArticleSlugsFromSource(blogSource),
    ...vitalcalcSource.map((article) => article.slug).filter(Boolean)
  ];
  const translatedMappings = parseTranslatedArticleMappings(blogSource);
  const importMap = parseNamedImports(blogSource);
  const localizedSlugsByLocale = {};

  for (const locale of launchLocales) {
    if (locale === "en") continue;
    const exportName = translatedMappings[locale];
    const sourcePath = exportName ? importMap[exportName] : null;
    if (!sourcePath) {
      localizedSlugsByLocale[locale] = [];
      continue;
    }

    const localizedPath = path.resolve(path.dirname(blogSourcePath), sourcePath);
    localizedSlugsByLocale[locale] = await parseArticleSlugsFromModule(localizedPath);
  }

  return createBlogCoverageAudit({
    launchLocales,
    englishSlugs,
    localizedSlugsByLocale
  });
}

async function createBlogContentQualityAuditFromSite(siteRoot) {
  const dataRoot = path.join(siteRoot, "src/data");
  const moduleCache = new Map();
  const { articlesEs = [] } = loadTypeScriptExports(path.join(dataRoot, "blog-es.ts"), moduleCache);
  const { articlesZh = [] } = loadTypeScriptExports(path.join(dataRoot, "blog-zh.ts"), moduleCache);
  const { articlesZhHant = [] } = loadTypeScriptExports(path.join(dataRoot, "blog-zh-hant.ts"), moduleCache);

  return createBlogContentQualityAudit({
    localizedArticlesByLocale: {
      es: articlesEs,
      "zh-hans": articlesZh,
      "zh-hant": articlesZhHant
    }
  });
}

function loadTypeScriptExports(filePath, cache = new Map()) {
  const resolvedPath = resolveTypeScriptModulePath(filePath);
  if (!resolvedPath) return {};
  if (cache.has(resolvedPath)) return cache.get(resolvedPath).exports;

  const typescript = createRequire(import.meta.url)("typescript");
  const source = readFileSync(resolvedPath, "utf8");
  const output = typescript.transpileModule(source, {
    compilerOptions: {
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2020
    }
  }).outputText;
  const module = { exports: {} };
  cache.set(resolvedPath, module);
  const fallbackRequire = createRequire(resolvedPath);
  const localRequire = (specifier) => {
    if (specifier.startsWith(".")) {
      const tsPath = resolveTypeScriptModulePath(path.resolve(path.dirname(resolvedPath), specifier));
      if (tsPath) return loadTypeScriptExports(tsPath, cache);
    }

    return fallbackRequire(specifier);
  };

  vm.runInNewContext(
    output,
    {
      module,
      exports: module.exports,
      require: localRequire,
      console
    },
    { filename: resolvedPath }
  );

  return module.exports;
}

function parseTranslatedArticleMappings(source) {
  const block = findObjectLiteralBlock(source, "translatedArticlesByLocale");
  const mappings = {};
  if (!block) return mappings;

  for (const match of block.matchAll(/(?:"([^"]+)"|([A-Za-z][A-Za-z0-9_-]*))\s*:\s*([A-Za-z_$][A-Za-z0-9_$]*)/g)) {
    const locale = match[1] ?? match[2];
    mappings[locale] = match[3];
  }

  return mappings;
}

function parseNamedImports(source) {
  const imports = {};

  for (const match of source.matchAll(/import\s+\{\s*([^}]+)\s*\}\s+from\s+"([^"]+)"/g)) {
    const sourcePath = match[2];
    for (const rawName of match[1].split(",")) {
      const [importName, aliasName] = rawName.split(/\s+as\s+/).map((part) => part.trim());
      imports[aliasName || importName] = sourcePath;
    }
  }

  return imports;
}

function findObjectLiteralBlock(source, constName) {
  const start = source.indexOf(constName);
  if (start < 0) return "";
  const open = source.indexOf("{", start);
  if (open < 0) return "";

  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }

  return "";
}

function parseArticleSlugsFromSource(source) {
  return uniquePreserveOrder([...source.matchAll(/(?:"slug"|\bslug)\s*:\s*"([^"]+)"/g)].map((match) => match[1]));
}

async function parseArticleSlugsFromModule(modulePath, seen = new Set()) {
  const filePath = resolveTypeScriptModulePath(modulePath);
  if (!filePath || seen.has(filePath)) return [];
  seen.add(filePath);

  const source = await fs.readFile(filePath, "utf8");
  const slugs = parseArticleSlugsFromSource(source);

  for (const importPath of parseRelativeImports(source)) {
    slugs.push(...(await parseArticleSlugsFromModule(path.resolve(path.dirname(filePath), importPath), seen)));
  }

  return uniquePreserveOrder(slugs);
}

function resolveTypeScriptModulePath(modulePath) {
  if (existsSync(modulePath) && modulePath.endsWith(".ts")) return modulePath;
  if (existsSync(`${modulePath}.ts`)) return `${modulePath}.ts`;
  return "";
}

function parseRelativeImports(source) {
  return [...source.matchAll(/import\s+(?:type\s+)?(?:[^"']+)\s+from\s+"([^"]+)"/g)]
    .map((match) => match[1])
    .filter((importPath) => importPath.startsWith("."))
    .filter((importPath) => /blog/.test(importPath));
}

function extractSuspiciousEnglishWords(value) {
  const text = stripScanNeutralSyntax(value);
  const words = [...text.matchAll(/(?<!\p{L})[A-Za-z][A-Za-z'-]{2,}(?!\p{L})/gu)]
    .map((match) => match[0].replace(/^'+|'+$/g, "").replace(/-+$/g, ""))
    .filter((word) => word.length > 0)
    .filter((word) => !isAllowedEnglishWord(word));

  return uniquePreserveOrder(words);
}

function extractHighConfidenceEnglishPhrases(value) {
  const text = stripScanNeutralSyntax(value);
  const matches = [];

  for (const phrase of highConfidenceEnglishPhrases) {
    if (new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "i").test(text)) {
      matches.push(phrase);
    }
  }

  return matches;
}

function extractLocalizedBlogEnglishCandidates(value, locale) {
  if (locale === "en") return [];

  const phrases = extractHighConfidenceEnglishPhrases(value);
  if (phrases.length > 0) return phrases;

  return extractLikelyEnglishSentenceWords(value);
}

function extractLikelyEnglishSentenceWords(value) {
  const text = stripScanNeutralSyntax(value);
  const rawWords = [...text.matchAll(/(?<!\p{L})[A-Za-z][A-Za-z'-]*(?!\p{L})/gu)]
    .map((match) => normalizeEnglishSignalWord(match[0]))
    .filter(Boolean);
  const signalCount = rawWords.filter((word) => englishSentenceSignalWords.has(word)).length;
  const strongSignalCount = rawWords.filter((word) => strongEnglishSentenceSignalWords.has(word)).length;

  if (signalCount < 2 || strongSignalCount < 1) return [];

  const words = extractSuspiciousEnglishWords(value);
  return words.length >= 2 ? words : [];
}

function normalizeEnglishSignalWord(word) {
  return String(word ?? "")
    .toLowerCase()
    .replace(/^'+|'+$/g, "")
    .replace(/'s$/g, "")
    .replace(/-+$/g, "");
}

function stripScanNeutralSyntax(value) {
  return stripIcuSyntax(String(value ?? ""))
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, " ")
    .replace(/\b(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}\b/g, " ")
    .replace(/\b[a-z][a-z0-9_-]*:[a-z][a-z0-9_-]*\b/gi, " ")
    .replace(/\b(?:tk|whsec)_[A-Za-z0-9_•.-]+\b/g, " ")
    .replace(/\{[^{}]+\}/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\b[A-Za-z0-9_-]+\.(?:pdf|png|jpg|jpeg|webp|svg|json|csv|txt|md)\b/gi, " ")
    .replace(/\b[A-Za-z_$][A-Za-z0-9$]*_[A-Za-z0-9_$]+\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripIcuSyntax(value) {
  return String(value ?? "")
    .replace(/\{[A-Za-z_$][\w$-]*,\s*(?:plural|select|selectordinal)\s*,/g, "{")
    .replace(/\b(?:zero|one|two|few|many|other)\s*\{/g, "{")
    .replace(/#/g, " ");
}

function isAllowedEnglishWord(word) {
  if (technicalWordAllowlist.has(word) || technicalWordAllowlist.has(word.toUpperCase())) return true;
  if (/^[A-Z]{2,}$/.test(word)) return true;
  if (/^[A-Za-z]+-\d+$/.test(word)) return true;

  return false;
}

function isIgnoredEnglishCandidateKey(key) {
  return ignoredEnglishCandidateKeyParts.some((part) => key.includes(part));
}

function createBlogScanObject(articles) {
  const output = {};

  for (const article of articles ?? []) {
    if (!article?.slug) continue;
    output[article.slug] = {
      title: article.title,
      description: article.description,
      author: article.author,
      sections: (article.sections ?? []).map((section) => ({
        heading: section.heading,
        paragraphs: section.paragraphs ?? []
      })),
      faq: (article.faq ?? []).map((item) => ({
        question: item.question,
        answer: item.answer
      }))
    };
  }

  return output;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function readMessages(messagesDir) {
  const files = await safeReadDir(messagesDir);
  const messages = {};

  for (const file of files) {
    if (!file.isFile() || !file.name.endsWith(".json")) continue;
    const locale = file.name.replace(/\.json$/, "");
    messages[locale] = JSON.parse(await fs.readFile(path.join(messagesDir, file.name), "utf8"));
  }

  return messages;
}

async function readJsonIfExists(filePath, fallback) {
  if (!existsSync(filePath)) return fallback;
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function safeReadDir(dir) {
  try {
    return await fs.readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return [];
    throw error;
  }
}

function flattenMessages(value, prefix = "", output = {}) {
  if (!value || typeof value !== "object") {
    if (prefix) output[prefix] = String(value ?? "");
    return output;
  }

  const entries = Array.isArray(value) ? value.entries() : Object.entries(value);
  for (const [key, nestedValue] of entries) {
    const nextKey = prefix ? `${prefix}.${key}` : String(key);
    if (nestedValue && typeof nestedValue === "object") {
      flattenMessages(nestedValue, nextKey, output);
      continue;
    }
    output[nextKey] = String(nestedValue ?? "");
  }

  return output;
}

function uniquePreserveOrder(items) {
  return [...new Set(items)];
}

function formatBlogCoverage(blog) {
  return Object.entries(blog.locales)
    .map(([locale, coverage]) => `${locale}=${coverage.translated}/${blog.totalArticles}`)
    .join(", ");
}

function formatBlogContentQualityCounts(contentQuality, bucket) {
  return Object.entries(contentQuality.byLocale)
    .map(([locale, quality]) => `${locale}=${quality[bucket]?.count ?? 0}`)
    .join(", ");
}

async function runCli() {
  const args = process.argv.slice(2);
  const writeIndex = args.indexOf("--write");
  const writePath = writeIndex >= 0 ? args[writeIndex + 1] : null;
  const audit = await createI18nQualityAudit();

  if (writePath) {
    const target = path.resolve(defaultSiteRoot, writePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
  }

  if (args.includes("--json")) {
    process.stdout.write(`${JSON.stringify(audit, null, 2)}\n`);
  } else {
    process.stdout.write(formatI18nQualitySummary(audit));
  }

  if (args.includes("--fail-on-blockers") && audit.summary.blockers > 0) {
    process.exitCode = 1;
  }

  if (args.includes("--fail-on-needs-work") && audit.status !== "pass") {
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
