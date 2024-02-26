type PreferenceInfo = {
	id: string;
	subtitle: string;
	index: number;
	isVeteran: boolean;
	relatedPrefID: string;
};

const Units100Pct = "Up to 100% of units";
const Units100PctRemaining = "Up to 100% of remaining units";
const Units40Pct = "Up to 40% of units";
const Units20Pct = "Up to 20% of units";
const UnitsRemaining = "Remaining units";

	// the first item in each array is the preference name supplied by Salesforce.
	// the second is a shorter ID we want to use to refer to it in our code and in
	// the results PDF.  the third item is a subtitle only used in the PDF.
export const Preferences = [
  [
    "Veteran with Certificate of Preference (V-COP)",
    "V-COP",
		Units100Pct,
  ],
  [
    "Certificate of Preference (COP)",
    "COP",
		Units100Pct,
  ],
  [
    "Veteran with Displaced Tenant Housing Preference (V-DTHP)",
    "V-DTHP",
		Units20Pct,
  ],
  [
    "Displaced Tenant Housing Preference (DTHP)",
    "DTHP",
		Units20Pct,
  ],
  [
    "Veteran with Neighborhood Resident Housing Preference (V-NRHP)",
    "V-NRHP",
		Units40Pct,
  ],
  [
    "Neighborhood Resident Housing Preference (NRHP)",
    "NRHP",
		Units40Pct,
  ],
  [
    "Veteran with Live or Work in San Francisco Preference (V-L_W)",
    "V-LW",
		Units100PctRemaining,
  ],
  [
    "Live or Work in San Francisco Preference",
    "LW",
		Units100PctRemaining,
  ],
  [
    "generalLottery",
    "General List",
		UnitsRemaining,
  ],
  [
    "Unfiltered",
    "Unfiltered Rank",
		"Ticket #",
  ],
].reduce((result,	[name, id, subtitle],	index) => {
	const isVeteran = id.startsWith("V-");
	const relatedPrefID = isVeteran ? id.slice(2) : "";
	const pref = { id, subtitle, index, isVeteran, relatedPrefID };

		// make the pref accessible by both name and ID
	result[name] = result[id] = pref;

	return result;
}, {} as Record<string, PreferenceInfo>);

export const PreferenceIDs = Object.values(Preferences).map(({ id }) => id);
export const IndexByPrefID = Object.fromEntries(PreferenceIDs.map((id, i) => [id, i]));
