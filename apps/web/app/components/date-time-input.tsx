type Props = {
  text: string;
  inputName: string;
  min: string;
  placeholder: string;
  errorMessage?: string;
};

export const DateTimeInput = ({
  text,
  inputName,
  min,
  placeholder,
  errorMessage,
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
        type="datetime-local"
        name={inputName}
        min={min}
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
