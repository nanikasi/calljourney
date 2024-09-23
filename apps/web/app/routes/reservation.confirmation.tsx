import type {
  ActionFunctionArgs,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/cloudflare";
import { json, redirect, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { Button } from "~/components/button";
import type { Reservation } from "~/features/reservation/types/reservation";
import { getSession } from "~/features/share/func/session";

import { useFetcher } from "@remix-run/react";
import { reservationRequest } from "~/features/reservation/api";

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

type ActionData = {
  error?: string;
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));

  const reservation = session.get("reservation");
  const user = session.get("user");

  if (!reservation || !user) {
    return redirect("/reservation/store");
  }

  try {
    await reservationRequest.create(
      {
        user: user,
        reservation: reservation,
      },
      context.cloudflare.env.SERVER_URL,
    );
  } catch (e) {
    return { error: "予約が完了しませんでした。" };
  }
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

  const fetcher = useFetcher<ActionData>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    fetcher.submit(formData, { method: "post" });
  };

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
      <fetcher.Form className="w-full" onSubmit={handleSubmit}>
        <Button
          text={fetcher.state === "submitting" ? "処理中..." : "予約する"}
          disabled={fetcher.state === "submitting"}
        />
      </fetcher.Form>
      {fetcher.data?.error && <div className="error">{fetcher.data.error}</div>}
    </div>
  );
}
