import { useEffect, useState } from "react";
//import { Link } from "react-router-dom";

import "./Home.css";
import OriginalSentence from "../components/OriginalSentence";
import SuggestionSentence from "../components/SuggestionSentence";
import NextSentence from "../components/NextSentence";
import NoneOfTheSuggestions from "../components/NoneOfTheSuggestions";
import SubmitSuggestion from "../components/SubmitSuggestion";

import Navbar from "../components/Navbar";

import LoadingSuggestions from "../components/LoadingSuggestions";
import UserSuggestion from "../components/UserSuggestion";
import IsOriginalSentenceCorrect from "../components/IsOriginalSentenceCorrect";
import LoginDialog from "../components/LoginDialog";
import PopUpAlert from "../components/PopUpAlert";

export function Home({ user }) {
	const [sentence, setSentence] = useState(null);
	const [suggestions, setSuggestions] = useState([]);

	const [selectedSuggestion, setSelectedSuggestion] = useState(null);
	const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

	const [alertMessage, setAlertMessage] = useState(null);

	const [nextSentenceCounter, setNextSentenceCounter] = useState(0); // counter for triggering useEffect
	const [nextSuggestionCounter, setNextSuggestionCounter] = useState(0); // counter for triggering useEffect
	const [submitClickCounter, setSubmitClickCounter] = useState(4);

	const handleNonAuthSubmitClick = () => {
		if (!user) {
			setSubmitClickCounter(submitClickCounter - 1);
			if (submitClickCounter < 1) {
				setIsLoginDialogOpen(true);
				setSubmitClickCounter(4);
				setSelectedSuggestion(null);
			}
		}
	};

	const loadNextSentence = () => {
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
			setNextSuggestionCounter((n) => n + 1);
		};
		obtainRandomSentence();
	}, [nextSentenceCounter]);

	useEffect(() => {
		const getSuggestionsFromApi = async (text) => {
			const response = await fetch(
				`https://angocair.garg.ed.ac.uk/best/?text=${encodeURIComponent(text)}`
			);
			const data = await response.json();
			setSuggestions(data.data);
			setAlertMessage(null);
		};
		if (sentence) {
			getSuggestionsFromApi(sentence.sentence);
		}
	}, [sentence, nextSuggestionCounter]);

	const suggestionComponents = suggestions.map((text, i) => {
		return (
			<SuggestionSentence
				key={i}
				number={i + 1}
				sentence={sentence}
				suggestion={text}
				setSelectedSuggestion={setSelectedSuggestion}
			/>
		);
	});

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
					<div className="isOriginalDiv">
						<IsOriginalSentenceCorrect
							sentence={sentence}
							suggestions={suggestions}
							selectedSuggestion={selectedSuggestion}
							loadNextSentence={loadNextSentence}
						/>
					</div>
					<div className="paddingBottom">
						<h3>Suggestions :</h3>
						{suggestionComponents.length == 0 ? (
							<LoadingSuggestions />
						) : (
							<div className="grid">
								{suggestionComponents}
								<SubmitSuggestion
									sentence={sentence}
									suggestions={suggestions}
									selectedSuggestion={selectedSuggestion}
									loadNextSentence={loadNextSentence}
									handleNonAuthSubmitClick={handleNonAuthSubmitClick}
									setAlertMessage={setAlertMessage}
								/>
							</div>
						)}
					</div>

					<div>
						<NoneOfTheSuggestions loadNextSentence={loadNextSentence} />
					</div>
					<div>
						<UserSuggestion
							sentence={sentence}
							suggestions={suggestions}
							selectedSuggestion={selectedSuggestion}
							loadNextSentence={loadNextSentence}
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
