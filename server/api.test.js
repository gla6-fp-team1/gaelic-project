import request from "supertest";
import app from "./app";
import db from "./db";
import mockLogin from "../test/mock-login";

const ADMIN_USER_ID = "117060750196714169595";
const REGULAR_USER_ID = "1";
let loginUserId = REGULAR_USER_ID;
mockLogin(app, () => loginUserId);

describe("/api", () => {
	let response = null;

	const unauthenticatedTests = () => {
		describe("Non-admin user", () => {
			beforeAll(() => {
				loginUserId = REGULAR_USER_ID;
			});

			test("It returns an unauthorized error", () => {
				expect(response.statusCode).toBe(401);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized");
			});

			afterAll(() => {
				loginUserId = ADMIN_USER_ID;
			});
		});

		describe("Anonymous user", () => {
			beforeAll(() => {
				loginUserId = null;
			});

			test("It returns an unauthorized error", () => {
				expect(response.statusCode).toBe(401);
				expect(response.body.success).toBe(false);
				expect(response.body.message).toBe("Unauthorized");
			});

			afterAll(() => {
				loginUserId = ADMIN_USER_ID;
			});
		});
	};

	const successfulResponse = (hasMessage) => {
		test("It should return a successful response", () => {
			expect(response.statusCode).toBe(200);

			if (hasMessage) {
				expect(response.body.success).toBe(true);
			}
		});
	};

	const generateSuggestion = async () => {
		let result = await db.query(
			"INSERT INTO suggestions (sentence_id, suggestion) VALUES (1, 'Suggestion') RETURNING id"
		);
		return result.rows[0].id;
	};

	const generateUserInteraction = async (user, type, extraParameter) => {
		if (type === "user") {
			await db.query(
				"INSERT INTO user_interactions (user_id, sentence_id, type, user_suggestion) VALUES ($1,1,$2,$3)",
				[user, type, extraParameter]
			);
		} else if (type === "suggestion") {
			await db.query(
				"INSERT INTO user_interactions (user_id, sentence_id, type, suggestion_id) VALUES ($1,1,$2,$3)",
				[user, type, extraParameter]
			);
		} else {
			await db.query(
				"INSERT INTO user_interactions (user_id, sentence_id, type) VALUES ($1,1,$2)",
				[user, type]
			);
		}
	};

	describe("/sentences", () => {
		describe("/random", () => {
			describe("GET", () => {
				beforeEach(async () => {
					response = await request(app).get("/api/sentences/random");
				});

				test("It should return a non-empty sentence data", () => {
					expect(response.body.data.id).toBeGreaterThanOrEqual(1);
					expect(response.body.data.id).toBeLessThanOrEqual(11);
					expect(response.body.data.sentence).toMatch(/.?/);
				});
			});

			describe("Empty database", () => {
				beforeEach(async () => {
					await db.query("DELETE FROM sentences");
					response = await request(app).get("/api/sentences/random");
				});

				test("It returns a 404 response", () => {
					expect(response.statusCode).toBe(404);
				});
			});
		});

		describe("/export", () => {
			describe("GET", () => {
				beforeAll(() => {
					loginUserId = ADMIN_USER_ID;
				});

				beforeEach(async () => {
					await generateSuggestion();
					await generateUserInteraction("1", "user", "User Suggestion");

					let agent = request.agent(app);
					if (loginUserId) {
						await agent.get("/api/mock/login");
					}
					response = await agent.get("/api/sentences/export");
				});

				successfulResponse(false);

				test("It should return the database in the export", () => {
					expect(response.body.sentences.length).toBe(11);
					expect(response.body.sentences[0].id).toBe(1);
					expect(response.body.sentences[0].sentence).toBe(
						"Bhiodh iad a' dèanamh móran uisge-bheatha bho chionn fhada ro n a latha againn."
					);

					expect(response.body.suggestions.length).toBe(1);
					expect(response.body.suggestions[0].sentence_id).toBe(1);
					expect(response.body.suggestions[0].suggestion).toBe("Suggestion");

					expect(response.body.user_interactions.length).toBe(1);
					expect(response.body.user_interactions[0].sentence_id).toBe(1);
					expect(response.body.user_interactions[0].type).toBe("user");
					expect(response.body.user_interactions[0].user_suggestion).toBe(
						"User Suggestion"
					);
					expect(response.body.user_interactions[0].user_id).toBe("1");
				});

				unauthenticatedTests();
			});
		});

		describe("/upload", () => {
			describe("POST", () => {
				let inputData = "Test Input";

				beforeAll(() => {
					loginUserId = ADMIN_USER_ID;
				});

				beforeEach(async () => {
					const buffer = Buffer.from(inputData);

					let agent = request.agent(app);
					if (loginUserId) {
						await agent.get("/api/mock/login");
					}
					response = await agent
						.post("/api/sentences/upload")
						.attach("file", buffer, "filename.txt");
				});

				test("It should return a successful response through redirection", () => {
					expect(response.statusCode).toBe(302);

					expect(response.headers.location).toBe(
						"/admin?message=Successful%20upload"
					);
				});

				test("It should upload a new sentence", async () => {
					let latestSentence = await db.query(
						"SELECT * FROM sentences ORDER BY id DESC LIMIT 1"
					);

					expect(latestSentence.rows[0].sentence).toBe("Test Input");
					expect(latestSentence.rows[0].source).toBe("filename.txt");
					expect(latestSentence.rows[0].count).toBe(0);
				});

				describe("Sentence splitting", () => {
					beforeAll(() => {
						inputData = "Input 1. Input 2! Input 3\nInput 4? Input 5.";
					});

					test("It splits the example into 5 sentences", async () => {
						let sentences = await db.query(
							"SELECT * FROM sentences ORDER BY id DESC LIMIT 5"
						);
						expect(sentences.rows[0].sentence).toBe("Input 5.");
						expect(sentences.rows[1].sentence).toBe("Input 4?");
						expect(sentences.rows[2].sentence).toBe("Input 3");
						expect(sentences.rows[3].sentence).toBe("Input 2!");
						expect(sentences.rows[4].sentence).toBe("Input 1.");
					});
				});

				describe("Duplicate skipping", () => {
					beforeAll(() => {
						inputData = "Input 1. Input 1. Input 1.";
					});

					test("It splits the example into only a single sentence", async () => {
						let sentences = await db.query(
							"SELECT * FROM sentences ORDER BY id DESC LIMIT 2"
						);
						expect(sentences.rows[0].sentence).toBe("Input 1.");
						expect(sentences.rows[1].sentence).not.toBe("Input 1.");
					});
				});

				describe("Non-admin user", () => {
					beforeAll(() => {
						loginUserId = REGULAR_USER_ID;
					});

					test("It returns an unauthorized error through redirection", () => {
						expect(response.statusCode).toBe(302);
						expect(response.headers.location).toBe("/admin?fail=Unauthorized");
					});

					afterAll(() => {
						loginUserId = ADMIN_USER_ID;
					});
				});

				describe("Anonymous user", () => {
					beforeAll(() => {
						loginUserId = null;
					});

					test("It returns an unauthorized error through redirection", () => {
						expect(response.statusCode).toBe(302);
						expect(response.headers.location).toBe("/admin?fail=Unauthorized");
					});

					afterAll(() => {
						loginUserId = ADMIN_USER_ID;
					});
				});
			});
		});

		describe("/:id", () => {
			describe("/user_suggestions", () => {
				describe("GET", () => {
					beforeEach(async () => {
						await generateUserInteraction("1", "user", "User Suggestion 1");
						await generateUserInteraction("0", "user", "User Suggestion 2");

						let agent = request.agent(app);
						if (loginUserId) {
							await agent.get("/api/mock/login");
						}
						response = await agent.get("/api/sentences/1/user_suggestions");
					});

					successfulResponse(true);

					test("it returns the user provided suggestions", () => {
						expect(response.body.total).toBe(2);
						expect(response.body.page_size).toBe(25);
						expect(response.body.data[0].user_type).toBe("Logged In");
						expect(response.body.data[0].user_suggestion).toBe(
							"User Suggestion 1"
						);

						expect(response.body.data[1].user_type).toBe("Anonymous");
						expect(response.body.data[1].user_suggestion).toBe(
							"User Suggestion 2"
						);
					});

					unauthenticatedTests();
				});
			});

			describe("GET", () => {
				let sentenceId = 1;

				beforeEach(async () => {
					let suggestion = await generateSuggestion();

					await generateUserInteraction("1", "user", "User Suggestion");
					await generateUserInteraction("1", "suggestion", suggestion);
					await generateUserInteraction("1", "none");

					await generateUserInteraction("0", "user", "User Suggestion");
					await generateUserInteraction("0", "suggestion", suggestion);
					await generateUserInteraction("0", "original");

					let agent = request.agent(app);
					if (loginUserId) {
						await agent.get("/api/mock/login");
					}
					response = await agent.get(`/api/sentences/${sentenceId}`);
				});

				successfulResponse(true);

				test("it returns the sentence", () => {
					expect(response.body.data.id).toBe(1);
					expect(response.body.data.sentence).toBe(
						"Bhiodh iad a' dèanamh móran uisge-bheatha bho chionn fhada ro n a latha againn."
					);
				});

				test("it returns statistics related to the sentence", () => {
					let stats = response.body.data.stats;
					expect(stats.logged.suggestions[0].count).toBe("1");
					expect(stats.logged.suggestions[0].suggestion).toBe("Suggestion");

					expect(stats.logged.types[0].count).toBe("1");
					expect(stats.logged.types[0].type).toBe("none");
					expect(stats.logged.types[1].count).toBe("1");
					expect(stats.logged.types[1].type).toBe("suggestion");
					expect(stats.logged.types[2].count).toBe("1");
					expect(stats.logged.types[2].type).toBe("user");

					expect(stats.anonymous.suggestions[0].count).toBe("1");
					expect(stats.anonymous.suggestions[0].suggestion).toBe("Suggestion");

					expect(stats.anonymous.types[0].count).toBe("1");
					expect(stats.anonymous.types[0].type).toBe("original");
					expect(stats.anonymous.types[1].count).toBe("1");
					expect(stats.anonymous.types[1].type).toBe("suggestion");
					expect(stats.anonymous.types[2].count).toBe("1");
					expect(stats.anonymous.types[2].type).toBe("user");
				});

				describe("Invalid ID", () => {
					beforeAll(() => {
						sentenceId = 0;
					});

					afterAll(() => {
						sentenceId = 1;
					});

					test("It returns a not found response", () => {
						expect(response.statusCode).toBe(404);
						expect(response.body.success).toBe(false);
						expect(response.body.message).toBe("Sentence doesn't exist");
					});
				});

				unauthenticatedTests();
			});
		});

		describe("GET", () => {
			let page = null;
			let extraSentence = null;

			beforeAll(() => {
				loginUserId = ADMIN_USER_ID;
			});

			beforeEach(async () => {
				if (extraSentence) {
					for (let i = 0; i < extraSentence; i++) {
						await db.query(
							"INSERT INTO sentences (sentence, source, count) VALUES ($1, $2, $3)",
							[`Extra Sentence ${i}`, "new", i]
						);
					}
				}

				let agent = request.agent(app);
				if (loginUserId) {
					await agent.get("/api/mock/login");
				}
				response = await agent.get("/api/sentences").query({ page: page });
			});

			successfulResponse(true);

			test("It returns a list of sentences", () => {
				expect(response.body.data.length).toBe(11);
				expect(response.body.data[0].id).toBe(1);
				expect(response.body.data[0].sentence).toBe(
					"Bhiodh iad a' dèanamh móran uisge-bheatha bho chionn fhada ro n a latha againn."
				);
				expect(response.body.data[0].source).toBe("original.txt");
				expect(response.body.data[0].count).toBe(1);
				expect(response.body.total).toBe(11);
				expect(response.body.page_size).toBe(25);
			});

			describe("Pagination", () => {
				beforeAll(() => {
					page = 1;
				});

				afterAll(() => {
					page = null;
				});

				test("It returns an empty list on page 2", () => {
					expect(response.body.data.length).toBe(0);
					expect(response.body.total).toBe(11);
					expect(response.body.page_size).toBe(25);
				});

				describe("Filled in database with 26 sentences", () => {
					beforeAll(() => {
						extraSentence = 15;
					});

					afterAll(() => {
						extraSentence = null;
					});

					test("It returns a single sentence on page 2", () => {
						expect(response.body.data.length).toBe(1);
						expect(response.body.total).toBe(26);
						expect(response.body.page_size).toBe(25);
						expect(response.body.data[0].sentence).toBe("Extra Sentence 14");
						expect(response.body.data[0].source).toBe("new");
						expect(response.body.data[0].count).toBe(14);
					});
				});
			});

			unauthenticatedTests();
		});
	});

	describe("/user_interactions", () => {
		describe("POST", () => {
			let selectedSuggestion = null;
			let userSuggestion = null;
			let type = null;
			let sentenceId = 1;
			let suggestions = ["Suggestion 1", "Suggestion 2", "Suggestion 3"];

			beforeEach(async () => {
				let agent = request.agent(app);
				if (loginUserId) {
					await agent.get("/api/mock/login");
				}
				response = await agent.post("/api/user_interactions").send({
					sentence: { id: sentenceId },
					suggestions: suggestions,
					type: type,
					selected_suggestion: selectedSuggestion,
					user_suggestion: userSuggestion,
				});
			});

			const commonUserInteractionTests = () => {
				test("it creates three suggestions in the database", async () => {
					const suggestionCount = await db.query(
						"SELECT COUNT(*) FROM suggestions"
					);
					expect(parseInt(suggestionCount.rows[0].count)).toBe(3);
				});

				test("it creates a user interaction in the database", async () => {
					const interactionCount = await db.query(
						"SELECT COUNT(*) FROM user_interactions"
					);
					expect(parseInt(interactionCount.rows[0].count)).toBe(1);
				});

				test("the interaction created will have the proper type", async () => {
					const interaction = await db.query("SELECT * from user_interactions");
					expect(interaction.rows[0].type).toBe(type);
					expect(parseInt(interaction.rows[0].sentence_id)).toBe(sentenceId);
				});

				test("it returns a successful response", () => {
					expect(response.statusCode).toBe(201);
					expect(response.body.success).toBe(true);
					expect(response.body.message).toBe("Suggestions saved successfully");
				});

				test("it links the selection to the logged in user", async () => {
					const interaction = await db.query("SELECT * from user_interactions");
					expect(interaction.rows[0].user_id).toBe(loginUserId);
				});

				describe("Logged out user", () => {
					beforeAll(() => {
						loginUserId = null;
					});

					test("it links the selection to the anonymous user", async () => {
						const interaction = await db.query(
							"SELECT * from user_interactions"
						);
						expect(interaction.rows[0].user_id).toBe("0");
					});

					afterAll(() => {
						loginUserId = REGULAR_USER_ID;
					});
				});
			};

			describe("User selected a suggestion", () => {
				beforeAll(() => {
					selectedSuggestion = suggestions[0];
					type = "suggestion";
				});

				commonUserInteractionTests();

				test("the interaction created will mark the appropriate selection", async () => {
					const selection = await db.query(
						"SELECT * FROM suggestions WHERE suggestion = $1",
						[suggestions[0]]
					);

					const interaction = await db.query("SELECT * from user_interactions");
					expect(interaction.rows[0].suggestion_id).toBe(selection.rows[0].id);
				});

				describe("Missing suggestion", () => {
					beforeAll(() => {
						selectedSuggestion = null;
					});

					test("the response is a 422", () => {
						expect(response.statusCode).toBe(422);
						expect(response.body.success).toBe(false);
						expect(response.body.message).toBe(
							"Missing user interaction data in input"
						);
					});
				});
			});

			describe("User provided a new suggestion", () => {
				beforeAll(() => {
					userSuggestion = "Suggestion 4";
					type = "user";
				});

				commonUserInteractionTests();

				test("the interaction created will add the appropriate user suggestion", async () => {
					const interaction = await db.query("SELECT * from user_interactions");
					expect(interaction.rows[0].user_suggestion).toBe(userSuggestion);
				});

				describe("Missing suggestion", () => {
					beforeAll(() => {
						userSuggestion = null;
					});

					test("the response is a 422", () => {
						expect(response.statusCode).toBe(422);
						expect(response.body.success).toBe(false);
						expect(response.body.message).toBe(
							"Missing user interaction data in input"
						);
					});
				});
			});

			describe("User said none are good", () => {
				beforeAll(() => {
					type = "none";
				});

				commonUserInteractionTests();
			});

			describe("User said the sentence is correct", () => {
				beforeAll(() => {
					type = "original";
				});

				commonUserInteractionTests();
			});

			describe("Missing type", () => {
				beforeAll(() => {
					type = null;
				});

				test("the response is a 422", () => {
					expect(response.statusCode).toBe(422);
					expect(response.body.success).toBe(false);
					expect(response.body.message).toBe(
						"Missing sentence and suggestion information in input"
					);
				});
			});

			describe("Missing sentence", () => {
				beforeAll(() => {
					sentenceId = null;
				});

				test("the response is a 422", () => {
					expect(response.statusCode).toBe(422);
					expect(response.body.success).toBe(false);
					expect(response.body.message).toBe(
						"Missing sentence and suggestion information in input"
					);
				});
			});

			describe("Missing suggestion list", () => {
				beforeAll(() => {
					suggestions = [];
				});

				test("the response is a 422", () => {
					expect(response.statusCode).toBe(422);
					expect(response.body.success).toBe(false);
					expect(response.body.message).toBe(
						"Missing sentence and suggestion information in input"
					);
				});
			});
		});
	});
});
