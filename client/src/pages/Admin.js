import "./Home.css";

import Navbar from "../components/common/Navbar";
import AdminButtons from "../components/admin/AdminButtons";
import SentenceTable from "../components/admin/SentenceTable";

export function Admin({ user, setAlertMessage }) {
	return (
		<>
			<Navbar user={user} />
			{user && user.permissions && user.permissions.isAdmin && (
				<div className="admin-functions">
					<h1>Admin Functions</h1>
					<SentenceTable setAlertMessage={setAlertMessage} />
					<AdminButtons />
				</div>
			)}
		</>
	);
}

export default Admin;
