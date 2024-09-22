import type {
  ActionFunctionArgs,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/cloudflare";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { Button } from "~/components/button";
import { reservationRequest } from "~/features/reservation/api";
import type { Reservation } from "~/features/reservation/types/reservation";
import { getSession } from "~/features/share/func/session";

export const meta: MetaFunction = () => {
  return [
    { title: "予約情報確認" },
    {
      name: "description",
      content: "Welcome to AppName",
    },
  ];
};

type ReservationConfirmationDTO = {
  restaurantPhoneNumber: string;
  reserveDate: string;
  customerCount: string;
  name: string;
  phoneNumber: string;
  email: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const reservation = session.get("reservation");
  const user = session.get("user");

  if (!reservation || !user) {
    return redirect("/reservation/store");
  }

  return json({
    restaurantPhoneNumber: reservation.restaurantPhoneNumber,
    reserveDate: dayjs(reservation.reserveDate)
      .tz("Asia/Tokyo")
      .format("YYYY年MM月DD日HH時mm分"),
    customerCount: reservation.customerCount.toString,
    name: user.name,
    phoneNumber: user.phoneNumber,
    email: user.email,
  });
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const reservation = session.get("reservation");
  const user = session.get("user");

  if (!reservation || !user) {
    return redirect("/reservation/store");
  }

  await reservationRequest.create(
    {
      user: user,
      reservation: reservation,
    },
    context.cloudflare.env.SERVER_URL,
  );

  return redirect("/call/complete");
};

export default function Index() {
  const data: ReservationConfirmationDTO = useLoaderData();

  const labels: { [key in keyof ReservationConfirmationDTO]: string } = {
    restaurantPhoneNumber: "お店の電話番号",
    customerCount: "来店人数",
    reserveDate: "予約時刻",
    name: "予約者の名前",
    phoneNumber: "予約者の電話番号",
    email: "予約者のメールアドレス",
  };

  const reservationInfoWithLabel = Object.entries(data).map(([key, value]) => ({
    label: labels[key as keyof Reservation],
    value: value,
  }));

  return (
    <div className="w-full flex flex-col items-center space-y-16">
      <div className="w-full flex flex-col items-center text-center space-y-20">
        <p className="mt-2 font-semibold">以下の情報で予約します。</p>
      </div>
      <div className="w-full space-y-3 bg-white rounded-md p-6">
        {reservationInfoWithLabel.map((item) => (
          <div key={item.value}>
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className="text-lg">{item.value}</p>
          </div>
        ))}
      </div>
      <Form method="post" className="w-full">
        <Button text="予約する" />
      </Form>
    </div>
  );
}
