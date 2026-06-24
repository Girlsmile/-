import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  /** Shared Prisma client cached during local development hot reloads. */
  prisma?: PrismaClient;
};

/** prisma is the single application Prisma client instance. */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
