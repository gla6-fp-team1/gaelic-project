import Button from "@mui/material/Button";

const SubmitSuggestion = ({
	sentence,
	suggestions,
	setAlertMessage,
	selectedInteraction,
	loadNextSentence,
}) => {
	const submitButton = () => {
		const jsonData = {
			sentence: sentence,
			suggestions: suggestions,
			type: selectedInteraction.type,
			selected_suggestion: selectedInteraction.selectedSuggestion,
			user_suggestion: selectedInteraction.userSuggestion,
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
				setAlertMessage(data);
			});
		loadNextSentence();
	};
	return (
		<Button
			className="submit"
			color="success"
			variant="contained"
			disabled={selectedInteraction === null}
			onClick={submitButton}
		>
			Submit
		</Button>
	);
};

export default SubmitSuggestion;
