const NextSentence = (props) => {
	return (
		<div>
            <button onClick={() => {
                let randomNumber = Math.random()*1000;
                props.setNextOriginalText(randomNumber);
            }}>
				Next

			</button>
		</div>
	);
};

export default NextSentence;
