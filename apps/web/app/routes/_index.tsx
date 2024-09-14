import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "AppName" },
    {
      name: "description",
      content: "Welcome to AppName",
    },
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const response = await fetch(context.cloudflare.env.SERVER_URL);
  const data = await response.json<{ res: string }>();
  return data.res;
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">{data}HELLO</h1>
    </div>
  );
}
