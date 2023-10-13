import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const getUser = () => {
			fetch("https://gaelic-project-1lfx.onrender.com//auth/login/success", {
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
				element={!user ? <Navigate to="/login" /> : <Home user={user} />}
			/>
			<Route path="/about/this/site" element={<About />} />
			<Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
		</Routes>
	);
};

export default App;
