import type { MetaFunction } from "@remix-run/cloudflare";
import { Logo } from "~/components/logo";
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
      <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-20">
        <Logo />
        <div className="space-y-10">
          <ToReservationLink />
          <ToCancelLink />
        </div>
      </div>
    </div>
  );
}
