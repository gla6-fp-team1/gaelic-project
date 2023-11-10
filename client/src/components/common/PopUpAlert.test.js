import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PopUpAlert from "./PopUpAlert";

let message = {
	success: false,
	message: "Message",
};

it("Shows the message", () => {
	render(<PopUpAlert message={message} />);

	expect(screen.getByText("Message")).toBeInTheDocument();
});
