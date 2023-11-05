import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SubmitSuggestion from "./SubmitSuggestion";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

describe("Submit button", () => {
	let selectedInteraction = null;

	beforeEach(() => {
		render(<SubmitSuggestion selectedInteraction={selectedInteraction} />);
	});

	it("Shows a submit button", () => {
		expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
	});

	describe("No selected interaction", () => {
		beforeAll(() => {
			selectedInteraction = null;
		});

		it("renders the button as disabled", () => {
			expect(screen.getByRole("button")).toHaveAttribute("disabled");
		});
	});

	describe("Has selected interaction", () => {
		beforeAll(() => {
			selectedInteraction = { type: "none" };
		});

		it("renders the button as enabled", () => {
			expect(screen.getByRole("button")).not.toHaveAttribute("disabled");
		});
	});
});

describe("Pressing the button", () => {
	let selectedInteraction = null;
	let setAlertMessage = null;
	let loadNextSentence = null;
	let mockedResponse = {};

	beforeEach(() => {
		setAlertMessage = jest.fn();
		loadNextSentence = jest.fn();

		fetch.resetMocks();
		fetch.mockResponseOnce(JSON.stringify(mockedResponse));

		render(
			<SubmitSuggestion
				sentence={{ id: 1, sentence: "The Sentence" }}
				suggestions={["Suggestion 1", "Suggestion 2", "Suggestion 3"]}
				setAlertMessage={setAlertMessage}
				selectedInteraction={selectedInteraction}
				loadNextSentence={loadNextSentence}
			/>
		);

		fireEvent.click(screen.getByRole("button"));
	});

	describe("API calls", () => {
		describe("Suggestion selected", () => {
			beforeAll(() => {
				selectedInteraction = {
					type: "suggestion",
					selectedSuggestion: "Suggestion 1",
				};
			});

			it("Sends the user interaction to the API", () => {
				expect(fetch).toHaveBeenCalledWith("/api/user_interactions", {
					body: JSON.stringify({
						sentence: { id: 1, sentence: "The Sentence" },
						suggestions: ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
						type: "suggestion",
						selected_suggestion: "Suggestion 1",
					}),
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Content-Type": "application/json",
					},
					method: "POST",
				});
			});
		});

		describe("User Suggestion", () => {
			beforeAll(() => {
				selectedInteraction = {
					type: "user",
					userSuggestion: "User Suggestion",
				};
			});

			it("Sends the user interaction to the API", () => {
				expect(fetch).toHaveBeenCalledWith("/api/user_interactions", {
					body: JSON.stringify({
						sentence: { id: 1, sentence: "The Sentence" },
						suggestions: ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
						type: "user",
						user_suggestion: "User Suggestion",
					}),
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Content-Type": "application/json",
					},
					method: "POST",
				});
			});
		});

		describe("None is good selected", () => {
			beforeAll(() => {
				selectedInteraction = {
					type: "none",
				};
			});

			it("Sends the user interaction to the API", () => {
				expect(fetch).toHaveBeenCalledWith("/api/user_interactions", {
					body: JSON.stringify({
						sentence: { id: 1, sentence: "The Sentence" },
						suggestions: ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
						type: "none",
					}),
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Content-Type": "application/json",
					},
					method: "POST",
				});
			});
		});
	});

	describe("API response", () => {
		describe("Successful response", () => {
			beforeAll(() => {
				mockedResponse = {
					success: true,
					message: "Success",
				};
			});

			it("Sends an alert", () => {
				expect(setAlertMessage).toHaveBeenCalledWith({
					success: true,
					message: "Success",
				});
			});

			it("Loads the next sentence", () => {
				expect(loadNextSentence).toHaveBeenCalled();
			});
		});

		describe("Unsuccessful response", () => {
			beforeAll(() => {
				mockedResponse = {
					success: false,
					message: "Invalid Call",
				};
			});

			it("Sends an alert", () => {
				expect(setAlertMessage).toHaveBeenCalledWith({
					success: false,
					message: "Invalid Call",
				});
			});

			it("Loads the next sentence", () => {
				expect(loadNextSentence).toHaveBeenCalled();
			});
		});
	});
});
