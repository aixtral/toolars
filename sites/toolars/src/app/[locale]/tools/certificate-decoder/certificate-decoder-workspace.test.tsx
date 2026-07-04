import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { SAMPLE_CERTIFICATE_PEM } from "@/lib/tools/certificate-decoder";
import { CertificateDecoderWorkspace } from "./certificate-decoder-workspace";

describe("CertificateDecoderWorkspace", () => {
  it("renders the Toolars certificate decoder workspace sections", () => {
    renderWithIntl(<CertificateDecoderWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "certificate-decoder");
    expect(screen.getByRole("heading", { name: "Certificate Decoder" })).toBeInTheDocument();
    expect(screen.getByText("TLS certificate inspection")).toBeInTheDocument();
    expect(screen.getByText("Decoded fields")).toBeInTheDocument();
    expect(screen.getByText("Validity review")).toBeInTheDocument();
    expect(screen.getByLabelText("PEM certificate")).toBeInTheDocument();
  });

  it("decodes a PEM certificate locally", async () => {
    renderWithIntl(<CertificateDecoderWorkspace />);

    fireEvent.change(screen.getByLabelText("PEM certificate"), {
      target: { value: SAMPLE_CERTIFICATE_PEM }
    });
    fireEvent.click(screen.getByRole("button", { name: "Decode certificate" }));

    await waitFor(() => expect(screen.getAllByText("testca").length).toBeGreaterThanOrEqual(1));
    expect(screen.getByText("Expired")).toBeInTheDocument();
    expect(screen.getByText("Local certificate decoding only; PEM input stays in the browser.")).toBeInTheDocument();
  });
});
