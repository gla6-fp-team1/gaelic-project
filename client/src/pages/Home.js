import { useEffect, useState } from "react";
//import { Link } from "react-router-dom";

import "./Home.css";
import OriginalSentence from "./OriginalSentence";
import SuggestionSentence from "./SuggestionSentence";
import NextSentence from "./NextSentence";
import NoneOfTheSuggestions from "./NoneOfTheSuggestions";
import SubmitSuggestion from "./SubmitSuggestion";
import LoadingSuggestions from "./LoadingSuggestions";

export function Home() {
	const [randomText, setRandomText] = useState("Loading...");
	const [suggestionsText, setSuggestionsText] = useState([
		"Loading...",
		"Loading...",
		"Loading...",
	]);
	const [selectedSuggestion, setSelectedSuggestion] = useState("");
	const [nextOriginalText, setNextOriginalText] = useState(1);
	const [loading, setLoading] = useState(1);

	const [enableDisable, setEnableDisable] = useState(true); // submit button is disabled

	//
	//
	useEffect(() => {
		const loadRandomSentenceFromFile = async () => {
			const response = await fetch("/api");
			const text = await response.json();
			setRandomText(text);
			setLoading(1);
		};
		loadRandomSentenceFromFile();
	}, [nextOriginalText]);

	//
	useEffect(() => {
		const getSuggestionsFromApi = async (text) => {
			const response = await fetch(
				`https://angocair.garg.ed.ac.uk/best/?text=${encodeURIComponent(text)}`
			);
			const data = await response.json();
			setSuggestionsText(data.data);
			if (text !== "Loading...") {
				setLoading(0);
			} else {
				setLoading(1);
			}
		};
		getSuggestionsFromApi(randomText);
	}, [randomText]);

	//
	const suggestions = suggestionsText.map((text, i) => {
		return (
			<SuggestionSentence
				key={i}
				suggestionText={text}
				randomText={randomText}
				number={i + 1}
				setSelectedSuggestion={setSelectedSuggestion}
				setEnableDisable={setEnableDisable}
			/>
		);
	});
	//
	return (
		<div className="margin">
			<header>
				<h1 className="center paddingBottom">
					Reinforcement Learning With Human Feedback
				</h1>
			</header>
			<main role="main" className="flex">
				<div>
					<NextSentence setNextOriginalText={setNextOriginalText} />
				</div>
				<div className="center paddingBottom">
					<OriginalSentence text={randomText} />
				</div>
				<div className="paddingBottom">
					<h3>Suggestions :</h3>
					{loading ? (
						<LoadingSuggestions />
					) : (
						<div className="grid">
							{suggestions}
							<SubmitSuggestion
								randomText={randomText}
								suggestionsText={suggestionsText}
								selectedSuggestion={selectedSuggestion}
								setNextOriginalText={setNextOriginalText}
								enableDisable={enableDisable}
								setEnableDisable={setEnableDisable}
							/>
						</div>
					)}
				</div>

				<div>
					<NoneOfTheSuggestions setNextOriginalText={setNextOriginalText} />
				</div>
			</main>
		</div>
	);
}

export default Home;
