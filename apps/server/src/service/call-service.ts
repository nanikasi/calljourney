import type { Reservation } from "../domain/model/reservation";
import type { User } from "../domain/model/user";

export interface CallService {
  call(user: User, reservation: Reservation): void;
}
