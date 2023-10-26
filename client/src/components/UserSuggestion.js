import InteractionSelector from "./InteractionSelector";

const UserSuggestion = ({
	sentence,
	selectedInteraction,
	setSelectedInteraction,
}) => {
	return (
		<>
			<div className="grid">
				<InteractionSelector
					message="I'd like to provide my own suggestion"
					type="user"
					selectedInteraction={selectedInteraction}
					setSelectedInteraction={setSelectedInteraction}
					additionalValues={{ userSuggestion: sentence && sentence.sentence }}
				/>
			</div>

			{selectedInteraction && selectedInteraction.type == "user" && (
				<input
					className="suggestionInput"
					type="text"
					name="suggestion"
					placeholder="Type correction"
					id="userProvidedCorrection"
					value={selectedInteraction.userSuggestion}
					onChange={(event) => {
						setSelectedInteraction({
							type: "user",
							userSuggestion: event.target.value,
						});
					}}
					required
				/>
			)}
		</>
	);
};

export default UserSuggestion;
