import { PrismaClient } from "@prisma/client";
import net from "net";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  dbAvailable?: boolean;
  dbLastChecked?: number;
};

function createClient(): PrismaClient {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  } catch {
    return {} as PrismaClient;
  }
}

export const db: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

/**
 * Fast non-blocking socket probe (maks 100ms) dengan cache status 10 detik.
 * Mencegah freeze TCP timeout saat service database sedang offline.
 */
export async function isDatabaseOnline(): Promise<boolean> {
  const now = Date.now();
  if (
    globalForPrisma.dbLastChecked &&
    now - globalForPrisma.dbLastChecked < 10000 &&
    globalForPrisma.dbAvailable !== undefined
  ) {
    return globalForPrisma.dbAvailable;
  }

  const dbUrl = process.env.DATABASE_URL || "";
  const isLocalhost = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");

  // Jika remote database (seperti Neon PostgreSQL di Vercel) atau berjalan di lingkungan Vercel:
  if (!isLocalhost || process.env.VERCEL || process.env.NODE_ENV === "production") {
    try {
      const probePromise = db.$queryRawUnsafe("SELECT 1");
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database probe timeout")), 2500)
      );

      await Promise.race([probePromise, timeoutPromise]);
      globalForPrisma.dbAvailable = true;
      globalForPrisma.dbLastChecked = Date.now();
      return true;
    } catch {
      globalForPrisma.dbAvailable = false;
      globalForPrisma.dbLastChecked = Date.now();
      return false;
    }
  }

  // Jika localhost Docker di mesin development lokal: gunakan socket probe kilat 120ms
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isResolved = false;

    const finalize = (status: boolean) => {
      if (!isResolved) {
        isResolved = true;
        globalForPrisma.dbAvailable = status;
        globalForPrisma.dbLastChecked = Date.now();
        socket.destroy();
        resolve(status);
      }
    };

    socket.setTimeout(120);
    socket.once("connect", () => finalize(true));
    socket.once("timeout", () => finalize(false));
    socket.once("error", () => finalize(false));

    try {
      socket.connect(5432, "127.0.0.1");
    } catch {
      finalize(false);
    }
  });
}

