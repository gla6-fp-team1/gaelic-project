import { BeforeAll, AfterAll, setDefaultTimeout } from "@cucumber/cucumber";
import { Builder } from "selenium-webdriver";
import Chrome from "selenium-webdriver/chrome";
import db, { disconnectDb } from "../../server/db";
import { readFile } from "fs/promises";
import path from "path";

let driver = null;
setDefaultTimeout(15000);

BeforeAll(async function () {
	if (process.env.NODE_ENV === "test") {
		const schemaSql = await readFile(
			path.resolve(__dirname, "../../db/schema.sql"),
			"utf8"
		);
		await db.query(schemaSql);
	}

	let builder = new Builder().forBrowser("chrome");

	if (process.env.HEADLESS) {
		builder = builder.setChromeOptions(new Chrome.Options().headless());
	}
	driver = builder.build();
});

AfterAll(async function () {
	await driver.close();
	await disconnectDb();
});

export default () => driver;
