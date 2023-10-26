import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function SubmitButton(props) {
	return (
		<Stack spacing={1} sx={{ width: "100%" }}>
			<Button
				color="success"
				variant="contained"
				disabled={props.selectedSuggestion == null}
				onClick={() => {
					props.submitButton();
					props.handleNonAuthSubmitClick();
				}}
			>
				{props.text}
			</Button>
		</Stack>
	);
}
