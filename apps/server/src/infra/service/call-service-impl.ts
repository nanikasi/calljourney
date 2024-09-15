import type { Reservation } from "../../domain/model/reservation";
import type { User } from "../../domain/model/user";
import type { CallService } from "../../service/call-service";

export class CallServiceImpl implements CallService {
  call(user: User, reservation: Reservation): void {}
}
