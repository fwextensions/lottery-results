import * as XLSX from "xlsx";

const OutputHeaders = [
	"Lottery Rank",
	"Lottery Number",
	"Applicant Full Name",
	"COP",
	"DTHP",
	"Live/Work"
];
const Preferences = [
	["Certificate of Preference (COP)", "COP"],
	["Displaced Tenant Housing Preference (DTHP)", "DTHP"],
	["Live or Work in San Francisco Preference", "LW"]
].reduce((result, [name, id], index) => ({
	...result,
	[name]: { id, index }
}), {});
const PreferenceIDs = Object.values(Preferences).map(({ id }) => id);
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

export function processWorkbook(
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
