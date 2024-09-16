import type { ActionFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { userReservationInfoSchema } from "~/features/reservation/types/schema";
import { ProcessExplanation } from "~/features/reservation/ui/processExplanation";

export const meta: MetaFunction = () => {
  return [
    { title: "予約登録2" },
    {
      name: "description",
      content: "Welcome to AppName",
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const phoneNumber = formData.get("phoneNumber") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const result = userReservationInfoSchema.safeParse({
    phoneNumber,
    name,
    email,
  });

  if (!result.success) {
    const errors = result.error.format();
    return json({ errors, formData: Object.fromEntries(formData) });
  }

  // Paramsを取得して次のページのParamsにつける
  // TODO: コード綺麗にする
  const url = new URL(request.url);
  const restaurantPhoneNumber =
    url.searchParams.get("restaurantPhoneNumber") || "";
  const customerCount = url.searchParams.get("customerCount") || "";
  const reserveDate = url.searchParams.get("reserveDate") || "";

  // バリデーション成功時は次のページに遷移
  return redirect(
    `/reservation/confirmation?restaurantPhoneNumber=${encodeURIComponent(restaurantPhoneNumber)}&customerCount=${encodeURIComponent(Number(customerCount))}&reserveDate=${encodeURIComponent(reserveDate)}&phoneNumber=${encodeURIComponent(phoneNumber)}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`,
  );
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="w-full flex flex-col items-center space-y-14">
      <ProcessExplanation explanationText="あなたの情報を入力してください" />
      <Form method="post" className="w-full space-y-1">
        <Input
          text="名前"
          inputName="name"
          placeholder="名前"
          errorMessage={actionData?.errors?.name?._errors[0]}
        />
        <Input
          text="電話番号"
          inputName="phoneNumber"
          placeholder="0123456789"
          errorMessage={actionData?.errors?.phoneNumber?._errors[0]}
        />
        <Input
          text="メールアドレス"
          inputName="email"
          placeholder="メールアドレス"
          type="email"
          errorMessage={actionData?.errors?.email?._errors[0]}
        />
        <div className="pt-7" />
        <Button text="次へ" />
      </Form>
    </div>
  );
}
