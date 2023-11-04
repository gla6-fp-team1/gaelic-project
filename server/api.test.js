import request from "supertest";
import app from "./app";
import db from "./db";
import mockLogin from "../test/mock-login";

let loginUserId = "1";
mockLogin(app, () => loginUserId);

describe("/api", () => {
	describe("/sentences", () => {
		describe("/random", () => {
			describe("GET", () => {
				let response;

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
		});
	});

	describe("/user_interactions", () => {
		describe("POST", () => {
			let response;
			let selectedSuggestion = null;
			let userSuggestion = null;
			let type = null;
			let sentenceId = 1;
			let suggestions = ["Suggestion 1", "Suggestion 2", "Suggestion 3"];

			beforeEach(async () => {
				let agent = request.agent(app);
				await agent.get("/api/mock/login");
				response = await agent.post("/api/user_interactions").send({
					sentence: { id: sentenceId },
					suggestions: suggestions,
					type: type,
					selected_suggestion: selectedSuggestion,
					user_suggestion: userSuggestion,
				});
			});

			describe("User selected a suggestion", () => {
				beforeAll(() => {
					selectedSuggestion = suggestions[0];
					type = "suggestion";
				});

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

				test("the interaction created will mark the appropriate selection", async () => {
					const interaction = await db.query("SELECT * from user_interactions");
					expect(interaction.rows[0].type).toBe("suggestion");
					expect(parseInt(interaction.rows[0].sentence_id)).toBe(sentenceId);
					expect(
						parseInt(interaction.rows[0].suggestion_id)
					).toBeGreaterThanOrEqual(1);
				});

				test("it returns a successful response", () => {
					expect(response.statusCode).toBe(201);
				});

				test("it links the selection to the logged in user", async () => {
					const interaction = await db.query("SELECT * from user_interactions");
					expect(interaction.rows[0].user_id).toBe(loginUserId);
				});
			});

			describe("User provided a new suggestion", () => {
				beforeAll(() => {
					userSuggestion = "Suggestion 4";
					type = "user";
				});

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

				test("the interaction created will add the appropriate user suggestion", async () => {
					const interaction = await db.query("SELECT * from user_interactions");
					expect(interaction.rows[0].type).toBe("user");
					expect(parseInt(interaction.rows[0].sentence_id)).toBe(sentenceId);
					expect(interaction.rows[0].user_suggestion).toBe(userSuggestion);
				});

				test("it returns a successful response", () => {
					expect(response.statusCode).toBe(201);
				});

				test("it links the selection to the logged in user", async () => {
					const interaction = await db.query("SELECT * from user_interactions");
					expect(interaction.rows[0].user_id).toBe(loginUserId);
				});
			});

			describe("User said none are good", () => {
				beforeAll(() => {
					type = "none";
				});

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

				test("the interaction created will set the proper details", async () => {
					const interaction = await db.query("SELECT * from user_interactions");
					expect(interaction.rows[0].type).toBe("none");
					expect(parseInt(interaction.rows[0].sentence_id)).toBe(sentenceId);
				});

				test("it returns a successful response", () => {
					expect(response.statusCode).toBe(201);
				});

				test("it links the selection to the logged in user", async () => {
					const interaction = await db.query("SELECT * from user_interactions");
					expect(interaction.rows[0].user_id).toBe(loginUserId);
				});
			});

			describe("User said the sentence is correct", () => {
				beforeAll(() => {
					type = "original";
				});

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

				test("the interaction created will set the proper details", async () => {
					const interaction = await db.query("SELECT * from user_interactions");
					expect(interaction.rows[0].type).toBe("original");
					expect(parseInt(interaction.rows[0].sentence_id)).toBe(sentenceId);
				});

				test("it returns a successful response", () => {
					expect(response.statusCode).toBe(201);
				});

				test("it links the selection to the logged in user", async () => {
					const interaction = await db.query("SELECT * from user_interactions");
					expect(interaction.rows[0].user_id).toBe(loginUserId);
				});
			});
		});
	});
});
