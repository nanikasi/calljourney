import type { ActionFunctionArgs, LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { Reservation } from "~/features/reservation/types/reservation";

export const meta: MetaFunction = () => {
  return [
    { title: "予約情報確認" },
    {
      name: "description",
      content: "Welcome to AppName",
    },
  ];
};

const schema = z.object({
  phone_number: z.string()
    .min(1, { message: '必須項目です。' }) 
    .refine(value => {
      const length = value.length;
      return length === 10 || length === 11;
    }, { message: '電話番号は10桁または11桁である必要があります' }),
  
  name: z.string()
    .min(1, { message: '必須項目です。' }),
  
  email: z.string()
    .min(1, { message: '必須項目です。' })
    .email({ message: '有効なメールアドレスを入力してください。' })
});

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const restaurantPhoneNumber = url.searchParams.get('restaurant_phone_number') || '';
  const numberOfCustomers = url.searchParams.get('number_of_customers') || '';
  const reserveDate = url.searchParams.get('reserve_date') || '';
  const phoneNumber = url.searchParams.get('phone_number') || '';
  const name = url.searchParams.get('name') || '';
  const email = url.searchParams.get('email') || '';
  
  return json({ restaurantPhoneNumber, numberOfCustomers, reserveDate, phoneNumber, email, name });
};


export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const restaurantPhoneNumber = url.searchParams.get('restaurant_phone_number') || '';
  const customerCount = url.searchParams.get('number_of_customers') || '';
  const reserveDate = url.searchParams.get('reserve_date') || '';
  const phoneNumber = url.searchParams.get('restaurant_phone_number') || '';
  const name = url.searchParams.get('name') || '';
  const email = url.searchParams.get('email') || '';

  //API呼ぶ

  return redirect('/');
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
      <div className="space-y-2 mt-36 text-center">
        <h1 className="text-5xl font-bold">CallJourney</h1>
        <p className="text-sm mt-2 font-semibold">AIがあなたの代わりに電話予約</p>
      </div>
      <div className="border rounded-md p-4">
        <p>お店に電話を発信しています。</p>
        <p>予約の可否が分かり次第、入力いただいたメールアドレスに送信します。</p>
      </div>
    </div>
  );
}
