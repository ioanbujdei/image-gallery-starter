module.exports = {
  async rewrites() {
    return [{ source: "/reveal", destination: "/" }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dkqphdkd2/**",
        search: "",
      },
    ],
  },
};
