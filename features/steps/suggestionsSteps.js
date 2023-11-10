import { Given, When, Then } from "@cucumber/cucumber";
import { By, until } from "selenium-webdriver";
import db from "../../server/db";
import getDriver from "../utils/driverSetup";
import expect from "expect";
import { findByText } from "../utils/textUtils";

let driver = null;

Given("I am on the front page", async function () {
	driver = getDriver();

	await driver.get("http://localhost:3000");

	await findByText("RLHF");
});

async function clickButton(buttonText) {
	let button = await findByText(buttonText);

	let buttonParent = await button.findElement(By.xpath("./.."));
	await buttonParent.click();

	return buttonParent;
}

async function clickSubmit() {
	let submitButton = await findByText("Submit");

	await submitButton.click();

	await findByText("Suggestions saved successfully");
}

When(/I (can )?select suggestion (\d+)/, async function (_, suggestionId) {
	let buttonText = `Suggestion ${suggestionId}:`;

	let buttonParent = await clickButton(buttonText);

	this.interactionType = "suggestion";
	this.interactionText = (await buttonParent.getText())
		.replace(`Suggestion ${suggestionId}:`, "")
		.trim();

	await clickSubmit();
});

When(/I select "(.*)"/, async function (buttonText) {
	await clickButton(buttonText);

	this.interactionType =
		buttonText === "None of the suggestions are helpful" ? "none" : "original";

	await clickSubmit();
});

When(/I add "(.*)" as my own suggestion/, async function (suggestion) {
	let buttonText = "like to provide my own suggestion";

	await clickButton(buttonText);

	let input = driver.wait(
		until.elementLocated(By.css(".suggestion-input")),
		1000
	);

	this.interactionType = "user";
	this.interactionText = suggestion;

	await input.clear();
	await input.sendKeys(suggestion);

	await clickSubmit();
});

Then("I can see the interaction saved in the database", async function () {
	let result = await db.query(
		"SELECT * FROM user_interactions ORDER BY id DESC LIMIT 1"
	);
	expect(result.rows[0].type).toBe(this.interactionType);

	if (this.interactionType === "suggestion") {
		let suggestion = await db.query("SELECT * from suggestions WHERE id = $1", [
			result.rows[0].suggestion_id,
		]);
		expect(suggestion.rows[0].suggestion).toBe(this.interactionText);
	} else if (this.interactionType === "user") {
		expect(result.rows[0].user_suggestion).toBe(this.interactionText);
	}
});
