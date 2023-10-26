import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export default function SubmitButton({ text, submitButton, disabled }) {
	return (
		<Stack spacing={1} sx={{ width: "100%" }}>
			<Button
				color="success"
				variant="contained"
				disabled={disabled}
				onClick={submitButton}
			>
				{text}
			</Button>
		</Stack>
	);
}
