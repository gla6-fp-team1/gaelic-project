const OriginalSentence = ({ sentence }) => {
	return (
		<div>
			<h3 id="topOfForm">Original Sentence:</h3>
			<button className="width">
				{sentence ? sentence.sentence : "Loading..."}
			</button>
		</div>
	);
};

export default OriginalSentence;
