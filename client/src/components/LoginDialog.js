import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import GoogleIcon from "@mui/icons-material/Google";
import Typography from "@mui/material/Typography";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}));

export default function LoginDialog({ open, handleClose }) {
	const google = () => {
		window.open("/api/auth/google", "_self");
	};
	return (
		<div>
			<BootstrapDialog
				onClose={handleClose}
				aria-labelledby="customized-dialog-title"
				open={open}
			>
				<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
					Authorization
				</DialogTitle>
				<DialogContent dividers>
					<Typography gutterBottom>
						Please authorize using your Google account to submit suggestions.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button color="error" endIcon={<GoogleIcon />} onClick={google}>
						Sign in with Google
					</Button>
				</DialogActions>
			</BootstrapDialog>
		</div>
	);
}
