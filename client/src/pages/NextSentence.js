const NextSentence = (props) => {
	return (
		<div>
			<button
				className="Next"
				onClick={() => {
					let randomNumber = Math.random() * 1000;
					props.setNextOriginalText(randomNumber);
				}}
			>
				Next
			</button>
		</div>
	);
};

export default NextSentence;
