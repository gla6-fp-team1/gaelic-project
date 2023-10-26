import { useEffect, useState } from "react";

import "./Home.css";

import OriginalSentence from "../components/OriginalSentence";
import NextSentence from "../components/NextSentence";

import Navbar from "../components/Navbar";

import UserInteraction from "../components/UserInteraction";
import LoginDialog from "../components/LoginDialog";
import PopUpAlert from "../components/PopUpAlert";

export function Home({ user }) {
	const [sentence, setSentence] = useState(null);
	const [suggestions, setSuggestions] = useState([]);

	const [selectedSuggestion, setSelectedSuggestion] = useState(null);
	const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

	const [alertMessage, setAlertMessage] = useState(null);

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
		setSelectedSuggestion(null);
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

			<div className="margin">
				<header>
					<h1 className="center paddingBottom">
						Reinforcement Learning With Human Feedback
					</h1>
				</header>
				<main role="main" className="flex">
					<div>
						<NextSentence loadNextSentence={loadNextSentence} />
					</div>
					<div className="center paddingBottom">
						<OriginalSentence sentence={sentence} />
					</div>
					<div className="userInteraction">
						<UserInteraction
							sentence={sentence}
							suggestions={suggestions}
							selectedSuggestion={selectedSuggestion}
							setSelectedSuggestion={setSelectedSuggestion}
							setSuggestions={setSuggestions}
							loadNextSentence={loadNextSentence}
							setAlertMessage={setAlertMessage}
						/>
					</div>
					{alertMessage && (
						<PopUpAlert
							setAlertMessage={setAlertMessage}
							message={alertMessage}
						/>
					)}
				</main>
			</div>
		</>
	);
}

export default Home;
