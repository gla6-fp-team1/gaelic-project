import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="navbar">
			<span className="logo">
				<Link className="navbar-title" to="/">
					RLHF
				</Link>
			</span>
			<ul>
				<li>
					<a href="/">Home</a>
				</li>
				<li>
					<a href="/about">About</a>
				</li>
				<li>
					<a href="/contact">Contact</a>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
