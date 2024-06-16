---
layout: games.njk
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
    - all
permalink: /{{ tag | slugify }}/
eleventyComputed:
  title: "{{ tag }} Games"
---
