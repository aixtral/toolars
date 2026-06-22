import type { Metadata } from "next";
import { ToolarsShell } from "@/components/shell/toolars-shell";
import { SubmitToolView } from "./submit-tool-view";

export const metadata: Metadata = {
  title: "Submit a tool",
  description:
    "Submit a calculator, AI tool, or workflow to the Toolars directory. Submissions are reviewed for quality, safety, and usability before publishing.",
  alternates: { canonical: "/submit" },
  robots: { index: true, follow: true }
};

export default function SubmitPage() {
  return (
    <ToolarsShell active="explore" sidebarVariant="none">
      <SubmitToolView />
    </ToolarsShell>
  );
}
