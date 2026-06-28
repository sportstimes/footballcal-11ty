---
date: 2026-06-28T00:00:00Z
summary: "Add changelog system to track all site updates made via Claude Code sessions."
commit: ""
---

Introduced a changelog system consisting of a content directory (`src/_content/changelog/`) for per-change Markdown entries, an Eleventy collection, and a public list page at `/changelog/`. A Claude Code Stop hook (`scripts/check-changelog.sh`) warns if a commit is made without an accompanying entry. Instructions added to `CLAUDE.md` make changelog creation mandatory for all future Claude Code sessions.
