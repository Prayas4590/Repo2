# Unihack — Solution Alignment Review
### Prepared for: Team Lead
### Subject: Where our current solution (HyperScaleX) diverges from what the challenge is asking, and how to close the gap

---

## 1. The One-Line Summary

**What they're asking us to build:** A pipeline that takes one messy raw product line and turns it into a complete, rule-compliant, structured product record — scored against a known-correct answer key.

**What we've currently designed (HyperScaleX):** A chat search upgrade (TurboVec) and a data-monitoring/alerting layer (Product Assurance Engine) that sit on top of an *already-clean* product catalog inside an assumed existing platform ("Unilog HyperScale/CX1").

**The core problem:** Our solution assumes the hard part is already solved. The challenge is specifically testing whether we can do that hard part ourselves.

---

## 2. What The Organizers Actually Gave Us

It helps to separate the file pack into two buckets, because that's exactly how their own guide splits it:

### Bucket A — Things we must PROCESS (the actual test)
| File | What it is |
|---|---|
| Sample-1000_Items.xlsx | 1,000 raw, messy catalogue rows — our test-at-scale input |
| Unilog-Sample_200_Items (Input vs Delivery Format) | **The answer key.** 200 raw rows, each with the fully correct enriched version sitting next to it (252 columns) |

### Bucket B — Things that tell us the RULES (reference material, not to be processed)
| File | What it's for |
|---|---|
| Content Guidelines (docx) | Formulas & char limits for how every field must be written |
| UOM Standards | The one approved way to write every unit (in, ft, V, A, etc.) |
| Decimal↔Fraction table | Converting 0.5 → 1/2 and back |
| Manufacturer & Brand Master List (27,000+ rows) | The exact approved spelling/casing/symbols for every brand |
| LOV (List of Values, ~161,000 rows) | The only allowed attribute values per category — we cannot invent values |
| Faucets_LOV / Fittings_LOV | Two categories fully worked out end-to-end — meant as a "practice category" for us to build against |

**In plain terms:** Bucket A is the exam questions and answer key. Bucket B is the textbook of rules we must follow while answering. Nothing in Bucket B is meant to be a "feature" we build — it's the constraint set our output must obey.

---

## 3. What The Actual Task Flow Looks Like

The organizer's guide gives this exact pipeline (we don't have to do all of it — 2-3 stages done well beats a shallow pass at everything):

```
Input analysis
   → De-duplication
   → Taxonomy & classification (which category does this belong to?)
   → Attribute extraction (pull out size, voltage, material, etc.)
   → Enrichment from manufacturer sources (fill gaps from the real manufacturer site)
   → Cleansing & normalisation (fix units, brand names, fraction/decimal)
   → Description building (write the 5 different description formats)
   → Digital assets (product images, spec sheets)
```

### Worked example straight from their guide (this is literally what "correct" looks like):

**Input (one line):**
```
PDSH4816AF Dishwasher SS - Display Only
```

**Required output (multiple formats, same product, different rules):**
- **Invoice Desc (≤40 char, ALL CAPS):** `DISHWASHER LEG 5 SST 120V 15A 50-1/4IN`
- **Mobile Desc (60–80 char):** `Rheem Manufacturing FRIGIDAIRE, Dishwasher, Professional Series, PDSH4816AF`
- **Product Title:** `FRIGIDAIRE® Professional Series PDSH4816AF Dishwasher With CleanBoost™, Leg Mounting, 5-Wash Cycle, Stainless Steel`
- **Long Description:** full spec-style paragraph with dimensions, sound level, material, etc.
- **Attributes (structured, not prose):** Series = Professional Series; Mounting = Leg; Wash Cycles = 5; Sound Level = 47 dBA …

**The point they're making:** the same one input line has to be rewritten correctly **five separate times**, at five different lengths/formats/casing rules, PLUS broken into 20-50 structured attribute fields — and every value in there has to come from their approved lists, not be invented.

This is 90% of what's being scored.

---

## 4. What HyperScaleX Currently Does

Our current pitch describes:

- **TurboVec** — upgrades product *search* from keyword to semantic/vector matching
- **Product Assurance Engine (PAE)** — periodically re-checks already-enriched product data against the manufacturer's site and flags it if something changed
- **Alert Center / Challenge Input** — UI for a human to review and accept/reject flagged changes
- **My Suppliers / Manufacturer View** — dashboard for tracking data freshness per manufacturer
- All of this wired into an assumed existing chat interface with agents (Commerce Agent, Sales Agent, Quote Retrieval Agent, etc.)

