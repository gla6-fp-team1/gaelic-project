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

					fetch("http://localhost:3000/api/save-suggestions", {
						method: "POST",
						body: data,
					})
						.then((res) => res.json())
						.then((data) => {
							console.log(data.message);
						});
				}}
			>
				Submit Suggestion
			</button>
		</div>
	);
};

export default SubmitSuggestion;
