type Props = {
 text: string,
};

export const Button = ({ text }: Props) => {
  return (
    <button className="w-full bg-black text-white py-2 rounded-md">
      { text }
    </button>
  )
}