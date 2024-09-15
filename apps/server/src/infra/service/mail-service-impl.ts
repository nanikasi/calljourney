import type { Reservation } from "../../domain/model/reservation";
import type { User } from "../../domain/model/user";
import type { MailService } from "../../service/mail-service";

export class MailServiceImpl implements MailService {
  sendSuccess(user: User, reservation: Reservation): void {}
  sendFail(user: User, reservation: Reservation): void {}
}
