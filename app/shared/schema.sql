PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  city TEXT NOT NULL DEFAULT 'Montréal',
  format TEXT NOT NULL DEFAULT 'in_person' CHECK (format IN ('in_person', 'online')),
  speaker TEXT NOT NULL DEFAULT 'Project X Guest',
  description TEXT NOT NULL DEFAULT 'A practical technology session for builders and curious minds.'
);

CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reservations_event_id
  ON reservations(event_id);
