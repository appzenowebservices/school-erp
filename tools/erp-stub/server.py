"""ERP Stub API — a local, faithful stand-in for the infoeight `/api` endpoint.

Serves the generated test data (seed.py) in the exact response shapes captured
from the live API. POST /api dispatches on the `api` field. Reads serve; a few
write APIs mutate the stub DB. The live API is never contacted.

Run:
  py -3 server.py            # reads STUB_DB_URL / STUB_PORT from ./.env
"""

from __future__ import annotations

import os
import time
import uuid
from contextlib import contextmanager
from datetime import date, datetime, timedelta

import psycopg
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from psycopg.rows import dict_row

HERE = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- env

def load_env() -> dict:
    cfg = {}
    path = os.path.join(HERE, ".env")
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                cfg[k.strip()] = v.strip().strip('"')
    return cfg

ENV = load_env()
DB_URL = os.getenv("STUB_DB_URL") or ENV.get("STUB_DB_URL", "")
STUB_PORT = int(os.getenv("STUB_PORT") or ENV.get("STUB_PORT", "4010"))
if DB_URL and "sslmode=" not in DB_URL:
    DB_URL += "?sslmode=require" if "?" not in DB_URL else "&sslmode=require"
SCHOOL_ID = "TEST100"

app = FastAPI(title="ERP Stub", version="1.0.0")
# Browser calls go straight to this port during testing — allow the app origin.
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])


@contextmanager
def db():
    con = psycopg.connect(DB_URL, connect_timeout=25, row_factory=dict_row)
    try:
        yield con
    finally:
        con.close()


def envelope(results, success: bool = True) -> dict:
    return {"success": success, "results": results,
            "time_taken": round(time.time() % 1, 4), "memory_usage": 0}


def L(key: str, rows: list, count: int | None = None, message: str = "No data found",
      header: list | None = None, filters: list | None = None, fields: list | None = None) -> dict:
    """Standard list envelope (mirrors live: message present even when data exists)."""
    n = count if count is not None else len(rows)
    return {
        "count": n, "count_text": f"Count ({n})", "show_view_all": False,
        "show_view_all_text": "", "recent_count": 0, "offset": 0, "limit": 20,
        "message": message, "blank_state": None,
        "header_options": header if header is not None else [
            {"action": "filter", "label": "search", "redirect_url": None, "api": None, "alert": None}],
        "filters": filters or [], "fields": fields or [], "columns": [],
        key: rows,
    }


def deny(api_name: str) -> dict:
    return {"message": f"You don't have permission to execute this api {api_name}"}


def cls_ref(row) -> dict:
    return {"id": row["class_id"], "name": row["class_name"],
            "standard": {"id": row["standard_id"], "name": row["standard_name"]}}


def session_meta(sess: dict, primary_id: str | None = None, user_id: str | None = None) -> dict:
    return {
        "id": sess["id"], "name": sess["name"], "session": sess["session"],
        "is_current": sess["is_current"], "is_active": sess["is_current"],
        "background_color": sess["background_color"], "text_color": sess["text_color"],
        "start_date": str(sess["start_date"]), "end_date": str(sess["end_date"]),
        "client_id": sess["client_id"], "client": {"id": sess["client_id"], "is_newly_added": False},
        "channels": ["class-100004", "broadcast"],
    }


# ---------------------------------------------------------------- auth

def h_get_user_from_user_name(body, con):
    user = con.execute("SELECT * FROM users WHERE id=%s", (str(body.get("user_name", "")),)).fetchone()
    if not user:
        return {"message": "Account not found", "id": None, "name": None, "image_url": None,
                "user_name": body.get("user_name"), "has_password": False,
                "check_for_registration": True, "registration_options": []}
    return {"message": "Account found, redirecting to login page.", "id": user["id"],
            "name": user["name"], "image_url": user["image_url"], "user_name": user["id"],
            "has_password": True, "check_for_registration": False,
            "registration_options": ["PASSWORD"]}


def h_login(body, con):
    user = con.execute("SELECT * FROM users WHERE id=%s", (str(body.get("id", "")),)).fetchone()
    if not user or user["password"] != str(body.get("user_password", "")):
        return {"message": "Invalid credentials", "guid": None}
    guid = uuid.uuid4().hex
    con.execute("INSERT INTO auth_tokens (guid, user_id) VALUES (%s,%s) ON CONFLICT (guid) DO NOTHING", (guid, user["id"]))
    con.commit()
    return {"message": "Login successful", "guid": guid, "brand_name": "infoEIGHT",
            "copyright_content": "", "links": [], "tagline": "School ERP — test stub",
            "logo": "", "is_allowed_for_remote_login": True}


def _profile_block(prof, schools_cache: dict, sessions_cache: dict) -> dict:
    school = schools_cache.get(prof["school_id"])
    sessions = sessions_cache.get(prof["school_id"], [])
    school_block = None
    if school:
        school_block = {
            "id": school["id"], "name": school["name"],
            "city": {"id": "128", "name": school["city"]},
            "logo_url": school["logo_url"], "meta_data": school["meta_data"],
            "display_session_selection": True, "client_id": school["client_id"],
            "sessions": [session_meta(s) for s in sessions],
        }
    return {"id": prof["id"], "name": prof["name"], "image_url": prof["image_url"],
            "meta_data": prof["meta_data"],
            "schools": [school_block] if school_block else [],
            "message": ""}


def h_get_profiles(body, con):
    uid = str(body.get("id") or "")
    guid = str(body.get("guid") or "")
    user = con.execute("SELECT * FROM users WHERE id=%s", (uid,)).fetchone()
    if not user:
        return {"message": "User not found"}
    tok = con.execute("SELECT 1 FROM auth_tokens WHERE guid=%s AND user_id=%s", (guid, uid)).fetchone()
    if not tok:
        return {"message": "Invalid session"}
    profs = con.execute(
        """SELECT p.* FROM user_profiles up JOIN profiles p ON p.id=up.profile_id
           WHERE up.user_id=%s ORDER BY up.position""", (uid,)).fetchall()
    schools = {s["id"]: s for s in con.execute("SELECT * FROM schools").fetchall()}
    sessions: dict[str, list] = {}
    for s in con.execute("SELECT * FROM sessions ORDER BY start_date DESC").fetchall():
        sessions.setdefault(s["school_id"], []).append(s)
    blocks = [_profile_block(p, schools, sessions) for p in profs]
    return {"id": user["id"], "name": user["name"], "profile": blocks[0] if blocks else None,
            "image_url": user["image_url"], "meta_data": blocks[0]["meta_data"] if blocks else "",
            "blank_state": False, "copyright_content": "", "channels": [], "links": [],
            "profiles": blocks, "online_admission_profiles": []}


