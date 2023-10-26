export default function InteractionSelector({
	selectedInteraction,
	setSelectedInteraction,
	type,
	message,
	additionalValues,
}) {
	const classNames = ["InteractionSelector", "displayBlock", "width"];

	if (selectedInteraction && selectedInteraction.type == type) {
		classNames.push("SelectedInteraction");
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
