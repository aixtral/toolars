import { execFileSync } from "node:child_process";
import { fireEvent, screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { describe, expect, it } from "vitest";
import es from "../../../messages/es.json";
import zhHans from "../../../messages/zh-hans.json";
import { getCategoryHref, launchCertifiedCategories } from "@/data/registry";
import { ToolarsShell } from "./toolars-shell";

type AuditCandidate = {
  file: string;
  kind: string;
  text: string;
};

function shellAuditCandidates() {
  const output = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
        import { readFile } from "node:fs/promises";
        import { scanSourceText } from "./scripts/audit-i18n.mjs";

        const file = "src/components/shell/toolars-shell.tsx";
        const source = await readFile(file, "utf8");
        const scan = scanSourceText(source, file);

        console.log(JSON.stringify(scan.hardcodedText));
      `
    ],
    { cwd: process.cwd(), encoding: "utf8" }
  );

  return JSON.parse(output) as AuditCandidate[];
}

function sidebarLink(label: string) {
  const sidebar = document.querySelector("aside.sidebar");
  const scope = sidebar ? within(sidebar as HTMLElement) : screen;
  const link = scope.getAllByText(label).map((node) => node.closest("a")).find(Boolean);
  if (!link) throw new Error(`Missing sidebar link: ${label}`);
  return link;
}

describe("ToolarsShell", () => {
  it("keeps non-English shell cleanup protected by the i18n audit sentinel", () => {
    expect(shellAuditCandidates()).toEqual([]);
  });

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
    expect(screen.getByRole("link", { name: /^Finance$/ })).toHaveAttribute("href", "/explore/finance");
    expect(screen.getByRole("link", { name: /^Health$/ })).toHaveAttribute("href", "/explore/health");
    expect(screen.getByText("Recent Outputs")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
  });

  it("localizes PDF workspace topbar actions and labels", () => {
    render(
      <NextIntlClientProvider locale="zh-hans" messages={zhHans}>
        <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
          <h1>PDF workspace content</h1>
        </ToolarsShell>
      </NextIntlClientProvider>
    );

    expect(screen.getByLabelText("PDF 工作区操作")).toBeInTheDocument();
    expect(screen.getByLabelText("路径导航")).toBeInTheDocument();
    expect(screen.getByText("工具")).toBeInTheDocument();
    expect(screen.getAllByText("PDF 工具箱").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "分享" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "登录" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "注册" })).toBeInTheDocument();
    expect(screen.getByText("菜单")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "外观" })).toBeInTheDocument();
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
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in with Supabase" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Continue with Google" })).not.toBeInTheDocument();
  });

  it("renders a grouped account and language action cluster in the topbar", () => {
    const { container } = renderWithIntl(
      <ToolarsShell active="explore" sidebarVariant="none">
        <h1>Explore content</h1>
      </ToolarsShell>
    );

    const signIn = screen.getByRole("button", { name: "Sign in" });
    const signUp = screen.getByRole("button", { name: "Sign up" });
    const cluster = container.querySelector("[data-topbar-actions='account-language-v3']");

    expect(cluster).toBeInTheDocument();
    expect(signIn).toBeInTheDocument();
    expect(signUp).toBeInTheDocument();
    expect(signIn.closest(".topbar-account-actions")).toBe(signUp.closest(".topbar-account-actions"));
    expect(cluster).toContainElement(signIn);
    expect(cluster).toContainElement(signUp);
    expect(signUp).toHaveClass("button-solid");
    expect(signUp).toHaveClass("topbar-sign-up");
    expect(signIn).toHaveClass("topbar-sign-in");
  });

  it("exposes a direct RustDesk-style language list from the mobile menu", () => {
    const { container } = renderWithIntl(
      <ToolarsShell active="explore" sidebarVariant="none">
        <h1>Explore content</h1>
      </ToolarsShell>
    );

    const mobilePanel = container.querySelector("[data-mobile-menu-panel='rustdesk-mobile-language-v1']");

    expect(mobilePanel).toBeInTheDocument();
    expect(within(mobilePanel as HTMLElement).queryByRole("button", { name: "Switch language: English" })).not.toBeInTheDocument();
    expect(within(mobilePanel as HTMLElement).getAllByRole("option")).toHaveLength(4);
    expect(within(mobilePanel as HTMLElement).getByRole("option", { name: "English" })).toHaveAttribute("href", "/");
    expect(within(mobilePanel as HTMLElement).getByRole("option", { name: "简体中文" })).toHaveAttribute("href", "/zh-hans");
  });

  it("exposes category links and language controls together from the mobile menu", () => {
    const { container } = renderWithIntl(
      <ToolarsShell active="explore">
        <h1>Explore content</h1>
      </ToolarsShell>
    );

    const mobilePanel = container.querySelector("[data-mobile-menu-panel='rustdesk-mobile-language-v1']");

    expect(mobilePanel).toBeInTheDocument();
    expect(within(mobilePanel as HTMLElement).getByRole("link", { name: /AI Security/ })).toHaveAttribute("href", "/explore/ai-security");
    expect(within(mobilePanel as HTMLElement).getByRole("link", { name: /LLM Cost/ })).toHaveAttribute("href", "/explore/llm-cost");
    expect(within(mobilePanel as HTMLElement).getByRole("link", { name: /Finance/ })).toHaveAttribute("href", "/explore/finance");
    expect(within(mobilePanel as HTMLElement).getAllByRole("option")).toHaveLength(4);
  });

  it("marks the active topbar navigation item with a visible state class", () => {
    renderWithIntl(
      <ToolarsShell active="workflows" sidebarVariant="workflows">
        <h1>Workflow content</h1>
      </ToolarsShell>
    );

    const activeLink = screen.getByRole("link", { name: "Workflows" });
    expect(activeLink).toHaveAttribute("aria-current", "page");
    expect(activeLink).toHaveClass("topbar-nav-link", "is-active");
  });

  it("can render footer-driven content pages without a highlighted topbar nav item", () => {
    const { container } = renderWithIntl(
      <ToolarsShell active="none" sidebarVariant="none">
        <h1>Blog content</h1>
      </ToolarsShell>
    );

    expect(container.querySelector(".topbar .topbar-nav-link[aria-current='page']")).not.toBeInTheDocument();
    expect(container.querySelector(".topbar .topbar-nav-link.is-active")).not.toBeInTheDocument();
  });

  it("keeps shell navigation inside the active locale", () => {
    render(
      <NextIntlClientProvider locale="es" messages={es}>
        <ToolarsShell active="settings" sidebarVariant="settings">
          <h1>Settings content</h1>
        </ToolarsShell>
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("link", { name: /Workflows|Flujos/ })).toHaveAttribute("href", "/es/workflows");
    expect(screen.getByRole("link", { name: /Collections|Colecciones/ })).toHaveAttribute("href", "/es/collections");
    expect(screen.getByRole("link", { name: /Uso de prueba/ })).toHaveAttribute("href", "/es/settings/billing");
    expect(screen.getByRole("link", { name: /Privacidad e IA/ })).toHaveAttribute("href", "/es/settings/privacy-ai");
  });

  it("localizes shell sidebar chrome for Spanish release locales", () => {
    const { rerender } = render(
      <NextIntlClientProvider locale="es" messages={es}>
        <ToolarsShell active="pdf" sidebarVariant="pdf-workspace">
          <h1>PDF workspace content</h1>
        </ToolarsShell>
      </NextIntlClientProvider>
    );

    expect(screen.getByText("Salidas recientes")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Herramientas de imagen/ })).toHaveAttribute("href", "/es/explore/image");
    expect(screen.queryByText("Recent Outputs")).not.toBeInTheDocument();

    rerender(
      <NextIntlClientProvider locale="es" messages={es}>
        <ToolarsShell active="settings" sidebarVariant="settings">
          <h1>Settings content</h1>
        </ToolarsShell>
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("link", { name: /Privacidad e IA/ })).toHaveAttribute("href", "/es/settings/privacy-ai");
    expect(screen.getByText("¿Necesitas ayuda?")).toBeInTheDocument();
    expect(screen.queryByText("Need help?")).not.toBeInTheDocument();

    rerender(
      <NextIntlClientProvider locale="es" messages={es}>
        <ToolarsShell active="admin" sidebarVariant="admin">
          <h1>Admin content</h1>
        </ToolarsShell>
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("link", { name: /Nuevos envíos/ })).toHaveAttribute("href", "/es/admin/review");
    expect(screen.getByText("SLA de revisión")).toBeInTheDocument();
    expect(screen.queryByText("New submissions")).not.toBeInTheDocument();
  });

  it("localizes shell navigation and sidebar accessibility labels", () => {
    const { rerender } = render(
      <NextIntlClientProvider locale="zh-hans" messages={zhHans}>
        <ToolarsShell active="explore">
          <h1>Explore content</h1>
        </ToolarsShell>
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("navigation", { name: "主导航" })).toBeInTheDocument();
    expect(screen.getByLabelText("工具筛选器")).toBeInTheDocument();

    rerender(
      <NextIntlClientProvider locale="zh-hans" messages={zhHans}>
        <ToolarsShell active="my-tools" sidebarVariant="workspace">
          <h1>Workspace content</h1>
        </ToolarsShell>
      </NextIntlClientProvider>
    );

    expect(screen.getByLabelText("工作区导航")).toBeInTheDocument();
    expect(screen.getByLabelText("存储")).toBeInTheDocument();
    expect(screen.getByLabelText("AI 点数")).toBeInTheDocument();
  });

  it("localizes the admin brand home link for release locales", () => {
    render(
      <NextIntlClientProvider locale="zh-hans" messages={zhHans}>
        <ToolarsShell active="admin" sidebarVariant="admin">
          <h1>Admin content</h1>
        </ToolarsShell>
      </NextIntlClientProvider>
    );

    const brandHome = screen.getByRole("link", { name: "Toolars 管理首页" });

    expect(brandHome).toHaveClass("brand");
    expect(brandHome).toHaveAttribute("href", "/zh-hans/admin/review");
    expect(screen.getByText("Toolars 管理")).toBeInTheDocument();
    expect(screen.queryByLabelText("Toolars admin home")).not.toBeInTheDocument();
  });

  it("opens the sign-up account modal from the topbar Sign up button", () => {
    renderWithIntl(
      <ToolarsShell active="explore" sidebarVariant="none">
        <h1>Explore content</h1>
      </ToolarsShell>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    expect(screen.getByRole("dialog", { name: "Create your Toolars account" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Supabase account" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Continue with Google" })).not.toBeInTheDocument();
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

  it("renders every launch-certified tool category in the default sidebar as a navigable link", () => {
    renderWithIntl(
      <ToolarsShell active="explore">
        <h1>Explore content</h1>
      </ToolarsShell>
    );

    for (const category of launchCertifiedCategories) {
      const link = sidebarLink(category.label);

      expect(link).toHaveAttribute("href", getCategoryHref(category.label));
      expect(link).toHaveClass("side-link");
      expect(link).not.toHaveClass("side-link-static");
      expect(link.querySelector("svg")).toBeInTheDocument();
    }
    expect(screen.queryByText("Image")).not.toBeInTheDocument();
  });

  it("routes workflow sidebar categories to real pages or existing sections", () => {
    renderWithIntl(
      <ToolarsShell active="workflows" sidebarVariant="workflows">
        <h1>Workflow content</h1>
      </ToolarsShell>
    );

    expect(sidebarLink("All workflows")).toHaveAttribute("href", "/workflows");
    expect(sidebarLink("PDF")).toHaveAttribute("href", "/workflows/pdf-summary");
    expect(sidebarLink("Data")).toHaveAttribute("href", "/explore/data");
    expect(sidebarLink("Image")).toHaveAttribute("href", "/explore/image");
    expect(sidebarLink("Writing")).toHaveAttribute("href", "/explore/writing");
    expect(sidebarLink("Developer")).toHaveAttribute("href", "/explore/developer");
    expect(sidebarLink("Marketing")).toHaveAttribute("href", "/workflows#templates");
    expect(sidebarLink("Finance")).toHaveAttribute("href", "/explore/finance");
    expect(sidebarLink("Health")).toHaveAttribute("href", "/explore/health");
    expect(sidebarLink("AI")).toHaveAttribute("href", "/explore/ai-developer");
  });

  it("uses real sidebar icons for workflow and collection categories instead of abbreviations", () => {
    const { rerender } = renderWithIntl(
      <ToolarsShell active="workflows" sidebarVariant="workflows">
        <h1>Workflow content</h1>
      </ToolarsShell>
    );

    for (const label of ["All workflows", "PDF", "Data", "Image", "Writing", "Developer", "Marketing", "Finance", "Health", "AI"]) {
      const link = sidebarLink(label);

      expect(link.querySelector("svg")).toBeInTheDocument();
      expect(link.querySelector(".side-icon")).not.toBeInTheDocument();
    }

    rerender(
      <ToolarsShell active="collections" sidebarVariant="collections">
        <h1>Collection content</h1>
      </ToolarsShell>
    );

    for (const label of ["Featured", "My saved", "Team collections", "Productivity", "Developer", "Design", "Writing", "PDF", "Finance", "Health"]) {
      const link = sidebarLink(label);

      expect(link.querySelector("svg")).toBeInTheDocument();
      expect(link.querySelector(".side-icon")).not.toBeInTheDocument();
    }
  });

  it("routes collection sidebar categories to real pages or existing sections", () => {
    renderWithIntl(
      <ToolarsShell active="collections" sidebarVariant="collections">
        <h1>Collection content</h1>
      </ToolarsShell>
    );

    expect(sidebarLink("Featured")).toHaveAttribute("href", "/collections");
    expect(sidebarLink("My saved")).toHaveAttribute("href", "/my-tools#collections");
    expect(sidebarLink("Team collections")).toHaveAttribute("href", "/settings/team");
    expect(sidebarLink("Productivity")).toHaveAttribute("href", "/explore/productivity");
    expect(sidebarLink("Developer")).toHaveAttribute("href", "/explore/developer");
    expect(sidebarLink("Design")).toHaveAttribute("href", "/explore/frontend-design");
    expect(sidebarLink("Writing")).toHaveAttribute("href", "/explore/writing");
    expect(sidebarLink("PDF")).toHaveAttribute("href", "/collections/pdf-ops-kit");
    expect(sidebarLink("Finance")).toHaveAttribute("href", "/explore/finance");
    expect(sidebarLink("Health")).toHaveAttribute("href", "/explore/health");
  });

  it("keeps tool category sidebar links inside the active locale", () => {
    render(
      <NextIntlClientProvider locale="es" messages={es}>
        <ToolarsShell active="explore">
          <h1>Explore content</h1>
        </ToolarsShell>
      </NextIntlClientProvider>
    );

    expect(sidebarLink("Finanzas")).toHaveAttribute("href", "/es/explore/finance");
    expect(sidebarLink("Seguridad de IA")).toHaveAttribute("href", "/es/explore/ai-security");
  });

  it("marks routed category pages active by href", () => {
    const activeCases = [
      ["AI Security", "/explore/ai-security"],
      ["LLM Cost", "/explore/llm-cost"],
      ["RAG / MCP / Agent", "/explore/rag-mcp-agent"],
      ["Frontend & Design", "/explore/frontend-design"]
    ] as const;
    const { rerender } = renderWithIntl(
      <ToolarsShell active="explore" sidebarActiveHref={activeCases[0][1]}>
        <h1>{activeCases[0][0]} content</h1>
      </ToolarsShell>
    );

    for (const [index, [label, href]] of activeCases.entries()) {
      if (index > 0) {
        rerender(
          <ToolarsShell active="explore" sidebarActiveHref={href}>
            <h1>{label} content</h1>
          </ToolarsShell>
        );
      }

      const link = sidebarLink(label);
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("aria-current", "page");
      expect(link).toHaveClass("is-active");
    }
  });

  it("marks special PDF and AI directory sidebar entries active", () => {
    const { rerender } = renderWithIntl(
      <ToolarsShell active="pdf">
        <h1>PDF directory content</h1>
      </ToolarsShell>
    );

    expect(sidebarLink("PDF")).toHaveAttribute("href", "/explore/pdf");
    expect(sidebarLink("PDF")).toHaveAttribute("aria-current", "page");

    rerender(
      <ToolarsShell active="ai-developer">
        <h1>AI developer directory content</h1>
      </ToolarsShell>
    );

    expect(sidebarLink("AI")).toHaveAttribute("href", "/explore/ai-developer");
    expect(sidebarLink("AI")).toHaveAttribute("aria-current", "page");
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
