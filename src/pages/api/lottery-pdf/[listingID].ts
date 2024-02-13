import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { chromium } from "@playwright/test";

	// support CORS on these methods
const cors = Cors({
	methods: ["POST", "GET", "HEAD"],
});

async function generatePDF()
{
	const browser = await chromium.launch();
	const page = await browser.newPage();

	await page.goto("https://www.sf.gov/information/about-sfgov");

	return page.pdf();
}

	// helper method to wait for a middleware to execute before continuing
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
		// run the CORS middleware
	await runMiddleware(req, res, cors);

	const { listingID } = req.query;
	const buffer = await generatePDF();

	res.setHeader("Content-Disposition", `attachment; filename="${listingID}.pdf"`);
	res.setHeader("Content-Type", "application/pdf");
	res.send(buffer);
}
