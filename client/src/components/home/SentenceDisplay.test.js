import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SentenceDisplay from "./SentenceDisplay";

it("Renders the sentence", () => {
	render(<SentenceDisplay sentence={{ id: 1, sentence: "The Sentence" }} />);
	expect(screen.getByText("The Sentence")).toBeInTheDocument();
});

it("Shows a loading screen if there is no sentence loaded yet", () => {
	render(<SentenceDisplay />);
	expect(screen.getByText("Loading...")).toBeInTheDocument();
});
