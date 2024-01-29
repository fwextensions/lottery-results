import * as XLSX from "xlsx";
import { processWorkbook } from "./processWorkbook.js";

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
		const sheetName = wb.SheetNames[0].trim();
		const output = processWorkbook(wb);

		XLSX.writeFile(output, `${sheetName} - Processed.xlsx`);
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
