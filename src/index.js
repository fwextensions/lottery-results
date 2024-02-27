import * as XLSX from "xlsx";
import { getApplicantsAndPrefs, getNoPref, getOrderByPref, getRawOrder, getWorkbookFromApplicants } from "./data/index.ts";
import rootBucket from "./data/buckets.js";

const Headers = [
	"Unfiltered Rank<br>Ticket #",
	"General Pool",
];

function createList(
	lotteryNums)
{
	const list = document.createElement("ol");
	const items = lotteryNums.map((num) => `<li>${num}</li>`);

	list.innerHTML = items.join("");

	return list;
}

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

function processWorkbook(
	workbook)
{
	const sheetName = workbook.SheetNames[0].trim();
	const [applicants, prefIDs] = getApplicantsAndPrefs(workbook);
	const output = getWorkbookFromApplicants(applicants, prefIDs);
	const paths = applicants.map((applicant) => [rootBucket.getPath(applicant), applicant.LotteryNum]);

	console.table(paths);

	applicants.forEach((applicant) => rootBucket.addApplicantOnce(applicant));
//	applicants.forEach((applicant) => rootBucket.addApplicant(applicant));

	console.table(rootBucket.getApplicants().map(([{ LotteryNum }, path]) => [path.join("/"), LotteryNum]));

	console.log(applicants);

	XLSX.writeFile(output, `${sheetName} - Processed.xlsx`);

	createResults(applicants, prefIDs);
	document.getElementById("address").innerText = sheetName;
	document.getElementById("results").style.display = "block";
	document.getElementById("drop-target").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
	const dropTarget = document.getElementById("drop-target");

	async function handleDrop(
		event)
	{
		event.stopPropagation();
		event.preventDefault();
		handleLeave();

		const [file] = event.dataTransfer.files;
		const data = await file.arrayBuffer();
		const workbook = XLSX.read(data);

		processWorkbook(workbook);
	}

	function handleLeave()
	{
		dropTarget.classList.remove("hover");
	}

	if (dropTarget) {
		dropTarget.addEventListener("drop", handleDrop, false);
		dropTarget.addEventListener("dragenter", () => dropTarget.classList.add("hover"));
		dropTarget.addEventListener("dragleave", handleLeave);
		dropTarget.addEventListener("dragend", handleLeave);
	}
});
