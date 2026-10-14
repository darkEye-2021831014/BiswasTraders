import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF8F5",
        sand: "#EDE4D8",
        brick: {
          DEFAULT: "#A13828",
          hover: "#812113",
          deep: "#5C1810",
        },
        charcoal: {
          DEFAULT: "#1F2421",
          soft: "#2D3135",
        },
        mortar: "#7E8287",
        navy: {
          DEFAULT: "#001A2B",
          deep: "#000F1A",
        },
        orange: {
          DEFAULT: "#FD5500",
          soft: "#FDB493",
        },
        wa: "#25D366",
        line: "#D1D5DB",
        ink: "#181C20",
        error: "#BA1A1A",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        bn: ["var(--font-anek-bangla)", "var(--font-hind-siliguri)", "system-ui"],
        bnBody: ["var(--font-hind-siliguri)", "var(--font-anek-bangla)", "system-ui"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.125rem",
        md: "0.375rem",
        none: "0",
      },
      boxShadow: {
        stamp: "3px 3px 0 0 #1F2421",
        "stamp-sm": "2px 2px 0 0 #1F2421",
        "stamp-brick": "3px 3px 0 0 #A13828",
        "stamp-brick-sm": "2px 2px 0 0 #A13828",
      },
      letterSpacing: {
        eyebrow: "0.08em",
        label: "0.04em",
      },
      maxWidth: {
        prose: "70ch",
      },
    },
  },
  plugins: [],
};

export default config;
