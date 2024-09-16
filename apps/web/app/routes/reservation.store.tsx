import type { ActionFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { storeReservationInfoSchema } from "~/features/reservation/types/schema";
import { ProcessExplanation } from "~/features/reservation/ui/processExplanation";

export const meta: MetaFunction = () => {
  return [
    { title: "予約登録1" },
    {
      name: "description",
      content: "Welcome to AppName",
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const restaurantPhoneNumber = formData.get("restaurantPhoneNumber") as string;
  const customerCount = formData.get("customerCount") as string;
  const reserveDate = formData.get("reserveDate") as string;

  const result = storeReservationInfoSchema.safeParse({
    restaurantPhoneNumber,
    customerCount,
    reserveDate,
  });

  if (!result.success) {
    const errors = result.error.format();
    return json({ errors, formData: Object.fromEntries(formData) });
  }

  // バリデーション成功時は次のページに遷移
  return redirect(
    `/reservation/user?restaurantPhoneNumber=${encodeURIComponent(restaurantPhoneNumber)}&customerCount=${encodeURIComponent(Number(customerCount))}&reserveDate=${encodeURIComponent(reserveDate)}`,
  );
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  return (
    <div className="w-full flex flex-col items-center space-y-14">
      <ProcessExplanation explanationText="予約するお店の情報を入力してください" />
      <Form method="post" className="w-full space-y-1">
        <Input
          text="お店の電話番号"
          inputName="restaurantPhoneNumber"
          placeholder="0123456789"
          errorMessage={actionData?.errors?.restaurantPhoneNumber?._errors[0]}
        />
        <Input
          text="来店人数"
          inputName="customerCount"
          placeholder="1"
          type="number"
          errorMessage={actionData?.errors?.customerCount?._errors[0]}
        />
        <Input
          text="予約時刻"
          inputName="reserveDate"
          placeholder="6/27/22:00(15分単位で)"
          type="datetime-local"
          errorMessage={actionData?.errors?.reserveDate?._errors[0]}
        />
        <div className="pt-7" />
        <Button text="次へ" />
      </Form>
    </div>
  );
}
