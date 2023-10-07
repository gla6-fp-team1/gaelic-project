import { Route, Routes, Navigate } from "react-router-dom";

import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";

const App = () => {
	const user = false;
	return (
		<Routes>
			<Route path="/" element={!user ? <Navigate to="/login" /> : <Home /> } />
			<Route path="/about/this/site" element={<About />} />
			<Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
		</Routes>
	);
};

export default App;
