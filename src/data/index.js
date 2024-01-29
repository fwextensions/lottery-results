import * as XLSX from "xlsx";
import { PreferenceIDs, Preferences } from "./constants.js";

const OutputHeaders = [
	"Lottery Rank",
	"Lottery Number",
	"Applicant Full Name",
	"COP",
	"DTHP",
	"Live/Work"
];
const Columns = [
	["Rank", "Lottery Rank (Unsorted)"],
	["LotteryNum", "Lottery Number"],
	["Name", "Primary Applicant Contact: Full Name"],
	["PrefName", "Preference"],
	["HasPref", "Receives Preference"],
	["PrefRank", "Preference Rank"],
];
const OutputSheet = "Processed";

function getCols(
	columns,
	headers)
{
	const cols = {};

	for (const [name, label] of columns) {
		cols[name] = {
			label,
			index: headers.indexOf(label)
		};
	}

	return cols;
}

function getRowData(
	row,
	cols)
{
	const data = {};

	for (const [name, { index }] of Object.entries(cols)) {
		data[name] = row[index];
	}

	return data;
}

export function getApplicants(
	workbook)
{
	const ws = workbook.Sheets[workbook.SheetNames[0]];
	const [header, ...rows] = XLSX.utils.sheet_to_json(ws, { header: 1 });
	const cols = getCols(Columns, header);
	const applicantsByName = {};

	for (const row of rows) {
		const { Name, Rank, LotteryNum, PrefName, HasPref } = getRowData(row, cols);
		const applicant = applicantsByName[Name]
			|| (applicantsByName[Name] = { Name, Rank, LotteryNum });

		applicant[Preferences[PrefName].id] = HasPref;
	}

	return applicantsByName;
}

export function getWorkbookFromApplicants(
	applicantsByName)
{

	const outputRows = Object.values(applicantsByName).map((applicant) => {
		const { Rank, LotteryNum, Name } = applicant;
			// convert the TRUE/FALSE from the spreadsheet to 1 or 0
		const prefs = PreferenceIDs.map((pref) => Number(applicant[pref]));

		return [Rank, LotteryNum, Name, ...prefs];
	});

	outputRows.unshift(OutputHeaders);

	return {
		SheetNames: [OutputSheet],
		Sheets: {
			[OutputSheet]: XLSX.utils.aoa_to_sheet(outputRows)
		}
	};
}

export function getRawOrder(
	applicantsByName)
{
	return Object.values(applicantsByName).map(({ LotteryNum }) => LotteryNum);
}

export function getOrderByPref(
	applicantsByName,
	pref)
{
	return Object.values(applicantsByName)
		.filter((applicant) => !!applicant[pref])
		.map(({ LotteryNum }) => LotteryNum);
}

export function getNoPref(
	applicantsByName)
{
	return Object.values(applicantsByName)
		.filter((applicant) => PreferenceIDs.every((pref) => applicant[pref] == 0))
		.map(({ LotteryNum }) => LotteryNum);
}
