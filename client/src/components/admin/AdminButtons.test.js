import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminButtons from "./AdminButtons";

it("Renders the admin buttons table", async () => {
	const { asFragment } = render(<AdminButtons />);
	expect(asFragment()).toMatchSnapshot();
});
