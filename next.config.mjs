const apiURL = process.env.DAHLIA_API_BASE_URL;

console.warn("=== ignoreBuildErrors is TRUE ===");

/** @type {import("next").NextConfig} */
const nextConfig = {
	typescript: {
		// TODO: remove this after fixing the type errors
		ignoreBuildErrors: true,
	},
	async rewrites()
	{
		return [
			{
					// this initially had /api/v1/ as the source path, which silently fails, because /api routes are handled by
					// the special API router, EVEN IF there's no route at that path set up.  ffs
				source: "/dahlia/:path*",
				destination: `${apiURL}/:path*`,
			},
			{
				source: "/:path*",
				destination: "/",
			},
		];
	},
};

export default nextConfig;
