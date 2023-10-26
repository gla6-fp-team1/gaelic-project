import "./Home.css";

import Navbar from "../components/Navbar";
import AdminButtons from "../components/AdminButtons";

export function Admin({ user }) {
	return (
		<>
			<Navbar user={user} />
			<AdminButtons user={user} />
		</>
	);
}

export default Admin;
