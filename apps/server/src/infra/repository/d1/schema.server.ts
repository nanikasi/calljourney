import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
});
export type DBUser = typeof users.$inferSelect;

export const reservations = sqliteTable("reservations", {
  id: text("id").primaryKey(),
  userID: text("user_id").notNull(),
  phone: text("phone").notNull(),
  time: text("time").notNull(),
  customerCount: integer("customer_count").notNull(),
  status: text("status").notNull(),
});
export type DBReservation = typeof reservations.$inferSelect;
