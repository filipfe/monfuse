import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLang(locale: Locale) {
  const [lang] = locale.split("-");
  return lang as Lang;
}
