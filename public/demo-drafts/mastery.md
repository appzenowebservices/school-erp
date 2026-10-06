**Skill:** `classroom-analyzer` (house 10). Teacher-eyes-only artifact. **Roll numbers only, no names anywhere** — and since you asked for a *template* (no marks supplied this turn), the buckets below are **blank shells** with the placement rules baked in. I have **not** filled in any student or invented any score.

⚠️ **Honest scope note:** no `erp_class_result` read tool is exposed in this session, so I did **not** pull Class 10-A marks — there's nothing to pull into. This is the *re-usable frame*: one capped read fills it in later. Also: the `my-docs` chunks are all **Physics** chapter content (Light, Human Eye, Electricity, Magnetic Effects), so they legitimately ground the placements + tomorrow's questions — **not UNALIGNED**.

---

# Mastery Map — Template
**Class:** 10-A · **Subject:** Physics · **Run scope:** one capped read (≤1 page) · **Audience:** teacher only
**Source for item-level flags:** `doc_4a563fc9eb3b` (Class 10 Physics Question Bank) · **Fill from:** `erp_class_result` (class_id = 10-A, subject = Physics)

## How to fill it (placement rules — from real marks)
1. Pull **one capped page** of marks for 10-A Physics. Note the **row count** on the map (cost tracking).
2. For each student, compute **% = marks obtained ÷ max marks × 100**.
3. Place each student by the band below. **Ties at a boundary (75.0, 50.0) go to the HIGHER bucket** — never penalise a rounding.
4. Write **only the roll number** (e.g. `R01`) in the bucket table. **Names never leave the teacher channel** and never appear in this artifact.
5. Sanity check: the three bucket counts **must sum to the rows read**.

| Bucket | Band | Roll numbers (fill in) | Count | Class % |
|---|---|---|---|---|
| 🟢 **Mastered** | ≥ 75% | | | |
| 🟡 **Developing** | 50 – 74% | | | |
| 🔴 **Needs support** | < 50% | | | |
| | | **Total** | = rows read | 100% |

> Language rule: say **"support group"**, never "weak students". These are groupings for teaching, not labels on children.

---

## Bucket 1 — 🟢 Mastered (≥ 75%)

**Read:** these students can already apply the chapter. Standing still loses them.
**One reteach move — *extend, don't repeat*:**
> **"Error-hunt the board."** Put one *deliberately wrong* worked example up (e.g. a concave-mirror numerical where the student wrote **f = R** instead of **R = 2f** — a classic misconception). Mastered students must find and correct it, then explain the rule to a neighbour. `[doc_4a563fc9eb3b:0]`

**Worksheet brief (→ `worksheet-quiz-gen`):**
- 6 questions, **all medium→hard**, **no easy fillers**: 2 multi-step numericals (mirror + lens formula with sign convention), 2 ray-diagram constructions, 2 "explain why" (e.g. *why a concave mirror on a dentist's tool magnifies*). 1 harder stretch item drawing on two chapters. No hints, full solutions for self-check.

---

## Bucket 2 — 🟡 Developing (50 – 74%)

**Read:** knows the pieces, slips in application — usually **sign conventions** or picking the right formula.
**One reteach move — *fix the process, not the answer*:**
> **"Sign-first drill."** Hand out 5 numericals where the *only* task is to write **u, v, f with their signs** and name the formula — **no solving**. e.g. concave mirror, object 20 cm in front ⇒ *u = −20 cm, f = −15 cm, 1/v + 1/u = 1/f*. Ten minutes, whole class, then check in pairs. `[doc_4a563fc9eb3b:0]`

**Worksheet brief (→ `worksheet-quiz-gen`):**
- 8 questions: **3 easy warm-ups → 5 medium**. Heavy scaffolding on the first two (formula boxes pre-printed). Include **1 "spot the mistake"** item (wrong sign convention) and **1 two-part** numerical. Answer key with **step marking** so they can self-grade.

---

## Bucket 3 — 🔴 Needs support (< 50%)

**Read:** gaps are foundational — definitions, units, or what a formula *means* — not just arithmetic.
**One reteach move — *shrink and ground it*:**
> **"One idea, one number, real-world anchor."** Teach **one** relation only (e.g. **P = 1/f, f in metres → watts… no, dioptres**, `[doc_4a563fc9eb3b:1]`) with a concrete object in hand: a 25 cm-focus lens ⇒ *P = 1/0.25 = +4 D*. Then 3 identical "same number, different words" questions. Stop when they can say the idea back in their own words — don't race the syllabus.

**Worksheet brief (→ `worksheet-quiz-gen`):**
- 6 questions, **all easy**: 3 recall (state the law / unit / definition), 2 single-step substitution, **1 diagram to label** (mirror: pole, focus, centre of curvature, R = 2f). Large font, one idea per line, worked example at the top, **no tricks**.

---

## 3 questions to ask the class tomorrow
*Diagnostic — everyone answers on paper; read the room, don't grade them.*

1. **Light / refraction:** *"Light is going from air into glass. Does it bend **toward** the normal or **away** from it — and which way does it bend coming back out into air?"* — reveals whether students have the denser/rarer rule or just memorised a sentence. `[doc_4a563fc9eb3b:0]`
2. **Lens power / sign:** *"A convex lens has focal length 25 cm. What is its power — and should the answer be positive or negative? Why?"* — one clean check of **P = 1/f** plus sign meaning; the "why" separates real understanding from a lucky number. `[doc_4a563fc9eb3b:1]`
3. **Magnetic effects:** *"A straight current-carrying wire — what shape are its magnetic field lines, and how do you decide their **direction**?"* — tests field-line shape + the **right-hand thumb rule**, the commonest Ch 4 slip. `[doc_4a563fc9eb3b:3]`

---

### Verification
- **Structure:** three buckets (≥75 / 50–74 / <50) with placement rules, one reteach move each, one worksheet brief each ✔
- **Roll numbers only** — no names in this artifact; the bucket table is keyed to `R__` placeholders ✔
- **Counts sum rule** stated so the filled map self-checks against rows read ✔
- **No invented student data:** template only; zero marks, zero names, no fabricated item-level insight ✔
- **Facts cited:** reteach examples and all 3 questions trace to `doc_4a563fc9eb3b` (`:0` light/refraction, `:1` lens power, `:3` magnetic effects) ✔

**Nothing was saved or published.** This is a blank template for your use. Want me to (a) **fill it in** once you paste Class 10-A marks (or expose a capped `erp_class_result` read), or (b) hand the three worksheet briefs straight to `worksheet-quiz-gen` and produce the actual papers?
