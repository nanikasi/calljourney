import { Link } from "@remix-run/react";

export const ToCancelLink = () => {

  return (
      <Link to="/" className="w-72 h-40 flex flex-col items-center justify-center text-center bg-gray-200 font-semibold text-lg rounded-lg">
      <img
        src="/cancel.png"
        alt="Example"
        className="w-14 mb-2 h-auto"
      />
      キャンセルの方はこちら
    </Link>
  );
};