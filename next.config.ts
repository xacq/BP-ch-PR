import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The MariaDB driver (and Prisma's adapter for it) rely on Node built-ins
  // like `fs`. Keep them external so the bundler requires them at runtime
  // instead of trying to bundle them (which fails with "Can't resolve 'fs'").
  serverExternalPackages: ["@prisma/adapter-mariadb", "mariadb"],
};

export default nextConfig;
