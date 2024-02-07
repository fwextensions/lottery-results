import { Bucket } from "./Bucket.js";

export default new Bucket("/", [
	new Bucket("COP", ["COP"], [
		new Bucket("V_COP", ["VET"]),
		new Bucket("COP"),
	]),
	new Bucket("DTHP", ["DTHP"], [
		new Bucket("V_DTHP", ["VET"]),
		new Bucket("DTHP"),
	]),
	new Bucket("NRHP", ["NRHP"], [
		new Bucket("V_NRHP", ["VET"]),
		new Bucket("NRHP"),
	]),
	new Bucket("L_W", ["L_W"], [
		new Bucket("V_L_W", ["VET"]),
		new Bucket("L_W"),
	]),
	new Bucket("GENERAL_POOL"),
]);
