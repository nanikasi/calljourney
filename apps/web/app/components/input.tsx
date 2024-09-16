type Props = {
  text: string;
  inputName: string;
  placeholder: string;
  type?: "email" | "text" | "tel" | "number" | "datetime-local";
  errorMessage?: string;
};

export const Input = ({
  text,
  inputName,
  placeholder,
  errorMessage,
  type,
}: Props): JSX.Element => {
  return (
    <div className="flex flex-col w-full space-y-1">
      <label
        htmlFor={inputName}
        className=" text-sm font-semibold text-gray-700"
      >
        {text}
      </label>
      <input
        id={inputName}
        type={type ? type : "text"}
        name={inputName}
        placeholder={placeholder}
        className="border border-none px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
      <p
        className={`h-4 text-[8px] ${errorMessage ? "text-red-500" : "text-transparent"}`}
      >
        {errorMessage || ""}
      </p>
    </div>
  );
};
