import type { ReservationRepository } from "../domain/repository/reservation-repository";
import type { UserRepository } from "../domain/repository/user-repository";
import { ID } from "../domain/value-object/id";
import type { MailService } from "../service/mail-service";
import { UsecaseError } from "./usecase-error";

type ReserveFailInput = {
  reservationID: string;
};

export async function reserveFail(
  repositories: {
    userRepository: UserRepository;
    reservationRepository: ReservationRepository;
  },
  services: {
    mailService: MailService;
  },
  input: ReserveFailInput,
): Promise<void> {
  const reservation = await repositories.reservationRepository.findBy(
    new ID(input.reservationID),
  );
  if (!reservation) {
    throw new UsecaseError(400, "Reservation Not Found");
  }

  const user = await repositories.userRepository.findBy(reservation.userID);
  if (!user) {
    throw new UsecaseError(400, "User Not Found");
  }

  const failReservation = reservation.fail();
  repositories.reservationRepository.save(failReservation);

  return services.mailService.sendFail(user, failReservation);
}
