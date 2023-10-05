import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";

createRoot(document.getElementById("root")).render(
	<GoogleOAuthProvider clientId="1067730670764-mab7ahvvr74b5k3f0qp988lj4ckkv8bn.apps.googleusercontent.com">
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</GoogleOAuthProvider>
);
