import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Header } from "./components/header";
import "./tailwind.css";

dayjs.extend(utc);
dayjs.extend(timezone);

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const showBgImage = location.pathname === "/";
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body
        className={`bg-gray-50 flex flex-col items-center ${
          showBgImage ? "bg-custom-image bg-cover bg-center" : ""
        }`}
      >
        <div className="w-72 flex flex-col items-center min-h-screen">
          {location.pathname !== "/" &&
            location.pathname !== "/call/complete" && <Header />}

          {children}
          <ScrollRestoration />
          <Scripts />
        </div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
