import type { ReservationRepository } from "../domain/repository/reservation-repository";
import type { UserRepository } from "../domain/repository/user-repository";
import { ID } from "../domain/value-object/id";
import type { MailService } from "../service/mail-service";
import { UsecaseError } from "./usecase-error";

type ReserveSuccessInput = {
  reservationID: string;
};

export async function reserveSuccess(
  repositories: {
    userRepository: UserRepository;
    reservationRepository: ReservationRepository;
  },
  services: {
    mailService: MailService;
  },
  input: ReserveSuccessInput,
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

  const successReservation = reservation.success();
  await repositories.reservationRepository.save(successReservation);

  return await services.mailService.sendSuccess(user, reservation);
}
