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
import authRouter from "./auth/routes/auth";
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
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
	origin: "https://gaelic-project-pr-28.onrender.com/",  // For previewing on Render
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true,
}));



if (config.production) {
	app.enable("trust proxy");
	app.use(httpsOnly());
}
app.use("/auth", authRouter);

app.use(apiRoot, apiRouter);
app.use("/health", (_, res) => res.sendStatus(200));
app.use(clientRouter(apiRoot));

app.use(logErrors());

export default app;
