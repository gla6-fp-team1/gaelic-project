const SuggestionSentence = (props) => {
	// getting sentence from the button and saving it in the const vaiable
	const getClickedSuggestionText = (e) => {
		e.preventDefault();
		const suggestionText= e.target.innerText.slice(13, -1);
		return suggestionText;
	};

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
				className="displayBlock width"
				onClick={(e) => {
					let randomNumber = Math.random() * 1000;
					props.setNextOriginalText(randomNumber);
					getClickedSuggestionText(e);
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
