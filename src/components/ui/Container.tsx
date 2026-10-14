import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "main";
}) {
  return (
    <Tag className={`mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
