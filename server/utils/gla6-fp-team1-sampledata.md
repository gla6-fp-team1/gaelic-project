<!-- I have created gla6-fp-team1-sampledata.js with code shown below and i run node gla6-fp-team1-sampledata.js data inserted successfully -->

const { Pool } = require("pg");
// Configure the database connection
const databasePool = new Pool({
user: "username",
host: "localhost",
database: "databasename",
password: "password",
port: 5432,
});

const insertSentence = async () => {
try {
await databasePool.connect();

    const insertSentenceQuery = `
      INSERT INTO sentences(sentence)
      VALUES ('The quick mps over the lazy dog.'),('The quick brown fox jumps over the lazy dog.'),('Tha iad ris an Gearrloch fhathast.');`;

    await databasePool.query(insertSentenceQuery);
    console.log("Data inserted successfully.");

} catch (error) {
console.error("Error inserting data:", error);
}
};

const insertSuggestion = async () => {
try {
await databasePool.connect();

    const insertSuggestionQuery = `
      INSERT INTO suggestions(sentence_id,suggestion)
      VALUES ('1','The quick brown fox jumped over the lazy dog.'),('1','The quick brown fox jumps over the lazy dogs.'),('2','The quick brown fox jumped over the lazy dog.'),('2','The quick brown fox jumps over the lazy dogs.'),('3','The iad ris an Gearr-loch fhathast'); `;

    await databasePool.query(insertSuggestionQuery);
    console.log("Data inserted successfully.");

} catch (error) {
console.error("Error inserting data:", error);
}
};
const insertUserInteraction = async () => {
try {
await databasePool.connect();

    const insertUserInteractionQuery = `
      INSERT INTO user_interactions(sentence_id,selected_suggestion,user_provided_suggestion)
      VALUES ('3','Tha iad ris an Gearrloch fhathast.
      ','Tha iad ris an Gear-loch fhathast')`;

    await databasePool.query(insertUserInteractionQuery);
    console.log("Data inserted successfully.");

} catch (error) {
console.error("Error inserting data:", error);
}
};

insertSentence();

insertSuggestion();
insertUserInteraction();
