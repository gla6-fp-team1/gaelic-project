/* eslint-disable react/display-name */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
import Home from "./Home";

import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

let loadNextSentenceFunction = null;

jest.mock(
	"../components/home/UserInteraction",
	() =>
		({ loadNextSentence }) => {
			loadNextSentenceFunction = loadNextSentence;
			return <mock-user-interaction data-testid="user-interaction" />;
		}
);

describe("Page load", () => {
	let setAlertMessage = null;

	beforeEach(async () => {
		setAlertMessage = jest.fn();

		fetchMock.resetMocks();
		fetch.mockResponseOnce(
			JSON.stringify({
				success: true,
				data: { id: 1, sentence: "The Sentence" },
			})
		);

		render(<Home setAlertMessage={setAlertMessage} />, {
			wrapper: BrowserRouter,
		});

		await screen.findByText("The Sentence");
	});

	it("Renders the loaded up sentence", async () => {
		expect(screen.getByText("The Sentence")).toBeInTheDocument();
	});

	it("Renders the user interaction component", async () => {
		expect(screen.getByTestId("user-interaction")).toBeInTheDocument();
	});

	describe("5 page loads", () => {
		it("Renders the login page for unauthenticated users", async () => {
			for (let i = 0; i < 5; i++) {
				fetch.mockResponseOnce(
					JSON.stringify({
						success: true,
						data: { id: 1, sentence: `The Sentence ${i}` },
					})
				);

				await act(() => loadNextSentenceFunction());

				await screen.findByText(`The Sentence ${i}`);
			}

			expect(
				screen.getByText(
					"Please authorize using your Google account to submit suggestions."
				)
			).toBeInTheDocument();
		});
	});
});
