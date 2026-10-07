-- ERP Stub schema — dedicated test database. Mimics infoeight's data as the
-- API fixtures describe it. All ids are strings like the live API returns.
-- Safe to drop/recreate: this database holds ONLY generated test data.

DROP TABLE IF EXISTS
  user_profiles, users, profiles, sessions, schools,
  standards, classes, subjects, class_subjects, staff,
  houses, students, parents, student_parents,
  fee_types, student_fees, fee_payments,
  attendance, exams, exam_marks,
  homework, quizzes, notices, events,
  books, book_issues, meetings, buses, bus_students,
  notifications, auth_tokens, departments, designations, titles
CASCADE;

CREATE TABLE schools (
  id           TEXT PRIMARY KEY,          -- school id
  client_id    TEXT NOT NULL,             -- school-level client id (live: "2025")
  name         TEXT NOT NULL,
  city         TEXT DEFAULT '',
  board        TEXT DEFAULT 'CBSE',
  logo_url     TEXT DEFAULT '',
  meta_data    TEXT DEFAULT '',
  sms_balance  INTEGER DEFAULT 15000,
  is_subscribed BOOLEAN DEFAULT TRUE
);

CREATE TABLE sessions (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  name         TEXT NOT NULL,             -- "2026"
  session      TEXT NOT NULL,             -- "2026-2027"
  client_id    TEXT NOT NULL UNIQUE,      -- per-session client id (live: "2200")
  is_current   BOOLEAN DEFAULT FALSE,
  start_date   DATE NOT NULL,
  end_date     DATE NOT NULL,
  background_color TEXT DEFAULT '#FFFFFF',
  text_color   TEXT DEFAULT '#15487D'
);

CREATE TABLE profiles (                   -- one per role-holder at a school
  id           TEXT PRIMARY KEY,          -- profile id (user_account_id)
  school_id    TEXT NOT NULL REFERENCES schools(id),
  role         TEXT NOT NULL,             -- Student|PARENT|TEACHER|PRINCIPAL|ADMIN|...
  name         TEXT NOT NULL,
  image_url    TEXT DEFAULT '',
  meta_data    TEXT DEFAULT ''            -- human label shown in getProfiles
);

CREATE TABLE users (
  id           TEXT PRIMARY KEY,          -- login id: phone number
  name         TEXT NOT NULL,
  password     TEXT NOT NULL,
  image_url    TEXT DEFAULT '',
  profile_id   TEXT NOT NULL REFERENCES profiles(id)   -- primary profile
);

CREATE TABLE user_profiles (              -- all profiles a login can pick
  user_id      TEXT NOT NULL REFERENCES users(id),
  profile_id   TEXT NOT NULL REFERENCES profiles(id),
  position     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, profile_id)
);

