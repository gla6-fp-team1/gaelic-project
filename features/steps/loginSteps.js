import { Given, Then } from "@cucumber/cucumber";
import getDriver from "../utils/driverSetup";
import { findByText } from "../utils/textUtils";

let driver = null;

const ADMIN_USER_ID = "117060750196714169595";
const REGULAR_USER_ID = "1";

Given("I am logged in as normal user", async function () {
	driver = getDriver();
	driver.manage().deleteAllCookies();

	await driver.get(
		`http://localhost:3000/api/mock/login?user_id=${REGULAR_USER_ID}`
	);
});

Given("I am logged in as administrator user", async function () {
	driver = getDriver();
	driver.manage().deleteAllCookies();

	await driver.get(
		`http://localhost:3000/api/mock/login?user_id=${ADMIN_USER_ID}`
	);
});

Given("I am anonymous", async function () {
	driver = getDriver();
	driver.manage().deleteAllCookies();
});

Then("I get a login prompt", async function () {
	await findByText(
		"Please authorize using your Google account to submit suggestions."
	);
});
