import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: path.join(__dirname, "../"),
};

export default nextConfig;
