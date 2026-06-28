#!/bin/bash
# Runs as a Claude Code Stop hook.
# Warns if the latest commit doesn't include a changelog entry.

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Get files changed in the latest commit
CHANGED=$(git -C "$REPO_ROOT" show --name-only --format="" HEAD 2>/dev/null)

if [ -z "$CHANGED" ]; then
  exit 0
fi

# Check if any changelog file was part of the latest commit
CHANGELOG_IN_COMMIT=$(echo "$CHANGED" | grep "^src/_content/changelog/")

# Check if only changelog files changed (skip in that case)
NON_CHANGELOG=$(echo "$CHANGED" | grep -v "^src/_content/changelog/")

if [ -n "$NON_CHANGELOG" ] && [ -z "$CHANGELOG_IN_COMMIT" ]; then
  echo ""
  echo "⚠️  Changelog reminder: The latest commit does not include a changelog entry."
  echo "   Add a file to src/_content/changelog/ describing this change."
  echo "   See CLAUDE.md for the required frontmatter format."
  echo ""
fi
