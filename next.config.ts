import type { NextConfig } from "next";
import { execSync } from "node:child_process";
import packageJson from "./package.json" with { type: "json" };

function getAppVersion(): string {
  const base = packageJson.version as string;
  try {
    const hash = execSync("git rev-parse --short HEAD", { encoding: "utf-8" }).trim();
    return `${base}-${hash}`;
  } catch {
    return base;
  }
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: getAppVersion(),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
