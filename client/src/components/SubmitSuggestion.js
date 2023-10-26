import SubmitButton from "./SubmitButton";

const SubmitSuggestion = (props) => {
	const submitButton = () => {
		const jsonData = {
			sentence: props.sentence,
			suggestions: props.suggestions,
			type: "suggestion_selected",
			selected_suggestion: props.selectedSuggestion,
		};

		fetch("/api/user_interactions", {
			method: "POST",
			body: JSON.stringify(jsonData),
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				props.setAlertMessage(data);
			});
		props.loadNextSentence();
	};
	return (
		<div className="flex-end">
			<SubmitButton
				text={"Submit Suggestion"}
				className="width submit"
				submitButton={submitButton}
				selectedSuggestion={props.selectedSuggestion}
			/>
		</div>
	);
};

export default SubmitSuggestion;
