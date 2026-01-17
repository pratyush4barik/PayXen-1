import "dotenv/config";
import { runMigrations } from "./migrate";
import { seed } from "./seed";

(async () => {
  await runMigrations();
  await seed();
  console.log("✅ Migrations + seed done");
  process.exit(0);
})();
