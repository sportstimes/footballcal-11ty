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
permalink: "{%- assign target = '' -%}{%- for c in competitions -%}{%- if c.title == tag or c.shortTitle == tag -%}{%- assign target = c.path -%}{%- endif -%}{%- endfor -%}{%- if target != '' -%}{{ target }}{%- else -%}/{{ tag | slugify }}/{%- endif -%}"
eleventyComputed:
  title: "{{ tag }} Games"
  noindex: "{% if collections[tag].size < 8 %}true{% endif %}"
  pageDescription: "All {{ tag }} football fixtures — upcoming match dates, kick-off times, TV channels and one-click calendar subscriptions."
---
