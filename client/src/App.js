import { Route, Routes, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PopUpAlert from "./components/PopUpAlert";

const App = () => {
	const [user, setUser] = useState(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const [alertMessage, setAlertMessage] = useState(null);

	useEffect(() => {
		const successMessage = searchParams.get("message");
		const failureMessage = searchParams.get("fail");
		if (successMessage) {
			setAlertMessage({ success: true, message: successMessage });
		} else if (failureMessage) {
			setAlertMessage({ success: false, message: failureMessage });
		}

		setSearchParams({});
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
	}, [searchParams, setSearchParams]);

	return (
		<>
			<Routes>
				<Route
					path="/"
					element={<Home setAlertMessage={setAlertMessage} user={user} />}
				/>
				<Route path="/about" element={<About user={user} />} />
				<Route path="/login" element={<Login />} />
				<Route path="/admin" element={<Admin user={user} />} />
			</Routes>
			{alertMessage && (
				<PopUpAlert setAlertMessage={setAlertMessage} message={alertMessage} />
			)}
		</>
	);
};

export default App;
