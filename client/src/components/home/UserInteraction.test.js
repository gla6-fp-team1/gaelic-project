/* eslint-disable react/display-name */

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserInteraction from "./UserInteraction";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

jest.mock("./LoadingSuggestions", () => () => {
	return <mock-loading-suggestions data-testid="loading-suggestions" />;
});

jest.mock("./interactions/InteractionSelector", () => ({ type }) => {
	return (
		<mock-interaction-selector data-testid={`interaction-selector-${type}`} />
	);
});
jest.mock("./interactions/SubmitSuggestion", () => () => {
	return <mock-submit-suggestion data-testid="submit-suggestion" />;
});
jest.mock("./interactions/SuggestionSentence", () => () => {
	return <mock-suggestion-sentence data-testid="suggestion-sentence" />;
});
jest.mock("./interactions/UserSuggestion", () => () => {
	return <mock-user-suggestion data-testid="user-suggestion" />;
});

describe("No suggestions loaded", () => {
	it("Renders the loading screen if there are no suggestions", () => {
		render(<UserInteraction suggestions={[]} />);
		expect(screen.getByTestId("loading-suggestions")).toBeInTheDocument();
		expect(screen.queryByTestId("suggestion-sentence")).not.toBeInTheDocument();
		expect(screen.queryByTestId("submit-suggestion")).not.toBeInTheDocument();
		expect(
			screen.queryByTestId("interaction-selector-none")
		).not.toBeInTheDocument();
		expect(
			screen.queryByTestId("interaction-selector-original")
		).not.toBeInTheDocument();
		expect(screen.queryByTestId("user-suggestion")).not.toBeInTheDocument();
	});
});

describe("Suggestions are loaded", () => {
	it("Renders the loading screen if there are no suggestions", () => {
		render(<UserInteraction suggestions={["Suggestion"]} />);
		expect(screen.queryByTestId("loading-suggestions")).not.toBeInTheDocument();
		expect(screen.getByTestId("suggestion-sentence")).toBeInTheDocument();
		expect(screen.getByTestId("submit-suggestion")).toBeInTheDocument();
		expect(screen.getByTestId("interaction-selector-none")).toBeInTheDocument();
		expect(
			screen.getByTestId("interaction-selector-original")
		).toBeInTheDocument();
		expect(screen.getByTestId("user-suggestion")).toBeInTheDocument();
	});
});

describe("API call on load", () => {
	it("Loads up the suggestions if the sentence changes", async () => {
		fetchMock.resetMocks();
		fetch.mockResponseOnce(
			JSON.stringify({ data: ["Suggestion 1", "Suggestion 2", "Suggestion 3"] })
		);

		let setSuggestions = jest.fn();
		let setAlertMessage = jest.fn();
		render(
			<UserInteraction
				sentence={{ id: 1, sentence: "The Sentence" }}
				suggestions={[]}
				setSuggestions={setSuggestions}
				setAlertMessage={setAlertMessage}
			/>
		);

		await waitFor(() => expect(setSuggestions).toHaveBeenCalledTimes(1));

		expect(setSuggestions).toHaveBeenCalledWith([
			"Suggestion 1",
			"Suggestion 2",
			"Suggestion 3",
		]);
		expect(setAlertMessage).toHaveBeenCalledWith(null);
	});
});