STANDARD_LEVELS = ["PRE NURSERY", "NURSERY", "LKG", "UKG"] + [str(i) for i in range(1, 13)]
BOARDS = [{"id": "2", "name": "CBSE"}, {"id": "3", "name": "ICSE"}, {"id": "1", "name": "State Board"}]
PAYMENT_MODES = [{"id": "1", "name": "cash"}, {"id": "2", "name": "cheque"}, {"id": "3", "name": "online"},
                 {"id": "4", "name": "card"}, {"id": "5", "name": "bank"}]
PRODUCTS = ["STUDENT MANAGEMENT", "STAFF MANAGEMENT", "STANDARD MANAGEMENT", "ONLINE FEE", "ATTENDANCE",
            "REPORT CARD", "LIBRARY", "TRANSPORT", "SMS", "CIRCULAR", "HOMEWORK", "QUIZ", "NOTICE",
            "TIMETABLE", "EXAM", "HOUSE", "BIRTHDAY", "ID CARD", "ADMISSION", "ACCOUNTS", "PAYOUT",
            "CONCESSION", "LATE FEE", "WAIVE OFF", "ONLINE CLASS", "MEETING", "CALENDAR", "DOCUMENTS",
            "CERTIFICATE", "REWARD POINTS", "SCHOOL BUS", "FEE TYPE", "DEPARTMENT", "DESIGNATION",
            "ROLES", "TITLES"]


def h_get_dashboard(body, con):
    profile_id = str(body.get("user_account_id") or "")
    client_id = str(body.get("client_id") or "")
    sess = con.execute("SELECT * FROM sessions WHERE client_id=%s", (client_id,)).fetchone()
    if not sess:
        sess = con.execute("SELECT * FROM sessions WHERE is_current ORDER BY start_date DESC LIMIT 1").fetchone()
    school = con.execute("SELECT * FROM schools WHERE id=%s", (sess["school_id"],)).fetchone()
    prof = con.execute("SELECT * FROM profiles WHERE id=%s", (profile_id,)).fetchone() if profile_id else None
    all_sessions = con.execute(
        "SELECT * FROM sessions WHERE school_id=%s ORDER BY start_date DESC", (school["id"],)).fetchall()
    standards = con.execute(
        "SELECT id, name FROM standards WHERE school_id=%s ORDER BY sort_order", (school["id"],)).fetchall()
    return {
        "id": school["id"], "is_subscription_available": True, "auto_increment_admission_number": "0",
        "allow_future_date_in_fee": "0", "auto_fee_receipt_download": "0",
        "download_duplicate_fee_receipt": "1", "duplicate_fee_receipt_side_by_side": "0",
        "is_subscribed": True, "subscription": {"name": "TEST"}, "subscription_text": "Test stub",
        "package": None, "img_principal_message": "", "img_header": "",
        "session_start_date": str(sess["start_date"]), "session_end_date": str(sess["end_date"]),
        "notice_types": [{"id": "1", "name": "General"}, {"id": "2", "name": "Holiday"}],
        "student_sms_types": [], "user_sms_types": [],
        "sms_balance": {"count": str(school["sms_balance"]), "color": "#FF0000"},
        "standard_levels": [{"id": str(41000 + i + 1), "name": n} for i, n in enumerate(STANDARD_LEVELS)],
        "boards": BOARDS,
        "standards": standards,
        "classes": [dict(r) for r in con.execute(
            "SELECT id, name, section, standard_id FROM classes WHERE school_id=%s ORDER BY name", (school["id"],)).fetchall()],
        "users": [], "members": [], "payment_modes": PAYMENT_MODES, "card_values": [],
        "field_sections": [], "enquiry_sources": [], "balance_reward_points": 0,
        "school": {
            "id": school["id"], "full_name": school["name"] + ", " + school["city"],
            "img_logo": school["logo_url"], "board": {"id": "2", "name": school["board"]},
            "sessions": [session_meta(s) for s in all_sessions],
        },
        "year": {"id": sess["id"], "name": sess["name"], "session": sess["session"]},
        "profile": ({"id": prof["id"], "type": (prof["role"] or "").lower(),
                     "product": {"id": "29", "name": "STUDENT MANAGEMENT"},
                     "name": prof["name"], "user_account_id": prof["id"]} if prof else None),
    }


# ---------------------------------------------------------------- role gate

ADMIN_APIS = {
    "standard.getList", "standardLevel.getList", "classRoom.getList", "grade.getList",
    "subject.getList", "feeType.getList", "house.getList", "department.getList",
    "schoolDesignation.getList", "schoolRole.getList", "userTitle.getList", "eventType.getList",
    "bank.getList", "student.getList", "studentRecord.getList", "user.getList",
    "studentParent.getList", "client.getPermissions", "client.getClassSubjectMapping",
    "client.getMonthWiseBirthdayList", "client.getRecentBirthdayList", "client.getFeeTypeStudents",
    "feeType.getStudents", "fee.getDetails", "book.getList", "borrower.getList",
    "payout.getList", "schoolBus.getList", "schoolBus.getStudents", "location.getList",
    "mobiPackage.getList", "waiveOffLateFee.getList", "client.getDailyAttendanceReport",
    "client.getFeeCollections", "client.getFeeCollectionSummary", "client.getFeeNameWiseSummary",
    "client.getFeePaymentDetails", "classRoom.getAttendance", "classRoom.getResult",
    "classRoom.getFeeDefaulters", "client.getFeeDefaulters",
}


def caller_role(con, profile_id: str) -> str:
    if not profile_id:
        return ""
    row = con.execute("SELECT role FROM profiles WHERE id=%s", (str(profile_id),)).fetchone()
    return (row["role"] or "") if row else ""


# ---------------------------------------------------------------- read handlers (lists)

def h_standard_list(body, con):
    rows = con.execute("""SELECT s.id, s.name,
        (SELECT count(*) FROM students st JOIN classes c ON c.id=st.class_id
          WHERE c.standard_id=s.id AND st.session_id=(SELECT id FROM sessions WHERE is_current LIMIT 1)) AS total_students
        FROM standards s WHERE s.school_id=%s ORDER BY s.sort_order""", (SCHOOL_ID,)).fetchall()
    out = []
    for r in rows:
        classes = con.execute(
            "SELECT c.id, c.section, (SELECT count(*) FROM students st WHERE st.class_id=c.id) AS n "
            "FROM classes c WHERE c.standard_id=%s ORDER BY c.section", (r["id"],)).fetchall()
        out.append({"id": r["id"], "name": r["name"],
                    "student_count": {"MALE": 0, "FEMALE": 0},
                    "classes": [{"id": c["id"], "section": c["section"],
                                 "number_of_students": c["n"]} for c in classes]})
    return L("standards", out)


def h_standard_level_list(body, con):
    rows = con.execute("SELECT id, name FROM standards WHERE school_id=%s ORDER BY sort_order", (SCHOOL_ID,)).fetchall()
    return L("standard_levels", [{"id": r["id"], "name": r["name"]} for r in rows])


