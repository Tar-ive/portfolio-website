/** @type {import('next').NextConfig} */
const nextConfig = {
  // /v3 was the page's address while it lived beside the old stream. It is the
  // site now, so that path redirects home and any link to it still lands.
  async redirects() {
    return [{ source: "/v3", destination: "/", permanent: true }];
  },
};

export default nextConfig;
