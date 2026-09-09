import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Workspaacing",
  version: packageJson.version,
  copyright: `© ${currentYear}, Workspaacing.`,
  meta: {
    title: "Workspaacing - AI-Powered Admin Dashboard IDE",
    description:
      "Workspaacing is an AI-powered admin dashboard IDE built with Next.js 16, React 19, Tailwind CSS v4, and shadcn/ui. Includes theme presets, Electron support, and GitHub Actions workflows.",
  },
};
