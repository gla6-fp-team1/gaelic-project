require("@babel/register")({
	extensions: [".js"],
	presets: [["@babel/preset-env", { targets: "node 16" }]],
	plugins: [
		"@babel/plugin-proposal-class-properties",
		"@babel/plugin-transform-runtime",
	],
});
