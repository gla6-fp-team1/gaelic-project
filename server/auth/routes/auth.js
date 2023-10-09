require("dotenv");
const router = require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;

const CLIENT_URL = "https://gaelic-project-pr-28.onrender.com/";

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
		},
		function (accessToken, refreshToken, profile, cb) {
			return cb(null, profile);

			/* Find or create user in database
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
    */
		}
	)
);

passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: "/auth/github/callback",
		},
		function (accessToken, refreshToken, profile, cb) {
			return cb(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

router.get("/login/failed", (req, res) => {
	res.status(401).json({
		success: false,
		message: "User failed to authenticate.",
	});
});

router.get("/login/success", (req, res) => {
	if (req.user) {
		res.status(200).json({
			success: true,
			message: "User has been successfully authenticated.",
			user: req.user,
			// cookies: req.cookies,
		});
	}
});

router.get("/logout", (req, res) => {
	req.logout();
	res.redirect(CLIENT_URL);
});
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
	"/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login/failed",
		successRedirect: CLIENT_URL,
	}),
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
	"/github/callback",
	passport.authenticate("github", {
		failureRedirect: "/login/failed",
		successRedirect: CLIENT_URL,
	}),
);

module.exports = router;
