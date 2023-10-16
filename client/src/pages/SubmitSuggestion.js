import PopUpAlert from "../components/PopUpAlert";
import { useState } from "react";
const SubmitSuggestion = (props) => {
	const { randomText, suggestionsText, selectedSuggestion,user } = props;
	const [messageAfterPost, setMessageAfterPost] = useState("");
	const submitButton = () => {
		const sentence = randomText;
		const suggestions = suggestionsText;
		const userID = user ? user.id : null;

		const jsonData = { sentence,suggestions, selectedSuggestion, userID };

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
			/>
		</div>
	);
};

export default SubmitSuggestion;
