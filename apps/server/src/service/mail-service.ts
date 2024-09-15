import type { Reservation } from "../domain/model/reservation";
import type { User } from "../domain/model/user";

export interface MailService {
  sendSuccess(user: User, reservation: Reservation): void;
  sendFail(user: User, reservation: Reservation): void;
}
