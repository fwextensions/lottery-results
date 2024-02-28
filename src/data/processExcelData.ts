import {
	getApplicantsAndPrefs, getNoPref, getOrderByPref,
	getRawOrder,
} from "@/data/index";
import rootBucket from "@/data/buckets";
import * as XLSX from "xlsx";
import { Preferences } from "@/utils/constants";

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

		// clear out the applicants from any previous addApplicant calls
	rootBucket.reset();
	applicants.forEach((applicant) => rootBucket.addApplicant(applicant));

	const applicantPaths = rootBucket.getApplicants();
		// this assumes the last path component is unique across buckets
	const groupedApplicants = Object.groupBy(applicantPaths, ([, path]) => path.at(-1));
	const buckets = prefIDs.map((id: string) => {
		const bucket = {
			preferenceName: Preferences[id].name,
			preferenceResults: groupedApplicants[id]?.map(([{ Rank: lotteryRank, LotteryNum: lotteryNumber }]) => ({ lotteryRank, lotteryNumber })) || [],
		};

		return bucket;
	});

	return {
		listing: {
			name: sheetName,
			address: sheetName,
			date: "someday",
		},
		results: {
			lotteryBuckets: buckets,
			lotteryStatus: "Complete",
			lotteryDate: "someday",
		}
	};
}

export function readWorkbook(
	data: ArrayBuffer)
{
	const workbook = XLSX.read(data);
	return workbook;
}

export function processWorkbook(
	workbook: XLSX.WorkBook)
{
//	const workbook = XLSX.read(data);
//	const sheetName = workbook.SheetNames[0].trim();
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
