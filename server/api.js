import { Router } from "express";
import logger from "./utils/logger";
import db from "./db";
import authRouter from "./auth/routes/auth";
import multer from "multer";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const ITEMS_PER_PAGE = 25;

router.use("/auth", authRouter);

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
			if (type === "suggestion") {
				const suggestionSearch = await db.query(
					"SELECT id FROM suggestions WHERE sentence_id = $1 AND suggestion = $2 LIMIT 1",
					[sentenceId, selectedSuggestion]
				);
				if (suggestionSearch.rows[0]) {
					selectedSuggestionId = suggestionSearch.rows[0].id;
				}
			}

			if (type === "user" && userSuggestion) {
				await db.query(
					"INSERT INTO user_interactions (sentence_id, type, user_suggestion, user_id) VALUES ($1, $2, $3, $4)",
					[sentenceId, type, userSuggestion, userID]
				);
			} else if (type === "original") {
				await db.query(
					"INSERT INTO user_interactions (sentence_id, type, user_id) VALUES ($1, $2, $3)",
					[sentenceId, type, userID]
				);
			} else if (type === "none") {
				await db.query(
					"INSERT INTO user_interactions (sentence_id, type, user_id) VALUES ($1, $2, $3)",
					[sentenceId, type, userID]
				);
			} else if (type === "suggestion" && selectedSuggestionId) {
				await db.query(
					"INSERT INTO user_interactions (sentence_id, type, suggestion_id, user_id) VALUES ($1, $2, $3, $4)",
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

// List of sentences
router.get("/sentences", async (req, res) => {
	try {
		if (req.user && req.user.permissions && req.user.permissions.isAdmin) {
			const page = parseInt(req.query.page) || 0;
			const sentences = await db.query(
				"SELECT * FROM sentences ORDER BY id ASC LIMIT $1 OFFSET $2",
				[ITEMS_PER_PAGE, page * ITEMS_PER_PAGE]
			);
			const count = await db.query("SELECT COUNT(*) FROM sentences");
			res.status(200).json({
				success: true,
				total: parseInt(count.rows[0].count),
				page_size: ITEMS_PER_PAGE,
				data: sentences.rows,
			});
		} else {
			res.status(401).json({ success: false, message: "Unauthorized" });
		}
	} catch (error) {
		logger.error("%0", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

// Obtain random sentence
router.get("/sentences/random", async (_, res) => {
	try {
		// Select a random sentence from sentences table
		const oneRow = await db.query(
			"SELECT id, sentence FROM sentences ORDER BY random() LIMIT 1"
		);
		if (oneRow.rows[0]) {
			res.status(200).json({ success: true, data: oneRow.rows[0] });
		} else {
			res.status(404).json({
				success: false,
				message: "No sentence information in database",
			});
		}
	} catch (error) {
		logger.error("%0", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
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

router.get("/sentences/:id", async (req, res) => {
	try {
		if (req.user && req.user.permissions && req.user.permissions.isAdmin) {
			const sentenceId = parseInt(req.params.id) || 0;

			const sentence = await db.query("SELECT * FROM sentences where id = $1", [
				sentenceId,
			]);
			if (sentence.rows[0]) {
				const suggestions = await db.query(
					"SELECT suggestion, COUNT(*) FROM user_interactions JOIN suggestions ON user_interactions.suggestion_id = suggestions.id WHERE user_interactions.sentence_id = $1 AND user_id != '0' GROUP BY suggestion ORDER by suggestion",
					[sentenceId]
				);

				const types = await db.query(
					"SELECT type, COUNT(*) from user_interactions WHERE sentence_id = $1 AND user_id != '0' GROUP BY type ORDER by type",
					[sentenceId]
				);

				const suggestionsAnonymous = await db.query(
					"SELECT suggestion, COUNT(*) FROM user_interactions JOIN suggestions ON user_interactions.suggestion_id = suggestions.id WHERE user_interactions.sentence_id = $1 and user_id = '0' GROUP BY suggestion ORDER by suggestion",
					[sentenceId]
				);

				const typesAnonymous = await db.query(
					"SELECT type, COUNT(*) from user_interactions WHERE sentence_id = $1 and user_id = '0' GROUP BY type ORDER by type",
					[sentenceId]
				);

				const sentenceData = sentence.rows[0];
				sentenceData.stats = {
					logged: {
						suggestions: suggestions.rows,
						types: types.rows,
					},
					anonymous: {
						suggestions: suggestionsAnonymous.rows,
						types: typesAnonymous.rows,
					},
				};

				res.status(200).json({
					success: true,
					data: sentenceData,
				});
			} else {
				res.status(404).json({
					success: false,
					message: "Sentence doesn't exist",
				});
			}
		} else {
			res.status(401).json({ success: false, message: "Unauthorized" });
		}
	} catch (error) {
		logger.error("%0", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

router.get("/sentences/:id/user_suggestions", async (req, res) => {
	try {
		if (req.user && req.user.permissions && req.user.permissions.isAdmin) {
			const sentenceId = parseInt(req.params.id) || 0;
			const page = parseInt(req.query.page) || 0;

			const result = await db.query(
				"SELECT id, CASE WHEN user_id = '0' THEN 'Anonymous' ELSE 'Logged In' END user_type, user_suggestion FROM user_interactions where sentence_id = $1 and type = $2 ORDER by id LIMIT $3 OFFSET $4",
				[sentenceId, "user", ITEMS_PER_PAGE, page]
			);

			const count = await db.query(
				"SELECT COUNT(*) FROM user_interactions where sentence_id = $1 and type = $2",
				[sentenceId, "user"]
			);

			res.status(200).json({
				success: true,
				total: parseInt(count.rows[0].count),
				page_size: ITEMS_PER_PAGE,
				data: result.rows,
			});
		} else {
			res.status(401).json({ success: false, message: "Unauthorized" });
		}
	} catch (error) {
		logger.error("%0", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
});

export default router;
