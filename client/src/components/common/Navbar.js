import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const Navbar = ({ user }) => {
	const logout = () => {
		window.open("/api/auth/logout", "_self");
	};
	const login = () => {
		window.open("/login", "_self");
	};

	return (
		<nav className="navbar">
			<span className="logo">
				<Link className="navbar-title" to="/">
					RLHF
				</Link>
			</span>
			{user && (
				<ul className="user-info">
					<li className="avatar">
						<img src={user.photos[0].value} alt="avatar" />
					</li>
					<li className="username">{user.displayName}</li>
				</ul>
			)}
			<ul className="controls">
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					<Link to="/about">About</Link>
				</li>
				{user && user.permissions && user.permissions.isAdmin && (
					<li>
						<Link to="/admin">Admin</Link>
					</li>
				)}
				<li>
					{user ? (
						<Button variant="contained" color="primary" onClick={logout}>
							<Link to="/">Logout</Link>
						</Button>
					) : (
						<Button variant="contained" color="primary" onClick={login}>
							<Link to="/">Login</Link>
						</Button>
					)}
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
