import { ChevronRight } from "lucide-react";

export function ResourceCard({
  icon,
  title,
  description,
  href,
  meta
}: Readonly<{
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  meta?: string;
}>) {
  return (
    <a className="resource-card" href={href}>
      <span className="icon-tile">{icon}</span>
      <span>
        <h3>{title}</h3>
        <p>{description}</p>
        {meta ? <span className="badge local">{meta}</span> : null}
      </span>
      <ChevronRight size={18} aria-hidden="true" />
    </a>
  );
}
