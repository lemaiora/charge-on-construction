CREATE TABLE project_inquiries (
  id TEXT PRIMARY KEY NOT NULL,
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  scope TEXT NOT NULL,
  timeframe TEXT NOT NULL,
  details TEXT NOT NULL
);
