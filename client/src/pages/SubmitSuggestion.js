import PopUpAlert from "../components/PopUpAlert";

const SubmitSuggestion = (props) => {
	return (
		<div className="flex-end">
			<PopUpAlert text={"Submit Suggestion"}
				className="width submit"
				onClick={() => {
					const data = new URLSearchParams();
					data.append("sentence", props.randomText);
					data.append("suggestions", props.suggestionsText);
					data.append("selectedSuggestion", props.selectedSuggestion);

					fetch("/api/save-suggestions", {
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
			/>
		</div>
	);
};

export default SubmitSuggestion;
