import { Router } from "express";
import logger from "./utils/logger";
import db from "./db";
import authRouter from "./auth/routes/auth";
import multer from "multer";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
	res.json({ sentence: randomSentence, id: randomSentenceId });
});
router.post("/save-suggestions", async (req, res) => {
	const gaelicData = req.body;
	const sentenceId = gaelicData.sentenceId;
	const suggestions = gaelicData.suggestions;
	const userSuggestion = gaelicData.userSuggestion;
	const originalSentenceWasCorrect = gaelicData.originalSentenceWasCorrect;
	const selectedSuggestion = gaelicData.selectedSuggestion;
	const userID = req.user ? req.user.id : "0";
	try {
		// Variable to store selected suggestion id
		let selectedSuggestionId;
		// data validation
		if (sentenceId && suggestions) {
			// Insert the suggestions into the suggestions table
			for (const suggestion of suggestions) {
				const insertSuggestions = await db.query(
					"INSERT INTO suggestions (sentence_id, suggestion) VALUES ($1, $2) RETURNING id, suggestion",
					[sentenceId, suggestion]
				);
				if (insertSuggestions.rows[0].suggestion === selectedSuggestion) {
					selectedSuggestionId = insertSuggestions.rows[0].id;
				}
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
			} else if (selectedSuggestionId && userID) {
				// Insert selectedSuggestion into user_interactions table
				await db.query(
					"INSERT INTO user_interactions (sentence_id, selected_suggestion, user_google_id) VALUES ($1, $2, $3)",
					[sentenceId, selectedSuggestionId, userID]
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

router.get("/exportGaelicData", async (req, res) => {
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
		const jsonData = JSON.stringify(data, null, 0);
		res.set({
			"Content-Type": "application/json",
			"Content-Disposition": 'attachment; filename="exportData.json"',
		});
		//Send the file as a response for download
		res.send(jsonData);
	} catch (error) {
		res.status(500).send("Internal server error");
	}
});
router.get("/getUser", async (req, res) => {
	try {
		const userGoogleID = req.user.id;

		const queryGoogleID = `SELECT COUNT(*) FROM admin WHERE admin_google_id = '${userGoogleID}'`;

		const result = await db.query(queryGoogleID);

		const isAdmin = result.rows[0].count > 0;
		res.send(isAdmin);
	} catch (error) {
		res.status(500).send("Internal server error");
	}
});

router.post("/saveFile", upload.single("file"), async (req, res) => {
	try {
		const fileContent = req.file.buffer.toString();
		const fileName = req.file.originalname;
		const sentencesArray = fileContent.split(".");
		for (let i = 0; i < sentencesArray.length; i++) {
			if (sentencesArray[i].trim().length > 0) {
				await db.query(
					"INSERT INTO sentences(sentence, source, count) VALUES ($1, $2, $3)",
					[sentencesArray[i].trim(), fileName, i]
				);
			}
		}
		res.redirect("/");
	} catch (error) {
		logger.error("%0", error);
		res.status(500).json({ message: "An error occurred while saving a file" });
	}
});

export default router;
