import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Login from "./Login";

it("Asks the customer to log in", () => {
	render(<Login open={true} />);

	expect(screen.getByText("Sign in")).toBeInTheDocument();
});

it("Opens google's login page when clicked", async () => {
	const user = userEvent.setup();
	window.open = jest.fn();

	render(<Login open={true} />);
	await user.click(screen.getByRole("button"));

	expect(window.open).toHaveBeenCalledTimes(1);
	expect(window.open).toHaveBeenCalledWith("/api/auth/google", "_self");
});
