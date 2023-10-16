import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import About from "./pages/About";
import HomeAdmin from "./pages/HomeAdmin";
import HomeUser from "./pages/HomeUser";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
	const [user, setUser] = useState(null);
	const [adminGoogleID, setAdminGoogleID] = useState(null);

	useEffect(() => {
		fetch("/api/adminGoogleID")
			.then((response) => response.json())
			.then((adminGoogleData) => {
				const extractedAdminGoogleData = adminGoogleData.arrayOfGoogleID.map(
					(id) => id.admin_google_id
				);
				setAdminGoogleID(extractedAdminGoogleData);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	}, []);

	useEffect(() => {
		const getUser = () => {
			fetch("/api/auth/login/success", {
				method: "GET",
				credentials: "include",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"Access-Control-Allow-Credentials": true,
				},
			})
				.then((response) => {
					if (response.status === 200) {
						return response.json();
					}
					throw new Error("failed to authenticate user");
				})
				.then((responseJson) => {
					setUser(responseJson.user);
				})
				.catch((error) => {
					console.log(error);
				});
		};
		getUser();
	}, []);

	return (
		<Routes>
			<Route
				path="/"
				element={
					user ? (
						adminGoogleID && adminGoogleID.includes(user.id) ? (
							<HomeAdmin user={user} />
						) : (
							<HomeUser user={user} />
						)
					) : (
						<Navigate to="/login" />
					)
				}
			/>

			<Route
				path="/about/this/site"
				element={
					user ? (
						adminGoogleID.includes(user.id) ? (
							<About user={user} />
						) : (
							<About user={user} />
						)
					) : (
						<Navigate to="/login" />
					)
				}
			/>

			<Route
				path="/register"
				element={
					user ? (
						adminGoogleID.includes(user.id) ? (
							<Register user={user} />
						) : (
							<Register user={user} />
						)
					) : (
						<Navigate to="/login" />
					)
				}
			/>

			<Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
		</Routes>
	);
};

export default App;
