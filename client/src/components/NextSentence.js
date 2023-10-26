import { useEffect, useState } from "react";

const NextSentence = (props) => {
	const [hideMyUploadButton, setHideUploadButton] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("/api/users/current");
				const data = await response.json();
				setHideUploadButton(data.is_admin);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};
		fetchData();
	}, []);

	const handleExportGaelicData = async () => {
		const link = document.createElement("a");

		link.href = "/api/sentences/export";
		link.download = "exported_data.json";

		document.body.appendChild(link);
		link.click();

		setTimeout(() => {
			document.body.removeChild(link);
		}, 0);
	};

	return (
		<div className="nextExportButton">
			<button
				className="Next"
				onClick={() => {
					props.loadNextSentence();
				}}
			>
				Next
			</button>
			{hideMyUploadButton && (
				<div className="adminFunctions">
					<p> Admin Functions:</p>
					<div className="fileUpload">
						<form
							method="POST"
							action="/api/sentences/upload"
							encType="multipart/form-data"
						>
							<input type="file" name="file" id="fileInput" />
							<input type="submit" value="Upload File" />
						</form>
					</div>
					<button id="myGaelicButton" onClick={handleExportGaelicData}>
						ExportGaelicData
					</button>
				</div>
			)}
		</div>
	);
};
export default NextSentence;
