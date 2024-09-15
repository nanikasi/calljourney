type Props = {
  explanationText: string,
};

export const ProcessExplanation = ({ explanationText }: Props) => {

  return (
    <div className="w-full flex flex-col items-center text-center space-y-20">
      <img
        src="/human.png"
        alt="Example"
        className="w-20 h-auto bg-gray-50"
      />
      <p className="mt-2 font-semibold">{explanationText}</p>
    </div>
  )
}