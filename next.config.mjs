const apiURL = process.env.API_BASE_URL;

/** @type {import("next").NextConfig} */
const nextConfig = {
	async rewrites()
	{
		return [
			{
					// this initially had /api/v1/ as the source path, which silently fails, because /api routes are handled by
					// the special API router, EVEN IF there's no route at that path set up.  ffs
				source: "/dahlia/:path*",
				destination: `${apiURL}/:path*`,
			},
		];
	},
};

export default nextConfig;
