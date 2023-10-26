const SuggestionSentence = (props) => {
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
	const originalSentence = props.sentence ? props.sentence.sentence : "";

	const innerText = diff(originalSentence, props.suggestion);
	return (
		<div>
			<button
				className="displayBlock width blue-background"
				onClick={(e) => {
					const text = e.currentTarget.children[2].innerHTML.replace(
						/<u>/g,
						""
					);
					const finalText = text.replace(/<[/]u>/g, "");
					props.setSelectedSuggestion(finalText);
				}}
			>
				<b>Suggestion {props.number}:</b>
				<br></br>
				<span dangerouslySetInnerHTML={{ __html: innerText }}></span>
			</button>
		</div>
	);
};

export default SuggestionSentence;
