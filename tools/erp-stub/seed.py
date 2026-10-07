"""Deterministic full-year seed generator for the ERP stub.

Creates a complete fake school in the TEST database: 4 sessions
(2023-24 → 2026-27), classes 1-12 × 2 sections, ~30 students each with
parents, staff in every role, subjects, fees + payments, weekday attendance,
exams + marks (consistent per-student ability), homework, quizzes, notices,
events, library issues, meetings, buses, notifications — plus logins for
every role.

Usage:
  py -3 seed.py --db-url "postgresql://...?...sslmode=require"
  py -3 seed.py                 # uses STUB_DB_URL from ./.env or env

Re-running drops and recreates the stub tables (schema.sql). This database
holds ONLY generated test data.
"""

from __future__ import annotations

import argparse
import os
import random
from datetime import date, timedelta

import psycopg

HERE = os.path.dirname(os.path.abspath(__file__))
R = random.Random(42)

# ---------------------------------------------------------------- helpers

FIRST_M = ["Aarav", "Vivaan", "Aditya", "Arjun", "Reyansh", "Sai", "Krishna", "Ishaan",
           "Rohan", "Kabir", "Ayaan", "Dev", "Harsh", "Nikhil", "Rahul", "Siddharth",
           "Manav", "Yash", "Om", "Pranav", "Rudra", "Vihaan", "Ansh", "Dhruv"]
FIRST_F = ["Aadhya", "Ananya", "Diya", "Ira", "Kiara", "Myra", "Sara", "Anika",
           "Navya", "Pari", "Riya", "Saanvi", "Trisha", "Avni", "Ishita", "Jiya",
           "Kavya", "Meera", "Nitya", "Prisha", "Riya", "Shreya", "Tanvi", "Zara"]
SURNAMES = ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Das", "Banerjee", "Chatterjee",
            "Mukherjee", "Roy", "Sen", "Bose", "Dutta", "Ghosh", "Mishra", "Tiwari",
            "Yadav", "Rao", "Nair", "Menon", "Iyer", "Patel", "Shah", "Joshi",
            "Kulkarni", "Desai", "Reddy", "Naidu", "Chauhan", "Thakur"]
HINDI_SUBJECTS = {"English", "Hindi", "Mathematics", "Science", "Social Science",
                  "Environmental Studies", "Computer"}

ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"]

def gn(gender: str) -> str:
    first = R.choice(FIRST_M if gender == "male" else FIRST_F)
    return f"{first} {R.choice(SURNAMES)}"

def daterange_weekdays(start: date, end: date):
    d = start
    while d <= end:
        if d.weekday() < 5:
            yield d
        d += timedelta(days=1)

def sample_weekdays(start: date, end: date, months: set[int]):
    for d in daterange_weekdays(start, end):
        if d.month in months:
            yield d

def grade_of(pct: float) -> str:
    for cut, g in ((91, "A+"), (81, "A"), (71, "B+"), (61, "B"), (51, "C+"), (41, "C"), (33, "D")):
        if pct >= cut:
            return g
    return "E"

# ---------------------------------------------------------------- seed

