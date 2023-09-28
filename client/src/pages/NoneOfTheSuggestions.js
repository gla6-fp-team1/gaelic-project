const NoneOfTheSuggestions = (props) => {
	return (
		<div>
			<button
				className="NoneSuggestions"
				onClick={() => {
					let randomNumber = Math.random() * 1000;
					props.setNextOriginalText(randomNumber);
				}}
			>
				None of the suggestions are helpful
			</button>
		</div>
	);
};

export default NoneOfTheSuggestions;
