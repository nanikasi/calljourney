import { Reservation } from "../domain/model/reservation";
import { User } from "../domain/model/user";
import type { ReservationRepository } from "../domain/repository/reservation-repository";
import type { UserRepository } from "../domain/repository/user-repository";
import { Email } from "../domain/value-object/email";
import { Phone } from "../domain/value-object/phone";
import type { CallService } from "../service/call-service";

type ReserveInput = {
  name: string;
  phone: string;
  email: string;
  restaurantPhone: string;
  time: string;
  customerCount: number;
};

type ReserveOutput = {
  id: string;
};

export async function reserve(
  repositories: {
    userRepository: UserRepository;
    reservationRepository: ReservationRepository;
  },
  services: {
    callService: CallService;
  },
  input: ReserveInput,
): Promise<ReserveOutput> {
  const newUser = User.new({
    name: input.name,
    email: new Email(input.email),
    phone: new Phone(input.phone),
  });
  const newReservation = Reservation.new({
    userID: newUser.identity(),
    time: new Date(input.time),
    customerCount: input.customerCount,
  });

  // TODO: Transaction
  await repositories.userRepository.save(newUser);
  await repositories.reservationRepository.save(newReservation);

  services.callService.call(newUser, newReservation);

  return { id: newReservation.identity().value() };
}
