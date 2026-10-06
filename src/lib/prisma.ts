import { PrismaClient } from "@/generated/prisma/client";
import { makeMariaDbAdapter } from "@/lib/mariadb-adapter";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: makeMariaDbAdapter() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
