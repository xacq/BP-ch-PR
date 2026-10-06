import { Figtree, Source_Serif_4 } from "next/font/google";

// Titles use Figtree Light (300), body text uses Figtree Regular (400).
export const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-figtree",
  display: "swap",
});

// "Palabras clave" (keyword) accents use Source Serif 4 Light Italic.
export const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: "300",
  style: "italic",
  variable: "--font-source-serif",
  display: "swap",
});
