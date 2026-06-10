---
layout: games.njk
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
    - all
    - webcal-game
permalink: /{{ tag | slugify }}/
eleventyComputed:
  title: "{{ tag }} Games"
  noindex: "{% if (collections[tag] | length) < 8 %}true{% endif %}"
---
