---
layout: history.njk
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
    - all
    - webcal-game
permalink: /{{ tag | slugify }}/history/
eleventyComputed:
  title: "{{ tag }} Previous Games"
---
