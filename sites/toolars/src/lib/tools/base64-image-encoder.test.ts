import { describe, expect, it } from "vitest";
import { buildImageDataUrl, inspectImageDataUrl } from "./base64-image-encoder";

describe("Base64 image encoder", () => {
  it("builds and inspects image data URLs without uploading content", () => {
    const dataUrl = buildImageDataUrl({ base64: "aGVsbG8=", mimeType: "image/png" });
    const result = inspectImageDataUrl(dataUrl);

    expect(dataUrl).toBe("data:image/png;base64,aGVsbG8=");
    expect(result).toMatchObject({
      isValid: true,
      mimeType: "image/png",
      extension: "png",
      byteSize: 5,
      previewable: true
    });
  });
});
