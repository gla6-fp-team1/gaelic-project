const NextSentence = ({ loadNextSentence }) => {
	return (
		<div className="nextExportButton">
			<button
				className="Next"
				onClick={() => {
					loadNextSentence();
				}}
			>
				Skip
			</button>
		</div>
	);
};
export default NextSentence;
