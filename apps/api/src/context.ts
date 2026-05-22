import type { YogaInitialContext } from "graphql-yoga";
import type pg from "pg";
import { getPool } from "./db/pool.js";

export type GraphQLContext = {
  pool: pg.Pool;
  userId: string | null;
};

const DEFAULT_DEV_USER_ID = "00000000-0000-4000-8000-000000000001";

function resolveDevUserId(request: Request): string | null {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  if (nodeEnv !== "development") {
    return null;
  }

  const header = request.headers.get("x-dev-user-id");
  const fromEnv = process.env.DEV_USER_ID ?? DEFAULT_DEV_USER_ID;

  if (header && header !== fromEnv) {
    return null;
  }

  return header ?? fromEnv;
}

// SECURITY-REVIEW: dev-only user impersonation via header/env; replace with Clerk/Supabase before production.
export function createContext(
  yogaContext: YogaInitialContext
): GraphQLContext {
  const userId = resolveDevUserId(yogaContext.request);
  return {
    pool: getPool(),
    userId,
  };
}
