import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function PopUpAlert(props) {
	const [open, setOpen] = React.useState(false);

	const handleClick = () => {
		setOpen(true);
	};

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	return (
		<Stack spacing={1} sx={{ width: "100%" }}>
			<Button
				color="success"
				variant="contained"
				disabled={props.enableDisable}
				onClick={() => {
					props.submitButton();
					handleClick();
					props.setEnableDisable(true);
					props.handleNonAuthSubmitClick();
				}}
			>
				{props.text}
			</Button>
			<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
				{props.message === "Suggestions saved successfully" ? (
					<Alert
						onClose={handleClose}
						severity="success"
						sx={{ width: "100%" }}
					>
						Suggestions saved successfully
					</Alert>
				) : (
					<Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
						Could not saved suggestion
					</Alert>
				)}
			</Snackbar>
		</Stack>
	);
}
