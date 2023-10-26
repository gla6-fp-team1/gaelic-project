import { useEffect } from "react";

import SuggestionSentence from "../components/SuggestionSentence";
import NoneOfTheSuggestions from "../components/NoneOfTheSuggestions";
import SubmitSuggestion from "../components/SubmitSuggestion";

import LoadingSuggestions from "../components/LoadingSuggestions";
import UserSuggestion from "../components/UserSuggestion";
import IsOriginalSentenceCorrect from "../components/IsOriginalSentenceCorrect";

export default function UserInteraction(props) {
	const sentence = props.sentence;
	const suggestions = props.suggestions;
	const setSuggestions = props.setSuggestions;
	const loadNextSentence = props.loadNextSentence;
	const selectedSuggestion = props.selectedSuggestion;
	const setSelectedSuggestion = props.setSelectedSuggestion;
	const setAlertMessage = props.setAlertMessage;

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
	}, [sentence, setSuggestions, setAlertMessage]);

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
		</>
	);
}
