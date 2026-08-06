---
name: efl-club-calendar
description: Sets up and maintains season-based football club fixture calendars in this footballcal-11ty repo — the /efl/ (English Football League) pattern built for Derby County, distinct from the site's existing tournament model (World Cup, EUROs). Use this whenever the user asks to add a new club's fixture calendar, set up a club (as opposed to tournament) calendar, or add, update, refresh, or correct EFL/Championship/League One/League Two/Carabao Cup/FA Cup fixtures — kickoff times, TV channels, venues, home/away status, or opponents — for any club, even if they just name the club and don't mention "skill" or "EFL" explicitly. Always consult this before touching src/_content/games/, src/_data/competitions.json, teams.js, or venues.js for a club/season fixture, since the frontmatter schema and URL conventions differ from the tournament model documented in CLAUDE.md.
---

# EFL club calendar

This captures the season-based club calendar model built for Derby County
(`src/_content/games/derby-county/`), and how to extend or maintain it. It's a
sibling model to the tournament format in the root `CLAUDE.md` — read that
first for the base content model (frontmatter fields, venues/teams data
files, changelog policy). This skill only covers what's *different* for
season/club calendars.

There are two workflows below. **Work out which one applies before touching
anything** — updates are far cheaper than they look, and the whole point of
this skill is to stop them from being treated like a fresh build every time.

## The two workflows

**A. Adding a brand-new club** — no existing `src/_content/games/<club-theme>/`
directory. Full setup: competition entry, team entries, venue entries, game
files. See "Adding a new club" below.

**B. Updating an existing club** — the directory already exists. This is the
common case: a newly confirmed fixture, a kickoff time moving for TV, a TV
channel being announced, a wrong venue, a score-dependent `lastMeeting`
needing a correction. Treat this as a small, targeted diff, not a rebuild.
See "Updating an existing club" below.

## Content model for club/season fixtures

Same base fields as the tournament model (`title`, `date`, `endDate`,
`locationName`, `path`, `tags`, `tv`, `lastMeeting`/`firstMeeting`) plus two
fields specific to the season model:

```yaml
homeAway: "Home"      # or "Away" — from the tracked club's perspective
competition: "Championship"   # or "Carabao Cup", "FA Cup", "League One", etc.
```

- `title` is always `"Home Team v Away Team"` (real home/away, not the
  tracked club first) — e.g. `"Charlton Athletic v Derby County"` when Derby
  play away.
- `tags` should include the tracked club, the opponent, and the
  `competition` value (e.g. `["Derby County", "Cardiff City", "Championship"]`)
  — each becomes its own aggregate `.ics` feed and hub page for free via the
  existing tag pipeline, no template changes needed.
- **Omit `tv` entirely if channels aren't confirmed yet.** Do not set
  `tv: []` — `IcalTemplate.js` checks `data.tv !== undefined`, so an empty
  array still triggers a "TV Channels: " line with nothing after it in the
  `.ics` description. Add the field later once broadcasters confirm.
- `endDate` — kickoff + 1h50m unless the actual expected finish differs
  (extra time competitions, etc.), same rule as the tournament model.

### Filenames vs URLs (intentionally different order)

- **Filename**: `YYYY-MM-DD-opponent-slug.md` — date first, so files in
  `src/_content/games/<club-theme>/` sort chronologically on disk regardless
  of how many times the two clubs meet in a season.
- **`path` (URL)**: `/efl/<club-theme>/<opponent-slug>-DD-MM-YYYY/` — opponent
  first, UK date suffix. E.g. `/efl/derby-county/cardiff-city-22-08-2026/`.
  This mismatch is deliberate (chronological files, readable club-first
  URLs) — don't "fix" it into matching.

### Nesting under `/efl/`

A club only appears under `/efl/` because its `competitions.json` entry
carries `"section": "English Football League"`:

```json
{
  "title": "<Club> 2026/27",
  "shortTitle": "<Club>",
  "section": "English Football League",
  "theme": "<club-theme>",
  "path": "/efl/<club-theme>/",
  "start": "YYYY-MM-DD",
  "end": "YYYY-MM-DD"
}
```

`src/tags.md`'s permalink already resolves a competition hub page through
this `path` field (falling back to a flat slug for non-competition tags), and
`src/index.njk` / `src/efl.njk` already render anything with this `section`
value automatically. **Adding another club is a pure data change — no
template edits required**, as long as it follows this same shape.

## Adding a new club

1. `src/_data/competitions.json` — add the entry shown above.
2. `src/_data/teams.js` — add an entry for the tracked club, and one for
   each opponent *as their fixtures get added* (don't pre-populate the whole
   division). Needs `colours.primary/secondary`, `description`, `federation`
   (repurposed loosely for club sides — `'EFL'` is fine), and `fifaCode`
   (repurposed as a short club code, e.g. `DER`, `CAR` — falls back to the
   first three letters of the team name if omitted, which is usually fine).
3. `src/_data/venues.js` — add an entry per unique stadium, keyed by the
   exact string used in `locationName`. Needs `stadiumName`, `city`,
   `country`, `capacity`, `description`, `lat`, `lng`.
