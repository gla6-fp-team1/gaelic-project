const SuggestionSentence = ({
	number,
	suggestion,
	sentence,
	selectedInteraction,
	setSelectedInteraction,
}) => {
	const diff = (original, corrected) => {
		const originalWords = original.split(" ");
		const correctedWords = corrected.split(" ");
		let result = "";
		correctedWords.forEach(function (word, i) {
			if (originalWords[i] !== word) {
				result += "<u>" + word + "</u> ";
			} else {
				result += word + " ";
			}
		});
		return result.trim();
	};
	const originalSentence = sentence ? sentence.sentence : "";

	const innerText = diff(originalSentence, suggestion);

	const classNames = ["suggestion"];

	if (
		selectedInteraction &&
		selectedInteraction.type === "suggestion" &&
		selectedInteraction.selectedSuggestion === suggestion
	) {
		classNames.push("selected-interaction");
	}

	return (
		<div>
			<button
				className={classNames.join(" ")}
				onClick={() => {
					setSelectedInteraction({
						type: "suggestion",
						selectedSuggestion: suggestion,
					});
				}}
			>
				<b>Suggestion {number}:</b>
				<br></br>
				<span dangerouslySetInnerHTML={{ __html: innerText }}></span>
			</button>
		</div>
	);
};

export default SuggestionSentence;
