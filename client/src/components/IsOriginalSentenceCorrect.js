import { useState } from "react";
const IsOriginalSentenceCorrect = (props) => {
	const [selectedOption, setSelectedOption] = useState("");
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (selectedOption !== "Correct") {
			alert("Are you sure the sentence correct? select Correct.");
			return;
		}
		const formData = {
			sentence: props.sentence,
			suggestions: props.suggestions,
			type: "original_sentence_was_correct",
		};

		try {
			const response = await fetch("/api/user_interactions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				console.log("Form data submitted successfully");
				setSelectedOption("");
				props.loadNextSentence();
			} else {
				console.error("Form data submission failed");
			}
		} catch (error) {
			console.log("Error submitting form:", error);
		}
	};

	return (
		<div>
			<form id="myFormOriginal" onSubmit={handleSubmit}>
				<label htmlFor="isOriginalSentence">
					Is Original Sentence Correct:
				</label>
				<select
					className="isOriginalSentenceCorrect"
					name="isOriginalSentence"
					value={selectedOption}
					onChange={(event) => setSelectedOption(event.target.value)}
				>
					<option value="empty field"></option>
					<option value="Correct">Correct</option>
				</select>
				<button type="submit" className="isOriginSubmit">
					Submit
				</button>
			</form>
		</div>
	);
};

export default IsOriginalSentenceCorrect;
