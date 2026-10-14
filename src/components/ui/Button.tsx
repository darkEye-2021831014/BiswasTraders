import type { ReactNode } from "react";

type Variant = "primary" | "dark" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-display font-semibold tracking-label uppercase touch select-none transition-transform duration-100 active:translate-x-[1px] active:translate-y-[1px]";

const sizes: Record<Size, string> = {
  sm: "h-10 px-3 text-[11px]",
  md: "h-12 px-4 text-xs",
  lg: "h-14 px-6 text-sm",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-brick text-white border border-brick hover:bg-brick-hover hover:border-brick-hover hover:shadow-stamp-brick-sm",
  dark: "bg-charcoal text-white border border-charcoal hover:shadow-stamp-sm",
  outline:
    "bg-canvas text-charcoal border-[1.5px] border-charcoal hover:shadow-stamp-sm",
  ghost:
    "bg-transparent text-charcoal border border-transparent hover:bg-sand",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">) {
  return (
    <a className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}
