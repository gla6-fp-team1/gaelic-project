import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import LoginDialog from "./LoginDialog";

it("Asks the customer to log in", () => {
	render(<LoginDialog open={true} />);

	expect(
		screen.getByText(
			"Please authorize using your Google account to submit suggestions."
		)
	).toBeInTheDocument();
});

it("Opens google's login page when clicked", async () => {
	const user = userEvent.setup();
	window.open = jest.fn();

	render(<LoginDialog open={true} />);
	await user.click(screen.getByRole("button"));

	expect(window.open).toHaveBeenCalledTimes(1);
	expect(window.open).toHaveBeenCalledWith("/api/auth/google", "_self");
});
