import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingSuggestions from "./LoadingSuggestions";

it("Shows an image", () => {
	render(<LoadingSuggestions />);

	expect(screen.getByRole("img")).toBeInTheDocument();
});
