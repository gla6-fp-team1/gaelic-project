import { Router } from "express";

import logger from "./utils/logger";

const router = Router();

router.get("/", (_, res) => {
	logger.debug("Welcoming everyone...");
	res.json({ message: "Hello, Gaelic Project!" });
});
router.post("/suggestions", (req, res) => {
	logger.debug("Welcoming everyone...");
	if (
		req.body.originalText &&
		req.body.suggestionTexts &&
		req.body.clickedSuggestionNumber
	) {
		res.sendStatus(200);
	}else {
		res.sendStatus(422);
	}
});
export default router;
