import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import About from "./About";

it("Shows the Privacy Policy link", () => {
	render(<About />, { wrapper: BrowserRouter });

	expect(
		screen.getByRole("link", { name: "Privacy Policy" })
	).toBeInTheDocument();
});

it("Shows the Source Code link", () => {
	render(<About />, { wrapper: BrowserRouter });

	expect(screen.getByRole("link", { name: "Source Code" })).toBeInTheDocument();
});
