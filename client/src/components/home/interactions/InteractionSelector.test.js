import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InteractionSelector from "./InteractionSelector";

describe("Display", () => {
	beforeEach(() => {
		render(<InteractionSelector message="The Message" />);
	});

	it("Displays the button", () => {
		expect(
			screen.getByRole("button", { name: "The Message" })
		).toBeInTheDocument();
	});
});

describe("Selection display", () => {
	let selectedType = null;

	beforeEach(() => {
		render(
			<InteractionSelector
				type="theType"
				message="The Message"
				selectedInteraction={{
					type: selectedType,
				}}
			/>
		);
	});

	describe("Selected interaction is the same", () => {
		beforeAll(() => {
			selectedType = "theType";
		});

		it("Renders the button with the selection class", () => {
			expect(screen.getByRole("button")).toHaveClass("selected-interaction");
		});
	});

	describe("Selected interaction is different", () => {
		beforeAll(() => {
			selectedType = "notTheType";
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
			<InteractionSelector
				type="theType"
				setSelectedInteraction={setSelectedInteraction}
				additionalValues={{ stuff: "TheStuff" }}
			/>
		);

		fireEvent.click(screen.getByRole("button"));

		expect(setSelectedInteraction).toHaveBeenCalledTimes(1);
		expect(setSelectedInteraction).toBeCalledWith({
			type: "theType",
			stuff: "TheStuff",
		});
	});
});
