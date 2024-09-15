import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/infra/repository/d1/schema.server.ts",
  out: "./src/infra/repository/d1/migrations",
  driver: "d1-http",
  migrations: {
    table: "migrations_custom",
  },
  dbCredentials: {
    accountId: "",
    databaseId: "",
    token: "",
  },
});
