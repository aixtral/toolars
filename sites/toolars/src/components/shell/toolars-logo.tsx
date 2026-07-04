import type { ComponentPropsWithoutRef } from "react";

type ToolarsLogoMarkProps = ComponentPropsWithoutRef<"span"> & {
  readonly label: string;
  readonly size?: "sm" | "md" | "lg";
};

export function ToolarsLogoMark({ className, label, size = "md", ...props }: ToolarsLogoMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={["toolars-logo-mark", `toolars-logo-mark-${size}`, className].filter(Boolean).join(" ")}
      data-logo-mark="toolars-stack-monolith-v9"
      data-testid="toolars-logo-mark"
      {...props}
    >
      <span className="toolars-logo-symbol" aria-hidden="true">
        <img
          alt=""
          className="toolars-logo-symbol-image"
          data-logo-symbol="toolars-stack-monolith-asset"
          draggable={false}
          src="/brand/toolars-stack-monolith-mark-v9.svg"
        />
      </span>
      <span className="toolars-logo-wordmark-text">{label}</span>
    </span>
  );
}
