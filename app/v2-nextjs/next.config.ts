import type { NextConfig } from "next";
import { join } from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: join(process.cwd(), ".."),
  transpilePackages: ["@project-x/shared"],
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
