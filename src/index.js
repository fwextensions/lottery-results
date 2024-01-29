import * as XLSX from "xlsx";
import { getApplicants, getNoPref, getOrderByPref, getRawOrder, getWorkbookFromApplicants } from "./data/index.js";
import { PreferenceIDs } from "./data/constants.js";

const Headers = [
	"Unfiltered Rank<br>Ticket #",
	"COP",
	"DTHP",
	"Live/Work",
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
	applicantsByName)
{
	const headerContainer = document.getElementById("list-headers");
	const listContainer = document.getElementById("list-columns");

	Headers.forEach((title) => {
		const header = document.createElement("H4");

		header.innerHTML = title;;
		headerContainer.appendChild(header);
	});

	listContainer.appendChild(createList(getRawOrder(applicantsByName)));

	PreferenceIDs.forEach((pref) => {
		const lotteryNums = getOrderByPref(applicantsByName, pref);

		listContainer.appendChild(createList(lotteryNums));
	});

	listContainer.appendChild(createList(getNoPref(applicantsByName)));
}

function processWorkbook(
	workbook)
{
	const sheetName = workbook.SheetNames[0].trim();
	const applicantsByName = getApplicants(workbook);
	const output = getWorkbookFromApplicants(applicantsByName);

	XLSX.writeFile(output, `${sheetName} - Processed.xlsx`);

	createResults(applicantsByName);
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
		const wb = XLSX.read(data);

		processWorkbook(wb);
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
