import type { NextConfig } from "next"

const config: NextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  eslint: {
    dirs: ["app", "middleware.ts"],
  },
}

export default config
