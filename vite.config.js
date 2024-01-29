import path from "node:path";
import process from "node:process";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/lottery-results/",
	root: "src",
	publicDir: "../public",
	build: {
		outDir: "../dist",
		emptyOutDir: true
	},
	resolve: {
		alias: { "/src": path.resolve(process.cwd(), "src") }
	},
});
