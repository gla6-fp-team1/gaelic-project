import { Router } from "express";
import logger from "./utils/logger";
import db from "./db";
import authRouter from "./auth/routes/auth";

const router = Router();

router.use("/auth", authRouter);

router.get("/", async (_, res) => {
	logger.debug("Welcoming everyone...");

	const getRandomIndex = (length) => {
		return Math.floor(Math.random() * length);
	};
	// Select sentences from sentences table
	const sentences = await db.query("SELECT sentence FROM sentences");
	const randomSentences = [];
	for (let sentence of sentences.rows) {
		randomSentences.push(sentence.sentence);
	}
	// const randomSentence = sentences.rows[getRandomIndex(sentences.rows.length)];
	res.json(randomSentences[getRandomIndex(randomSentences.length)]);
});
router.post("/save-suggestions", async (req, res) => {
	const gaelicData = req.body;
	const sentence = gaelicData.sentence;
	const suggestions = gaelicData.suggestions;
	const userSuggestion = gaelicData.userSuggestion;
	const originalSentenceWasCorrect = gaelicData.originalSentenceWasCorrect;
	const selectedSuggestion = gaelicData.selectedSuggestion;
    const userID = gaelicData.userID;


	try {
		if (sentence && suggestions) {
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
			if (userSuggestion && userID) {
				// Insert user suggestion to user_interactions table
				await db.query(
					"INSERT INTO user_interactions (sentence_id, user_provided_suggestion, user_google_id) VALUES ($1, $2, $3)",
					[sentenceId, userSuggestion, userID]
				);
			} else if (originalSentenceWasCorrect && userID) {
				// Insert originalSentenceWasCorrect into user_interactions table
				await db.query(
					"INSERT INTO user_interactions (sentence_id, original_sentence_was_correct, user_google_id) VALUES ($1, $2, $3)",
					[sentenceId, originalSentenceWasCorrect == "Correct", userID]
				);
			} else if (selectedSuggestion && userID) {
				// Insert selectedSuggestion into user_interactions table
				await db.query(
					"INSERT INTO user_interactions (sentence_id, selected_suggestion, user_google_id) VALUES ($1, $2, $3)",
					[sentenceId, selectedSuggestion, userID ]
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
		const jsonData = JSON.stringify(data.null, 0);

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
router.post("/save-adminGoogleID", async (request, response) => {
	const adminGoogleId = request.body;
	try {
		await db.query("INSERT INTO admin (admin_google_id) VALUES ($1)", [
			adminGoogleId.admin_google_id,
		]);

		response.json({ message: "Data inserted successfully" });
	} catch (error) {
		response.status(500).json({ error: "Internal server error" });
	}
});
router.get("/adminGoogleID", async (_, res) => {
	try {
		const queryGoogleID = "SELECT *FROM admin";
		const result = await db.query(queryGoogleID);
		const arrayOfGoogleID = result.rows;
		res.json({ arrayOfGoogleID });
	} catch (error) {
		res.status(500).send("Internal server error");
	}
});

export default router;
