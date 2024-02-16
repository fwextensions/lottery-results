type PreferenceInfo = {
	id: string;
	index: number;
	isVeteran: boolean;
	relatedPrefID: string;
};

export const Preferences = [
	["Veteran with Certificate of Preference (V-COP)", "V-COP"],
	["Certificate of Preference (COP)", "COP"],
	["Veteran with Displaced Tenant Housing Preference (V-DTHP)", "V-DTHP"],
	["Displaced Tenant Housing Preference (DTHP)", "DTHP"],
	["Veteran with Neighborhood Resident Housing Preference (V-NRHP)", "V-NRHP"],
	["Neighborhood Resident Housing Preference (NRHP)", "NRHP"],
	["Veteran with Live or Work in San Francisco Preference (V-L_W)", "V-LW"],
	["Live or Work in San Francisco Preference", "LW"],
	["generalLottery", "General Pool"],
].reduce((result,	[name, id],	index) => {
	const isVeteran = id.startsWith("V-");
	const relatedPrefID = isVeteran ? id.slice(2) : "";
	const pref = { id, index, isVeteran, relatedPrefID };

	result[name] = result[id] = pref;

	return result;
}, {} as Record<string, PreferenceInfo>);

export const PreferenceIDs = Object.values(Preferences).map(({ id }) => id);
export const IndexByPrefID = Object.fromEntries(PreferenceIDs.map((id, i) => [id, i]));
