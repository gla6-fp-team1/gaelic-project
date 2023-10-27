import NextSentence from "./NextSentence";

const SentenceDisplay = ({ sentence, loadNextSentence }) => {
	return (
		<div>
			<h3>Original Sentence:</h3>
			<div className="grid-90">
				<button className="width">
					{sentence ? sentence.sentence : "Loading..."}
				</button>
				<NextSentence loadNextSentence={loadNextSentence} />
			</div>
		</div>
	);
};

export default SentenceDisplay;