def h_class_list(body, con):
    sess = con.execute("SELECT id FROM sessions WHERE is_current LIMIT 1").fetchone()
    rows = con.execute("""
        SELECT c.id, c.name, c.section, st.id AS std_id, st.name AS std_name,
               t.id AS teacher_id, t.name AS teacher_name,
               (SELECT count(*) FROM students s WHERE s.class_id=c.id AND s.session_id=%s) AS n,
               (SELECT count(*) FROM students s WHERE s.class_id=c.id AND s.session_id=%s AND s.gender='male') AS nm,
               (SELECT count(*) FROM students s WHERE s.class_id=c.id AND s.session_id=%s AND s.gender='female') AS nf
        FROM classes c JOIN standards st ON st.id=c.standard_id
        LEFT JOIN staff t ON t.id=c.class_teacher_id
        WHERE c.school_id=%s ORDER BY st.sort_order, c.section""",
        (sess["id"], sess["id"], sess["id"], SCHOOL_ID)).fetchall()
    out = []
    for r in rows:
        out.append({"id": r["id"], "name": r["name"],
                    "student_count": {"MALE": r["nm"], "FEMALE": r["nf"]},
                    "total_students": r["n"],
                    "standard": {"id": r["std_id"], "name": r["std_name"]},
                    "section": r["section"],
                    "class_teacher": ({"id": r["teacher_id"], "name": r["teacher_name"]} if r["teacher_id"] else None),
                    "school": {"id": SCHOOL_ID, "name": "DEMO MODEL SCHOOL (TEST)"}})
    return L("class_rooms", out, count=len(out))


def h_grade_list(body, con):
    return L("grades", [{"id": str(60000 + i), "name": g} for i, g in enumerate(
        ["A+", "A", "B+", "B", "C+", "C", "D", "E", "F", "NA"])])


def h_subject_list(body, con):
    rows = con.execute("SELECT id, name, code FROM subjects WHERE school_id=%s ORDER BY name", (SCHOOL_ID,)).fetchall()
    return L("subjects", [{"id": r["id"], "name": r["name"], "code": r["code"]} for r in rows])


def h_fee_type_list(body, con):
    rows = con.execute("SELECT * FROM fee_types WHERE school_id=%s ORDER BY id", (SCHOOL_ID,)).fetchall()
    return L("fee_types", [{
        "id": r["id"], "serial_number": str(i + 1), "name": r["name"],
        "code": "".join(w[0] for w in r["name"].split())[:3].upper(),
        "client": {"id": SCHOOL_ID, "school": {"id": SCHOOL_ID, "full_name": "DEMO MODEL SCHOOL (TEST)"}},
        "category": "Mandatory" if r["name"] != "Transport Fee" else "Optional",
        "is_variable": "0", "amount": float(r["amount"]),
    } for i, r in enumerate(rows)])


def h_house_list(body, con):
    rows = con.execute("SELECT * FROM houses WHERE school_id=%s", (SCHOOL_ID,)).fetchall()
    return L("houses", [{"id": r["id"], "name": r["name"], "color": r["color"]} for r in rows])


def h_department_list(body, con):
    rows = con.execute("SELECT id, name FROM departments WHERE school_id=%s", (SCHOOL_ID,)).fetchall()
    return L("departments", [{"id": r["id"], "name": r["name"]} for r in rows])


def h_designation_list(body, con):
    rows = con.execute("SELECT id, name FROM designations WHERE school_id=%s", (SCHOOL_ID,)).fetchall()
    return L("school_designations", [{"id": r["id"], "name": r["name"],
                                      "is_allowed_for_admin_access": "0", "priority": str(i + 1)}
                                     for i, r in enumerate(rows)])


def h_school_role_list(body, con):
    roles = ["Admin", "Principal", "Vice Principal", "Teacher", "Accountant", "Librarian", "Parent"]
    return L("school_roles", [{"id": str(63000 + i), "name": r} for i, r in enumerate(roles)])


def h_title_list(body, con):
    rows = con.execute("SELECT id, name FROM titles WHERE school_id=%s", (SCHOOL_ID,)).fetchall()
    return L("user_titles", [{"id": r["id"], "name": r["name"]} for r in rows])


def h_event_type_list(body, con):
    return L("event_types", [{"id": "64", "name": "holiday", "description": None, "color": "#000000"},
                             {"id": "65", "name": "vacation", "description": None, "color": "#43A047"},
                             {"id": "66", "name": "event", "description": None, "color": "#1E88E5"}])


BANKS = ["State Bank of India", "Punjab National Bank", "HDFC Bank", "ICICI Bank", "Axis Bank",
         "Bank of Baroda", "Canara Bank", "Union Bank of India", "Yes Bank", "Kotak Mahindra Bank"]

def h_bank_list(body, con):
    return L("banks", [{"id": str(64000 + i), "name": b, "code": b, "sector": "PUBLIC" if i < 6 else "PRIVATE"}
                       for i, b in enumerate(BANKS)])


def h_student_list(body, con):
    sess = con.execute("SELECT id FROM sessions WHERE is_current LIMIT 1").fetchone()
    rows = con.execute("""
        SELECT s.*, c.name AS class_name, st.id AS std_id, st.name AS std_name
        FROM students s JOIN classes c ON c.id=s.class_id JOIN standards st ON st.id=c.standard_id
        WHERE s.session_id=%s ORDER BY st.sort_order, c.section, s.roll_number""", (sess["id"],)).fetchall()
    out = [{
        "id": r["id"], "name": r["name"], "admission_number": r["admission_number"],
        "class": {"id": r["class_id"], "name": r["class_name"],
                  "standard": {"id": r["std_id"], "name": r["std_name"]}},
        "roll_number": r["roll_number"], "image_url": r["image_url"] or None,
        "status": r["status"], "school": {"id": SCHOOL_ID, "name": "DEMO MODEL SCHOOL (TEST)"},
        "student_fee_category": r["fee_category"], "background_color": "#FFFFFF",
        "registered_phone_for_sms": r["phone"], "calling_numbers": [{"number": r["phone"]}],
        "options": [], "display_native_ad": True,
    } for r in rows]
    return L("students", out, count=len(out), filters=[], fields=[])


def h_user_list(body, con):
    rows = con.execute("SELECT * FROM staff WHERE school_id=%s ORDER BY id", (SCHOOL_ID,)).fetchall()
    out = [{
        "id": r["id"], "name": r["name"], "full_name": r["name"], "gender": (r["gender"] or "").upper(),
        "class": None,
        "designation": {"id": "68859", "name": (r["designation"] or r["role"]).upper(),
                        "is_allowed_for_admin_access": "0", "priority": "1"},
        "school_designation": {"name": r["designation"] or r["role"]},
        "department": {"name": r["department"]}, "role": r["role"],
        "phone": r["phone"], "email": r["email"], "status": r["status"],
    } for r in rows]
    return L("users", out, count=len(out))


