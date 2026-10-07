"""Smoke test: full login chain against the local stub (and permission gates)."""
import json
import sys
import urllib.request

BASE = "http://127.0.0.1:4010/api"


def post(payload):
    req = urllib.request.Request(BASE, data=json.dumps(payload).encode(),
                                 headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())


def main() -> int:
    u = post({"api": "userAccount.getUserFromUserName", "user_name": "6868686868", "platform": "WEB"})
    print("[1] getUserFromUserName:", u["results"]["message"], "| id:", u["results"]["id"], "| name:", u["results"]["name"])

    lg = post({"api": "userAccount.login", "id": u["results"]["id"], "user_password": "12345",
               "platform": "WEB", "token": ""})
    guid = lg["results"]["guid"]
    print("[2] login:", lg["results"]["message"], "| guid:", (guid or "")[:8] + "…")

    pf = post({"api": "userAccount.getProfiles", "id": "6868686868",
               "logged_in_user_account_id": "6868686868", "platform": "web", "guid": guid})
    profs = pf["results"]["profiles"]
    p0 = profs[0]
    sess = p0["schools"][0]["sessions"][0]
    print("[3] getProfiles:", len(profs), "profile(s) | role:", p0["meta_data"],
          "| school:", p0["schools"][0]["name"], "| session:", sess["session"], "| client_id:", sess["client_id"])

    db = post({"api": "client.getDashboard", "guid": guid, "logged_in_user_account_id": "6868686868",
               "user_account_id": p0["id"], "client_id": sess["client_id"], "platform": "web", "id": sess["client_id"]})
    r = db["results"]
    print("[4] getDashboard: school =", r["school"]["full_name"], "| board =", r["school"]["board"]["name"],
          "| year =", r["year"]["session"], "| sms =", r["sms_b as_balance"] if False else r["sms_balance"]["count"])

    # student gate: admin list must be denied for the student profile
    denied = post({"api": "user.getList", "guid": guid, "logged_in_user_account_id": "6868686868",
                   "user_account_id": p0["id"], "client_id": sess["client_id"], "platform": "web"})
    print("[5] student -> user.getList:", str(denied["results"].get("message"))[:70])

    # principal login
    lg2 = post({"api": "userAccount.login", "id": "9000000031", "user_password": "12345", "platform": "WEB", "token": ""})
    g2 = lg2["results"]["guid"]
    pf2 = post({"api": "userAccount.getProfiles", "id": "9000000031", "logged_in_user_account_id": "9000000031",
                "platform": "web", "guid": g2})
    pp = pf2["results"]["profiles"][0]
    s2 = pp["schools"][0]["sessions"][0]
    ok = post({"api": "user.getList", "guid": g2, "logged_in_user_account_id": "9000000031",
               "user_account_id": pp["id"], "client_id": s2["client_id"], "platform": "web"})
    print("[6] principal -> user.getList: count =", ok["results"].get("count"), "| first:",
          (ok["results"].get("users") or [{}])[0].get("name"))

    cls = post({"api": "classRoom.getList", "guid": g2, "logged_in_user_account_id": "9000000031",
                "user_account_id": pp["id"], "client_id": s2["client_id"], "platform": "web"})
    first_cls = (cls["results"].get("class_rooms") or [{}])[0]
    print("[7] principal -> classRoom.getList: count =", cls["results"].get("count"),
          "| first:", first_cls.get("name"), "| students:", first_cls.get("total_students"))

    res = post({"api": "classRoom.getResult", "guid": g2, "logged_in_user_account_id": "9000000031",
                "user_account_id": pp["id"], "client_id": s2["client_id"], "platform": "web",
                "class_id": first_cls.get("id")})
    rr = res["results"].get("result") or []
    print("[8] classRoom.getResult:", len(rr), "rows | sample:", json.dumps(rr[0])[:110] if rr else "-")
    return 0


if __name__ == "__main__":
    sys.exit(main())
