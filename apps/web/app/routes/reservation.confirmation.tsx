import type {
  ActionFunctionArgs,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/cloudflare";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/button";
import type { Reservation } from "~/features/reservation/types/reservation";

export const meta: MetaFunction = () => {
  return [
    { title: "予約情報確認" },
    {
      name: "description",
      content: "Welcome to AppName",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const restaurantPhoneNumber =
    url.searchParams.get("restaurantPhoneNumber") || "";
  const numberOfCustomers = url.searchParams.get("customerCount") || "";
  const reserveDate = url.searchParams.get("reserveDate") || "";
  const phoneNumber = url.searchParams.get("phoneNumber") || "";
  const name = url.searchParams.get("name") || "";
  const email = url.searchParams.get("email") || "";

  return json({
    restaurantPhoneNumber,
    numberOfCustomers,
    reserveDate,
    phoneNumber,
    email,
    name,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const restaurantPhoneNumber =
    url.searchParams.get("restaurantPhoneNumber") || "";
  const numberOfCustomers = url.searchParams.get("customerCount") || "";
  const reserveDate = url.searchParams.get("reserveDate") || "";
  const phoneNumber = url.searchParams.get("phoneNumber") || "";
  const name = url.searchParams.get("name") || "";
  const email = url.searchParams.get("email") || "";

  //API呼ぶ
  return redirect("/call/complete");
};

export default function Index() {
  const data: Reservation = useLoaderData();
  // dataとlabelObject配列に変更
  const labels: { [key in keyof Reservation]: string } = {
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
