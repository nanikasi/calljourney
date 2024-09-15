import type { Reservation } from "../model/reservation";
import type { ID } from "../value-object/id";

export interface ReservationRepository {
  findBy(id: ID): Promise<Reservation | null>;

  save(reservation: Reservation): Promise<void>;
  delete(reservation: Reservation): Promise<void>;
}
