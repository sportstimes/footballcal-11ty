---
layout: games.njk
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
    - all
    - webcal-game
    - changelog
    - changelogEntries
    - redirects
permalink: /{{ tag | slugify }}/
eleventyComputed:
  title: "{{ tag }} Games"
  noindex: "{% if collections[tag].size < 8 %}true{% endif %}"
  pageDescription: "All {{ tag }} football fixtures — upcoming match dates, kick-off times, TV channels and one-click calendar subscriptions."
---
