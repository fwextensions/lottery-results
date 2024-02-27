import {
	getApplicantsAndPrefs, getNoPref, getOrderByPref,
	getRawOrder,
	getWorkbookFromApplicants
} from "@/data/index";
import rootBucket from "@/data/buckets";
import * as XLSX from "xlsx";

function createResults(
	applicants,
	prefIDs)
{
	const headerContainer = document.getElementById("list-headers");
	const listContainer = document.getElementById("list-columns");
	const [first, last] = Headers;
	const headerTitles = [first, ...prefIDs, last];

	headerTitles.forEach((title) => {
		const header = document.createElement("H4");

		header.innerHTML = title;
		headerContainer.appendChild(header);
	});

	listContainer.appendChild(createList(getRawOrder(applicants)));

	prefIDs.forEach((pref) => {
		const lotteryNums = getOrderByPref(applicants, pref);

		listContainer.appendChild(createList(lotteryNums));
	});

	listContainer.appendChild(createList(getNoPref(applicants)));
}

export function processExcelData(
	data: ArrayBuffer)
{
	const workbook = XLSX.read(data);
	const sheetName = workbook.SheetNames[0].trim();
	const [applicants, prefIDs] = getApplicantsAndPrefs(workbook);
//	const output = getWorkbookFromApplicants(applicants, prefIDs);
//	const paths = applicants.map((applicant) => [rootBucket.getPath(applicant), applicant.LotteryNum]);
//
//	console.table(paths);

//	applicants.forEach((applicant) => rootBucket.addApplicantOnce(applicant));
	applicants.forEach((applicant) => rootBucket.addApplicant(applicant));

	const applicantPaths = rootBucket.getApplicants();
	const groupedApplicants = Object.groupBy(applicantPaths, ([, path]) => path.join("/"));

	console.log(groupedApplicants);

//	console.table(rootBucket.getApplicants().map(([{ LotteryNum }, path]) => [path.join("/"), LotteryNum]));

	console.log(applicants);

	return applicants;
//	XLSX.writeFile(output, `${sheetName} - Processed.xlsx`);

//	createResults(applicants, prefIDs);
}
