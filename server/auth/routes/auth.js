import "dotenv/config";

import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const router = Router();
const CLIENT_URL = process.env.CLIENT_URL;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "/api/auth/google/callback",
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
	} else {
		res.status(401);
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

module.exports = router;
