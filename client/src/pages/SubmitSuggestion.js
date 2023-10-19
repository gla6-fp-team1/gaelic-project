import PopUpAlert from "../components/PopUpAlert";
import { useState } from "react";
const SubmitSuggestion = (props) => {
	const [messageAfterPost, setMessageAfterPost] = useState("");
	const submitButton = () => {
		const jsonData = {
			sentence: props.randomText,
			suggestions: props.suggestionsText,
			selectedSuggestion: props.selectedSuggestion,
		};

		fetch("/api/save-suggestions", {
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
		let randomNumber = Math.random() * 1000;
		props.setNextOriginalText(randomNumber);
	};
	return (
		<div className="flex-end">
			<PopUpAlert
				setEnableDisable={props.setEnableDisable}
				enableDisable={props.enableDisable}
				text={"Submit Suggestion"}
				className="width submit"
				submitButton={submitButton}
				message={messageAfterPost}
				handleNonAuthSubmitClick={props.handleNonAuthSubmitClick}
			/>
		</div>
	);
};

export default SubmitSuggestion;
