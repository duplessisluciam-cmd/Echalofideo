import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Pone en mayúscula la primera letra (solo para mostrar en pantalla). */
export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
