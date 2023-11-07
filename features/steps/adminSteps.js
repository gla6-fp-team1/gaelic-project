import { Given, Then } from "@cucumber/cucumber";
import { By } from "selenium-webdriver";
import db from "../../server/db";
import { findByText } from "../utils/textUtils";
import getDriver from "../utils/driverSetup";
import expect from "expect";
import path from "path";
import fs from "fs/promises";
import { existsSync, statSync } from "fs";
import os from "os";
let driver = null;

Given("I am on the admin page", async function () {
	driver = getDriver();

	await driver.get("http://localhost:3000/admin");

	await findByText("RLHF");
});

Then("I don't see the admin features", async function () {
	try {
		await findByText("Admin Functions", 3000);
		expect(true).toBe(false);
	} catch (error) {
		expect(error.name).toBe("TimeoutError");
	}
});

Then("I see the admin features", async function () {
	await findByText("Admin Functions", 3000);
});

Then("I can download the database as JSON", async function () {
	let downloadPath = path.resolve(os.tmpdir(), "exportData.json");

	// delete the file from the filesystem from previous tests
	if (existsSync(downloadPath)) {
		await fs.unlink(downloadPath);
	}

	let button = await findByText("Export Database", 3000);
	await button.click();

	let i = 0;
	while (!existsSync(downloadPath)) {
		await new Promise((r) => setTimeout(r, 1000));
		expect(i).toBeLessThanOrEqual(5);
	}

	expect(statSync(downloadPath).size).toBeGreaterThan(512);
});

Then("I can import data into the database", async function () {
	let fileLocation = path.resolve(__dirname, "../assets/input.txt");
	await driver.findElement(By.id("fileInput")).sendKeys(fileLocation);
	await driver.findElement(By.css("[type=submit]")).click();

	await findByText("Successful upload");
});

Then("I can see the imported sentences in the database", async function () {
	let result = await db.query(
		"SELECT * FROM sentences ORDER BY id DESC LIMIT 6"
	);

	expect(result.rows[0].sentence).toBe("Sixth sentence");
	expect(result.rows[1].sentence).toBe("Fifth sentence.");
	expect(result.rows[2].sentence).toBe("Fourth sentence");
	expect(result.rows[3].sentence).toBe("Third sentence!");
	expect(result.rows[4].sentence).toBe("Second sentence?");
	expect(result.rows[5].sentence).toBe("First sentence.");
});