4. Game files under `src/_content/games/<club-theme>/`, per the naming/path
   rules above.
5. Build and spot check (see "Verifying" below).
6. Changelog entry per `CLAUDE.md` (mandatory, one commit).

## Updating an existing club

The directory, competition entry, and most team/venue data already exist —
don't regenerate them. Minimise the work to match the size of the change:

1. **Locate precisely.** Use `Glob` on
   `src/_content/games/<club-theme>/*.md` or grep the opponent slug/date to
   find the exact file(s) — don't re-read the whole competition to make one
   change.
2. **Edit, don't rewrite.** Use targeted `Edit` calls on just the frontmatter
   keys that changed (kickoff time, `tv`, `homeAway` if a fixture was
   rearranged, `lastMeeting`). Leave everything else in the file untouched.
3. **Only touch shared data files if genuinely new.** A new opponent needs a
   `teams.js` entry; a new stadium needs a `venues.js` entry. A date, time,
   or TV correction on an existing fixture needs neither.
4. **`competitions.json` almost never changes** for an update — only if the
   season's actual start/end date shifts.
5. **Batch it.** If several fixtures need correcting in one pass (e.g. a
   week of kickoff times just got confirmed for TV), find all the affected
   files first, then make all the edits, then do one `npm run build` +
   spot-check at the end — not a rebuild per fixture.
6. **One changelog entry for the batch**, not one per fixture, describing
   what was refreshed and why (e.g. "confirmed TV picks for matchdays 12–14").

## Data sourcing: known reliability problems

This is real, encountered friction from building the Derby County example —
not a hypothetical. Budget for it rather than rediscovering it each time.

**`WebFetch` is blocked for essentially every football data source tried in
this environment**, returning HTTP 403 (this looks like the sandbox's
outbound proxy/egress policy blocking these hosts at the network level, per
`/root/.ccr/README.md` — not a per-site quirk):

- `www.dcfc.co.uk` (club site — both `/fixtures` and specific news articles)
- `www.bbc.co.uk/sport` (tool reports it's simply unable to fetch the host)
- `www.skysports.com` (general fixtures page and team-specific pages)
- `www.espn.co.uk` / `espn.com` team fixture pages
- `fixturedownload.com`
- `www.worldfootball.net`
- `en.wikipedia.org` (including `?action=raw` and the `m.` mobile subdomain)
- `www.wheresthematch.com`
- Reader-proxy passthroughs like `r.jina.ai` (also blocked)

**Don't loop retrying `WebFetch` on sports/news sites here** — one attempt is
enough to confirm it's blocked, then move to `WebSearch`.

**`WebSearch`'s synthesized answers are the only thing that worked, but they
are not reliable enough to trust unverified.** Concrete failure hit while
building Derby County: asked about November/December 2026 fixtures, the
search summary confidently returned actual 2025-26 season fixtures (Boxing
Day 2025, New Year's Day 2026 vs Middlesbrough) while presenting them as the
2026-27 season that was asked about — a season-conflation hallucination, not
a missing-data response. It looked exactly as confident as the correct
answers next to it.

**Working protocol:**

1. Try `WebFetch` once as a cheap check; expect it to fail and move on.
2. Use `WebSearch` with 2-3 differently-phrased queries per fact you need
   (date, opponent, venue, kickoff time are each worth checking).
3. Only write a fact into a game file once **at least two independent
   results agree** — a single search hit, however confident-sounding, is
   provisional.
4. In the final summary to the user, **explicitly separate corroborated
   facts from provisional ones** rather than presenting a full season as
   uniformly certain. It's fine — expected, even — to ship fewer fixtures
   than requested rather than fabricate the rest. The Derby County example
   shipped 3 corroborated fixtures out of a 46-game season for exactly this
   reason.
5. When the user needs high-volume accuracy (a full season in one go),
   **ask them to paste the authoritative fixture list** (e.g. copied
   straight from the club's official fixtures page) rather than trying to
   reconstruct it from search. This sidesteps the network limitation
   entirely and is almost always faster than search-and-verify for 40+ rows.

## Verifying

```bash
npm run build
```

Then check:

- `dist/efl/<club-theme>/index.html` — the club hub page exists
- `dist/efl/<club-theme>/<opponent-DD-MM-YYYY>/index.html` — each game page
- `dist/<club-theme>.ics` — aggregate feed has one `VEVENT` per game
- `dist/<opponent-slug>.ics` and `dist/<competition-slug>.ics` — per-tag
  feeds picked the game up
- Open one game's `.ics` and check the `DESCRIPTION` line doesn't have an
  orphan "TV Channels: " (the `tv: []` bug above)

`npm run lint:js` / `npm run lint:css` are separate from this and only
relevant if template/JS files changed (rare — see "no template edits
required" above).

## Reference implementation

The Derby County build is the working reference for all of the above:

- `src/_content/games/derby-county/*.md` — three game files
- `src/_data/competitions.json` — the Derby County entry
- `src/_data/teams.js` / `venues.js` — the "EFL Championship" sections
- `src/efl.njk` — the `/efl/` landing page
- `src/tags.md` — the permalink logic that nests hub pages under a
  competition's own `path`
- `src/index.njk` — the homepage's EFL block
