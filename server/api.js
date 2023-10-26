import { Router } from "express";
import logger from "./utils/logger";
import db from "./db";
import authRouter from "./auth/routes/auth";
import multer from "multer";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.use("/auth", authRouter);

// Obtain random sentence
router.get("/sentences/random", async (_, res) => {
	try {
		// Select a random sentence from sentences table
		const oneRow = await db.query(
			"SELECT id, sentence FROM sentences ORDER BY random() LIMIT 1"
		);
		const randomSentence = oneRow.rows[0].sentence;
		const randomSentenceId = oneRow.rows[0].id;
		// Send randomSentence to frontend;
		res.status(200).json({ sentence: randomSentence, id: randomSentenceId });
	} catch (error) {
		logger.error("%0", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

// Submit user interaction information
router.post("/user_interactions", async (req, res) => {
	const body = req.body;

	const sentence = body.sentence;
	const suggestions = body.suggestions;
	const type = body.type;

	const selectedSuggestion = body.selected_suggestion;
	const userSuggestion = body.user_suggestion;

	const sentenceId = sentence ? sentence.id : null;

	const userID = req.user ? req.user.id : "0";
	try {
		// Variable to store selected suggestion id
		let selectedSuggestionId = null;
		// data validation
		if (sentenceId && suggestions && type) {
			// Insert the suggestions into the suggestions table
			for (const suggestion of suggestions) {
				await db.query(
					"INSERT INTO suggestions (sentence_id, suggestion) VALUES ($1, $2) ON CONFLICT DO NOTHING",
					[sentenceId, suggestion]
				);
			}
			const suggestionSearch = await db.query(
				"SELECT id FROM suggestions WHERE sentence_id = $1 AND suggestion = $2 LIMIT 1",
				[sentenceId, selectedSuggestion]
			);
			if (suggestionSearch.rows[0]) {
				selectedSuggestionId = suggestionSearch.rows[0].id;
			}

			if (type === "user" && userSuggestion) {
				await db.query(
					"INSERT INTO user_interactions (sentence_id, type, user_provided_suggestion, user_google_id) VALUES ($1, $2, $3, $4)",
					[sentenceId, type, userSuggestion, userID]
				);
			} else if (type === "original") {
				await db.query(
					"INSERT INTO user_interactions (sentence_id, type, user_google_id) VALUES ($1, $2, $3)",
					[sentenceId, type, userID]
				);
			} else if (type === "none") {
				await db.query(
					"INSERT INTO user_interactions (sentence_id, type, user_google_id) VALUES ($1, $2, $3)",
					[sentenceId, type, userID]
				);
			} else if (type === "suggestion" && selectedSuggestionId) {
				await db.query(
					"INSERT INTO user_interactions (sentence_id, type, selected_suggestion, user_google_id) VALUES ($1, $2, $3, $4)",
					[sentenceId, type, selectedSuggestionId, userID]
				);
			} else {
				res.status(422).json({
					success: false,
					message: "Missing user interaction data in input",
				});
				return;
			}
			res
				.status(201)
				.json({ success: true, message: "Suggestions saved successfully" });
		} else {
			res.status(422).json({
				success: false,
				message: "Missing sentence and suggestion information in input",
			});
		}
	} catch (error) {
		logger.error("%0", error);
		res.status(500).json({
			success: false,
			message: "An error occurred while saving suggestions",
		});
	}
});

// Export database to file
router.get("/sentences/export", async (req, res) => {
	try {
		if (req.user && req.user.permissions && req.user.permissions.isAdmin) {
			const querySentences = "SELECT * FROM sentences";
			const querySuggestions = "SELECT * FROM suggestions";
			const queryUser_interactions = "SELECT * FROM user_interactions";

			const data = {};

			const gaelicSentences = await db.query(querySentences);
			const gaelicSuggestions = await db.query(querySuggestions);
			const gaelicUser_interactions = await db.query(queryUser_interactions);

			data.sentences = gaelicSentences.rows;
			data.suggestions = gaelicSuggestions.rows;
			data.user_interactions = gaelicUser_interactions.rows;

			res.set({
				"Content-Type": "application/json",
				"Content-Disposition": 'attachment; filename="exportData.json"',
			});

			//Send the file as a response for download
			res.status(200).json(data);
		} else {
			res.status(401).json({ success: false, message: "Unauthorized" });
		}
	} catch (error) {
		logger.error("%0", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

// Upload sentence information
// Note: not an AJAX call, relies on redirects
router.post("/sentences/upload", upload.single("file"), async (req, res) => {
	try {
		if (req.user && req.user.permissions && req.user.permissions.isAdmin) {
			const fileContent = req.file.buffer.toString();
			const fileName = req.file.originalname;
			const sentencesArray = fileContent.split(/(?<=[.?!\n])/);
			for (let i = 0; i < sentencesArray.length; i++) {
				if (sentencesArray[i].trim().length > 0) {
					await db.query(
						"INSERT INTO sentences(sentence, source, count) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
						[sentencesArray[i].trim(), fileName, i]
					);
				}
			}
			res.redirect("/admin?message=Successful%20upload");
		} else {
			res.redirect("/admin?fail=Unauthorized");
		}
	} catch (error) {
		res.redirect("/admin?fail=Internal%20Server%20Error");
	}
});

export default router;
