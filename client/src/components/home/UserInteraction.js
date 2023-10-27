import { useEffect } from "react";

import SuggestionSentence from "./interactions/SuggestionSentence";
import InteractionSelector from "./interactions/InteractionSelector";
import SubmitSuggestion from "./interactions/SubmitSuggestion";

import LoadingSuggestions from "./LoadingSuggestions";
import UserSuggestion from "./interactions/UserSuggestion";

export default function UserInteraction({
	sentence,
	suggestions,
	setSuggestions,
	loadNextSentence,
	selectedInteraction,
	setSelectedInteraction,
	setAlertMessage,
}) {
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

	return (
		<>
			{suggestions.length == 0 ? (
				<LoadingSuggestions />
			) : (
				<>
					<div>
						<h3>Please select a suggestion you believe is correct:</h3>

						<div className="grid">
							{suggestions.map((suggestion, i) => (
								<SuggestionSentence
									key={i}
									number={i + 1}
									sentence={sentence}
									suggestion={suggestion}
									selectedInteraction={selectedInteraction}
									setSelectedInteraction={setSelectedInteraction}
								/>
							))}
						</div>
					</div>
					<h3>Or select from the following options:</h3>
					<div className="grid">
						<InteractionSelector
							message="None of the suggestions are helpful"
							type="none"
							selectedInteraction={selectedInteraction}
							setSelectedInteraction={setSelectedInteraction}
						/>
						<InteractionSelector
							message="Original sentence is correct"
							type="original"
							selectedInteraction={selectedInteraction}
							setSelectedInteraction={setSelectedInteraction}
						/>
					</div>

					<UserSuggestion
						sentence={sentence}
						selectedInteraction={selectedInteraction}
						setSelectedInteraction={setSelectedInteraction}
					/>

					<div>
						<SubmitSuggestion
							sentence={sentence}
							suggestions={suggestions}
							selectedInteraction={selectedInteraction}
							loadNextSentence={loadNextSentence}
							setAlertMessage={setAlertMessage}
						/>
					</div>
				</>
			)}
		</>
	);
}
