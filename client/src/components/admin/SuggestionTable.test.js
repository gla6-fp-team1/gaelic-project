import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import SuggestionTable from "./SuggestionTable";

fetchMock.enableMocks();

let setAlertMessage = jest.fn();

beforeEach(() => {
	fetch.resetMocks();

	fetch.mockResponse(async (req) => {
		if (req.url.endsWith("/api/sentences/1/user_suggestions?page=0")) {
			return JSON.stringify({
				success: true,
				total: 1,
				page_size: 25,
				data: [{ id: 1, user_type: "Logged", user_suggestion: "Suggestion 1" }],
			});
		}
	});
});

it("Renders the suggestion information", async () => {
	const { asFragment } = render(
		<SuggestionTable setAlertMessage={setAlertMessage} sentenceId={1} />
	);
	await screen.findByText("Suggestion 1");
	expect(asFragment()).toMatchSnapshot();
});
