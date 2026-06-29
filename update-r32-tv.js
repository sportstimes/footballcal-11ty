#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const gamesDir = path.join(__dirname, 'src/_content/games/world-cup-2026')

// Confirmed TV data: UK from BBC/ITV official press release, USA from FOX Sports
// Belgium-Senegal and Switzerland-Algeria on FS1; all others on FOX
const r32Channels = {
  'round-of-32-1':  { uk: ['ITV1', 'ITVX'],          us: 'FOX' },   // South Africa v Canada
  'round-of-32-2':  { uk: ['BBC One', 'BBC iPlayer'], us: 'FOX' },   // Germany v Paraguay
  'round-of-32-3':  { uk: ['ITV1', 'ITVX'],          us: 'FOX' },   // Netherlands v Morocco
  'round-of-32-4':  { uk: ['ITV1', 'ITVX'],          us: 'FOX',  regional: ['TV Globo', 'CazéTV', 'SporTV'] }, // Brazil v Japan
  'round-of-32-5':  { uk: ['ITV1', 'ITVX'],          us: 'FOX' },   // France v Sweden
  'round-of-32-6':  { uk: ['BBC One', 'BBC iPlayer'], us: 'FOX' },   // Ivory Coast v Norway
  'round-of-32-7':  { uk: ['ITV1', 'ITVX'],          us: 'FOX' },   // Mexico v Ecuador
  'round-of-32-8':  { uk: ['BBC One', 'BBC iPlayer'], us: 'FOX' },   // England v Congo DR
  'round-of-32-9':  { uk: ['BBC One', 'BBC iPlayer'], us: 'FOX' },   // USA v Bosnia and Herzegovina
  'round-of-32-10': { uk: ['ITV1', 'ITVX'],          us: 'FS1' },   // Belgium v Senegal
  'round-of-32-11': { uk: ['BBC One', 'BBC iPlayer'], us: 'FOX' },   // Portugal v Croatia
  'round-of-32-12': { uk: ['BBC One', 'BBC iPlayer'], us: 'FOX' },   // Spain v Austria
  'round-of-32-13': { uk: ['BBC One', 'BBC iPlayer'], us: 'FS1' },   // Switzerland v Algeria
  'round-of-32-14': { uk: ['ITV1', 'ITVX'],          us: 'FOX',  regional: ['TyC Sports', 'Telefe', 'TV Pública'] }, // Argentina v Cape Verde
  'round-of-32-15': { uk: ['ITV1', 'ITVX'],          us: 'FOX',  regional: ['Caracol TV', 'RCN'] }, // Colombia v Ghana
  'round-of-32-16': { uk: ['BBC One', 'BBC iPlayer'], us: 'FOX' },   // Australia v Egypt
}

const commonChannels = ['Telemundo', 'Peacock', 'TSN', 'CTV', 'RDS', 'DSports']

let updated = 0

for (const [slug, channels] of Object.entries(r32Channels)) {
  const filePath = path.join(gamesDir, `${slug}.md`)
  const content = fs.readFileSync(filePath, 'utf8')
  const tvMatch = content.match(/^tv:\s*\[[^\]]*\]/m)
  if (!tvMatch) { console.warn(`⚠️  No tv field: ${slug}.md`); continue }

  const newTv = [...channels.uk, channels.us, ...commonChannels, ...(channels.regional || [])]
  const newTvStr = `tv: [${newTv.map(ch => `"${ch}"`).join(', ')}]`
  const newContent = content.replace(/^tv:\s*\[[^\]]*\]/m, newTvStr)

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent)
    const title = content.match(/^title: "(.+)"/m)[1]
    console.log(`✅ ${title.padEnd(40)} → ${channels.uk[0]} + ${channels.us}`)
    updated++
  }
}

console.log(`\nDone: ${updated} files updated`)
