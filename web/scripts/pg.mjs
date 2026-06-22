import EmbeddedPostgres from "embedded-postgres";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", ".pgdata");

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "postgres",
  port: 54329,
  persistent: true,
});

const action = process.argv[2] ?? "start";

if (action === "start") {
  const fs = await import("node:fs");
  const isFirstRun = !fs.existsSync(path.join(dataDir, "PG_VERSION"));
  if (isFirstRun) {
    console.log("[pg] initializing data directory...");
    await pg.initialise();
  }
  await pg.start();
  console.log("[pg] started on port 54329");
  if (isFirstRun) {
    await pg.createDatabase("edwyz");
    console.log("[pg] created database 'edwyz'");
  }
  process.on("SIGINT", async () => {
    await pg.stop();
    process.exit(0);
  });
  process.on("SIGTERM", async () => {
    await pg.stop();
    process.exit(0);
  });
  // keep process alive
  await new Promise(() => {});
} else if (action === "stop") {
  await pg.stop();
  console.log("[pg] stopped");
}
