const SubmitSuggestion = (props) => {
	return (
		<div className="flex-end">
			<button
				className="width submit"
				onClick={() => {
					const data = new URLSearchParams();
					data.append("sentence", props.randomText);
					data.append("suggestions", props.suggestionsText);
					data.append("selectedSuggestion", props.selectedSuggestion);


					fetch("https://gaelic-project.onrender.com/api/save-suggestions", {

					
						method: "POST",
						body: data,
						headers: {
							"Access-Control-Allow-Origin" : "*",
						},
					})
						.then((res) => res.json())
						.then((data) => {
							console.log(data.message);
						});
					let randomNumber = Math.random() * 1000;
					props.setNextOriginalText(randomNumber);
				}}
			>
				Submit Suggestion
			</button>
		</div>
	);
};

export default SubmitSuggestion;
