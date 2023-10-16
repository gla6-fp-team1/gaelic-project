import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";

const Navbar = ({ user }) => {
	const [adminGoogleID, setAdminGoogleID] = useState(null);
	const logout = () => {
		window.open("/api/auth/logout", "_self");
	};
	useEffect(() => {
		fetch("/api/adminGoogleID")
			.then((response) => response.json())
			.then((adminGoogleData) => {
				const extractedAdminGoogleData = adminGoogleData.arrayOfGoogleID.map(
					(id) => id.admin_google_id
				);
				setAdminGoogleID(extractedAdminGoogleData);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	return (
		<nav className="navbar">
			<span className="logo">
				<Link className="navbar-title" to="/">
					RLHF
				</Link>
			</span>
			{user ? (
				adminGoogleID && adminGoogleID.includes(user.id) ? (
					<>
						<ul className="user-info">
							<li className="avatar">
								<img src={user.photos[0].value} alt="avatar" />
							</li>
							<li className="username">{user.displayName}(Admin)</li>
						</ul>
						<ul className="controls">
							<li>
								<Link to="/">Home</Link>
							</li>
							<li>
								<Link to="/register">Register</Link>
							</li>
							<li>
								<Link to="/about/this/site">About</Link>
							</li>
							<li>
								<Button variant="contained" color="primary" onClick={logout}>
									<Link to="/">Logout</Link>
								</Button>
							</li>
						</ul>
					</>
				) : (
					<>
						<ul className="user-info">
							<li className="avatar">
								<img src={user.photos[0].value} alt="avatar" />
							</li>
							<li className="username">{user.displayName}(User)</li>
						</ul>
						<ul className="controls">
							<li>
								<Link to="/">Home</Link>
							</li>
							<li>
								<Link to="/about/this/site">About</Link>
							</li>
							<li>
								<Button variant="contained" color="primary" onClick={logout}>
									<Link to="/">Logout</Link>
								</Button>
							</li>
						</ul>
					</>
				)
			) : (
				<Link to="/login">Login</Link>
			)}
		</nav>
	);
};

export default Navbar;
