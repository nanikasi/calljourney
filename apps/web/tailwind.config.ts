import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-image": "url('/bg-image1.png')",
      },
    },
  },
  plugins: [],
} satisfies Config;