def seed(db_url: str, students_per_class: int = 30) -> dict:
    con = psycopg.connect(db_url, connect_timeout=30, autocommit=False)
    cur = con.cursor()
    with open(os.path.join(HERE, "schema.sql"), encoding="utf-8") as fh:
        cur.execute(fh.read())

    counts: dict[str, int] = {}
    def add(table, n):
        counts[table] = counts.get(table, 0) + n

    TODAY = date(2026, 10, 6)

    # ---- schools + sessions ----
    SCHOOL_ID, SCHOOL_CLIENT = "TEST100", "2099"
    cur.execute("INSERT INTO schools VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                (SCHOOL_ID, SCHOOL_CLIENT, "DEMO MODEL SCHOOL (TEST)", "BANKURA", "CBSE",
                 "", "Active since 2022", 25000, True))
    add("schools", 1)

    SESSIONS = [
        ("11", "2023", "2023-2024", "2080", False, date(2023, 4, 1), date(2024, 3, 31)),
        ("12", "2024", "2024-2025", "2084", False, date(2024, 4, 1), date(2025, 3, 31)),
        ("13", "2025", "2025-2026", "2088", False, date(2025, 4, 1), date(2026, 3, 31)),
        ("14", "2026", "2026-2027", "2092", True,  date(2026, 4, 1), date(2027, 3, 31)),
    ]
    with cur.copy("COPY sessions (id,school_id,name,session,client_id,is_current,start_date,end_date) FROM STDIN") as cp:
        for sid, nm, sess, cid, cur_flag, s, e in SESSIONS:
            cp.write_row((sid, SCHOOL_ID, nm, sess, cid, cur_flag, s, e))
    add("sessions", len(SESSIONS))
    CURRENT = SESSIONS[-1]

    # ---- standards + classes ----
    std_rows, class_rows = [], []
    std_ids: dict[int, str] = {}
    for i in range(1, 13):
        sid = str(41000 + i)
        std_ids[i] = sid
        std_rows.append((sid, SCHOOL_ID, ROMAN[i - 1], i))
    cid_n = 50000
    classes: list[tuple[str, int, str]] = []   # (class_id, standard, section)
    for i in range(1, 13):
        for sec in ("A", "B"):
            cid_n += 1
            cid = str(cid_n)
            class_rows.append((cid, SCHOOL_ID, std_ids[i], f"{ROMAN[i - 1]} - {sec}", sec, None))
            classes.append((cid, i, sec))
    with cur.copy("COPY standards (id,school_id,name,sort_order) FROM STDIN") as cp:
        for r in std_rows:
            cp.write_row(r)
    with cur.copy("COPY classes (id,school_id,standard_id,name,section,class_teacher_id) FROM STDIN") as cp:
        for r in class_rows:
            cp.write_row(r)
    add("standards", len(std_rows)); add("classes", len(class_rows))

    # ---- subjects + mapping ----
    SUBJECTS = [("42001", "English", "ENG"), ("42002", "Hindi", "HIN"), ("42003", "Mathematics", "MAT"),
                ("42004", "Science", "SCI"), ("42005", "Social Science", "SST"),
                ("42006", "Environmental Studies", "EVS"), ("42007", "Computer", "CMP")]
    subj_by_name = {n: (i, c) for i, n, c in SUBJECTS}
    with cur.copy("COPY subjects (id,school_id,name,code) FROM STDIN") as cp:
        for i, n, c in SUBJECTS:
            cp.write_row((i, SCHOOL_ID, n, c))
    add("subjects", len(SUBJECTS))

    def subjects_for(std: int) -> list[str]:
        if std <= 5:
            return ["English", "Hindi", "Mathematics", "Environmental Studies"]
        if std <= 8:
            return ["English", "Hindi", "Mathematics", "Science", "Social Science"]
        return ["English", "Mathematics", "Science", "Social Science", "Computer"]

    class_subj: dict[str, list[str]] = {c[0]: subjects_for(c[1]) for c in classes}

    # ---- staff ----
    staff_rows = []
    def mk_staff(idx, name, role, desig, dept=""):
        sid = str(700000 + idx)
        staff_rows.append((sid, SCHOOL_ID, name, role, desig, dept, "", "", "", date(2019, 6, 1), "active"))
        return sid

    principal_id = mk_staff(1, "ANINDITA SINHA", "PRINCIPAL", "Principal")
    mk_staff(2, "SOMNATH BANERJEE", "VICE PRINCIPAL", "Vice Principal")
    mk_staff(3, "RAJESH KUMAR", "ADMIN", "School Admin")
    mk_staff(4, "MADHUMITA ROY", "ACCOUNTANT", "Accountant")
    mk_staff(5, "SUBRATA GHOSH", "LIBRARIAN", "Librarian")
    teacher_ids = []
    n = 10
    for cls_id, std, sec in classes:
        n += 1
        tid = mk_staff(n, gn(R.choice(["male", "female"])), "TEACHER", "Class Teacher", f"Standard {ROMAN[std - 1]}")
        teacher_ids.append(tid)
        # set class teacher
        cur.execute("UPDATE classes SET class_teacher_id=%s WHERE id=%s", (tid, cls_id))
    subject_teacher_ids = []
    for _ in range(18):
        n += 1
        tid = mk_staff(n, gn(R.choice(["male", "female"])), "TEACHER", "Subject Teacher",
                       R.choice(["Languages", "Mathematics", "Science", "Social Science"]))
        subject_teacher_ids.append(tid)
    with cur.copy("COPY staff (id,school_id,name,role,designation,department,email,phone,gender,joining_date,status) FROM STDIN") as cp:
        for r in staff_rows:
            cp.write_row(r)
    add("staff", len(staff_rows))

    # class_subjects (rotate subject teachers)
    with cur.copy("COPY class_subjects (class_id,subject_id,teacher_id) FROM STDIN") as cp:
        for cls_id, subs in class_subj.items():
            for j, sname in enumerate(subs):
                cp.write_row((cls_id, subj_by_name[sname][0], subject_teacher_ids[j % len(subject_teacher_ids)]))
    add("class_subjects", sum(len(v) for v in class_subj.values()))

    # ---- departments / designations / titles ----
    deps = ["Administration", "Academics", "Accounts", "Library", "Transport", "Science", "Mathematics", "Languages"]
    with cur.copy("COPY departments (id,school_id,name) FROM STDIN") as cp:
        for j, d in enumerate(deps):
            cp.write_row((str(46000 + j), SCHOOL_ID, d))
    add("departments", len(deps))
    desigs = ["Principal", "Vice Principal", "School Admin", "Accountant", "Librarian",
              "Class Teacher", "Subject Teacher", "Lab Assistant", "Office Assistant"]
    with cur.copy("COPY designations (id,school_id,name) FROM STDIN") as cp:
        for j, d in enumerate(desigs):
            cp.write_row((str(47000 + j), SCHOOL_ID, d))
    add("designations", len(desigs))
    titles = ["Mr.", "Mrs.", "Ms.", "Dr.", "Master", "Miss"]
    with cur.copy("COPY titles (id,school_id,name) FROM STDIN") as cp:
        for j, t in enumerate(titles):
            cp.write_row((str(47500 + j), SCHOOL_ID, t))
    add("titles", len(titles))

    # ---- houses ----
    house_rows = [("48001", SCHOOL_ID, "Red House", "#E53935"), ("48002", SCHOOL_ID, "Blue House", "#1E88E5"),
                  ("48003", SCHOOL_ID, "Green House", "#43A047"), ("48004", SCHOOL_ID, "Yellow House", "#FDD835")]
    with cur.copy("COPY houses (id,school_id,name,color) FROM STDIN") as cp:
        for r in house_rows:
            cp.write_row(r)
    add("houses", len(house_rows))

    # ---- students ----
    students = []   # (id, name, class_id, std, sec, roll, gender, dob, phone, ability, house, category, session_id)
    sid_n = 900000
    stu_cur = []    # per-student for current session
    abil = {}
    for cls_id, std, sec in classes:
        for roll in range(1, students_per_class + 1):
            sid_n += 1
            sid = str(sid_n)
            g = R.choice(["male", "female"])
            name = gn(g)
            birth_year = 2026 - (5 + std)   # Class V (std5) → born ~2016 for 2026 session
            dob = date(birth_year, R.randint(1, 12), R.randint(1, 28))
            phone = "9" + "".join(str(R.randint(0, 9)) for _ in range(9))
            ability = min(0.98, max(0.15, R.gauss(0.62, 0.16)))
            abil[sid] = ability
            house = house_rows[(sid_n) % 4][0]
            cat = "General"
            r = R.random()
            if r < 0.06:
                cat = "RTE"
            elif r < 0.09:
                cat = "Staff Ward"
            students.append((sid, name, cls_id, std, sec, f"{roll:02d}", g, dob, phone,
                             house, cat))
            stu_cur.append(sid)

    with cur.copy("COPY students (id,school_id,name,admission_number,roll_number,class_id,session_id,house_id,gender,dob,phone,image_url,status,ability,fee_category) FROM STDIN") as cp:
        for (sid, name, cls_id, std, sec, roll, g, dob, phone, house, cat) in students:
            cp.write_row((sid, SCHOOL_ID, name, f"ADM{2023 + std}{sid[-4:]}", roll, cls_id,
                          CURRENT[0], house, g, dob, phone, "", "active", abil[sid], cat))
    add("students", len(students))

    # ---- parents ----
    parents, links = [], []
    pid_n = 800000
    parent_of = {}
    for (sid, name, *_rest) in students:
        single = R.random() < 0.10
        surname = name.split()[-1]
        for rel in (["Father", "Mother"] if not single else [R.choice(["Father", "Mother", "Guardian"])]):
            pid_n += 1
            pid = str(pid_n)
            pname = f"{R.choice(FIRST_M if rel == 'Father' else FIRST_F)} {surname}"
            pphone = "8" + "".join(str(R.randint(0, 9)) for _ in range(9))
            parents.append((pid, pname, pphone, "", R.choice(["Business", "Service", "Homemaker", "Farmer", "Doctor", "Engineer"])))
            links.append((sid, pid, rel))
            parent_of.setdefault(sid, pid)
    with cur.copy("COPY parents (id,name,phone,email,occupation) FROM STDIN") as cp:
        for r in parents:
            cp.write_row(r)
    with cur.copy("COPY student_parents (student_id,parent_id,relation) FROM STDIN") as cp:
        for r in links:
            cp.write_row(r)
    add("parents", len(parents)); add("student_parents", len(links))

    # ---- fee types + fees + payments ----
    fee_rows = [("43001", SCHOOL_ID, "Tuition Fee", 24000, "all"),
                ("43002", SCHOOL_ID, "Examination Fee", 1200, "all"),
                ("43003", SCHOOL_ID, "Activity Fee", 1500, "all"),
                ("43004", SCHOOL_ID, "Transport Fee", 9600, "all")]
    with cur.copy("COPY fee_types (id,school_id,name,amount,class_group) FROM STDIN") as cp:
        for r in fee_rows:
            cp.write_row(r)
    add("fee_types", len(fee_rows))

    def fee_amount(std: int, base: float) -> float:
        mult = 0.75 if std <= 5 else (1.0 if std <= 8 else 1.3)
        return round(base * mult, -1)

    fees, payments = [], []
    fee_n, pay_n = 6000000, 6100000
    for (sid, name, cls_id, std, sec, roll, g, dob, phone, house, cat) in students:
        for (ftid, _school, _n, base, _grp) in fee_rows:
            feid = str(fee_n); fee_n += 1
            amount = fee_amount(std, base)
            if ftid == "43004" and R.random() > 0.35:
                continue  # not a bus user
            paid, status, mode, paid_at = 0, "unpaid", "", None
            draw = R.random()
            if cat == "RTE":
                paid, status, mode = amount, "paid", "concession"
                paid_at = date(2026, 5, 10)
            elif cat == "Staff Ward":
                paid = round(amount * 0.5)
                status = "paid"; mode = "adjustment"; paid_at = date(2026, 5, 12)
            elif draw < 0.62:
                paid, status, mode = amount, "paid", R.choice(["cash", "online", "cheque", "card", "bank"])
                paid_at = date(2026, 4, 1) + timedelta(days=R.randint(5, 120))
            elif draw < 0.78:
                paid = round(amount * R.choice([0.3, 0.5, 0.7]))
                status, mode = "partial", R.choice(["cash", "online"])
                paid_at = date(2026, 5, 1) + timedelta(days=R.randint(0, 80))
            fees.append((feid, CURRENT[0], sid, ftid, amount, paid, date(2026, 6, 30), status, mode, paid_at))
            if paid > 0 and mode not in ("concession", "adjustment"):
                pay_n += 1
                payments.append((str(pay_n), feid, paid, mode, paid_at, f"RCP{pay_n}"))
    with cur.copy("COPY student_fees (id,session_id,student_id,fee_type_id,amount,paid_amount,due_date,status,payment_mode,paid_at) FROM STDIN") as cp:
        for r in fees:
            cp.write_row(r)
    with cur.copy("COPY fee_payments (id,student_fee_id,amount,mode,paid_at,receipt_no) FROM STDIN") as cp:
        for r in payments:
            cp.write_row(r)
    add("student_fees", len(fees)); add("fee_payments", len(payments))

    # ---- attendance ----
    att_count = 0
    with cur.copy("COPY attendance (student_id,class_id,session_id,date,status) FROM STDIN") as cp:
        for sess in SESSIONS:
            sid_, _nm, _ss, _cid, _cur, sstart, send = sess
            upto = min(send, TODAY)
            if sess[0] in ("11", "12"):          # older sessions: sample 2 months
                days = sample_weekdays(sstart, upto, {1, 2})
            else:
                days = daterange_weekdays(sstart, upto)
            days = list(days)
            for (student_id, name, cls_id, std, sec, roll, g, dob, phone, house, cat) in students:
                a = abil[student_id]
                p_absent = min(0.12, max(0.015, 0.06 - (a - 0.5) * 0.05))
                for d in days:
                    r = R.random()
                    st = "present"
                    if r < p_absent:
                        st = "absent"
                    elif r < p_absent + 0.02:
                        st = "late"
                    elif r < p_absent + 0.03:
                        st = "half_day"
                    cp.write_row((student_id, cls_id, sess[0], d, st))
                    att_count += 1
    add("attendance", att_count)

    # ---- exams + marks ----
    exam_rows, mark_rows = [], []
    ex_n = 450000
    mk_n = 0
    for sess in SESSIONS:
        sess_id, _nm, _ss, _cid, _cur, sstart, send = sess
        exam_defs = [("Unit Test 1", sstart + timedelta(days=95)),
                     ("Half Yearly", sstart + timedelta(days=170)),
                     ("Annual Exam", send - timedelta(days=25))]
        for cls_id, std, sec in classes:
            for sname in class_subj[cls_id]:
                subj_id = subj_by_name[sname][0]
                for ename, edate in exam_defs:
                    ex_n += 1
                    eid = str(ex_n)
                    exam_rows.append((eid, sess_id, cls_id, subj_id, ename, edate, 100))
                    for (student_id, name, s_cls, s_std, s_sec, roll, g, dob, phone, house, cat) in students:
                        if s_cls != cls_id:
                            continue
                        a = abil[student_id]
                        pct = min(99.0, max(8.0, a * 100 + R.gauss(0, 7)))
                        mk_n += 1
                        mark_rows.append((eid, student_id, round(pct, 1), grade_of(pct)))
    with cur.copy("COPY exams (id,session_id,class_id,subject_id,name,exam_date,max_marks) FROM STDIN") as cp:
        for r in exam_rows:
            cp.write_row(r)
    with cur.copy("COPY exam_marks (exam_id,student_id,marks,grade) FROM STDIN") as cp:
        for r in mark_rows:
            cp.write_row(r)
    add("exams", len(exam_rows)); add("exam_marks", len(mark_rows))

    # ---- homework + quizzes (current + previous session) ----
    hw_rows, qz_rows = [], []
    hw_n, qz_n = 480000, 490000
    hw_titles = ["Worksheet on {t}", "Textbook exercise on {t}", "Practice problems on {t}",
                 "Revision questions on {t}", "Project work on {t}"]
    topics = {"English": ["Reading comprehension", "Grammar", "Creative writing"],
              "Hindi": ["Vyakaran", "Patra lekhan", "Anuchhed"],
              "Mathematics": ["Fractions", "Algebra", "Geometry", "Mensuration"],
              "Science": ["Nutrition", "Light", "Electricity", "Chemical reactions"],
              "Social Science": ["Medieval history", "Geography", "Civics"],
              "Environmental Studies": ["Plants", "Our body", "Water"],
              "Computer": ["Basics", "Spreadsheets", "Internet safety"]}
    for sess in (SESSIONS[2], SESSIONS[3]):
        sess_id, _nm, _ss, _cid, _cur, sstart, send = sess
        upto = min(send, TODAY) if sess[0] == "14" else send
        for cls_id, std, sec in classes:
            week = sstart
            while week <= upto:
                for sname in class_subj[cls_id]:
                    hw_n += 1
                    t = R.choice(topics.get(sname, ["Revision"]))
                    hw_rows.append((str(hw_n), sess_id, cls_id, subj_by_name[sname][0],
                                    R.choice(hw_titles).format(t=f"{t} ({sname})"),
                                    f"Complete neatly. Submit in the next class.", week,
                                    week + timedelta(days=4)))
                week += timedelta(days=7)
            qz_n += 1
            sname = R.choice(class_subj[cls_id])
            qz_rows.append((str(qz_n), sess_id, cls_id, subj_by_name[sname][0],
                            f"Quiz: {R.choice(topics.get(sname, ['Revision']))}",
                            R.choice([10, 15, 20]), sstart + timedelta(days=R.randint(20, 150))))
    with cur.copy("COPY homework (id,session_id,class_id,subject_id,title,description,assigned_on,due_date) FROM STDIN") as cp:
        for r in hw_rows:
            cp.write_row(r)
    with cur.copy("COPY quizzes (id,session_id,class_id,subject_id,title,questions,scheduled_on) FROM STDIN") as cp:
        for r in qz_rows:
            cp.write_row(r)
    add("homework", len(hw_rows)); add("quizzes", len(qz_rows))

    # ---- notices + events + notifications ----
    notice_titles = ["Half-Yearly Examination Schedule", "Annual Sports Day", "PTM for all classes",
                     "Winter Vacation", "Republic Day Celebration", "Fee Payment Reminder",
                     "Library Week", "Science Exhibition", "Independence Day", "Teacher's Day",
                     "Unit Test 1 Schedule", "Staff Meeting", "Health Check-up Camp",
                     "Inter-house Quiz", "Holiday Notice — Local Festival"]
    no_n, ev_n, nt_n = 500000, 510000, 560000
    notice_rows, event_rows, notif_rows = [], [], []
    for sess in SESSIONS:
        sess_id, _nm, _ss, _cid, _cur, sstart, send = sess
        for j in range(10):
            no_n += 1
            d = sstart + timedelta(days=R.randint(5, 300))
            t = R.choice(notice_titles)
            notice_rows.append((str(no_n), SCHOOL_ID, sess_id, t,
                                f"Dear Parents, {t}. Please take note. — Principal",
                                R.choice(["all", "parents", "students", "staff"]), d))
    events_fixed = [("Independence Day", "holiday", 8, 15), ("Gandhi Jayanti", "holiday", 10, 2),
                    ("Diwali Break", "vacation", 11, 8), ("Christmas", "holiday", 12, 25),
                    ("Republic Day", "holiday", 1, 26), ("Holi", "holiday", 3, 14),
                    ("Summer Vacation", "vacation", 5, 20), ("Founders Day", "event", 7, 10)]
    for sess in SESSIONS:
        sess_id, _nm, _ss, _cid, _cur, sstart, send = sess
        for t, kind, mo, dy in events_fixed:
            ev_n += 1
            y = sstart.year if mo >= 4 else sstart.year + 1
            d = date(y, mo, dy)
            if d < sstart or d > send:
                continue
            event_rows.append((str(ev_n), SCHOOL_ID, sess_id, t, kind, d, d if kind == "holiday" else d + timedelta(days=3)))
    for j in range(15):
        nt_n += 1
        notif_rows.append((str(nt_n), SCHOOL_ID, CURRENT[0], R.choice(notice_titles),
                           "Tap to view details.", None))
    with cur.copy("COPY notices (id,school_id,session_id,title,body,audience,published_on) FROM STDIN") as cp:
        for r in notice_rows:
            cp.write_row(r)
    with cur.copy("COPY events (id,school_id,session_id,title,type,start_date,end_date) FROM STDIN") as cp:
        for r in event_rows:
            cp.write_row(r)
    with cur.copy("COPY notifications (id,school_id,session_id,title,body,created_at) FROM STDIN") as cp:
        for r in notif_rows:
            cp.write_row(r)
    add("notices", len(notice_rows)); add("events", len(event_rows)); add("notifications", len(notif_rows))

    # ---- library ----
    book_titles = ["Panchatantra Tales", "The Jungle Book", "Wings of Fire", "Stories of Akbar-Birbal",
                   "Children's Encyclopedia", "Maths Made Easy", "Science Around Us", "Indian History for Kids",
                   "Great Scientists", "The Secret Garden", "Alice in Wonderland", "Robinson Crusoe",
                   "Swami and Friends", "Malgudi Days", "The Blue Umbrella", "Grandma's Bag of Stories",
                   "Amazing Facts", "Atlas of the World", "Poems for Children", "Tales of Tenali Raman",
                   "The Railway Children", "Around the World in 80 Days", "Heidi", "Black Beauty",
                   "The Wizard of Oz", "Treasure Island", "Gulliver's Travels", "Oliver Twist",
                   "The Adventures of Tom Sawyer", "Gitanjali for Children", "Riddles and Puzzles",
                   "Drawing Book Level 1", "Drawing Book Level 2", "Yoga for Kids", "Good Manners",
                   "Our Environment", "First Aid Basics", "Computer Basics", "Story of Cricket", "Folk Tales of Bengal"]
    book_rows = []
    for j, t in enumerate(book_titles):
        copies = R.randint(2, 6)
        book_rows.append((str(520000 + j), SCHOOL_ID, t, R.choice(SURNAMES), "", copies, copies))
    with cur.copy("COPY books (id,school_id,title,author,subject,copies,available) FROM STDIN") as cp:
        for r in book_rows:
            cp.write_row(r)
    issue_rows = []
    iss_n = 530000
    for _ in range(700):
        iss_n += 1
        book = R.choice(book_rows)
        student = R.choice(students)[0]
        iss = date(2026, 4, 10) + timedelta(days=R.randint(0, 150))
        due = iss + timedelta(days=14)
        ret = due + timedelta(days=R.choice([-3, -1, 0, 1, 2, 5]))
        if ret > TODAY:
            ret = None
        issue_rows.append((str(iss_n), book[0], student, iss, due, ret, "returned" if ret else "issued"))
    with cur.copy("COPY book_issues (id,book_id,student_id,issue_date,due_date,return_date,status) FROM STDIN") as cp:
        for r in issue_rows:
            cp.write_row(r)
    add("books", len(book_rows)); add("book_issues", len(issue_rows))

    # ---- meetings + buses ----
    meet_rows = []
    meet_n = 540000
    for cls_id, std, sec in classes:
        for m in range(4, 11):
            meet_n += 1
            y = 2026
            meet_rows.append((str(meet_n), SCHOOL_ID, cls_id, f"PTM — Class {ROMAN[std - 1]} {sec}",
                              "", date(y, m, 15), "09:00", ""))
    with cur.copy("COPY meetings (id,school_id,class_id,title,subject,meeting_date,start_time,link) FROM STDIN") as cp:
        for r in meet_rows:
            cp.write_row(r)
    add("meetings", len(meet_rows))

    bus_rows = [("5501", SCHOOL_ID, "Bus 1 — Bankura Town", "Route A", "Ramesh Yadav", "9876500011"),
                ("5502", SCHOOL_ID, "Bus 2 — Station Road", "Route B", "Suresh Das", "9876500022"),
                ("5503", SCHOOL_ID, "Bus 3 — College Road", "Route C", "Bikash Roy", "9876500033"),
                ("5504", SCHOOL_ID, "Bus 4 — Hospital More", "Route D", "Anil Singh", "9876500044")]
    with cur.copy("COPY buses (id,school_id,name,route,driver_name,driver_phone) FROM STDIN") as cp:
        for r in bus_rows:
            cp.write_row(r)
    bus_students = []
    for j, student in enumerate(R.sample(students, 140)):
        bus_students.append((bus_rows[j % 4][0], student[0], R.choice(["Town", "Station Road", "College Road", "Hospital More"])))
    with cur.copy("COPY bus_students (bus_id,student_id,location) FROM STDIN") as cp:
        for r in bus_students:
            cp.write_row(r)
    add("buses", len(bus_rows)); add("bus_students", len(bus_students))

    # ---- logins & profiles ----
    def class_student(class_id: str) -> str:
        for s in students:
            if s[2] == class_id:
                return s[0]
        return students[0][0]

    def student_name(sid: str) -> str:
        for s in students:
            if s[0] == sid:
                return s[1]
        return "Student"

    v_a = next(c for c in classes if c[1] == 5 and c[2] == "A")[0]
    viii_a = next(c for c in classes if c[1] == 8 and c[2] == "A")[0]
    x_a = next(c for c in classes if c[1] == 10 and c[2] == "A")[0]
    x_b = next(c for c in classes if c[1] == 10 and c[2] == "B")[0]
    stu5, stu8, stu10, stu10b = (class_student(v_a), class_student(viii_a),
                                 class_student(x_a), class_student(x_b))

    # teacher login = class teacher of VIII-A (so their E2E flows have a class)
    viii_a_idx = next(j for j, c in enumerate(classes) if c[0] == viii_a)
    teacher_staff_id = teacher_ids[viii_a_idx]
    teacher_name = next(r[2] for r in staff_rows if r[0] == teacher_staff_id)

    parent_of_stu5 = parent_of.get(stu5, parents[0][0])
    parent_of_stu10 = parent_of.get(stu10, parents[1][0])
    pname5 = next(p[1] for p in parents if p[0] == parent_of_stu5)
    pname10 = next(p[1] for p in parents if p[0] == parent_of_stu10)

    profile_rows = [
        ("950001", SCHOOL_ID, "PRINCIPAL", "ANINDITA SINHA", "", "PRINCIPAL"),
        ("950002", SCHOOL_ID, "ADMIN", "RAJESH KUMAR", "", "Admin"),
        ("950003", SCHOOL_ID, "TEACHER", teacher_name, "", "Teacher"),
        ("950004", SCHOOL_ID, "Student", student_name(stu5), "", "Student"),
        ("950005", SCHOOL_ID, "Student", student_name(stu8), "", "Student"),
        ("950006", SCHOOL_ID, "Student", student_name(stu10), "", "Student"),
        ("950007", SCHOOL_ID, "Student", student_name(stu10b), "", "Student"),
        ("950011", SCHOOL_ID, "PARENT", pname5, "", "Parent"),
        ("950012", SCHOOL_ID, "PARENT", pname10, "", "Parent"),
    ]
    with cur.copy("COPY profiles (id,school_id,role,name,image_url,meta_data) FROM STDIN") as cp:
        for r in profile_rows:
            cp.write_row(r)

    user_rows = [
        ("9000000031", "ANINDITA SINHA", "12345", "", "950001"),
        ("9000000041", "RAJESH KUMAR", "12345", "", "950002"),
        ("9000000021", teacher_name, "12345", "", "950003"),
        ("9000000001", student_name(stu5), "12345", "", "950004"),
        ("9000000002", student_name(stu8), "12345", "", "950005"),
        ("9000000003", student_name(stu10), "12345", "", "950006"),
        ("6868686868", student_name(stu10b), "12345", "", "950007"),
        ("9000000011", pname5, "12345", "", "950011"),
        ("9000000012", pname10, "12345", "", "950012"),
    ]
    with cur.copy("COPY users (id,name,password,image_url,profile_id) FROM STDIN") as cp:
        for r in user_rows:
            cp.write_row(r)
    with cur.copy("COPY user_profiles (user_id,profile_id,position) FROM STDIN") as cp:
        for u in user_rows:
            cp.write_row((u[0], u[4], 0))

    con.commit()
    cur.close()
    con.close()
    return counts


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--db-url", default=None)
    ap.add_argument("--students-per-class", type=int, default=30)
    a = ap.parse_args()

    url = a.db_url or os.getenv("STUB_DB_URL")
    if not url:
        env_path = os.path.join(HERE, ".env")
        if os.path.exists(env_path):
            for line in open(env_path, encoding="utf-8"):
                if line.strip().startswith("STUB_DB_URL="):
                    url = line.split("=", 1)[1].strip().strip('"')
    if not url:
        print("ERROR: pass --db-url or set STUB_DB_URL (or .env in erp-stub/)")
        return 2
    if "sslmode=" not in url:
        url += "?sslmode=require" if "?" not in url else "&sslmode=require"

    counts = seed(url, a.students_per_class)
    print("seeded tables:")
    for k, v in sorted(counts.items()):
        print(f"  {k:20s} {v:>8,d}")
    print(f"  {'TOTAL rows':20s} {sum(counts.values()):>8,d}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
