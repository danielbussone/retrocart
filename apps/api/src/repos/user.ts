import type pg from "pg";

export type AppUserRow = {
  id: string;
  email: string | null;
  created_at: Date;
};

export async function findUserById(
  pool: pg.Pool,
  userId: string
): Promise<AppUserRow | null> {
  const result = await pool.query<AppUserRow>(
    `SELECT id, email, created_at FROM app_user WHERE id = $1`,
    [userId]
  );
  return result.rows[0] ?? null;
}
