import PopUpAlert from "../components/PopUpAlert";
import { useState } from "react";
const SubmitSuggestion = (props) => {
	const [messageAfterPost, setmessageAfterPost] = useState();
	const submitButton = () => {
		const data = new URLSearchParams();
		data.append("sentence", props.randomText);
		data.append("suggestions", props.suggestionsText);
		data.append("selectedSuggestion", props.selectedSuggestion);

		fetch("/api/save-suggestions", {
			method: "POST",
			body: data,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data.message);
			});
		let randomNumber = Math.random() * 1000;
		props.setNextOriginalText(randomNumber);
	};
	return (
		<div className="flex-end">
			<PopUpAlert text={"Submit Suggestion"}
				className="width submit"
				submitButton={submitButton}
			/>
		</div>
	);
};

export default SubmitSuggestion;
