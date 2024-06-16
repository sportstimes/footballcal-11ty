---
layout: games.njk
eleventyComputed:
  title: "{{ tag }} Games"
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
    - all
permalink: /{{ tag | slugify }}/
---
