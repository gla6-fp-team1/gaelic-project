import { useEffect, useState } from "react";
//import { Link } from "react-router-dom";

import "./Home.css";
import OriginalSentence from "./OriginalSentence";
import SuggestionSentence from "./SuggestionSentence";
import NextSentence from "./NextSentence";
import NoneOfTheSuggestions from "./NoneOfTheSuggestions";
import SubmitSuggestion from "./SubmitSuggestion";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Button from "@mui/material/Button";

export function Home() {
	const [randomText, setRandomText] = useState("Loading...");
	const [suggestionsText, setSuggestionsText] = useState([
		"Loading...",
		"Loading...",
		"Loading...",
	]);
	const [selectedSuggestion, setSelectedSuggestion] = useState("");
	const [nextOriginalText, setNextOriginalText] = useState(1);
	//
	//
	useEffect(() => {
		const loadRandomSentenceFromFile = async () => {
			const response = await fetch("/api");
			const text = await response.json();
			setRandomText(text);
		};
		loadRandomSentenceFromFile();
	}, [nextOriginalText]);

	//
	useEffect(() => {
		const getSuggestionsFromApi = async (text) => {
			const response = await fetch(
				`https://angocair.garg.ed.ac.uk/best/?text=${encodeURIComponent(text)}`
			);
			const data = await response.json();
			setSuggestionsText(data.data);
		};
		getSuggestionsFromApi(randomText);
	}, [randomText]);

	//
	const suggestions = suggestionsText.map((text, i) => {
		return (
			<SuggestionSentence
				key={i}
				suggestionText={text}
				randomText={randomText}
				number={i + 1}
				setSelectedSuggestion={setSelectedSuggestion}
			/>
		);
	});
	//

	const [user, setUser] = useState([]);
	const [profile, setProfile] = useState(null);

	const login = useGoogleLogin({
		onSuccess: (codeResponse) => setUser(codeResponse),
		onError: (error) => console.log("Login Failed:", error),
	});

	useEffect(() => {
		if (user) {
			axios
				.get(
					`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
					{
						headers: {
							Authorization: `Bearer ${user.access_token}`,
							Accept: "application/json",
						},
					}
				)
				.then((res) => {
					setProfile(res.data);
				})
				.catch((err) => console.log(err));
		}
	}, [user]);

	const logOut = () => {
		googleLogout();
		setProfile(null);
	};
	return (
		<div className="margin">
			{profile ? (
				<nav className="userbar">
					<img className="avatar" src={profile.picture} alt="user" />
					<div className="user-details">
						<p>Name: {profile.name}</p>
						<p>Email Address: {profile.email}</p>
					</div>
					<Button onClick={logOut}>Log out</Button>
				</nav>
			) : (
				<Button onClick={() => login()}>Sign in with Google</Button>
			)}
			<header>
				<h1 className="center paddingBottom">
					Reinforcement Learning With Human Feedback
				</h1>
			</header>
			<main role="main" className="flex">
				<div>
					<NextSentence setNextOriginalText={setNextOriginalText} />
				</div>
				<div className="center paddingBottom">
					<OriginalSentence text={randomText} />
				</div>
				<div className="paddingBottom">
					<h3>Suggestions :</h3>
					<div className="grid">
						{suggestions}
						<SubmitSuggestion
							randomText={randomText}
							suggestionsText={suggestionsText}
							selectedSuggestion={selectedSuggestion}
							setNextOriginalText={setNextOriginalText}
						/>
					</div>
				</div>
				<div>
					<NoneOfTheSuggestions setNextOriginalText={setNextOriginalText} />
				</div>
			</main>
		</div>
	);
}

export default Home;
