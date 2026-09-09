import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactCompiler: true,
  turbopack: {},
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/chat",
        permanent: false,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
