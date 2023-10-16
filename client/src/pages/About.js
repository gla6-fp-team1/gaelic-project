import "./Home.css";
import Navbar from "../components/Navbar";
const About = ({ user }) => (
	<main role="main">
		<Navbar user={user} />

		<div>
			<h1>About</h1>
			<p>
				Starter kit for full-stack JavaScript projects. For more information,
				see the wiki:
			</p>
			<a href="https://github.com/textbook/starter-kit/wiki">Wiki</a>
		</div>
	</main>
);

export default About;
