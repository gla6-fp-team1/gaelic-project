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

	describe("/sentences", () => {
		describe("/random", () => {
			describe("GET", () => {
				beforeEach(async () => {
					response = await request(app).get("/api/sentences/random");
				});

				test("It should return a successful response", () => {
					expect(response.statusCode).toBe(200);
					expect(response.body.success).toBe(true);
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
					await db.query(
						"INSERT INTO suggestions (sentence_id, suggestion) VALUES (1, 'Suggestion')"
					);
					await db.query(
						"INSERT INTO user_interactions (user_id, sentence_id, type, user_suggestion) VALUES ('1',1,'user','User Suggestion')"
					);

					let agent = request.agent(app);
					if (loginUserId) {
						await agent.get("/api/mock/login");
					}
					response = await agent.get("/api/sentences/export");
				});

				test("It should return a successful response", () => {
					expect(response.statusCode).toBe(200);
				});

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

			test("It returns a successful response", () => {
				expect(response.statusCode).toBe(200);
				expect(response.body.success).toBe(true);
			});

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
						expect(response.body.data[0].id).toBe(26);
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
