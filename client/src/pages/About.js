import Navbar from "../components/common/Navbar";

const About = ({ user }) => (
	<>
		<Navbar user={user} />
		<main role="main">
			<div>
				<h1>About</h1>
				<p>
					This is a simple web-based tool that provides a user interface for
					evaluating spelling corrections in sentences. It is primarily used for
					data collection in the area of Reinforcement Learning from Human
					Feedback (RLHF).
				</p>

				<p>
					The tool displays a series of sentences along with suggestions for
					spelling corrections. Users can select a suggestion or provide their
					own correction. The application keeps track of the user&apos;s
					selections and corrections for each sentence.
				</p>
				<h2>Links</h2>
				<p>
					<ul>
						<li>
							<a href="https://github.com/gla6-fp-team1/gaelic-project">
								Source Code
							</a>
						</li>
						<li>
							<a href="https://github.com/gla6-fp-team1/gaelic-project/blob/main/PRIVACY.md">
								Privacy Policy
							</a>
						</li>
					</ul>
				</p>
			</div>
		</main>
	</>
);

export default About;
