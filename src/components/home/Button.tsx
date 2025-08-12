export default function Button({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`wallet-btn-gradient rounded-xl w-fit h-12 cursor-pointer border-2 border-secondary px-7 flex items-center justify-center ${className}`}
    >
      <div className="text-white text-lg font-luckiest-guy leading-none">
        {children}
      </div>
    </div>
  );
}