def h_student_parent_list(body, con):
    rows = con.execute("""
        SELECT sp.student_id, sp.relation, p.id AS parent_id, p.name, p.phone, p.occupation,
               s.name AS student_name, c.name AS class_name
        FROM student_parents sp JOIN parents p ON p.id=sp.parent_id
        JOIN students s ON s.id=sp.student_id JOIN classes c ON c.id=s.class_id
        ORDER BY s.name LIMIT 500""").fetchall()
    out = [{"id": r["parent_id"], "name": r["name"], "phone": r["phone"],
            "occupation": r["occupation"], "relation": r["relation"],
            "student": {"id": r["student_id"], "name": r["student_name"], "class": {"name": r["class_name"]}}}
           for r in rows]
    return L("student_parents", out, count=len(out))


def h_student_record_list(body, con):
    sess = con.execute("SELECT id FROM sessions WHERE is_current LIMIT 1").fetchone()
    rows = con.execute("""
        SELECT s.id, s.name, s.roll_number, s.admission_number, c.name AS class_name, s.status
        FROM students s JOIN classes c ON c.id=s.class_id WHERE s.session_id=%s
        ORDER BY c.name, s.roll_number""", (sess["id"],)).fetchall()
    out = [{"id": r["id"], "name": r["name"], "roll_number": r["roll_number"],
            "admission_number": r["admission_number"], "class": {"name": r["class_name"]},
            "status": r["status"]} for r in rows]
    return L("student_records", out, count=len(out))


def h_notice_list(body, con):
    rows = con.execute("""SELECT n.*, s.session FROM notices n JOIN sessions s ON s.id=n.session_id
                          WHERE n.school_id=%s ORDER BY n.published_on DESC""", (SCHOOL_ID,)).fetchall()
    out = [{"id": r["id"], "title": r["title"],
            "school": {"id": SCHOOL_ID, "name": "DEMO MODEL SCHOOL (TEST)"},
            "datetime": f"{r['published_on']} 10:00:00",
            "display_datetime": r["published_on"].strftime("%a %d-%b %I:%M %p"),
            "message": r["body"], "audience": r["audience"],
            "sent_by": {"id": "700001", "name": "ANINDITA SINHA"}} for r in rows]
    return L("notices", out, count=len(out))


def h_homework_list(body, con):
    rows = con.execute("""SELECT h.*, sub.name AS subject_name FROM homework h
                          JOIN subjects sub ON sub.id=h.subject_id
                          ORDER BY h.assigned_on DESC LIMIT 200""").fetchall()
    out = [{"id": r["id"], "title": r["title"], "subjects": [{"id": r["subject_id"], "name": r["subject_name"]}],
            "datetime": f"{r['assigned_on']} 09:00:00", "deadline": str(r["due_date"]),
            "message": r["description"], "sent_by": {"id": "700001", "name": "ANINDITA SINHA"}}
           for r in rows]
    return L("homework_reminders", out, count=len(out))


def h_quiz_list(body, con):
    rows = con.execute("""SELECT q.*, st.name AS std_name, sub.name AS subj_name FROM quizzes q
                          JOIN classes c ON c.id=q.class_id JOIN standards st ON st.id=c.standard_id
                          JOIN subjects sub ON sub.id=q.subject_id
                          ORDER BY q.scheduled_on DESC LIMIT 200""").fetchall()
    out = [{"id": r["id"], "name": r["title"], "full_name": r["title"],
            "standard": {"id": r["class_id"], "name": r["std_name"]},
            "subject": {"name": r["subj_name"]},
            "reporting_time": f"{r['scheduled_on']} 10:00:00",
            "created_at": f"{r['scheduled_on']} 09:00:00",
            "user": {"id": "700001", "name": "ANINDITA SINHA"}} for r in rows]
    return L("quizzes", out, count=len(out))


def h_book_list(body, con):
    rows = con.execute("SELECT * FROM books WHERE school_id=%s ORDER BY id", (SCHOOL_ID,)).fetchall()
    out = [{"id": r["id"], "title": r["title"], "entry_time": "2024-06-01 10:00:00",
            "access_number": None, "class_number": None, "call_number": None, "isbn": None,
            "image_url": None, "description": "--", "authors": [{"name": r["author"]}] if r["author"] else [],
            "publisher": {"name": ""}, "copies": r["copies"], "available": r["available"]}
           for r in rows]
    return L("books", out, count=len(out))


def h_borrower_list(body, con):
    rows = con.execute("""SELECT bi.*, b.title, s.name AS student_name FROM book_issues bi
                          JOIN books b ON b.id=bi.book_id JOIN students s ON s.id=bi.student_id
                          ORDER BY bi.issue_date DESC LIMIT 200""").fetchall()
    out = [{"id": r["id"], "student": {"id": r["student_id"], "name": r["student_name"]},
            "book": {"id": r["book_id"], "title": r["title"]},
            "issue_date": str(r["issue_date"]), "due_date": str(r["due_date"]),
            "return_date": str(r["return_date"]) if r["return_date"] else None,
            "status": r["status"]} for r in rows]
    return L("borrowers", out, count=len(out))


def h_meeting_list(body, con):
    rows = con.execute("""SELECT m.*, c.name AS class_name FROM meetings m
                          LEFT JOIN classes c ON c.id=m.class_id
                          WHERE m.school_id=%s ORDER BY m.meeting_date DESC""", (SCHOOL_ID,)).fetchall()
    out = [{"id": r["id"], "title": r["title"], "subject": r["subject"],
            "class": {"name": r["class_name"]}, "date": str(r["meeting_date"]),
            "start_time": r["start_time"], "link": r["link"]} for r in rows]
    return L("meetings", out, count=len(out))


def h_event_list(body, con):
    rows = con.execute("""SELECT e.*, s.session FROM events e JOIN sessions s ON s.id=e.session_id
                          WHERE e.school_id=%s ORDER BY e.start_date""", (SCHOOL_ID,)).fetchall()
    out = [{"id": r["id"], "title": r["title"], "type": r["type"],
            "start_date": str(r["start_date"]), "end_date": str(r["end_date"])} for r in rows]
    return L("events", out, count=len(out))


def h_notification_list(body, con):
    rows = con.execute("SELECT * FROM notifications WHERE school_id=%s ORDER BY created_at DESC", (SCHOOL_ID,)).fetchall()
    out = [{"id": r["id"], "title": r["title"], "message": r["body"],
            "datetime": r["created_at"].strftime("%Y-%m-%d %H:%M:%S"),
            "display_datetime": r["created_at"].strftime("%a %d-%b %I:%M %p"), "read": False} for r in rows]
    return L("notifications", out, count=len(out))


def h_schoolbus_list(body, con):
    rows = con.execute("SELECT * FROM buses WHERE school_id=%s", (SCHOOL_ID,)).fetchall()
    out = [{"id": r["id"], "name": r["name"], "route": r["route"],
            "driver_name": r["driver_name"], "driver_phone": r["driver_phone"],
            "students_count": con.execute("SELECT count(*) AS n FROM bus_students WHERE bus_id=%s",
                                          (r["id"],)).fetchone()["n"]} for r in rows]
    return L("school_buses", out, count=len(out))


