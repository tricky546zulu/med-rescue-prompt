import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using clsx for conditional joining and tailwind-merge for resolving conflicting Tailwind CSS utility classes.
 * This utility is typically used for constructing dynamic and conditional class strings for React components.
 *
 * @example
 * // Simple usage:
 * cn("p-4", "bg-red-500"); // => "p-4 bg-red-500"
 *
 * // Conditional classes:
 * cn("p-4", { "bg-blue-500": true, "text-white": false }); // => "p-4 bg-blue-500"
 *
 * // With tailwind-merge conflict resolution:
 * cn("p-4 bg-red-500", "p-2 bg-green-500"); // => "p-2 bg-green-500" (p-2 overrides p-4, bg-green-500 overrides bg-red-500)
 *
 * @param {...ClassValue} inputs - The class names, arrays of class names, or conditional class objects to merge.
 *                                 Accepts the same arguments as the `clsx` library.
 * @returns {string} The merged, de-duplicated, and conflict-resolved class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
