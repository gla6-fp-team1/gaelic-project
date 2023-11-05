import "dotenv/config";

import express from "express";
import bodyParser from "body-parser";
import apiRouter from "./api";
import config from "./utils/config";
import {
	clientRouter,
	configuredHelmet,
	configuredMorgan,
	httpsOnly,
	logErrors,
} from "./utils/middleware";
import cookieSession from "cookie-session";
import passport from "passport";

const apiRoot = "/api";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(configuredHelmet());
if (app.get("env") !== "test") {
	app.use(configuredMorgan());
}

app.use(
	cookieSession({
		name: "session",
		keys: [process.env.COOKIE_SECRET],
	})
);

app.use(passport.initialize());
app.use(passport.session());

if (config.production) {
	app.enable("trust proxy");
	app.use(httpsOnly());
}

app.use(apiRoot, apiRouter);
app.use("/health", (_, res) => res.sendStatus(200));
app.use(clientRouter(apiRoot));

app.use(logErrors());

export default app;
