export interface ColorConfig {
  light: string;
  dark: string;
}

export const gradientColors: ColorConfig[] = [
  { light: "bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border border-blue-200", dark: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border border-blue-400" },
  { light: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200", dark: "bg-gradient-to-r from-emerald-400 to-green-300 text-gray-900 border border-emerald-300" },
  { light: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border border-purple-200", dark: "bg-gradient-to-r from-purple-400 to-pink-400 text-white border border-purple-300" },
  { light: "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200", dark: "bg-gradient-to-r from-amber-400 to-yellow-300 text-gray-900 border border-amber-300" },
  { light: "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border border-pink-200", dark: "bg-gradient-to-r from-pink-400 to-rose-400 text-white border border-pink-300" },
  { light: "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 border border-indigo-200", dark: "bg-gradient-to-r from-indigo-400 to-blue-400 text-white border border-indigo-300" },
  { light: "bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border border-red-200", dark: "bg-gradient-to-r from-red-400 to-orange-400 text-white border border-red-300" },
  { light: "bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 border border-teal-200", dark: "bg-gradient-to-r from-teal-400 to-emerald-400 text-white border border-teal-300" },
  { light: "bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 border border-violet-200", dark: "bg-gradient-to-r from-violet-400 to-purple-400 text-white border border-violet-300" },
  { light: "bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 border border-cyan-200", dark: "bg-gradient-to-r from-cyan-400 to-blue-400 text-white border border-cyan-300" },
  { light: "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200", dark: "bg-gradient-to-r from-orange-400 to-red-400 text-white border border-orange-300" },
  { light: "bg-gradient-to-r from-lime-100 to-green-100 text-lime-800 border border-lime-200", dark: "bg-gradient-to-r from-lime-400 to-green-400 text-gray-900 border border-lime-300" },
  { light: "bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border border-slate-200", dark: "bg-gradient-to-r from-slate-400 to-gray-400 text-gray-900 border border-slate-300" }
];

/**
 * Gets a consistent color configuration based on the first letter of the text
 * @param text The text to generate a color for
 * @returns ColorConfig object with light and dark theme classes
 */
export function getColorForText(text: string): ColorConfig {
  if (!text || text.length === 0) {
    return gradientColors[0];
  }
  
  const firstChar = text.charAt(0).toLowerCase();
  const charCode = firstChar.charCodeAt(0);
  
  // Handle non-alphabetic characters by using their ASCII code directly
  const index = charCode >= 97 && charCode <= 122 
    ? (charCode - 97) % gradientColors.length  // 97 is 'a' in ASCII
    : charCode % gradientColors.length;
    
  return gradientColors[index] || gradientColors[0];
}