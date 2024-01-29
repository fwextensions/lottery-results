export const Preferences = [
	["Certificate of Preference (COP)", "COP"],
	["Displaced Tenant Housing Preference (DTHP)", "DTHP"],
	["Live or Work in San Francisco Preference", "LW"]
].reduce((result,	[name, id],	index) => ({
	...result,
	[name]: { id, index }
}), {});

export const PreferenceIDs = Object.values(Preferences).map(({ id }) => id);
