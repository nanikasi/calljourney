import type { User } from "~/features/user/types/user";
import type { Reservation } from "../types/reservation";

export interface ReservationRequest {
  create: (
    input: { user: User; reservation: Reservation },
    serverURL: string,
  ) => Promise<void>;
}

const create: ReservationRequest["create"] = async (
  input: {
    user: User;
    reservation: Reservation;
  },
  serverURL: string,
): Promise<void> => {
  const modifiedInputInput = {
    name: input.user.name,
    email: input.user.email,
    phone: input.user.phoneNumber,
    customerCount: input.reservation.customerCount,
    restaurantPhone: input.reservation.restaurantPhoneNumber,
    time: input.reservation.reserveDate,
  };

  try {
    await fetch(`${serverURL}/reserve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedInputInput),
    });
  } catch (error) {
    console.error(error);
  }
};

export const reservationRequest: ReservationRequest = {
  create,
};
