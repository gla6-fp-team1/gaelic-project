import { Router } from "express";
import logger from "./utils/logger";
import db from "./db";

const router = Router();

router.get("/", (_, res) => {
	logger.debug("Welcoming everyone...");
	res.json({ message: "Hello, Gaelic Project!" });
});

router.post("/save-suggestions", async (req, res) => {
	const { sentence, suggestions } = req.body;

	try {
		// Insert the sentence into the sentences table
		const sentenceResult = await db.query(
			"INSERT INTO sentences (sentence) VALUES ($1) RETURNING id",
			[sentence]
		);
		const sentenceId = sentenceResult.rows[0].id;

		// Insert the suggestions into the suggestions table
		for (const suggestion of suggestions) {
			await db.query(
				"INSERT INTO suggestions (sentence_id, suggestion) VALUES ($1, $2)",
				[sentenceId, suggestion]
			);
		}

		res.status(201).json({ message: "Suggestions saved successfully" });
	} catch (error) {
		logger.error("%O", error);
		res
			.status(500)
			.json({ message: "An error occurred while saving suggestions" });
	}
});

export default router;
