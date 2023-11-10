/* eslint-disable react/display-name */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
	fetch.mockResponse(
		JSON.stringify({
			user: {
				id: 1,
			},
		})
	);
});

jest.mock("./pages/Home", () => () => {
	return <mock-home data-testid="home" />;
});
jest.mock("./pages/Admin", () => () => {
	return <mock-admin data-testid="admin" />;
});
jest.mock("./pages/About", () => () => {
	return <mock-about data-testid="about" />;
});
jest.mock("./pages/Login", () => () => {
	return <mock-login data-testid="login" />;
});

describe("Main page", () => {
	beforeEach(async () => {
		render(
			<MemoryRouter initialEntries={["/"]}>
				<App />
			</MemoryRouter>
		);

		await screen.findByTestId("home");
	});

	it("Renders the home page", async () => {
		expect(screen.getByTestId("home")).toBeInTheDocument();
	});
});

describe("Admin page", () => {
	beforeEach(async () => {
		render(
			<MemoryRouter initialEntries={["/admin"]}>
				<App />
			</MemoryRouter>
		);

		await screen.findByTestId("admin");
	});

	it("Renders the admin page", async () => {
		expect(screen.getByTestId("admin")).toBeInTheDocument();
	});
});

describe("About page", () => {
	beforeEach(async () => {
		render(
			<MemoryRouter initialEntries={["/about"]}>
				<App />
			</MemoryRouter>
		);

		await screen.findByTestId("about");
	});

	it("Renders the about page", async () => {
		expect(screen.getByTestId("about")).toBeInTheDocument();
	});
});

describe("Login page", () => {
	beforeEach(async () => {
		render(
			<MemoryRouter initialEntries={["/login"]}>
				<App />
			</MemoryRouter>
		);

		await screen.findByTestId("login");
	});

	it("Renders the login page", async () => {
		expect(screen.getByTestId("login")).toBeInTheDocument();
	});
});

describe("Success alerts from url", () => {
	beforeEach(async () => {
		render(
			<MemoryRouter initialEntries={["/?message=SuccessMessage"]}>
				<App />
			</MemoryRouter>
		);

		await screen.findByTestId("home");
	});

	it("Renders the message", async () => {
		expect(screen.getByText("SuccessMessage")).toBeInTheDocument();
	});
});

describe("Failure alerts from url", () => {
	beforeEach(async () => {
		render(
			<MemoryRouter initialEntries={["/?fail=FailMessage"]}>
				<App />
			</MemoryRouter>
		);

		await screen.findByTestId("home");
	});

	it("Renders the message", async () => {
		expect(screen.getByText("FailMessage")).toBeInTheDocument();
	});
});
