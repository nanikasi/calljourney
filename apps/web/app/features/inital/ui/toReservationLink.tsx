import { Link } from "@remix-run/react";

export const ToReservationLink = () => {
  return (
    <Link
      to="/reservation/store"
      className="w-72 h-40 flex flex-col items-center justify-center text-center bg-gray-200 font-semibold text-lg rounded-lg"
    >
      <img src="/foodIcon.png" alt="Example" className="w-20 h-auto" />
      予約の方はこちら
    </Link>
  );
};
