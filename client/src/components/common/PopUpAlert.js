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
		<Snackbar open={true} autoHideDuration={6000} onClose={handleClose}>
			<MuiAlert
				variant="filled"
				severity={props.message.success ? "success" : "error"}
			>
				{props.message.message}
			</MuiAlert>
		</Snackbar>
	);
}
