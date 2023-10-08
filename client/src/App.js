import { Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import axios from "axios";

const App = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const getUser = async () => {
			axios.get("http://localhost:3100/auth/login/success", {
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
	console.log(user);

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