CREATE TABLE auth_tokens (
  guid         TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE standards (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  name         TEXT NOT NULL,             -- "V"
  sort_order   INTEGER NOT NULL
);

CREATE TABLE classes (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  standard_id  TEXT NOT NULL REFERENCES standards(id),
  name         TEXT NOT NULL,             -- "V - A"
  section      TEXT NOT NULL,
  class_teacher_id TEXT                   -- staff id
);

CREATE TABLE subjects (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  name         TEXT NOT NULL,
  code         TEXT DEFAULT ''
);

CREATE TABLE class_subjects (
  class_id     TEXT NOT NULL REFERENCES classes(id),
  subject_id   TEXT NOT NULL REFERENCES subjects(id),
  teacher_id   TEXT,
  PRIMARY KEY (class_id, subject_id)
);

CREATE TABLE departments (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  name         TEXT NOT NULL
);

CREATE TABLE designations (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  name         TEXT NOT NULL
);

CREATE TABLE titles (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  name         TEXT NOT NULL
);

CREATE TABLE staff (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  name         TEXT NOT NULL,
  role         TEXT NOT NULL,             -- TEACHER|PRINCIPAL|ADMIN|ACCOUNTANT|LIBRARIAN
  designation  TEXT DEFAULT '',
  department   TEXT DEFAULT '',
  email        TEXT DEFAULT '',
  phone        TEXT DEFAULT '',
  gender       TEXT DEFAULT '',
  joining_date DATE,
  status       TEXT DEFAULT 'active'
);

CREATE TABLE houses (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  name         TEXT NOT NULL,
  color        TEXT DEFAULT '#000000'
);

CREATE TABLE students (
  id               TEXT PRIMARY KEY,
  school_id        TEXT NOT NULL REFERENCES schools(id),
  name             TEXT NOT NULL,
  admission_number TEXT,
  roll_number      TEXT,
  class_id         TEXT NOT NULL REFERENCES classes(id),
  session_id       TEXT NOT NULL REFERENCES sessions(id),
  house_id         TEXT,
  gender           TEXT DEFAULT '',
  dob              DATE,
  phone            TEXT DEFAULT '',
  image_url        TEXT DEFAULT '',
  status           TEXT DEFAULT 'active',
  ability          REAL DEFAULT 0.6,      -- 0..1, drives marks/attendance
  fee_category     TEXT DEFAULT 'General'
);

CREATE TABLE parents (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  email        TEXT DEFAULT '',
  occupation   TEXT DEFAULT ''
);

CREATE TABLE student_parents (
  student_id   TEXT NOT NULL REFERENCES students(id),
  parent_id    TEXT NOT NULL REFERENCES parents(id),
  relation     TEXT NOT NULL,             -- Father|Mother|Guardian
  PRIMARY KEY (student_id, parent_id)
);

CREATE TABLE fee_types (
  id            TEXT PRIMARY KEY,
  school_id     TEXT NOT NULL REFERENCES schools(id),
  name          TEXT NOT NULL,
  amount        NUMERIC(12,2) NOT NULL DEFAULT 0,
  class_group   TEXT DEFAULT 'all'        -- primary|middle|secondary|all
);

CREATE TABLE student_fees (
  id            TEXT PRIMARY KEY,
  session_id    TEXT NOT NULL REFERENCES sessions(id),
  student_id    TEXT NOT NULL REFERENCES students(id),
  fee_type_id   TEXT NOT NULL REFERENCES fee_types(id),
  amount        NUMERIC(12,2) NOT NULL,
  paid_amount   NUMERIC(12,2) NOT NULL DEFAULT 0,
  due_date      DATE,
  status        TEXT DEFAULT 'unpaid',    -- paid|partial|unpaid
  payment_mode  TEXT DEFAULT '',
  paid_at       DATE
);

CREATE TABLE fee_payments (
  id            TEXT PRIMARY KEY,
  student_fee_id TEXT NOT NULL REFERENCES student_fees(id),
  amount        NUMERIC(12,2) NOT NULL,
  mode          TEXT NOT NULL,            -- cash|cheque|online|card|bank
  paid_at       DATE NOT NULL,
  receipt_no    TEXT DEFAULT ''
);

CREATE TABLE attendance (
  student_id   TEXT NOT NULL REFERENCES students(id),
  class_id     TEXT NOT NULL REFERENCES classes(id),
  session_id   TEXT NOT NULL REFERENCES sessions(id),
  date         DATE NOT NULL,
  status       TEXT NOT NULL,             -- present|absent|late|half_day
  PRIMARY KEY (student_id, date)
);

CREATE TABLE exams (
  id           TEXT PRIMARY KEY,
  session_id   TEXT NOT NULL REFERENCES sessions(id),
  class_id     TEXT NOT NULL REFERENCES classes(id),
  subject_id   TEXT NOT NULL REFERENCES subjects(id),
  name         TEXT NOT NULL,             -- Unit Test 1 / Half Yearly / Annual
  exam_date    DATE NOT NULL,
  max_marks    INTEGER NOT NULL DEFAULT 100
);

CREATE TABLE exam_marks (
  exam_id      TEXT NOT NULL REFERENCES exams(id),
  student_id   TEXT NOT NULL REFERENCES students(id),
  marks        NUMERIC(6,2) NOT NULL,
  grade        TEXT DEFAULT '',
  PRIMARY KEY (exam_id, student_id)
);

CREATE TABLE homework (
  id           TEXT PRIMARY KEY,
  session_id   TEXT NOT NULL REFERENCES sessions(id),
  class_id     TEXT NOT NULL REFERENCES classes(id),
  subject_id   TEXT NOT NULL REFERENCES subjects(id),
  title        TEXT NOT NULL,
  description  TEXT DEFAULT '',
  assigned_on  DATE NOT NULL,
  due_date     DATE
);

CREATE TABLE quizzes (
  id           TEXT PRIMARY KEY,
  session_id   TEXT NOT NULL REFERENCES sessions(id),
  class_id     TEXT NOT NULL REFERENCES classes(id),
  subject_id   TEXT NOT NULL REFERENCES subjects(id),
  title        TEXT NOT NULL,
  questions    INTEGER DEFAULT 10,
  scheduled_on DATE
);

CREATE TABLE notices (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  session_id   TEXT NOT NULL REFERENCES sessions(id),
  title        TEXT NOT NULL,
  body         TEXT DEFAULT '',
  audience     TEXT DEFAULT 'all',
  published_on DATE NOT NULL
);

CREATE TABLE events (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  session_id   TEXT NOT NULL REFERENCES sessions(id),
  title        TEXT NOT NULL,
  type         TEXT DEFAULT 'holiday',
  start_date   DATE NOT NULL,
  end_date     DATE
);

CREATE TABLE books (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  title        TEXT NOT NULL,
  author       TEXT DEFAULT '',
  subject      TEXT DEFAULT '',
  copies       INTEGER DEFAULT 1,
  available    INTEGER DEFAULT 1
);

CREATE TABLE book_issues (
  id           TEXT PRIMARY KEY,
  book_id      TEXT NOT NULL REFERENCES books(id),
  student_id   TEXT NOT NULL REFERENCES students(id),
  issue_date   DATE NOT NULL,
  due_date     DATE,
  return_date  DATE,
  status       TEXT DEFAULT 'issued'
);

CREATE TABLE meetings (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  class_id     TEXT REFERENCES classes(id),
  title        TEXT NOT NULL,
  subject      TEXT DEFAULT '',
  meeting_date DATE NOT NULL,
  start_time   TEXT DEFAULT '10:00',
  link         TEXT DEFAULT ''
);

CREATE TABLE buses (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  name         TEXT NOT NULL,
  route        TEXT DEFAULT '',
  driver_name  TEXT DEFAULT '',
  driver_phone TEXT DEFAULT ''
);

CREATE TABLE bus_students (
  bus_id       TEXT NOT NULL REFERENCES buses(id),
  student_id   TEXT NOT NULL REFERENCES students(id),
  location     TEXT DEFAULT '',
  PRIMARY KEY (bus_id, student_id)
);

CREATE TABLE notifications (
  id           TEXT PRIMARY KEY,
  school_id    TEXT NOT NULL REFERENCES schools(id),
  session_id   TEXT NOT NULL REFERENCES sessions(id),
  title        TEXT NOT NULL,
  body         TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_session ON students(session_id);
CREATE INDEX idx_attendance_date ON attendance(session_id, date);
CREATE INDEX idx_marks_student ON exam_marks(student_id);
CREATE INDEX idx_fees_student ON student_fees(student_id);
CREATE INDEX idx_exams_class ON exams(class_id);
