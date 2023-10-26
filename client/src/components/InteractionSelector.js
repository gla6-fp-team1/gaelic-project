export default function InteractionSelector({
	selectedInteraction,
	setSelectedInteraction,
	type,
	message,
	additionalValues,
}) {
	const classNames = ["interaction-selector"];

	if (selectedInteraction && selectedInteraction.type == type) {
		classNames.push("selected-interaction");
	}

	return (
		<div>
			<button
				className={classNames.join(" ")}
				onClick={() => {
					setSelectedInteraction({
						type: type,
						...additionalValues,
					});
				}}
			>
				{message}
			</button>
		</div>
	);
}
