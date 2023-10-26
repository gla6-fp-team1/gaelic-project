import PopUpAlert from "./PopUpAlert";
import { useState } from "react";
const SubmitSuggestion = (props) => {
	const [messageAfterPost, setMessageAfterPost] = useState("");
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
				setMessageAfterPost(data.message);
				console.log(data.message);
			});
		props.loadNextSentence();
	};
	return (
		<div className="flex-end">
			<PopUpAlert
				text={"Submit Suggestion"}
				className="width submit"
				submitButton={submitButton}
				message={messageAfterPost}
				selectedSuggestion={props.selectedSuggestion}
				handleNonAuthSubmitClick={props.handleNonAuthSubmitClick}
			/>
		</div>
	);
};

export default SubmitSuggestion;
