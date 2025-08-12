import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatNumber(num?: number | string) {
  if (!num) return 0;
  return Number(num).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatLargeNumber(num?: number | string): string {
  if (!num) return "0";

  const number = Number(num);

  if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + "B";
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + "M";
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + "K";
  } else {
    return number.toString();
  }
}

export function fixedNumber(num: number | string, decimals = 2) {
  // Convert to string and split by decimal point
  const [whole, fraction = ""] = String(num).split(".");
  // Take only the specified number of decimal places, without rounding
  const truncatedFraction = fraction.slice(0, decimals);
  // Pad with zeros if needed
  const paddedFraction = truncatedFraction.padEnd(decimals, "0");

  return Number(`${whole}.${paddedFraction}`);

  // // Format the whole part with commas
  // const formattedWhole = Number(whole).toLocaleString("en-US");

  // return `${formattedWhole}.${paddedFraction}`;
}

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
