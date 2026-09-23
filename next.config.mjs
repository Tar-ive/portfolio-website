/** @type {import('next').NextConfig} */
const nextConfig = {
  // The original stream is a no-build static site living in public/. Next owns
  // /v3 and any future route; "/" is rewritten to that untouched index.html so
  // saksham.us keeps serving exactly what it served before.
  async rewrites() {
    return [{ source: "/", destination: "/index.html" }];
  },
};

export default nextConfig;
