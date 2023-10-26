const NextSentence = ({ loadNextSentence }) => {
	return (
		<button
			className="skip-button"
			onClick={() => {
				loadNextSentence();
			}}
		>
			Skip
		</button>
	);
};
export default NextSentence;
