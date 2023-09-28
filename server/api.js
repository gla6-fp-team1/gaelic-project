import { Router } from "express";
import logger from "./utils/logger";
import db from "./db";

const router = Router();

router.get("/", (_, res) => {
	logger.debug("Welcoming everyone...");
	const text = [
		"Bhiodh iad a' dèanamh móran uisge-bheatha bho chionn fhada ro n a latha againn.",
		"Tha iad ris an Gearrloch fhathast.",
		"Well, chuala mi gun robh iad ris an Gearrloch a sin.",
		"Bha iad a' faicinn bòcan shios ann an Arasaig.",
		"agus 's e a'chiad rud a bha iad a' faicinn dhe'n rud colainn gun cheann a' falbh feadh siod.",
		"agus bha bodach a' fuireach ann a' sabhall.",
		"Chuir iad duine ann a' sabhall a dh' fhuireach oidhche.",
		"agus chunnaic e am bòcan a bha seo agus an bòcan bhitheadh aige.",
		"agus tha obair uamhasach aige mun d' fhuair e am bòcan a chumail bhuaidh.",
		"agus bha coltas air gun deànadh am bòcan an gróthach air.",
		"Cha robh buille a bhuaileadh e air nach robh e a' smaoineach' gur h- ann air póca cloìmh leis cho bog 's a bha a' bhuille is cha robh i a' dèanadh feum.",
	];
	const getRandomIndex = (length) => {
		return Math.floor(Math.random() * length);
	};
	res.json(text[getRandomIndex(text.length)]);
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
