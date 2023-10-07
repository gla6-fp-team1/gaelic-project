import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
	return (
		<nav className="navbar">
			<span className="logo">
				<Link className="navbar-title" to="/">
					RLHF
				</Link>
			</span>
			{user ? (
                <>
                <ul className="user-info">
                    <li className="avatar">
                        <img src="https://via.placeholder.com/50" alt="avatar" />
                    </li>
                    <li className="username">John Doe</li>
                </ul>
				<ul className="controls">
					<li>
						<Link to="/">Home</Link>
					</li>
					<li>
						<Link to="/about/this/site">About</Link>
					</li>
                    <li>
						<Link to="/">Logout</Link>
					</li>
				</ul>
                </>

			) : (
				<Link to="/login">Login</Link>
			)}
		</nav>
	);
};

export default Navbar;
