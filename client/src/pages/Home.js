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
	}, []);
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

	
	return (
		<main role="main">
			<div>
				<OriginalSentence text={randomText} />

			</div>
		</main>
	);
}

export default Home;
