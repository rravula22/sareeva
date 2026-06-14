import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
  var prismaPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;

const pool = connectionString
  ? globalThis.prismaPool ??
    new Pool({
      connectionString,
    })
  : undefined;

if (pool && !globalThis.prismaPool) {
  globalThis.prismaPool = pool;
}

const adapter = pool ? new PrismaPg(pool) : undefined;

export const prisma =
  globalThis.prisma ??
  (adapter ? new PrismaClient({ adapter }) : new PrismaClient());

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