def h_bus_students(body, con):
    bus_id = str(body.get("id") or body.get("bus_id") or "")
    if not bus_id:
        return {"message": "Please pass the id of the bus"}
    rows = con.execute("""SELECT bs.*, s.name, s.roll_number, c.name AS class_name
                          FROM bus_students bs JOIN students s ON s.id=bs.student_id
                          JOIN classes c ON c.id=s.class_id WHERE bs.bus_id=%s""", (bus_id,)).fetchall()
    return L("students", [{"id": r["student_id"], "name": r["name"], "roll_number": r["roll_number"],
                           "class": {"name": r["class_name"]}, "location": r["location"]} for r in rows],
             count=len(rows))


def h_payout_list(body, con):
    return L("payouts", [], count=0)


def h_location_list(body, con):
    return L("locations", [], count=0)


def h_waive_list(body, con):
    return L("waive_off_late_fees", [], count=0)


def h_mobi_list(body, con):
    names = ["Attendance", "Fees", "Homework", "Quiz", "Notice", "Report Card", "Timetable",
             "Library", "Transport", "Birthday", "Events"]
    return L("mobi_packages", [{"id": str(65000 + i), "name": n} for i, n in enumerate(names)])


def h_client_permissions(body, con):
    return {"products": [{"id": str(66000 + i), "name": n} for i, n in enumerate(PRODUCTS)],
            "message": None, "count": None, "header_options": [], "filters": [], "fields": []}


def h_class_subject_mapping(body, con):
    rows = con.execute("""
        SELECT c.id AS class_id, c.name AS class_name, s.id AS sub_id, s.name AS sub_name,
               t.id AS teacher_id, t.name AS teacher_name
        FROM class_subjects cs JOIN classes c ON c.id=cs.class_id
        JOIN subjects s ON s.id=cs.subject_id LEFT JOIN staff t ON t.id=cs.teacher_id
        ORDER BY c.name, s.name""").fetchall()
    grouped: dict[str, dict] = {}
    for r in rows:
        g = grouped.setdefault(r["class_id"], {"class": {"id": r["class_id"], "name": r["class_name"]}, "subjects": []})
        g["subjects"].append({"id": r["sub_id"], "name": r["sub_name"],
                              "teacher": ({"id": r["teacher_id"], "name": r["teacher_name"]} if r["teacher_id"] else None)})
    return L("class_subjects", list(grouped.values()), count=len(grouped))


def h_fee_type_students(body, con):
    ft_id = str(body.get("fee_type_id") or body.get("id") or "")
    if not ft_id:
        return {"message": "Please pass the fee type id"}
    rows = con.execute("""
        SELECT sf.student_id, s.name, s.roll_number, c.name AS class_name, sf.amount, sf.paid_amount, sf.status
        FROM student_fees sf JOIN students s ON s.id=sf.student_id JOIN classes c ON c.id=s.class_id
        WHERE sf.fee_type_id=%s AND sf.session_id=(SELECT id FROM sessions WHERE is_current LIMIT 1)
        ORDER BY c.name, s.roll_number LIMIT 500""", (ft_id,)).fetchall()
    out = [{"id": r["student_id"], "name": r["name"], "roll_number": r["roll_number"],
            "class": {"name": r["class_name"]}, "amount": float(r["amount"]),
            "paid_amount": float(r["paid_amount"]), "status": r["status"]} for r in rows]
    return L("items", out, count=len(out), filters=[], header=[
        {"action": "filter", "label": "search", "redirect_url": None, "api": None, "alert": None},
        {"action": "add", "label": "add", "redirect_url": None, "api": "feeType.addStudent", "alert": None}])


def h_client_fee_type_students(body, con):
    return h_fee_type_students(body, con)


def h_birthdays_month(body, con):
    rows = con.execute("""SELECT s.id, s.name, s.dob, c.name AS class_name,
                          EXTRACT(MONTH FROM s.dob)::int AS m
                          FROM students s JOIN classes c ON c.id=s.class_id
                          WHERE s.dob IS NOT NULL ORDER BY m, s.dob""").fetchall()
    months: dict[int, list] = {}
    for r in rows:
        months.setdefault(r["m"], []).append({"id": r["id"], "name": r["name"],
                                              "dob": str(r["dob"]), "class": {"name": r["class_name"]}})
    data = [{"month": m, "month_name": date(2026, m, 1).strftime("%B"),
             "count": len(v), "students": v} for m, v in sorted(months.items())]
    return {"birthday_data": data, "message": None, "count": None, "header_options": [], "filters": [], "fields": []}


def h_birthdays_recent(body, con):
    today = date(2026, 10, 6)
    rows = con.execute("""SELECT s.id, s.name, s.dob, c.name AS class_name
                          FROM students s JOIN classes c ON c.id=s.class_id
                          WHERE EXTRACT(MONTH FROM s.dob) IN (10, 11)
                          ORDER BY s.dob LIMIT 50""").fetchall()
    out = [{"id": r["id"], "name": r["name"], "dob": str(r["dob"]),
            "class": {"name": r["class_name"]}} for r in rows]
    return {"recent_birthdays": out, "message": None, "count": len(out),
            "header_options": [], "filters": [], "fields": []}


def h_siblings(body, con):
    class_ids = body.get("class_ids") or []
    if isinstance(class_ids, list) and len(class_ids) > 5:
        return {"message": "Please select maximum of 5 classes"}
    rows = con.execute("""
        SELECT s1.id AS a_id, s1.name AS a_name, s2.id AS b_id, s2.name AS b_name, p.id AS parent_id
        FROM student_parents sp1 JOIN student_parents sp2 ON sp1.parent_id=sp2.parent_id AND sp1.student_id < sp2.student_id
        JOIN parents p ON p.id=sp1.parent_id
        JOIN students s1 ON s1.id=sp1.student_id JOIN students s2 ON s2.id=sp2.student_id
        GROUP BY s1.id, s1.name, s2.id, s2.name, p.id LIMIT 100""").fetchall()
    out = [{"parent_id": r["parent_id"],
            "students": [{"id": r["a_id"], "name": r["a_name"]}, {"id": r["b_id"], "name": r["b_name"]}]}
           for r in rows]
    return {"siblings": out, "message": None, "count": len(out), "header_options": [], "filters": [], "fields": []}


def h_daily_attendance_report(body, con):
    rows = con.execute("""
        SELECT c.id, c.name,
          count(*) FILTER (WHERE a.status='present') AS present,
          count(*) FILTER (WHERE a.status='absent') AS absent,
          count(*) FILTER (WHERE a.status IN ('late','half_day')) AS late,
          max(a.date) AS on_date
        FROM attendance a JOIN classes c ON c.id=a.class_id
        GROUP BY c.id, c.name ORDER BY c.name""").fetchall()
    out = [{"class": {"id": r["id"], "name": r["name"]}, "present": r["present"],
            "absent": r["absent"], "late": r["late"], "date": str(r["on_date"])} for r in rows]
    return {"attendance": out, "message": None, "count": len(out), "header_options": [], "filters": [], "fields": []}


