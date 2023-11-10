import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import NextSentence from "./NextSentence";

it("Renders a button", () => {
	render(<NextSentence />);
	expect(screen.getByRole("button")).toBeInTheDocument();
});

it("Loads up the next sentence if pressed", () => {
	let loadNextSentence = jest.fn();
	render(<NextSentence loadNextSentence={loadNextSentence} />);

	fireEvent.click(screen.getByRole("button"));

	expect(loadNextSentence).toHaveBeenCalled();
});
