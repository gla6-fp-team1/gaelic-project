/* eslint-disable react/display-name */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import SentenceTable from "./SentenceTable";

jest.mock("./SentenceDisplay", () => ({ sentenceId }) => {
	return (
		<mock-sentence-display
			data-testid="sentence-display"
			data-sentence-id={sentenceId}
		/>
	);
});

fetchMock.enableMocks();

let setAlertMessage = jest.fn();

beforeEach(() => {
	fetch.resetMocks();

	fetch.mockResponse(async (req) => {
		if (req.url.endsWith("/api/sentences?page=0")) {
			return JSON.stringify({
				success: true,
				total: 1,
				page_size: 25,
				data: [
					{ id: 1, source: "source.txt", count: 2, sentence: "The Sentence" },
				],
			});
		}
	});
});

it("Renders the sentence table", async () => {
	const { asFragment } = render(
		<SentenceTable setAlertMessage={setAlertMessage} sentenceId={1} />
	);
	await screen.findByText("The Sentence");
	expect(asFragment()).toMatchSnapshot();
});