def _fee_summary(con, mode_key: str):
    sess = con.execute("SELECT id FROM sessions WHERE is_current LIMIT 1").fetchone()
    rows = con.execute("""
        SELECT ft.name,
          COALESCE(sum(fp.amount) FILTER (WHERE fp.mode='cash'),0) AS cash_amount,
          COALESCE(sum(fp.amount) FILTER (WHERE fp.mode='cheque'),0) AS cheque_amount,
          COALESCE(sum(fp.amount) FILTER (WHERE fp.mode='online'),0) AS online_amount,
          COALESCE(sum(fp.amount) FILTER (WHERE fp.mode='card'),0) AS card_amount,
          COALESCE(sum(fp.amount) FILTER (WHERE fp.mode='bank'),0) AS bank_amount,
          COALESCE(sum(sf.amount),0) AS total_amount,
          COALESCE(sum(sf.paid_amount),0) AS collected_amount
        FROM student_fees sf JOIN fee_types ft ON ft.id=sf.fee_type_id
        LEFT JOIN fee_payments fp ON fp.student_fee_id=sf.id
        WHERE sf.session_id=%s GROUP BY ft.name ORDER BY ft.name""", (sess["id"],)).fetchall()
    return [{"name": r["name"],
             "cash_amount": float(r["cash_amount"]), "quarter_wise_cash_students": 0,
             "cheque_amount": float(r["cheque_amount"]), "quarter_wise_cheque_students": 0,
             "online_amount": float(r["online_amount"]), "quarter_wise_online_students": 0,
             "card_amount": float(r["card_amount"]), "quarter_wise_card_students": 0,
             "bank_amount": float(r["bank_amount"]), "quarter_wise_bank_students": 0,
             "total_amount": float(r["total_amount"]), "collected_amount": float(r["collected_amount"])}
            for r in rows]


def h_fee_name_wise(body, con):
    return {"fee_name_data": _fee_summary(con, "name"), "message": None, "count": None,
            "header_options": [], "filters": [], "fields": []}


def h_fee_collection_summary(body, con):
    data = _fee_summary(con, "name")
    total = sum(d["collected_amount"] for d in data)
    return {"fee_collection_data": data, "total_collected": total, "message": None,
            "count": None, "header_options": [], "filters": [], "fields": []}


def h_fee_collections(body, con):
    rows = con.execute("""SELECT fp.*, sf.student_id, s.name AS student_name FROM fee_payments fp
                          JOIN student_fees sf ON sf.id=fp.student_fee_id
                          JOIN students s ON s.id=sf.student_id ORDER BY fp.paid_at DESC LIMIT 200""").fetchall()
    out = [{"id": r["id"], "receipt_no": r["receipt_no"], "amount": float(r["amount"]),
            "mode": r["mode"], "paid_at": str(r["paid_at"]),
            "student": {"id": r["student_id"], "name": r["student_name"]}} for r in rows]
    return {"fee_collections": out, "message": None, "count": len(out),
            "header_options": [], "filters": [], "fields": []}


def h_fee_payment_details(body, con):
    return h_fee_collections(body, con)


def h_fee_details(body, con):
    ft_id = str(body.get("id") or body.get("fee_id") or "")
    if not ft_id or ft_id.startswith("20") or ft_id.startswith("208"):
        return {"message": "Please pass the fee id."}
    rows = con.execute("""SELECT * FROM student_fees WHERE fee_type_id=%s
                          AND session_id=(SELECT id FROM sessions WHERE is_current LIMIT 1) LIMIT 200""",
                       (ft_id,)).fetchall()
    return {"fee_details": [{"id": r["id"], "student_id": r["student_id"], "amount": float(r["amount"]),
                             "paid_amount": float(r["paid_amount"]), "status": r["status"]} for r in rows],
            "message": None, "count": len(rows), "header_options": [], "filters": [], "fields": []}


# ---------------------------------------------------------------- read handlers (details)

def h_student_details(body, con):
    sid = str(body.get("student_id") or body.get("id") or "")
    r = con.execute("""SELECT s.*, c.name AS class_name, st.id AS std_id, st.name AS std_name,
                       h.name AS house_name FROM students s JOIN classes c ON c.id=s.class_id
                       JOIN standards st ON st.id=c.standard_id LEFT JOIN houses h ON h.id=s.house_id
                       WHERE s.id=%s""", (sid,)).fetchone()
    if not r:
        return {"message": "Student not found"}
    parents = con.execute("""SELECT p.*, sp.relation FROM student_parents sp JOIN parents p ON p.id=sp.parent_id
                             WHERE sp.student_id=%s""", (sid,)).fetchall()
    return {"student": {"id": r["id"], "name": r["name"], "admission_number": r["admission_number"],
                        "roll_number": r["roll_number"], "gender": r["gender"], "dob": str(r["dob"]),
                        "phone": r["phone"], "fee_category": r["fee_category"],
                        "house": {"name": r["house_name"]},
                        "class": {"id": r["class_id"], "name": r["class_name"],
                                  "standard": {"id": r["std_id"], "name": r["std_name"]}},
                        "parents": [{"id": p["id"], "name": p["name"], "phone": p["phone"],
                                     "relation": p["relation"], "occupation": p["occupation"]} for p in parents]}}


def h_student_result(body, con):
    sid = str(body.get("student_id") or body.get("id") or "")
    rows = con.execute("""SELECT em.marks, em.grade, e.name AS exam_name, e.exam_date, e.max_marks,
                          sub.name AS subject_name FROM exam_marks em
                          JOIN exams e ON e.id=em.exam_id JOIN subjects sub ON sub.id=e.subject_id
                          WHERE em.student_id=%s ORDER BY e.exam_date, sub.name""", (sid,)).fetchall()
    out = [{"exam": r["exam_name"], "subject": r["subject_name"], "marks": float(r["marks"]),
            "max_marks": r["max_marks"], "grade": r["grade"], "date": str(r["exam_date"])} for r in rows]
    return {"result": out, "message": None, "count": len(out), "header_options": [], "filters": [], "fields": []}


def h_student_attendance_detail(body, con):
    sid = str(body.get("student_id") or body.get("id") or "")
    r = con.execute("""SELECT count(*) AS total,
                       count(*) FILTER (WHERE status='present') AS present,
                       count(*) FILTER (WHERE status='absent') AS absent,
                       count(*) FILTER (WHERE status='late') AS late,
                       count(*) FILTER (WHERE status='half_day') AS half_day
                       FROM attendance WHERE student_id=%s""", (sid,)).fetchone()
    pct = round(100.0 * r["present"] / r["total"], 1) if r["total"] else 0
    return {"attendance": {"total": r["total"], "present": r["present"], "absent": r["absent"],
                           "late": r["late"], "half_day": r["half_day"], "percentage": pct}}


