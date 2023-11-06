import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import SentenceDisplay from "./SentenceDisplay";

fetchMock.enableMocks();

let setAlertMessage = jest.fn();

beforeEach(() => {
	fetch.resetMocks();

	fetch.mockResponse(async (req) => {
		if (req.url.endsWith("/api/sentences/1")) {
			return JSON.stringify({
				success: true,
				data: {
					stats: {
						logged: {
							suggestions: [
								{
									suggestion: "Suggestion 1",
									count: 1,
								},
							],
							types: [
								{
									type: "none",
									count: 1,
								},
								{
									type: "original",
									count: 2,
								},
							],
						},
						anonymous: {
							suggestions: [
								{
									suggestion: "Suggestion 2",
									count: 4,
								},
							],
							types: [
								{
									type: "user",
									count: 3,
								},
								{
									type: "original",
									count: 4,
								},
							],
						},
					},
				},
			});
		} else if (req.url.endsWith("/api/sentences/1/user_suggestions?page=0")) {
			return JSON.stringify({
				success: true,
				total: 1,
				page_size: 25,
				data: [{ id: 1, user_type: "Logged", user_suggestion: "Suggestion 1" }],
			});
		}
	});
});

it("Renders the sentence information", async () => {
	const { asFragment } = render(
		<SentenceDisplay setAlertMessage={setAlertMessage} sentenceId={1} />
	);
	await screen.findByText("Suggestion 2");
	expect(asFragment()).toMatchSnapshot();
});
