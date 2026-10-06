**Skill:** `circular-drafter` (house 3 — Comms). Drafts only; sending stays a human click in the ERP notices/SMS UI.

**Two honesty flags before you read:**
1. ⚠️ **Date check:** you wrote *"Saturday 18 Oct."* In **2026, 18 Oct falls on a Sunday**; 18 Oct was a Saturday in **2025**. I've used your literal "Sat 18 Oct" as instructed, but **please confirm the year** — I won't silently fix a date.
2. **Venue** wasn't in your brief, so I left a bracketed placeholder `[Venue]` rather than invent one (skill rule: never invent venues).

---

## 1) Parent Circular — English

> **[School Name]**
> *[Address Line]*
>
> **Ref:** [Circular No.] &nbsp;&nbsp;&nbsp;&nbsp; **Date:** [DD/MM/YYYY]
>
> ### CIRCULAR — PARENT–TEACHER MEETING (HALF-YEARLY RESULTS)
>
> **To:** All Parents / Guardians
>
> Dear Parents and Guardians,
>
> This is to inform you that the school will hold a **Parent–Teacher Meeting (PTM)** to discuss the **Half-Yearly examination results** of your ward.
>
> | | |
> |---|---|
> | **Date** | Saturday, 18 October |
> | **Time** | 9:00 AM onwards |
> | **Venue** | [Venue] |
> | **For** | All classes / All parents |
>
> You are requested to kindly **bring your ward's report card** to the meeting. The subject teachers will share your child's performance, strengths and the areas needing attention, and will be glad to answer your questions. Your presence will help us work together for your child's progress.
>
> Kindly make it convenient to attend on time.
>
> With warm regards,
>
> **[Signatory]**
> [Designation]
> [School Name]

---

## 2) SMS — English

> **[School Name]: PTM for Half-Yearly results on Sat 18 Oct at 9 AM. Please bring your ward's report card. - [Signatory]**

**Character count: 117 / 160** ✅ — comfortably under the limit (GSM-7, single segment).

---

## 3) Parent Circular — Hindi (हिंदी)

> **[School Name]**
> *[पता पंक्ति]*
>
> **संदर्भ:** [सूचना संख्या] &nbsp;&nbsp;&nbsp;&nbsp; **दिनांक:** [DD/MM/YYYY]
>
> ### परिपत्र — अभिभावक–शिक्षक बैठक (अर्धवार्षिक परिणाम)
>
> **प्रति:** सभी अभिभावक / अभिभावकगण
>
> प्रिय अभिभावकगण,
>
> आपको सूचित किया जाता है कि विद्यालय आपके बच्चे के **अर्धवार्षिक परीक्षा परिणाम** पर चर्चा करने हेतु **अभिभावक–शिक्षक बैठक (PTM)** आयोजित कर रहा है।
>
> | | |
> |---|---|
> | **दिनांक** | शनिवार, 18 अक्टूबर |
> | **समय** | प्रातः 9:00 बजे से |
> | **स्थान** | [Venue] |
> | **किसके लिए** | सभी कक्षाएँ / सभी अभिभावक |
>
> कृपया बैठक में अपने बच्चे का **रिपोर्ट कार्ड अवश्य लाएँ**। विषय-शिक्षक आपके बच्चे के प्रदर्शन, उसकी शक्तियों तथा सुधार आवश्यक विषयों की जानकारी देंगे और आपके प्रश्नों का उत्तर देने में प्रसन्न होंगे। आपकी उपस्थिति आपके बच्चे की प्रगति में सहायक होगी।
>
> कृपया समय पर पधारने का कष्ट करें।
>
> सादर,
>
> **[Signatory]**
> [पदनाम]
> [School Name]

---

## 4) SMS — Hindi (हिंदी)

> **[School Name]: अर्धवार्षिक परिणाम हेतु अभिभावक-शिक्षक बैठक शनिवार 18 अक्टूबर, प्रातः 9 बजे। कृपया रिपोर्ट कार्ड लाएँ। - [Signatory]**

**Character count: 131 / 160** ✅ by character count.
⚠️ **Honest technical caveat:** Hindi (Devanagari) can't be sent as GSM-7 — it's **UCS-2**, where each SMS segment holds only **70 characters**. So a 131-char Hindi SMS will actually be **billed as 2 segments**, even though it's "under 160." If a single segment matters, I can cut it to ≤70 chars — say the word.

---

### Slot verification (skill checklist)
| Slot | Provided? |
|---|---|
| **What** — PTM for Half-Yearly results | ✅ |
| **Who** — all parents / all classes | ✅ |
| **When** — Sat 18 Oct, 9 AM | ✅ *(year to confirm — see flag 1)* |
| **Where** — venue | ⚠️ placeholder `[Venue]` |
| **Action** — bring report cards | ✅ |
| **Contact/signatory** | ⚠️ placeholder `[Signatory]` |

**Nothing was sent or scheduled** — this is a draft for your edit and signature. Also note: no `erp_notice_list` read was available in this session, so the tone is standard-formal, not matched to a past school notice.

Want me to (a) lock the year + fill `[Venue]`, (b) trim the Hindi SMS to a single 70-char segment, or (c) produce a **Marathi/regional** version too?
