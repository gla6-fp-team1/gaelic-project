const NoneOfTheSuggestions = (props) => {
	return (
		<div>
			<button
				className="NoneSuggestions"
				onClick={() => {
					props.loadNextSentence();
				}}
			>
				None of the suggestions are helpful
			</button>
		</div>
	);
};

export default NoneOfTheSuggestions;
