CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS books (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT        NOT NULL,
  author          TEXT,
  date_added      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  year_published  INT,
  cover_image_url TEXT
);

CREATE TABLE IF NOT EXISTS files (
  id        UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT  NOT NULL,
  file_path TEXT  NOT NULL,
  file_type TEXT  NOT NULL
);

CREATE TABLE IF NOT EXISTS book_files (
  book_id   UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  file_id   UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  PRIMARY key (book_id, file_id)
);
