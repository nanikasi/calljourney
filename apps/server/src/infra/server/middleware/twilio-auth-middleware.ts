import type { Context, MiddlewareHandler } from "hono";

async function createHmacSHA1(key: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const dataBuffer = encoder.encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    dataBuffer,
  );

  return btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
}

async function verifyTwilioSignature(
  twilioSignature: string,
  url: string,
  params: Record<string, string | File>,
  authToken: string,
): Promise<boolean> {
  const data =
    url +
    Object.keys(params)
      .sort()
      .map((key) => key + params[key])
      .join("");

  const signature = await createHmacSHA1(authToken, data);

  return twilioSignature === signature;
}

export const twilioAuthMiddleware: MiddlewareHandler = async (
  c: Context,
  next,
) => {
  const twilioSignature = c.req.header("X-Twilio-Signature");
  const authToken = c.env.TWILIO_AUTH_TOKEN;

  if (!twilioSignature || !authToken) {
    return c.json({ message: "Unauthorized" }, 403);
  }

  const url = c.req.url;
  const params = await c.req.parseBody();

  const isValid = await verifyTwilioSignature(
    twilioSignature,
    url,
    params,
    authToken,
  );

  if (!isValid) {
    return c.json({ message: "Invalid Twilio Signature" }, 403);
  }

  await next();
};