def h_student_fee_details(body, con):
    sid = str(body.get("student_id") or body.get("id") or "")
    rows = con.execute("""SELECT sf.*, ft.name AS fee_name FROM student_fees sf
                          JOIN fee_types ft ON ft.id=sf.fee_type_id
                          WHERE sf.student_id=%s ORDER BY ft.name""", (sid,)).fetchall()
    out = [{"id": r["id"], "fee": r["fee_name"], "amount": float(r["amount"]),
            "paid_amount": float(r["paid_amount"]), "status": r["status"],
            "due_date": str(r["due_date"]), "paid_at": str(r["paid_at"]) if r["paid_at"] else None} for r in rows]
    return {"fees": out, "message": None, "count": len(out), "header_options": [], "filters": [], "fields": []}


def h_calculate_late_fee(body, con):
    sid = str(body.get("student_id") or body.get("id") or "")
    rows = con.execute("""SELECT * FROM student_fees WHERE student_id=%s AND status='unpaid'""", (sid,)).fetchall()
    today = date(2026, 10, 6)
    items = []
    for r in rows:
        overdue_days = max(0, (today - r["due_date"]).days)
        items.append({"id": r["id"], "amount": float(r["amount"]),
                      "overdue_days": overdue_days, "late_fee": round(min(overdue_days, 90) * 5.0, 2)})
    return {"late_fees": items, "calculate_late_fee": items}


def h_standard_details(body, con):
    sid = str(body.get("standard_id") or body.get("id") or "")
    r = con.execute("SELECT id, name FROM standards WHERE id=%s", (sid,)).fetchone()
    if not r:
        return {"message": "Standard not found"}
    classes = con.execute("SELECT id, name, section FROM classes WHERE standard_id=%s", (sid,)).fetchall()
    return {"standard": {"id": r["id"], "name": r["name"],
                         "classes": [{"id": c["id"], "name": c["name"], "section": c["section"]} for c in classes]}}


def h_user_details(body, con):
    uid = str(body.get("id") or body.get("user_id") or "")
    r = con.execute("SELECT * FROM staff WHERE id=%s", (uid,)).fetchone()
    if not r:
        return {"message": "User not found"}
    return {"user": {"id": r["id"], "name": r["name"], "role": r["role"],
                     "designation": r["designation"], "department": r["department"],
                     "phone": r["phone"], "email": r["email"], "status": r["status"]}}


def h_permitted_classes(body, con):
    profile_id = str(body.get("user_account_id") or "")
    prof = con.execute("SELECT * FROM profiles WHERE id=%s", (profile_id,)).fetchone()
    if not prof:
        return L("classes", [], count=0)
    if prof["role"] in ("PRINCIPAL", "ADMIN", "VICE PRINCIPAL"):
        rows = con.execute("SELECT id, name FROM classes WHERE school_id=%s ORDER BY name", (SCHOOL_ID,)).fetchall()
    else:
        staff = con.execute("SELECT id FROM staff WHERE name=%s LIMIT 1", (prof["name"],)).fetchone()
        rows = con.execute("SELECT id, name FROM classes WHERE class_teacher_id=%s OR id IN "
                           "(SELECT class_id FROM class_subjects WHERE teacher_id=%s) ORDER BY name",
                           (staff["id"] if staff else "", staff["id"] if staff else "")).fetchall()
    return L("classes", [{"id": r["id"], "name": r["name"]} for r in rows], count=len(rows))


def h_homework_subjects(body, con):
    return h_subject_list(body, con)


def h_class_result(body, con):
    cid = str(body.get("class_id") or body.get("id") or "")
    rows = con.execute("""SELECT em.student_id, s.name, s.roll_number, sub.name AS subject_name,
                          e.name AS exam_name, em.marks, e.max_marks, em.grade
                          FROM exam_marks em JOIN exams e ON e.id=em.exam_id
                          JOIN subjects sub ON sub.id=e.subject_id
                          JOIN students s ON s.id=em.student_id
                          WHERE e.class_id=%s ORDER BY s.roll_number, sub.name LIMIT 500""", (cid,)).fetchall()
    out = [{"student": {"id": r["student_id"], "name": r["name"], "roll_number": r["roll_number"]},
            "subject": r["subject_name"], "exam": r["exam_name"],
            "marks": float(r["marks"]), "max_marks": r["max_marks"], "grade": r["grade"]} for r in rows]
    return {"result": out, "message": None, "count": len(out), "header_options": [], "filters": [], "fields": []}


def h_class_attendance(body, con):
    cid = str(body.get("class_id") or body.get("id") or "")
    on_date = con.execute("SELECT max(date) AS d FROM attendance WHERE class_id=%s", (cid,)).fetchone()["d"]
    rows = con.execute("""SELECT a.student_id, s.name, s.roll_number, a.status, a.date
                          FROM attendance a JOIN students s ON s.id=a.student_id
                          WHERE a.class_id=%s AND a.date=%s ORDER BY s.roll_number""", (cid, on_date)).fetchall()
    out = [{"student": {"id": r["student_id"], "name": r["name"], "roll_number": r["roll_number"]},
            "status": r["status"], "date": str(r["date"])} for r in rows]
    return {"attendance": out, "date": str(on_date), "message": None, "count": len(out),
            "header_options": [], "filters": [], "fields": []}


def h_class_fee_defaulters(body, con):
    cid = str(body.get("class_id") or body.get("id") or "")
    rows = con.execute("""SELECT s.id, s.name, s.roll_number,
                          sum(sf.amount - sf.paid_amount) AS due
                          FROM student_fees sf JOIN students s ON s.id=sf.student_id
                          WHERE s.class_id=%s AND sf.status IN ('unpaid','partial')
                          GROUP BY s.id, s.name, s.roll_number ORDER BY due DESC""", (cid,)).fetchall()
    out = [{"student": {"id": r["id"], "name": r["name"], "roll_number": r["roll_number"]},
            "due_amount": float(r["due"])} for r in rows]
    return {"fee_defaulters": out, "message": None, "count": len(out),
            "header_options": [], "filters": [], "fields": []}


def h_fee_defaulters(body, con):
    rows = con.execute("""SELECT s.id, s.name, s.roll_number, c.name AS class_name,
                          sum(sf.amount - sf.paid_amount) AS due
                          FROM student_fees sf JOIN students s ON s.id=sf.student_id
                          JOIN classes c ON c.id=s.class_id
                          WHERE sf.status IN ('unpaid','partial')
                          GROUP BY s.id, s.name, s.roll_number, c.name ORDER BY due DESC LIMIT 300""").fetchall()
    out = [{"student": {"id": r["id"], "name": r["name"], "roll_number": r["roll_number"],
                        "class": {"name": r["class_name"]}}, "due_amount": float(r["due"])} for r in rows]
    return {"fee_defaulters": out, "message": None, "count": len(out),
            "header_options": [], "filters": [], "fields": []}


