import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function PopUpAlert(props) {
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		props.setAlertMessage(null);
	};

	return (
		<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
			<MuiAlert
				variant="filled"
				elevation={6}
				onClose={handleClose}
				severity={props.message.success ? "success" : "error"}
				sx={{ width: "100%" }}
			>
				{props.message.message}
			</MuiAlert>
		</Snackbar>
	);
}
