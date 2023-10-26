const OriginalSentence = (props) => {
	return (
		<div>
			<h3>Original Sentence :</h3>
			<button className="width">
				{props.sentence ? props.sentence.sentence : "Loading..."}
			</button>
		</div>
	);
};

export default OriginalSentence;
