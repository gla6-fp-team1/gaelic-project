const NextSentence = ({ loadNextSentence }) => {
	return (
		<button
			className="SkipButton"
			onClick={() => {
				loadNextSentence();
			}}
		>
			Skip
		</button>
	);
};
export default NextSentence;
