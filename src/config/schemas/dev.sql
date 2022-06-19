-- Setup schema
CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT,
  name TEXT,
  password_hash TEXT,
  date_registered TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  contacts integer[] DEFAULT '{}'
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

CREATE TYPE request_type AS ENUM ('contact');
CREATE TYPE request_status AS ENUM ('pending', 'accepted');
CREATE TABLE requests (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  type request_type NOT NULL,
  date_requested TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  from_user INTEGER NOT NULL,
  to_user INTEGER NOT NULL,
  status request_status NOT NULL
);

select * from users;
select * from messages;
select * from rooms;
select * from requests;