# ---------------------------------------------------------------- write handlers (stub-local)

def h_mark_attendance(body, con):
    class_id = str(body.get("class_id") or "")
    entries = body.get("attendance") or body.get("students") or []
    sess = con.execute("SELECT id FROM sessions WHERE is_current LIMIT 1").fetchone()
    on_date = body.get("date") or str(date(2026, 10, 6))
    n = 0
    for e in entries if isinstance(entries, list) else []:
        sid = str(e.get("student_id") or e.get("id") or "")
        status = e.get("status") or "present"
        if sid:
            con.execute("""INSERT INTO attendance (student_id, class_id, session_id, date, status)
                           VALUES (%s,%s,%s,%s,%s) ON CONFLICT (student_id, date)
                           DO UPDATE SET status=EXCLUDED.status""", (sid, class_id, sess["id"], on_date, status))
            n += 1
    con.commit()
    return {"message": f"Attendance marked for {n} students", "marked": n}


def h_add_notice(body, con):
    sess = con.execute("SELECT id FROM sessions WHERE is_current LIMIT 1").fetchone()
    nid = str(900000 + int(time.time() * 10) % 100000)
    con.execute("""INSERT INTO notices (id, school_id, session_id, title, body, audience, published_on)
                   VALUES (%s,%s,%s,%s,%s,%s,%s)""",
                (nid, SCHOOL_ID, sess["id"], str(body.get("title") or "Notice"),
                 str(body.get("message") or body.get("body") or ""),
                 str(body.get("audience") or "all"), date(2026, 10, 6)))
    con.commit()
    return {"message": "Notice published", "id": nid}


def h_add_homework(body, con):
    sess = con.execute("SELECT id FROM sessions WHERE is_current LIMIT 1").fetchone()
    hid = str(910000 + int(time.time() * 10) % 100000)
    con.execute("""INSERT INTO homework (id, session_id, class_id, subject_id, title, description, assigned_on, due_date)
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s)""",
                (hid, sess["id"], str(body.get("class_id") or "50001"),
                 str(body.get("subject_id") or "42001"), str(body.get("title") or "Homework"),
                 str(body.get("message") or ""), date(2026, 10, 6), date(2026, 10, 10)))
    con.commit()
    return {"message": "Homework assigned", "id": hid}


# ---------------------------------------------------------------- dispatch

HANDLERS = {
    # auth
    "userAccount.getUserFromUserName": h_get_user_from_user_name,
    "userAccount.login": h_login,
    "userAccount.getProfiles": h_get_profiles,
    "client.getDashboard": h_get_dashboard,
    # lists
    "standard.getList": h_standard_list,
    "standardLevel.getList": h_standard_level_list,
    "classRoom.getList": h_class_list,
    "grade.getList": h_grade_list,
    "subject.getList": h_subject_list,
    "feeType.getList": h_fee_type_list,
    "house.getList": h_house_list,
    "department.getList": h_department_list,
    "schoolDesignation.getList": h_designation_list,
    "schoolRole.getList": h_school_role_list,
    "userTitle.getList": h_title_list,
    "eventType.getList": h_event_type_list,
    "bank.getList": h_bank_list,
    "student.getList": h_student_list,
    "studentRecord.getList": h_student_record_list,
    "user.getList": h_user_list,
    "studentParent.getList": h_student_parent_list,
    "notice.getList": h_notice_list,
    "homeworkReminder.getList": h_homework_list,
    "quiz.getList": h_quiz_list,
    "book.getList": h_book_list,
    "borrower.getList": h_borrower_list,
    "meeting.getList": h_meeting_list,
    "event.getList": h_event_list,
    "notification.getList": h_notification_list,
    "schoolBus.getList": h_schoolbus_list,
    "schoolBus.getStudents": h_bus_students,
    "payout.getList": h_payout_list,
    "location.getList": h_location_list,
    "waiveOffLateFee.getList": h_waive_list,
    "mobiPackage.getList": h_mobi_list,
    "client.getPermissions": h_client_permissions,
    "client.getClassSubjectMapping": h_class_subject_mapping,
    "client.getFeeTypeStudents": h_client_fee_type_students,
    "feeType.getStudents": h_fee_type_students,
    "client.getMonthWiseBirthdayList": h_birthdays_month,
    "client.getRecentBirthdayList": h_birthdays_recent,
    "client.getSiblings": h_siblings,
    "client.getDailyAttendanceReport": h_daily_attendance_report,
    "client.getFeeCollections": h_fee_collections,
    "client.getFeeCollectionSummary": h_fee_collection_summary,
    "client.getFeeNameWiseSummary": h_fee_name_wise,
    "client.getFeePaymentDetails": h_fee_payment_details,
    "fee.getDetails": h_fee_details,
    # details
    "student.getDetails": h_student_details,
    "student.getResult": h_student_result,
    "student.getAttendance": h_student_attendance_detail,
    "student.getFeeDetails": h_student_fee_details,
    "student.calculateLateFee": h_calculate_late_fee,
    "standard.getDetails": h_standard_details,
    "user.getDetails": h_user_details,
    "user.getPermittedClasses": h_permitted_classes,
    "user.getHomeworkSubjects": h_homework_subjects,
    "classRoom.getResult": h_class_result,
    "classRoom.getAttendance": h_class_attendance,
    "classRoom.getFeeDefaulters": h_class_fee_defaulters,
    "client.getFeeDefaulters": h_fee_defaulters,
    # writes (stub-local)
    "classRoom.markAttendance": h_mark_attendance,
    "notice.add": h_add_notice,
    "homeworkReminder.add": h_add_homework,
}


@app.get("/health")
def health():
    try:
        with db() as con:
            con.execute("SELECT 1")
        return {"ok": True, "db": "connected", "school": SCHOOL_ID}
    except Exception as e:
        return {"ok": False, "error": str(e)[:200]}


@app.post("/api")
async def api(request: Request):
    t0 = time.time()
    try:
        body = await request.json()
    except Exception:
        return JSONResponse(envelope({"message": "Invalid JSON"}))
    name = str(body.get("api") or "")
    handler = HANDLERS.get(name)
    if handler is None:
        return JSONResponse(envelope({"message": "No data found"}))
    try:
        with db() as con:
            profile_id = str(body.get("user_account_id") or "")
            role = caller_role(con, profile_id)
            if role in ("Student", "PARENT") and name in ADMIN_APIS:
                results = deny(name)
            else:
                results = handler(body, con)
    except Exception as e:
        results = {"message": f"stub_error: {str(e)[:200]}"}
    out = envelope(results)
    out["time_taken"] = round(time.time() - t0, 4)
    return JSONResponse(out)


if __name__ == "__main__":
    import uvicorn
    if not DB_URL:
        raise SystemExit("STUB_DB_URL missing (erp-stub/.env)")
    uvicorn.run(app, host="127.0.0.1", port=STUB_PORT)
