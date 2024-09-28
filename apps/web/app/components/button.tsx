type Props = {
  text: string;
  disabled: boolean;
};

export const Button = ({ text, disabled }: Props): JSX.Element => {
  return (
    <button
      type="submit"
      className="w-full bg-black text-white py-2 rounded-md"
      disabled={disabled}
    >
      {text}
    </button>
  );
};
