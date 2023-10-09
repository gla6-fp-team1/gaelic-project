import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import "./Login.css";

const Login = () => {
	const google = () => {
		window.open("https://gaelic-project-pr-28.onrender.com/auth/google", "_self");
	};
	const github = () => {
		window.open("https://gaelic-project-pr-28.onrender.com/auth/github", "_self");
	};

	return (
		<div className="login-container">
			<h1 className="loginTitle">Sign in</h1>
			<div className="wrapper">
				<div className="logginbutton">
					<Button color="error" endIcon={<GoogleIcon />} onClick={google}>Sign in with Google</Button>
				</div>
				<div className="logginbutton">
					<Button endIcon={<GitHubIcon />} onClick={github}>Sign in with Github</Button>
				</div>
			</div>
        </div>
	);
};

export default Login;
