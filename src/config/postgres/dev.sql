-- Setup schema
CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT,
  name TEXT,
  password_hash TEXT
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  sender_name TEXT NOT NULL,
  room_id TEXT NOT NULL,
  content TEXT NOT NULL
);

CREATE TABLE rooms (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  room_name TEXT NOT NULL
);

select * from users;
select * from messages;
select * from rooms;