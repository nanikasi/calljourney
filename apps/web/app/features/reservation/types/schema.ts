import { z } from "zod";

export const storeReservationInfoSchema = z.object({
  customerCount: z.string()
    .min(1, { message: '1人以上を選択してください。' })
    .refine(value => {
      const num = parseFloat(value);
      return !isNaN(num) && num >= 1;
    }, { message: '1人以上を入力してください' }),

  restaurantPhoneNumber: z.string()
    .min(1, { message: '必須項目です。' }) 
    .refine(value => {
      const length = value.length;
      return length === 10 || length === 11;
    }, { message: '電話番号は10桁または11桁である必要があります' }),
  
  reserveDate: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: '有効な時間を選択してください。' }),
});


export const userReservationInfoSchema = z.object({
  phoneNumber: z.string()
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