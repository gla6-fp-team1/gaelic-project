const AdminButtons = () => {
	const handleExportDatabase = async () => {
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
		<>
			<div className="file-upload">
				<h2>Upload sentence data:</h2>
				<form
					method="POST"
					action="/api/sentences/upload"
					encType="multipart/form-data"
				>
					<input type="file" name="file" id="fileInput" />
					<input type="submit" value="Upload File" />
				</form>
			</div>
			<div className="export-database">
				<h2>Export database to JSON file:</h2>
				<button onClick={handleExportDatabase}>Export Database</button>
			</div>
		</>
	);
};
export default AdminButtons;
