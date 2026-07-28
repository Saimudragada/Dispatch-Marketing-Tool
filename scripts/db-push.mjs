// Applies the Prisma schema during Vercel builds, where only DATABASE_URL may
// be configured. Tries candidate direct-connection URLs in order until one
// works, since `prisma db push` needs a connection that allows DDL.
import { execSync } from "node:child_process";

const { DATABASE_URL, DIRECT_URL } = process.env;

if (!DATABASE_URL && !DIRECT_URL) {
  console.error("db-push: neither DATABASE_URL nor DIRECT_URL is set.");
  process.exit(1);
}

const candidates = [];
if (DIRECT_URL) candidates.push({ label: "DIRECT_URL", url: DIRECT_URL });
if (DATABASE_URL) {
  candidates.push({ label: "DATABASE_URL", url: DATABASE_URL });
  if (DATABASE_URL.includes(":6543")) {
    // Supabase: transaction pooler runs on 6543, session pooler (which
    // supports DDL reliably) on 5432 at the same host.
    candidates.push({
      label: "DATABASE_URL with session-pooler port 5432",
      url: DATABASE_URL.replace(":6543", ":5432").replace(/([?&])pgbouncer=true&?/, "$1"),
    });
  }
}

for (const { label, url } of candidates) {
  console.log(`db-push: trying ${label}…`);
  try {
    // --accept-data-loss: the repo schema is canonical for this single-tenant
    // demo deployment; it lets db push drop stray/vestigial enum values or
    // columns that drifted into the database outside the repo.
    execSync("npx prisma db push --skip-generate --accept-data-loss", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: url, DIRECT_URL: url },
    });
    console.log(`db-push: schema applied via ${label}.`);
    process.exit(0);
  } catch {
    console.warn(`db-push: ${label} failed, trying next candidate…`);
  }
}

console.error("db-push: all connection candidates failed.");
process.exit(1);
