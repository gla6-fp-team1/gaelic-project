import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import "./Login.css";

const Login = () => {
	return (
		<div className="login-container">
			<h1 className="loginTitle">Sign in</h1>
			<div className="wrapper">
				<div className="logginbutton">
					<Button vcolor="error" endIcon={<GoogleIcon />}>Sign in with Google</Button>
				</div>
				<div className="logginbutton">
					<Button endIcon={<GitHubIcon />}>Sign in with Github</Button>
				</div>
			</div>
        </div>
	);
};

export default Login;
