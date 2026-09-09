import localFont from "next/font/local";

import { GeistPixelSquare } from "geist/font/pixel";

const inter = localFont({
  src: "./files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
});

const notoSans = localFont({
  src: "./files/noto-sans-latin-wght-normal.woff2",
  variable: "--font-noto-sans",
});

const roboto = localFont({
  src: "./files/roboto-latin-wght-normal.woff2",
  variable: "--font-roboto",
});

const geist = localFont({
  src: "./files/geist-latin-wght-normal.woff2",
  variable: "--font-geist",
});

const outfit = localFont({
  src: "./files/outfit-latin-wght-normal.woff2",
  variable: "--font-outfit",
});

const geistMono = localFont({
  src: "./files/geist-mono-latin-wght-normal.woff2",
  variable: "--font-geist-mono",
});

const dmSans = localFont({
  src: "./files/dm-sans-latin-wght-normal.woff2",
  variable: "--font-dm-sans",
});

const nunitoSans = localFont({
  src: "./files/nunito-sans-latin-wght-normal.woff2",
  variable: "--font-nunito-sans",
});

const figtree = localFont({
  src: "./files/figtree-latin-wght-normal.woff2",
  variable: "--font-figtree",
});

const raleway = localFont({
  src: "./files/raleway-latin-wght-normal.woff2",
  variable: "--font-raleway",
});

const publicSans = localFont({
  src: "./files/public-sans-latin-wght-normal.woff2",
  variable: "--font-public-sans",
});

const jetBrainsMono = localFont({
  src: "./files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-jetbrains-mono",
});

const notoSerif = localFont({
  src: "./files/noto-serif-latin-wght-normal.woff2",
  variable: "--font-noto-serif",
});

const robotoSlab = localFont({
  src: "./files/roboto-slab-latin-wght-normal.woff2",
  variable: "--font-roboto-slab",
});

const merriweather = localFont({
  src: "./files/merriweather-latin-wght-normal.woff2",
  variable: "--font-merriweather",
});

const lora = localFont({
  src: "./files/lora-latin-wght-normal.woff2",
  variable: "--font-lora",
});

const playfairDisplay = localFont({
  src: "./files/playfair-display-latin-wght-normal.woff2",
  variable: "--font-playfair-display",
});

const fontRegistry = {
  geist: {
    label: "Geist",
    font: geist,
  },
  inter: {
    label: "Inter",
    font: inter,
  },
  notoSans: {
    label: "Noto Sans",
    font: notoSans,
  },
  nunitoSans: {
    label: "Nunito Sans",
    font: nunitoSans,
  },
  figtree: {
    label: "Figtree",
    font: figtree,
  },
  roboto: {
    label: "Roboto",
    font: roboto,
  },
  raleway: {
    label: "Raleway",
    font: raleway,
  },
  dmSans: {
    label: "DM Sans",
    font: dmSans,
  },
  publicSans: {
    label: "Public Sans",
    font: publicSans,
  },
  outfit: {
    label: "Outfit",
    font: outfit,
  },
  geistMono: {
    label: "Geist Mono",
    font: geistMono,
  },
  geistPixelSquare: {
    label: "Geist Pixel Square",
    font: GeistPixelSquare,
  },
  jetBrainsMono: {
    label: "JetBrains Mono",
    font: jetBrainsMono,
  },
  notoSerif: {
    label: "Noto Serif",
    font: notoSerif,
  },
  robotoSlab: {
    label: "Roboto Slab",
    font: robotoSlab,
  },
  merriweather: {
    label: "Merriweather",
    font: merriweather,
  },
  lora: {
    label: "Lora",
    font: lora,
  },
  playfairDisplay: {
    label: "Playfair Display",
    font: playfairDisplay,
  },
} as const;

export type FontKey = keyof typeof fontRegistry;

export const fontKeys = Object.keys(fontRegistry) as FontKey[];

export const fontVars = Object.values(fontRegistry)
  .map(({ font }) => font.variable)
  .join(" ");

export const fontOptions = fontKeys.map((key) => ({
  key,
  label: fontRegistry[key].label,
}));
