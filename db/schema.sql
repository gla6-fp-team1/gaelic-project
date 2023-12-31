DROP TABLE IF EXISTS sentences CASCADE;
DROP TABLE IF EXISTS suggestions CASCADE;
DROP TABLE IF EXISTS user_interactions CASCADE;
DROP TABLE IF EXISTS admin CASCADE;

CREATE TABLE sentences (
  id SERIAL PRIMARY KEY,
  sentence TEXT,
  source TEXT,
  count INTEGER
);
CREATE TABLE suggestions (
  id SERIAL PRIMARY KEY,
  sentence_id INTEGER REFERENCES sentences(id),
  suggestion TEXT
);
CREATE TABLE user_interactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  sentence_id INTEGER REFERENCES sentences(id),
  type TEXT,
  suggestion_id INTEGER REFERENCES suggestions(id),
  user_suggestion TEXT
);
CREATE TABLE admin (
  id SERIAL PRIMARY KEY,
  user_id TEXT
);

CREATE UNIQUE INDEX ON sentences (sentence, source);
CREATE UNIQUE INDEX ON suggestions (sentence_id, suggestion);
CREATE UNIQUE INDEX ON admin (user_id);

CREATE INDEX on user_interactions (sentence_id);
CREATE INDEX on user_interactions (sentence_id, type);
CREATE INDEX on user_interactions (sentence_id, suggestion_id);
CREATE INDEX ON user_interactions (user_id);

INSERT INTO sentences (sentence, source, count) VALUES ('Bhiodh iad a'' dèanamh móran uisge-bheatha bho chionn fhada ro n a latha againn.', 'original.txt', 1);
INSERT INTO sentences (sentence, source, count) VALUES ('Tha iad ris an Gearrloch fhathast.', 'original.txt', 2);
INSERT INTO sentences (sentence, source, count) VALUES ('Well, chuala mi gun robh iad ris an Gearrloch a sin.', 'original.txt', 3);
INSERT INTO sentences (sentence, source, count) VALUES ('Bha iad a'' faicinn bòcan shios ann an Arasaig.', 'original.txt', 4);
INSERT INTO sentences (sentence, source, count) VALUES ('agus ''s e a''chiad rud a bha iad a'' faicinn dhe''n rud colainn gun cheann a'' falbh feadh siod.', 'original.txt', 5);
INSERT INTO sentences (sentence, source, count) VALUES ('agus bha bodach a'' fuireach ann a'' sabhall.', 'original.txt', 6);
INSERT INTO sentences (sentence, source, count) VALUES ('Chuir iad duine ann a'' sabhall a dh'' fhuireach oidhche.', 'original.txt', 7);
INSERT INTO sentences (sentence, source, count) VALUES ('agus chunnaic e am bòcan a bha seo agus an bòcan bhitheadh aige.', 'original.txt', 8);
INSERT INTO sentences (sentence, source, count) VALUES ('agus tha obair uamhasach aige mun d'' fhuair e am bòcan a chumail bhuaidh.', 'original.txt', 9);
INSERT INTO sentences (sentence, source, count) VALUES ('agus bha coltas air gun deànadh am bòcan an gróthach air.', 'original.txt', 10);
INSERT INTO sentences (sentence, source, count) VALUES ('Cha robh buille a bhuaileadh e air nach robh e a'' smaoineach'' gur h- ann air póca cloìmh leis cho bog ''s a bha a'' bhuille is cha robh i a'' dèanadh feum.', 'original.txt', 11);

INSERT INTO admin (user_id) VALUES ('117060750196714169595');
