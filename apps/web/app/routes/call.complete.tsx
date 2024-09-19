import type { MetaFunction } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "予約情報確認" },
    {
      name: "description",
      content: "Welcome to AppName",
    },
  ];
};

export default function Index() {
  return (
    <div className="w-full flex flex-col items-center space-y-16">
      <div className="space-y-2 mt-36 text-center">
        <h1 className="text-5xl font-bold">CallJourney</h1>
        <p className="text-sm mt-2 font-semibold">
          AIがあなたの代わりに電話予約
        </p>
      </div>
      <div className="flex flex-col items-center space-y-3">
        <p className="font-semibold">お店に電話を発信しています。</p>
        <p className="text-xs">*電話が終了次第、可否をメールにて送信します。</p>
      </div>
      <Link
        to="/"
        className="bg-black font-semibold w-full text-white py-2 rounded-md text-center"
      >
        最初のページに戻る
      </Link>
    </div>
  );
}
