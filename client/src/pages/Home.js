import { useEffect, useState } from "react";

import "./Home.css";

import SentenceDisplay from "../components/SentenceDisplay";

import Navbar from "../components/Navbar";

import UserInteraction from "../components/UserInteraction";
import LoginDialog from "../components/LoginDialog";

export function Home({ user, setAlertMessage }) {
	const [sentence, setSentence] = useState(null);
	const [suggestions, setSuggestions] = useState([]);

	const [selectedInteraction, setSelectedInteraction] = useState(null);
	const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

	const [nextSentenceCounter, setNextSentenceCounter] = useState(0); // counter for triggering useEffect
	const [submitClickCounter, setSubmitClickCounter] = useState(4);

	const loadNextSentence = () => {
		if (!user) {
			setSubmitClickCounter(submitClickCounter - 1);
			if (submitClickCounter < 1) {
				setIsLoginDialogOpen(true);
				setSubmitClickCounter(4);
			}
		}

		setSentence(null);
		setSelectedInteraction(null);
		setSuggestions([]);
		setNextSentenceCounter(nextSentenceCounter + 1);
	};

	useEffect(() => {
		const obtainRandomSentence = async () => {
			const response = await fetch("/api/sentences/random");
			const responseData = await response.json();
			setSentence(responseData);
		};
		obtainRandomSentence();
	}, [nextSentenceCounter]);

	return (
		<>
			<LoginDialog
				open={isLoginDialogOpen}
				onClose={() => setIsLoginDialogOpen(false)}
			/>
			<Navbar user={user} />

			<div className="main-content">
				<header>
					<h1>Reinforcement Learning With Human Feedback</h1>
				</header>
				<main role="main" className="main-container">
					<div id="interactions-top">
						<SentenceDisplay
							sentence={sentence}
							loadNextSentence={loadNextSentence}
						/>
					</div>
					<div className="userInteraction">
						<UserInteraction
							sentence={sentence}
							suggestions={suggestions}
							selectedInteraction={selectedInteraction}
							setSelectedInteraction={setSelectedInteraction}
							setSuggestions={setSuggestions}
							loadNextSentence={loadNextSentence}
							setAlertMessage={setAlertMessage}
						/>
					</div>
				</main>
			</div>
		</>
	);
}

export default Home;
