export const Preferences = [
	["Veteran with Certificate of Preference (V-COP)", "V-COP"],
	["Certificate of Preference (COP)", "COP"],
	["Veteran with Displaced Tenant Housing Preference (V-DTHP)", "V-DTHP"],
	["Displaced Tenant Housing Preference (DTHP)", "DTHP"],
	["Veteran with Neighborhood Resident Housing Preference (V-NRHP)", "V-NRHP"],
	["Neighborhood Resident Housing Preference (NRHP)", "NRHP"],
	["Veteran with Live or Work in San Francisco Preference (V-L_W)", "V-L_W"],
	["Live or Work in San Francisco Preference", "L_W"],
].reduce((result,	[name, id],	index) => ({
	...result,
	[name]: { id, index }
}), {});

export const PreferenceIDs = Object.values(Preferences).map(({ id }) => id);
