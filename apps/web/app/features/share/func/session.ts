import { createCookieSessionStorage } from "@remix-run/cloudflare";
import type { Reservation } from "~/features/reservation/types/reservation";
import type { User } from "~/features/user/types/user";

type SessionData = {
  user: User;
  reservation: Reservation;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

export { commitSession, destroySession, getSession };
