import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { chromium as playwright } from "playwright-core";
import chromium from "@sparticuz/chromium";

	// support CORS on these methods
const cors = Cors({
	methods: ["POST", "GET", "HEAD"],
});

async function generatePDF(
	listingID: string)
{
  const browser = await playwright.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
	const page = await browser.newPage();

	await page.goto(`/lottery/${listingID}`);

	const buffer = await page.pdf();

	await browser.close();

	return buffer;
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
	const buffer = await generatePDF(listingID as string);

	res.setHeader("Content-Disposition", `attachment; filename="${listingID}.pdf"`);
	res.setHeader("Content-Type", "application/pdf");
	res.send(buffer);
}
