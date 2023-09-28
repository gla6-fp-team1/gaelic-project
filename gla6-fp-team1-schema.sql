
/* gla6-fp-team1 week 1 Investigate the database schema ticket*/

    sentences {
        id INT PK
        sentence TEXT
    }
    
    sentences--0NE ||--MANY{ suggesions : have}

    suggesions {
        id INT PK
        sentence_id INT REFERENCES sentences(id)
        suggestion TEXT
        
    }
    suggesions --ONE || --ONE { sentence : correspond to}
   user_interactions{
        id SERIAL PRIMARY KEY,
        sentence_id INTEGER REFERENCES sentences(id),
        selected_suggestion TEXT,
        user_provided_suggestion TEXT
   }
   user_interactions --ONE || ONE {sentence : correspond to}
CREATE TABLE sentences (
  id SERIAL PRIMARY KEY,
  sentence TEXT
);
CREATE TABLE suggestions (
  id SERIAL PRIMARY KEY,
  sentence_id INTEGER REFERENCES sentences(id),
  suggestion TEXT
);
CREATE TABLE user_interactions (
  id SERIAL PRIMARY KEY,
  sentence_id INTEGER REFERENCES sentences(id),
  selected_suggestion TEXT,
  user_provided_suggestion TEXT
);
