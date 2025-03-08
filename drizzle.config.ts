import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Çevre değişkenlerini yükle
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL çevre değişkeni tanımlanmamış, veritabanının sağlandığından emin olun");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
