import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

import "./Home.css";
import OriginalSentence from "./OriginalSentence";
import SuggestionSentence from "./SuggestionSentence";
import NextSentence from "./NextSentence";
import NoneOfTheSuggestions from "./NoneOfTheSuggestions";

export function Home() {
	const [randomText, setRandomText] = useState("Loading...");
	const [suggestionsText, setSuggestionsText] = useState([
		"Loading...",
		"Loading...",
		"Loading...",
	]);
	const [nextOriginalText, setNextOriginalText] = useState(1);
//
	const getRandomIndex = (length) => {
		return Math.floor(Math.random() * length);
	};

	//
	useEffect(() => {
		const loadRandomSentenceFromFile = async () => {
			const response = await fetch("/api");
			const allText = await response.json();

			setRandomText(allText[getRandomIndex(allText.length)]);
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
				setNextOriginalText={setNextOriginalText}
			/>
		);
	});
	//
	return (
		<main role="main">
			<div>
				<OriginalSentence text={randomText} />

			</div>
			<div><h3>Suggestions :</h3>{suggestions}</div>
		</main>
	);
}

export default Home;
