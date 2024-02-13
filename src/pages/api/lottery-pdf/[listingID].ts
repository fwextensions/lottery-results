import { readFile } from "node:fs/promises";
import path from "node:path";
import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";

	// support CORS on these methods
const cors = Cors({
	methods: ["POST", "GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
	req: NextApiRequest,
	res: NextApiResponse,
	fn: Function)
{
	return new Promise((resolve, reject) => {
		fn(req, res, (result: any) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const filename = "Veteran Lottery Results.pdf";

		// run the CORS middleware
	await runMiddleware(req, res, cors);

	const { listingID } = req.query;
	console.log(listingID);

		// process.cwd() is the root of the Next.js app
	const buffer = await readFile(path.join(process.cwd(), `src/pages/api/lottery-pdf/${filename}`));

	res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
	res.setHeader("Content-Type", "application/pdf");
	res.send(buffer);
}
