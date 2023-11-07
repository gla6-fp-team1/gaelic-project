import getDriver from "./driverSetup";
import { until, By } from "selenium-webdriver";

async function findByText(text, timeout) {
	timeout ||= 20000;
	return await getDriver().wait(
		until.elementLocated(By.xpath(`//*[text()[contains(.,'${text}')]]`)),
		timeout
	);
}

export { findByText };