**Important finding:** none of these existing agents, dashboards, or the "HyperScale/CX1" platform are mentioned anywhere in the organizer's brief or solution guide. That appears to be a framing we added ourselves, not something given to us. Judges won't have this context and won't be able to verify or score against it.

---

## 5. The Gap — Side by Side

| | **What They Want** | **What We Built** |
|---|---|---|
| **Core job** | Turn messy raw text into structured, correct product data | Monitor and re-verify data that is *already* structured and correct |
| **Input** | 1 raw line: `Milw 5"x.045"x7/8" Metal Cut Off Disc` | Assumes clean catalog already exists |
| **Output** | Classified category, normalized brand, extracted attributes, 5 description formats | Search results + "data may have changed" alerts |
| **Grading method they gave us** | Match your output against the 200-item ground truth file | No connection to the ground-truth file at all |
| **Where our idea DOES fit** | Their "sourcing rules" section (manufacturer sites only) and "flag data gaps as a strength" advice | This is literally what PAE does — but it's a *small* supporting idea, not the main deliverable |

**In one sentence:** we designed a system to keep good data good — they asked us to build the system that makes bad data good in the first place.

---

## 6. How To Fix This — The Correct Flow We Should Build

Think of it in three layers. Layers 1–2 are what gets scored. Layer 3 is where our existing PAE/TurboVec ideas can legitimately plug in — but only *after* Layers 1–2 exist.

### Layer 1 — Core Enrichment Pipeline (this must exist first)
```
Raw row  →  Clean placeholder brands ("--Unbranded--" = empty, not a value)
         →  Match manufacturer/brand string to the approved 27,000-row master list
         →  Classify into a Dept > Class > Fine category (taxonomy)
         →  Extract attributes from the description text (size, material, voltage...)
         →  Snap each attribute to the closest allowed LOV value (never invent a value)
         →  Normalize units to the approved UOM abbreviation
         →  Convert decimals ↔ fractions where needed
         →  Generate the 5 description formats using the content-guideline formulas
         →  Output one fully structured record
```

### Layer 2 — Evaluation Against Ground Truth (this is what proves we're "aligned")
```
For each of the 200 known-good rows:
   Run our Layer 1 pipeline on the raw input
   Compare our output field-by-field against the Delivery Format answer
   Score: % fields matching, % attribute values found in LOV,
          % of descriptions within their character limits
```
This is the evidence judges are explicitly told to look for.

### Layer 3 — Where Our Existing Ideas Slot In (now genuinely useful, not central)
```
Once Layer 1 produces structured records:
   → PAE can periodically re-check those records against manufacturer sites (sourcing-rule compliant)
   → Flag "needs human review" the way their guide explicitly praises
   → TurboVec can power search over the newly-structured catalog
   → Confidence scores / review flags for imperfect matches
```

**Why this order matters:** Layer 3 without Layer 1 has nothing real to monitor or search. Layer 1 without Layer 3 is still a complete, scorable, demo-able solution on its own. That tells us where our effort should go first.

---

## 7. Recommended Immediate Next Steps

1. **Pick one category to go deep on** — the guide flags Faucets and Fittings as "specified end-to-end," meaning they're the easiest to build and score against.
2. **Hand-trace 3 rows** from the 200-item Input sheet against their Delivery Format sheet, side by side, so we internalize exactly what "correct" looks like before writing any code.
3. **Build the Layer 1 pipeline** for just that one category — even 5–10 fields done correctly (brand, category, 2-3 attributes, one description format) is a legitimate, demonstrable slice.
4. **Score it** against the ground-truth rows and be ready to show the number (e.g., "82% field match, 100% LOV compliance").
5. **Only then**, bring PAE and TurboVec back in as an enhancement layer on top — reframed as "keeping the enriched catalog fresh and searchable," not as the headline pitch.
6. **Drop the "Unilog HyperScale/CX1 already exists" framing** entirely from the pitch — it's not something judges will recognize or credit, and it makes our solution sound like a plug-in for an existing product rather than an answer to the challenge.

---

## 8. Bottom Line for the Team

We built a good idea — but for the wrong assignment. The challenge isn't "make an existing product-data system smarter and safer." It's "prove you can turn one ugly line of text into a clean, correct, rule-following product listing, and show your accuracy against our answer key." Our monitoring/alerting concept is a legitimate bonus feature, but it needs a real enrichment engine underneath it to mean anything to a judge. That engine is the missing piece, and it's what we should prioritize building next.
