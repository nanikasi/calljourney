import { z } from "zod";

export const storeReservationInfoSchema = z.object({
  customerCount: z
    .string()
    .min(1, { message: "1人以上を選択してください。" })
    .refine(
      (value) => {
        const num = Number.parseFloat(value);
        return !Number.isNaN(num) && num >= 1;
      },
      { message: "1人以上を入力してください" },
    ),

  restaurantPhoneNumber: z
    .string()
    .min(1, { message: "必須項目です。" })
    .refine(
      (value) => {
        const length = value.length;
        return length === 10 || length === 11;
      },
      { message: "電話番号は10桁または11桁である必要があります" },
    ),

  reserveDate: z.preprocess(
    (val) => {
      if (typeof val === "string" || val instanceof Date) {
        return new Date(val);
      }
    },
    z.date().refine((date) => !Number.isNaN(date.getTime()), {
      message: "有効な日付と時間を選択してください。",
    }),
  ),
});

export const userReservationInfoSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, { message: "必須項目です。" })
    .refine(
      (value) => {
        const length = value.length;
        return length === 10 || length === 11;
      },
      { message: "電話番号は10桁または11桁である必要があります" },
    ),

  name: z.string().min(1, { message: "必須項目です。" }),

  email: z
    .string()
    .min(1, { message: "必須項目です。" })
    .email({ message: "有効なメールアドレスを入力してください。" }),
});
