import "dotenv/config";
import { exec } from "child_process";

export async function runMigrations() {
  return new Promise<void>((resolve, reject) => {
    console.log("🗄️ Running database migrations...");

    exec("npx drizzle-kit push", (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Migration failed");
        console.error(stderr);
        return reject(error);
      }

      console.log(stdout);
      console.log("✅ Migrations completed");
      resolve();
    });
  });
}
