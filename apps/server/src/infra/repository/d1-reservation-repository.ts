import { drizzle } from "drizzle-orm/d1";

import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { Reservation } from "../../domain/model/reservation";
import type { ReservationRepository } from "../../domain/repository/reservation-repository";
import { ID } from "../../domain/value-object/id";
import { Phone } from "../../domain/value-object/phone";
import type { Status } from "../../domain/value-object/reservation-status";
import { type DBReservation, reservations, users } from "./d1/schema.server";

export class D1ReservationRepositoryImpl implements ReservationRepository {
  private _db: D1Database;
  constructor(db: D1Database) {
    this._db = db;
  }

  async findBy(id: ID): Promise<Reservation | null> {
    const db = drizzle(this._db);
    const results: DBReservation[] = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, id.value()))
      .limit(1);

    if (results.length === 0) {
      return null;
    }

    const result = results[0];

    const reservation = new Reservation({
      id: new ID(result.id),
      userID: new ID(result.userID),
      phone: new Phone(result.phone),
      time: dayjs(result.time),
      customerCount: result.customerCount,
      status: result.status as Status,
    });

    return reservation;
  }

  async save(reservation: Reservation): Promise<void> {
    const db = drizzle(this._db);

    const dbReservation: DBReservation = {
      id: reservation.identity().value(),
      userID: reservation.userID.value(),
      phone: reservation.phone.local,
      time: reservation.time.toISOString(),
      customerCount: reservation.customerCount,
      status: reservation.status,
    };

    const existReservation = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, dbReservation.id));

    if (existReservation.length === 0) {
      await db.insert(reservations).values(dbReservation);
    } else {
      await db
        .update(reservations)
        .set(dbReservation)
        .where(eq(reservations.id, dbReservation.id));
    }
  }

  async delete(reservation: Reservation): Promise<void> {
    const db = drizzle(this._db);
    const deleteReservation: DBReservation = {
      id: reservation.identity().value(),
      userID: reservation.userID.value(),
      phone: reservation.phone.local,
      time: reservation.time.toISOString(),
      customerCount: reservation.customerCount,
      status: reservation.status,
    };

    await db.delete(users).where(eq(users.id, deleteReservation.id));
  }
}
