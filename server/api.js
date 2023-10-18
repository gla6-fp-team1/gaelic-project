import { Router } from "express";
import logger from "./utils/logger";
import db from "./db";
import authRouter from "./auth/routes/auth";

const router = Router();

router.use("/auth", authRouter);

router.get("/", async (_, res) => {
	logger.debug("Welcoming everyone...");

	// Select a random sentence from sentences table
	const oneRow = await db.query(
		"SELECT id, sentence FROM sentences ORDER BY random() LIMIT 1"
	);
	const randomSentence = oneRow.rows[0].sentence;
	const randomSentenceId = oneRow.rows[0].id;
	// Send randomSentence to frontend;
	res.json([randomSentence, randomSentenceId]);
});
router.post("/save-suggestions", async (req, res) => {
	const gaelicData = req.body;
	const sentence = gaelicData.sentence;
	const sentenceId = gaelicData.sentenceId;
	const suggestions = gaelicData.suggestions;
	const userSuggestion = gaelicData.userSuggestion;
	const originalSentenceWasCorrect = gaelicData.originalSentenceWasCorrect;
	const selectedSuggestion = gaelicData.selectedSuggestion;
	try {
		// Variable to store selected suggestion id
		let selectedSuggestionId;
        // data validation
		if (sentence && suggestions) {
			// Insert the suggestions into the suggestions table
			for (const suggestion of suggestions) {
				const insertSuggestions = await db.query(
					"INSERT INTO suggestions (sentence_id, suggestion) VALUES ($1, $2) RETURNING id, suggestion",
					[sentenceId, suggestion]
				);
				if (insertSuggestions.rows[0].suggestion === selectedSuggestion) {
					selectedSuggestionId= insertSuggestions.rows[0].id;
				}
			}
			if (userSuggestion) {
				// Insert user suggestion to user_interactions table
				await db.query(
					"INSERT INTO user_interactions (sentence_id, user_provided_suggestion) VALUES ($1, $2)",
					[sentenceId, userSuggestion]
				);
			} else if (originalSentenceWasCorrect) {
				// Insert originalSentenceWasCorrect into user_interactions table
				await db.query(
					"INSERT INTO user_interactions (sentence_id, original_sentence_was_correct) VALUES ($1, $2)",
					[sentenceId, originalSentenceWasCorrect == "Correct"]
				);
		} else if (selectedSuggestion) {
				// Insert selectedSuggestion ID into user_interactions table
				await db.query(
					"INSERT INTO user_interactions (sentence_id, selected_suggestion) VALUES ($1, $2)",
					[sentenceId, selectedSuggestionId]
				);
			}

			res.status(201).json({ message: "Suggestions saved successfully" });
		} else {
			res.status(422).json({ message: "Unprocessable Entry" });
		}
	} catch (error) {
		logger.error("%0", error);
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
		const jsonData = JSON.stringify(data. null, 0);

		res.set({
			"Content-Type": "application/json",
			"Content-Disposition": 'attachment; filename="exportData.json"',
		});
		// Send the file as a response for download
		res.send(jsonData);
	} catch (error) {
		res.status(500).send("Internal server error");
	}
});
export default router;
