import { useEffect, useState } from "react";
const exportGaelicData = async (data) => {
	try {
		const jsonData = JSON.stringify(data, null, 2);
		const blob = new Blob([jsonData], { type: "application/json" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "exported_data.json";
		document.body.appendChild(link);
		link.click();
		setTimeout(() => {
			document.body.removeChild(link);
		}, 0);
	} catch (error) {
		console.error("Error exporting data:", error);
	}
};
const NextSentence = (props) => {
	const [hideMyGaelicButton, setHideMyGaelicButton] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/getUser");
				const data = await response.json();
				console.log("User:", data);

				setHideMyGaelicButton(data);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchData();
	}, []);

	const handleExportGaelicData = async () => {
		try {
			const response = await fetch("/api/exportGaelicData");
			const data = await response.json();
			exportGaelicData(data);
		} catch (error) {
			console.error("Error fetching Gaelic data:", error);
		}
	};

	return (
		<div className="nextExportButton">
			<button
				className="Next"
				onClick={() => {
					let randomNumber = Math.random() * 1000;
					props.setNextOriginalText(randomNumber);
				}}
			>
				Next
			</button>
			{hideMyGaelicButton && (
				<button id="myGaelicButton" onClick={handleExportGaelicData}>
					ExportGaelicData
				</button>
			)}
		</div>
	);
};

export default NextSentence;
