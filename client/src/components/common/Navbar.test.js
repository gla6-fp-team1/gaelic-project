import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "./Navbar";
import { BrowserRouter } from "react-router-dom";

it("Renders the main links", () => {
	render(<Navbar />, { wrapper: BrowserRouter });
	expect(screen.getByRole("link", { name: "RLHF" })).toBeInTheDocument();
	expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
	expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
	expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
});

describe("logged in user", () => {
	let user;

	beforeAll(() => {
		user = {
			photos: [
				{
					value: "test.png",
				},
			],
			displayName: "Test User",
		};
	});

	beforeEach(() => {
		render(<Navbar user={user} />, { wrapper: BrowserRouter });
	});

	it("includes the user's name and avatar", () => {
		expect(screen.getByRole("img", { name: "avatar" })).toHaveAttribute(
			"src",
			"test.png"
		);
		expect(
			screen.getByRole("listitem", { name: "Username" })
		).toHaveTextContent("Test User");
	});

	it("Renders the main links", () => {
		expect(screen.getByRole("link", { name: "RLHF" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
	});

	it("includes a logout button", () => {
		expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
	});

	describe("Administrator", () => {
		beforeAll(() => {
			user.permissions = {
				isAdmin: true,
			};
		});

		it("includes the link to the Admin page", () => {
			expect(screen.getByRole("link", { name: "Admin" })).toBeInTheDocument();
		});
	});
});
