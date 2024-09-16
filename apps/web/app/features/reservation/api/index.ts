import type { Reservation } from "../types/reservation";

export interface ReservationRequest {
  create: (input: Reservation) => Promise<void>;
}

const create: ReservationRequest["create"] = async (
  input: Reservation,
): Promise<void> => {
  const modifiedInputInput = {
    name: input.name,
    email: input.email,
    customerCount: input.customerCount,
    phone: input.phoneNumber,
    restaurantPhone: input.restaurantPhoneNumber,
    time: input.reserveDate,
  };
  try {
    await fetch("http://localhost:8787/reserve", {
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
