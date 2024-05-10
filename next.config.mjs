import pwa from "next-pwa";
const withPWA = pwa({
  dest: "public/serviceWorker",
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
  rewrites: async () => {
    return [
      {
        source: '/api/lyrics',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000/api/lyrics'
            : '/api/lyrics',
      },
      {
        source: '/docs',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000/docs'
            : '/api/docs',
      },
      {
        source: '/openapi.json',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:8000/openapi.json'
            : '/api/openapi.json',
      },
    ];
  },
};

export default conf;
// export default withPWA(conf);