import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Admin from "./pages/Admin";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
	const [user, setUser] = useState(null);

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
			<Route path="/" element={<Home user={user} />} />
			<Route path="/about" element={<About user={user} />} />
			<Route path="/login" element={<Login />} />
			<Route path="/admin" element={<Admin user={user} />} />
		</Routes>
	);
};

export default App;
