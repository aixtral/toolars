export interface MarkdownToJsonInput {
  input: string;
}

export interface MarkdownNode {
  type: "heading" | "paragraph" | "list" | "code" | "image" | "hr";
  content?: string;
  level?: number;
  items?: string[];
  language?: string;
  url?: string;
  alt?: string;
}

export interface MarkdownToJsonData {
  metadata: {
    title: string;
    description: string;
    wordCount: number;
    readingTime: number;
  };
  content: MarkdownNode[];
}

export interface MarkdownStructure {
  headings: number;
  paragraphs: number;
  lists: number;
  codeBlocks: number;
  links: number;
  images: number;
}

export interface MarkdownToJsonResult {
  success: boolean;
  data: MarkdownToJsonData | null;
  structure: MarkdownStructure;
  output: string;
  error?: string;
  summary: string;
  privacyNote: string;
}

const emptyStructure: MarkdownStructure = {
  headings: 0,
  paragraphs: 0,
  lists: 0,
  codeBlocks: 0,
  links: 0,
  images: 0
};

const privacyNote = "Local Markdown parsing only; content stays in the browser.";

export function convertMarkdownToJson({ input }: MarkdownToJsonInput): MarkdownToJsonResult {
  try {
    const data: MarkdownToJsonData = {
      metadata: {
        title: "",
        description: "",
        wordCount: 0,
        readingTime: 0
      },
      content: []
    };
    const structure: MarkdownStructure = { ...emptyStructure };
    const lines = input.split("\n");
    let currentParagraph: string[] = [];
    let currentList: MarkdownNode | null = null;
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeLines: string[] = [];

    const flushParagraph = () => {
      if (currentParagraph.length === 0) return;
      data.content.push({ type: "paragraph", content: currentParagraph.join(" ") });
      structure.paragraphs += 1;
      currentParagraph = [];
    };
    const flushList = () => {
      if (!currentList) return;
      data.content.push(currentList);
      currentList = null;
    };

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          data.content.push({ type: "code", language: codeLanguage || "text", content: codeLines.join("\n") });
          structure.codeBlocks += 1;
          inCodeBlock = false;
          codeLanguage = "";
          codeLines = [];
        } else {
          flushParagraph();
          flushList();
          inCodeBlock = true;
          codeLanguage = trimmed.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch) {
        flushParagraph();
        flushList();
        const level = headingMatch[1].length;
        const content = headingMatch[2];

        data.content.push({ type: "heading", level, content });
        structure.headings += 1;
        if (level === 1 && !data.metadata.title) data.metadata.title = content;
        continue;
      }

      const listMatch = line.match(/^\s*[-*+]\s+(.+)$/);
      if (listMatch) {
        flushParagraph();
        if (!currentList) {
          currentList = { type: "list", items: [] };
          structure.lists += 1;
        }
        currentList.items?.push(listMatch[1]);
        continue;
      }

      if (currentList) flushList();

      const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imageMatch) {
        flushParagraph();
        data.content.push({ type: "image", alt: imageMatch[1], url: imageMatch[2] });
        structure.images += 1;
        continue;
      }

      for (const _match of line.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
        structure.links += 1;
      }

      if (/^[-*_]{3,}$/.test(trimmed)) {
        flushParagraph();
        data.content.push({ type: "hr" });
        continue;
      }

      if (!trimmed) {
        flushParagraph();
        continue;
      }

      currentParagraph.push(line);
    }

    flushParagraph();
    flushList();

    const words = input.split(/\s+/).filter(Boolean);
    data.metadata.wordCount = words.length;
    data.metadata.readingTime = Math.ceil(words.length / 200);
    const firstParagraph = data.content.find((node) => node.type === "paragraph" && node.content);
    if (firstParagraph?.content) {
      data.metadata.description =
        firstParagraph.content.length > 160 ? `${firstParagraph.content.slice(0, 157)}...` : firstParagraph.content;
    }

    const output = JSON.stringify(data, null, 2);
    const blockCount = data.content.length;

    return {
      success: true,
      data,
      structure,
      output,
      summary: `Parsed ${blockCount.toLocaleString("en-US")} Markdown ${blockCount === 1 ? "block" : "blocks"} into JSON.`,
      privacyNote
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      structure: { ...emptyStructure },
      output: "",
      error: error instanceof Error ? error.message : "Failed to parse Markdown.",
      summary: "Markdown conversion failed.",
      privacyNote
    };
  }
}
