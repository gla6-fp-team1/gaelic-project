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
const innerText = diff(props.randomText, props.suggestionText);
	return (
		<div>
			<button
				onClick={() => {
					let randomNumber = Math.random() * 1000;
					props.setNextOriginalText(randomNumber);
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