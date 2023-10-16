import { useState } from "react";

import "./Home.css";

import Navbar from "../components/Navbar";

export function Register({ user }) {
	const [googleID, setGoogleID] = useState("");
	const [submissionStatus, setSubmissionStatus] = useState("");
	const handleSubmit = async (event) => {
		event.preventDefault();

		if (googleID.trim() === "") {
			return alert("Google ID cannot be empty.");
		}

		if (googleID !== "") {
			const adminGoogleId = {
				admin_google_id: googleID,
			};
			try {
				setSubmissionStatus("success");
			} catch (error) {
				setSubmissionStatus("error");
			}

			try {
				const response = await fetch("/api/save-adminGoogleID", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(adminGoogleId),
				});
				if (response.ok) {
					console.log("Form data submitted successfully");

					setGoogleID("");
				} else {
					console.error("Form data submission failed");
				}
			} catch (error) {
				console.log("Error submitting form:", error);
			}
		}
	};

	return (
		<>
			<Navbar user={user} />
			<div className="adminGooglecontainer">
				<form onSubmit={handleSubmit}>
					<div className="adminGoogleInput">
						<h2>admin Google ID</h2>
						<input
							id="googleID"
							value={googleID}
							type="text"
							name="googleid"
							placeholder="Google ID"
							onChange={(e) => setGoogleID(e.target.value)}
							required
						></input>
						<input type="submit" value="Register"></input>
					</div>
				</form>
			</div>

			{submissionStatus === "success" && <p>Form submitted successfully!</p>}
			{submissionStatus === "error" && (
				<p>There was an error submitting the form.</p>
			)}
		</>
	);
}

export default Register;
