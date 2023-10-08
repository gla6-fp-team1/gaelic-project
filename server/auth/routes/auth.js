require("dotenv");
const router = require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const CLIENT_URL = "http://localhost:3000/";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
			scope: ["profile"],
			state: true,
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
router.get("/login/google", passport.authenticate("google"));

router.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		failureRedirect: "/login/failed",
	}),
	function (req, res) {
		res.redirect(CLIENT_URL);
	}
);

module.exports = router;
