import { useEffect, useState } from "react";
import "./Home.css";
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
	const [hideMyUploadButton, setHideUploadButton] = useState(true);
	const [submissionStatus, setSubmissionStatus] = useState(null);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/getUser");
				const data = await response.json();
				setHideUploadButton(data);
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
	const handleSaveFile = async (event) => {
		const selectedFile = event.target.files[0];
		console.log(setSubmissionStatus("success"));
		if (selectedFile) {
			const reader = new FileReader();
			reader.onload = async (e) => {
				const fileContent = e.target.result;
				console.log("File content:", typeof fileContent);
				try {
					const response = await fetch("/api/saveFile", {
						method: "POST",
						body: JSON.stringify({ fileContent }),
						headers: {
							"Content-Type": "application/json",
						},
					});
					if (response.ok) {
						const data = await response.json();
						console.log("File saved on the server:", data);
					} else {
						console.error("Error saving the file:", response.status);
					}
				} catch (error) {
					console.error("Error saving the file:", error);
				}
			};
			reader.readAsText(selectedFile);
		} else {
			console.log("No file selected.");
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
			{hideMyUploadButton && (
				<>
					{" "}
					<div className="fileUpload">
						{submissionStatus === "success" && (
							<p>File submitted successfully!</p>
						)}
						<input type="file" id="fileInput" onChange={handleSaveFile} />
						{/* <button onClick={handleSaveFile}>UploadText</button> */}
					</div>{" "}
					<button id="myGaelicButton" onClick={handleExportGaelicData}>
						ExportGaelicData
					</button>
				</>
			)}
		</div>
	);
};
export default NextSentence;
