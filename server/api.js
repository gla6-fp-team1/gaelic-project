import { Router } from "express";
import authRouter from "./auth/routes/auth"
import logger from "./utils/logger";
import db from "./db";

const router = Router();

router.use("/auth", authRouter);

router.get("/", async(_, res) => {
	logger.debug("Welcoming everyone...");

	const getRandomIndex = (length) => {
		return Math.floor(Math.random() * length);
	};
	// Select sentences from sentences table
	const sentences = await db.query(
		"SELECT sentence FROM sentences"
	);
	const randomSentences = [];
	for (let sentence of sentences.rows) {
		randomSentences.push(sentence.sentence);
	}
	// const randomSentence = sentences.rows[getRandomIndex(sentences.rows.length)];
	res.json(randomSentences[getRandomIndex(randomSentences.length)]);
});

router.post("/save-suggestions", async (req, res) => {
	const { sentence, suggestions, selectedSuggestion } = req.body;

	try {
		// Check if all data exist in req.body
		if (sentence && suggestions && selectedSuggestion) {
			// Select id from sentences table
			const sentenceResult = await db.query(
				"SELECT id FROM sentences WHERE sentence = $1",
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
			// for (const suggestion of suggestions) {
			// }
			// Insert selected suggestion to user_interactions table
			await db.query(
				"INSERT INTO user_interactions (sentence_id, selected_suggestion) VALUES ($1, $2)",
				[sentenceId, selectedSuggestion]
			);

			res.status(201).json({ message: "Suggestions saved successfully" });
		} else {
			res.status(422).json({ message: "Unprocessable Entry" });
		}
	} catch (error) {
		logger.error("%O", error);
		res
			.status(500)
			.json({ message: "An error occurred while saving suggestions" });
	}
});

router.get("/exportGaelicData", async (_, res) => {
	try {
		const querySentences = "SELECT * FROM sentences";
		const querySuggestions = "SELECT * FROM suggestions";
		const queryUser_interactions = "SELECT * FROM user_interactions";
		const data = {};
		const gaelicSentences = await db.query(querySentences);
		const gaelicSuggestions = await db.query(querySuggestions);
		const gaelicUser_interactions = await db.query(queryUser_interactions);
		data.Sentences = gaelicSentences.rows;
		data.Suggestions = gaelicSuggestions.rows;
		data.User_interactions = gaelicUser_interactions.rows;
		const jsonData = JSON.stringify(data, null, 2);

		res.set({
			"Content-Type": "application/json","Content-Disposition":'attachment; filename="exportData.json"',
		});
		// Send the file as a response for download
		res.send(jsonData);
	} catch (error) {
		res.status(500).send("Internal server error");
	}
});
export default router;
