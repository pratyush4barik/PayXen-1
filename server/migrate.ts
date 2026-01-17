import { db } from "./db";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pool } from "./db";
import path from "path";

export async function runMigrations() {
  try {
    console.log("🔄 Running migrations...");
    await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    console.log("✅ Migrations complete");
    
    // Ensure session table exists for connect-pg-simple
    await ensureSessionTable();
  } catch (err: any) {
    // If tables already exist, that's okay - just log it
    if (err.code === '42P07' || err.message?.includes('already exists')) {
      console.log("✅ Database tables already exist, skipping migration");
      await ensureSessionTable().catch(() => {});
      return;
    }
    console.error("❌ Migration failed:", err);
    throw err;
  }
}

async function ensureSessionTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        PRIMARY KEY ("sid")
      );
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" on "session" ("expire");
    `);
    console.log("✅ Session table ready");
  } finally {
    client.release();
  }
}
