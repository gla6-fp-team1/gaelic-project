import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";

const SentenceTable = ({ setAlertMessage }) => {
	const [paginationModel, setPaginationModel] = useState({
		page: 0,
		pageSize: 1,
	});

	const [rows, setRows] = useState([]);
	const [totalRows, setTotalRows] = useState(0);

	const columns = [
		{ field: "id", headerName: "ID", width: 75, sortable: false },
		{ field: "source", headerName: "Source File", width: 150, sortable: false },
		{ field: "count", headerName: "Position", width: 75, sortable: false },
		{ field: "sentence", headerName: "Sentence", width: 500, sortable: false },
	];

	useEffect(() => {
		async function fetchSentences() {
			const response = await fetch(
				`/api/sentences?page=${paginationModel.page}`
			);
			const responseData = await response.json();
			if (responseData.success) {
				setRows(responseData.data);
				setTotalRows(responseData.total);
				setPaginationModel({
					page: paginationModel.page,
					pageSize: responseData.page_size,
				});
			} else {
				setAlertMessage(responseData);
			}
		}
		fetchSentences();
	}, [paginationModel.page, setAlertMessage]);

	return (
		<>
			<h2>Sentence database:</h2>
			<div className="sentence-table">
				<DataGrid
					rows={rows}
					columns={columns}
					pageSizeOptions={[paginationModel.pageSize]}
					paginationModel={paginationModel}
					paginationMode="server"
					rowCount={totalRows}
					onPaginationModelChange={setPaginationModel}
					disableColumnFilter
				/>
			</div>
		</>
	);
};
export default SentenceTable;
