import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

import "./Home.css";
import OriginalSentence from "./OriginalSentence";
import SuggestionSentence from "./SuggestionSentence";
import NextSentence from "./NextSentence";
import NoneOfTheSuggestions from "./NoneOfTheSuggestions";

export function Home() {
	const [randomText, setRandomText] = useState("Loading...");
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
	
	return (
		<main role="main">
			<div>
				<OriginalSentence text={randomText} />

			</div>
		</main>
	);
}

export default Home;
