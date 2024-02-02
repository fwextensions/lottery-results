import * as XLSX from "xlsx";
import { getApplicants, getNoPref, getOrderByPref, getRawOrder, getWorkbookFromApplicants } from "./data/index.js";
import { PreferenceIDs } from "./data/constants.js";
import buckets from "./data/buckets.js";

const Headers = [
	"Unfiltered Rank<br>Ticket #",
	"V-COP",
	"COP",
	"V-DTHP",
	"DTHP",
	"V-NRHP",
	"NRHP",
	"V-L_W",
	"L_W",
	"No Preferences",
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
	applicants)
{
	const headerContainer = document.getElementById("list-headers");
	const listContainer = document.getElementById("list-columns");

	Headers.forEach((title) => {
		const header = document.createElement("H4");

		header.innerHTML = title;
		headerContainer.appendChild(header);
	});

	listContainer.appendChild(createList(getRawOrder(applicants)));

	PreferenceIDs.forEach((pref) => {
		const lotteryNums = getOrderByPref(applicants, pref);

		listContainer.appendChild(createList(lotteryNums));
	});

	listContainer.appendChild(createList(getNoPref(applicants)));
}

function processWorkbook(
	workbook)
{
	const sheetName = workbook.SheetNames[0].trim();
	const applicants = getApplicants(workbook);
	const output = getWorkbookFromApplicants(applicants);
	const paths = applicants.map((applicant) => [buckets.getPath(applicant), applicant.LotteryNum]);

	console.table(paths);

	applicants.forEach((applicant) => buckets.addApplicantOnce(applicant));
//	applicants.forEach((applicant) => buckets.addApplicant(applicant));

	console.table(buckets.getApplicants().map(([{ LotteryNum }, path]) => [path.join("/"), LotteryNum]));

	XLSX.writeFile(output, `${sheetName} - Processed.xlsx`);

	createResults(applicants);
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
