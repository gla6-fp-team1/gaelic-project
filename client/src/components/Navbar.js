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
                    <Link to="/">Home
                    </Link>
				</li>
				<li>
					<Link to="/about/this/site">About</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
