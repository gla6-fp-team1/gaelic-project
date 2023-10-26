import { Router } from "express";
import logger from "./utils/logger";
import db from "./db";
import authRouter from "./auth/routes/auth";
import multer from "multer";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function getCurrentUserData(req) {
	const userGoogleID = req.user ? req.user.id : "0";
	const queryGoogleID = `SELECT COUNT(*) FROM admin WHERE admin_google_id = '${userGoogleID}'`;
	const result = await db.query(queryGoogleID);
	const isAdmin = result.rows[0].count > 0;

	return {
		id: userGoogleID,
		isAdmin: isAdmin,
	};
}

router.use("/auth", authRouter);

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
		res.status(500).json({ message: "Internal Server Error" });
	}
});

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
		let selectedSuggestionId;
		// data validation
		if (sentenceId && suggestions && type) {
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
			if (type === "user_provided_suggestion" && userSuggestion) {
				// Insert user suggestion to user_interactions table
				await db.query(
					"INSERT INTO user_interactions (sentence_id, user_provided_suggestion, user_google_id) VALUES ($1, $2, $3)",
					[sentenceId, userSuggestion, userID]
				);
			} else if (type === "original_sentence_was_correct") {
				// Insert originalSentenceWasCorrect into user_interactions table
				await db.query(
					"INSERT INTO user_interactions (sentence_id, original_sentence_was_correct, user_google_id) VALUES ($1, $2, $3)",
					[sentenceId, true, userID]
				);
			} else if (type === "suggestion_selected" && selectedSuggestionId) {
				// Insert selectedSuggestion into user_interactions table
				await db.query(
					"INSERT INTO user_interactions (sentence_id, selected_suggestion, user_google_id) VALUES ($1, $2, $3)",
					[sentenceId, selectedSuggestionId, userID]
				);
			} else {
				res.status(422).json({ message: "Unprocessable Entry" });
				return;
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

router.get("/sentences/export", async (req, res) => {
	try {
		const userData = await getCurrentUserData(req);
		if (userData.isAdmin) {
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
			res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		logger.error("%0", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.get("/users/current", async (req, res) => {
	try {
		const userData = await getCurrentUserData(req);
		res.status(200).json({
			id: userData.id,
			is_admin: userData.isAdmin,
		});
	} catch (error) {
		logger.error("%0", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.post("/sentences/upload", upload.single("file"), async (req, res) => {
	try {
		const userData = await getCurrentUserData(req);
		if (userData.isAdmin) {
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
		} else {
			res.status(401).json({ message: "Unauthorized" });
		}
	} catch (error) {
		logger.error("%0", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

export default router;
