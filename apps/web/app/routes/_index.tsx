import type { MetaFunction } from "@remix-run/cloudflare";
import { ToCancelLink } from "~/features/inital/ui/toCancelLink";
import { ToReservationLink } from "~/features/inital/ui/toReservationLink";

export const meta: MetaFunction = () => {
  return [
    { title: "CallJourney" },
    {
      name: "description",
      content: "Welcome to AppName",
    },
  ];
};

export default function Index() {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-20">
        <div className="space-y-2 text-center">
          <h1 className="text-5xl font-bold">CallJourney</h1>
          <p className="text-sm mt-2 font-semibold">AIがあなたの代わりに電話予約</p>
        </div>
        <div className="space-y-10">
          <ToReservationLink />
          <ToCancelLink />
        </div>
      </div>
    </div>
  );
}
