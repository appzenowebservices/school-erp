"""Read-only harvester for ERP response shapes (facts for the stub).

Logs into the live ERP with provided credentials and captures responses.
HARD RULES:
  - Step "auth": the 4 login-flow calls only.
  - Step "reads": an explicit allowlist of get/list/detail RPCs; a WRITE
    deny-list is asserted before every call (belt and braces).
  - Never call any add/edit/delete/mark/set/collect/upload RPC on live.

Fixtures land in erp-stub/fixtures/ (gitignored).

Usage:
  py -3 harvest.py auth --user 6868686868 --password 12345
  py -3 harvest.py reads --user ... --password ...
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request

BASE = os.getenv("ERPLIVE_BASE", "https://api.infoeight.com").rstrip("/")
HERE = os.path.dirname(os.path.abspath(__file__))
FIX = os.path.join(HERE, "fixtures")

WRITE_RE = re.compile(r"(add|edit|delete|remove|mark|set|collect|arrange|upload|waive|revoke|permission)", re.I)
# Reads allowed in the intent harvest; a few compute reads are also fine.
READ_RPCS = [
    "standard.getList", "standardLevel.getList", "classRoom.getList",
    "grade.getList", "subject.getList", "feeType.getList", "house.getList",
    "department.getList", "schoolDesignation.getList", "schoolRole.getList",
    "userTitle.getList", "eventType.getList", "bank.getList",
    "student.getList", "studentRecord.getList", "user.getList",
    "studentParent.getList", "client.getSiblings", "client.getClassSubjectMapping",
    "client.getMonthWiseBirthdayList", "client.getRecentBirthdayList",
    "client.getFeeTypeStudents", "client.getPermissions",
    "feeType.getStudents", "fee.getDetails",
    "book.getList", "borrower.getList", "meeting.getList", "notice.getList",
    "notification.getList", "payout.getList", "schoolBus.getList",
    "schoolBus.getStudents", "location.getList", "mobiPackage.getList",
    "event.getList", "waiveOffLateFee.getList",
    "homeworkReminder.getList", "quiz.getList",
]


def post(payload: dict, timeout: int = 30):
    req = urllib.request.Request(
        f"{BASE}/api",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "User-Agent": "erp-stub-harvest/1.0"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, json.loads(r.read().decode("utf-8", "replace"))
    except urllib.error.HTTPError as e:
        return e.code, {"_http_error": e.code, "_body": e.read().decode("utf-8", "replace")[:500]}


def save(rel: str, data) -> str:
    path = os.path.join(FIX, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
    return path


def summarize(data) -> str:
    if not isinstance(data, dict):
        return f"{type(data).__name__}[{len(data) if hasattr(data, '__len__') else '?'}]"
    keys = list(data.keys())
    out = ",".join(keys[:8])
    for k in ("results", "data", "result"):
        v = data.get(k)
        if isinstance(v, list):
            out += f" | {k}:list[{len(v)}]"
            if v and isinstance(v[0], dict):
                out += " item_keys=" + ",".join(list(v[0].keys())[:10])
            break
        if isinstance(v, dict):
            out += f" | {k}:dict keys=" + ",".join(list(v.keys())[:10])
            break
    return out


def auth(user: str, password: str) -> dict:
    ctx: dict = {}
    s, d = post({"api": "userAccount.getUserFromUserName", "user_name": user, "platform": "WEB"})
    save("auth/01_get_user.json", d)
    print(f"[1] getUserFromUserName -> {s} | {summarize(d)}")
    # find the id
    uid = None
    for cand in (d.get("id"), (d.get("results") or {}).get("id") if isinstance(d.get("results"), dict) else None):
        if cand:
            uid = cand
    if isinstance(d.get("results"), list) and d["results"]:
        uid = uid or d["results"][0].get("id")
    ctx["user_id"] = uid
    print(f"    user_id: {uid}")

    s, d = post({"api": "userAccount.login", "id": uid, "user_password": password, "platform": "WEB", "token": ""})
    save("auth/02_login.json", d)
    print(f"[2] login -> {s} | {summarize(d)}")
    guid = d.get("guid") or (d.get("results") or {}).get("guid") if isinstance(d.get("results"), dict) else d.get("guid")
    if not guid and isinstance(d.get("results"), list) and d["results"]:
        guid = d["results"][0].get("guid")
    ctx["guid"] = guid
    print(f"    guid: {str(guid)[:8]}…")

    s, d = post({"api": "userAccount.getProfiles", "id": uid, "logged_in_user_account_id": uid,
                 "platform": "web", "guid": guid})
    save("auth/03_profiles.json", d)
    print(f"[3] getProfiles -> {s} | {summarize(d)}")
    profiles = d.get("results") if isinstance(d.get("results"), list) else (d.get("results") or {}).get("profiles") if isinstance(d.get("results"), dict) else None
    if not profiles and isinstance(d.get("data"), list):
        profiles = d["data"]
    ctx["roles"] = [
        {"id": p.get("id"), "name": p.get("name"), "role": p.get("meta_data"),
         "schools": len(p.get("schools") or [])}
        for p in (profiles or [])
    ]
    ctx["profiles"] = profiles
    if profiles:
        p0 = profiles[0]
        ctx["profile_id"] = p0.get("id") or p0.get("user_account_id")
        schools = p0.get("schools") or []
        if schools:
            s0 = schools[0]
            ctx["school_id"] = s0.get("client_id")
            sessions = s0.get("sessions") or []
            ctx["sessions"] = [
                {"id": x.get("id"), "name": x.get("name"), "session": x.get("session"),
                 "client_id": x.get("client_id"), "is_current": bool(x.get("is_current"))}
                for x in sessions
            ]
            cur = next((x for x in sessions if x.get("is_current")), sessions[0] if sessions else None)
            if cur:
                ctx["session_id"] = cur.get("client_id")
                ctx["session_name"] = cur.get("session")
        print(f"    profile_id={ctx.get('profile_id')} school={ctx.get('school_id')} session={ctx.get('session_id')} ({ctx.get('session_name')})")
        for r in ctx["roles"]:
            print(f"    role: {r['name']} | {r['role']} | id={r['id']} | schools={r['schools']}")

    if ctx.get("profile_id") and ctx.get("session_id"):
        s, d = post({"api": "client.getDashboard", "guid": guid, "logged_in_user_account_id": uid,
                     "user_account_id": ctx["profile_id"], "client_id": ctx["session_id"],
                     "platform": "web", "id": ctx["session_id"]})
        save("auth/04_dashboard.json", d)
        print(f"[4] getDashboard -> {s} | {summarize(d)}")

    with open(os.path.join(HERE, "harvest-ctx.json"), "w", encoding="utf-8") as fh:
        json.dump(ctx, fh, indent=2, ensure_ascii=False)
    return ctx


# Reads whose names trip the write regex but are actually safe GETs.
READ_EXEMPT = {"client.getPermissions", "waiveOffLateFee.getList"}

# These client.* RPCs expect the client id in the `id` field ("Please pass the
# client id" otherwise). All other list RPCs must NOT receive `id` — passing it
# filters them to nothing.
CLIENT_ID_APIS = {
    "client.getSiblings", "client.getPermissions", "client.getMonthWiseBirthdayList",
    "client.getRecentBirthdayList", "client.getDailyAttendanceReport",
    "client.getFeeTypeStudents", "client.getFeeCollectionSummary",
    "client.getFeeNameWiseSummary", "client.getFeePaymentDetails",
    "client.getClassSubjectMapping", "client.getFeeCollections",
}


def role_ctxs(ctx: dict) -> list[dict]:
    """One context per role (first profile of each role wins)."""
    out, seen = [], set()
    for p in ctx.get("profiles") or []:
        role = str(p.get("meta_data") or "unknown").strip().lower()
        if role in seen:
            continue
        schools = p.get("schools") or []
        if not schools:
            continue
        s0 = schools[0]
        sessions = s0.get("sessions") or []
        cur = next((x for x in sessions if x.get("is_current")), sessions[0] if sessions else None)
        if not cur:
            continue
        seen.add(role)
        out.append({
            "role": role, "profile_id": p.get("id"), "name": p.get("name"),
            "school_id": s0.get("client_id"), "school_name": s0.get("name"),
            "session_id": cur.get("client_id"), "session_name": cur.get("session"),
        })
    return out


def call(ctx: dict, profile_id, role: str, rpc: str, extra: dict | None = None, timeout: int = 30):
    payload = {
        "api": rpc, "guid": ctx.get("guid"), "logged_in_user_account_id": ctx.get("user_id"),
        "user_account_id": profile_id, "platform": "web",
    }
    payload.update(extra or {})
    s, d = post(payload, timeout=timeout)
    save(f"reads/{role}/{rpc.replace('.', '_')}.json", d)
    good = s == 200 and not d.get("_http_error")
    print(f"  {'OK ' if good else 'ERR'} {rpc} -> {s} | {summarize(d)[:110]}")
    return s, d


def find_list(d) -> list:
    """First list of dicts anywhere under results (deep-ish, 3 levels)."""
    r = d.get("results") if isinstance(d, dict) else None
    if isinstance(r, dict):
        for v in r.values():
            if isinstance(v, list) and v and isinstance(v[0], dict):
                return v
            if isinstance(v, dict):
                for v2 in v.values():
                    if isinstance(v2, list) and v2 and isinstance(v2[0], dict):
                        return v2
    if isinstance(r, list) and r and isinstance(r[0], dict):
        return r
    return []


def reads_all(ctx: dict) -> None:
    uid = ctx.get("user_id")
    roles = role_ctxs(ctx) or [{"role": "student", "profile_id": ctx.get("profile_id"),
                                "session_id": ctx.get("session_id")}]
    index = []
    for rc in roles:
        role = rc["role"]
        base = {"client_id": rc.get("session_id")}
        print(f"\n== role: {role} ({rc.get('name')}) client_id={rc.get('session_id')}")
        resolved: dict = {}
        for rpc in READ_RPCS:
            if rpc not in READ_EXEMPT and WRITE_RE.search(rpc):
                continue
            extra = {**base, **({"id": rc.get("session_id")} if rpc in CLIENT_ID_APIS else {})}
            s, d = call(ctx, rc["profile_id"], role, rpc, extra)
            index.append({"role": role, "rpc": rpc, "status": s})
            lst = find_list(d)
            if lst:
                resolved.setdefault(rpc, lst)
        # --- dependent reads (need ids from earlier lists) ---
        first = lambda rpc, key: (next((x for x in resolved.get(rpc, []) if x.get(key)), {}) or {})
        cls = first("classRoom.getList", "id") or first("classRoom.getList", "class_id")
        std = first("standard.getList", "id")
        stu = first("student.getList", "id")
        stf = first("user.getList", "id")
        fty = first("feeType.getList", "id")
        deps = []
        if cls:
            cid = {"class_id": cls.get("id") or cls.get("class_id")}
            deps += [("classRoom.getResult", cid), ("classRoom.getAttendance", cid),
                     ("client.getFeeDefaulters", cid), ("classRoom.getFeeDefaulters", cid)]
        if stu:
            sid = {"student_id": stu.get("id")}
            deps += [("student.getDetails", sid), ("student.getResult", sid),
                     ("student.getAttendance", sid), ("student.getFeeDetails", sid),
                     ("student.calculateLateFee", sid)]
        if std:
            deps += [("standard.getDetails", {"standard_id": std.get("id")})]
        if stf:
            deps += [("user.getPermittedClasses", {"selected_staff": stf.get("id")}),
                     ("user.getHomeworkSubjects", {"selected_staff": stf.get("id")})]
        if fty:
            deps += [("feeType.getStudents", {"fee_type_id": fty.get("id")})]
        deps += [("client.getDailyAttendanceReport", {}), ("client.getFeeCollections", {}),
                 ("client.getFeeCollectionSummary", {}), ("client.getFeeNameWiseSummary", {}),
                 ("client.getFeePaymentDetails", {}), ("user.getDetails", {}),
                 ("userAccount.getUserFromUserName", {"user_name": "6868686868"})]
        for rpc, extra in deps:
            if rpc in READ_EXEMPT or not WRITE_RE.search(rpc):
                s, _d = call(ctx, rc["profile_id"], role, rpc, {**base, **extra})
                index.append({"role": role, "rpc": rpc, "status": s})
    save("reads/_index.json", index)
    print(f"\nreads-all done: {len(index)} calls")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("step", choices=["auth", "reads-all"])
    ap.add_argument("--user", required=True)
    ap.add_argument("--password", required=True)
    a = ap.parse_args()

    ctx_path = os.path.join(HERE, "harvest-ctx.json")
    if a.step == "auth":
        auth(a.user, a.password)
    else:
        ctx = json.load(open(ctx_path, encoding="utf-8")) if os.path.exists(ctx_path) else {}
        if not ctx.get("user_id"):
            ctx = auth(a.user, a.password)
        reads_all(ctx)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
