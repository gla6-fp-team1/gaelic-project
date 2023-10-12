import { Router } from "express";
import logger from "./utils/logger";
import db from "./db";



const router = Router();

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
//Mele
router.post("/save-suggestions",async (req, res) =>{
const gaelicData = req.body;
const sentence = gaelicData.sentence;
const suggestions = gaelicData.suggestions;
const userSuggestion = gaelicData.userSuggestion;
const originalSentenceWasCorrect = gaelicData.originalSentenceWasCorrect;
const selectedSuggestion = gaelicData.selectedSuggestion;
try {

if (sentence && suggestions && userSuggestion) {
// ...
// Insert the sentence into the sentences table
const sentenceResult = await db.query(
"INSERT INTO sentences (sentence) VALUES ($1) RETURNING id",
[sentence]
);
const sentenceId = sentenceResult.rows[0].id;

// Insert the suggestions into the suggestions table
const insertSuggestionQuery = "INSERT INTO suggestions (sentence_id, suggestion) VALUES ($1, $2)";
//console.log(suggestions);
const suggestionInsertPromises = suggestions.map(async (suggestion) => {
try {
await db.query(insertSuggestionQuery, [sentenceId, suggestion]);
} catch (error) {
logger.error("%O", error);
}
});
// Wait for all suggestion insertions to complete
await Promise.all(suggestionInsertPromises);

// Insert user suggestion to user_interactions table
await db.query(
"INSERT INTO user_interactions (sentence_id, user_provided_suggestion) VALUES ($1, $2)",
[sentenceId, userSuggestion]
);

} else if (sentence && suggestions && originalSentenceWasCorrect) {
// ...
// Insert the sentence into the sentences table
const sentenceResult = await db.query(
"INSERT INTO sentences (sentence) VALUES ($1) RETURNING id",
[sentence]
);
const sentenceId = sentenceResult.rows[0].id;

// Insert the suggestions into the suggestions table
const insertSuggestionQuery = "INSERT INTO suggestions (sentence_id, suggestion) VALUES ($1, $2)";
const suggestionInsertPromises = suggestions.map(async (suggestion) => {
try {
await db.query(insertSuggestionQuery, [sentenceId, suggestion]);
} catch (error) {
logger.error("%O", error);
}
});
// Wait for all suggestion insertions to complete
await Promise.all(suggestionInsertPromises);

// Insert originalSentenceWasCorrect into user_interactions table
await db.query(
"INSERT INTO user_interactions (sentence_id, original_sentence_was_correct) VALUES ($1, $2)",
[sentenceId, originalSentenceWasCorrect]
);
} else if (sentence && suggestions && selectedSuggestion) {
	// Insert the sentence into the sentences table
const sentenceResult = await db.query(
	"INSERT INTO sentences (sentence) VALUES ($1) RETURNING id",
	[sentence]
	);
	const sentenceId = sentenceResult.rows[0].id;

	// Insert the suggestions into the suggestions table
	const insertSuggestionQuery = "INSERT INTO suggestions (sentence_id, suggestion) VALUES ($1, $2)";

	const suggestionInsertPromises = suggestions.map(async (suggestion) => {
	try {
	await db.query(insertSuggestionQuery, [sentenceId, suggestion]);
	} catch (error) {
	logger.error("%O", error);
	}
	});
	// Wait for all suggestion insertions to complete
	await Promise.all(suggestionInsertPromises);

	// Insert selectedSuggestion into user_interactions table
	await db.query(
	"INSERT INTO user_interactions (sentence_id, selected_suggestion) VALUES ($1, $2)",
	[sentenceId, selectedSuggestion]
	);

}else {
	res.status(422).json({ message: "Unprocessable Entry" });
}
} catch (error){
	logger.error("%0", error);
	res.status(500).json( { message: "An error occurred while saving suggestions" });
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
