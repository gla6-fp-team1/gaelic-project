import { useState } from "react";
const IsOriginalSentenceCorrect = ({ randomText, suggestionsText, user }) => {
	const [selectedOption, setSelectedOption] = useState("");
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (selectedOption !== "Correct") {
			event.preventDefault();
			alert("Are you sure the sentence correct? select Correct.");
		}
		const sentence = randomText;
		const suggestions = suggestionsText;
		const originalSentenceWasCorrect = selectedOption;
		const userID = user ? user.id : null;
		const formData = { sentence, suggestions, originalSentenceWasCorrect , userID };
		console.log(formData);

		try {
			const response = await fetch("/api/save-suggestions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				console.log("Form data submitted successfully");
				setSelectedOption("");
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
				<button
					type="submit"
					className="isOriginSubmit"
					onClick={() => {
						setTimeout(() => {
							if (selectedOption === "Correct") {
								window.location.reload();
							} else {
								setSelectedOption("");
							}
						}, 1000);
					}}
				>
					Submit
				</button>
			</form>
		</div>
	);
};

export default IsOriginalSentenceCorrect;
