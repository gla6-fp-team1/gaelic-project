import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SuggestionSentence from "./SuggestionSentence";

describe("Suggestion display", () => {
	beforeEach(() => {
		render(
			<SuggestionSentence
				sentence={{ id: 1, sentence: "The Sentence" }}
				suggestion="The Suggestion"
				number="1"
			/>
		);
	});

	it("Displays the suggestion", () => {
		expect(screen.getByTestId("suggestion").textContent).toBe("The Suggestion");
	});

	it("Renders the difference between it and the original sentence", () => {
		expect(screen.getByTestId("suggestion").innerHTML).toBe(
			"The <u>Suggestion</u>"
		);
	});
});

describe("Selection display", () => {
	let selectedSuggestion = null;

	beforeEach(() => {
		render(
			<SuggestionSentence
				sentence={{ id: 1, sentence: "The Sentence" }}
				suggestion="The Suggestion"
				number="1"
				selectedInteraction={{
					type: "suggestion",
					selectedSuggestion: selectedSuggestion,
				}}
			/>
		);
	});

	describe("Selected interaction is the same", () => {
		beforeAll(() => {
			selectedSuggestion = "The Suggestion";
		});

		it("Renders the button with the selection class", () => {
			expect(screen.getByRole("button")).toHaveClass("selected-interaction");
		});
	});

	describe("Selected interaction is different", () => {
		beforeAll(() => {
			selectedSuggestion = "Other Suggestion";
		});

		it("Renders the button without the selection class", () => {
			expect(screen.getByRole("button")).not.toHaveClass(
				"selected-interaction"
			);
		});
	});
});

describe("Selecting item", () => {
	it("Sends a request to update the selected interaction", () => {
		const setSelectedInteraction = jest.fn();

		render(
			<SuggestionSentence
				sentence={{ id: 1, sentence: "The Sentence" }}
				suggestion="The Suggestion"
				number="1"
				setSelectedInteraction={setSelectedInteraction}
			/>
		);

		fireEvent.click(screen.getByRole("button"));

		expect(setSelectedInteraction).toHaveBeenCalledTimes(1);
		expect(setSelectedInteraction).toBeCalledWith({
			type: "suggestion",
			selectedSuggestion: "The Suggestion",
		});
	});
});
