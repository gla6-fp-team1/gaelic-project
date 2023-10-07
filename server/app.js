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
import passportSetup from "./auth/passport";
import authRoute from "./auth/routes/auth";
import cors from "cors";


const apiRoot = "/api";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(configuredHelmet());
app.use(configuredMorgan());


app.use(cookieSession({
	name: "session",
	keys:["key1", "key2"],
	maxAge: 24 * 60 * 60 * 1000,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
	origin: "https://localhost:3000",
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true,
}));

app.use("/auth", authRoute);


if (config.production) {
	app.enable("trust proxy");
	app.use(httpsOnly());
}

app.use(apiRoot, apiRouter);
app.use("/health", (_, res) => res.sendStatus(200));
app.use(clientRouter(apiRoot));

app.use(logErrors());

export default app;
