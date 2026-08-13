# HyperScaleX
### AI-Powered Product Data Enrichment Pipeline
### Unihack Solution — Team Submission

---

## 1. Problem Statement (as given)

Industrial manufacturers manage vast amounts of product information across websites, catalogs, technical documents, and digital assets. Transforming this fragmented, messy data into accurate, structured, commerce-ready product intelligence is complex and time-consuming.

**Our challenge:** build an AI-powered solution that automates the creation, enrichment, and validation of product intelligence from limited product information — and prove it works against a known-correct ground truth.

---

## 2. The Core Idea (In Simple Words)

There's no pre-built catalogue or master list handed to us. So HyperScaleX's real job is: take one messy row (a part number and a rough description), **go find the truth on the internet**, and turn it into a clean, complete, catalogue-ready record.

We do this with a small **team of AI agents**, not one giant prompt — each agent has one job, its own tool, and hands its result to the next agent. An **Orchestrator** sits in the middle, deciding what happens next for each row (including retrying or digging deeper when something's missing).

---

## 3. Final Tool Stack

| Job | Tool | Why This One |
|---|---|---|
| Web Search | **Tavily (Free Tier)** | Purpose-built for AI agents — returns clean, structured search results instead of raw HTML links, 1,000 free searches/month |
| Web Scraping | **Firecrawl (Free Tier)** | Turns any URL straight into clean, LLM-ready Markdown/JSON — no separate HTML-parsing code needed, 1,000 free credits/month |
| LLM Reasoning | **Groq (Free Tier, Llama 3.3 70B)** | Very high free daily request volume (14,400 requests/day), fast responses — good fit for an agent pipeline that needs many LLM calls per row |
| Orchestration Framework | **LangGraph** | Built for exactly our kind of pipeline — agents as nodes, with loops and conditional branches (retry search, dig deeper) |
| Data Validation | **Pydantic** | Forces every agent's output into a strict, checkable shape before passing it to the next agent |
| Local Cache | **SQLite** | Stores every search/scrape result so we never spend free-tier quota re-fetching the same product twice |

**Why free tiers are enough for now:** we cache aggressively (never search or scrape the same product twice) and test on a small sample (10–20 rows) before running the full dataset — this stretches Tavily's and Firecrawl's free monthly quota much further than it looks on paper.

---

## 4. System Design — The Full Agent Architecture

### 4.1 High-Level Agent Flowchart

```mermaid
flowchart TD
    ORCH((Orchestrator Agent<br/>LangGraph — decides what<br/>happens next for each row))

    ORCH --> A1[1. Search Agent<br/>Tavily]
    ORCH --> A2[2. Scraper Agent<br/>Firecrawl]
    ORCH --> A3[3. Classification Agent<br/>Groq]
    ORCH --> A4[4. Attribute Extraction Agent<br/>Groq]
    ORCH --> A5[5. Normalization Engine<br/>plain code]
    ORCH --> A6[6. Deep Search Agent<br/>Tavily + Firecrawl]
    ORCH --> A7[7. Description Generation Agent<br/>Groq]
    ORCH --> A8[8. Validation & Confidence Agent<br/>Groq + rule checks]

    A1 --> A2 --> A3 --> A4 --> A5 --> A6 --> A7 --> A8
```

**In plain words:** the Orchestrator is the manager. It never does the actual work — it just looks at where a row currently is (has a page been found? are attributes still missing?) and tells the right agent to run. Every other box is a specialist that does exactly one job using exactly one tool, then reports back.

---

### 4.2 Agent-by-Agent Design (Each With Its Own Mini Flowchart)

---

#### Agent 1 — Search Agent (Tavily)
**Job in one line:** find the manufacturer's real product page on the web.

```mermaid
flowchart TD
    IN[Input: MPN + rough description] --> Q[Build search query]
    Q --> CALL[Call Tavily search]
    CALL --> CHECK{Confident match<br/>found?}
    CHECK -- Yes --> OUT[Output: manufacturer_url]
    CHECK -- No --> BROADEN[Broaden query:<br/>drop noisy words / try MPN only]
    BROADEN --> CALL
    CHECK -- Failed 3x --> FLAG[Flag row: no source found]
```

**Simple explanation:** it asks Tavily "where does this part number/description live on the web," prefers the manufacturer's own domain over marketplaces (which are excluded), and if the first search doesn't land a confident answer, it tries a simpler version of the query — up to 3 tries — before giving up and flagging the row.

---

#### Agent 2 — Scraper Agent (Firecrawl)
**Job in one line:** turn that URL into clean, usable content.

```mermaid
flowchart TD
    IN[Input: manufacturer_url] --> CALL[Call Firecrawl scrape]
    CALL --> PARSE[Get back clean Markdown/JSON:<br/>spec table, description text,<br/>images, certifications]
    PARSE --> STORE[Cache result in SQLite<br/>so we never re-scrape this URL]
    STORE --> OUT[Output: scraped_content]
```

**Simple explanation:** Firecrawl does the hard part for us — no writing our own HTML parser, no headless browser to manage. It hands back a clean structured object we can read directly. We save it locally right away so if any later step needs it again, we don't spend another Firecrawl credit.

---

#### Agent 3 — Classification Agent (Groq)
**Job in one line:** decide the product's category.

```mermaid
flowchart TD
    IN[Input: scraped_content + description] --> PROMPT[Prompt Groq:<br/>'Classify this product into<br/>Dept → Class → Fine,<br/>using ONLY the text below']
    PROMPT --> RESP[Groq returns category + which<br/>sentence it based the answer on]
    RESP --> CHECK{Grounded in<br/>actual scraped text?}
    CHECK -- Yes --> OUT[Output: category + confidence]
    CHECK -- No --> LOW[Mark as low-confidence,<br/>route to review]
```

**Simple explanation:** it can only classify using words that actually came from the scraped page — not guess from the model's general knowledge. If it can't point to the exact sentence that justifies its answer, we don't trust it, and it goes to review instead.

---

#### Agent 4 — Attribute Extraction Agent (Groq)
**Job in one line:** pull out the actual specs (size, material, voltage, etc.).

```mermaid
flowchart TD
    IN[Input: scraped_content + description] --> SPLIT{Has a structured<br/>spec table?}
    SPLIT -- Yes --> STRUCT[Extract directly<br/>from spec table]
    SPLIT -- No --> FREE[Extract from<br/>free-text description]
    STRUCT --> MERGE[Merge into attribute list<br/>+ tag each with its source]
    FREE --> MERGE
    MERGE --> OUT[Output: raw attribute list]
```

**Simple explanation:** if the manufacturer page has an actual spec table, we trust that over parsing sentences — tables are more reliable. Everything gets tagged with where it came from, which matters later for confidence scoring.

---

#### Agent 5 — Normalization Engine (plain code, not an LLM)
**Job in one line:** clean up units and formatting.

```mermaid
flowchart TD
    IN[Input: raw attribute list] --> UNIT[Convert units to one<br/>standard abbreviation]
    UNIT --> FRAC[Convert fractions ↔ decimals<br/>as needed per field]
    FRAC --> CASE[Fix casing / spacing]
    CASE --> OUT[Output: clean attribute list]
```

**Simple explanation:** this is just rules, not reasoning — "24IN" always becomes "24 in," a fraction always converts the same way. No LLM call needed here, which makes this step free, instant, and 100% consistent every time.

---

#### Agent 6 — Deep Search Agent (Tavily + Firecrawl)
**Job in one line:** hunt harder for anything still missing.

```mermaid
flowchart TD
    IN[Input: list of missing attributes<br/>+ manufacturer domain] --> CHECK{Any attributes<br/>still missing?}
    CHECK -- No --> SKIP[Skip — nothing to do]
    CHECK -- Yes --> SEARCH[Tavily search scoped to<br/>manufacturer domain,<br/>looking for PDF/manual]
    SEARCH --> SCRAPE[Firecrawl scrape the PDF/page]
    SCRAPE --> MERGE[Merge any new values<br/>into attribute list]
    MERGE --> OUT[Output: updated attribute list<br/>+ still-missing flags]
```

**Simple explanation:** only runs if something's actually missing after the normal pass — no wasted API calls otherwise. It searches specifically for spec sheets/manuals on the manufacturer's own site (not the open web), since that's the most likely place to find the missing detail.

---

#### Agent 7 — Description Generation Agent (Groq)
**Job in one line:** write the 5 required catalogue description formats.

```mermaid
flowchart TD
    IN[Input: final attributes + category] --> LOOP[For each of 5 formats:<br/>Invoice / Mobile / Title / Long / Marketing]
    LOOP --> GEN[Generate text using<br/>that format's exact rule]
    GEN --> VALIDATE{Meets length/<br/>format rule?}
    VALIDATE -- No --> REGEN[Regenerate with<br/>stricter instruction]
    REGEN --> VALIDATE
    VALIDATE -- Yes --> OUT[Output: descriptions dict]
```

**Simple explanation:** each format has its own hard rule (e.g., Invoice Desc ≤40 characters, ALL CAPS). We don't just trust the LLM to follow the rule — we check it in code afterward, and if it fails, we ask again with a stricter instruction.

---

#### Agent 8 — Validation & Confidence Agent (Groq + rule checks)
**Job in one line:** score how trustworthy the final record is and flag what needs a human.

```mermaid
flowchart TD
    IN[Input: full record] --> LOOPCHECK[For each field, check its source]
    LOOPCHECK --> HIGH[From structured spec table<br/>→ High confidence]
    LOOPCHECK --> MED[From free scraped text<br/>→ Medium confidence]
    LOOPCHECK --> LOW[Inferred with no source,<br/>or missing → Low confidence]
    HIGH --> AGG[Aggregate into overall_confidence]
    MED --> AGG
    LOW --> AGG
    AGG --> DECIDE{Any required field<br/>is low confidence?}
    DECIDE -- Yes --> FLAG[needs_review = true]
    DECIDE -- No --> DONE[needs_review = false]
    FLAG --> OUT[Output: final scored record]
    DONE --> OUT
```

**Simple explanation:** nothing gets silently trusted. Every field's confidence depends on exactly where it came from, and if anything important is shaky, the whole row gets flagged for a human to check instead of shipping a possibly-wrong record.

---

## 5. Full Pipeline Flow — Sequence View

```mermaid
sequenceDiagram
    participant O as Orchestrator
    participant S as Search Agent (Tavily)
    participant Sc as Scraper Agent (Firecrawl)
    participant C as Classification Agent (Groq)
    participant A as Attribute Extraction Agent (Groq)
    participant N as Normalization Engine
    participant D as Deep Search Agent (Tavily+Firecrawl)
    participant W as Description Agent (Groq)
    participant V as Validation Agent (Groq)

    O->>S: find manufacturer page
    S-->>O: URL or not found
    alt not found after 3 tries
        O->>O: flag row, skip to review
    end
    O->>Sc: scrape page
    Sc-->>O: clean content (cached)
    O->>C: classify category
    C-->>O: dept/class/fine + grounding
    O->>A: extract attributes
    A-->>O: raw attribute list
    O->>N: normalize values
    N-->>O: clean attribute list
    alt attributes still missing
        O->>D: search + scrape deeper
        D-->>O: extra attributes
    end
    O->>W: generate 5 descriptions
    W-->>O: descriptions dict
    O->>V: validate + score confidence
    V-->>O: final record + review flag
```

---

## 6. Caching Layer (Why We Don't Burn Through Free Tiers)

```mermaid
flowchart LR
    REQ[Agent wants to search/scrape] --> CACHE{Already in<br/>SQLite cache?}
    CACHE -- Yes --> RETURN[Return cached result<br/>— 0 API calls used]
    CACHE -- No --> CALL[Call Tavily/Firecrawl]
    CALL --> SAVE[Save result to cache]
    SAVE --> RETURN2[Return result]
```

**Simple explanation:** before any agent spends a Tavily search or a Firecrawl scrape, it checks if we've already fetched that exact thing before. If yes, we reuse it for free. This is what makes a 1,000-credit free tier stretch across dev, testing, and demo runs instead of running out on day one.

---

## 7. Shared Data Object (What Flows Between Every Agent)

```python
class RowState(BaseModel):
    row_id: str
    raw_input: dict                 # original MPN, description, brand fields
    manufacturer_url: str | None
    scraped_content: dict | None    # spec_table, text, images, certs
    category: dict | None           # {dept, class, fine, confidence}
    attributes: list[dict]          # each: {name, value, unit, source, confidence}
    missing_attributes: list[str]
    descriptions: dict              # 5 generated formats
    overall_confidence: float
    needs_review: bool
    review_reason: str | None
```

Every agent reads what it needs from this object and writes its own piece back — this is what LangGraph tracks as the row moves through the graph.

---

## 8. Evaluation Plan (What We Show Judges)

- **Field-level accuracy** — compare final output to ground truth, field by field.
- **Source-found rate** — % of rows where the Search Agent located the real manufacturer page.
- **Attribute completeness** — % of expected attributes actually recovered via scrape/deep-search.
- **Agent-level accuracy** — since each agent is independently testable, we can show per-agent numbers (e.g., "Classification Agent: 91% correct on the labeled set"), not just one end-to-end score.
- **API usage efficiency** — cache hit rate, to show the free-tier stack is actually sustainable at demo scale.

---

## 9. Scope for This Build

- **One fully worked category:** Kitchen & Bath Sink Faucets, so search/scrape/classification behavior can be tuned and validated on a narrow, well-understood product type before generalizing.
- **Full agent pipeline** run on that category, evaluated against the matching ground-truth rows.

---

## 10. Summary

HyperScaleX is a team of 8 specialist agents, coordinated by a LangGraph Orchestrator, built entirely on free-tier tools: **Tavily** to find the real manufacturer source, **Firecrawl** to turn it into clean data, and **Groq** to reason over it — with a local cache so those free tiers actually last through development and the demo. Every field in the final record carries its source and confidence, so nothing is silently guessed, and anything shaky gets flagged for a human instead of shipped as fact.
