const AdminButtons = ({ user }) => {
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
			{user && user.permissions && user.permissions.isAdmin && (
				<div className="admin-functions">
					<p> Admin Functions:</p>
					<div className="file-upload">
						<form
							method="POST"
							action="/api/sentences/upload"
							encType="multipart/form-data"
						>
							<input type="file" name="file" id="fileInput" />
							<input type="submit" value="Upload File" />
						</form>
					</div>
					<button onClick={handleExportDatabase}>Export Database</button>
				</div>
			)}
		</>
	);
};
export default AdminButtons;
