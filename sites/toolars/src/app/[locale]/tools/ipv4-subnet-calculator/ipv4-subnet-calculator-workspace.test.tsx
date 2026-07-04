import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { Ipv4SubnetCalculatorWorkspace } from "./ipv4-subnet-calculator-workspace";

describe("Ipv4SubnetCalculatorWorkspace", () => {
  it("renders native IPv4 subnet calculator controls", () => {
    renderWithIntl(<Ipv4SubnetCalculatorWorkspace />);

    expect(screen.getByTestId("ai-lab-workbench")).toHaveAttribute("data-ai-lab-tool", "ipv4-subnet-calculator");
    expect(screen.getByRole("heading", { name: "IPv4 Subnet Calculator" })).toBeInTheDocument();
    expect(screen.getByLabelText("IPv4 address")).toBeInTheDocument();
    expect(screen.getByLabelText("CIDR prefix")).toBeInTheDocument();
  });

  it("calculates network and broadcast addresses", () => {
    renderWithIntl(<Ipv4SubnetCalculatorWorkspace />);

    fireEvent.change(screen.getByLabelText("IPv4 address"), { target: { value: "192.168.1.100" } });
    fireEvent.change(screen.getByLabelText("CIDR prefix"), { target: { value: "24" } });
    fireEvent.click(screen.getByRole("button", { name: "Calculate subnet" }));

    expect(screen.getByText("192.168.1.0")).toBeInTheDocument();
    expect(screen.getByText("192.168.1.255")).toBeInTheDocument();
    expect(screen.getByText("254")).toBeInTheDocument();
    expect(screen.getByText("Calculated")).toBeInTheDocument();
  });
});
