import { db } from "./db";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import path from "path";

export async function runMigrations() {
  try {
    console.log("🔄 Running migrations...");
    await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    console.log("✅ Migrations complete");
  } catch (err: any) {
    // If tables already exist, that's okay - just log it
    if (err.code === '42P07' || err.message?.includes('already exists')) {
      console.log("✅ Database tables already exist, skipping migration");
      return;
    }
    console.error("❌ Migration failed:", err);
    throw err;
  }
}
