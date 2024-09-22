import { drizzle } from "drizzle-orm/d1";

import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { User } from "../../domain/model/user";
import type { UserRepository } from "../../domain/repository/user-repository";
import { Email } from "../../domain/value-object/email";
import { ID } from "../../domain/value-object/id";
import { Phone } from "../../domain/value-object/phone";
import { type DBUser, users } from "./d1/schema.server";

export class D1UserRepositoryImpl implements UserRepository {
  private _db: D1Database;
  constructor(db: D1Database) {
    this._db = db;
  }

  async findBy(id: ID): Promise<User | null> {
    const db = drizzle(this._db);
    const results: DBUser[] = await db
      .select()
      .from(users)
      .where(eq(users.id, id.value()))
      .limit(1);

    if (results.length === 0) {
      return null;
    }

    const result = results[0];

    const user = new User({
      id: new ID(result.id),
      name: result.name,
      email: new Email(result.email),
      phone: new Phone(result.phone),
    });

    return user;
  }

  async save(user: User): Promise<void> {
    const db = drizzle(this._db);

    const existUsers: DBUser[] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.identity().value()))
      .limit(1);

    if (existUsers.length === 0) {
      const dbUser: DBUser = {
        id: user.identity().value(),
        name: user.name,
        email: user.email.full,
        phone: user.phone.local,
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      };
      await db.insert(users).values(dbUser);
    } else {
      const dbUser: DBUser = {
        id: user.identity().value(),
        name: user.name,
        email: user.email.full,
        phone: user.phone.local,
        createdAt: existUsers[0].createdAt,
        updatedAt: dayjs().toISOString(),
      };
      await db.update(users).set(dbUser).where(eq(users.id, dbUser.id));
    }
  }

  async delete(user: User): Promise<void> {
    const db = drizzle(this._db);
    await db.delete(users).where(eq(users.id, user.identity().value()));
  }
}
