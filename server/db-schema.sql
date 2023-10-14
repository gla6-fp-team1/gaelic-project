DROP TABLE sentences CASCADE;
DROP TABLE suggestions CASCADE;
DROP TABLE user_interactions CASCADE;

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
  original_sentence_was_correct BOOLEAN
);


INSERT INTO sentences (sentence) VALUES ('Bhiodh iad a'' dèanamh móran uisge-bheatha bho chionn fhada ro n a latha againn.');
INSERT INTO sentences (sentence) VALUES ('Tha iad ris an Gearrloch fhathast.');
INSERT INTO sentences (sentence) VALUES ('Well, chuala mi gun robh iad ris an Gearrloch a sin.');
INSERT INTO sentences (sentence) VALUES ('Bha iad a'' faicinn bòcan shios ann an Arasaig.');
INSERT INTO sentences (sentence) VALUES ('agus ''s e a''chiad rud a bha iad a'' faicinn dhe''n rud colainn gun cheann a'' falbh feadh siod.');
INSERT INTO sentences (sentence) VALUES ('agus bha bodach a'' fuireach ann a'' sabhall.');
INSERT INTO sentences (sentence) VALUES ('Chuir iad duine ann a'' sabhall a dh'' fhuireach oidhche.');
INSERT INTO sentences (sentence) VALUES ('agus chunnaic e am bòcan a bha seo agus an bòcan bhitheadh aige.');
INSERT INTO sentences (sentence) VALUES ('agus tha obair uamhasach aige mun d'' fhuair e am bòcan a chumail bhuaidh.');
INSERT INTO sentences (sentence) VALUES ('agus bha coltas air gun deànadh am bòcan an gróthach air.');
INSERT INTO sentences (sentence) VALUES ('Cha robh buille a bhuaileadh e air nach robh e a'' smaoineach'' gur h- ann air póca cloìmh leis cho bog ''s a bha a'' bhuille is cha robh i a'' dèanadh feum.');
