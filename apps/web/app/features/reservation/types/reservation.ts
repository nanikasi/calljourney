import type { Dayjs } from "dayjs";

export type Reservation = {
  restaurantPhoneNumber: string;
  reserveDate: Dayjs;
  customerCount: number;
};
