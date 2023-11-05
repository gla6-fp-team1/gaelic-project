import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserSuggestion from "./UserSuggestion";

describe("Display", () => {
	beforeEach(() => {
		render(<UserSuggestion />);
	});

	it("Displays the button", () => {
		expect(
			screen.getByRole("button", {
				name: "I'd like to provide my own suggestion",
			})
		).toBeInTheDocument();
	});
});

describe("Selection display", () => {
	let selectedType = null;

	beforeEach(() => {
		render(
			<UserSuggestion
				selectedInteraction={{
					type: selectedType,
				}}
			/>
		);
	});

	describe("Selected interaction is user", () => {
		beforeAll(() => {
			selectedType = "user";
		});

		it("Renders the button with the selection class", () => {
			expect(screen.getByRole("button")).toHaveClass("selected-interaction");
		});

		it("Displays the textbox to enter the user provided submission", () => {
			expect(screen.getByRole("textbox")).toBeInTheDocument();
		});
	});

	describe("Selected interaction is different", () => {
		beforeAll(() => {
			selectedType = "not-user";
		});

		it("Renders the button without the selection class", () => {
			expect(screen.getByRole("button")).not.toHaveClass(
				"selected-interaction"
			);
		});

		it("Doesn't show the textbox", () => {
			expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
		});
	});
});

describe("Selecting item", () => {
	it("Sends a request to update the selected interaction", () => {
		const setSelectedInteraction = jest.fn();

		render(<UserSuggestion setSelectedInteraction={setSelectedInteraction} />);

		fireEvent.click(screen.getByRole("button"));

		expect(setSelectedInteraction).toHaveBeenCalledTimes(1);
		expect(setSelectedInteraction).toBeCalledWith({
			type: "user",
		});
	});

	it("Updates the selected interaction with the entered text", () => {
		const setSelectedInteraction = jest.fn();
		const selectedInteraction = {
			type: "user",
		};

		render(
			<UserSuggestion
				selectedInteraction={selectedInteraction}
				setSelectedInteraction={setSelectedInteraction}
			/>
		);

		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "User Suggestion" },
		});

		expect(setSelectedInteraction).toBeCalledWith({
			type: "user",
			userSuggestion: "User Suggestion",
		});
	});
});
