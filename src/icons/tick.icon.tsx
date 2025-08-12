import { cn } from "../../utils/helpers";

export default function TickIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "bg-[#018EFC] p-2 rounded-full min-h-12 min-w-12",
        className
      )}
    >
      <path
        d="M5.33301 16.0003L11.9327 22.5999L26.0759 8.45801"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
