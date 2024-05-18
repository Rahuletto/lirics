import pwa from "next-pwa";
const withPWA = pwa({
  dest: "public/serviceWorker",
  disable: process.env.NODE_ENV === "development",
});

const conf = {
  poweredByHeader: false,
  swcMinify: true,
  reactStrictMode: true,
  compress: true,
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
};

// export default conf;
export default withPWA(conf);
