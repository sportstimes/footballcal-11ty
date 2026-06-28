# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

Football Cal ([footballcal.com](https://footballcal.com)) is an Eleventy (11ty) static site that publishes football match details as subscribable iCalendar feeds. Users add calendar URLs directly to their calendar apps (iOS, macOS, Outlook) to get match times, venues, and TV listings automatically synced. Each match also gets an individual `.ics` file and a per-competition `.ics` aggregating all games.

## Commands

```bash
npm run build       # Clean dist/, build 11ty, then compile CSS
npm run dev         # Watch mode: 11ty + PostCSS watching in parallel
npm start           # Dev + browser-sync local server on HTTPS :443
npm run lint:js     # StandardJS linter
npm run lint:js:fix # Auto-fix JS lint issues
npm run lint:css    # Stylelint on src/**/*.css
npm run lint:css:fix
node update-uk-tv-channels.js  # Bulk-update UK TV channels in world-cup-2026 game files
```

Build output goes to `dist/`. Node version is pinned in `.nvmrc` (v18.18.0).

## Architecture

### Content Model

Each match is a Markdown file under `src/_content/games/<competition>/`.

```
---
title: "England v Croatia"
date: 2026-06-17T20:00Z
endDate: 2026-06-17T21:50Z
locationName: "AT&T Stadium, Dallas"
path: /world-cup-2026/england-croatia/
tags: ["England", "Croatia", "Dallas", "Group L", "Group stages", "World Cup 2026"]
tv: ["ITV1", "ITVX", "FOX", "FS1", "Telemundo", "Peacock", "TSN", "CTV", "RDS", "DSports"]
lastMeeting:
  date: "2021-06-13"
  competition: "UEFA Euro 2020 – Group D"
  venue: "Wembley Stadium, London, England"
  score: "1–0"
  winner: "England"
---
Match description text.
```

- `title` must follow `"Team A v Team B"` format — the `v` separator is parsed to look up team colours and FIFA codes from `src/_data/teams.js`.
- `locationName` must exactly match a key in `src/_data/venues.js` to get stadium info and map embed.
- `tags` drive collection filtering. Competition tags must match `title` or `shortTitle` in `src/_data/competitions.json`.
- `tv` is an array of broadcast channel strings rendered on the game page and included in `.ics` description.
- `lastMeeting` / `firstMeeting` are optional and appear in `.ics` descriptions as "Did you know?" facts.
- `path` is the explicit permalink (used instead of Eleventy's default slug).

`src/_content/games/games.11tydata.js` is the directory data file: it sets `layout: 'game.njk'`, applies the `webcal-game` collection tag to every game, and computes `pageDescription` and `competitors` via `eleventyComputed`.

### Data Files (`src/_data/`)

| File | Purpose |
|---|---|
| `competitions.json` | List of competitions with `title`, `shortTitle`, `theme`, `path`, `start`, `end` |
| `teams.js` | Team metadata: `description`, `colours.primary/secondary`, `federation`, `fifaCode` |
| `venues.js` | Venue metadata: `stadiumName`, `city`, `country`, `capacity`, `description`, `lat`, `lng` |
| `config.js` | Runtime config: PostHog keys, AdSense IDs, `baseUrl` (auto-detected from platform env vars) |
| `site.json` | Site title and summary |

### Template Generation (`src/*.11ty.js`)

Eleventy JavaScript templates handle the non-HTML outputs:

- **`webcal-game.11ty.js`** — one `.ics` per game (e.g. `/world-cup-2026/england-croatia.ics`)
- **`webcal.11ty.js`** — one `.ics` per collection/tag (e.g. `/england.ics`, `/world-cup-2026.ics`)
- **`webcal.json.11ty.js`** / **`webcal.rss.11ty.js`** — JSON Feed and RSS per competition
- **`og-images.11ty.js`** — generates 1200×630 OG images at build time using Satori + `@resvg/resvg-js`, with team colours from `teams.js` as the diagonal split background
- **`css.11ty.js`** — emits the CSS path for cache-busting
- **`netlify-redirects.11ty.js`** — generates `_redirects` for Netlify/Cloudflare deployments

iCalendar events are built in `src/_methods/IcalTemplate.js` using the `ics` package. TV channels and last-meeting facts are injected into the `.ics` description field here.

### Filters and Methods (`src/_filters/`, `src/_methods/`)

Custom Eleventy filters registered in `eleventy.config.js`:

- `date` — Luxon-based formatting with ordinal day support (e.g. `1st`, `2nd`)
- `absoluteUrl` — prepend `config.baseUrl`
- `webcal` — convert `https://` URL to `webcal://` for calendar app deep links
- `validTags` — strips tags that are competition titles (keeps only team/city/round tags for "Want more?" links)
- `isPast`, `upcoming`, `limit`, `next` — collection filtering utilities
- `ogImageSlug` — converts a URL path like `/euro-2024/spain-italy/` to `euro-2024-spain-italy` for OG image filenames
- `daysAgo` — calculates days since a date using Luxon

`showDate` (Nunjucks global) compares consecutive games to decide whether to render a date heading separator in list views.

### Deployments

- **Primary**: GitHub Pages via `.github/workflows/deploy.yml` on pushes to `main`
- **Alternative**: Cloudflare Pages (configured in `wrangler.toml`)
- `CNAME` file contains `footballcal.com` and is copied into `dist/` post-build

Environment variables for AdSense slots (`GOOGLE_ADSENSE_PUBLISHER_ID`, `GOOGLE_ADSENSE_SLOT_GAME`, `GOOGLE_ADSENSE_SLOT_COMPETITION`) are injected as GitHub Actions secrets and read via `dotenv` in `src/_data/config.js`.

## Adding a New Competition

1. Add an entry to `src/_data/competitions.json`
2. Create `src/_content/games/<theme>/` directory
3. Add game `.md` files (one per match) following the content model above
4. Add any new venues to `src/_data/venues.js`
5. Add any new teams to `src/_data/teams.js`

## Data Sources

Always use authoritative sources for match data. Preferred sources (in order):

- **FIFA.com** — official match schedules, venues, kick-off times for World Cup
- **UEFA.com** — official schedules and venues for EURO tournaments
- **BBC Sport** (bbc.co.uk/sport) — UK broadcast listings and match details
- **ITV Sport** — UK TV channel confirmations

For TV listings specifically:
- UK: BBC/ITV split announced officially by the broadcasters; confirm per-game assignments from BBC Sport or ITV Sport press releases
- International: FOX/FS1/Telemundo/Peacock (USA), TSN/CTV/RDS (Canada), DSports (Latin America) — verify from official broadcaster announcements

All kick-off times in frontmatter must be in **UTC** (`Z` suffix). Match duration defaults to 1h45m if `endDate` is omitted; set `endDate` explicitly to the expected full-time (plus stoppage time buffer, typically `+1h50m`).

## JavaScript Style

Uses [StandardJS](https://standardjs.com/) — no semicolons, 2-space indent. Run `npm run lint:js:fix` to auto-fix. CSS uses Stylelint with `stylelint-config-standard`.
