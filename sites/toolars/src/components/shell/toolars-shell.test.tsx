import { fireEvent, screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import { ToolarsShell } from "./toolars-shell";

describe("ToolarsShell", () => {
  it("renders the workspace sidebar for personal workspace pages", () => {
    renderWithIntl(
      <ToolarsShell active="my-tools" sidebarVariant="workspace">
        <h1>Workspace content</h1>
      </ToolarsShell>
    );

    expect(screen.getByLabelText("Workspace navigation")).toBeInTheDocument();
    expect(screen.getByText("My workspace")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Overview/ })).toHaveAttribute("href", "/my-tools");
    expect(screen.getByRole("link", { name: /Recent outputs/ })).toHaveAttribute("href", "/my-tools#recent");
    expect(screen.getByText("AI credits")).toBeInTheDocument();
  });

  it("renders the PDF workspace chrome from the high-fidelity desktop design", () => {
    const { container } = renderWithIntl(
      <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
        <h1>PDF workspace content</h1>
      </ToolarsShell>
    );

    expect(container.querySelector(".topbar")).toHaveAttribute("data-desktop-layout", "pdf-workspace-v2");
    expect(screen.getByLabelText("PDF workspace navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /PDF Toolkit/ })).toHaveAttribute("href", "/tools/pdf-toolkit");
    expect(screen.getByRole("link", { name: /Image Tools/ })).toHaveAttribute("href", "/explore/image");
    expect(screen.getByText("Recent Outputs")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
  });

  it("can render route content without a sidebar", () => {
    const { container } = renderWithIntl(
      <ToolarsShell active="explore" sidebarVariant="none">
        <h1>Submit page</h1>
      </ToolarsShell>
    );

    expect(container.querySelector(".topbar")).toHaveAttribute("data-mobile-layout", "brand-menu-command-compact-v2");
    expect(screen.queryByLabelText("Tool filters")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Submit page" })).toBeInTheDocument();
  });

  it("opens the sign-in modal from the topbar", () => {
    renderWithIntl(
      <ToolarsShell active="explore" sidebarVariant="none">
        <h1>Explore content</h1>
      </ToolarsShell>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getByRole("dialog", { name: "Sign in to Toolars" })).toBeInTheDocument();
    expect(screen.queryByText("Continue with email")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue with Google" })).toBeInTheDocument();
  });

  it("renders paired Sign in and Sign up buttons in the auth region of the topbar", () => {
    renderWithIntl(
      <ToolarsShell active="explore" sidebarVariant="none">
        <h1>Explore content</h1>
      </ToolarsShell>
    );

    const signIn = screen.getByRole("button", { name: "Sign in" });
    const signUp = screen.getByRole("button", { name: "Sign up" });

    expect(signIn).toBeInTheDocument();
    expect(signUp).toBeInTheDocument();
    expect(signIn.closest(".topbar-auth")).toBe(signUp.closest(".topbar-auth"));
    expect(signUp).toHaveClass("button-solid");
    expect(signIn).toHaveClass("button-outline");
  });

  it("opens the sign-up account modal from the topbar Sign up button", () => {
    renderWithIntl(
      <ToolarsShell active="explore" sidebarVariant="none">
        <h1>Explore content</h1>
      </ToolarsShell>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(screen.getByRole("dialog", { name: "Create your Toolars account" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Continue with Google" })).toBeInTheDocument();
  });

  it("renders free trial sidebar copy instead of paid billing navigation in free trial mode", () => {
    renderWithIntl(
      <ToolarsShell active="pricing" sidebarVariant="billing">
        <h1>Pricing content</h1>
      </ToolarsShell>
    );

    expect(screen.getByLabelText("Trial navigation")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Pricing" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Plans & pricing/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Trial usage/ })).toHaveAttribute("href", "/settings/billing#usage");
    expect(screen.getByText("Free trial mode")).toBeInTheDocument();
    expect(screen.queryByText("30-day money-back guarantee")).not.toBeInTheDocument();
  });

  it("renders the settings sidebar for account settings surfaces", () => {
    renderWithIntl(
      <ToolarsShell active="settings" sidebarVariant="settings">
        <h1>Settings content</h1>
      </ToolarsShell>
    );

    expect(screen.getByLabelText("Settings navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Profile/ })).toHaveAttribute("href", "/settings");
    expect(screen.getByRole("link", { name: /Trial usage/ })).toHaveAttribute("href", "/settings/billing");
    expect(screen.getByRole("link", { name: /Privacy & AI/ })).toHaveAttribute("href", "/settings/privacy-ai");
    expect(screen.getByRole("link", { name: /Storage/ })).toHaveAttribute("href", "/settings/storage");
    expect(screen.getByRole("link", { name: /Team/ })).toHaveAttribute("href", "/settings/team");
    expect(screen.getByRole("link", { name: /API keys/ })).toHaveAttribute("href", "/settings/api-keys");
    expect(screen.getByRole("link", { name: /Notifications/ })).toHaveAttribute("href", "/settings/notifications");
    expect(screen.getByRole("link", { name: /Connected apps/ })).toHaveAttribute("href", "/settings/connected-apps");
    expect(screen.getByRole("link", { name: /Security/ })).toHaveAttribute("href", "/settings/security");
    expect(screen.getByText("Need help?")).toBeInTheDocument();
  });

  it("marks the active settings sidebar item when a settings subpage is open", () => {
    renderWithIntl(
      <ToolarsShell active="settings" sidebarActiveHref="/settings/privacy-ai" sidebarVariant="settings">
        <h1>Privacy settings content</h1>
      </ToolarsShell>
    );

    expect(screen.getByRole("link", { name: /Privacy & AI/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Profile/ })).not.toHaveAttribute("aria-current");
  });

  it("marks new settings subpages as active from their real routes", () => {
    renderWithIntl(
      <ToolarsShell active="settings" sidebarActiveHref="/settings/security" sidebarVariant="settings">
        <h1>Security settings content</h1>
      </ToolarsShell>
    );

    expect(screen.getByRole("link", { name: /Security/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Profile/ })).not.toHaveAttribute("aria-current");
  });

  it("renders the admin review sidebar and admin navigation", () => {
    renderWithIntl(
      <ToolarsShell active="admin" sidebarVariant="admin">
        <h1>Admin content</h1>
      </ToolarsShell>
    );

    expect(screen.getByLabelText("Admin review navigation")).toBeInTheDocument();
    expect(screen.getByText("Toolars Admin")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Queue" })).toHaveAttribute("href", "/admin/review");
    expect(screen.getByRole("link", { name: "Queue" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Tools" })).toHaveAttribute("href", "/admin/review#tools");
    expect(screen.getByRole("link", { name: /New submissions/ })).toHaveAttribute("href", "/admin/review");
    expect(screen.getByRole("link", { name: /Needs security review/ })).toHaveAttribute("href", "/admin/review#security");
    expect(screen.getByRole("link", { name: /AI consent review/ })).toHaveAttribute("href", "/admin/review#ai-consent");
    expect(screen.getByText("Review SLA")).toBeInTheDocument();
  });
});
