/* eslint-disable react/display-name */

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Admin from "./Admin";

jest.mock("../components/admin/AdminButtons", () => () => {
	return <mock-admin-buttons data-testid="admin-buttons" />;
});
jest.mock("../components/admin/SentenceTable", () => () => {
	return <mock-sentence-table data-testid="sentence-table" />;
});

describe("Not an admin user", () => {
	let user = {
		permissions: {
			isAdmin: false,
		},
	};
	it("doesn't render the admin features", () => {
		render(<Admin user={user} />, { wrapper: BrowserRouter });
		expect(screen.queryByTestId("admin-buttons")).not.toBeInTheDocument();
		expect(screen.queryByTestId("sentence-table")).not.toBeInTheDocument();
	});
});

describe("Admin user", () => {
	let user = {
		permissions: {
			isAdmin: true,
		},
	};

	it("renders the admin features", () => {
		render(<Admin user={user} />, { wrapper: BrowserRouter });
		expect(screen.queryByTestId("admin-buttons")).toBeInTheDocument();
		expect(screen.queryByTestId("sentence-table")).toBeInTheDocument();
	});
});
